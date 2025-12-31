"use client"

import Link from "next/link"

import type { NavItem } from "@/lib/nav-items"
import { EMOJI } from "@/lib/emoji"
import { Button } from "@/components/ui/button"

type MobileNavProps = {
  items: NavItem[]
  onNavigate?: () => void
}

export function MobileNav({ items, onNavigate }: MobileNavProps) {
  const primary = items.filter((item) => item.type === "link" && !item.cta) as Extract<NavItem, { type: "link" }>[]
  const ctas = items.filter((item) => item.type === "link" && item.cta) as Extract<NavItem, { type: "link" }>[]

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {primary.map((item) => (
          <Button
            key={item.label}
            asChild
            variant="ghost"
            className="h-auto w-full justify-start rounded-2xl bg-white/85 px-5 py-3 text-lg font-medium text-foreground shadow-sm shadow-black/5 hover:bg-primary/5 hover:text-foreground hover:shadow-lg hover:shadow-primary/15"
          >
            <Link href={item.href} onClick={onNavigate}>
              {item.label}{" "}
              {item.label === "Stay"
                ? EMOJI.stay
                : item.label === "Experience"
                  ? EMOJI.experiences
                  : item.label === "Dining"
                    ? EMOJI.dining
                    : item.label === "Adventures"
                      ? EMOJI.adventures
                      : item.label === "About"
                        ? EMOJI.about
                        : item.label === "Getting Here"
                          ? "📍"
                          : null}
            </Link>
          </Button>
        ))}
      </div>
      <div className="flex flex-col gap-2 rounded-2xl bg-white/75 p-3 shadow-inner shadow-black/5">
        {ctas.map((item) => (
          <Button
            key={item.label}
            asChild
            size="lg"
            variant="outline"
            className="w-full rounded-xl border-primary/70 bg-white text-foreground shadow-sm shadow-primary/10 hover:bg-primary/10 hover:text-foreground"
          >
            <Link href={item.href} onClick={onNavigate}>
              {item.label === "Book" && `${EMOJI.book} `}
              {item.label === "Contact" && `${EMOJI.contact} `}
              {item.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
