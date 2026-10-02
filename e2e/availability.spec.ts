import { expect, test, type Page } from "@playwright/test"

import { expectTapTarget, waitForPageReady } from "./helpers"

const SAMPLE_AVAILABILITY = {
  ok: true,
  timezone: "America/Belize",
  window: { start: "2026-10-02", end: "2028-04-02" },
  updatedAt: "2026-10-02T18:00:00.000Z",
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
  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-10-02T18:00:00Z"))
  })
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
    await expect(page.locator("#availability")).toContainText("confirm availability personally")
  })

  test("month navigation stays usable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await mockAvailability(page, SAMPLE_AVAILABILITY)
    await page.goto("/book")
    await expect(page.getByTestId("availability-calendar")).toBeVisible()
    await expectTapTarget(page.getByTestId("availability-prev-month"))
    await expectTapTarget(page.getByTestId("availability-next-month"))
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    await page.getByTestId("availability-next-month").click()
    await expect(page.getByTestId("availability-month-label")).toHaveText("November 2026")
  })

  test("never presents past nights or nights beyond the checked window as open", async ({ page }) => {
    await mockAvailability(page, {
      ...SAMPLE_AVAILABILITY,
      window: { start: "2026-10-02", end: "2026-12-15" },
    })
    await page.goto("/book")
    await expect(page.getByTestId("availability-calendar")).toBeVisible()
    await expect(page.getByTestId("availability-prev-month")).toBeDisabled()
    await expect(page.getByTestId("availability-day-villa-2026-10-01")).toHaveAttribute("data-booked", "unknown")
    await goToMonth(page, "December 2026")
    await expect(page.getByTestId("availability-next-month")).toBeDisabled()
    await expect(page.getByTestId("availability-day-villa-2026-12-14")).toHaveAttribute("data-booked", "false")
    await expect(page.getByTestId("availability-day-villa-2026-12-15")).toHaveAttribute("data-booked", "unknown")
  })

  test("refreshes bookings and removes stale dates if the next read fails", async ({ page }) => {
    await page.clock.install({ time: new Date("2026-10-02T18:00:00Z") })
    let reads = 0
    await page.route("**/api/availability", async (route) => {
      reads += 1
      await route.fulfill({
        status: reads >= 3 ? 502 : 200,
        contentType: "application/json",
        body: JSON.stringify(reads >= 3 ? { ok: false } : {
          ...SAMPLE_AVAILABILITY,
          units: {
            ...SAMPLE_AVAILABILITY.units,
            villa: { booked: reads === 1 ? [] : [{ start: "2026-10-10", end: "2026-10-12" }] },
          },
        }),
      })
    })
    await page.goto("/book")
    await expect(page.getByTestId("availability-day-villa-2026-10-10")).toHaveAttribute("data-booked", "false")
    await page.clock.fastForward(120_000)
    await expect(page.getByTestId("availability-day-villa-2026-10-10")).toHaveAttribute("data-booked", "true")
    await page.clock.fastForward(120_000)
    await expect(page.getByTestId("availability-calendar")).toHaveCount(0)
    await expect(page.getByTestId("booking-form-card")).toBeVisible()
  })

  test("rejects incomplete upstream data rather than showing an empty open calendar", async ({ page }) => {
    await mockAvailability(page, { ok: true, units: { villa: { booked: [] } } })
    await page.goto("/book")
    await expect(page.locator("#availability")).toContainText("confirm availability personally")
    await expect(page.getByTestId("availability-calendar")).toHaveCount(0)
  })
})
