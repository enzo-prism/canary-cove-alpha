"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

import { DesktopNav } from "@/components/navigation/desktop-nav"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
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
  const mobileSheetId = "mobile-nav-sheet"

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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-border/60 bg-background/95 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className={`mx-auto flex max-w-[1200px] items-center px-6 sm:px-8 lg:px-12 ${scrolled ? "py-3" : "py-5"}`}>
        <DesktopNav items={NAV_ITEMS} isActive={isActive} />

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                aria-controls={mobileSheetId}
                aria-label="Open navigation menu"
                variant="outline"
                size="icon"
                className="h-11 w-11 border-border text-foreground hover:bg-foreground hover:text-background"
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
                <SheetTitle className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                  Navigation
                </SheetTitle>
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
    </header>
  )
}
