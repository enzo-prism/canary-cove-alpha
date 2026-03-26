import { expect, test } from "@playwright/test"

const viewports = [
  { name: "mobile", width: 375, height: 812, logoRatio: 0.65 },
  { name: "tablet", width: 768, height: 1024, logoRatio: 0.5 },
  { name: "desktop", width: 1280, height: 900, logoRatio: 0.45 },
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

      test("hero logo stays within viewport", async ({ page }) => {
        await page.goto("/")
        await page.waitForLoadState("domcontentloaded")
        await page.evaluate(() => document.fonts.ready)

        const logo = page.getByAltText("Canary Cove logo")
        await expect(logo).toBeVisible()

        const box = await logo.boundingBox()
        expect(box).not.toBeNull()
        if (!box) return

        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
        expect(box.width).toBeLessThanOrEqual(viewport.width * viewport.logoRatio)
      })

      test("intro section stays readable within gutters", async ({ page }) => {
        await page.goto("/")
        await page.waitForLoadState("domcontentloaded")
        await page.evaluate(() => document.fonts.ready)

        const copy = page.getByTestId("hero-copy")
        await expect(copy).toBeVisible()
        const box = await copy.boundingBox()
        expect(box).not.toBeNull()
        if (!box) return

        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
        expect(box.width).toBeLessThanOrEqual(viewport.width * 0.94)
      })

      test("hero copy leaves room for the photography", async ({ page }) => {
        await page.goto("/")
        await page.waitForLoadState("domcontentloaded")
        await page.evaluate(() => document.fonts.ready)

        const copy = page.getByTestId("hero-copy")
        await expect(copy).toBeVisible()
        const box = await copy.boundingBox()
        expect(box).not.toBeNull()
        if (!box) return

        if (viewport.name === "mobile") {
          expect(box.width).toBeLessThanOrEqual(viewport.width * 0.82)
          expect(box.height).toBeLessThanOrEqual(viewport.height * 0.45)
        }
      })
    })
  }
})

test.describe("nav icon hover motion", () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test("icon animates without moving label", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("domcontentloaded")
    await page.evaluate(() => document.fonts.ready)

    const nav = page.getByRole("navigation", { name: "Primary navigation" })
    const link = nav.getByRole("link", { name: /home/i })
    const icon = link.locator(".nav-icon")
    const label = link.locator(".nav-label")

    await expect(icon).toBeVisible()
    await expect(label).toBeVisible()

    const labelBefore = await label.boundingBox()
    const iconBefore = await icon.evaluate((el) => getComputedStyle(el).transform)

    await link.hover()

    const iconAfter = await icon.evaluate((el) => getComputedStyle(el).transform)
    const labelAfter = await label.boundingBox()

    expect(iconBefore).toBe("none")
    expect(iconAfter).not.toBe("none")
    if (labelBefore && labelAfter) {
      expect(Math.abs(labelAfter.x - labelBefore.x)).toBeLessThanOrEqual(0.5)
      expect(Math.abs(labelAfter.y - labelBefore.y)).toBeLessThanOrEqual(0.5)
    }
  })

  test("reduced motion disables icon animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/")
    await page.waitForLoadState("domcontentloaded")
    await page.evaluate(() => document.fonts.ready)

    const nav = page.getByRole("navigation", { name: "Primary navigation" })
    const link = nav.getByRole("link", { name: /home/i })
    const icon = link.locator(".nav-icon")

    await link.hover()
    const transform = await icon.evaluate((el) => getComputedStyle(el).transform)
    expect(transform).toBe("none")
  })
})
