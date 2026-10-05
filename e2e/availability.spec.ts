import { expect, test, type Page } from "@playwright/test"

import { expectTapTarget, waitForPageReady } from "./helpers"

const SAMPLE_AVAILABILITY = {
  ok: true,
  timezone: "America/Belize",
  window: { start: "2042-02-03", end: "2043-08-05" },
  updatedAt: "2042-02-03T18:00:00.000Z",
  units: {
    villa: {
      booked: [
        { start: "2042-02-11", end: "2042-02-16" },
        { start: "2042-04-19", end: "2042-04-24" },
        { start: "2042-05-04", end: "2042-05-07" },
        { start: "2042-07-18", end: "2042-07-20" },
      ],
    },
    "main-house": {
      booked: [
        { start: "2042-02-11", end: "2042-02-16" },
        { start: "2042-03-07", end: "2042-03-11" },
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
    await page.clock.setFixedTime(new Date("2042-02-03T18:00:00Z"))
  })
  test("shows per-unit booked dates and never names guests", async ({ page }) => {
    await mockAvailability(page, SAMPLE_AVAILABILITY)
    await page.goto("/book")
    await waitForPageReady(page)

    const calendar = page.getByTestId("availability-calendar")
    await expect(calendar).toBeVisible()
    await expect(page.getByTestId("booking-form-card")).toBeVisible()
    await expect(page.locator("iframe[src*='bookingmood']")).toHaveCount(0)
    await expect(calendar).not.toContainText(/Paperkite|Cloudberry|Starfern|Pebblewing|Moonquill|Trip|Departure|pax/i)

    await goToMonth(page, "February 2042")
    await expect(page.getByTestId("availability-day-villa-2042-02-11")).toHaveAttribute("data-booked", "true")
    await expect(page.getByTestId("availability-day-villa-2042-02-15")).toHaveAttribute("data-booked", "true")
    await expect(page.getByTestId("availability-day-villa-2042-02-16")).toHaveAttribute("data-booked", "false")
    await expect(page.getByTestId("availability-day-main-house-2042-02-11")).toHaveAttribute("data-booked", "true")

    await goToMonth(page, "March 2042")
    await expect(page.getByTestId("availability-day-main-house-2042-03-07")).toHaveAttribute("data-booked", "true")
    await expect(page.getByTestId("availability-day-villa-2042-03-07")).toHaveAttribute("data-booked", "false")

    await expect(page.getByTestId("availability-day-main-house-2042-03-10")).toHaveAttribute("data-booked", "true")
    await expect(page.getByTestId("availability-day-main-house-2042-03-11")).toHaveAttribute("data-booked", "false")
    await goToMonth(page, "April 2042")
    await expect(page.getByTestId("availability-day-villa-2042-04-19")).toHaveAttribute("data-booked", "true")
    await expect(page.getByTestId("availability-day-main-house-2042-04-19")).toHaveAttribute("data-booked", "false")
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
    await expect(page.getByTestId("availability-month-label")).toHaveText("March 2042")
  })

  test("never presents past nights or nights beyond the checked window as open", async ({ page }) => {
    await mockAvailability(page, {
      ...SAMPLE_AVAILABILITY,
      window: { start: "2042-02-03", end: "2042-04-05" },
    })
    await page.goto("/book")
    await expect(page.getByTestId("availability-calendar")).toBeVisible()
    await expect(page.getByTestId("availability-prev-month")).toBeDisabled()
    await expect(page.getByTestId("availability-day-villa-2042-02-01")).toHaveAttribute("data-booked", "unknown")
    await goToMonth(page, "April 2042")
    await expect(page.getByTestId("availability-next-month")).toBeDisabled()
    await expect(page.getByTestId("availability-day-villa-2042-04-04")).toHaveAttribute("data-booked", "false")
    await expect(page.getByTestId("availability-day-villa-2042-04-05")).toHaveAttribute("data-booked", "unknown")
  })

  test("refreshes bookings and removes stale dates if the next read fails", async ({ page }) => {
    await page.clock.install({ time: new Date("2042-02-03T18:00:00Z") })
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
            villa: { booked: reads === 1 ? [] : [{ start: "2042-02-09", end: "2042-02-10" }] },
          },
        }),
      })
    })
    await page.goto("/book")
    await expect(page.getByTestId("availability-day-villa-2042-02-09")).toHaveAttribute("data-booked", "false")
    await page.clock.fastForward(120_000)
    await expect(page.getByTestId("availability-day-villa-2042-02-09")).toHaveAttribute("data-booked", "true")
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
