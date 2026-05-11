import { track } from "@vercel/analytics"

import { sendGoogleAnalyticsEvent, type GoogleAnalyticsPayload } from "@/lib/google-analytics"
import { LEAD_FORM_CONFIG, type LeadFormKey } from "@/lib/lead-forms"
import { sanitizeAnalyticsUrl, sanitizeVercelAnalyticsPayload } from "@/lib/vercel-analytics"

type AnalyticsValue = string | number | boolean | null | undefined

export type AnalyticsPayload = Record<string, AnalyticsValue>

const urlLikePayloadKeys = new Set(["destination", "href", "page", "path", "target", "url"])

function normalizePayload(payload?: AnalyticsPayload) {
  if (!payload) return undefined

  const entries = Object.entries(payload)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => [key, typeof value === "string" && urlLikePayloadKeys.has(key) ? sanitizeAnalyticsUrl(value) : value])

  if (entries.length === 0) return undefined

  return Object.fromEntries(entries) as Record<string, string | number | boolean | null>
}

type TrackEventOptions = {
  sendGoogle?: boolean
  sendVercel?: boolean
  trackDerivedIntent?: boolean
}

function trackVercelEvent(name: string, payload?: AnalyticsPayload) {
  if (typeof window === "undefined") return

  track(name, sanitizeVercelAnalyticsPayload(payload))
}

function sendEvent(name: string, payload?: AnalyticsPayload, options?: TrackEventOptions) {
  if (typeof window === "undefined") return

  const normalizedPayload = normalizePayload(payload)

  if (options?.sendVercel !== false) {
    trackVercelEvent(name, normalizedPayload)
  }

  if (options?.sendGoogle !== false) {
    sendGoogleAnalyticsEvent(name, normalizedPayload as GoogleAnalyticsPayload | undefined)
  }
}

function getPathFromTarget(target: string) {
  if (target.startsWith("http://") || target.startsWith("https://")) {
    try {
      return new URL(target).pathname
    } catch {
      return sanitizeAnalyticsUrl(target)
    }
  }

  return sanitizeAnalyticsUrl(target)
}

function getLeadIntent(target: string) {
  const path = getPathFromTarget(target)
  if (path === "/book") return "book"
  if (path === "/contact") return "contact"
  return null
}

function trackDerivedLeadIntent(name: string, payload?: AnalyticsPayload) {
  if (!payload) return
  if (name !== "cta_click" && name !== "nav_click") return

  const target = typeof payload.target === "string" ? payload.target : typeof payload.destination === "string" ? payload.destination : null
  if (!target) return

  const intent = getLeadIntent(target)
  if (!intent) return

  const surface = typeof payload.location === "string" ? payload.location : typeof payload.surface === "string" ? payload.surface : "unknown"
  trackLeadIntent(intent, surface)
}

export function trackEvent(name: string, payload?: AnalyticsPayload, options?: TrackEventOptions) {
  sendEvent(name, payload, options)
  if (options?.trackDerivedIntent !== false) {
    trackDerivedLeadIntent(name, payload)
  }
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

export function trackReviewArchiveFilter(year: string) {
  trackEvent("review_archive_filter", { year })
}

export function trackReviewNoteOpen(year: string, visit: string) {
  trackEvent("review_note_open", { year, visit })
}

export function trackSectionJump(page: string, section: string) {
  trackEvent("section_jump", { page, section })
}

export function trackOutboundClick(location: string, target: string) {
  trackEvent("outbound_click", { location, target })
}

export function trackLeadIntent(intent: "book" | "contact", surface: string) {
  sendEvent("lead_intent", { intent, surface }, { trackDerivedIntent: false })
}

export function trackLeadConversion(
  form: LeadFormKey,
  surface = LEAD_FORM_CONFIG[form].surface,
  options?: TrackEventOptions,
) {
  const leadSource = LEAD_FORM_CONFIG[form].leadSource
  if (typeof window === "undefined") return

  if (options?.sendVercel !== false) {
    trackVercelEvent("lead_submit", { form, surface })
  }

  if (options?.sendGoogle !== false) {
    sendGoogleAnalyticsEvent("generate_lead", {
      form_name: form,
      lead_source: leadSource,
    })
  }
}
