import { expect, test } from "@playwright/test"

test("hero stays image-first with only a subtle overlay", async ({ page }) => {
  await page.goto("/")
  await page.waitForLoadState("domcontentloaded")

  const hero = page.getByTestId("hero-visual")
  await expect(hero).toBeVisible()
  const rotateIndicator = page.getByTestId("hero-rotate-indicator")
  await expect(rotateIndicator).toBeVisible()

  await expect(hero.getByRole("heading")).toHaveCount(0)
  await expect(hero.getByRole("link")).toHaveCount(0)
  await expect(hero.getByRole("button")).toHaveCount(0)

  const {
    overlayBackground,
    overlayOpacity,
    activeAnimationName,
    activeAnimationDuration,
    initialTransform,
    laterTransform,
  } = await page.evaluate(async () => {
    const overlay = document.querySelector<HTMLElement>('[data-testid="hero-contrast-overlay"]')
    const activeProgress = document.querySelector<HTMLElement>('[data-testid="hero-rotate-indicator"] span > span')
    if (!overlay) {
      throw new Error("Hero overlay missing")
    }
    if (!activeProgress) {
      throw new Error("Hero rotate indicator progress missing")
    }

    const styles = getComputedStyle(overlay)
    const progressStyles = getComputedStyle(activeProgress)
    const initialTransform = progressStyles.transform

    return await new Promise<{
      overlayBackground: string
      overlayOpacity: string
      activeAnimationName: string
      activeAnimationDuration: string
      initialTransform: string
      laterTransform: string
    }>((resolve) => {
      window.setTimeout(() => {
        const laterProgressStyles = getComputedStyle(activeProgress)
        resolve({
          overlayBackground: styles.backgroundImage,
          overlayOpacity: styles.opacity,
          activeAnimationName: progressStyles.animationName,
          activeAnimationDuration: progressStyles.animationDuration,
          initialTransform,
          laterTransform: laterProgressStyles.transform,
        })
      }, 1500)
    })
  })

  expect(overlayBackground).toContain("gradient")
  expect(overlayOpacity).toBe("1")
  expect(activeAnimationName).toBe("hero-slide-progress")
  expect(activeAnimationDuration).toBe("8s")
  expect(laterTransform).not.toBe(initialTransform)
})
