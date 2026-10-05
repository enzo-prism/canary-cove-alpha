import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

type MarqueeProps = {
  items: ReactNode[]
  className?: string
  itemClassName?: string
  /** Seconds per full loop. */
  duration?: number
  separator?: ReactNode
  reverse?: boolean
}

/** Infinite CSS ticker. The duplicate run is aria-hidden; pauses on hover and under reduced motion. */
export function Marquee({ items, className, itemClassName, duration = 40, separator, reverse = false }: MarqueeProps) {
  const run = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, index) => (
        <li key={index} className={cn("flex shrink-0 items-center", itemClassName)}>
          {item}
          {separator ? <span aria-hidden="true" className="flex items-center">{separator}</span> : null}
        </li>
      ))}
    </ul>
  )

  return (
    <div className={cn("marquee relative flex overflow-hidden", className)}>
      <div
        className="marquee-track flex w-max"
        style={{ "--marquee-duration": `${duration}s`, animationDirection: reverse ? "reverse" : undefined } as CSSProperties}
      >
        {run(false)}
        {run(true)}
      </div>
    </div>
  )
}
