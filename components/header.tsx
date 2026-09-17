"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

import { BrandMark } from "@/components/brand-mark"
import { HeaderSearch } from "@/components/header-search"
import { DesktopNav } from "@/components/navigation/desktop-nav"
import { MobileNav } from "@/components/navigation/mobile-nav"
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
    const onScroll = () => setScrolled(window.scrollY > 24)
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
      className="sticky top-0 z-50 border-b border-border/60 bg-background/92 shadow-[0_16px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl"
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1280px] items-center gap-3 px-4 transition-[min-height] duration-300 motion-reduce:transition-none sm:px-6 lg:gap-4 lg:px-8",
          scrolled ? "min-h-14" : "min-h-16",
        )}
      >
        <div data-testid="site-brand" className="shrink-0">
          <BrandMark compact />
        </div>
        <DesktopNav items={NAV_ITEMS} isActive={isActive} pathname={pathname} />

        <div className="ml-auto flex items-center gap-2">
          <HeaderSearch />
          {bookCta && bookCta.type === "link" ? (
            <div className="hidden items-center gap-3 lg:flex">
              <span aria-hidden="true" className="h-6 w-px bg-border/70" />
              <Button asChild size="sm" className="rounded-full">
                <Link
                  href={bookCta.href}
                  aria-current={isActive(bookCta.href) ? "page" : undefined}
                  onClick={() => trackNavClick("header_desktop", bookCta.href)}
                >
                  {bookCta.label}
                </Link>
              </Button>
            </div>
          ) : null}
          <div className="flex items-center lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={handleMobileOpenChange}>
              <SheetTrigger asChild>
                <Button
                  aria-controls={mobileSheetId}
                  aria-expanded={mobileOpen}
                  aria-label="Open navigation menu"
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-full border border-border/70 bg-background/75 text-foreground hover:bg-foreground hover:text-background"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="full"
                title="Site navigation"
                hideClose
                id={mobileSheetId}
                aria-label="Site navigation"
                onOpenAutoFocus={(event) => {
                  event.preventDefault()
                  closeRef.current?.focus()
                }}
                className="gap-0 px-5 pb-0 pt-0 sm:px-8"
              >
                <SheetHeader className="flex h-14 shrink-0 flex-row items-center justify-between gap-3 p-0">
                  <BrandMark compact />
                  <SheetClose asChild>
                    <Button
                      ref={closeRef}
                      aria-label="Close navigation menu"
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 rounded-full border border-border/70 bg-background/75 text-foreground hover:bg-foreground hover:text-background"
                    >
                      <X className="h-5 w-5" />
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
    </header>
  )
}
