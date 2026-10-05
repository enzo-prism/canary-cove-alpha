import { expect, test, type Locator, type Page } from "@playwright/test"

import { CORE_VIEWPORTS, waitForPageReady } from "./helpers"

const MIN_HEADING_STACK_GAP = 8

// Vertical padding tokens of the homepage chapters (Section padding="tight":
// py-16 / sm:py-20 / lg:py-24). Measured from computed padding rather than
// descendant boxes so scroll-reveal transforms cannot skew the result.
const HOMEPAGE_RHYTHM = {
  mobile: 64,
  tablet: 80,
  desktop: 96,
} as const

const getGap = async (first: Locator, second: Locator) => {
  const firstBox = await first.boundingBox()
  const secondBox = await second.boundingBox()
  if (!firstBox || !secondBox) {
    throw new Error("Unable to read bounding boxes for spacing check.")
  }
  return secondBox.y - (firstBox.y + firstBox.height)
}

const getSectionMetrics = async (page: Page) => {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll("main > section")).map((section, index) => {
      const rect = section.getBoundingClientRect()
      const style = getComputedStyle(section)
      const hasContent = Array.from(section.querySelectorAll("*")).some((element) => {
        const box = element.getBoundingClientRect()
        const elementStyle = getComputedStyle(element)
        return box.width * box.height > 400 && elementStyle.display !== "none" && elementStyle.visibility !== "hidden"
      })
      return {
        index,
        id: section.id || null,
        left: Math.round(rect.left),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        paddingTop: Math.round(parseFloat(style.paddingTop)),
        paddingBottom: Math.round(parseFloat(style.paddingBottom)),
        hasContent,
      }
    })
  })
}

test.describe("spacing rhythm", () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test("homepage intro keeps breathing room", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("domcontentloaded")
    await page.evaluate(() => document.fonts.ready)

    const headline = page.getByTestId("homepage-intro-heading")
    const subhead = page.getByTestId("homepage-intro-subhead")
    const cta = page.getByTestId("homepage-primary-cta")

    await expect(headline).toBeVisible()
    await expect(subhead).toBeVisible()
    await expect(cta).toBeVisible()

    const gapHeadlineSubhead = await getGap(headline, subhead)
    expect(gapHeadlineSubhead).toBeGreaterThanOrEqual(10)

    // The subhead and CTAs may stack or sit side by side; either way they
    // keep at least 12px of clear space between them.
    const subheadBox = await subhead.boundingBox()
    const ctaBox = await cta.boundingBox()
    if (!subheadBox || !ctaBox) throw new Error("Unable to read intro boxes.")
    const verticalGap = ctaBox.y - (subheadBox.y + subheadBox.height)
    const horizontalGap = ctaBox.x - (subheadBox.x + subheadBox.width)
    expect(Math.max(verticalGap, horizontalGap)).toBeGreaterThanOrEqual(12)
  })

  test("model card stack avoids tight collisions", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("domcontentloaded")
    await page.evaluate(() => document.fonts.ready)

    const title = page.getByTestId("model-title-0")
    const tagline = page.getByTestId("model-tagline-0")
    const summary = page.getByTestId("model-summary-0")
    const stats = page.getByTestId("model-stats-0")
    const cta = page.getByTestId("model-cta-0")

    await title.scrollIntoViewIfNeeded()

    const gapTitleTagline = await getGap(title, tagline)
    const gapTaglineSummary = await getGap(tagline, summary)
    const gapSummaryStats = await getGap(summary, stats)
    const gapStatsCta = await getGap(stats, cta)

    expect(gapTitleTagline).toBeGreaterThanOrEqual(MIN_HEADING_STACK_GAP)
    expect(gapTaglineSummary).toBeGreaterThanOrEqual(10)
    expect(gapSummaryStats).toBeGreaterThanOrEqual(24)
    expect(gapStatsCta).toBeGreaterThanOrEqual(12)
  })
})

test.describe("homepage section rhythm", () => {
  for (const viewport of CORE_VIEWPORTS) {
    test(`${viewport.name} keeps consistent vertical spacing between homepage sections`, async ({ page }) => {
      test.setTimeout(60_000)
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto("/")
      await waitForPageReady(page)

      const sections = await getSectionMetrics(page)
      expect(sections.length).toBeGreaterThanOrEqual(6)

      // The hero is full-bleed photography that fills most of the first screen.
      const hero = sections[0]
      expect(hero.left).toBe(0)
      expect(hero.width).toBeGreaterThanOrEqual(viewport.width - 2)
      expect(hero.height).toBeGreaterThanOrEqual(viewport.height * 0.75)

      const band = HOMEPAGE_RHYTHM[viewport.name]
      for (const section of sections.slice(1)) {
        expect(section.hasContent, `Section ${section.index} (${section.id ?? "no-id"}) renders content.`).toBe(true)
        // The diving-film band runs full bleed into the section above it, so
        // only its bottom edge follows the rhythm.
        if (section.id !== "property-film") {
          expect(section.paddingTop, `Section ${section.index} (${section.id ?? "no-id"}) top padding`).toBe(band)
        }
        expect(section.paddingBottom, `Section ${section.index} (${section.id ?? "no-id"}) bottom padding`).toBe(band)
      }
    })
  }
})
