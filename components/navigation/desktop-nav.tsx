"use client"

import Link from "next/link"
import { BedDouble, Calendar, Compass, Home, Info, Mail, MapPin, Utensils, Waves } from "lucide-react"

import type { NavItem } from "@/lib/nav-items"
import { trackNavClick } from "@/lib/analytics"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type DesktopNavProps = {
  items: NavItem[]
  isActive: (href: string) => boolean
}

export function DesktopNav({ items, isActive }: DesktopNavProps) {
  const primary = items.filter((item) => item.type === "link" && !item.cta) as Extract<NavItem, { type: "link" }>[]
  const ctas = items.filter((item) => item.type === "link" && item.cta) as Extract<NavItem, { type: "link" }>[]
  const navIcons: Record<string, typeof Home> = {
    Home,
    Stay: BedDouble,
    Experience: Compass,
    Dining: Utensils,
    Adventures: Waves,
    About: Info,
    "Getting Here": MapPin,
    Book: Calendar,
    Contact: Mail,
  }

  return (
    <nav aria-label="Primary navigation" className="hidden flex-1 items-center justify-between gap-6 lg:flex">
      <div className="min-w-0 flex-1">
        <ul className="no-scrollbar flex min-w-0 list-none items-center justify-center gap-1 overflow-x-auto rounded-full border border-border/70 bg-background/78 p-1.5 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
          {primary.map((item) => {
            const active = isActive(item.href)
            const Icon = navIcons[item.label]

            return (
              <li key={item.label} className="shrink-0">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => trackNavClick("header_desktop", item.href)}
                  className={cn(
                    "group/nav flex min-w-[5.15rem] flex-col items-center justify-center gap-1 whitespace-nowrap rounded-[1.6rem] px-4 py-2.5 text-[13px] font-medium leading-none transition-[background-color,color,box-shadow,transform] duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                    active
                      ? "bg-foreground text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_24px_rgba(15,23,42,0.14)]"
                      : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
                  )}
                >
                  {Icon ? (
                    <span className={cn("nav-icon", active ? "text-background" : "text-muted-foreground group-hover/nav:text-foreground")}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                  ) : null}
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="flex items-center gap-2">
        {ctas.map((item) => {
          const active = isActive(item.href)
          const isPrimaryCta = item.label === "Book"

          return (
            <Button
              key={item.label}
              asChild
              size="sm"
              variant={isPrimaryCta ? "default" : "outline"}
              className={cn(
                "rounded-full",
                !isPrimaryCta && "bg-background/80",
                isPrimaryCta && active && "bg-primary/90",
              )}
            >
              <Link href={item.href} aria-current={active ? "page" : undefined} onClick={() => trackNavClick("header_desktop", item.href)}>
                {item.label}
              </Link>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
