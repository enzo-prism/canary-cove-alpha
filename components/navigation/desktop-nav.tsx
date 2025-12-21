"use client"

import Link from "next/link"

import type { NavItem } from "@/lib/nav-items"
import { EMOJI } from "@/lib/emoji"
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
  return (
    <nav aria-label="Primary navigation" className="hidden flex-1 justify-center lg:flex">
      <NavigationMenu viewport={false} className="flex-1 justify-center">
        <NavigationMenuList className="no-scrollbar flex flex-1 items-center gap-2 overflow-x-auto rounded-full border border-border/60 bg-white/80 px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
          {items.map((item) => {
            if (item.type !== "link") return null
            const active = isActive(item.href)
            const baseClasses =
              "inline-flex flex-row items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            if (item.cta) {
              return (
                <NavigationMenuItem key={item.label}>
                  <Button
                    asChild
                    className={cn("rounded-full", active && "ring-2 ring-primary/30")}
                  >
                    <Link href={item.href} aria-current={active ? "page" : undefined}>
                      {item.label === "Book" && `${EMOJI.book} `}
                      {item.label === "Contact" && `${EMOJI.contact} `}
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
                      "text-muted-foreground hover:text-foreground hover:bg-primary/5",
                      active && "bg-primary/10 text-foreground",
                    )}
                  >
                    {item.label}
                    {item.label === "Stay" && ` ${EMOJI.stay}`}
                    {item.label === "Experience" && ` ${EMOJI.experiences}`}
                    {item.label === "Dining" && ` ${EMOJI.dining}`}
                    {item.label === "Adventures" && ` ${EMOJI.adventures}`}
                    {item.label === "About" && ` ${EMOJI.about}`}
                    {item.label === "Getting Here" && " 📍"}
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
