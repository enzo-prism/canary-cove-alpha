import { expect, test, type Locator } from "@playwright/test"

const MIN_HEADING_STACK_GAP = 8

const getGap = async (first: Locator, second: Locator) => {
  const firstBox = await first.boundingBox()
  const secondBox = await second.boundingBox()
  if (!firstBox || !secondBox) {
    throw new Error("Unable to read bounding boxes for spacing check.")
  }
  return secondBox.y - (firstBox.y + firstBox.height)
}

test.describe("spacing rhythm", () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test("hero copy keeps breathing room", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("domcontentloaded")
    await page.evaluate(() => document.fonts.ready)

    const headline = page.getByTestId("hero-headline")
    const subhead = page.getByTestId("hero-subhead")
    const cta = page.getByTestId("hero-cta")

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
