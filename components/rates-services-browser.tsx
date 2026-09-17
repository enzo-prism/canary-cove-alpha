"use client"

import { startTransition, useDeferredValue, useId, useState } from "react"
import { Search, X } from "lucide-react"

import { NitroxPopover } from "@/components/nitrox-popover"
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
  const isEmpty = filteredGroups.length === 0

  return (
    <div className="flow flow-md">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flow flow-sm max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Additional services &amp; experiences
          </p>
          <h2 className="text-section text-[2rem] sm:text-[2.5rem]">
            Boats, fishing, reef days, and carts — one searchable list.
          </h2>
          <p className="text-body">
            Boat runs, fishing charters, dive days, golf carts, and included gear all live in one place so pricing is
            easy to skim and easy to search.
          </p>
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
              placeholder="Search transfers, diving, carts…"
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Service groups" className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
          {groups.map((group, index) => (
            <span key={group.id} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden="true" className="text-border">
                  /
                </span>
              ) : null}
              <a
                href={`#${group.id}`}
                className="rounded-sm font-medium text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {group.kicker}
              </a>
            </span>
          ))}
        </nav>
        <p role="status" className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          {deferredQuery
            ? `${totalMatches} matching result${totalMatches === 1 ? "" : "s"}`
            : "Includes complimentary gear and paid add-ons"}
        </p>
      </div>

      <Card className="overflow-clip rounded-[28px] border-border/60 bg-white/92 shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
        {isEmpty ? (
          <div className="flow flow-sm px-5 py-10 text-center sm:px-6">
            <p className="text-lg font-semibold text-foreground">No matching services found</p>
            <p className="text-body max-w-lg self-center">
              Try searching for diving, transfers, golf carts, or fishing to surface the closest matching option.
            </p>
          </div>
        ) : (
          <div>
            {filteredGroups.map((group, groupIndex) => (
              // One table per group: the anchor lives on a normal-flow wrapper because
              // Chromium ignores scroll-margin for fragment targets inside the first
              // tbody of a table with a visible thead. Identical colgroups keep every
              // table's columns pixel-aligned.
              <div key={group.id} id={group.id} className="scroll-mt-28">
                <table className="w-full table-fixed border-collapse text-left">
                  <caption className="sr-only">
                    {group.kicker}: {group.title} with pricing
                  </caption>
                  <colgroup>
                    <col className="w-[26%]" />
                    <col />
                    <col className="w-[20%]" />
                  </colgroup>
                  <thead className={groupIndex === 0 ? "hidden md:table-header-group" : "sr-only"}>
                    <tr className="border-b border-border/60">
                      <th scope="col" className="px-6 py-4 pl-8 text-left text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                        Service
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                        Details
                      </th>
                      <th scope="col" className="px-6 py-4 pr-8 text-right text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="grid md:table-row-group">
                    <tr className="grid bg-surface-elevated/70 md:table-row">
                      <th
                        scope="colgroup"
                        colSpan={3}
                        className="border-y border-border/55 px-5 py-3 sm:px-6 md:px-8"
                      >
                        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                          <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                            {group.kicker}
                          </span>
                          <span className="text-sm font-semibold text-foreground">{group.title}</span>
                        </span>
                      </th>
                    </tr>
                    {group.items.map((item) => (
                      <tr
                        key={`${group.id}-${item.service}`}
                        className="grid gap-1.5 border-b border-border/55 px-5 py-4 last:border-b-0 sm:px-6 md:table-row md:px-0 md:py-0"
                      >
                        <th scope="row" className="text-left text-[0.95rem] font-semibold text-foreground md:px-6 md:py-4 md:pl-8 md:font-semibold">
                          {item.service}
                        </th>
                        <td className="text-sm leading-6 text-muted-foreground md:px-6 md:py-4">
                          <p>{item.details}</p>
                          {item.note ? (
                            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/90">
                              {item.note}
                            </p>
                          ) : null}
                        </td>
                        <td className="md:px-6 md:py-4 md:pr-8 md:text-right">
                          <div className="flex items-baseline justify-between gap-4 md:block">
                            <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground md:hidden">
                              Price
                            </span>
                            <span
                              className={cn(
                                "text-[0.95rem] font-semibold tabular-nums text-foreground md:text-base",
                                item.tone === "included" && "text-primary",
                              )}
                            >
                              {item.price}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <NitroxPopover />
        <span>Optional nitrox fills are available for certified divers at +$15 per tank.</span>
      </div>
    </div>
  )
}
