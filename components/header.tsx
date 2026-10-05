"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"

import { BrandMark } from "@/components/brand-mark"
import { HeaderSearch } from "@/components/header-search"
import { DesktopNav } from "@/components/navigation/desktop-nav"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { LocalTime } from "@/components/motion/local-time"
import { ScrollProgress } from "@/components/motion/scroll-progress"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import { trackEvent, trackNavClick } from "@/lib/analytics"
import { NAV_ITEMS } from "@/lib/nav-items"
import { cn } from "@/lib/utils"

const normalizePath = (href: string) => {
  if (!href) return "/"
  const [path] = href.split("#")
  if (!path || path === "/") return "/"
  return path.endsWith("/") ? path.slice(0, -1) : path
}

export function Header() {
  const pathname = normalizePath(usePathname() ?? "/")
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null)
  const mobileSheetId = "mobile-nav-sheet"
  const bookCta = NAV_ITEMS.find((item) => item.type === "link" && item.cta)

  const isActive = useCallback(
    (href: string) => {
      const normalized = normalizePath(href)
      if (normalized === "/") return pathname === "/"
      return pathname === normalized || pathname.startsWith(`${normalized}/`)
    },
    [pathname],
  )

  useEffect(() => {
    // Hysteresis: shrink past 32px, expand again below 8px.
    const onScroll = () => setScrolled((prev) => (prev ? window.scrollY > 8 : window.scrollY > 32))
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // The header shrinks on scroll and is a different height on mobile, so
  // anything that pins itself below it has to track the live measurement
  // rather than hardcode an offset. Published as --site-header-height.
  useEffect(() => {
    const element = headerRef.current
    if (!element || typeof ResizeObserver === "undefined") return

    const publish = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${Math.round(element.getBoundingClientRect().height)}px`,
      )
    }
    publish()

    const observer = new ResizeObserver(publish)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    if (mobileOpen) {
      document.body.dataset.mobileNavOpen = "true"
    } else {
      delete document.body.dataset.mobileNavOpen
    }

    return () => {
      document.body.style.overflow = ""
      delete document.body.dataset.mobileNavOpen
    }
  }, [mobileOpen])

  // Client-side route changes (including back/forward swipes) never unmount
  // the header, so close the mobile menu explicitly when the route changes.
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleMobileOpenChange = (open: boolean) => {
    if (open && !mobileOpen) {
      trackEvent("nav_menu_open", { surface: "header_mobile" })
    }
    setMobileOpen(open)
  }

  return (
    <header
      ref={headerRef}
      // The bar shrinks 12px after scrolling, and the header gains a matching
      // 12px bottom margin on the same curve, so its layout footprint never
      // changes. Without this, page content shifted under the user's finger
      // and Chrome's scroll anchoring fought the shrink in an endless
      // shrink/grow loop near the top of the page.
      className={cn(
        "sticky top-0 z-50 border-b border-border/70 bg-sand-light/95 backdrop-blur-xl backdrop-saturate-150 transition-[margin] duration-500 ease-[var(--ease-out-expo)] motion-reduce:transition-none",
        scrolled ? "mb-3" : "mb-0",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1440px] items-center gap-3 px-4 transition-[min-height] duration-500 ease-[var(--ease-out-expo)] motion-reduce:transition-none sm:px-6 lg:gap-6 lg:px-10",
          scrolled ? "min-h-[60px]" : "min-h-[72px]",
        )}
      >
        <div data-testid="site-brand" className="shrink-0">
          <BrandMark compact />
        </div>
        <DesktopNav items={NAV_ITEMS} isActive={isActive} pathname={pathname} />

        <div className="ml-auto flex items-center gap-2">
          <p className="mr-2 hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground 2xl:flex">
            <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lagoon-bright/60 motion-reduce:hidden" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lagoon-bright" />
            </span>
            San Pedro <LocalTime className="text-foreground" />
          </p>
          <HeaderSearch />
          {bookCta && bookCta.type === "link" ? (
            <div className="hidden items-center lg:flex">
              <Link
                href={bookCta.href}
                aria-current={isActive(bookCta.href) ? "page" : undefined}
                onClick={() => trackNavClick("header_desktop", bookCta.href)}
                className="group focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-ink pl-5 pr-1.5 text-sm font-medium text-sand-light transition-colors duration-500 hover:bg-lagoon motion-safe:active:scale-[0.97]"
              >
                <span className="roll">
                  <span>{bookCta.label}</span>
                  <span aria-hidden="true">{bookCta.label}</span>
                </span>
                <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-canary text-ink">
                  <svg viewBox="0 0 16 16" className="arrow-nudge h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </div>
          ) : null}
          <div className="flex items-center lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={handleMobileOpenChange}>
              <SheetTrigger asChild>
                <Button
                  ref={menuTriggerRef}
                  aria-controls={mobileSheetId}
                  aria-expanded={mobileOpen}
                  aria-label="Open navigation menu"
                  variant="ghost"
                  size="icon"
                  className="group h-11 w-11 rounded-full bg-ink text-sand-light hover:bg-lagoon hover:text-sand-light"
                >
                  <span aria-hidden="true" className="flex w-[18px] flex-col items-end gap-[5px]">
                    <span className="h-[1.5px] w-full rounded-full bg-current" />
                    <span className="h-[1.5px] w-3/5 rounded-full bg-current transition-[width] duration-500 ease-[var(--ease-out-expo)] group-hover:w-full" />
                  </span>
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="full"
                title="Site navigation"
                hideClose
                id={mobileSheetId}
                aria-label="Site navigation"
                aria-describedby={undefined}
                onOpenAutoFocus={(event) => {
                  event.preventDefault()
                  closeRef.current?.focus()
                }}
                onCloseAutoFocus={(event) => {
                  // Radix's default restore calls focus() without
                  // preventScroll, which scrolled the page up on close.
                  event.preventDefault()
                  menuTriggerRef.current?.focus({ preventScroll: true })
                }}
                className="gap-0 bg-sand px-5 pb-0 pt-0 sm:px-8"
              >
                <SheetHeader className="flex h-[72px] shrink-0 flex-row items-center justify-between gap-3 p-0">
                  <BrandMark compact />
                  <SheetClose asChild>
                    <Button
                      ref={closeRef}
                      aria-label="Close navigation menu"
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 rounded-full border border-border bg-sand-light text-foreground hover:bg-ink hover:text-sand-light"
                    >
                      <X className="h-5 w-5 transition-transform duration-500 ease-[var(--ease-out-expo)] motion-safe:hover:rotate-90" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetClose>
                </SheetHeader>
                <MobileNav items={NAV_ITEMS} isActive={isActive} onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <ScrollProgress className="absolute inset-x-0 -bottom-px" />
    </header>
  )
}
