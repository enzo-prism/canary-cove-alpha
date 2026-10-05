"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react"

import { RouteMap } from "@/components/getting-here/route-map"
import { useMotionOk } from "@/components/motion/use-motion-ok"
import { cn } from "@/lib/utils"

export type JourneyStep = {
  title: string
  meta: string
  detail: ReactNode
  icon: ReactNode
}

/** Progress (0–1 through the step list) at which each leg starts and finishes drawing. */
const FLIGHT: [number, number] = [0.14, 0.4]
const WALK: [number, number] = [0.44, 0.58]
const BOAT: [number, number] = [0.66, 0.9]
/** Progress at which each stop counts as reached. */
const REACH = [0, FLIGHT[1], WALK[1], BOAT[1]] as const

/**
 * The arrival route as a scroll-driven journey: a sticky chart whose route
 * draws leg by leg as the four steps scroll past, and a rail that fills down
 * the list. Step badges never move (colour only), so their geometry is stable
 * at load.
 */
export function ArrivalJourney({ steps }: { steps: JourneyStep[] }) {
  const listRef = useRef<HTMLOListElement>(null)
  const ok = useMotionOk()
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.7", "end 0.55"] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.5 })

  const flight = useTransform(progress, FLIGHT, ok ? [0, 1] : [1, 1], { clamp: true })
  const walk = useTransform(progress, WALK, ok ? [0, 1] : [1, 1], { clamp: true })
  const boat = useTransform(progress, BOAT, ok ? [0, 1] : [1, 1], { clamp: true })
  const rail = useTransform(progress, [0, 1], ok ? [0, 1] : [1, 1], { clamp: true })

  const [reached, setReached] = useState(3)
  const sync = (value: number) => {
    let next = 0
    REACH.forEach((threshold, index) => {
      if (value >= threshold - 0.02) next = index
    })
    setReached((current) => (current === next ? current : next))
  }
  useMotionValueEvent(progress, "change", (value) => {
    if (ok) sync(value)
  })
  // Once motion switches on, start from wherever the reader already is.
  useEffect(() => {
    if (ok) sync(scrollYProgress.get())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ok])
  const lit = ok ? reached : 3

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20">
      {/* Chart: sticky under the header on every size; steps pass beneath it on phones. */}
      <div className="sticky top-[var(--site-header-height)] z-10 -mx-2 bg-background px-2 pb-3 pt-2 lg:top-[calc(var(--site-header-height)+2rem)] lg:mx-0 lg:self-start lg:bg-transparent lg:p-0">
        <div
          data-reveal="clip"
          className="media-frame relative h-[clamp(190px,30svh,270px)] w-full shadow-[var(--shadow-subtle)] lg:h-[min(560px,calc(100svh-var(--site-header-height)-4rem))] lg:shadow-[var(--shadow-soft)]"
        >
          <RouteMap flight={flight} walk={walk} boat={boat} reached={lit} animate={ok} />
        </div>
        {/* Leg readout (visual echo of the list; the list itself is the accessible content) */}
        <div aria-hidden="true" className="flex items-center gap-4 pt-3 lg:pt-5">
          <div className="flex shrink-0 gap-1">
            {steps.map((step, index) => (
              <span
                key={step.title}
                className={cn(
                  "h-1 w-5 rounded-full transition-colors duration-700 ease-[var(--ease-out-expo)] lg:w-7",
                  index <= lit ? (index === steps.length - 1 ? "bg-canary" : "bg-ink") : "bg-border",
                )}
              />
            ))}
          </div>
          <p className="min-w-0 truncate text-[13px] text-muted-foreground">
            <span className="font-semibold uppercase tracking-[0.18em] text-foreground/70">
              Leg {lit + 1}
            </span>
            <span className="px-2">·</span>
            {steps[lit]?.title}
          </p>
        </div>
      </div>

      <ol ref={listRef} className="relative">
        {/* Rail */}
        <span aria-hidden="true" className="absolute bottom-6 left-[1.375rem] top-6 w-px -translate-x-1/2 bg-border" />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: rail }}
          className="absolute bottom-6 left-[1.375rem] top-6 w-px origin-top -translate-x-1/2 bg-ink"
        />

        {steps.map((step, index) => {
          const done = index <= lit
          return (
            <li
              key={step.title}
              data-testid="getting-here-step"
              className="relative pb-14 pl-16 last:pb-0 sm:pb-20 sm:pl-20"
            >
              <div
                data-testid="getting-here-step-index"
                className={cn(
                  "absolute left-0 top-0 flex size-11 items-center justify-center rounded-full border font-display text-lg tabular transition-[background-color,border-color,color,box-shadow] duration-700 ease-[var(--ease-out-expo)]",
                  done
                    ? "border-ink bg-ink text-sand-light shadow-[0_0_0_6px_var(--background)]"
                    : "border-border bg-background text-muted-foreground shadow-[0_0_0_6px_var(--background)]",
                  index === steps.length - 1 && done && "border-canary bg-canary text-ink",
                )}
              >
                {index + 1}
              </div>
              <div data-reveal="fade" className="flow flow-sm pt-1.5">
                <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  <span aria-hidden="true" className="text-lagoon [&>svg]:size-4">
                    {step.icon}
                  </span>
                  {step.meta}
                </p>
                <h3 className="text-title">{step.title}</h3>
                <div className="text-body max-w-xl">{step.detail}</div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
