import { expect, test } from "@playwright/test"

import { waitForPageReady } from "./helpers"

const boxesOverlap = (
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y

test.describe("design layout regressions", () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test("desktop dropdown triggers align with plain links and open captioned panels", async ({ page }) => {
    await page.goto("/")
    await waitForPageReady(page)

    const nav = page.getByRole("navigation", { name: "Primary navigation" })
    const stay = nav.getByRole("link", { name: "Stay", exact: true })
    const exploreToggle = nav.getByTestId("desktop-nav-explore")

    const stayBox = await stay.boundingBox()
    const exploreBox = await exploreToggle.boundingBox()
    expect(stayBox).not.toBeNull()
    expect(exploreBox).not.toBeNull()
    if (!stayBox || !exploreBox) return

    expect(Math.abs(exploreBox.height - stayBox.height)).toBeLessThanOrEqual(8)

    await nav.getByTestId("desktop-nav-stay").click()
    const panel = page.locator('[data-slot="popover-content"]')
    await expect(panel.getByRole("link", { name: /The Villa/ })).toBeVisible()
    await expect(panel.getByRole("link", { name: /Main House/ })).toBeVisible()
    await expect(panel.getByRole("link", { name: /^Rates/ })).toBeVisible()
    await expect(panel.getByText("Three suites, pool, and grounds")).toBeVisible()
    await expect(panel.getByRole("link", { name: /Main House/ })).toContainText("external site")

    await page.keyboard.press("Escape")
    await expect(panel).toBeHidden()
    await expect(nav.getByTestId("desktop-nav-stay")).toBeFocused()
  })

  test("active section underlines its nav link, including dropdown parents", async ({ page }) => {
    await page.goto("/rates")
    await waitForPageReady(page)

    const nav = page.getByRole("navigation", { name: "Primary navigation" })
    const stay = nav.getByRole("link", { name: "Stay", exact: true })
    const stayDecoration = await stay.evaluate((el) => getComputedStyle(el).textDecorationLine)
    expect(stayDecoration).toContain("underline")

    await page.goto("/reviews")
    await waitForPageReady(page)

    const reviews = nav.getByRole("link", { name: "Reviews", exact: true })
    await expect(reviews).toHaveAttribute("aria-current", "page")
    const reviewsDecoration = await reviews.evaluate((el) => getComputedStyle(el).textDecorationLine)
    expect(reviewsDecoration).toContain("underline")
  })

  test("header bar stays solid over every hero and shrinks on scroll", async ({ page }) => {
    for (const route of ["/", "/experiences"]) {
      await page.goto(route)
      await waitForPageReady(page)

      const header = page.locator("header").first()
      const wordmark = page.getByTestId("site-brand").locator("span.uppercase").first()
      await expect(header).toBeVisible()

      const background = await header.evaluate((el) => getComputedStyle(el).backgroundColor)
      const alpha = (() => {
        const slash = background.match(/\/\s*([\d.]+)\s*\)/)
        if (slash) return Number(slash[1])
        const rgba = background.match(/^rgba?\(([^)]+)\)/)
        if (rgba) {
          const parts = rgba[1].split(",").map((part) => part.trim())
          return parts.length === 4 ? Number(parts[3]) : 1
        }
        return 1
      })()
      expect(alpha).toBeGreaterThanOrEqual(0.9)

      const color = await wordmark.evaluate((el) => getComputedStyle(el).color)
      const isDark = (() => {
        const lab = color.match(/^lab\(\s*([\d.]+)/)
        if (lab) return Number(lab[1]) < 40
        const rgb = (color.match(/\d+/g) ?? []).map(Number)
        return rgb.length >= 3 && rgb[0] < 120 && rgb[1] < 120 && rgb[2] < 120
      })()
      expect(isDark).toBe(true)
    }

    const header = page.locator("header").first()
    const restBox = await header.boundingBox()
    await page.evaluate(() => window.scrollTo(0, 400))
    await expect.poll(async () => (await header.boundingBox())?.height ?? 0).toBeLessThan(restBox?.height ?? 65)
  })

  test("getting-here step numbers stay aligned to their own step", async ({ page }) => {
    await page.goto("/getting-here")
    await waitForPageReady(page)

    const indexes = page.getByTestId("getting-here-step-index")
    await expect(indexes).toHaveCount(4)

    const boxes = []
    for (let index = 0; index < 4; index += 1) {
      const box = await indexes.nth(index).boundingBox()
      expect(box).not.toBeNull()
      if (box) boxes.push(box)
    }

    for (let i = 0; i < boxes.length; i += 1) {
      for (let j = i + 1; j < boxes.length; j += 1) {
        expect(boxesOverlap(boxes[i], boxes[j]), `Step badges ${i + 1} and ${j + 1} overlapped.`).toBe(false)
      }
    }

    for (let index = 1; index < boxes.length; index += 1) {
      expect(boxes[index].y).toBeGreaterThan(boxes[index - 1].y + 8)
    }
  })

  test("homepage testimonial quotes stay inside their cards", async ({ page }) => {
    await page.goto("/")
    await waitForPageReady(page)

    const card = page.getByTestId("testimonial-card-0")
    const quote = page.getByTestId("testimonial-quote-0")
    await card.scrollIntoViewIfNeeded()
    await expect(card).toBeVisible()
    await expect(quote).toBeVisible()

    const cardBox = await card.boundingBox()
    const quoteBox = await quote.boundingBox()
    expect(cardBox).not.toBeNull()
    expect(quoteBox).not.toBeNull()
    if (!cardBox || !quoteBox) return

    expect(quoteBox.x).toBeGreaterThanOrEqual(cardBox.x - 1)
    expect(quoteBox.y).toBeGreaterThanOrEqual(cardBox.y - 1)
    expect(quoteBox.x + quoteBox.width).toBeLessThanOrEqual(cardBox.x + cardBox.width + 1)
    expect(quoteBox.y + quoteBox.height).toBeLessThanOrEqual(cardBox.y + cardBox.height + 1)
  })

  test("experiences hero tucks under the measured sticky header without covering the heading", async ({ page }) => {
    await page.goto("/experiences")
    await waitForPageReady(page)

    const header = page.locator("header").first()
    const hero = page.locator("main > section").first()
    const heading = page.getByRole("heading", { level: 1 })

    const headerBox = await header.boundingBox()
    const heroBox = await hero.boundingBox()
    const headingBox = await heading.boundingBox()
    expect(headerBox).not.toBeNull()
    expect(heroBox).not.toBeNull()
    expect(headingBox).not.toBeNull()
    if (!headerBox || !heroBox || !headingBox) return

    expect(heroBox.y).toBeLessThanOrEqual(2)
    expect(headingBox.y).toBeGreaterThan(headerBox.y + headerBox.height - 8)
  })

  test("dining how-it-works items keep visible bullet markers", async ({ page }) => {
    await page.goto("/dining")
    await waitForPageReady(page)

    const items = page.getByTestId("dining-basic")
    await expect(items).toHaveCount(4)
    await expect(items.first()).toContainText("•")
  })

  test("stay presents Main House as a designed returning-guest card", async ({ page }) => {
    await page.goto("/stay")
    await waitForPageReady(page)

    const card = page.getByRole("link", { name: /Main House · 5 suites/i })
    await expect(card).toBeVisible()
    await expect(card).toHaveAttribute("href", "/stay/main-house")
    await expect(card).toContainText("Returning guests")
    await expect(card).not.toHaveClass(/underline/)
  })

  test("experiences exposes on-the-water and diving-fishing anchors", async ({ page }) => {
    await page.goto("/experiences")
    await waitForPageReady(page)

    await expect(page.locator("#on-the-water")).toBeVisible()
    await expect(page.locator("#on-the-water")).toContainText("Included with your stay")
    await expect(page.locator("#diving-fishing")).toBeVisible()
    await expect(page.locator("#diving-fishing")).toContainText("Add-on adventures")
  })
})
