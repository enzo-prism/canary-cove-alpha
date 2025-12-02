"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

import { DesktopNav } from "@/components/navigation/desktop-nav"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-border/40 bg-background/95 shadow-[0_12px_40px_rgba(15,23,42,0.08)]" : "bg-transparent"
      }`}
    >
      <div className={`mx-auto flex max-w-6xl items-center gap-4 px-4 ${scrolled ? "py-3" : "py-5"}`}>
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight text-foreground">
          <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-sm bg-[#0b1d3a]">
            <span className="relative block h-10 w-10">
              <Image
                src="https://res.cloudinary.com/dhqpqfw6w/image/upload/v1764690650/Canary_Cove_logo_website_suvurg.png"
                alt="Canary Cove logo"
                fill
                sizes="48px"
                className="object-contain"
                priority
              />
            </span>
          </span>
        </Link>

        <DesktopNav items={NAV_ITEMS} isActive={isActive} />

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full border border-border/70 bg-white/70 text-foreground">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              title="Navigation"
              hideClose
              className="w-full border-none bg-surface px-6 pb-10 pt-8 sm:w-[70vw]"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Navigation</p>
                <SheetClose asChild>
                  <button className="rounded-full border border-border/60 p-2 text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close menu</span>
                  </button>
                </SheetClose>
              </div>
              <MobileNav items={NAV_ITEMS} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
