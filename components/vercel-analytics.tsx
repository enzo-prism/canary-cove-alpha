"use client"

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next"

import { sanitizeVercelAnalyticsEvent } from "@/lib/vercel-analytics"

export function VercelAnalytics() {
  return <Analytics beforeSend={(event: BeforeSendEvent) => sanitizeVercelAnalyticsEvent(event)} />
}
