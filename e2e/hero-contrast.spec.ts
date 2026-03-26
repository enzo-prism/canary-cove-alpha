import { expect, test } from "@playwright/test"

test("hero intro copy stays readable on the base background", async ({ page }) => {
  await page.goto("/")
  await page.waitForLoadState("domcontentloaded")

  const copy = page.getByTestId("hero-copy")
  await expect(copy).toBeVisible()

  const { headlineContrast, subheadContrast, copyBackground, overlayBackground } = await page.evaluate(() => {
    const toRgb = (value: string) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        throw new Error("Canvas context unavailable")
      }
      ctx.fillStyle = value
      const normalized = ctx.fillStyle
      const rgbMatch = normalized.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
      if (rgbMatch) {
        return { r: Number(rgbMatch[1]), g: Number(rgbMatch[2]), b: Number(rgbMatch[3]) }
      }

      const hexMatch = normalized.match(/^#([\da-f]{3}|[\da-f]{6})$/i)
      if (hexMatch) {
        const hex = hexMatch[1]
        const expanded = hex.length === 3 ? hex.split("").map((char) => `${char}${char}`).join("") : hex
        return {
          r: Number.parseInt(expanded.slice(0, 2), 16),
          g: Number.parseInt(expanded.slice(2, 4), 16),
          b: Number.parseInt(expanded.slice(4, 6), 16),
        }
      }

      const labMatch = normalized.match(/lab\(\s*([\d.]+)\s+([-\d.]+)\s+([-\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/)
      if (labMatch) {
        const l = Number(labMatch[1])
        const a = Number(labMatch[2])
        const b = Number(labMatch[3])

        const fy = (l + 16) / 116
        const fx = fy + a / 500
        const fz = fy - b / 200

        const epsilon = 216 / 24389
        const kappa = 24389 / 27

        const fx3 = Math.pow(fx, 3)
        const fz3 = Math.pow(fz, 3)
        const xr = fx3 > epsilon ? fx3 : (116 * fx - 16) / kappa
        const yr = l > kappa * epsilon ? Math.pow((l + 16) / 116, 3) : l / kappa
        const zr = fz3 > epsilon ? fz3 : (116 * fz - 16) / kappa

        const Xn = 96.4212
        const Yn = 100.0
        const Zn = 82.5188

        let X = xr * Xn
        let Y = yr * Yn
        let Z = zr * Zn

        const x = (0.9555766 * X + -0.0230393 * Y + 0.0631636 * Z) / 100
        const y = (-0.0282895 * X + 1.0099416 * Y + 0.0210077 * Z) / 100
        const z = (0.0122982 * X + -0.0204830 * Y + 1.3299098 * Z) / 100

        const toSrgb = (channel: number) => {
          const clamped = Math.min(Math.max(channel, 0), 1)
          return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055
        }

        const r = Math.round(toSrgb(3.2406 * x + -1.5372 * y + -0.4986 * z) * 255)
        const g = Math.round(toSrgb(-0.9689 * x + 1.8758 * y + 0.0415 * z) * 255)
        const bRgb = Math.round(toSrgb(0.0557 * x + -0.2040 * y + 1.0570 * z) * 255)

        return { r, g, b: bRgb }
      }

      throw new Error(`Unexpected color format: ${normalized}`)
    }

    const toLinear = (channel: number) => {
      const value = channel / 255
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)
    }

    const luminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
      const rLin = toLinear(r)
      const gLin = toLinear(g)
      const bLin = toLinear(b)
      return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin
    }

    const contrastRatio = (foreground: { r: number; g: number; b: number }, background: { r: number; g: number; b: number }) => {
      const l1 = luminance(foreground)
      const l2 = luminance(background)
      const lighter = Math.max(l1, l2)
      const darker = Math.min(l1, l2)
      return (lighter + 0.05) / (darker + 0.05)
    }

    const copy = document.querySelector<HTMLElement>('[data-testid="hero-copy"]')
    const headline = document.querySelector<HTMLElement>('[data-testid="hero-headline"]')
    const subhead = document.querySelector<HTMLElement>('[data-testid="hero-subhead"]')
    const overlay = document.querySelector<HTMLElement>('[data-testid="hero-contrast-overlay"]')
    if (!copy || !headline || !subhead || !overlay) {
      throw new Error("Required hero elements missing")
    }

    const background = toRgb(getComputedStyle(copy).backgroundColor)
    const headlineColor = toRgb(getComputedStyle(headline).color)
    const subheadColor = toRgb(getComputedStyle(subhead).color)
    const copyBackground = getComputedStyle(copy).backgroundColor
    const overlayBackground = getComputedStyle(overlay).backgroundImage

    return {
      headlineContrast: contrastRatio(headlineColor, background),
      subheadContrast: contrastRatio(subheadColor, background),
      copyBackground,
      overlayBackground,
    }
  })

  expect(headlineContrast).toBeGreaterThanOrEqual(7)
  expect(subheadContrast).toBeGreaterThanOrEqual(4.5)
  expect(copyBackground).not.toBe("rgba(0, 0, 0, 0)")
  expect(overlayBackground).toContain("gradient")
})
