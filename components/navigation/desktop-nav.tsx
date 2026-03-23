"use client"

import Link from "next/link"
import { BedDouble, Calendar, Compass, Home, Info, Mail, MapPin, Utensils, Waves } from "lucide-react"

import type { NavItem } from "@/lib/nav-items"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

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
      <NavigationMenu viewport={false} className="min-w-0 flex-1 justify-center">
        <NavigationMenuList className="no-scrollbar flex min-w-0 items-center gap-1 overflow-x-auto rounded-full border border-border/70 bg-background/78 p-2 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
          {primary.map((item) => {
            const active = isActive(item.href)
            const Icon = navIcons[item.label]

            return (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group/nav inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                    )}
                  >
                    {Icon ? (
                      <span className={cn("nav-icon", active ? "text-primary-foreground" : "text-muted-foreground group-hover/nav:text-foreground")}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    ) : null}
                    <span className="nav-label">{item.label}</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )
          })}
        </NavigationMenuList>
      </NavigationMenu>

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
              <Link href={item.href} aria-current={active ? "page" : undefined}>
                {item.label}
              </Link>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
