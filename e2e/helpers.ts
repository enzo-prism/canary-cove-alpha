import { expect, type Locator, type Page } from "@playwright/test"

export const SITE_ROUTES = [
  "/",
  "/stay",
  "/experiences",
  "/dining",
  "/adventures",
  "/reviews",
  "/getting-here",
  "/rates",
  "/book",
  "/contact",
  "/privacy",
  "/terms",
] as const

export const CORE_VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
] as const

export const waitForPageReady = async (page: Page) => {
  await page.waitForLoadState("domcontentloaded")
  await page.evaluate(() => document.fonts.ready)
  // Header hydration/ResizeObserver replaces the server's height estimate.
  // Wait for that measured layout before testing geometry or pointer targets.
  await expect.poll(() => page.evaluate(() => {
    const header = document.querySelector("header")
    if (!header) return 0
    const publishedHeight = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--site-header-height"),
    )
    if (!Number.isFinite(publishedHeight)) return Number.POSITIVE_INFINITY
    return Math.abs(header.getBoundingClientRect().height - publishedHeight)
  })).toBeLessThanOrEqual(1)
}

export const installErrorCollectors = (page: Page) => {
  const consoleErrors: string[] = []
  const pageErrors: string[] = []
  const failedRequests: string[] = []

  page.on("console", (message) => {
    if (message.type() !== "error") return
    const text = message.text()
    const location = message.location().url
    if (text.includes("Download the React DevTools")) return
    if (location.includes("https://va.vercel-scripts.com/v1/script.debug.js")) return
    if (location.includes("https://www.googletagmanager.com/gtag/js")) return
    if (location.includes("https://www.google-analytics.com/g/collect")) return
    if (text.includes("https://www.googletagmanager.com/gtag/js")) return
    if (text.includes("https://www.google-analytics.com/g/collect")) return
    // Calendar outages intentionally return 502/503 and render the tested
    // request-form fallback, rather than an empty calendar of open dates.
    if (location.endsWith("/api/availability") && /502|503/.test(text)) return
    consoleErrors.push(text)
  })

  page.on("pageerror", (error) => {
    pageErrors.push(error.message)
  })

  page.on("requestfailed", (request) => {
    const resourceType = request.resourceType()
    const url = request.url()
    const failureText = request.failure()?.errorText ?? "unknown error"
    if (resourceType === "media") return
    if (url.includes("https://va.vercel-scripts.com/v1/script.debug.js")) return
    if (url.includes("https://www.googletagmanager.com/gtag/js")) return
    if (url.includes("https://www.google-analytics.com/g/collect")) return
    if (failureText === "cancelled" && url.includes("res.cloudinary.com") && url.endsWith(".mp4")) return
    // WebKit reports aborted local video preload requests as "other".
    if (failureText === "cancelled" && new URL(url).pathname.startsWith("/videos/reef-encounters/") && url.endsWith(".mp4")) return
    failedRequests.push(`${resourceType}: ${url} -> ${failureText}`)
  })

  return {
    assertNoErrors() {
      expect(
        {
          consoleErrors,
          pageErrors,
          failedRequests,
        },
        "Expected the page to load without console errors, page errors, or failed requests.",
      ).toEqual({
        consoleErrors: [],
        pageErrors: [],
        failedRequests: [],
      })
    },
  }
}

export const hideDevArtifactsForVisuals = async (page: Page) => {
  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }

      video,
      nextjs-portal,
      [aria-label="Open Next.js Dev Tools"],
      [data-volatile] {
        visibility: hidden !important;
      }

      /* display:none (not visibility) so the sticky bar neither overlaps the
         capture nor shifts it: its scroll-shrink feedback loop otherwise moves
         edge-aligned elements by 8px between runs. */
      header {
        display: none !important;
      }
    `,
  })
}

export const expectTapTarget = async (locator: Locator) => {
  const box = await locator.boundingBox()
  expect(box).not.toBeNull()
  if (!box) return

  expect(box.width).toBeGreaterThanOrEqual(44)
  expect(box.height).toBeGreaterThanOrEqual(44)
}

export const selectRadixOption = async (page: Page, triggerLabel: string, optionText: string) => {
  await page.getByLabel(triggerLabel).click()
  await page.getByRole("option", { name: optionText }).click()
}
