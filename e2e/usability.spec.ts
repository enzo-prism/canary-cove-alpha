import { expect, test } from "@playwright/test"

import { CORE_VIEWPORTS, expectTapTarget, waitForPageReady } from "./helpers"

test.describe("usability and responsive resilience", () => {
  test("booking page exposes a live availability embed", async ({ page }) => {
    await page.goto("/book")
    await waitForPageReady(page)

    const iframe = page.getByTestId("booking-calendar-iframe")
    await expect(iframe).toBeVisible()
    await expect(iframe).toHaveAttribute("src", /bookingmood/)
  })

  test("homepage search no-results state still offers a recovery path", async ({ page }) => {
    await page.goto("/")
    await waitForPageReady(page)

    await page.getByTestId("search-open-button").click()
    await page.getByTestId("search-input").fill("zzzz impossible query")
    await expect(page.getByTestId("search-no-results")).toContainText("Try searching for rates")
    await expect(page.getByTestId("search-chip")).toHaveCount(3)
  })

  test("primary mobile actions keep touch-friendly tap targets", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")
    await waitForPageReady(page)

    await expectTapTarget(page.getByRole("button", { name: "Open navigation menu" }))
    await expectTapTarget(page.getByTestId("homepage-primary-cta"))
    await expectTapTarget(page.getByTestId("search-open-button"))
  })

  test("critical routes stay usable while resizing the viewport", async ({ page }) => {
    const checkpoints = [
      { route: "/", locator: page.getByTestId("homepage-intro") },
      { route: "/book", locator: page.getByTestId("booking-form-card") },
      { route: "/contact", locator: page.getByTestId("contact-form-card") },
    ]

    for (const viewport of CORE_VIEWPORTS) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })

      for (const checkpoint of checkpoints) {
        await page.goto(checkpoint.route)
        await waitForPageReady(page)

        await expect(checkpoint.locator).toBeVisible()
        const box = await checkpoint.locator.boundingBox()
        expect(box).not.toBeNull()
        if (!box) continue

        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1)
      }
    }
  })
})
