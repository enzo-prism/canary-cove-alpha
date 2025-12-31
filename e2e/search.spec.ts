import { expect, test, type Page } from "@playwright/test"

const isMac = process.platform === "darwin"

const openSearch = async (page: Page) => {
  await page.goto("/")
  await page.waitForLoadState("domcontentloaded")
  await page.keyboard.press(isMac ? "Meta+K" : "Control+K")
  await expect(page.getByTestId("search-modal")).toBeVisible()
  const input = page.getByTestId("search-input")
  await expect(input).toBeFocused()
  return input
}

test("search modal concierge flow", async ({ page }) => {
  await openSearch(page)

  await expect(page.getByTestId("search-empty")).toBeVisible()
  await expect(page.getByTestId("search-chip")).toHaveCount(3)
  await expect(page.getByTestId("search-question")).toHaveCount(10)

  await page.keyboard.press("Escape")
  await expect(page.getByTestId("search-modal")).toBeHidden()

  await page.keyboard.press(isMac ? "Meta+K" : "Control+K")
  await expect(page.getByTestId("search-modal")).toBeVisible()
  const input = page.getByTestId("search-input")
  await expect(input).toBeFocused()

  await page
    .getByTestId("search-chip")
    .filter({ hasText: /included vs extra costs/i })
    .first()
    .click()

  await expect(input).toHaveValue("included extra costs fees")
  await expect(page.getByTestId("search-answer")).toBeVisible()
  await expect(page.getByTestId("search-item").first()).toBeVisible()

  await input.fill("BZE")
  const answerVisible = await page.getByTestId("search-answer").isVisible().catch(() => false)
  const gettingHereVisible = await page
    .getByTestId("search-item")
    .filter({ hasText: /Getting here/i })
    .first()
    .isVisible()
    .catch(() => false)
  expect(answerVisible || gettingHereVisible).toBeTruthy()

  await input.fill("cancellation")
  await page.keyboard.press("Enter")
  await page.waitForURL(/\/book#cancellation-policy$/)
})

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test("search layout remains usable", async ({ page }) => {
    const input = await openSearch(page)
    await expect(page.getByTestId("search-chip")).toHaveCount(3)
    await input.fill("wifi")
    await expect(page.getByTestId("search-answer")).toBeVisible()
  })
})
