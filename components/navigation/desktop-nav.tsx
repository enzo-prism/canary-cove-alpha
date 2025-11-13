"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

import type { NavItem } from "@/lib/nav-items"
import { cn } from "@/lib/utils"

type DesktopNavProps = {
  items: NavItem[]
  isActive: (href: string) => boolean
  activePath: string
}

const CLOSE_DELAY = 200

export function DesktopNav({ items, isActive, activePath }: DesktopNavProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dropdownActiveMap = useMemo(() => {
    const map = new Map<string, boolean>()
    items.forEach((item) => {
      if (item.type === "dropdown") {
        map.set(item.label, item.items.some((child) => isActive(child.href)))
      }
    })
    return map
  }, [items, isActive, activePath])

  const clearCloseTimeout = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current)
      closeTimeout.current = null
    }
  }

  const scheduleClose = () => {
    clearCloseTimeout()
    closeTimeout.current = setTimeout(() => setOpenDropdown(null), CLOSE_DELAY)
  }

  const handleMouseEnter = (label: string) => {
    clearCloseTimeout()
    setOpenDropdown(label)
  }

  useEffect(() => {
    setOpenDropdown(null)
    return () => {
      clearCloseTimeout()
    }
  }, [activePath])

  return (
    <nav aria-label="Primary navigation" className="hidden flex-1 justify-center lg:flex">
      <ul className="flex flex-1 flex-wrap items-center justify-center gap-2 rounded-full border border-border/60 bg-white/70 px-4 py-2 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
        {items.map((item) =>
          item.type === "link" ? (
            <li key={item.label}>
              <Link
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  item.cta
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : isActive(item.href)
                      ? "text-foreground underline underline-offset-4"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-foreground hover:font-semibold",
                )}
              >
                {item.label}
              </Link>
            </li>
          ) : (
            <li
              key={item.label}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={scheduleClose}
              onBlur={(event) => {
                const container = event.currentTarget
                requestAnimationFrame(() => {
                  const active = document.activeElement
                  if (!container || !active || !container.contains(active)) {
                    setOpenDropdown(null)
                  }
                })
              }}
            >
              <div
                className={cn(
                  "group inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium transition focus-within:ring-2 focus-within:ring-primary/40",
                  dropdownActiveMap.get(item.label) ? "text-foreground" : "text-muted-foreground",
                  "hover:bg-primary/5 hover:text-foreground hover:font-semibold",
                )}
              >
                <Link
                  href={item.href}
                  className="rounded-full px-2 py-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:bg-primary/10"
                >
                  {item.label}
                </Link>
                <button
                  type="button"
                  aria-label={`Toggle ${item.label} menu`}
                  aria-expanded={openDropdown === item.label}
                  className="rounded-full p-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 hover:bg-primary/10"
                  onClick={() =>
                    setOpenDropdown((prev) => (prev === item.label ? null : item.label))
                  }
                >
                  <ChevronDown
                    className={cn("h-4 w-4 transition", openDropdown === item.label && "rotate-180")}
                  />
                </button>
              </div>
              <div
                className={cn(
                  "pointer-events-none absolute left-1/2 top-full mt-3 w-[min(1160px,calc(100vw-4rem))] -translate-x-1/2 rounded-[32px] border border-border/70 bg-white/95 p-6 shadow-[0_35px_120px_rgba(15,23,42,0.15)] backdrop-blur transition",
                  openDropdown === item.label ? "pointer-events-auto opacity-100" : "opacity-0",
                )}
                onMouseEnter={clearCloseTimeout}
                onMouseLeave={scheduleClose}
              >
                <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(420px,1fr))]">
                  {item.items.map((link) => {
                    const active = isActive(link.href)
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        className={cn(
                          "group rounded-2xl border border-border/60 bg-white/90 px-4 py-3 transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/15",
                          active && "border-primary bg-primary/5 shadow-lg shadow-primary/10 text-primary",
                        )}
                      >
                        <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground transition group-hover:text-primary group-hover:tracking-[0.4em]">
                          {link.caption}
                        </p>
                        <p
                          className={cn(
                            "mt-1 text-base font-medium text-foreground transition group-hover:font-semibold group-hover:text-primary",
                            active && "text-primary",
                          )}
                        >
                          {link.label}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </li>
          ),
        )}
      </ul>
    </nav>
  )
}
