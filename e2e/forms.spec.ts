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

const contactCard = (page: Page) => page.getByTestId("contact-form-card")
const bookingCard = (page: Page) => page.getByTestId("booking-form-card")

const completeContactStepOne = async (page: Page, message: string, topic?: string) => {
  if (topic) {
    await contactCard(page).getByText(topic, { exact: true }).click()
  }
  await page.getByRole("textbox", { name: "Message" }).fill(message)
  await page.getByTestId("contact-next").click()
}

const completeContactStepTwo = async (page: Page, name: string, email: string) => {
  await page.getByLabel("Name").fill(name)
  await page.getByLabel("Email").fill(email)
  await page.getByTestId("contact-submit").click()
}

const completeBookingStepOne = async (page: Page, accommodation: string, returningGuest: string) => {
  await bookingCard(page).getByText(accommodation, { exact: true }).click()
  await bookingCard(page).getByText(returningGuest, { exact: true }).click()
  await page.getByTestId("booking-next").click()
}

const completeBookingStepTwo = async (page: Page, arrival: string, departure: string) => {
  await page.getByLabel("Preferred Arrival Date").fill(arrival)
  await page.getByLabel("Preferred Departure Date").fill(departure)
  await page.getByTestId("booking-next").click()
}

const completeBookingStepThree = async (page: Page, adults?: string, children?: string) => {
  if (adults !== undefined) {
    await page.getByLabel("Number of Adult Guests").fill(adults)
  }
  if (children !== undefined) {
    await page.getByLabel("Children under 21 and ages").fill(children)
  }
  await page.getByTestId("booking-next").click()
}

