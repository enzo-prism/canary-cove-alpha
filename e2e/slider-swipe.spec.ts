import { expect, test, type Locator, type Page } from "@playwright/test"

const dragToNextSlide = async (page: Page, viewport: Locator) => {
  const box = await viewport.boundingBox()
  if (!box) {
    throw new Error("Unable to read carousel bounding box.")
  }

  const startX = box.x + box.width * 0.8
  const endX = box.x + box.width * 0.2
  const y = box.y + box.height * 0.5

  await page.mouse.move(startX, y)
  await page.mouse.down()
  await page.mouse.move(endX, y, { steps: 12 })
  await page.mouse.up()
}

const wheelToNextSlide = async (page: Page, viewport: Locator) => {
  const box = await viewport.boundingBox()
  if (!box) {
    throw new Error("Unable to read carousel bounding box.")
  }

  const x = box.x + box.width * 0.6
  const y = box.y + box.height * 0.5
  await page.mouse.move(x, y)
  await page.mouse.wheel(420, 0)
}

test.describe("carousel swipe gestures", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true })

  test("home sliders respond to swipe", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("domcontentloaded")
    await page.evaluate(() => document.fonts.ready)

    const modelViewport = page.getByTestId("model-carousel-viewport")
    await modelViewport.scrollIntoViewIfNeeded()

    const modelDotOne = page.getByRole("button", { name: "Go to Main Villa" })
    const modelDotTwo = page.getByRole("button", { name: "Go to King Suites" })

    await expect(modelDotOne).toHaveClass(/bg-foreground/)
    await dragToNextSlide(page, modelViewport)
    await expect(modelDotTwo).toHaveClass(/bg-foreground/)

    const testimonialViewport = page.getByTestId("testimonial-carousel-viewport")
    await testimonialViewport.scrollIntoViewIfNeeded()

    const testimonialDotOne = page.getByRole("button", { name: "Go to testimonial 1", exact: true })
    const testimonialDotTwo = page.getByRole("button", { name: "Go to testimonial 2", exact: true })

    await expect(testimonialDotOne).toHaveClass(/bg-foreground/)
    await dragToNextSlide(page, testimonialViewport)
    await expect(testimonialDotTwo).toHaveClass(/bg-foreground/)
  })

  test("experiences mini gallery responds to swipe", async ({ page }) => {
    await page.goto("/stay")
    await page.waitForLoadState("domcontentloaded")

    const carousel = page.getByTestId("stay-mini-gallery").locator('[aria-roledescription="carousel"]')
    const viewport = carousel.locator('[data-slot="carousel-viewport"]')
    await viewport.scrollIntoViewIfNeeded()

    const dotOne = page.getByRole("button", { name: "Go to slide 1", exact: true })
    const dotTwo = page.getByRole("button", { name: "Go to slide 2", exact: true })

    await expect(dotOne).toHaveClass(/bg-foreground/)
    await dragToNextSlide(page, viewport)
    await expect(dotTwo).toHaveClass(/bg-foreground/)
  })

  test("photo carousel responds to swipe", async ({ page }) => {
    await page.goto("/book")
    await page.waitForLoadState("domcontentloaded")

    const carousel = page.locator('[aria-roledescription="carousel"]').first()
    const viewport = carousel.locator('[data-slot="carousel-viewport"]')
    await viewport.scrollIntoViewIfNeeded()

    const thumbOne = page.getByRole("button", { name: "Go to slide 1", exact: true })
    const thumbTwo = page.getByRole("button", { name: "Go to slide 2", exact: true })

    await expect(thumbOne).toHaveClass(/ring-2/)
    await dragToNextSlide(page, viewport)
    await expect(thumbTwo).toHaveClass(/ring-2/)
  })
})

