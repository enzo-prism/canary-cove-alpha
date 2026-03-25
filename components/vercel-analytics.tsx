"use client"

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/react"

import { sanitizeVercelAnalyticsEvent } from "@/lib/vercel-analytics"

export function VercelAnalytics() {
  return <Analytics beforeSend={(event: BeforeSendEvent) => sanitizeVercelAnalyticsEvent(event)} />
}
