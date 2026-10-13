import { expect, test, type Page } from "@playwright/test"
import { waitForPageReady } from "./helpers"

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
    await waitForPageReady(page)
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

  for (const width of [320, 1440]) {
    test(`long in-page links reach their section below the header at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await openWithLenis(page, "/stay")
      await page.getByRole("link", { name: "5-suite Main House", exact: true }).click()
      await expect.poll(() => page.locator("#main-house-stay").evaluate((target) => {
        const header = document.querySelector("header")!
        const gap = target.getBoundingClientRect().top - header.getBoundingClientRect().bottom
        // A link near the page top uses the expanded header offset; the
        // header then shrinks during the trip, leaving a little extra air.
        return gap >= 0 && gap <= 64
      }), { timeout: 10_000 }).toBe(true)
    })
  }

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
