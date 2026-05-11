import type { BeforeSendEvent } from "@vercel/analytics/next"

type VercelAnalyticsValue = string | number | boolean | null

const VERCEL_ANALYTICS_MAX_CUSTOM_PROPERTIES = 2
const VERCEL_ANALYTICS_MAX_FIELD_LENGTH = 255
const urlLikePayloadKeys = new Set(["destination", "href", "page", "path", "target", "url"])

export function sanitizeAnalyticsUrl(url: string) {
  const [withoutHash] = url.split("#")
  const [withoutQuery] = withoutHash.split("?")
  return withoutQuery || url
}

export function sanitizeVercelAnalyticsPayload(payload?: Record<string, unknown>) {
  if (!payload) return undefined

  const entries: [string, VercelAnalyticsValue][] = []

  for (const [key, value] of Object.entries(payload)) {
    if (entries.length >= VERCEL_ANALYTICS_MAX_CUSTOM_PROPERTIES) break
    if (key.length === 0 || key.length > VERCEL_ANALYTICS_MAX_FIELD_LENGTH) continue
    if (value === undefined) continue
    if (value === null || typeof value === "number" || typeof value === "boolean") {
      entries.push([key, value])
      continue
    }
    if (typeof value !== "string") continue

    const sanitizedValue = urlLikePayloadKeys.has(key) ? sanitizeAnalyticsUrl(value) : value
    if (sanitizedValue.length === 0 || sanitizedValue.length > VERCEL_ANALYTICS_MAX_FIELD_LENGTH) continue
    entries.push([key, sanitizedValue])
  }

  return entries.length > 0 ? Object.fromEntries(entries) : undefined
}

export function sanitizeVercelAnalyticsEvent(event: BeforeSendEvent): BeforeSendEvent {
  return {
    ...event,
    url: sanitizeAnalyticsUrl(event.url),
  }
}
