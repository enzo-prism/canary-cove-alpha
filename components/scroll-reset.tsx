"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollReset() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.location.hash) return
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [pathname])

  return null
}