test.describe("desktop carousel gestures", () => {
  test.use({ viewport: { width: 1280, height: 900 }, hasTouch: false })

  test("home sliders respond to trackpad wheel", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("domcontentloaded")
    await page.evaluate(() => document.fonts.ready)
    const startUrl = page.url()

    const modelViewport = page.getByTestId("model-carousel-viewport")
    await modelViewport.scrollIntoViewIfNeeded()

    const modelDotOne = page.getByRole("button", { name: "Go to Main Villa", exact: true })
    const modelDotTwo = page.getByRole("button", { name: "Go to King Suites", exact: true })

    await expect(modelDotOne).toHaveClass(/bg-foreground/)
    await wheelToNextSlide(page, modelViewport)
    await expect(page).toHaveURL(startUrl)
    await expect(modelDotTwo).toHaveClass(/bg-foreground/)

    const testimonialViewport = page.getByTestId("testimonial-carousel-viewport")
    await testimonialViewport.scrollIntoViewIfNeeded()

    const testimonialDotOne = page.getByRole("button", { name: "Go to testimonial 1", exact: true })
    const testimonialDotTwo = page.getByRole("button", { name: "Go to testimonial 2", exact: true })

    await expect(testimonialDotOne).toHaveClass(/bg-foreground/)
    await wheelToNextSlide(page, testimonialViewport)
    await expect(page).toHaveURL(startUrl)
    await expect(testimonialDotTwo).toHaveClass(/bg-foreground/)
  })

  test("other sliders respond to trackpad wheel", async ({ page }) => {
    await page.goto("/stay")
    await page.waitForLoadState("domcontentloaded")
    const stayUrl = page.url()

    const carousel = page.getByTestId("stay-mini-gallery").locator('[aria-roledescription="carousel"]')
    const viewport = carousel.locator('[data-slot="carousel-viewport"]')
    await viewport.scrollIntoViewIfNeeded()

    const dotOne = page.getByRole("button", { name: "Go to slide 1", exact: true })
    const dotTwo = page.getByRole("button", { name: "Go to slide 2", exact: true })

    await expect(dotOne).toHaveClass(/bg-foreground/)
    await wheelToNextSlide(page, viewport)
    await expect(page).toHaveURL(stayUrl)
    await expect(dotTwo).toHaveClass(/bg-foreground/)

    await page.goto("/book")
    await page.waitForLoadState("domcontentloaded")
    const bookUrl = page.url()

    const bookCarousel = page.locator('[aria-roledescription="carousel"]').first()
    const bookViewport = bookCarousel.locator('[data-slot="carousel-viewport"]')
    await bookViewport.scrollIntoViewIfNeeded()

    const thumbOne = page.getByRole("button", { name: "Go to slide 1", exact: true })
    const thumbTwo = page.getByRole("button", { name: "Go to slide 2", exact: true })

    await expect(thumbOne).toHaveClass(/ring-2/)
    await wheelToNextSlide(page, bookViewport)
    await expect(page).toHaveURL(bookUrl)
    await expect(thumbTwo).toHaveClass(/ring-2/)
  })
})

test.describe("keyboard slider navigation", () => {
  test.use({ viewport: { width: 1280, height: 900 }, hasTouch: false })

  test("home sliders respond to arrow keys", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("domcontentloaded")
    await page.evaluate(() => document.fonts.ready)

    const modelViewport = page.getByTestId("model-carousel-viewport")
    await modelViewport.scrollIntoViewIfNeeded()
    await modelViewport.focus()

    const modelDotOne = page.getByRole("button", { name: "Go to Main Villa", exact: true })
    const modelDotTwo = page.getByRole("button", { name: "Go to King Suites", exact: true })

    await expect(modelDotOne).toHaveClass(/bg-foreground/)
    await page.keyboard.press("ArrowRight")
    await expect(modelDotTwo).toHaveClass(/bg-foreground/)

    const testimonialViewport = page.getByTestId("testimonial-carousel-viewport")
    await testimonialViewport.scrollIntoViewIfNeeded()
    await testimonialViewport.focus()

    const testimonialDotOne = page.getByRole("button", { name: "Go to testimonial 1", exact: true })
    const testimonialDotTwo = page.getByRole("button", { name: "Go to testimonial 2", exact: true })

    await expect(testimonialDotOne).toHaveClass(/bg-foreground/)
    await page.keyboard.press("ArrowRight")
    await expect(testimonialDotTwo).toHaveClass(/bg-foreground/)
  })

  test("carousel component responds to arrow keys", async ({ page }) => {
    await page.goto("/stay")
    await page.waitForLoadState("domcontentloaded")

    const carousel = page.getByTestId("stay-mini-gallery").locator('[aria-roledescription="carousel"]')
    await carousel.scrollIntoViewIfNeeded()
    await carousel.focus()

    const dotOne = page.getByRole("button", { name: "Go to slide 1", exact: true })
    const dotTwo = page.getByRole("button", { name: "Go to slide 2", exact: true })

    await expect(dotOne).toHaveClass(/bg-foreground/)
    await page.keyboard.press("ArrowRight")
    await expect(dotTwo).toHaveClass(/bg-foreground/)

    await page.goto("/book")
    await page.waitForLoadState("domcontentloaded")

    const bookCarousel = page.locator('[aria-roledescription="carousel"]').first()
    await bookCarousel.scrollIntoViewIfNeeded()
    await bookCarousel.focus()

    const thumbOne = page.getByRole("button", { name: "Go to slide 1", exact: true })
    const thumbTwo = page.getByRole("button", { name: "Go to slide 2", exact: true })

    await expect(thumbOne).toHaveClass(/ring-2/)
    await page.keyboard.press("ArrowRight")
    await expect(thumbTwo).toHaveClass(/ring-2/)
  })
})
