"use client"

import Link from "next/link"
import { BedDouble, Calendar, Compass, Home, Info, Mail, MapPin, Utensils, Waves } from "lucide-react"

import type { NavItem } from "@/lib/nav-items"
import { Button } from "@/components/ui/button"

type MobileNavProps = {
  items: NavItem[]
  onNavigate?: () => void
}

export function MobileNav({ items, onNavigate }: MobileNavProps) {
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
    <div className="mt-6 flex flex-col gap-6">
      <div className="flex flex-col">
        {primary.map((item) => {
          const Icon = navIcons[item.label]
          return (
            <Button
              key={item.label}
              asChild
              variant="ghost"
              className="h-auto w-full justify-between rounded-none border-b border-border/60 px-0 py-4 text-xs font-medium uppercase tracking-[0.28em] text-foreground hover:bg-transparent"
            >
              <Link href={item.href} onClick={onNavigate}>
                <span className="flex items-center gap-3">
                  {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
                  {item.label}
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
              variant="outline"
              className="w-full border-border text-foreground hover:bg-foreground hover:text-background"
            >
              <Link href={item.href} onClick={onNavigate}>
                {Icon ? <Icon className="h-4 w-4" /> : null}
                {item.label}
              </Link>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
