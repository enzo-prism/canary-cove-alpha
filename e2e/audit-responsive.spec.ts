import { expect, test, type Locator, type Page } from "@playwright/test"

import { SITE_ROUTES, waitForPageReady } from "./helpers"

const PUBLIC_ROUTES = [...SITE_ROUTES, "/gallery"] as const
const AUDIT_VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 360, height: 640 },
  { width: 390, height: 844 },
  { width: 640, height: 360 },
  { width: 768, height: 1024 },
  { width: 1023, height: 768 },
  { width: 1024, height: 768 },
  { width: 1280, height: 900 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
] as const

const futureIsoDate = (days: number) => {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

const expectWithinHorizontalViewport = async (locator: Locator, width: number) => {
  await expect(locator).toBeVisible()
  const bounds = await locator.boundingBox()
  expect(bounds).not.toBeNull()
  if (!bounds) return
  expect(bounds.x, "content starts inside the viewport").toBeGreaterThanOrEqual(-1)
  expect(bounds.x + bounds.width, "content ends inside the viewport").toBeLessThanOrEqual(width + 1)
}

const expectNoRootOverflow = async (page: Page) => {
  const geometry = await page.evaluate(() => ({
    width: window.innerWidth,
    rootWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    offenders: document.body.scrollWidth > innerWidth + 1 ? [...document.querySelectorAll("main *")].filter((element) => {
      if (element.getBoundingClientRect().right <= innerWidth + 1) return false
      for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
        if (["hidden", "auto", "scroll"].includes(getComputedStyle(parent).overflowX)) return false
      }
      return true
    }).slice(0, 10).map((element) => ({ tag: element.tagName, className: String(element.className).slice(0, 90), text: element.textContent?.slice(0, 60), right: element.getBoundingClientRect().right })) : [],
  }))
  expect(geometry.rootWidth, JSON.stringify(geometry)).toBeLessThanOrEqual(geometry.width + 1)
  expect(geometry.bodyWidth, JSON.stringify(geometry)).toBeLessThanOrEqual(geometry.width + 1)
}

