import { expect, test, type Page } from "@playwright/test"

// components/motion/smooth-scroll.tsx skips Lenis for automated browsers, so
// the rest of the suite always runs on native scrolling. These tests opt back
// in (by hiding navigator.webdriver) and drive real wheel input, so a broken
// smooth-scroll setup can never again ship a site that will not scroll.

test.describe("smooth scrolling (Lenis on desktop pointers)", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "Wheel-driven Lenis behavior is verified in Chromium.")
  test.use({ viewport: { width: 1440, height: 900 } })

  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      Object.defineProperty(Navigator.prototype, "webdriver", { get: () => false })
    })
  })

  const openWithLenis = async (page: Page, path: string) => {
    await page.goto(path)
    await page.waitForLoadState("domcontentloaded")
    await expect(page.locator("html")).toHaveClass(/\blenis\b/)
    await page.mouse.move(720, 500)
  }

  for (const path of ["/", "/stay", "/rates", "/gallery", "/privacy"]) {
    test(`wheel scrolls ${path}`, async ({ page }) => {
      await openWithLenis(page, path)
      for (let i = 0; i < 6; i += 1) {
        await page.mouse.wheel(0, 300)
      }
      await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5_000 }).toBeGreaterThan(1200)
    })
  }

  test("a click mid-glide hands control back to programmatic scrolling", async ({ page }) => {
    await openWithLenis(page, "/privacy")
    for (let i = 0; i < 6; i += 1) {
      await page.mouse.wheel(0, 400)
    }
    await page.waitForTimeout(100)
    await page.mouse.down()
    await page.mouse.up()
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }))
    await page.waitForTimeout(1_200)
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
  })

  test("dialogs pause page scrolling and release it on close", async ({ page }) => {
    await openWithLenis(page, "/")
    await page.getByTestId("search-open-button").click()
    await expect(page.getByTestId("search-modal")).toBeVisible()
    await page.mouse.wheel(0, 600)
    await page.waitForTimeout(600)
    expect(await page.evaluate(() => window.scrollY)).toBe(0)

    await page.keyboard.press("Escape")
    await expect(page.getByTestId("search-modal")).toBeHidden()
    await page.mouse.move(720, 500)
    for (let i = 0; i < 4; i += 1) {
      await page.mouse.wheel(0, 300)
    }
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5_000 }).toBeGreaterThan(600)
  })
})
