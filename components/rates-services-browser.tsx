"use client"

import { startTransition, useDeferredValue, useId, useState } from "react"
import { Search, X } from "lucide-react"

import { NitroxPopover } from "@/components/nitrox-popover"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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

function matchesQuery(group: RatesServiceGroup, item: RatesServiceItem, query: string) {
  const haystack = [group.kicker, group.title, item.service, item.details, item.price, item.note ?? ""]
    .join(" ")
    .toLowerCase()

  return haystack.includes(query)
}

export function RatesServicesBrowser({ groups }: RatesServicesBrowserProps) {
  const [query, setQuery] = useState("")
  const inputId = useId()
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())

  const filteredGroups = deferredQuery
    ? groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => matchesQuery(group, item, deferredQuery)),
        }))
        .filter((group) => group.items.length > 0)
    : groups

  const totalMatches = filteredGroups.reduce((count, group) => count + group.items.length, 0)

  return (
    <section className="flow flow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flow-xs">
          <Badge className="w-fit bg-transparent text-muted-foreground">Additional services & experiences</Badge>
          <div className="max-w-2xl flow-xs">
            <h2 className="text-section text-[2rem] sm:text-[2.35rem]">Search everything guests can add, arrange, or borrow</h2>
            <p className="text-body">
              Boat runs, fishing charters, dive days, golf carts, and included gear all live in one place so pricing is easy to
              skim and easy to search.
            </p>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <label htmlFor={inputId} className="sr-only">
            Search additional services
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={inputId}
              value={query}
              onChange={(event) => {
                const nextValue = event.target.value
                startTransition(() => setQuery(nextValue))
              }}
              placeholder="Search transfers, diving, fishing, carts..."
              className="h-12 rounded-full border-border/70 bg-white/92 pl-11 pr-12 shadow-sm shadow-black/5"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
        {deferredQuery ? `${totalMatches} matching line${totalMatches === 1 ? "" : "s"}` : "Includes complimentary gear and paid add-ons"}
      </p>

      <Card className="overflow-hidden rounded-[32px] border-border/60 bg-white/92 shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
        <div className="hidden border-b border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(250,245,236,0.88)_100%)] px-6 py-4 md:grid md:grid-cols-[1.1fr_1.8fr_auto] md:gap-5">
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">Service</p>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">Details</p>
          <p className="text-right text-[0.72rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">Price</p>
        </div>

        <div className="divide-y divide-border/60">
          {filteredGroups.length === 0 ? (
            <div className="flow flow-sm px-5 py-10 text-center sm:px-6">
              <p className="text-lg font-semibold text-foreground">No matching services found</p>
              <p className="text-body max-w-lg self-center">
                Try searching for diving, transfers, golf carts, or fishing to surface the closest matching option.
              </p>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <section key={group.id} id={group.id} className="scroll-mt-28">
                <div className="border-b border-border/55 bg-[linear-gradient(180deg,rgba(251,247,239,0.94)_0%,rgba(247,242,232,0.82)_100%)] px-5 py-3 sm:px-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="border-border/70 bg-white/80 text-[0.68rem] uppercase tracking-[0.26em] text-muted-foreground">
                      {group.kicker}
                    </Badge>
                    <p className="text-sm font-semibold text-foreground">{group.title}</p>
                  </div>
                </div>

                {group.items.map((item) => (
                  <div
                    key={`${group.id}-${item.service}`}
                    className="grid gap-3 px-5 py-4 sm:px-6 md:grid-cols-[1.1fr_1.8fr_auto] md:gap-5"
                  >
                    <div className="flow-xs">
                      <p className="text-sm font-semibold text-foreground">{item.service}</p>
                    </div>

                    <div className="flow-xs text-sm leading-6 text-muted-foreground">
                      <p>{item.details}</p>
                      {item.note ? <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/90">{item.note}</p> : null}
                    </div>

                    <div className="flex items-center justify-between gap-4 md:block md:text-right">
                      <span className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-muted-foreground md:hidden">
                        Price
                      </span>
                      <div className="flow-xs items-end">
                        <p
                          className={cn(
                            "text-sm font-semibold text-foreground sm:text-base",
                            item.tone === "included" && "text-primary",
                          )}
                        >
                          {item.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            ))
          )}
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <NitroxPopover />
        <span>Optional nitrox fills are available for certified divers at +$15 per tank.</span>
      </div>
    </section>
  )
}
