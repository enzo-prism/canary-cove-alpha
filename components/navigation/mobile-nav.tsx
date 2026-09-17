"use client"

import Link from "next/link"
import { ArrowUpRight, ChevronRight, Search } from "lucide-react"

import type { NavItem } from "@/lib/nav-items"
import { trackNavClick } from "@/lib/analytics"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type MobileNavProps = {
  items: NavItem[]
  isActive: (href: string) => boolean
  onNavigate?: () => void
}

const OPEN_SEARCH_EVENT = "canary-cove:open-search"

type Row = { label: string; href: string; external?: boolean }

function MenuRow({
  row,
  active,
  index,
  onNavigate,
}: {
  row: Row
  active: boolean
  index: number
  onNavigate?: () => void
}) {
  return (
    <li
      className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-reduce:animate-none"
      style={{ animationDelay: `${Math.min(index, 8) * 20}ms`, animationFillMode: "both" }}
    >
      <Link
        href={row.href}
        aria-current={active ? "page" : undefined}
        onClick={() => {
          trackNavClick("header_mobile", row.href)
          onNavigate?.()
        }}
        className={cn(
          "focus-ring flex min-h-[52px] items-center justify-between gap-3 rounded-2xl px-3 transition-colors duration-200 hover:bg-foreground/[0.05] motion-reduce:transition-none",
          active ? "font-semibold text-foreground" : "font-medium text-foreground/85",
        )}
      >
        <span className="flex items-center gap-1.5 text-[15px]">
          {row.label}
          {row.external ? (
            <>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="sr-only">(external site)</span>
            </>
          ) : null}
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </Link>
    </li>
  )
}

export function MobileNav({ items, isActive, onNavigate }: MobileNavProps) {
  const groups = items.filter((item) => item.type === "dropdown")
  const singles = items.filter((item) => item.type === "link" && !item.cta)
  const bookCta = items.find((item) => item.type === "link" && item.cta)

  const openSearch = () => {
    trackNavClick("header_mobile", "/search")
    window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT))
  }

  // Entrance-stagger order across every row, computed once per render.
  const staggerOrder: string[] = []
  for (const group of groups) {
    if (group.type === "dropdown") {
      for (const child of group.items) staggerOrder.push(child.href)
    }
  }
  for (const single of singles) {
    if (single.type === "link") staggerOrder.push(single.href)
  }
  const staggerIndex = (href: string) => Math.max(0, staggerOrder.indexOf(href))

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto pb-6">
        <button
          type="button"
          onClick={openSearch}
          className="focus-ring flex min-h-12 w-full items-center gap-3 rounded-2xl border border-border/70 bg-background/80 px-4 text-left text-[15px] text-muted-foreground transition-colors duration-200 hover:border-foreground/25 hover:text-foreground motion-reduce:transition-none"
        >
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Search rates, dining, adventures…</span>
        </button>

        <div className="mt-6 flex flex-col gap-6">
          {groups.map((group) => {
            if (group.type !== "dropdown") return null
            return (
              <section key={group.label} aria-label={group.label}>
                <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {group.label}
                </p>
                <ul className="mt-1 flex flex-col">
                  {group.items.map((child) => (
                    <MenuRow
                      key={child.href}
                      row={{ label: child.label, href: child.href, external: child.external }}
                      active={isActive(child.href)}
                      index={staggerIndex(child.href)}
                      onNavigate={onNavigate}
                    />
                  ))}
                </ul>
              </section>
            )
          })}

          <section aria-label="More pages">
            <ul className="flex flex-col">
              {singles.map((single) => {
                if (single.type !== "link") return null
                return (
                  <MenuRow
                    key={single.href}
                    row={{ label: single.label, href: single.href }}
                    active={isActive(single.href)}
                    index={staggerIndex(single.href)}
                    onNavigate={onNavigate}
                  />
                )
              })}
            </ul>
          </section>
        </div>
      </div>

      <div className="shrink-0 border-t border-border/60 bg-background pt-4" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
        {bookCta && bookCta.type === "link" ? (
          <Button asChild size="lg" className="w-full rounded-full">
            <Link
              href={bookCta.href}
              onClick={() => {
                trackNavClick("header_mobile", bookCta.href)
                onNavigate?.()
              }}
            >
              Book your stay
            </Link>
          </Button>
        ) : null}
        <Link
          href="/contact"
          onClick={() => {
            trackNavClick("header_mobile", "/contact")
            onNavigate?.()
          }}
          className="focus-ring mt-1 flex min-h-11 w-full items-center justify-center rounded-full text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground motion-reduce:transition-none"
        >
          Prefer to write? Message us
        </Link>
      </div>
    </div>
  )
}
