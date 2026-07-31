import { expect, test, type Locator, type Page } from "@playwright/test"

const dragToNextSlide = async (page: Page, viewport: Locator) => {
  const box = await viewport.boundingBox()
  if (!box) {
    throw new Error("Unable to read lightbox bounding box.")
  }

  const startX = box.x + box.width * 0.8
  const endX = box.x + box.width * 0.2
  const y = box.y + box.height * 0.5

  await page.mouse.move(startX, y)
  await page.mouse.down()
  await page.mouse.move(endX, y, { steps: 12 })
  await page.mouse.up()
}

const openStayGalleryLightbox = async (page: Page) => {
  await page.goto("/stay")
  await page.waitForLoadState("domcontentloaded")

  const gallery = page.locator("#inside-the-villa")
  await gallery.scrollIntoViewIfNeeded()
  await gallery.getByRole("button", { name: "View photo:", exact: false }).first().click()

  const lightbox = page.getByTestId("photo-lightbox")
  await expect(lightbox).toBeVisible()
  return lightbox
}

test.describe("photo lightbox on touch devices", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true })

  test("opens from the stay gallery, swipes, and closes", async ({ page }) => {
    const lightbox = await openStayGalleryLightbox(page)

    await expect(lightbox).toContainText("1 / 9")

    await dragToNextSlide(page, lightbox)
    await expect(lightbox).toContainText("2 / 9")

    await lightbox.getByRole("button", { name: "Close gallery" }).click()
    await expect(lightbox).not.toBeVisible()
  })
})

test.describe("photo lightbox on desktop", () => {
  test.use({ viewport: { width: 1280, height: 900 }, hasTouch: false })

  test("navigates with arrow keys and closes with Escape", async ({ page }) => {
    const lightbox = await openStayGalleryLightbox(page)

    await expect(lightbox).toContainText("1 / 9")

    await page.keyboard.press("ArrowRight")
    await expect(lightbox).toContainText("2 / 9")

    await page.keyboard.press("ArrowLeft")
    await expect(lightbox).toContainText("1 / 9")

    await page.keyboard.press("Escape")
    await expect(lightbox).not.toBeVisible()
  })
})
