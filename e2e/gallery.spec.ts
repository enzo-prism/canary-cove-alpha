import { expect, test, type Page } from "@playwright/test"

const MOBILE = { width: 390, height: 844 }

async function openGallery(page: Page) {
  await page.goto("/gallery")
  await page.waitForLoadState("domcontentloaded")
  await expect(page.getByTestId("gallery-browser")).toBeVisible()
}

async function photoCount(page: Page) {
  return page.getByTestId("gallery-photo").count()
}

/**
 * Scroll to the bottom and report how many photos are mounted. Re-scrolling on
 * every poll matters: the grid is lazy-loaded, so images arriving after a scroll
 * grow the page and push the end-of-grid sentinel back below the fold. A single
 * scroll can land short of it, exactly as it would for someone still flicking.
 */
async function scrollToBottomAndCount(page: Page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  return photoCount(page)
}

test.describe("gallery page", () => {
  test("renders the searchable library at /gallery", async ({ page }) => {
    await openGallery(page)

    await expect(page).toHaveURL(/\/gallery$/)
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Every photo of Canary Cove")
    await expect(page.getByTestId("gallery-result-count")).toContainText("225 of 225 photos")
    expect(await photoCount(page)).toBeGreaterThan(0)
  })

  test("is reachable from the site navigation", async ({ page }) => {
    await page.goto("/stay")
    await page.waitForLoadState("domcontentloaded")
    await page.getByRole("navigation").getByRole("link", { name: "Gallery", exact: true }).first().click()
    await expect(page).toHaveURL(/\/gallery$/)
    await expect(page.getByTestId("gallery-browser")).toBeVisible()
  })

  test("keeps the legacy /about/photo-gallery URL pointed at the gallery", async ({ page }) => {
    await page.goto("/about/photo-gallery")
    await expect(page).toHaveURL(/\/gallery$/)
  })

  test("narrows results as a search is typed", async ({ page }) => {
    await openGallery(page)
    const before = await photoCount(page)

    await page.getByTestId("gallery-search-input").fill("ceviche")
    await expect(page.getByTestId("gallery-result-count")).not.toContainText("225 of 225")

    const after = await photoCount(page)
    expect(after).toBeLessThan(before)
    expect(after).toBeGreaterThan(0)
  })

  test("finds photos by guest vocabulary the captions never use", async ({ page }) => {
    await openGallery(page)
    // Nothing is captioned "swimming"; the pool synonym group carries it.
    await page.getByTestId("gallery-search-input").fill("swimming")
    await expect(page.getByTestId("gallery-photo").first()).toBeVisible()
    await expect(page.getByTestId("gallery-empty")).toHaveCount(0)
  })

  test("shows an empty state and recovers with reset", async ({ page }) => {
    await openGallery(page)

    await page.getByTestId("gallery-search-input").fill("snowstorm")
    await expect(page.getByTestId("gallery-empty")).toBeVisible()
    await expect(page.getByTestId("gallery-result-count")).toContainText("0 of 225")

    await page.getByTestId("gallery-empty").getByRole("button", { name: "Reset filters" }).click()
    await expect(page.getByTestId("gallery-result-count")).toContainText("225 of 225")
  })

  test("filters by category chip and reports the count on the chip itself", async ({ page }) => {
    await openGallery(page)

    const chip = page.getByTestId("gallery-filter-dining-food")
    await expect(chip).toContainText("40")
    await chip.click()

    await expect(chip).toHaveAttribute("aria-pressed", "true")
    await expect(page.getByTestId("gallery-result-count")).toContainText("40 of 225 photos")
  })

  test("combines a category with a search", async ({ page }) => {
    await openGallery(page)

    await page.getByTestId("gallery-filter-suites-bedrooms").click()
    const categoryOnly = await page.getByTestId("gallery-result-count").textContent()

    await page.getByTestId("gallery-search-input").fill("bathroom")
    await expect(page.getByTestId("gallery-result-count")).not.toHaveText(categoryOnly ?? "")
    await expect(page.getByTestId("gallery-filter-suites-bedrooms")).toHaveAttribute("aria-pressed", "true")
  })

  test("pages more photos in as the grid is scrolled, keeping the active filter", async ({ page }) => {
    await openGallery(page)
    const first = await photoCount(page)
    expect(first).toBe(36)

    await expect.poll(() => scrollToBottomAndCount(page), { timeout: 15_000 }).toBeGreaterThan(first)
    await expect(page.getByTestId("gallery-result-count")).toContainText("225 of 225 photos")
  })

  test("reaches the end of the library by scrolling", async ({ page }) => {
    await openGallery(page)
    await expect.poll(() => scrollToBottomAndCount(page), { timeout: 30_000 }).toBe(225)
    await expect(page.getByTestId("gallery-end")).toBeVisible()
  })

  test("resets paging when the filter changes", async ({ page }) => {
    await openGallery(page)
    await expect.poll(() => scrollToBottomAndCount(page), { timeout: 15_000 }).toBeGreaterThan(36)

    // Back to the top first, so the end-of-grid sentinel is nowhere near the
    // viewport and cannot auto-load a second page straight after the reset.
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.getByTestId("gallery-filter-suites-bedrooms").click()
    await expect.poll(() => photoCount(page)).toBe(36)
  })

  test("opens the full-screen viewer at the tapped photo", async ({ page }) => {
    await openGallery(page)

    await page.getByTestId("gallery-photo").nth(4).click()
    const lightbox = page.getByTestId("photo-lightbox")
    await expect(lightbox).toBeVisible()
    await expect(lightbox).toContainText("5 / 36")

    await lightbox.getByRole("button", { name: "Close gallery" }).click()
    await expect(lightbox).not.toBeVisible()
  })

  test("viewer walks the filtered set, not the whole library", async ({ page }) => {
    await openGallery(page)

    await page.getByTestId("gallery-filter-beach-dock").click()
    await page.getByTestId("gallery-photo").first().click()

    // Beach & dock holds 3 photos, so the viewer must be bounded by that.
    await expect(page.getByTestId("photo-lightbox")).toContainText("1 / 3")
  })
})