test.describe("expanded public responsive audit", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } })

  test.beforeEach(async ({ page }) => {
    // Synthetic audit journeys never reach the real inquiry intake.
    await page.route("**/api/forms", (route) => route.abort())
    await page.route("**/formspree.io/**", (route) => route.abort())
  })

  for (const route of PUBLIC_ROUTES) {
    test(`${route} survives the full public viewport matrix`, async ({ page }, testInfo) => {
      await page.goto(route)
      await waitForPageReady(page)
      const heading = page.getByRole("heading", { level: 1 })
      await expect(heading).toHaveCount(1)

      for (const viewport of AUDIT_VIEWPORTS) {
        await test.step(`${viewport.width} × ${viewport.height}`, async () => {
          await page.setViewportSize(viewport)
          await page.evaluate(() => window.scrollTo(0, 0))
          await waitForPageReady(page)
          try {
            await expectNoRootOverflow(page)
            await expectWithinHorizontalViewport(heading, viewport.width)
            // Headlines with clipped word masks can have a valid parent box
            // while their rendered text overflows at narrow widths.
            const textBounds = await heading.evaluate((element) => {
              const range = document.createRange()
              range.selectNodeContents(element)
              return [...range.getClientRects()].map((rect) => ({ left: rect.left, right: rect.right }))
            })
            for (const bounds of textBounds) {
              expect(bounds.left, "heading text stays within the viewport").toBeGreaterThanOrEqual(-1)
              expect(bounds.right, "heading text stays within the viewport").toBeLessThanOrEqual(viewport.width + 1)
            }
          } catch (error) {
            await testInfo.attach(`layout-${route.replaceAll("/", "_")}-${viewport.width}`, {
              body: await page.screenshot({ fullPage: false }),
              contentType: "image/png",
            })
            throw error
          }
        })
      }
    })
  }

  for (const viewport of [
    { width: 320, height: 568 },
    { width: 640, height: 360 },
    { width: 1024, height: 600 },
    { width: 1440, height: 600 },
  ]) {
    test(`home hero contains its heading and primary actions at ${viewport.width} × ${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await page.goto("/")
      await waitForPageReady(page)
      const heading = page.getByRole("heading", { level: 1 })
      const hero = heading.locator("xpath=ancestor::section[1]")
      const heroBounds = await hero.boundingBox()
      expect(heroBounds).not.toBeNull()
      if (!heroBounds) return
      for (const element of [heading, page.getByTestId("homepage-primary-cta"), page.getByTestId("homepage-secondary-cta")]) {
        await expect(element).toBeVisible()
        const bounds = await element.boundingBox()
        expect(bounds).not.toBeNull()
        if (!bounds) continue
        expect(bounds.y, "hero content is not clipped above the hero").toBeGreaterThanOrEqual(heroBounds.y - 1)
        expect(bounds.y + bounds.height, "hero content is not clipped below the hero").toBeLessThanOrEqual(heroBounds.y + heroBounds.height + 1)
        await expectWithinHorizontalViewport(element, viewport.width)
      }
    })
  }

  for (const viewport of [{ width: 320, height: 568 }, { width: 640, height: 360 }]) {
    test(`mobile menu and search remain reachable at ${viewport.width} × ${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await page.goto("/")
      await waitForPageReady(page)
      const menuTrigger = page.getByRole("button", { name: "Open navigation menu" })
      await menuTrigger.click()
      const close = page.getByRole("button", { name: "Close navigation menu" })
      await expect(close).toBeVisible()
      await expect(close).toBeFocused()
      // Contact sits near the bottom of the menu: reaching it exercises the
      // scroll surface on phone landscape instead of just the opening frame.
      await page.getByRole("link", { name: "Contact", exact: true }).click()
      await expect(page).toHaveURL(/\/contact$/)
      await expect(close).toBeHidden()
      await waitForPageReady(page)

      const searchTrigger = page.getByTestId("search-open-button")
      await searchTrigger.click()
      const modal = page.getByTestId("search-modal")
      await expect(modal).toBeVisible()
      await expectWithinHorizontalViewport(modal, viewport.width)
      const modalBounds = await modal.boundingBox()
      expect(modalBounds).not.toBeNull()
      if (modalBounds) {
        expect(modalBounds.y).toBeGreaterThanOrEqual(-1)
        expect(modalBounds.y + modalBounds.height).toBeLessThanOrEqual(viewport.height + 1)
      }
      await page.getByTestId("search-input").fill("cancellation")
      await expect(page.getByTestId("search-answer")).toBeVisible()
      await page.keyboard.press("Enter")
      await expect(page).toHaveURL(/\/book#cancellation-policy$/)
      await expect(modal).toBeHidden()
      await page.getByTestId("search-open-button").click()
      await expect(modal).toBeVisible()
      await page.keyboard.press("Escape")
      await expect(modal).toBeHidden()
      await expect(page.getByTestId("search-open-button")).toBeFocused()
      await expectNoRootOverflow(page)
    })

    test(`inquiry steps stay operable at ${viewport.width} × ${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await page.goto("/contact")
      await waitForPageReady(page)
      const contact = page.getByTestId("contact-form-card")
      await contact.getByText("Dates & pricing", { exact: true }).click()
      const message = page.getByRole("textbox", { name: "Nature of inquiry" })
      await expect(message).toHaveAttribute("placeholder", /My travel window/)
      await message.fill("Synthetic viewport audit inquiry.")
      await page.getByTestId("contact-next").click()
      await expect(page.getByText("Step 2 of 2")).toBeVisible()
      await page.getByLabel("Name", { exact: true }).fill("Viewport Audit")
      await page.getByLabel("Email", { exact: true }).fill("viewport@example.com")
      await expectWithinHorizontalViewport(contact, viewport.width)
      await page.getByRole("button", { name: "Back", exact: true }).click()
      await expect(message).toHaveValue("Synthetic viewport audit inquiry.")

      await page.goto("/book")
      await waitForPageReady(page)
      const booking = page.getByTestId("booking-form-card")
      await booking.getByText("Villa (1–3 suites)", { exact: true }).click()
      await booking.getByText("No, this would be my first stay", { exact: true }).click()
      await page.getByTestId("booking-next").click()
      await expect(page.getByText("Step 2 of 5")).toBeVisible()
      const arrival = futureIsoDate(30)
      await page.getByLabel("Preferred Arrival Date").fill(arrival)
      await page.getByLabel("Preferred Departure Date").fill(futureIsoDate(35))
      await page.getByTestId("booking-next").click()
      await expect(page.getByText("Step 3 of 5")).toBeVisible()
      await page.getByRole("button", { name: "Back", exact: true }).click()
      await expect(page.getByLabel("Preferred Arrival Date")).toHaveValue(arrival)
      await expectWithinHorizontalViewport(booking, viewport.width)
      await expectNoRootOverflow(page)
    })
  }

  for (const viewport of [{ width: 1024, height: 360 }, { width: 1280, height: 360 }]) {
    test(`desktop Explore links stay operable at ${viewport.width} × ${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await page.goto("/")
      await waitForPageReady(page)
      const nav = page.getByRole("navigation", { name: "Primary navigation" })
      await nav.getByTestId("desktop-nav-explore").click()
      const panel = page.locator('[data-slot="popover-content"]')
      await expect(panel).toBeVisible()
      await expectWithinHorizontalViewport(panel, viewport.width)
      // The final item must remain clickable in a shallow desktop window.
      await panel.getByRole("link", { name: /^Gallery/ }).click()
      await expect(page).toHaveURL(/\/gallery$/)
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    })
  }

  test("resizing an open mobile menu restores desktop navigation and scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")
    await waitForPageReady(page)
    await page.getByRole("button", { name: "Open navigation menu" }).click()
    await expect(page.getByRole("button", { name: "Close navigation menu" })).toBeVisible()
    await page.setViewportSize({ width: 1280, height: 900 })
    await expect(page.getByRole("button", { name: "Close navigation menu" })).toBeHidden()
    const nav = page.getByRole("navigation", { name: "Primary navigation" })
    await expect(nav).toBeVisible()
    await nav.getByRole("link", { name: "Stay", exact: true }).click()
    await expect(page).toHaveURL(/\/stay$/)
    await page.mouse.wheel(0, 400)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
  })

  test("public link inventory has valid local routes and section targets", async ({ page, request, baseURL }, testInfo) => {
    test.setTimeout(180_000)
    const origin = new URL(baseURL ?? "http://localhost:3000").origin
    const links = new Map<string, Set<string>>()
    const anchors = new Map<string, Set<string>>()

    for (const route of PUBLIC_ROUTES) {
      const response = await page.goto(route)
      expect(response?.ok(), `${route} responds successfully`).toBeTruthy()
      await waitForPageReady(page)
      const inventory = await page.evaluate(() => ({
        hrefs: [...document.querySelectorAll<HTMLAnchorElement>("a[href]")].map((link) => link.getAttribute("href") ?? ""),
        ids: [...document.querySelectorAll<HTMLElement>("[id]")].map((element) => element.id),
      }))
      anchors.set(route, new Set(inventory.ids))
      for (const href of inventory.hrefs) {
        if (!href || /^(mailto:|tel:|javascript:)/i.test(href)) continue
        const url = new URL(href, `${origin}${route}`)
        if (url.origin !== origin) continue
        const destination = `${url.pathname}${url.search}${url.hash}`
        const sources = links.get(destination) ?? new Set<string>()
        sources.add(route)
        links.set(destination, sources)
      }
    }

    const checkedPaths = new Set<string>()
    for (const [destination, sources] of links) {
      const url = new URL(destination, origin)
      const sourceDescription = [...sources].join(", ")
      if (!checkedPaths.has(url.pathname)) {
        // Stay/Main House deliberately redirects externally. Do not follow
        // external redirects while validating this site's local destination.
        const response = await request.get(url.pathname, { maxRedirects: 0 })
        expect(response.status(), `${destination} linked from ${sourceDescription}`).toBeLessThan(400)
        expect(response.status(), `${destination} linked from ${sourceDescription}`).toBeGreaterThanOrEqual(200)
        checkedPaths.add(url.pathname)
      }
      if (url.hash) {
        const target = decodeURIComponent(url.hash.slice(1))
        expect(anchors.has(url.pathname), `${destination} is a public anchored route`).toBeTruthy()
        expect(anchors.get(url.pathname)?.has(target), `${destination} linked from ${sourceDescription} has its target`).toBeTruthy()
      }
    }
    await testInfo.attach("public-link-inventory", {
      body: JSON.stringify(Object.fromEntries([...links].map(([destination, sources]) => [destination, [...sources]])), null, 2),
      contentType: "application/json",
    })
  })

  test("public button controls provide finger-sized targets on phones", async ({ page }) => {
    test.setTimeout(180_000)
    const undersized: Array<{ viewport: number; route: string; name: string; width: number; height: number }> = []
    for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport)
      for (const route of PUBLIC_ROUTES) {
        await page.goto(route)
        await waitForPageReady(page)
        // Snapshot in one browser task. Positional role locators can shift
        // while Embla marks an off-screen slide inert or a calendar mounts.
        const buttons = await page.getByRole("button").evaluateAll((elements) => elements.flatMap((element) => {
          if (!element.isConnected || element.matches(":disabled")) return []
          if (element.closest("[aria-disabled]")?.getAttribute("aria-disabled")?.toLowerCase() === "true") return []
          const disclosure = element.closest("details,summary")
          if (disclosure !== element && disclosure instanceof HTMLDetailsElement && !disclosure.open) return []
          if (getComputedStyle(element).visibility !== "visible") return []
          const box = element.getBoundingClientRect()
          if (box.width <= 0 || box.height <= 0) return []
          return [{ name: element.getAttribute("aria-label") ?? (element as HTMLElement).innerText, width: box.width, height: box.height }]
        }))
        expect(buttons.length, `${route} has enabled phone controls`).toBeGreaterThan(0)
        undersized.push(...buttons.filter(({ width, height }) => width < 43.9 || height < 43.9).map((button) => ({ viewport: viewport.width, route, ...button })))
      }
    }
    expect(undersized, "Every enabled public phone button must have a 44px hit box").toEqual([])
  })

  test("phone search and visited booking steps retain finger-sized targets", async ({ page }) => {
    for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport)
      await page.goto("/contact")
      await waitForPageReady(page)
      await page.evaluate(() => localStorage.setItem("cc-search-recent", JSON.stringify(["rates", "dining"])))
      await page.getByRole("button", { name: "Open site search" }).click()
      const search = page.getByTestId("search-modal")
      await expect(search).toBeVisible()
      await expect(search.getByRole("button", { name: /^Remove recent search/ })).toHaveCount(2)
      for (const button of await search.getByRole("button").all()) {
        if (!(await button.isEnabled()) || !(await button.isVisible())) continue
        const box = await button.boundingBox()
        expect(box?.width, `${await button.getAttribute("aria-label")} at ${viewport.width}px`).toBeGreaterThanOrEqual(43.9)
        expect(box?.height).toBeGreaterThanOrEqual(43.9)
      }
      await page.getByTestId("search-input").fill("rates")
      await expect(page.getByTestId("search-answer")).toBeVisible()
      expect(await page.getByTestId("search-answer").getByRole("link").count()).toBeGreaterThan(0)
      for (const link of await page.getByTestId("search-answer").getByRole("link").all()) {
        expect((await link.boundingBox())?.height).toBeGreaterThanOrEqual(43.9)
      }
      await page.getByTestId("search-input").fill("zzzzzzzzzzzzzz")
      const fallback = search.getByRole("link", { name: "Contact Canary Cove", exact: true })
      await expect(fallback).toBeVisible()
      expect((await fallback.boundingBox())?.height).toBeGreaterThanOrEqual(43.9)
      await page.keyboard.press("Escape")
      await expect(search).toHaveCount(0)

      await page.goto("/book")
      await waitForPageReady(page)
      await page.getByTestId("booking-form-card").getByText("Villa (1–3 suites)", { exact: true }).click()
      await page.getByTestId("booking-form-card").getByText("No, this would be my first stay", { exact: true }).click()
      await expect(page.getByRole("radio", { name: /^Villa \(1–3 suites\)/ })).toBeChecked()
      await page.getByRole("button", { name: "Continue", exact: true }).click()
      const completedStep = page.getByRole("button", { name: "Stay (completed)" })
      await expect(completedStep).toBeEnabled()
      expect((await completedStep.boundingBox())?.width).toBeGreaterThanOrEqual(43.9)
      expect((await completedStep.boundingBox())?.height).toBeGreaterThanOrEqual(43.9)
      await completedStep.click()
      await expect(page.getByRole("heading", { name: "Which space fits your group?" })).toBeVisible()
    }
  })
})
