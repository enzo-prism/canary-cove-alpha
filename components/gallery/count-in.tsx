import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

/*
 * Pure-CSS count-up for numbers that sit above the fold. A registered integer
 * custom property is animated from 0 to the value and printed through a CSS
 * counter, so it runs from first paint (before hydration), never re-renders,
 * and the server HTML already carries the real number for crawlers, no-JS
 * visitors and screen readers. Reduced motion shows the final value at once.
 * (components/motion/count-up.tsx is the scroll-triggered sibling; it leaves
 * numbers that are already on screen at load untouched.)
 */
const STYLES = `
@property --count-in { syntax: "<integer>"; inherits: false; initial-value: 0; }
.count-in { display: inline-block; text-align: inherit; font-variant-numeric: tabular-nums; counter-reset: count-in var(--count-in); }
.count-in::after { content: counter(count-in); }
html.js .count-in { animation: count-in-run var(--count-duration, 2400ms) cubic-bezier(0.16, 1, 0.3, 1) var(--count-delay, 0ms) both; }
@keyframes count-in-run { from { --count-in: 0; } }
@media (prefers-reduced-motion: reduce) { html.js .count-in { animation: none; } }
@media print { html.js .count-in { animation: none; } }
`

type CountInProps = {
  value: number
  className?: string
  /** Start delay in ms (match the surrounding entrance choreography). */
  delay?: number
  duration?: number
}

export function CountIn({ value, className, delay = 0, duration }: CountInProps) {
  const digits = String(value).length
  const style = {
    "--count-in": value,
    "--count-delay": `${delay}ms`,
    ...(duration ? { "--count-duration": `${duration}ms` } : {}),
    minWidth: `${digits}ch`,
  } as CSSProperties

  return (
    <span className={cn("relative inline-block", className)}>
      <style href="cc-count-in" precedence="default">
        {STYLES}
      </style>
      <span aria-hidden="true" className="count-in" style={style} />
      <span className="sr-only">{value}</span>
    </span>
  )
}
