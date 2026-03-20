import { expect, test } from "@playwright/test"

import { SITE_ROUTES, installErrorCollectors, waitForPageReady } from "./helpers"

test.describe("release gate smoke coverage", () => {
  for (const route of SITE_ROUTES) {
    test(`route ${route} loads cleanly`, async ({ page }) => {
      const issues = installErrorCollectors(page)

      await page.goto(route)
      await waitForPageReady(page)

      await expect(page).toHaveTitle(/Canary Cove|Privacy Policy|Terms of Use/)
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
      await expect(page.locator("#main-content")).toBeVisible()

      issues.assertNoErrors()
    })
  }

  test("desktop navigation and homepage CTAs reach their destinations", async ({ page }) => {
    await page.goto("/")
    await waitForPageReady(page)

    const nav = page.getByRole("navigation", { name: "Primary navigation" })
    await expect(nav).toBeVisible()

    await nav.getByRole("link", { name: "Stay" }).click()
    await expect(page).toHaveURL(/\/stay$/)

    await page.goto("/")
    await waitForPageReady(page)
    await page.getByTestId("hero-cta").click()
    await expect(page).toHaveURL(/\/book$/)

    await page.goto("/")
    await waitForPageReady(page)
    await page.getByRole("link", { name: "See rates" }).first().click()
    await expect(page).toHaveURL(/\/rates$/)
  })

  test("mobile navigation opens, closes, and routes correctly", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")
    await waitForPageReady(page)

    await page.getByRole("button", { name: "Open navigation menu" }).click()
    await expect(page.getByRole("button", { name: "Close navigation menu" })).toBeVisible()

    await page.getByRole("link", { name: "Experience" }).click()
    await expect(page).toHaveURL(/\/experiences$/)

    await page.goto("/")
    await waitForPageReady(page)
    await page.getByRole("button", { name: "Open navigation menu" }).click()
    await page.getByRole("link", { name: "Contact" }).click()
    await expect(page).toHaveURL(/\/contact$/)
  })

  test("footer links resolve, including legal pages", async ({ page }) => {
    await page.goto("/")
    await waitForPageReady(page)

    const privacyLink = page.getByRole("link", { name: "Privacy" }).last()
    await privacyLink.scrollIntoViewIfNeeded()
    await privacyLink.click()
    await expect(page).toHaveURL(/\/privacy$/)

    await page.goto("/")
    await waitForPageReady(page)
    const termsLink = page.getByRole("link", { name: "Terms" }).last()
    await termsLink.scrollIntoViewIfNeeded()
    await termsLink.click()
    await expect(page).toHaveURL(/\/terms$/)
  })

  test("all public routes return a successful status", async ({ request, baseURL }) => {
    for (const route of SITE_ROUTES) {
      const response = await request.get(`${baseURL}${route}`)
      expect.soft(response.ok(), `Expected ${route} to return 2xx.`).toBeTruthy()
    }
  })
})
