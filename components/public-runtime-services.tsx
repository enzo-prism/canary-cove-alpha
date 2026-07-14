"use client"

import { usePathname } from "next/navigation"

import { ElevenLabsConvaiWidget } from "@/components/elevenlabs-convai-widget"
import { GoogleAnalyticsPageviews } from "@/components/google-analytics-pageviews"
import { GoogleAnalyticsScripts } from "@/components/google-analytics-scripts"
import { VercelAnalytics } from "@/components/vercel-analytics"

export default function PublicRuntimeServices() {
  const pathname = usePathname()
  if (pathname.startsWith("/guest")) return null

  return (
    <>
      <GoogleAnalyticsScripts />
      <GoogleAnalyticsPageviews />
      <VercelAnalytics />
      <ElevenLabsConvaiWidget />
    </>
  )
}
