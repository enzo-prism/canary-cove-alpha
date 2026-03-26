import { expect, test } from "@playwright/test"

import { hideDevArtifactsForVisuals, waitForPageReady } from "./helpers"

test.describe("design baselines", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "Visual baselines are maintained on Chromium.")

  test("homepage hero copy stays visually stable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")
    await waitForPageReady(page)
    await hideDevArtifactsForVisuals(page)

    await expect(page.getByTestId("hero-copy")).toHaveScreenshot("home-hero-copy-mobile.png")
  })

  test("homepage hero copy stays visually stable on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto("/")
    await waitForPageReady(page)
    await hideDevArtifactsForVisuals(page)

    await expect(page.getByTestId("hero-copy")).toHaveScreenshot("home-hero-copy-desktop.png")
  })

  test("model feature card stays visually stable across breakpoints", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")
    await waitForPageReady(page)
    await hideDevArtifactsForVisuals(page)

    await expect(page.getByTestId("model-slide-0")).toHaveScreenshot("model-card-mobile.png")

    await page.setViewportSize({ width: 1280, height: 900 })
    await waitForPageReady(page)
    await hideDevArtifactsForVisuals(page)

    await expect(page.getByTestId("model-slide-0")).toHaveScreenshot("model-card-desktop.png")
  })

  test("booking and contact forms keep their intended visual structure", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/book")
    await waitForPageReady(page)
    await hideDevArtifactsForVisuals(page)
    await expect(page.getByTestId("booking-form-card")).toHaveScreenshot("booking-form-mobile.png")

    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto("/contact")
    await waitForPageReady(page)
    await hideDevArtifactsForVisuals(page)
    await expect(page.getByTestId("contact-form-card")).toHaveScreenshot("contact-form-desktop.png")
  })

  test("gallery cards keep their intended composition", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/experiences")
    await waitForPageReady(page)
    await hideDevArtifactsForVisuals(page)
    await expect(page.getByTestId("experiences-gallery-mosaic")).toHaveScreenshot("experiences-gallery-mobile.png")

    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto("/stay")
    await waitForPageReady(page)
    await hideDevArtifactsForVisuals(page)
    await expect(page.getByTestId("stay-mini-gallery")).toHaveScreenshot("stay-gallery-desktop.png")
  })
})
