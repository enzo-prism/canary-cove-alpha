"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"

import { cn } from "@/lib/utils"

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

type ChipRailProps = {
  /** Value of the pressed chip; the ink pill slides to it. */
  activeKey: string
  label: string
  testId: string
  size?: "md" | "sm"
  className?: string
  children: ReactNode
  /** Reports whether the rail can scroll further left/right (desktop arrows). */
  onOverflowChange?: (state: { start: boolean; end: boolean }) => void
  railRef?: (node: HTMLDivElement | null) => void
}

/**
 * A horizontally scrolling row of filter chips with a single ink pill that
 * glides to whichever chip is pressed. Before the pill has been measured the
 * pressed chip paints its own ink background, so the server render and the
 * first paint are already correct; the pill takes over once mounted.
 */
export function ChipRail({
  activeKey,
  label,
  testId,
  size = "md",
  className,
  children,
  onOverflowChange,
  railRef,
}: ChipRailProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [pill, setPill] = useState<{ x: number; w: number; h: number; y: number } | null>(null)
  const [animate, setAnimate] = useState(false)
  const lastOverflow = useRef<{ start: boolean; end: boolean } | null>(null)

  const measure = useCallback(() => {
    const rail = ref.current
    if (!rail) return
    const active = rail.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!active) {
      setPill(null)
      return
    }
    const next = { x: active.offsetLeft, y: active.offsetTop, w: active.offsetWidth, h: active.offsetHeight }
    // Only commit real changes: every commit re-renders the chips, and the
    // ResizeObserver below would otherwise turn that into a render loop.
    setPill((current) =>
      current && current.x === next.x && current.y === next.y && current.w === next.w && current.h === next.h
        ? current
        : next,
    )
  }, [])

  const reportOverflow = useCallback(() => {
    const rail = ref.current
    if (!rail || !onOverflowChange) return
    const start = rail.scrollLeft > 4
    const end = rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 4
    if (lastOverflow.current?.start === start && lastOverflow.current?.end === end) return
    lastOverflow.current = { start, end }
    onOverflowChange({ start, end })
  }, [onOverflowChange])

  useIsomorphicLayoutEffect(() => {
    measure()
  }, [activeKey, measure])

  // Turn on the glide only after the first measurement, so the pill does not
  // fly in from the left edge on page load.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setAnimate(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const rail = ref.current
    if (!rail) return
    const ro = new ResizeObserver(() => {
      measure()
      reportOverflow()
    })
    ro.observe(rail)
    rail.querySelectorAll("button").forEach((button) => ro.observe(button))
    document.fonts?.ready.then(() => {
      measure()
      reportOverflow()
    })
    // Chips appear and disappear with the filters; watch for that too.
    const mo = new MutationObserver(() => {
      rail.querySelectorAll("button").forEach((button) => ro.observe(button))
      measure()
      reportOverflow()
    })
    mo.observe(rail, { childList: true })
    return () => {
      ro.disconnect()
      mo.disconnect()
    }
  }, [measure, reportOverflow])

  // Keep the pressed chip in view inside the rail (never scrolls the page).
  useEffect(() => {
    const rail = ref.current
    if (!rail) return
    const active = rail.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!active) return
    const left = active.offsetLeft
    const right = left + active.offsetWidth
    const pad = 32
    if (left < rail.scrollLeft + pad || right > rail.scrollLeft + rail.clientWidth - pad) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      rail.scrollTo({ left: Math.max(0, left - pad), behavior: reduce ? "auto" : "smooth" })
    }
  }, [activeKey])

  const pillStyle = pill
    ? ({
        width: pill.w,
        height: pill.h,
        transform: `translate3d(${pill.x}px, ${pill.y}px, 0)`,
      } as CSSProperties)
    : undefined

  return (
    <div
      ref={(node) => {
        ref.current = node
        railRef?.(node)
      }}
      role="group"
      aria-label={label}
      data-testid={testId}
      data-pill={pill ? "ready" : undefined}
      onScroll={reportOverflow}
      className={cn(
        "group/rail no-scrollbar relative flex snap-x scroll-px-6 gap-1 overflow-x-auto overscroll-x-contain",
        size === "sm" && "gap-1.5",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-0 top-0 rounded-full bg-ink opacity-0 shadow-[0_8px_22px_-10px_rgba(13,35,39,0.55)] group-data-[pill=ready]/rail:opacity-100",
          animate && "transition-[transform,width,height] duration-700 ease-[var(--ease-out-expo)] motion-reduce:transition-none",
        )}
        style={pillStyle}
      />
      {children}
    </div>
  )
}

type ChipProps = {
  active: boolean
  disabled?: boolean
  onClick: () => void
  label: string
  count: number
  testId: string
  size?: "md" | "sm"
}

export function Chip({ active, disabled, onClick, label, count, testId, size = "md" }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      data-testid={testId}
      className={cn(
        "focus-ring relative z-[1] inline-flex shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full font-medium transition-[color,background-color,opacity] duration-500 ease-[var(--ease-out-expo)] disabled:cursor-not-allowed disabled:opacity-35 motion-safe:active:scale-[0.97]",
        size === "md" ? "h-11 px-4 text-[13.5px] lg:h-10" : "h-11 px-3.5 text-[12.5px] lg:h-9",
        active
          ? "bg-ink text-sand-light group-data-[pill=ready]/rail:bg-transparent"
          : "text-foreground/75 hover:bg-ink/[0.06] hover:text-foreground",
        !active && size === "sm" && "ring-1 ring-inset ring-border/80",
      )}
    >
      {label}
      <span
        className={cn(
          "tabular text-[11px] transition-colors duration-500",
          active ? "text-sand-light/65" : "text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  )
}