test.describe("gallery page on a phone", () => {
  test.use({ viewport: MOBILE, hasTouch: true })

  test("fits the viewport with no horizontal overflow", async ({ page }) => {
    await openGallery(page)
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
  })

  test("keeps search and filters reachable while scrolling the grid", async ({ page }) => {
    await openGallery(page)
    await page.evaluate(() => window.scrollTo(0, 1400))
    await page.waitForTimeout(300)

    const search = page.getByTestId("gallery-search-input")
    await expect(search).toBeInViewport()
    await expect(page.getByTestId("gallery-filter-suites-bedrooms")).toBeInViewport()

    // The pinned controls must not eat the screen the photos need.
    const barShare = await page.evaluate(() => {
      const bar = document.querySelector('[data-testid="gallery-category-filters"]')?.parentElement
      if (!bar) return 1
      return bar.getBoundingClientRect().height / window.innerHeight
    })
    expect(barShare).toBeLessThan(0.3)
  })

  test("pins the filter bar flush under the header, with no gap for photos to show through", async ({
    page,
  }) => {
    await openGallery(page)
    await page.evaluate(() => window.scrollTo(0, 1400))
    await page.waitForTimeout(300)

    // The header shrinks on scroll; a hardcoded offset drifts and leaks a strip
    // of moving photo between the two bars. Polled because the offset is
    // republished by a ResizeObserver, which settles a frame after the resize.
    await expect
      .poll(() =>
        page.evaluate(() => {
          const header = document.querySelector("header")
          const bar = document.querySelector('[data-testid="gallery-category-filters"]')?.parentElement
          if (!header || !bar) return Number.NaN
          return Math.abs(bar.getBoundingClientRect().top - header.getBoundingClientRect().bottom)
        }),
      )
      .toBeLessThanOrEqual(1)
  })

  test("swipes between photos in the full-screen viewer", async ({ page }) => {
    await openGallery(page)
    await page.getByTestId("gallery-photo").first().click()

    const lightbox = page.getByTestId("photo-lightbox")
    await expect(lightbox).toContainText("1 / 36")

    const box = await lightbox.boundingBox()
    if (!box) throw new Error("lightbox has no bounding box")
    const y = box.y + box.height / 2
    await page.mouse.move(box.x + box.width * 0.85, y)
    await page.mouse.down()
    for (let step = 0; step < 12; step += 1) {
      await page.mouse.move(box.x + box.width * (0.85 - step * 0.055), y)
    }
    await page.mouse.up()

    await expect(lightbox).toContainText("2 / 36")
  })

  test("hides the concierge widget while the viewer is open", async ({ page }) => {
    await openGallery(page)
    await page.getByTestId("gallery-photo").first().click()
    await expect(page.getByTestId("photo-lightbox")).toBeVisible()
    await expect(page.getByTestId("elevenlabs-convai-widget")).toHaveCSS("display", "none")
  })
})

test.describe("sticky chrome", () => {
  // `overflow-x: hidden` on html/body would make them scroll containers and
  // silently break every `position: sticky` on the site. Guard the header.
  for (const path of ["/", "/stay", "/gallery"]) {
    test(`header stays pinned while scrolling ${path}`, async ({ page }) => {
      await page.setViewportSize(MOBILE)
      await page.goto(path)
      await page.waitForLoadState("networkidle")
      await page.evaluate(() => window.scrollTo(0, 1400))
      await page.waitForTimeout(300)

      const scrolled = await page.evaluate(() => window.scrollY)
      expect(scrolled, `${path} did not scroll far enough to test stickiness`).toBeGreaterThan(400)

      const headerTop = await page.evaluate(
        () => document.querySelector("header")?.getBoundingClientRect().top ?? -1,
      )
      expect(Math.abs(headerTop), `header on ${path} scrolled away instead of sticking`).toBeLessThan(2)
    })
  }
})
