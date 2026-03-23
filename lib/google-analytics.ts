export const GOOGLE_ANALYTICS_ID = "G-JD6CV2CFYS"

export type GoogleAnalyticsPayload = Record<string, string | number | boolean | null | undefined>

type GoogleAnalyticsConfig = {
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

export function sendGoogleAnalyticsEvent(name: string, payload?: GoogleAnalyticsPayload) {
  if (typeof window === "undefined") return
  if (typeof window.gtag !== "function") return

  window.gtag("event", name, payload)
}
