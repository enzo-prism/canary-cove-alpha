import { expect, test } from "@playwright/test"
import { waitForPageReady } from "./helpers"

test("hero keeps readable overlay copy and a rotating background", async ({ page }) => {
  await page.goto("/")
  await waitForPageReady(page)

  const hero = page.getByTestId("hero-visual")
  await expect(hero).toBeVisible()
  const rotateIndicator = page.getByTestId("hero-rotate-indicator")
  await expect(rotateIndicator).toBeVisible()

  await expect(hero.getByRole("heading", { level: 1 })).toHaveText("Private estate on Ambergris Caye")
  await expect(hero.getByTestId("homepage-primary-cta")).toBeVisible()
  await expect(hero.getByTestId("homepage-secondary-cta")).toBeVisible()

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
    const activeAnimationName = progressStyles.animationName
    const activeAnimationDuration = progressStyles.animationDuration

    return await new Promise<{
      overlayBackground: string
      overlayOpacity: string
      activeAnimationName: string
      activeAnimationDuration: string
      initialTransform: string
      laterTransform: string
    }>((resolve) => {
      window.setTimeout(() => {
        // Hydration/pause resets replace the countdown node. Inspect the
        // currently displayed countdown rather than a detached old element.
        const currentProgress = document.querySelector<HTMLElement>('[data-testid="hero-rotate-indicator"] span > span')!
        const laterProgressStyles = getComputedStyle(currentProgress)
        resolve({
          overlayBackground: styles.backgroundImage,
          overlayOpacity: styles.opacity,
          activeAnimationName,
          activeAnimationDuration,
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
