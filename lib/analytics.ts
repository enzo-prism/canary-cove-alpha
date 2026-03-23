import { sendGoogleAnalyticsEvent, type GoogleAnalyticsPayload } from "@/lib/google-analytics"

export type AnalyticsPayload = GoogleAnalyticsPayload

export function trackEvent(name: string, payload?: AnalyticsPayload) {
  if (typeof window === "undefined") return
  const va = (window as typeof window & { va?: (type: string, event: AnalyticsPayload) => void }).va
  if (typeof va === "function") {
    va("event", { name, ...payload })
  }

  sendGoogleAnalyticsEvent(name, payload)
}
