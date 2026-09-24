import { expect, test, type Page } from "@playwright/test"

import { waitForPageReady } from "./helpers"

const SAMPLE_AVAILABILITY = {
  ok: true,
  timezone: "America/Belize",
  units: {
    villa: {
      booked: [
        { start: "2026-10-13", end: "2026-10-24" },
        { start: "2026-12-28", end: "2027-01-06" },
        { start: "2027-02-20", end: "2027-02-28" },
        { start: "2027-03-28", end: "2027-04-04" },
      ],
    },
    "main-house": {
      booked: [
        { start: "2026-10-13", end: "2026-10-24" },
        { start: "2026-11-28", end: "2026-12-07" },
      ],
    },
  },
}

const mockAvailability = async (page: Page, body: unknown, status = 200) => {
  await page.route("**/api/availability", async (route) => {
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body),
    })
  })
}

const goToMonth = async (page: Page, label: string) => {
  const labelNode = page.getByTestId("availability-month-label")
  for (let i = 0; i < 24; i += 1) {
    if ((await labelNode.textContent())?.includes(label)) return
    await page.getByTestId("availability-next-month").click()
  }
  for (let i = 0; i < 48; i += 1) {
    if ((await labelNode.textContent())?.includes(label)) return
    await page.getByTestId("availability-prev-month").click()
  }
  throw new Error(`Could not reach month ${label}`)
}

test.describe("booking availability calendar", () => {
  test("shows per-unit booked dates and never names guests", async ({ page }) => {
    await mockAvailability(page, SAMPLE_AVAILABILITY)
    await page.goto("/book")
    await waitForPageReady(page)

    const calendar = page.getByTestId("availability-calendar")
    await expect(calendar).toBeVisible()
    await expect(page.getByTestId("booking-form-card")).toBeVisible()
    await expect(page.locator("iframe[src*='bookingmood']")).toHaveCount(0)
    await expect(calendar).not.toContainText(/Lyn|Saucier|Listwin|Overstreet|Keller|Sonja/i)

    await goToMonth(page, "October 2026")
    await expect(page.getByTestId("availability-day-villa-2026-10-13")).toHaveAttribute("data-booked", "true")
    await expect(page.getByTestId("availability-day-villa-2026-10-23")).toHaveAttribute("data-booked", "true")
    await expect(page.getByTestId("availability-day-villa-2026-10-24")).toHaveAttribute("data-booked", "false")
    await expect(page.getByTestId("availability-day-main-house-2026-10-13")).toHaveAttribute("data-booked", "true")

    await goToMonth(page, "November 2026")
    await expect(page.getByTestId("availability-day-main-house-2026-11-28")).toHaveAttribute("data-booked", "true")
    await expect(page.getByTestId("availability-day-villa-2026-11-28")).toHaveAttribute("data-booked", "false")

    await goToMonth(page, "December 2026")
    await expect(page.getByTestId("availability-day-main-house-2026-12-06")).toHaveAttribute("data-booked", "true")
    await expect(page.getByTestId("availability-day-main-house-2026-12-07")).toHaveAttribute("data-booked", "false")
    await expect(page.getByTestId("availability-day-villa-2026-12-28")).toHaveAttribute("data-booked", "true")
    await expect(page.getByTestId("availability-day-main-house-2026-12-28")).toHaveAttribute("data-booked", "false")
  })

  test("hides the calendar and keeps the request form when availability fails", async ({ page }) => {
    await mockAvailability(page, { ok: false }, 503)
    await page.goto("/book")
    await waitForPageReady(page)

    await expect(page.getByTestId("booking-form-card")).toBeVisible()
    await expect(page.getByTestId("availability-calendar")).toHaveCount(0)
    await expect(page.locator("iframe[src*='bookingmood']")).toHaveCount(0)
  })
})
