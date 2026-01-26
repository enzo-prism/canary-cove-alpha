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
    <nav aria-label="Primary navigation" className="hidden flex-1 justify-center lg:flex">
      <NavigationMenu viewport={false} className="flex-1 justify-center">
        <NavigationMenuList className="no-scrollbar flex flex-1 items-center justify-center gap-6 overflow-x-auto px-1">
          {items.map((item) => {
            if (item.type !== "link") return null
            const active = isActive(item.href)
            const Icon = navIcons[item.label]
            const baseClasses =
              "group relative inline-flex items-center gap-2 px-1 py-2 text-xs font-medium uppercase tracking-[0.22em] transition-colors duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            if (item.cta) {
              return (
                <NavigationMenuItem key={item.label}>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className={cn("border-border text-foreground hover:bg-foreground hover:text-background", active && "bg-foreground text-background")}
                  >
                    <Link href={item.href} aria-current={active ? "page" : undefined}>
                      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                      {item.label}
                    </Link>
                  </Button>
                </NavigationMenuItem>
              )
            }
            return (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      baseClasses,
                      "text-muted-foreground hover:text-foreground",
                      active && "text-foreground",
                    )}
                  >
                    {Icon ? <Icon className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-foreground" /> : null}
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  )
}
