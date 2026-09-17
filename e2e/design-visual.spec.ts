import { expect, test, type Locator } from "@playwright/test"

import { hideDevArtifactsForVisuals, waitForPageReady } from "./helpers"

const expectStableVisual = async (locator: Locator, snapshot: string) => {
  const page = locator.page()
  // Freeze the sticky header's shrink transition: scrolling an element into
  // view can cross the shrink threshold mid-capture, shifting the element box
  // by up to 8px between runs. With transitions off the header snaps to its
  // settled state deterministically.
  await page.addStyleTag({ content: `header, header * { transition: none !important; }` })
  await page.evaluate(() => document.fonts.ready)
  await locator.scrollIntoViewIfNeeded()
  await page.evaluate(() => window.scrollTo(0, Math.round(window.scrollY)))
  await page.waitForTimeout(300)
  await locator.locator("img").evaluateAll(async (images) => {
    await Promise.all(
      images.map(async (image) => {
        const htmlImage = image as HTMLImageElement
        if (!htmlImage.complete) {
          await Promise.race([
            new Promise<void>((resolve) => {
              htmlImage.addEventListener("load", () => resolve(), { once: true })
              htmlImage.addEventListener("error", () => resolve(), { once: true })
            }),
            new Promise<void>((resolve) => setTimeout(resolve, 5_000)),
          ])
        }
        if (htmlImage.naturalWidth > 0) await htmlImage.decode().catch(() => undefined)
      }),
    )
  })
  await expect(locator).toHaveScreenshot(snapshot)
}

test.describe("design baselines", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "Visual baselines are maintained on Chromium.")

  test("homepage hero visual stays visually stable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")
    await waitForPageReady(page)
    await hideDevArtifactsForVisuals(page)

    await expectStableVisual(page.getByTestId("hero-visual"), "home-hero-visual-mobile.png")
  })

  test("homepage hero visual stays visually stable on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto("/")
    await waitForPageReady(page)
    await hideDevArtifactsForVisuals(page)

    await expectStableVisual(page.getByTestId("hero-visual"), "home-hero-visual-desktop.png")
  })

  test("model feature card stays visually stable across breakpoints", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")
    await waitForPageReady(page)
    await hideDevArtifactsForVisuals(page)

    await expectStableVisual(page.getByTestId("model-slide-0"), "model-card-mobile.png")

    await page.setViewportSize({ width: 1280, height: 900 })
    await waitForPageReady(page)
    await hideDevArtifactsForVisuals(page)

    await expectStableVisual(page.getByTestId("model-slide-0"), "model-card-desktop.png")
  })

  test("booking and contact forms keep their intended visual structure", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/book")
    await waitForPageReady(page)
    await hideDevArtifactsForVisuals(page)
    await expectStableVisual(page.getByTestId("booking-form-card"), "booking-form-mobile.png")

    await page.goto("/contact")
    await waitForPageReady(page)
    await hideDevArtifactsForVisuals(page)
    await expectStableVisual(page.getByTestId("contact-form-card"), "contact-form-mobile.png")

    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto("/contact")
    await waitForPageReady(page)
    await hideDevArtifactsForVisuals(page)
    await expectStableVisual(page.getByTestId("contact-form-card"), "contact-form-desktop.png")
  })

  test("gallery cards keep their intended composition", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/experiences")
    await waitForPageReady(page)
    await hideDevArtifactsForVisuals(page)
    await expectStableVisual(page.getByTestId("experiences-gallery-mosaic"), "experiences-gallery-mobile.png")

    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto("/stay")
    await waitForPageReady(page)
    await hideDevArtifactsForVisuals(page)
    await expectStableVisual(page.getByTestId("stay-mini-gallery"), "stay-gallery-desktop.png")
  })
})
