import { expect, test, type Page } from "@playwright/test"

import { waitForPageReady } from "./helpers"

const FORM_API_ROUTE = "**/api/forms"

const futureIsoDate = (daysFromToday: number) => {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + daysFromToday)
  return date.toISOString().slice(0, 10)
}

const ARRIVAL_DATE = futureIsoDate(30)
const DEPARTURE_BEFORE_ARRIVAL = futureIsoDate(29)
const DEPARTURE_AFTER_ARRIVAL = futureIsoDate(35)

const chooseStay = async (page: Page, accommodation: "Villa (1–3 suites)" | "Main House (5 suites)") => {
  await page.getByRole("radio", { name: accommodation }).click()
}

const chooseReturning = async (page: Page, answer: "Yes, I am a returning guest" | "No, this would be my first stay") => {
  await page.getByRole("radio", { name: answer }).click()
}

const fillCoreGuest = async (page: Page) => {
  await page.getByLabel("First Name").fill("Alex")
  await page.getByLabel("Last Name").fill("Martin")
  await page.getByLabel("Phone Number").fill("+1 555 123 1234")
  await page.getByLabel(/^Email Address$/).fill("alex@example.com")
  await page.getByLabel(/^Confirm Email Address$/).fill("alex@example.com")
}

const installAnalyticsRecorder = async (page: Page) => {
  await page.addInitScript(() => {
    const win = window as Window & { __gaEvents?: unknown[][] }
    win.__gaEvents = []
  })
}

const resetAnalyticsEvents = async (page: Page) => {
  await page.evaluate(() => {
    const win = window as Window & {
      __gaEvents?: unknown[][]
      dataLayer?: unknown[]
      gtag?: (...args: unknown[]) => void
    }

    win.__gaEvents = []
    win.dataLayer = []
    win.gtag = (...args: unknown[]) => {
      win.__gaEvents?.push(args)
    }
  })
}

const getGenerateLeadEvents = async (page: Page) =>
  page.evaluate(() => {
    const win = window as Window & { __gaEvents?: unknown[][]; dataLayer?: unknown[] }
    const dataLayerEvents = (win.dataLayer ?? []).map((entry) => {
      if (Array.isArray(entry)) return entry
      if (typeof entry !== "object" || entry === null) return []

      const args = entry as { 0?: unknown; 1?: unknown; 2?: unknown }
      return [args[0], args[1], args[2]]
    })
    const events = [...(win.__gaEvents ?? []), ...dataLayerEvents]

    return events.filter(
      (entry) => Array.isArray(entry) && entry[0] === "event" && entry[1] === "generate_lead",
    )
  })

