import { expect, test, type Locator, type Page } from "@playwright/test"

import { CORE_VIEWPORTS, waitForPageReady } from "./helpers"

const MIN_HEADING_STACK_GAP = 8

const HOMEPAGE_RHYTHM = {
  mobile: {
    introTop: [32, 40],
    introBottom: [60, 72],
    sectionInset: [60, 72],
  },
  tablet: {
    introTop: [40, 48],
    introBottom: [76, 88],
    sectionInset: [76, 88],
  },
  desktop: {
    introTop: [48, 56],
    introBottom: [92, 104],
    sectionInset: [92, 104],
  },
} as const

const getGap = async (first: Locator, second: Locator) => {
  const firstBox = await first.boundingBox()
  const secondBox = await second.boundingBox()
  if (!firstBox || !secondBox) {
    throw new Error("Unable to read bounding boxes for spacing check.")
  }
  return secondBox.y - (firstBox.y + firstBox.height)
}

const getSectionInsets = async (page: Page) => {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll("main > section")).map((section, index) => {
      const sectionRect = section.getBoundingClientRect()

      const descendants = Array.from(section.querySelectorAll("*"))
        .map((element) => {
          const style = getComputedStyle(element)
          const rect = element.getBoundingClientRect()
          const area = rect.width * rect.height

          return {
            top: rect.top,
            bottom: rect.bottom,
            area,
            display: style.display,
            visibility: style.visibility,
            opacity: Number(style.opacity),
          }
        })
        .filter(
          (entry) =>
            entry.area > 400 &&
            entry.display !== "none" &&
            entry.visibility !== "hidden" &&
            entry.opacity !== 0 &&
            entry.bottom > sectionRect.top &&
            entry.top < sectionRect.bottom,
        )

      const firstTop = descendants.length ? Math.min(...descendants.map((entry) => entry.top)) : sectionRect.top
      const lastBottom = descendants.length
        ? Math.max(...descendants.map((entry) => entry.bottom))
        : sectionRect.bottom

      return {
        index,
        id: section.id || null,
        topInset: Math.round(firstTop - sectionRect.top),
        bottomInset: Math.round(sectionRect.bottom - lastBottom),
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
    const gapSubheadCta = await getGap(subhead, cta)

    expect(gapHeadlineSubhead).toBeGreaterThanOrEqual(10)
    expect(gapSubheadCta).toBeGreaterThanOrEqual(12)
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

      const sections = await getSectionInsets(page)
      expect(sections.length).toBeGreaterThanOrEqual(6)

      const hero = sections[0]
      const intro = sections[1]
      const rhythm = HOMEPAGE_RHYTHM[viewport.name]

      expect(hero.topInset).toBe(0)
      expect(hero.bottomInset).toBe(0)

      expect(intro.topInset).toBeGreaterThanOrEqual(rhythm.introTop[0])
      expect(intro.topInset).toBeLessThanOrEqual(rhythm.introTop[1])
      expect(intro.bottomInset).toBeGreaterThanOrEqual(rhythm.introBottom[0])
      expect(intro.bottomInset).toBeLessThanOrEqual(rhythm.introBottom[1])

      for (const section of sections.slice(2)) {
        expect(
          section.topInset,
          `Expected section ${section.index} (${section.id ?? "no-id"}) top inset to stay within the homepage rhythm band.`,
        ).toBeGreaterThanOrEqual(rhythm.sectionInset[0])
        expect(
          section.topInset,
          `Expected section ${section.index} (${section.id ?? "no-id"}) top inset to stay within the homepage rhythm band.`,
        ).toBeLessThanOrEqual(rhythm.sectionInset[1])
        expect(
          section.bottomInset,
          `Expected section ${section.index} (${section.id ?? "no-id"}) bottom inset to stay within the homepage rhythm band.`,
        ).toBeGreaterThanOrEqual(rhythm.sectionInset[0])
        expect(
          section.bottomInset,
          `Expected section ${section.index} (${section.id ?? "no-id"}) bottom inset to stay within the homepage rhythm band.`,
        ).toBeLessThanOrEqual(rhythm.sectionInset[1])
      }
    })
  }
})