const completeBookingStepFour = async (
  page: Page,
  contact: { firstName: string; lastName: string; phone: string; email: string; confirmEmail: string },
) => {
  await page.getByLabel("First Name").fill(contact.firstName)
  await page.getByLabel("Last Name").fill(contact.lastName)
  await page.getByLabel("Phone Number").fill(contact.phone)
  await page.getByLabel(/^Email Address$/).fill(contact.email)
  await page.getByLabel(/^Confirm Email Address$/).fill(contact.confirmEmail)
  await page.getByTestId("booking-next").click()
}

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

    await completeContactStepOne(page, "Planning a milestone trip and looking for the best window in June.", "Dates & pricing")
    await completeContactStepTwo(page, "Alex Martin", "alex@example.com")

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
    await completeContactStepOne(page, "Checking a second time to make sure failure handling works.")
    await completeContactStepTwo(page, "Alex Martin", "alex@example.com")

    await expect(page.getByTestId("contact-error")).toContainText("Something went wrong")
    expect(await getGenerateLeadEvents(page)).toEqual([])
  })

  test("contact form validates each step before continuing", async ({ page }) => {
    await page.goto("/contact")
    await waitForPageReady(page)

    await page.getByTestId("contact-next").click()
    await expect(page.getByText("Step 1 of 2")).toBeVisible()
    await expect(page.locator("#contact-step-error")).toContainText("what's on your mind")

    await completeContactStepOne(page, "Do you host small weddings?")
    await expect(page.getByText("Step 2 of 2")).toBeVisible()

    await page.getByTestId("contact-submit").click()
    await expect(page.locator("#contact-step-error")).toContainText("enter your name")
  })

  test("booking form validates email confirmation and travel dates before sending", async ({ page }) => {
    await installAnalyticsRecorder(page)
    await page.goto("/book")
    await waitForPageReady(page)
    await resetAnalyticsEvents(page)

    await completeBookingStepOne(page, "Villa (1–3 suites)", "No, this would be my first stay")
    await page.getByLabel("Preferred Arrival Date").fill(ARRIVAL_DATE)
    await page.getByLabel("Preferred Departure Date").fill(DEPARTURE_BEFORE_ARRIVAL)
    await page.getByTestId("booking-next").click()

    await expect(page.getByTestId("booking-validation-error")).toContainText("Departure date must be after")
    expect(await getGenerateLeadEvents(page)).toEqual([])

    await page.getByLabel("Preferred Departure Date").fill(DEPARTURE_AFTER_ARRIVAL)
    await page.getByTestId("booking-next").click()
    await completeBookingStepThree(page)

    await page.getByLabel("First Name").fill("Alex")
    await page.getByLabel("Last Name").fill("Martin")
    await page.getByLabel("Phone Number").fill("+1 555 123 1234")
    await page.getByLabel(/^Email Address$/).fill("alex@example.com")
    await page.getByLabel(/^Confirm Email Address$/).fill("mismatch@example.com")
    await page.getByTestId("booking-next").click()

    await expect(page.getByTestId("booking-validation-error")).toContainText("email fields match")
    expect(await getGenerateLeadEvents(page)).toEqual([])
  })

  test("booking contact step requires identity fields and a valid email", async ({ page }) => {
    await page.goto("/book")
    await waitForPageReady(page)

    await completeBookingStepOne(page, "Villa (1–3 suites)", "No, this would be my first stay")
    await page.getByTestId("booking-next").click()
    await page.getByTestId("booking-next").click()

    await page.getByTestId("booking-next").click()
    await expect(page.getByTestId("booking-validation-error")).toContainText("first name")

    await page.getByLabel("First Name").fill("Alex")
    await page.getByLabel("Last Name").fill("Martin")
    await page.getByTestId("booking-next").click()
    await expect(page.getByTestId("booking-validation-error")).toContainText("phone number")

    await page.getByLabel("Phone Number").fill("+1 555 123 1234")
    await page.getByLabel(/^Email Address$/).fill("not-an-email")
    await page.getByLabel(/^Confirm Email Address$/).fill("not-an-email")
    await page.getByTestId("booking-next").click()
    await expect(page.getByTestId("booking-validation-error")).toContainText("valid email address")
  })

  test("booking form handles success and server failure states", async ({ page }) => {
    await page.route(FORM_API_ROUTE, async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
    })

    await installAnalyticsRecorder(page)
    await page.goto("/book")
    await waitForPageReady(page)
    await resetAnalyticsEvents(page)

    await completeBookingStepOne(page, "Villa (1–3 suites)", "No, this would be my first stay")
    await completeBookingStepTwo(page, ARRIVAL_DATE, DEPARTURE_AFTER_ARRIVAL)
    await completeBookingStepThree(page, "4")
    await completeBookingStepFour(page, {
      firstName: "Alex",
      lastName: "Martin",
      phone: "+1 555 123 1234",
      email: "alex@example.com",
      confirmEmail: "alex@example.com",
    })
    await page.getByLabel("Message").fill("Looking for a five-night stay with chef dinners and one fishing day.")
    await bookingCard(page).getByText("Google", { exact: true }).click()
    await page.getByTestId("booking-submit").click()

    await expect(page.getByRole("alertdialog")).toContainText("Request received")
    await expect.poll(async () => (await getGenerateLeadEvents(page)).length).toBe(1)
    expect(await getGenerateLeadEvents(page)).toEqual([
      ["event", "generate_lead", { form_name: "booking", lead_source: "booking_request" }],
    ])
    await page.getByRole("button", { name: "Got it" }).click()

    await resetAnalyticsEvents(page)
    await page.unroute(FORM_API_ROUTE)
    await page.route(FORM_API_ROUTE, async (route) => {
      await route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ ok: false }) })
    })

    await completeBookingStepOne(page, "Villa (1–3 suites)", "No, this would be my first stay")
    await completeBookingStepTwo(page, ARRIVAL_DATE, DEPARTURE_AFTER_ARRIVAL)
    await completeBookingStepThree(page, "4")
    await completeBookingStepFour(page, {
      firstName: "Alex",
      lastName: "Martin",
      phone: "+1 555 123 1234",
      email: "alex@example.com",
      confirmEmail: "alex@example.com",
    })
    await page.getByLabel("Message").fill("Trying again to verify the error state is visible.")
    await bookingCard(page).getByText("Google", { exact: true }).click()
    await page.getByTestId("booking-submit").click()

    await expect(page.getByTestId("booking-error")).toContainText("Something went wrong")
    expect(await getGenerateLeadEvents(page)).toEqual([])
  })

  test("booking wizard keeps entries when moving back and forth", async ({ page }) => {
    await page.goto("/book")
    await waitForPageReady(page)

    await expect(page.getByText("Step 1 of 5")).toBeVisible()
    await bookingCard(page).getByText("Villa (1–3 suites)", { exact: true }).click()
    await bookingCard(page).getByText("No, this would be my first stay", { exact: true }).click()
    await page.getByTestId("booking-next").click()

    await expect(page.getByText("Step 2 of 5")).toBeVisible()
    await page.getByLabel("Preferred Arrival Date").fill(ARRIVAL_DATE)
    await page.getByRole("button", { name: "Back" }).click()

    await expect(page.getByText("Step 1 of 5")).toBeVisible()
    await expect(page.getByRole("radio", { name: /Villa \(1–3 suites\)/ })).toBeChecked()
    await page.getByTestId("booking-next").click()

    await expect(page.getByLabel("Preferred Arrival Date")).toHaveValue(ARRIVAL_DATE)
  })

  test("qualifies Main House requests as returning-guest only", async ({ page }) => {
    let formRequests = 0
    await page.route(FORM_API_ROUTE, async (route) => {
      formRequests += 1
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
    })

    await page.goto("/book?accommodation=main-house")
    await waitForPageReady(page)

    await expect(page.getByRole("radio", { name: /Main House \(5 suites\)/ })).toBeChecked()
    await bookingCard(page).getByText("No, this would be my first stay", { exact: true }).click()
    await page.getByTestId("booking-next").click()

    await expect(page.getByTestId("booking-validation-summary")).toContainText("available only to returning Canary Cove guests")
    await expect(page.getByText("separate $10,000 damage deposit")).toBeVisible()
    expect(formRequests).toBe(0)
  })
})
