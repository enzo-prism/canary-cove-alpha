"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet"

type DropdownItem = {
  label: string
  href: string
  caption: string
}

type NavItem =
  | {
      type: "link"
      label: string
      href: string
      cta?: boolean
    }
  | {
      type: "dropdown"
      label: string
      items: DropdownItem[]
    }

const NAV_ITEMS: NavItem[] = [
  { type: "link", label: "Home", href: "/" },
  {
    type: "dropdown",
    label: "Stay",
    items: [
      { label: "Overview", href: "/stay", caption: "Stay" },
      { label: "Suites", href: "/stay/suites", caption: "Stay" },
      { label: "Villa", href: "/stay/villa", caption: "Stay" },
      { label: "Amenities", href: "/stay/amenities", caption: "Stay" },
    ],
  },
  {
    type: "dropdown",
    label: "Experience",
    items: [
      { label: "Overview", href: "/experiences", caption: "Experience" },
      { label: "Power-Boating", href: "/experiences/power-boating", caption: "Experience" },
      { label: "Land & Relaxation", href: "/experiences/land", caption: "Experience" },
      { label: "On the Water", href: "/experiences/on-the-water", caption: "Experience" },
      { label: "Diving & Fishing", href: "/experiences/diving-fishing", caption: "Experience" },
    ],
  },
  {
    type: "dropdown",
    label: "Dining",
    items: [
      { label: "Overview", href: "/dining", caption: "Dining" },
      { label: "Breakfast & Snacks", href: "/dining/breakfast", caption: "Dining" },
      { label: "Special Moments", href: "/dining/special-moments", caption: "Dining" },
      { label: "Private Chef", href: "/dining/private-chef", caption: "Dining" },
      { label: "Provisioning", href: "/dining/provisioning", caption: "Dining" },
      { label: "Eating Out", href: "/dining/eating-out", caption: "Dining" },
    ],
  },
  {
    type: "dropdown",
    label: "Adventures",
    items: [
      { label: "Overview", href: "/adventures", caption: "Adventures" },
      { label: "Fishing", href: "/adventures/fishing", caption: "Adventures" },
      { label: "Day Trips & Certifications", href: "/adventures/day-trips", caption: "Adventures" },
      { label: "Diving", href: "/adventures/diving", caption: "Adventures" },
      { label: "Boats & Crew", href: "/adventures/boats-crew", caption: "Adventures" },
    ],
  },
  {
    type: "dropdown",
    label: "About",
    items: [
      { label: "Rates", href: "/rates", caption: "About" },
      { label: "Gallery", href: "/gallery", caption: "About" },
      { label: "Reviews", href: "/about/reviews", caption: "About" },
      { label: "About", href: "/about", caption: "About" },
      { label: "Getting Here", href: "/about/getting-here", caption: "About" },
      { label: "FAQ", href: "/about/faq", caption: "About" },
    ],
  },
  { type: "link", label: "Contact", href: "/contact", cta: true },
]

const normalizePath = (href: string) => {
  if (!href || href === "/") return "/"
  return href.endsWith("/") ? href.slice(0, -1) : href
}

export function Header() {
  const pathname = normalizePath(usePathname() ?? "/")
  const [scrolled, setScrolled] = useState(false)
  const [desktopDropdown, setDesktopDropdown] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accordionOpen, setAccordionOpen] = useState<string | null>(null)

  const isActive = (href: string) => {
    const normalized = normalizePath(href)
    if (normalized === "/") return pathname === "/"
    return pathname === normalized || pathname.startsWith(`${normalized}/`)
  }

  const dropdownActiveMap = useMemo(() => {
    const map = new Map<string, boolean>()
    NAV_ITEMS.forEach((item) => {
      if (item.type === "dropdown") {
        map.set(item.label, item.items.some((child) => isActive(child.href)))
      }
    })
    return map
  }, [pathname])

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

  useEffect(() => {
    setDesktopDropdown(null)
    setAccordionOpen(null)
  }, [pathname])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-border/40 bg-background/95 shadow-[0_12px_40px_rgba(15,23,42,0.08)]" : "bg-transparent"
      }`}
    >
      <div className={`mx-auto flex max-w-6xl items-center gap-4 px-4 ${scrolled ? "py-3" : "py-5"}`}>
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight text-foreground">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">CC</span>
          Canary Cove
        </Link>

        <nav aria-label="Primary" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex flex-1 flex-wrap items-center justify-center gap-2 rounded-full border border-border/60 bg-white/70 px-4 py-2 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            {NAV_ITEMS.map((item) =>
              item.type === "link" ? (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      item.cta
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : isActive(item.href)
                          ? "text-foreground underline underline-offset-4"
                          : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ) : (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setDesktopDropdown(item.label)}
                  onMouseLeave={() => setDesktopDropdown(null)}
                  onFocus={() => setDesktopDropdown(item.label)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                      setDesktopDropdown(null)
                    }
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={desktopDropdown === item.label}
                    className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-primary/40 ${
                      dropdownActiveMap.get(item.label) ? "text-foreground" : "text-muted-foreground"
                    }`}
                    onClick={() =>
                      setDesktopDropdown((prev) => (prev === item.label ? null : item.label))
                    }
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition ${desktopDropdown === item.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`pointer-events-none absolute left-1/2 top-full mt-3 w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 rounded-[32px] border border-border/70 bg-white/95 p-6 shadow-[0_35px_120px_rgba(15,23,42,0.15)] backdrop-blur transition ${
                      desktopDropdown === item.label ? "pointer-events-auto opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      {item.items.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className={`rounded-2xl border border-border/60 px-4 py-3 transition ${
                            isActive(link.href) ? "border-primary bg-primary/5" : "hover:border-primary hover:bg-primary/5"
                          }`}
                        >
                          <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">{link.caption}</p>
                          <p className="mt-1 text-base font-medium text-foreground">{link.label}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full border border-border/70 bg-white/70 text-foreground lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
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
              <div className="mt-6 space-y-4">
                {NAV_ITEMS.map((item) =>
                  item.type === "link" ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-2xl px-5 py-3 text-lg font-medium ${
                        item.cta ? "bg-foreground text-background" : "bg-white/70 text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div key={item.label} className="rounded-2xl border border-border/60 px-4 py-3">
                      <button
                        type="button"
                        aria-expanded={accordionOpen === item.label}
                        className="flex w-full items-center justify-between text-left text-foreground"
                        onClick={() =>
                          setAccordionOpen((prev) => (prev === item.label ? null : item.label))
                        }
                      >
                        <span className="text-base font-medium">{item.label}</span>
                        <ChevronDown
                          className={`h-5 w-5 transition ${accordionOpen === item.label ? "rotate-180" : ""}`}
                        />
                      </button>
                      {accordionOpen === item.label && (
                        <div className="mt-4 space-y-2 text-sm">
                          {item.items.map((link) => (
                            <Link
                              key={link.label}
                              href={link.href}
                              onClick={() => setMobileOpen(false)}
                              className="block rounded-2xl bg-white/80 px-4 py-3 text-foreground"
                            >
                              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                                {link.caption}
                              </p>
                              <p className="text-base font-medium">{link.label}</p>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
