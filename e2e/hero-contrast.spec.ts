import { expect, test } from "@playwright/test"

const parseColor = (value: string) => {
  const rgbMatch = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (rgbMatch) {
    return {
      mode: "rgb",
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
      alpha: rgbMatch[4] ? Number(rgbMatch[4]) : 1,
    }
  }

  const oklabMatch = value.match(/oklab\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/)
  if (oklabMatch) {
    return {
      mode: "oklab",
      l: Number(oklabMatch[1]),
      a: Number(oklabMatch[2]),
      b: Number(oklabMatch[3]),
      alpha: oklabMatch[4] ? Number(oklabMatch[4]) : 1,
    }
  }

  const oklchMatch = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/)
  if (oklchMatch) {
    return {
      mode: "oklch",
      l: Number(oklchMatch[1]),
      c: Number(oklchMatch[2]),
      h: Number(oklchMatch[3]),
      alpha: oklchMatch[4] ? Number(oklchMatch[4]) : 1,
    }
  }

  throw new Error(`Unexpected color format: ${value}`)
}

test("hero copy keeps strong contrast backing", async ({ page }) => {
  await page.goto("/")
  await page.waitForLoadState("domcontentloaded")

  const copy = page.getByTestId("hero-copy")
  await expect(copy).toBeVisible()

  const backgroundColor = await copy.evaluate((el) => getComputedStyle(el).backgroundColor)
  const parsed = parseColor(backgroundColor)
  if (parsed.mode === "rgb") {
    expect(parsed.r).toBe(0)
    expect(parsed.g).toBe(0)
    expect(parsed.b).toBe(0)
    expect(parsed.alpha).toBeGreaterThan(0.45)
  } else if (parsed.mode === "oklab") {
    expect(parsed.l).toBeLessThanOrEqual(0.01)
    expect(Math.abs(parsed.a)).toBeLessThanOrEqual(0.01)
    expect(Math.abs(parsed.b)).toBeLessThanOrEqual(0.01)
    expect(parsed.alpha).toBeGreaterThan(0.45)
  } else {
    expect(parsed.l).toBeLessThanOrEqual(0.01)
    expect(parsed.c).toBeLessThanOrEqual(0.01)
    expect(parsed.alpha).toBeGreaterThan(0.45)
  }

  const headline = page.getByTestId("hero-headline")
  const headlineColor = await headline.evaluate((el) => getComputedStyle(el).color)
  expect(headlineColor).toBe("rgb(255, 255, 255)")

  const overlay = page.getByTestId("hero-contrast-overlay")
  const overlayBackground = await overlay.evaluate((el) => getComputedStyle(el).backgroundImage)
  expect(overlayBackground).toContain("gradient")
})
