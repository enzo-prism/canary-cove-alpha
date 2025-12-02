"use client"

import Link from "next/link"

import type { NavItem } from "@/lib/nav-items"
import { EMOJI } from "@/lib/emoji"

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
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className="block rounded-2xl bg-white/85 px-5 py-3 text-lg font-medium text-foreground shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10"
          >
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
        ))}
      </div>
      <div className="flex flex-col gap-2 rounded-2xl bg-white/75 p-3 shadow-inner shadow-black/5">
        {ctas.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className="block rounded-xl bg-primary px-4 py-3 text-center text-base font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            {item.label === "Book" && `${EMOJI.book} `}
            {item.label === "Contact" && `${EMOJI.contact} `}
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
