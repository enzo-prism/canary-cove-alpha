import { expect, test, type Locator } from "@playwright/test"

const MIN_FULL_SLIDE_RATIO = 0.97

const getMaxIntersectionRatio = async (viewport: Locator, slides: Locator) => {
  const viewportBox = await viewport.boundingBox()
  if (!viewportBox) {
    throw new Error("Unable to read viewport bounding box.")
  }

  const count = await slides.count()
  let maxRatio = 0

  for (let index = 0; index < count; index += 1) {
    const slideBox = await slides.nth(index).boundingBox()
    if (!slideBox) continue

    const left = Math.max(viewportBox.x, slideBox.x)
    const right = Math.min(viewportBox.x + viewportBox.width, slideBox.x + slideBox.width)
    const top = Math.max(viewportBox.y, slideBox.y)
    const bottom = Math.min(viewportBox.y + viewportBox.height, slideBox.y + slideBox.height)
    const width = Math.max(0, right - left)
    const height = Math.max(0, bottom - top)
    const intersectionArea = width * height
    const slideArea = slideBox.width * slideBox.height
    if (slideArea > 0) {
      const ratio = intersectionArea / slideArea
      maxRatio = Math.max(maxRatio, ratio)
    }
  }

  return maxRatio
}

const dragToNext = async (page: any, viewport: Locator) => {
  const box = await viewport.boundingBox()
  if (!box) {
    throw new Error("Unable to read viewport bounding box.")
  }

  const startX = box.x + box.width * 0.8
  const endX = box.x + box.width * 0.2
  const y = box.y + box.height * 0.5

  await page.mouse.move(startX, y)
  await page.mouse.down()
  await page.mouse.move(endX, y, { steps: 12 })
  await page.mouse.up()
}

test.describe("slider snap alignment", () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test("homepage sliders snap to a full slide", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("domcontentloaded")
    await page.evaluate(() => document.fonts.ready)

    const modelViewport = page.getByTestId("model-carousel-viewport")
    const modelSlides = modelViewport.locator('[aria-roledescription="slide"]')
    await modelViewport.scrollIntoViewIfNeeded()

    await dragToNext(page, modelViewport)
    await page.waitForTimeout(500)
    const modelRatio = await getMaxIntersectionRatio(modelViewport, modelSlides)
    expect(modelRatio).toBeGreaterThanOrEqual(MIN_FULL_SLIDE_RATIO)

    const testimonialViewport = page.getByTestId("testimonial-carousel-viewport")
    const testimonialSlides = testimonialViewport.locator('[aria-roledescription="slide"]')
    await testimonialViewport.scrollIntoViewIfNeeded()

    await dragToNext(page, testimonialViewport)
    await page.waitForTimeout(500)
    const testimonialRatio = await getMaxIntersectionRatio(testimonialViewport, testimonialSlides)
    expect(testimonialRatio).toBeGreaterThanOrEqual(MIN_FULL_SLIDE_RATIO)
  })

  test("gallery sliders snap to a full slide", async ({ page }) => {
    await page.goto("/experiences")
    await page.waitForLoadState("domcontentloaded")

    const carousel = page.locator('[aria-roledescription="carousel"]').first()
    const viewport = carousel.locator('[data-slot="carousel-viewport"]')
    const slides = carousel.locator('[aria-roledescription="slide"]')

    await viewport.scrollIntoViewIfNeeded()
    await dragToNext(page, viewport)
    await page.waitForTimeout(400)
    const ratio = await getMaxIntersectionRatio(viewport, slides)
    expect(ratio).toBeGreaterThanOrEqual(MIN_FULL_SLIDE_RATIO)

    await page.goto("/book")
    await page.waitForLoadState("domcontentloaded")

    const bookCarousel = page.locator('[aria-roledescription="carousel"]').first()
    const bookViewport = bookCarousel.locator('[data-slot="carousel-viewport"]')
    const bookSlides = bookCarousel.locator('[aria-roledescription="slide"]')

    await bookViewport.scrollIntoViewIfNeeded()
    await dragToNext(page, bookViewport)
    await page.waitForTimeout(400)
    const bookRatio = await getMaxIntersectionRatio(bookViewport, bookSlides)
    expect(bookRatio).toBeGreaterThanOrEqual(MIN_FULL_SLIDE_RATIO)
  })
})
