"use client"

import Link from "next/link"
import { BedDouble, Calendar, Compass, Home, Images, Mail, MapPin, MessageSquare, Utensils, Waves } from "lucide-react"

import type { NavItem } from "@/lib/nav-items"
import { trackNavClick } from "@/lib/analytics"
import { Button } from "@/components/ui/button"

type MobileNavProps = {
  items: NavItem[]
  onNavigate?: () => void
}

export function MobileNav({ items, onNavigate }: MobileNavProps) {
  // "Home" is omitted: the brand mark in the sheet header already links home.
  const primary = items.filter((item) => item.type === "link" && !item.cta && item.href !== "/") as Extract<
    NavItem,
    { type: "link" }
  >[]
  const ctas = items.filter((item) => item.type === "link" && item.cta) as Extract<NavItem, { type: "link" }>[]
  const navIcons: Record<string, typeof Home> = {
    Home,
    Stay: BedDouble,
    Gallery: Images,
    Experience: Compass,
    Dining: Utensils,
    Adventures: Waves,
    Reviews: MessageSquare,
    "Getting Here": MapPin,
    Book: Calendar,
    Contact: Mail,
  }

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="surface-panel flex flex-col px-4 py-2">
        {primary.map((item) => {
          const Icon = navIcons[item.label]
          return (
            <Button
              key={item.label}
              asChild
              variant="ghost"
              className="h-auto w-full justify-between rounded-2xl px-3 py-4 text-left text-sm font-medium text-foreground hover:bg-foreground/5"
            >
              <Link
                href={item.href}
                onClick={() => {
                  trackNavClick("header_mobile", item.href)
                  onNavigate?.()
                }}
              >
                <span className="flex items-center gap-3">
                  {Icon ? (
                    <span className="nav-icon text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                  ) : null}
                  <span className="nav-label">{item.label}</span>
                </span>
              </Link>
            </Button>
          )
        })}
      </div>
      <div className="flex flex-col gap-2">
        {ctas.map((item) => {
          const Icon = navIcons[item.label]
          return (
            <Button
              key={item.label}
              asChild
              size="lg"
              variant={item.label === "Book" ? "default" : "outline"}
              className="w-full rounded-full"
            >
              <Link
                href={item.href}
                onClick={() => {
                  trackNavClick("header_mobile", item.href)
                  onNavigate?.()
                }}
              >
                {Icon ? (
                  <span className="nav-icon">
                    <Icon className="h-4 w-4" />
                  </span>
                ) : null}
                <span className="nav-label">{item.label}</span>
              </Link>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
