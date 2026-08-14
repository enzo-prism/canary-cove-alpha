"use client"

import Link from "next/link"
import { BedDouble, Calendar, ChevronDown, Compass, Mail, MapPin, MessageSquare, Tag } from "lucide-react"

import type { NavItem } from "@/lib/nav-items"
import { trackNavClick } from "@/lib/analytics"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type DesktopNavProps = {
  items: NavItem[]
  isActive: (href: string) => boolean
}

const navIcons: Record<string, typeof BedDouble> = {
  Stay: BedDouble,
  Rates: Tag,
  Explore: Compass,
  Reviews: MessageSquare,
  "Getting Here": MapPin,
  Book: Calendar,
  Contact: Mail,
}

export function DesktopNav({ items, isActive }: DesktopNavProps) {
  const primary = items.filter((item) => item.type === "dropdown" || (item.type === "link" && !item.cta))
  const ctas = items.filter((item) => item.type === "link" && item.cta)

  return (
    <nav aria-label="Primary navigation" className="hidden flex-1 items-center justify-between gap-6 lg:flex">
      <div className="min-w-0 flex-1">
        <ul className="flex min-w-0 list-none items-center justify-center gap-1 rounded-full border border-border/70 bg-background/78 p-1.5 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
          {primary.map((item) => {
            if (item.type === "dropdown") {
              const active = item.items.some((child) => isActive(child.href))
              const Icon = navIcons[item.label]

              return (
                <li key={item.label} className="shrink-0">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "group/nav flex min-w-[5.15rem] items-center justify-center gap-1 rounded-[1.6rem] px-4 py-2.5 text-[13px] font-medium leading-none transition-[background-color,color,box-shadow] duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                          active
                            ? "bg-foreground text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_24px_rgba(15,23,42,0.14)]"
                            : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
                        )}
                      >
                        {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                        <span>{item.label}</span>
                        <ChevronDown className="h-3 w-3 opacity-70" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="center" className="w-72 rounded-2xl p-2">
                      <ul className="flex flex-col">
                        {item.items.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => trackNavClick("header_desktop", child.href)}
                              className={cn(
                                "block rounded-xl px-3 py-2.5 hover:bg-foreground/[0.04]",
                                isActive(child.href) && "bg-foreground/[0.06]",
                              )}
                            >
                              <span className="block text-sm font-medium text-foreground">{child.label}</span>
                              <span className="block text-xs text-muted-foreground">{child.caption}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </PopoverContent>
                  </Popover>
                </li>
              )
            }

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
          const Icon = navIcons[item.label]

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
                {Icon ? (
                  <span className="nav-icon">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                ) : null}
                <span className="nav-label">{item.label}</span>
              </Link>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
