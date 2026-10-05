"use client"

import { useEffect, useId, useState, type CSSProperties } from "react"
import { LayoutGroup, motion } from "motion/react"

import { CountUp } from "@/components/motion/count-up"
import { useMotionOk } from "@/components/motion/use-motion-ok"
import { cn } from "@/lib/utils"

export type SeasonTone = "low" | "high" | "peak"

export type LedgerSeason = {
  name: string
  monthsShort: string
  /** Calendar months (0 = January) that fall in this season. */
  months: readonly number[]
  tone: SeasonTone
  rates: readonly { label: string; price: string }[]
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const

export const TONE_DOT: Record<SeasonTone, string> = {
  low: "bg-lagoon-bright",
  high: "bg-canary",
  peak: "bg-coral",
}

const priceValue = (price: string) => Number(price.replace(/[^0-9]/g, ""))

/**
 * Villa price ledger. A twelve-month strip maps every month to its season;
 * picking a month (or a season column) slides the ink highlight onto that
 * season's prices. All three seasons are always rendered, so every price and
 * month range stays in the document for search, crawlers and no-JS readers.
 */
export function SeasonLedger({ seasons }: { seasons: readonly LedgerSeason[] }) {
  const ok = useMotionOk()
  const statusId = useId()
  const [month, setMonth] = useState<number | null>(null)
  const [active, setActive] = useState<number | null>(null)
  const [hover, setHover] = useState<number | null>(null)
  const [currentMonth, setCurrentMonth] = useState<number | null>(null)

  const seasonOf = (m: number) => seasons.findIndex((season) => season.months.includes(m))

  // Default to the visitor's current month once mounted (never during SSR).
  useEffect(() => {
    const now = new Date().getMonth()
    setCurrentMonth(now)
    setMonth(now)
    setActive(seasons.findIndex((season) => season.months.includes(now)))
  }, [seasons])

  const shown = hover ?? active
  const activeSeason = active !== null && active >= 0 ? seasons[active] : null

  return (
    <div className="flow flow-xl">
      {/* The year at a glance */}
      <div className="flow flow-md" data-reveal="up">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Pick your month
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground" aria-label="Season key">
            {seasons.map((season) => (
              <li key={season.name} className="flex items-center gap-2">
                <span aria-hidden="true" className={cn("size-2 rounded-full", TONE_DOT[season.tone])} />
                {season.name}
              </li>
            ))}
          </ul>
        </div>

        <div
          role="group"
          aria-label="Months of the year"
          aria-describedby={statusId}
          className="grid grid-cols-6 gap-1.5 sm:gap-2 lg:grid-cols-12"
        >
          {MONTHS.map((label, index) => {
            const seasonIndex = seasonOf(index)
            const season = seasons[seasonIndex]
            const inShown = shown !== null && seasonIndex === shown
            const selected = month === index
            return (
              <button
                key={label}
                type="button"
                aria-pressed={selected}
                aria-label={`${MONTH_NAMES[index]}: ${season?.name ?? ""}`}
                onClick={() => {
                  setMonth(index)
                  setActive(seasonIndex)
                }}
                onMouseEnter={() => setHover(seasonIndex)}
                onMouseLeave={() => setHover(null)}
                style={{ "--i": index } as CSSProperties}
                className={cn(
                  "focus-ring group relative flex min-h-14 touch-manipulation flex-col items-center justify-center gap-2 rounded-xl border text-[13px] font-medium transition-[background-color,border-color,color,opacity] duration-500 ease-[var(--ease-out-expo)] motion-reduce:transition-none",
                  selected
                    ? "border-ink bg-ink text-sand-light"
                    : "border-border/80 bg-surface/60 text-foreground hover:border-ink/40",
                  shown !== null && !inShown && !selected && "text-foreground/70",
                )}
              >
                <span>{label}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-1 w-6 rounded-full transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)]",
                    season ? TONE_DOT[season.tone] : "bg-border",
                    shown === null || inShown || selected ? "opacity-100" : "opacity-30",
                    inShown ? "scale-x-125" : "scale-x-100",
                  )}
                />
                {currentMonth === index ? (
                  <span
                    aria-hidden="true"
                    className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-canary ring-2 ring-canary/30"
                  />
                ) : null}
              </button>
            )
          })}
        </div>

        <p id={statusId} role="status" className="min-h-6 text-[15px] text-muted-foreground">
          {month !== null && activeSeason ? (
            <>
              <span className="font-medium text-foreground">
                {MONTH_NAMES[month]}
                {currentMonth === month ? " (this month)" : ""}
              </span>{" "}
              falls in <span className="font-medium text-foreground">{activeSeason.name}</span> ·{" "}
              {activeSeason.monthsShort}
            </>
          ) : (
            "Tap a month to see its season."
          )}
        </p>
      </div>

      {/* The ledger */}
      <LayoutGroup>
        <div data-reveal="stagger" className="grid gap-3 lg:grid-cols-3 lg:gap-4" style={{ "--stagger-step": "110ms" } as CSSProperties}>
          {seasons.map((season, index) => {
            const isActive = active === index
            return (
              <article
                key={season.name}
                aria-labelledby={`${statusId}-season-${index}`}
                onClick={() => {
                  setActive(index)
                  if (month === null || !season.months.includes(month)) setMonth(season.months[0] ?? null)
                }}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(null)}
                data-active={isActive || undefined}
                style={{ "--stagger-index": index } as CSSProperties}
                className={cn(
                  "group/season relative isolate cursor-pointer rounded-[var(--radius-media)] border p-6 transition-[border-color,color] duration-700 ease-[var(--ease-out-expo)] sm:p-8",
                  isActive ? "border-transparent text-sand-light" : "border-border/80 text-foreground hover:border-ink/30",
                )}
              >
                {isActive ? (
                  <motion.div
                    layoutId="season-ledger-highlight"
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-[var(--radius-media)] bg-ink shadow-[var(--shadow-lift)]"
                    transition={ok ? { type: "spring", stiffness: 260, damping: 32, mass: 0.9 } : { duration: 0 }}
                  />
                ) : null}

                <div className="flex items-start justify-between gap-4">
                  <div className="flow flow-xs">
                    <h3 id={`${statusId}-season-${index}`} className="text-title">
                      {season.name}
                    </h3>
                    <p
                      className={cn(
                        "text-[15px] transition-colors duration-700",
                        isActive ? "text-sand-light/70" : "text-muted-foreground",
                      )}
                    >
                      {season.monthsShort}
                    </p>
                  </div>
                  <span aria-hidden="true" className={cn("mt-2 size-2.5 shrink-0 rounded-full", TONE_DOT[season.tone])} />
                </div>

                <dl
                  className={cn(
                    "mt-8 border-t transition-colors duration-700",
                    isActive ? "border-sand-light/15" : "border-border/80",
                  )}
                >
                  {season.rates.map((rate) => (
                    <div
                      key={rate.label}
                      className={cn(
                        "flex items-baseline justify-between gap-4 border-b py-4 transition-colors duration-700 last:border-b-0 last:pb-0",
                        isActive ? "border-sand-light/15" : "border-border/80",
                      )}
                    >
                      <dt
                        className={cn(
                          "text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors duration-700",
                          isActive ? "text-sand-light/70" : "text-muted-foreground",
                        )}
                      >
                        {rate.label}
                      </dt>
                      <dd className="flex items-baseline gap-1.5 whitespace-nowrap">
                        <CountUp
                          value={priceValue(rate.price)}
                          prefix="$"
                          className="font-display text-[2.6rem] leading-none tracking-tight sm:text-5xl"
                        />
                        <span
                          className={cn(
                            "text-sm transition-colors duration-700",
                            isActive ? "text-sand-light/60" : "text-muted-foreground",
                          )}
                        >
                          /night
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            )
          })}
        </div>
      </LayoutGroup>
    </div>
  )
}
