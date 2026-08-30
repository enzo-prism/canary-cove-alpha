import { expect, test } from "@playwright/test"

import { NAV_ITEMS } from "@/lib/nav-items"
import { waitForPageReady } from "./helpers"

const boxesOverlap = (
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y

test.describe("design layout regressions", () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test("Explore sits in the same stacked icon+label pill as the other desktop items", async ({ page }) => {
    await page.goto("/")
    await waitForPageReady(page)

    const nav = page.getByRole("navigation", { name: "Primary navigation" })
    const stay = nav.getByRole("link", { name: "Stay", exact: true })
    const explore = nav.getByTestId("desktop-nav-explore")

    await expect(explore.locator(".nav-icon svg")).toHaveCount(1)
    await expect(explore.locator(".nav-label")).toContainText("Explore")

    const stayBox = await stay.boundingBox()
    const exploreBox = await explore.boundingBox()
    expect(stayBox).not.toBeNull()
    expect(exploreBox).not.toBeNull()
    if (!stayBox || !exploreBox) return

    expect(Math.abs(exploreBox.height - stayBox.height)).toBeLessThanOrEqual(4)
  })

  test("every desktop navigation destination exposes a visible icon", async ({ page }) => {
    await page.goto("/")
    await waitForPageReady(page)

    const nav = page.getByRole("navigation", { name: "Primary navigation" })
    for (const item of NAV_ITEMS) {
      if (item.type === "dropdown") {
        const trigger = nav.getByTestId("desktop-nav-explore")
        await expect(trigger.locator(".nav-icon svg"), `${item.label} should have a desktop navigation icon`).toHaveCount(1)
        continue
      }

      const icon = nav.getByRole("link", { name: item.label, exact: true }).locator(".nav-icon")
      await expect(icon, `${item.label} should have a desktop navigation icon`).toBeVisible()
      await expect(icon.locator("svg")).toHaveCount(1)
    }
  })

  test("immersive header brand keeps a contrasting surface over photography", async ({ page }) => {
    await page.goto("/")
    await waitForPageReady(page)

    const brand = page.getByTestId("site-brand").locator("a")
    const wordmark = brand.locator("span.uppercase").first()
    await expect(brand).toBeVisible()

    const contrast = await brand.evaluate((el) => {
      const styles = getComputedStyle(el)
      return {
        backgroundColor: styles.backgroundColor,
      }
    })
    const color = await wordmark.evaluate((el) => getComputedStyle(el).color)
    const rgb = (color.match(/\d+/g) ?? []).map(Number)

    expect(contrast.backgroundColor).not.toBe("rgba(0, 0, 0, 0)")
    expect(rgb[0]).toBeGreaterThan(200)
    expect(rgb[1]).toBeGreaterThan(200)
    expect(rgb[2]).toBeGreaterThan(200)
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
})
