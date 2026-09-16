"use client"

import { useLayoutEffect } from "react"
import { usePathname } from "next/navigation"

import { ElevenLabsConvaiWidget } from "@/components/elevenlabs-convai-widget"
import { GoogleAnalyticsPageviews } from "@/components/google-analytics-pageviews"
import { GoogleAnalyticsScripts } from "@/components/google-analytics-scripts"
import { VercelAnalytics } from "@/components/vercel-analytics"
import { GOOGLE_ANALYTICS_ID } from "@/lib/google-analytics"
import { isInquiryPath } from "@/lib/inquiry"

const PRIVATE_RUNTIME_SELECTOR = [
  'script[src*="googletagmanager.com"]',
  "script#google-analytics",
  'script[src*="elevenlabs"]',
  'script[src*="/_vercel/insights"]',
  'script[src*="va.vercel-scripts.com"]',
  "elevenlabs-convai",
].join(",")

const isPrivatePath = () => window.location.pathname === "/guest" || window.location.pathname.startsWith("/guest/")

const isPrivateTrackerRequest = (input: RequestInfo | URL) => {
  const value = input instanceof Request ? input.url : input.toString()
  const url = new URL(value, window.location.origin)
  return (
    url.pathname.startsWith("/_vercel/insights") ||
    url.hostname.includes("google-analytics.com") ||
    url.hostname.includes("googletagmanager.com") ||
    url.hostname.includes("elevenlabs") ||
    url.hostname.includes("vercel-insights.com") ||
    url.hostname.includes("vercel-scripts.com")
  )
}

function PrivateNetworkBoundary() {
  useLayoutEffect(() => {
    const originalFetch = window.fetch.bind(window)
    const originalSendBeacon = navigator.sendBeacon.bind(navigator)

    window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
      if (isPrivatePath() && isPrivateTrackerRequest(input)) {
        return Promise.resolve(new Response(null, { status: 204 }))
      }
      return originalFetch(input, init)
    }) as typeof window.fetch

    navigator.sendBeacon = ((url: string | URL, data?: BodyInit | null) => {
      if (isPrivatePath() && isPrivateTrackerRequest(url)) return false
      return originalSendBeacon(url, data)
    }) as typeof navigator.sendBeacon

    return () => {
      window.fetch = originalFetch
      navigator.sendBeacon = originalSendBeacon
    }
  }, [])

  return null
}

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

function InquiryPageDockGuard({ active }: { active: boolean }) {
  useLayoutEffect(() => {
    if (active) {
      document.body.dataset.inquiryPage = "true"
    } else {
      delete document.body.dataset.inquiryPage
    }

    return () => {
      delete document.body.dataset.inquiryPage
    }
  }, [active])

  return null
}

export default function PublicRuntimeServices() {
  const pathname = usePathname()
  const hideConciergeDock = isInquiryPath(pathname)

  if (pathname.startsWith("/guest")) {
    return (
      <>
        <PrivateNetworkBoundary />
        <PrivateRuntimeCleanup />
      </>
    )
  }

  return (
    <>
      <InquiryPageDockGuard active={hideConciergeDock} />
      <PrivateNetworkBoundary />
      <PublicUnloadPrivacyGuard />
      <GoogleAnalyticsScripts />
      <GoogleAnalyticsPageviews />
      <VercelAnalytics />
      {hideConciergeDock ? null : <ElevenLabsConvaiWidget />}
    </>
  )
}
