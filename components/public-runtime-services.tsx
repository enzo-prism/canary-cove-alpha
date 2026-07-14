"use client"

import { useLayoutEffect } from "react"
import { usePathname } from "next/navigation"

import { ElevenLabsConvaiWidget } from "@/components/elevenlabs-convai-widget"
import { GoogleAnalyticsPageviews } from "@/components/google-analytics-pageviews"
import { GoogleAnalyticsScripts } from "@/components/google-analytics-scripts"
import { VercelAnalytics } from "@/components/vercel-analytics"
import { GOOGLE_ANALYTICS_ID } from "@/lib/google-analytics"

const PRIVATE_RUNTIME_SELECTOR = [
  'script[src*="googletagmanager.com"]',
  "script#google-analytics",
  'script[src*="elevenlabs"]',
  'script[src*="/_vercel/insights"]',
  'script[src*="va.vercel-scripts.com"]',
  "elevenlabs-convai",
].join(",")

function PublicUnloadPrivacyGuard() {
  useLayoutEffect(() => {
    const disableTrackersBeforeNavigation = () => {
      ;(window as unknown as Record<string, unknown>)[`ga-disable-${GOOGLE_ANALYTICS_ID}`] = true
      window.dataLayer = []
      window.gtag = (() => undefined) as typeof window.gtag
      window.va = () => undefined
      window.vaq = []
    }

    window.addEventListener("beforeunload", disableTrackersBeforeNavigation, { capture: true })
    return () => window.removeEventListener("beforeunload", disableTrackersBeforeNavigation, { capture: true })
  }, [])

  return null
}

function PrivateRuntimeCleanup() {
  useLayoutEffect(() => {
    const previousDataLayer = window.dataLayer
    const previousGtag = window.gtag
    const previousVa = window.va
    const previousVaq = window.vaq

    window.dataLayer = []
    window.gtag = (() => undefined) as typeof window.gtag
    window.va = () => undefined
    window.vaq = []

    const removePublicRuntimeNodes = () => {
      document.querySelectorAll(PRIVATE_RUNTIME_SELECTOR).forEach((node) => node.remove())
    }

    removePublicRuntimeNodes()
    const observer = new MutationObserver(removePublicRuntimeNodes)
    observer.observe(document.documentElement, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      window.dataLayer = previousDataLayer
      window.gtag = previousGtag
      window.va = previousVa
      window.vaq = previousVaq
    }
  }, [])

  return null
}

export default function PublicRuntimeServices() {
  const pathname = usePathname()
  if (pathname.startsWith("/guest")) return <PrivateRuntimeCleanup />

  return (
    <>
      <PublicUnloadPrivacyGuard />
      <GoogleAnalyticsScripts />
      <GoogleAnalyticsPageviews />
      <VercelAnalytics />
      <ElevenLabsConvaiWidget />
    </>
  )
}