test.describe("forms and interactive inquiries", () => {
  test("homepage email capture handles success and failure states", async ({ page }) => {
    await page.route(FORM_API_ROUTE, async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
    })

    await installAnalyticsRecorder(page)
    await page.goto("/")
    await waitForPageReady(page)
    await resetAnalyticsEvents(page)

    await page.getByTestId("email-capture-input").fill("guest@example.com")
    await page.getByTestId("email-capture-submit").click()
    await expect(page.getByTestId("email-capture-status")).toContainText("You're on the list")
    await expect.poll(async () => (await getGenerateLeadEvents(page)).length).toBe(1)
    expect(await getGenerateLeadEvents(page)).toEqual([
      ["event", "generate_lead", { form_name: "email_capture", lead_source: "email_capture" }],
    ])

    await resetAnalyticsEvents(page)
    await page.unroute(FORM_API_ROUTE)
    await page.route(FORM_API_ROUTE, async (route) => {
      await route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ ok: false }) })
    })

    await page.getByTestId("email-capture-input").fill("guest@example.com")
    await page.getByTestId("email-capture-submit").click()
    await expect(page.getByTestId("email-capture-status")).toContainText("couldn't save")
    expect(await getGenerateLeadEvents(page)).toEqual([])
  })

  test("contact form handles success and failure states", async ({ page }) => {
    await page.route(FORM_API_ROUTE, async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
    })

    await installAnalyticsRecorder(page)
    await page.goto("/contact")
    await waitForPageReady(page)
    await resetAnalyticsEvents(page)

    await expect(page.getByTestId("contact-tel-gil")).toHaveAttribute("href", "tel:+5016105121")
    await expect(page.getByTestId("contact-mailto")).toHaveAttribute("href", /mailto:canarycove@gmail.com/)

    await page.getByLabel("Name").fill("Alex Martin")
    await page.getByLabel("Email").fill("alex@example.com")
    await page.getByLabel("Message").fill("Planning a milestone trip and looking for the best window in June.")
    await page.getByTestId("contact-submit").click()

    await expect(page.getByTestId("contact-success")).toContainText("Thanks for reaching out")
    await expect.poll(async () => (await getGenerateLeadEvents(page)).length).toBe(1)
    expect(await getGenerateLeadEvents(page)).toEqual([
      ["event", "generate_lead", { form_name: "contact", lead_source: "contact_inquiry" }],
    ])

    await resetAnalyticsEvents(page)
    await page.unroute(FORM_API_ROUTE)
    await page.route(FORM_API_ROUTE, async (route) => {
      await route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ ok: false }) })
    })

    await page.getByRole("button", { name: "Send another message" }).click()
    await page.getByLabel("Name").fill("Alex Martin")
    await page.getByLabel("Email").fill("alex@example.com")
    await page.getByLabel("Message").fill("Checking a second time to make sure failure handling works.")
    await page.getByTestId("contact-submit").click()

    await expect(page.getByTestId("contact-error")).toContainText("Something went wrong")
    await expect(page.getByTestId("contact-error").locator("a[href^='tel:']")).toBeVisible()
    await expect(page.getByTestId("contact-error").locator("a[href^='mailto:']")).toBeVisible()
    expect(await getGenerateLeadEvents(page)).toEqual([])
  })

  test("contact form requires a message and shows in-form errors", async ({ page }) => {
    let formRequests = 0
    await page.route(FORM_API_ROUTE, async (route) => {
      formRequests += 1
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
    })

    await page.goto("/contact")
    await waitForPageReady(page)
    await page.getByTestId("contact-submit").click()

    await expect(page.getByText("Name is required.")).toBeVisible()
    await expect(page.getByText("Email is required.")).toBeVisible()
    await expect(page.getByText("Please add a short note so we know how to help.")).toBeVisible()
    expect(formRequests).toBe(0)
  })

  test("booking form validates email confirmation and travel dates before sending", async ({ page }) => {
    await installAnalyticsRecorder(page)
    await page.goto("/book")
    await waitForPageReady(page)
    await resetAnalyticsEvents(page)

    await page.getByLabel("First Name").fill("Alex")
    await page.getByLabel("Last Name").fill("Martin")
    await page.getByLabel("Phone Number").fill("+1 555 123 1234")
    await page.getByLabel(/^Email Address$/).fill("alex@example.com")
    await page.getByLabel(/^Confirm Email Address$/).fill("mismatch@example.com")
    await page.getByLabel("Preferred Arrival Date").fill(ARRIVAL_DATE)
    await page.getByLabel("Preferred Departure Date").fill(DEPARTURE_BEFORE_ARRIVAL)
    await page.getByLabel("Number of Adult Guests").fill("4")
    await chooseStay(page, "Villa (1–3 suites)")
    await chooseReturning(page, "No, this would be my first stay")
    await page.getByLabel("Message").fill("Would love to celebrate a birthday week with diving and boat days.")
    await page.getByLabel("How did you hear about Canary Cove?").selectOption("google")

    await page.getByTestId("booking-submit").click()
    await expect(page.getByTestId("booking-validation-error")).toContainText("email fields match")
    expect(await getGenerateLeadEvents(page)).toEqual([])

    await page.getByLabel(/^Confirm Email Address$/).fill("alex@example.com")
    await page.getByTestId("booking-submit").click()
    await expect(page.getByTestId("booking-validation-error")).toContainText("Departure date must be after")
    expect(await getGenerateLeadEvents(page)).toEqual([])
  })

  test("booking form requires dates and does not thank guests for nights they never sent", async ({ page }) => {
    let formRequests = 0
    await page.route(FORM_API_ROUTE, async (route) => {
      formRequests += 1
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
    })

    await page.goto("/book")
    await waitForPageReady(page)
    await fillCoreGuest(page)
    await chooseStay(page, "Villa (1–3 suites)")
    await chooseReturning(page, "No, this would be my first stay")
    await page.getByTestId("booking-submit").click()

    await expect(page.getByTestId("booking-validation-error")).toContainText("arrival date and a departure date")
    await expect(page.getByText("Please choose an arrival date.")).toBeVisible()
    await expect(page.getByText("Thanks for sharing your dates")).toHaveCount(0)
    expect(formRequests).toBe(0)
  })

  test("booking form handles success and server failure states", async ({ page }) => {
    await page.route(FORM_API_ROUTE, async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
    })

    await installAnalyticsRecorder(page)
    await page.goto("/book")
    await waitForPageReady(page)
    await resetAnalyticsEvents(page)

    await fillCoreGuest(page)
    await page.getByLabel("Preferred Arrival Date").fill(ARRIVAL_DATE)
    await page.getByLabel("Preferred Departure Date").fill(DEPARTURE_AFTER_ARRIVAL)
    await page.getByLabel("Number of Adult Guests").fill("4")
    await chooseStay(page, "Villa (1–3 suites)")
    await chooseReturning(page, "No, this would be my first stay")
    await page.getByLabel("Message").fill("Looking for a five-night stay with chef dinners and one fishing day.")
    await page.getByLabel("How did you hear about Canary Cove?").selectOption("google")
    await page.getByTestId("booking-submit").click()

    await expect(page.getByTestId("booking-success")).toContainText("Request received")
    await expect(page.getByTestId("booking-success")).toContainText("We’ll confirm availability for")
    await expect.poll(async () => (await getGenerateLeadEvents(page)).length).toBe(1)
    expect(await getGenerateLeadEvents(page)).toEqual([
      ["event", "generate_lead", { form_name: "booking", lead_source: "booking_request" }],
    ])
    await page.getByRole("button", { name: "Send another request" }).click()

    await resetAnalyticsEvents(page)
    await page.unroute(FORM_API_ROUTE)
    await page.route(FORM_API_ROUTE, async (route) => {
      await route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ ok: false }) })
    })

    await fillCoreGuest(page)
    await page.getByLabel("Preferred Arrival Date").fill(ARRIVAL_DATE)
    await page.getByLabel("Preferred Departure Date").fill(DEPARTURE_AFTER_ARRIVAL)
    await page.getByLabel("Number of Adult Guests").fill("4")
    await chooseStay(page, "Villa (1–3 suites)")
    await chooseReturning(page, "No, this would be my first stay")
    await page.getByLabel("Message").fill("Trying again to verify the error state is visible.")
    await page.getByLabel("How did you hear about Canary Cove?").selectOption("google")
    await page.getByTestId("booking-submit").click()

    await expect(page.getByTestId("booking-error")).toContainText("Something went wrong")
    expect(await getGenerateLeadEvents(page)).toEqual([])
  })

  test("qualifies Main House requests as returning-guest only before submit", async ({ page }) => {
    let formRequests = 0
    await page.route(FORM_API_ROUTE, async (route) => {
      formRequests += 1
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
    })

    await page.goto("/book?accommodation=main-house")
    await waitForPageReady(page)
    await expect(page.getByText("separate $10,000 damage deposit")).toBeVisible()

    await chooseReturning(page, "No, this would be my first stay")
    await expect(page.getByTestId("booking-validation-summary")).toContainText("available only to returning Canary Cove guests")
    await expect(page.getByTestId("booking-submit")).toBeDisabled()
    expect(formRequests).toBe(0)
  })

  test("keeps the title and hold copy above the booking fields on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/book")
    await waitForPageReady(page)

    const heading = page.getByRole("heading", { name: "Hold dates for your group", level: 1 })
    const form = page.getByTestId("booking-form-card")
    const headingBox = await heading.boundingBox()
    const formBox = await form.boundingBox()

    expect(headingBox).not.toBeNull()
    expect(formBox).not.toBeNull()
    if (!headingBox || !formBox) return
    expect(headingBox.y).toBeLessThan(formBox.y)
  })
})
