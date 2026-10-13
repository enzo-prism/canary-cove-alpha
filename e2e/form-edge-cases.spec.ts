import { expect, test, type Page } from "@playwright/test"

import { waitForPageReady } from "./helpers"

// A traveler ahead of UTC must still see the actual dates entered for Belize.
test.use({ timezoneId: "Pacific/Auckland" })

async function openDates(page: Page) {
  await page.goto("/book")
  await waitForPageReady(page)
  const card = page.getByTestId("booking-form-card")
  await card.getByText("Villa (1–3 suites)", { exact: true }).click()
  await card.getByText("No, this would be my first stay", { exact: true }).click()
  await page.getByTestId("booking-next").click()
  await expect(page.getByLabel("Preferred Arrival Date")).toBeVisible()
}

async function openFinish(page: Page, email = "alex@example.com") {
  await openDates(page)
  await page.getByLabel("Preferred Arrival Date").fill("2042-02-03")
  await page.getByLabel("Preferred Departure Date").fill("2042-02-05")
  await page.getByTestId("booking-next").click()
  await page.getByLabel("Number of Adult Guests").fill("2")
  await page.getByTestId("booking-next").click()
  await page.getByLabel("First Name").fill("Alexandra")
  await page.getByLabel("Last Name").fill("Martin")
  await page.getByLabel("Phone Number").fill("+1 555 123 1234")
  await page.getByLabel(/^Email Address$/).fill(email)
  await page.getByLabel(/^Confirm Email Address$/).fill(email)
  await page.getByTestId("booking-next").click()
  await expect(page.getByTestId("booking-submit")).toBeVisible()
}

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date("2042-02-04T01:00:00Z"))
  // Every submission is intercepted. These tests never contact lead providers.
  await page.route("**/formspree.io/**", (route) => route.abort())
  await page.route("**/api/forms", (route) => route.abort())
  await page.route("**/api/availability", (route) => route.fulfill({ status: 503, body: "{}" }))
})

test("uses the Belize day and rejects past dates even with custom form validation", async ({ page }) => {
  await openDates(page)
  const arrival = page.getByLabel("Preferred Arrival Date")
  const departure = page.getByLabel("Preferred Departure Date")
  await expect(arrival).toHaveAttribute("min", "2042-02-03")
  await arrival.fill("2042-02-02")
  await departure.fill("2042-02-05")
  await page.getByTestId("booking-next").click()
  await expect(page.getByTestId("booking-validation-error")).toContainText("today or a future date")
  await expect(arrival).toHaveAttribute("aria-describedby", "booking-step-error")
  await arrival.fill("2042-02-03")
  await expect(departure).not.toHaveAttribute("aria-invalid", "true")
  await expect(departure).toHaveAttribute("min", "2042-02-04")
  await page.getByTestId("booking-next").click()
  await expect(page.getByLabel("Number of Adult Guests")).toBeVisible()
})

test("keeps a required returning-guest choice selected when it is clicked again", async ({ page }) => {
  await page.goto("/book")
  await waitForPageReady(page)
  const choice = page.getByRole("radio", { name: "No, this would be my first stay" })
  const label = page.getByTestId("booking-form-card").getByText("No, this would be my first stay", { exact: true })
  await label.click()
  await expect(choice).toBeChecked()
  await label.click()
  await expect(choice).toBeChecked()
})

test("an unsupported date year shows a validation error without crashing the form", async ({ page }) => {
  await openDates(page)
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.getByLabel("Preferred Arrival Date").fill("10000-01-01")
  await page.getByTestId("booking-next").click()
  await expect(page.getByTestId("booking-validation-error")).toContainText("valid arrival")
  expect(errors).toEqual([])
})

test("blocks fractional and exponent party counts before moving on", async ({ page }) => {
  await openDates(page)
  await page.getByTestId("booking-next").click()
  const adults = page.getByLabel("Number of Adult Guests")
  for (const value of ["1.5", "1e2"]) {
    await adults.fill(value)
    await page.getByTestId("booking-next").click()
    await expect(page.getByTestId("booking-validation-error")).toContainText("whole number")
    await expect(adults).toBeVisible()
  }
  await adults.fill("2")
  await page.getByTestId("booking-next").click()
  await expect(page.getByLabel("First Name")).toBeVisible()
})

test("reviews complete dates and long contact details on a narrow phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  const email = `alexandra.${"m".repeat(48)}@example.com`
  await openFinish(page, email)
  const card = page.getByTestId("booking-form-card")
  await expect(card).toContainText("Feb 3, 2042 → Feb 5, 2042 · 2 nights")
  const contact = card.locator("dd").filter({ hasText: email })
  expect(await contact.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true)
  expect(await contact.evaluate((node) => getComputedStyle(node).textOverflow)).not.toBe("ellipsis")
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await card.getByRole("button", { name: "Edit dates" }).click()
  await page.getByLabel("Preferred Departure Date").fill("")
  await page.getByRole("button", { name: "Finish", exact: true }).click()
  await expect(card).toContainText("Arriving Feb 3, 2042 · departure flexible")
})

test("locks an in-flight booking and makes the success dialog usable in a short window", async ({ page }) => {
  let finishResponse: () => void = () => {}
  const responseReady = new Promise<void>((resolve) => { finishResponse = resolve })
  await page.route("**/api/forms", async (route) => {
    await responseReady
    await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' })
  })
  await openFinish(page)
  await page.getByTestId("booking-submit").click()
  await expect(page.getByLabel("Nature of inquiry")).toBeDisabled()
  await expect(page.getByRole("button", { name: "Edit dates" })).toBeDisabled()
  await expect(page.getByRole("button", { name: "Back", exact: true })).toBeDisabled()
  await page.setViewportSize({ width: 667, height: 320 })
  finishResponse()
  const dialog = page.getByRole("alertdialog")
  await expect(dialog).toBeVisible()
  await expect.poll(async () => {
    const bounds = await dialog.boundingBox()
    return Boolean(bounds && bounds.y >= 0 && bounds.y + bounds.height <= 320)
  }).toBe(true)
  await dialog.getByRole("button", { name: "Got it" }).click()
  await expect(dialog).not.toBeVisible()
  await expect(page.locator("#booking-stay-heading")).toBeFocused()
})

test("associates inquiry errors and restores focus after starting another message", async ({ page }) => {
  await page.route("**/api/forms", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }))
  await page.goto("/contact")
  await waitForPageReady(page)
  await page.getByTestId("contact-next").click()
  await expect(page.getByRole("textbox", { name: "Nature of inquiry" })).toHaveAttribute("aria-describedby", /contact-step-error/)
  await page.getByRole("textbox", { name: "Nature of inquiry" }).fill("Synthetic inquiry for a mocked form response.")
  await page.getByTestId("contact-next").click()
  await page.getByLabel("Name", { exact: true }).fill("Alex Martin")
  await page.getByLabel("Email", { exact: true }).fill("alex@example.com")
  await page.getByTestId("contact-submit").click()
  await expect(page.getByTestId("contact-success")).toBeVisible()
  await page.getByRole("button", { name: "Send another message" }).click()
  await expect(page.locator("#contact-message-heading")).toBeFocused()
})
