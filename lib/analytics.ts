import { track } from "@vercel/analytics"

import { sendGoogleAnalyticsEvent, type GoogleAnalyticsPayload } from "@/lib/google-analytics"

type AnalyticsValue = string | number | boolean | null | undefined

export type AnalyticsPayload = Record<string, AnalyticsValue>

function normalizePayload(payload?: AnalyticsPayload) {
  if (!payload) return undefined

  const entries = Object.entries(payload).filter(([, value]) => value !== undefined)
  if (entries.length === 0) return undefined

  return Object.fromEntries(entries) as Record<string, string | number | boolean | null>
}

export function trackEvent(name: string, payload?: AnalyticsPayload) {
  if (typeof window === "undefined") return

  const normalizedPayload = normalizePayload(payload)
  track(name, normalizedPayload)
  sendGoogleAnalyticsEvent(name, normalizedPayload as GoogleAnalyticsPayload | undefined)
}

export function trackCtaClick(location: string, target: string) {
  trackEvent("cta_click", { location, target })
}

export function trackFormSubmitAttempt(form: string) {
  trackEvent("form_submit_attempt", { form })
}

export function trackFormSubmitError(form: string, reason: string) {
  trackEvent("form_submit_error", { form, reason })
}

export function trackFormSubmitSuccess(form: string) {
  trackEvent("form_submit_success", { form })
}

export function trackNavClick(surface: string, destination: string) {
  trackEvent("nav_click", { surface, destination })
}

export function trackSearchOpen() {
  trackEvent("search_open")
}

export function trackSearchRefine(source: "chip" | "question", topic: string) {
  trackEvent("search_refine", { source, topic })
}

export function trackSearchResultClick(group: string, destination: string) {
  trackEvent("search_result_click", { group, destination })
}

export function trackSocialClick(network: string, surface: string) {
  trackEvent("social_click", { network, surface })
}
