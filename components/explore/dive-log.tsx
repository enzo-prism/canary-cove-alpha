"use client"

import { useRef, useState, type ReactNode } from "react"
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react"

import { useMotionOk } from "@/components/motion/use-motion-ok"
import { cn } from "@/lib/utils"

type DiveStop = {
  href: string
  label: string
  title: string
}

type DiveLogProps = {
  stops: DiveStop[]
  children: ReactNode
  className?: string
}

const TICKS = Array.from({ length: 25 }, (_, index) => index)

/**
 * A depth-gauge rail beside the reef films. As the films scroll past, a canary
 * bead sinks down the gauge, the line fills, and the film it has reached
 * lights up. The rail is a desktop-only side index (each stop links to its
 * film); phones get the films alone. The films column is untouched, so the
 * video cards never move.
 */
export function DiveLog({ stops, children, className }: DiveLogProps) {
  const ref = useRef<HTMLDivElement>(null)
  const ok = useMotionOk()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.55", "end 0.75"] })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })
  const depth = useTransform(smooth, (value) => (ok ? value : 0))
  const beadTop = useTransform(depth, (value) => `${value * 100}%`)
  const [active, setActive] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(stops.length - 1, Math.max(0, Math.round(value * (stops.length - 1))))
    setActive((current) => (current === next ? current : next))
  })

  return (
    <div ref={ref} className={cn("grid gap-12 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[14rem_minmax(0,1fr)]", className)}>
      <aside aria-label="Dive log" className="hidden lg:block">
        <div className="sticky top-[calc(var(--site-header-height)+3rem)] flow flow-lg">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/55">Dive log</p>
          <div className="relative h-[clamp(18rem,48vh,26rem)]">
            {/* gauge */}
            <div aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px bg-white/15">
              <motion.div className="absolute inset-0 origin-top bg-canary" style={{ scaleY: depth }} />
            </div>
            <div aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-4">
              {TICKS.map((tick) => (
                <span
                  key={tick}
                  className={cn(
                    "absolute left-[7px] h-px bg-white/25",
                    tick % 6 === 0 ? "w-3" : "w-1.5",
                  )}
                  style={{ top: `${(tick / (TICKS.length - 1)) * 100}%` }}
                />
              ))}
            </div>
            <motion.span
              aria-hidden="true"
              className="absolute left-[7px] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-canary shadow-[0_0_0_6px_rgba(255,228,26,0.18),0_0_24px_rgba(255,228,26,0.55)]"
              style={{ top: beadTop }}
            />
            <ol className="absolute inset-0">
              {stops.map((stop, index) => {
                const top = stops.length > 1 ? (index / (stops.length - 1)) * 100 : 0
                const reached = index <= active
                return (
                  <li key={stop.href} className="absolute left-7 right-0 -translate-y-1/2" style={{ top: `${top}%` }}>
                    <a
                      href={stop.href}
                      aria-current={index === active ? "true" : undefined}
                      className={cn(
                        "focus-ring flex flex-col gap-1 rounded-md py-1 transition-colors duration-500",
                        reached ? "text-white" : "text-white/45 hover:text-white/80",
                      )}
                    >
                      <span className="font-display text-sm italic text-canary tabular">
                        {String(index + 1).padStart(2, "0")} · {stop.label}
                      </span>
                      <span className="font-display text-[1.2rem] leading-tight">{stop.title}</span>
                    </a>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
