"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

import type { NavItem } from "@/lib/nav-items"

type MobileNavProps = {
  items: NavItem[]
  onNavigate?: () => void
}

export function MobileNav({ items, onNavigate }: MobileNavProps) {
  const [openSection, setOpenSection] = useState<string | null>(null)

  return (
    <div className="mt-6 space-y-4">
      {items.map((item) =>
        item.type === "link" ? (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={`block rounded-2xl px-5 py-3 text-lg font-medium transition ${
              item.cta
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "bg-white/70 text-foreground hover:bg-primary/5 hover:font-semibold"
            }`}
          >
            {item.label}
          </Link>
        ) : (
          <div key={item.label} className="rounded-2xl border border-border/60 px-4 py-3">
            <button
              type="button"
              aria-expanded={openSection === item.label}
              className="flex w-full items-center justify-between text-left text-foreground"
              onClick={() =>
                setOpenSection((prev) => (prev === item.label ? null : item.label))
              }
            >
              <span className="text-base font-medium">{item.label}</span>
              <ChevronDown
                className={`h-5 w-5 transition ${openSection === item.label ? "rotate-180" : ""}`}
              />
            </button>
            {openSection === item.label && (
              <div className="mt-4 space-y-2 text-sm">
                {item.items.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={onNavigate}
                    className="group block rounded-2xl bg-white/80 px-4 py-3 text-foreground transition hover:-translate-y-0.5 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/15"
                  >
                    <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground transition group-hover:text-primary">
                      {link.caption}
                    </p>
                    <p className="text-base font-medium transition group-hover:font-semibold group-hover:text-primary">
                      {link.label}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ),
      )}
    </div>
  )
}
