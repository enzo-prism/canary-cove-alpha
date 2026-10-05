"use client"

import { useEffect } from "react"
import Lenis from "lenis"

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

/**
 * Inertial wheel scrolling on desktop pointers. It drives the real window
 * scroll position (no wrapper element), so sticky positioning, anchors,
 * IntersectionObservers and window.scrollY behave exactly as they do natively.
 * Skipped for touch input, reduced motion and automated browsers, and paused
 * whenever a modal (Radix scroll lock, mobile menu) owns the page.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (navigator.webdriver) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!window.matchMedia("(pointer: fine)").matches) return

    const lenis = new Lenis({
      lerp: 0.11,
      wheelMultiplier: 1,
      smoothWheel: true,
      anchors: { offset: 0 },
      prevent: (node: HTMLElement) =>
        Boolean(
          node.closest?.(
            "[data-lenis-prevent], [role='dialog'], [role='alertdialog'], [role='listbox'], [data-radix-popper-content-wrapper]",
          ),
        ),
    })
    window.__lenis = lenis

    const sync = () => {
      const body = document.body
      const locked = body.hasAttribute("data-scroll-locked") || body.dataset.mobileNavOpen === "true"
      if (locked) lenis.stop()
      else lenis.start()
    }
    const mo = new MutationObserver(sync)
    mo.observe(document.body, { attributes: true, attributeFilter: ["data-scroll-locked", "data-mobile-nav-open"] })

    return () => {
      mo.disconnect()
      lenis.destroy()
      if (window.__lenis === lenis) delete window.__lenis
    }
  }, [])

  return null
}
