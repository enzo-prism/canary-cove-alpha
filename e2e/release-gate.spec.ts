import { expect, test } from "@playwright/test"

import { SITE_ROUTES, installErrorCollectors, waitForPageReady } from "./helpers"

test.describe("release gate smoke coverage", () => {
  test("publishes the complete repeat-guest Main House terms", async ({ page }) => {
    await page.goto("/rates#main-house-accommodations")
    const mainHouse = page.locator("#main-house-accommodations")

    await expect(mainHouse).toContainText("Repeat guests only")
    await expect(mainHouse).toContainText("5-suite Main House")
    await expect(mainHouse).toContainText("$2,500")
    await expect(mainHouse).toContainText("$3,000")
    await expect(mainHouse).toContainText("$3,600")
    await expect(mainHouse).toContainText("$10,000 damage deposit")
    await expect(mainHouse.getByRole("link", { name: "Request the Main House" })).toHaveAttribute(
      "href",
      "/book?accommodation=main-house",
    )
  })

  test("stay page links to the Main House microsite", async ({ page }) => {
    await page.goto("/stay")
    await waitForPageReady(page)

    await expect(page.getByRole("link", { name: "Main House (5 suites)" })).toHaveAttribute(
      "href",
      "https://mainhouse.canarycove.com",
    )
  })

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
    await page.getByTestId("homepage-primary-cta").click()
    await expect(page).toHaveURL(/\/book$/)

    await page.goto("/")
    await waitForPageReady(page)
    await page.getByTestId("homepage-secondary-cta").click()
    await expect(page).toHaveURL(/\/rates$/)
  })

  test("mobile navigation opens, closes, and routes correctly", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")
    await waitForPageReady(page)

    await page.getByRole("button", { name: "Open navigation menu" }).click()
    await expect(page.getByRole("button", { name: "Close navigation menu" })).toBeVisible()

    await page.getByRole("link", { name: "Experiences" }).click()
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

  test("sitewide guest concierge widget renders from the shared layout", async ({ page }) => {
    for (const route of ["/", "/book"]) {
      await page.goto(route)
      await waitForPageReady(page)

      const conciergeWidget = page.getByTestId("elevenlabs-convai-widget")
      await expect(conciergeWidget).toBeVisible()
      await expect(conciergeWidget).toHaveAttribute("variant", "tiny")
    }
  })

  test("reef encounter films are accessible and load on demand", async ({ page }) => {
    await page.goto("/adventures#reef-encounters")
    await waitForPageReady(page)

    await expect(page.locator("#reef-encounters")).toBeVisible()
    await expect(page.getByRole("heading", { name: "See what waits beyond the dock" })).toBeVisible()

    const videos = page.locator("#reef-encounters video")
    await expect(videos).toHaveCount(3)

    for (let index = 0; index < 3; index += 1) {
      const video = videos.nth(index)
      await expect(video).toHaveAttribute("controls", "")
      await expect(video).toHaveAttribute("playsinline", "")
      await expect(video).toHaveAttribute("preload", index === 0 ? "metadata" : "none")
      await expect(video).toHaveAttribute("tabindex", "0")
      await expect(video).toHaveAttribute("aria-describedby", /-description$/)
      await expect(video).not.toHaveAttribute("autoplay", "")
      await expect(video).toHaveAttribute("poster", /reef-encounters\/.*-poster\.jpg$/)
      await expect(video.locator("source")).toHaveAttribute("src", /reef-encounters\/.*\.mp4$/)
    }

    for (const viewport of [
      { width: 320, height: 700 },
      { width: 375, height: 812 },
      { width: 768, height: 1024 },
      { width: 1024, height: 900 },
      { width: 1440, height: 1000 },
      { width: 1728, height: 1000 },
    ]) {
      await page.setViewportSize(viewport)
      await page.reload()
      await waitForPageReady(page)

      const layout = await page.locator("#reef-encounters").evaluate((section) => {
        const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-testid^='reef-video-card-']"))
        const media = Array.from(section.querySelectorAll<HTMLVideoElement>("video"))

        return {
          viewportWidth: document.documentElement.clientWidth,
          pageScrollWidth: document.documentElement.scrollWidth,
          cards: cards.map((card) => {
            const rect = card.getBoundingClientRect()
            return { left: rect.left, right: rect.right, width: rect.width }
          }),
          mediaRatios: media.map((video) => {
            const rect = video.getBoundingClientRect()
            return rect.width / rect.height
          }),
        }
      })

      expect(layout.pageScrollWidth).toBeLessThanOrEqual(layout.viewportWidth)
      expect(layout.cards).toHaveLength(3)
      for (const card of layout.cards) {
        expect(card.left).toBeGreaterThanOrEqual(0)
        expect(card.right).toBeLessThanOrEqual(layout.viewportWidth)
        expect(card.width).toBeGreaterThan(0)
      }
      for (const ratio of layout.mediaRatios) {
        expect(ratio).toBeGreaterThan(1.76)
        expect(ratio).toBeLessThan(1.79)
      }
    }
  })

  test("all public routes return a successful status", async ({ request, baseURL }) => {
    for (const route of SITE_ROUTES) {
      const response = await request.get(`${baseURL}${route}`)
      expect.soft(response.ok(), `Expected ${route} to return 2xx.`).toBeTruthy()
    }
  })

  test("metadata and AI discovery routes stay canonical", async ({ request, baseURL }) => {
    const sitemapResponse = await request.get(`${baseURL}/sitemap.xml`)
    expect(sitemapResponse.ok()).toBeTruthy()
    expect(sitemapResponse.headers()["content-type"]).toContain("xml")
    const sitemapText = await sitemapResponse.text()
    expect(sitemapText).toContain("<loc>https://www.canarycove.com/stay</loc>")
    expect(sitemapText).toContain("xmlns:image=")
    expect(sitemapText).not.toContain("v0-canary-cove-navbar-structure.vercel.app")

    const robotsResponse = await request.get(`${baseURL}/robots.txt`)
    expect(robotsResponse.ok()).toBeTruthy()
    const robotsText = await robotsResponse.text()
    expect(robotsText).toContain("User-Agent: *")
    expect(robotsText).toContain("Allow: /")
    expect(robotsText).toContain("Host: www.canarycove.com")
    expect(robotsText).toContain("Sitemap: https://www.canarycove.com/sitemap.xml")

    const llmsResponse = await request.get(`${baseURL}/llms.txt`)
    expect(llmsResponse.ok()).toBeTruthy()
    expect(llmsResponse.headers()["content-type"]).toContain("text/plain")
    const llmsText = await llmsResponse.text()
    expect(llmsText).toContain("# Canary Cove")
    expect(llmsText).toContain("https://www.canarycove.com/llms-full.txt")

    const llmsFullResponse = await request.get(`${baseURL}/llms-full.txt`)
    expect(llmsFullResponse.ok()).toBeTruthy()
    const llmsFullText = await llmsFullResponse.text()
    expect(llmsFullText).toContain("## Source of truth")
    expect(llmsFullText).toContain("https://www.canarycove.com/rates")
  })
})
