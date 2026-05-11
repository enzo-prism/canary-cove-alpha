"use client"

import { useEffect, useRef } from "react"

import { trackLeadIntent } from "@/lib/analytics"

export function AvailabilityCalendarIntentTracker() {
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = targetRef.current
    if (!target || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        trackLeadIntent("book", "availability_calendar")
        observer.disconnect()
      },
      { threshold: 0.5 },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return <div ref={targetRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />
}
