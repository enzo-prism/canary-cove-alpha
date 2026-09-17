import { expect, test } from "@playwright/test"

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
]

const routes = ["/", "/book", "/experiences", "/stay"]

const checkHorizontalOverflow = async (page: any) => {
  return page.evaluate(() => {
    const root = document.scrollingElement || document.documentElement
    const overflow = root.scrollWidth - root.clientWidth
    const before = root.scrollLeft
    root.scrollTo({ left: 100 })
    const after = root.scrollLeft
    root.scrollTo({ left: before })
    const canScroll = Math.abs(after - before) > 1
    const style = getComputedStyle(root as Element)
    return {
      overflow,
      canScroll,
      rootTag: (root as Element).tagName.toLowerCase(),
      overflowX: style.overflowX,
    }
  })
}

test.describe("responsive layout coverage", () => {
  for (const viewport of viewports) {
    test.describe(`${viewport.name}`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } })

      for (const route of routes) {
        test(`no horizontal overflow on ${route}`, async ({ page }) => {
          await page.goto(route)
          await page.waitForLoadState("domcontentloaded")
          await page.evaluate(() => document.fonts.ready)

          const result = await checkHorizontalOverflow(page)
          if (result.canScroll) {
            const offenders = await page.evaluate(() => {
              const width = document.documentElement.clientWidth
              return Array.from(document.querySelectorAll("*"))
                .map((el) => {
                  const rect = el.getBoundingClientRect()
                  return {
                    tag: el.tagName.toLowerCase(),
                    id: el.id || null,
                    className: el.className ? String(el.className).slice(0, 120) : null,
                    right: Math.round(rect.right),
                    left: Math.round(rect.left),
                    width: Math.round(rect.width),
                  }
                })
                .filter((entry) => entry.right > width + 1 || entry.left < -1)
                .slice(0, 8)
            })
            throw new Error(
              `Horizontal scrollable overflow (root ${result.rootTag}, overflow-x ${result.overflowX}). Offenders: ${JSON.stringify(offenders)}`,
            )
          }
          expect(result.canScroll).toBe(false)
        })
      }

      test("hero remains a full-bleed visual within the viewport", async ({ page }) => {
        await page.goto("/")
        await page.waitForLoadState("domcontentloaded")
        await page.evaluate(() => document.fonts.ready)

        const hero = page.getByTestId("hero-visual")
        await expect(hero).toBeVisible()
        const box = await hero.boundingBox()
        expect(box).not.toBeNull()
        if (!box) return

        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
        expect(box.width).toBeGreaterThanOrEqual(viewport.width - 2)

        if (viewport.name === "mobile") {
          expect(box.height).toBeGreaterThanOrEqual(viewport.height * 0.75)
        }
      })

      test("homepage intro stays readable within gutters", async ({ page }) => {
        await page.goto("/")
        await page.waitForLoadState("domcontentloaded")
        await page.evaluate(() => document.fonts.ready)

        const intro = page.getByTestId("homepage-intro")
        await expect(intro).toBeVisible()
        const box = await intro.boundingBox()
        expect(box).not.toBeNull()
        if (!box) return

        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
        expect(box.width).toBeLessThanOrEqual(viewport.width * 0.94)
      })

      test("hero overlay copy stays readable and inside the viewport", async ({ page }) => {
        await page.goto("/")
        await page.waitForLoadState("domcontentloaded")
        await page.evaluate(() => document.fonts.ready)

        const hero = page.getByTestId("hero-visual")
        await expect(hero).toBeVisible()
        await expect(hero.getByRole("heading", { level: 1 })).toBeVisible()
        await expect(hero.getByTestId("homepage-primary-cta")).toBeVisible()

        const box = await hero.getByTestId("homepage-intro").boundingBox()
        expect(box).not.toBeNull()
        if (!box) return
        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
      })
    })
  }
})

test.describe("desktop dropdown motion", () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test("dropdown opens on hover intent and closes when the pointer leaves", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("domcontentloaded")
    await page.evaluate(() => document.fonts.ready)

    const nav = page.getByRole("navigation", { name: "Primary navigation" })
    const panel = page.locator('[data-slot="popover-content"]')

    await nav.getByRole("link", { name: "Stay", exact: true }).hover()
    await expect(panel.getByRole("link", { name: /^Rates/ })).toBeVisible()

    await page.mouse.move(20, 450)
    await expect(panel).toBeHidden()
  })

  test("chevron toggles the panel and the keyboard can drive it", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("domcontentloaded")
    await page.evaluate(() => document.fonts.ready)

    const nav = page.getByRole("navigation", { name: "Primary navigation" })
    const toggle = nav.getByTestId("desktop-nav-explore")
    const panel = page.locator('[data-slot="popover-content"]')

    await toggle.click()
    await expect(panel.getByRole("link", { name: /^Gallery/ })).toBeVisible()
    await toggle.click()
    await expect(panel).toBeHidden()

    await toggle.focus()
    await page.keyboard.press("ArrowDown")
    await expect(panel.getByRole("link", { name: /^Experiences/ })).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await expect(panel.getByRole("link", { name: /^Dining/ })).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(panel).toBeHidden()
    await expect(toggle).toBeFocused()
  })

  test("reduced motion keeps dropdowns functional without animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/")
    await page.waitForLoadState("domcontentloaded")
    await page.evaluate(() => document.fonts.ready)

    const nav = page.getByRole("navigation", { name: "Primary navigation" })
    const toggle = nav.getByTestId("desktop-nav-stay")
    const panel = page.locator('[data-slot="popover-content"]')

    await toggle.click()
    await expect(panel.getByRole("link", { name: /^Rates/ })).toBeVisible()

    const chevronTransition = await toggle
      .locator("svg")
      .evaluate((el) => getComputedStyle(el).transitionProperty)
    expect(chevronTransition).toBe("none")

    await page.keyboard.press("Escape")
    await expect(panel).toBeHidden()
  })
})
