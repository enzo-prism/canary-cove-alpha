"use client"

import { startTransition, useDeferredValue, useId, useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Check, Search, X } from "lucide-react"

import { useMotionOk } from "@/components/motion/use-motion-ok"
import { NitroxPopover } from "@/components/nitrox-popover"
import { cn } from "@/lib/utils"

export type RatesServiceItem = {
  service: string
  details: string
  price: string
  note?: string
  tone?: "included" | "standard"
}

export type RatesServiceGroup = {
  id: string
  kicker: string
  title: string
  items: RatesServiceItem[]
}

type RatesServicesBrowserProps = {
  groups: RatesServiceGroup[]
}

type CostFilter = "all" | "included" | "paid"

const COST_FILTERS: { value: CostFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "included", label: "Included" },
  { value: "paid", label: "Add-ons" },
]

function matchesQuery(group: RatesServiceGroup, item: RatesServiceItem, query: string) {
  const haystack = [group.kicker, group.title, item.service, item.details, item.price, item.note ?? ""]
    .join(" ")
    .toLowerCase()

  return haystack.includes(query)
}

function matchesCost(item: RatesServiceItem, filter: CostFilter) {
  if (filter === "all") return true
  const included = item.tone === "included"
  return filter === "included" ? included : !included
}

/** Wraps case-insensitive matches in <mark>; the text content stays identical. */
function highlight(text: string, query: string): ReactNode {
  if (!query) return text
  const lower = text.toLowerCase()
  const parts: ReactNode[] = []
  let cursor = 0
  let index = lower.indexOf(query)
  while (index !== -1) {
    if (index > cursor) parts.push(text.slice(cursor, index))
    parts.push(
      <mark key={index} className="rounded-[3px] bg-canary/50 px-px text-inherit">
        {text.slice(index, index + query.length)}
      </mark>,
    )
    cursor = index + query.length
    index = lower.indexOf(query, cursor)
  }
  if (cursor < text.length) parts.push(text.slice(cursor))
  return parts
}

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Searchable, filterable add-on ledger for /rates. Group wrappers keep their
 * anchor ids (#boat-services, #fishing-packages, …) so site search and the
 * group index can deep-link into the list.
 */
export function RatesServicesBrowser({ groups }: RatesServicesBrowserProps) {
  const ok = useMotionOk()
  const [query, setQuery] = useState("")
  const [cost, setCost] = useState<CostFilter>("all")
  const inputId = useId()
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())
  const filtering = Boolean(deferredQuery) || cost !== "all"

  const filteredGroups = filtering
    ? groups
        .map((group) => ({
          ...group,
          items: group.items.filter(
            (item) => matchesCost(item, cost) && (!deferredQuery || matchesQuery(group, item, deferredQuery)),
          ),
        }))
        .filter((group) => group.items.length > 0)
    : groups

  const totalMatches = filteredGroups.reduce((count, group) => count + group.items.length, 0)
  const isEmpty = filteredGroups.length === 0
  const transition = ok ? { duration: 0.6, ease: EASE } : { duration: 0 }

  const reset = () => {
    setQuery("")
    setCost("all")
  }

  return (
    <div className="flow flow-xl">
      {/* Toolbar */}
      <div className="flow flow-md border-y border-border/80 py-5 lg:sticky lg:top-[var(--site-header-height)] lg:z-20 lg:bg-background/92 lg:backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <label htmlFor={inputId} className="sr-only">
              Search additional services
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id={inputId}
              type="search"
              value={query}
              onChange={(event) => {
                const nextValue = event.target.value
                startTransition(() => setQuery(nextValue))
              }}
              placeholder="Search transfers, diving, carts…"
              autoComplete="off"
              className="focus-ring h-12 w-full touch-manipulation rounded-full border border-border bg-surface pl-12 pr-12 text-base text-foreground shadow-[var(--shadow-subtle)] transition-colors placeholder:text-muted-foreground/80 hover:border-ink/30 sm:text-[15px] [&::-webkit-search-cancel-button]:appearance-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="focus-ring absolute right-1.5 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-ink/6 hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>

          <div
            role="group"
            aria-label="Filter by cost"
            className="relative flex w-full rounded-full border border-border bg-surface p-1 sm:w-auto"
          >
            {COST_FILTERS.map((filter) => {
              const selected = cost === filter.value
              return (
                <button
                  key={filter.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setCost(filter.value)}
                  className={cn(
                    "focus-ring relative min-h-10 flex-1 touch-manipulation rounded-full px-5 text-sm font-medium transition-colors duration-300 sm:flex-none",
                    selected ? "text-sand-light" : "text-foreground/70 hover:text-foreground",
                  )}
                >
                  {selected ? (
                    <motion.span
                      layoutId="services-cost-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={ok ? { type: "spring", stiffness: 380, damping: 34 } : { duration: 0 }}
                    />
                  ) : null}
                  <span className="relative">{filter.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <nav
            aria-label="Service groups"
            className="no-scrollbar -mx-6 flex gap-x-5 overflow-x-auto px-6 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          >
            {groups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="focus-ring inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-sm text-sm font-medium text-foreground/75 transition-colors hover:text-foreground sm:min-h-9"
              >
                <span className="link-underline">{group.kicker}</span>
              </a>
            ))}
          </nav>
          <p role="status" className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {deferredQuery
              ? `${totalMatches} matching result${totalMatches === 1 ? "" : "s"}`
              : cost === "included"
                ? `${totalMatches} included with your stay`
                : cost === "paid"
                  ? `${totalMatches} paid add-ons`
                  : "Includes complimentary gear and paid add-ons"}
          </p>
        </div>
      </div>

      {/* Ledger */}
      {isEmpty ? (
        <div className="flow flow-md items-center rounded-[var(--radius-media)] border border-dashed border-border px-6 py-14 text-center">
          <p className="font-display text-3xl text-foreground">No matching services found</p>
          <p className="text-body max-w-lg">
            Try searching for diving, transfers, golf carts, or fishing to surface the closest matching option.
          </p>
          <button
            type="button"
            onClick={reset}
            className="focus-ring link-underline-static min-h-11 text-sm font-medium text-foreground"
          >
            Clear search and filters
          </button>
        </div>
      ) : (
        <div className="flow flow-xl">
          <AnimatePresence initial={false} mode="popLayout">
            {filteredGroups.map((group) => {
              const groupNumber = groups.findIndex((candidate) => candidate.id === group.id) + 1
              return (
                <motion.div
                  key={group.id}
                  id={group.id}
                  layout={ok ? "position" : false}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transition}
                  className="grid [--anchor-extra:1.5rem] gap-5 lg:[--anchor-extra:9rem] lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] lg:gap-12"
                >
                  <div className="flow flow-sm lg:sticky lg:top-[calc(var(--site-header-height)+10rem)] lg:self-start">
                    <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      <span className="font-display text-lg normal-case tracking-normal text-foreground/40 tabular">
                        {String(groupNumber).padStart(2, "0")}
                      </span>
                      {group.kicker}
                    </p>
                    <h3 className="text-title max-w-[18ch] text-balance">{group.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {group.items.length} {group.items.length === 1 ? "service" : "services"}
                    </p>
                  </div>

                  <ul className="border-t border-ink/70">
                    <AnimatePresence initial={false} mode="popLayout">
                      {group.items.map((item) => {
                        const included = item.tone === "included"
                        return (
                          <motion.li
                            key={`${group.id}-${item.service}`}
                            layout={ok ? "position" : false}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={transition}
                            className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1.5 border-b border-border/80 py-5 sm:py-6"
                          >
                            <p className="text-[17px] font-medium leading-snug text-foreground">
                              {highlight(item.service, deferredQuery)}
                            </p>
                            <p
                              className={cn(
                                "text-right",
                                included
                                  ? "inline-flex items-center gap-1.5 justify-self-end whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.18em] text-lagoon"
                                  : "max-w-[9rem] font-display text-[1.45rem] leading-[1.05] text-foreground tabular sm:max-w-none sm:whitespace-nowrap sm:text-3xl",
                              )}
                            >
                              {included ? <Check aria-hidden="true" className="size-3.5" /> : null}
                              {highlight(item.price, deferredQuery)}
                            </p>
                            <div className="col-span-2 flow flow-xs sm:col-span-1">
                              <p className="text-body">{highlight(item.details, deferredQuery)}</p>
                              {item.note ? (
                                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                  <span aria-hidden="true" className="size-1 rounded-full bg-canary-deep" />
                                  {highlight(item.note, deferredQuery)}
                                </p>
                              ) : null}
                            </div>
                          </motion.li>
                        )
                      })}
                    </AnimatePresence>
                  </ul>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px] text-muted-foreground">
        <NitroxPopover />
        <span>Optional nitrox fills are available for certified divers at +$15 per tank.</span>
      </div>
    </div>
  )
}
