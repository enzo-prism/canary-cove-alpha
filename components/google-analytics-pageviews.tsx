"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { sendGoogleAnalyticsPageView } from "@/lib/google-analytics"

export function GoogleAnalyticsPageviews() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === "undefined") return

    sendGoogleAnalyticsPageView(window.location.href, document.title)
  }, [pathname])

  return null
}
