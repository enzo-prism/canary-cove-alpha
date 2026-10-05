import type { CSSProperties, ReactNode } from "react"

import { CountUp } from "@/components/motion/count-up"
import { DRAW_X, RISE } from "@/components/explore/reveal-classes"
import { cn } from "@/lib/utils"

export type LedgerPrice = {
  value: number
  label: string
  /** Text after the number, e.g. "/hr". */
  suffix?: string
}

export type LedgerRow = {
  id?: string
  category: string
  detail?: ReactNode
  prices: LedgerPrice[]
}

type PriceLedgerProps = {
  rows: LedgerRow[]
  tone?: "default" | "light"
  className?: string
}

/**
 * Editorial price ledger: a category on the left, big serif prices that
 * count up on first view on the right, hairlines that draw in between rows.
 */
export function PriceLedger({ rows, tone = "default", className }: PriceLedgerProps) {
  const light = tone === "light"
  return (
    <div className={className}>
      <dl>
        {rows.map((row, rowIndex) => (
          <div
            key={row.category}
            id={row.id}
            data-reveal="group"
            className="relative grid scroll-mt-[calc(var(--site-header-height)+1.5rem)] gap-6 py-8 sm:py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)] lg:gap-12"
            style={{ "--row": rowIndex } as CSSProperties}
          >
            <dt>
              <span
                aria-hidden="true"
                className={cn("absolute inset-x-0 top-0 h-px", light ? "bg-white/15" : "bg-border", DRAW_X)}
              />
              <span className={cn("flow flow-xs", RISE)}>
                <span
                  className={cn(
                    "font-display text-[1.85rem] leading-[1.05] sm:text-[2.15rem]",
                    light ? "text-white" : "text-foreground",
                  )}
                >
                  {row.category}
                </span>
                {row.detail ? (
                  <span
                    className={cn(
                      "block max-w-xs text-sm leading-6",
                      light ? "text-white/65" : "text-muted-foreground",
                    )}
                  >
                    {row.detail}
                  </span>
                ) : null}
              </span>
            </dt>
            <dd className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3">
              {row.prices.map((price, index) => (
                <div
                  key={price.label}
                  className={cn("flow flow-xs", RISE)}
                  style={{ transitionDelay: `${120 + index * 110}ms` }}
                >
                  <span
                    className={cn(
                      "flex items-baseline font-display text-[2.75rem] leading-none sm:text-[3.5rem] lg:text-[4rem]",
                      light ? "text-white" : "text-foreground",
                    )}
                  >
                    <CountUp value={price.value} prefix="$" duration={1400} />
                    {price.suffix ? (
                      <span className={cn("ml-1 font-sans text-sm", light ? "text-white/60" : "text-muted-foreground")}>
                        {price.suffix}
                      </span>
                    ) : null}
                  </span>
                  <span className={cn("text-[13px] leading-5", light ? "text-white/70" : "text-muted-foreground")}>
                    {price.label}
                  </span>
                </div>
              ))}
            </dd>
          </div>
        ))}
      </dl>
      <span aria-hidden="true" className={cn("block h-px", light ? "bg-white/15" : "bg-border")} />
    </div>
  )
}
