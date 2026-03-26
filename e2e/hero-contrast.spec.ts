import { expect, test } from "@playwright/test"

test("hero stays image-first with only a subtle overlay", async ({ page }) => {
  await page.goto("/")
  await page.waitForLoadState("domcontentloaded")

  const hero = page.getByTestId("hero-visual")
  await expect(hero).toBeVisible()

  await expect(hero.getByRole("heading")).toHaveCount(0)
  await expect(hero.getByRole("link")).toHaveCount(0)
  await expect(hero.getByRole("button")).toHaveCount(0)

  const { overlayBackground, overlayOpacity } = await page.evaluate(() => {
    const overlay = document.querySelector<HTMLElement>('[data-testid="hero-contrast-overlay"]')
    if (!overlay) {
      throw new Error("Hero overlay missing")
    }

    const styles = getComputedStyle(overlay)
    return {
      overlayBackground: styles.backgroundImage,
      overlayOpacity: styles.opacity,
    }
  })

  expect(overlayBackground).toContain("gradient")
  expect(overlayOpacity).toBe("1")
})
