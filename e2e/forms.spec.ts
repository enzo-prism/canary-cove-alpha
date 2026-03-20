import { expect, test } from "@playwright/test"

import { selectRadixOption, waitForPageReady } from "./helpers"

test.describe("forms and interactive inquiries", () => {
  test("homepage email capture handles success and failure states", async ({ page }) => {
    await page.route("https://formspree.io/f/xvzarybk", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
    })

    await page.goto("/")
    await waitForPageReady(page)

    await page.getByTestId("email-capture-input").fill("guest@example.com")
    await page.getByTestId("email-capture-submit").click()
    await expect(page.getByTestId("email-capture-status")).toContainText("You're on the list")

    await page.unroute("https://formspree.io/f/xvzarybk")
    await page.route("https://formspree.io/f/xvzarybk", async (route) => {
      await route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ ok: false }) })
    })

    await page.getByTestId("email-capture-input").fill("guest@example.com")
    await page.getByTestId("email-capture-submit").click()
    await expect(page.getByTestId("email-capture-status")).toContainText("couldn't save")
  })

  test("contact form handles success and failure states", async ({ page }) => {
    await page.route("https://formspree.io/f/xvzarybk", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
    })

    await page.goto("/contact")
    await waitForPageReady(page)

    await page.getByLabel("Name").fill("Alex Martin")
    await page.getByLabel("Email").fill("alex@example.com")
    await page.getByLabel("Message").fill("Planning a milestone trip and looking for the best window in June.")
    await page.getByTestId("contact-submit").click()

    await expect(page.getByTestId("contact-success")).toContainText("Thanks for reaching out")

    await page.unroute("https://formspree.io/f/xvzarybk")
    await page.route("https://formspree.io/f/xvzarybk", async (route) => {
      await route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ ok: false }) })
    })

    await page.getByRole("button", { name: "Send another message" }).click()
    await page.getByLabel("Name").fill("Alex Martin")
    await page.getByLabel("Email").fill("alex@example.com")
    await page.getByLabel("Message").fill("Checking a second time to make sure failure handling works.")
    await page.getByTestId("contact-submit").click()

    await expect(page.getByTestId("contact-error")).toContainText("Something went wrong")
  })

  test("booking form validates email confirmation and travel dates before sending", async ({ page }) => {
    await page.goto("/book")
    await waitForPageReady(page)

    await page.getByLabel("First Name").fill("Alex")
    await page.getByLabel("Last Name").fill("Martin")
    await page.getByLabel("Phone Number").fill("+1 555 123 1234")
    await page.getByLabel(/^Email Address$/).fill("alex@example.com")
    await page.getByLabel(/^Confirm Email Address$/).fill("mismatch@example.com")
    await page.getByLabel("Preferred Arrival Date").fill("2026-06-10")
    await page.getByLabel("Preferred Departure Date").fill("2026-06-08")
    await page.getByLabel("Message").fill("Would love to celebrate a birthday week with diving and boat days.")
    await selectRadixOption(page, "How did you hear about Canary Cove?", "Google")

    await page.getByTestId("booking-submit").click()
    await expect(page.getByTestId("booking-validation-error")).toContainText("email fields match")

    await page.getByLabel(/^Confirm Email Address$/).fill("alex@example.com")
    await page.getByTestId("booking-submit").click()
    await expect(page.getByTestId("booking-validation-error")).toContainText("Departure date must be after")
  })

  test("booking form handles success and server failure states", async ({ page }) => {
    await page.route("https://formspree.io/f/xqeqllek", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
    })

    await page.goto("/book")
    await waitForPageReady(page)

    await page.getByLabel("First Name").fill("Alex")
    await page.getByLabel("Last Name").fill("Martin")
    await page.getByLabel("Phone Number").fill("+1 555 123 1234")
    await page.getByLabel(/^Email Address$/).fill("alex@example.com")
    await page.getByLabel(/^Confirm Email Address$/).fill("alex@example.com")
    await page.getByLabel("Preferred Arrival Date").fill("2026-06-10")
    await page.getByLabel("Preferred Departure Date").fill("2026-06-15")
    await page.getByLabel("Number of Adult Guests").fill("4")
    await page.getByLabel("Message").fill("Looking for a five-night stay with chef dinners and one fishing day.")
    await selectRadixOption(page, "How did you hear about Canary Cove?", "Google")
    await page.getByTestId("booking-submit").click()

    await expect(page.getByRole("alertdialog")).toContainText("Request received")
    await page.getByRole("button", { name: "Got it" }).click()

    await page.unroute("https://formspree.io/f/xqeqllek")
    await page.route("https://formspree.io/f/xqeqllek", async (route) => {
      await route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ ok: false }) })
    })

    await page.getByLabel("First Name").fill("Alex")
    await page.getByLabel("Last Name").fill("Martin")
    await page.getByLabel("Phone Number").fill("+1 555 123 1234")
    await page.getByLabel(/^Email Address$/).fill("alex@example.com")
    await page.getByLabel(/^Confirm Email Address$/).fill("alex@example.com")
    await page.getByLabel("Preferred Arrival Date").fill("2026-06-10")
    await page.getByLabel("Preferred Departure Date").fill("2026-06-15")
    await page.getByLabel("Number of Adult Guests").fill("4")
    await page.getByLabel("Message").fill("Trying again to verify the error state is visible.")
    await selectRadixOption(page, "How did you hear about Canary Cove?", "Google")
    await page.getByTestId("booking-submit").click()

    await expect(page.getByTestId("booking-error")).toContainText("Something went wrong")
  })
})
