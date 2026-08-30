"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

import { BrandMark } from "@/components/brand-mark"
import { HeaderSearch } from "@/components/header-search"
import { DesktopNav } from "@/components/navigation/desktop-nav"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { trackEvent } from "@/lib/analytics"
import { NAV_ITEMS } from "@/lib/nav-items"

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
  const mobileSheetId = "mobile-nav-sheet"
  const hasImmersiveTop = (pathname === "/" || pathname === "/experiences") && !scrolled

  const isActive = useCallback(
    (href: string) => {
      const normalized = normalizePath(href)
      if (normalized === "/") return pathname === "/"
      return pathname === normalized || pathname.startsWith(`${normalized}/`)
    },
    [pathname],
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll)
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

  const handleMobileOpenChange = (open: boolean) => {
    if (open && !mobileOpen) {
      trackEvent("nav_menu_open", { surface: "header_mobile" })
    }
    setMobileOpen(open)
  }

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        hasImmersiveTop
          ? "border-white/10 bg-background/35 backdrop-blur-md"
          : "border-border/60 bg-background/92 shadow-[0_16px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl"
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1280px] items-center gap-4 px-6 sm:px-8 lg:px-12 ${
          scrolled ? "py-3" : "py-4"
        }`}
      >
        <div data-testid="site-brand">
          <BrandMark
            compact
            inverted={hasImmersiveTop}
            className={
              hasImmersiveTop
                ? "shrink-0 rounded-full border border-white/25 bg-black/35 px-3 py-1.5 backdrop-blur-md"
                : "shrink-0"
            }
          />
        </div>
        <DesktopNav items={NAV_ITEMS} isActive={isActive} />

        <div className="ml-auto flex items-center gap-2">
          <HeaderSearch />
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={handleMobileOpenChange}>
            <SheetTrigger asChild>
              <Button
                aria-controls={mobileSheetId}
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
              side="right"
              title="Navigation"
              hideClose
              id={mobileSheetId}
              className="w-full border-none bg-background px-6 pb-10 pt-8 sm:w-[70vw]"
            >
              <SheetHeader className="flex-row items-center justify-between gap-3 p-0">
                <div>
                  <BrandMark />
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                </div>
                <SheetClose asChild>
                  <Button
                    aria-label="Close navigation menu"
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 border-border text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetClose>
              </SheetHeader>
              <MobileNav items={NAV_ITEMS} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
        </div>
      </div>
    </header>
  )
}
