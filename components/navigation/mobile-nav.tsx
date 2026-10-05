"use client"

import Link from "next/link"
import type { CSSProperties } from "react"
import { ArrowRight, ArrowUpRight, Search } from "lucide-react"

import type { NavItem } from "@/lib/nav-items"
import { trackNavClick } from "@/lib/analytics"
import { cn } from "@/lib/utils"
import { LocalTime } from "@/components/motion/local-time"

type MobileNavProps = {
  items: NavItem[]
  isActive: (href: string) => boolean
  onNavigate?: () => void
}

const OPEN_SEARCH_EVENT = "canary-cove:open-search"

type Row = { label: string; href: string; caption?: string; external?: boolean }

const enter = (index: number) => ({ "--enter-delay": `${80 + Math.min(index, 12) * 40}ms` }) as CSSProperties

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
    <li className="enter-up" style={enter(index)}>
      <Link
        href={row.href}
        aria-current={active ? "page" : undefined}
        onClick={() => {
          trackNavClick("header_mobile", row.href)
          onNavigate?.()
        }}
        className="group focus-ring flex min-h-[56px] items-center justify-between gap-3 rounded-2xl py-1.5"
      >
        <span className="flex min-w-0 flex-col">
          <span
            className={cn(
              "flex items-center gap-2 font-display text-[2.1rem] leading-[1.05] transition-colors duration-300",
              active ? "text-lagoon" : "text-foreground group-hover:text-lagoon",
            )}
          >
            {row.label}
            {row.external ? (
              <>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <span className="sr-only">(external site)</span>
              </>
            ) : null}
          </span>
          {row.caption ? <span className="text-xs text-muted-foreground">{row.caption}</span> : null}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
            active ? "border-lagoon bg-lagoon text-sand-light" : "border-border text-foreground group-hover:border-ink group-hover:bg-ink group-hover:text-sand-light",
          )}
        >
          <ArrowRight className="h-4 w-4" />
        </span>
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
    onNavigate?.()
    window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT))
  }

  let order = 0

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-8" data-lenis-prevent>
        <button
          type="button"
          onClick={openSearch}
          className="enter-up focus-ring mt-2 flex min-h-12 w-full items-center gap-3 rounded-full border border-border bg-sand-light px-5 text-left text-[15px] text-muted-foreground transition-colors duration-300 hover:border-ink/40 hover:text-foreground"
          style={enter(0)}
        >
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Search rates, dining, adventures…</span>
        </button>

        <div className="mt-8 flex flex-col gap-8">
          {groups.map((group) => {
            if (group.type !== "dropdown") return null
            return (
              <section key={group.label} aria-label={group.label}>
                <p className="eyebrow enter-fade" style={enter(order)}>
                  {group.label}
                </p>
                <ul className="mt-2 flex flex-col">
                  {group.items.map((child) => (
                    <MenuRow
                      key={child.href}
                      row={{ label: child.label, href: child.href, caption: child.caption, external: child.external }}
                      active={isActive(child.href)}
                      index={++order}
                      onNavigate={onNavigate}
                    />
                  ))}
                </ul>
              </section>
            )
          })}

          <section aria-label="More pages">
            <p className="eyebrow enter-fade" style={enter(order)}>
              Plan
            </p>
            <ul className="mt-2 flex flex-col">
              {singles.map((single) => {
                if (single.type !== "link") return null
                return (
                  <MenuRow
                    key={single.href}
                    row={{ label: single.label, href: single.href }}
                    active={isActive(single.href)}
                    index={++order}
                    onNavigate={onNavigate}
                  />
                )
              })}
            </ul>
          </section>

          <p className="enter-fade flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground" style={enter(order + 1)}>
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lagoon-bright" />
            Now in San Pedro · <LocalTime className="text-foreground" />
          </p>
        </div>
      </div>

      <div
        className="shrink-0 border-t border-border bg-sand pt-4"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        {bookCta && bookCta.type === "link" ? (
          <Link
            href={bookCta.href}
            onClick={() => {
              trackNavClick("header_mobile", bookCta.href)
              onNavigate?.()
            }}
            className="group focus-ring flex h-14 w-full items-center justify-between rounded-full bg-ink pl-6 pr-2 text-[15px] font-medium text-sand-light"
          >
            Book your stay
            <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-canary text-ink">
              <ArrowRight className="arrow-nudge h-4 w-4" />
            </span>
          </Link>
        ) : null}
        <Link
          href="/contact"
          onClick={() => {
            trackNavClick("header_mobile", "/contact")
            onNavigate?.()
          }}
          className="focus-ring mt-1 flex min-h-11 w-full items-center justify-center rounded-full text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          Prefer to write? Message us
        </Link>
      </div>
    </div>
  )
}
