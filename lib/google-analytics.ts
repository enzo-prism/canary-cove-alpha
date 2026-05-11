import { SITE_URL } from "@/lib/site-config"

export const GOOGLE_ANALYTICS_ID = "G-JD6CV2CFYS"

export type GoogleAnalyticsPayload = Record<string, string | number | boolean | null | undefined>

type GoogleAnalyticsConfig = {
  page_location?: string
  page_title?: string
  send_page_view?: boolean
}

type GoogleAnalyticsFn = {
  (command: "config", target: string, params?: GoogleAnalyticsConfig): void
  (command: "event", target: string, params?: GoogleAnalyticsPayload): void
  (command: "js", target: Date): void
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: GoogleAnalyticsFn
  }
}

const clickIdFields = new Set(["gclid", "gbraid", "wbraid"])

function queueGoogleAnalyticsEvent(name: string, payload?: GoogleAnalyticsPayload) {
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(["event", name, payload])
}

export function buildGoogleAnalyticsPageLocation(sourceUrl: string, canonicalOrigin = SITE_URL) {
  const canonical = new URL(canonicalOrigin)
  const source = new URL(sourceUrl, canonical)
  const pageLocation = new URL(source.pathname, canonical)

  for (const [key, value] of source.searchParams.entries()) {
    if (key.startsWith("utm_") || clickIdFields.has(key)) {
      pageLocation.searchParams.append(key, value)
    }
  }

  return pageLocation.toString()
}

export function sendGoogleAnalyticsPageView(sourceUrl: string, pageTitle?: string) {
  if (typeof window === "undefined") return
  const payload = {
    page_location: buildGoogleAnalyticsPageLocation(sourceUrl),
    page_title: pageTitle,
  }

  if (typeof window.gtag !== "function") {
    queueGoogleAnalyticsEvent("page_view", payload)
    return
  }

  window.gtag("event", "page_view", payload)
}

export function sendGoogleAnalyticsEvent(name: string, payload?: GoogleAnalyticsPayload) {
  if (typeof window === "undefined") return
  if (typeof window.gtag !== "function") {
    queueGoogleAnalyticsEvent(name, payload)
    return
  }

  window.gtag("event", name, payload)
}
