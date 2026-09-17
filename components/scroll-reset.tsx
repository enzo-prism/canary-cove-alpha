"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function ScrollReset() {
  const pathname = usePathname()
  const settledPathname = useRef<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.location.hash) return
    // Only reset on actual route changes. Firing on initial mount races
    // anything that scrolls during load (deep programmatic scrolls, test
    // setup): the effect can flush after the scroll and yank the page back
    // to the top. A fresh load already starts at the top.
    if (settledPathname.current === null) {
      settledPathname.current = pathname
      return
    }
    if (pathname === settledPathname.current) return
    settledPathname.current = pathname
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [pathname])

  return null
}
