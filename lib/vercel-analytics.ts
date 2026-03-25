import type { BeforeSendEvent } from "@vercel/analytics/next"

export function sanitizeAnalyticsUrl(url: string) {
  const [withoutHash] = url.split("#")
  const [withoutQuery] = withoutHash.split("?")
  return withoutQuery || url
}

export function sanitizeVercelAnalyticsEvent(event: BeforeSendEvent): BeforeSendEvent {
  return {
    ...event,
    url: sanitizeAnalyticsUrl(event.url),
  }
}
