"use client"

import { useEffect, useMemo, useState } from "react"

import { ArrowUp, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"

import { addDays, addMonths, isDateBooked, isIsoDate, monthGrid, startOfMonth, todayInPropertyTz } from "@/lib/availability/dates"
import type { DateRange, PublicAvailability, StayUnit } from "@/lib/availability/types"
import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/container"
import { SplitText } from "@/components/motion/split-text"
import styles from "@/components/book/wizard.module.css"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const

const UNIT_COPY: Record<StayUnit, { title: string; hint: string }> = {
  villa: { title: "Villa", hint: "1–3 suites" },
  "main-house": { title: "Main House", hint: "5 suites · returning guests" },
}

type AvailabilityResponse = PublicAvailability & { ok?: boolean }

function validAvailability(payload: AvailabilityResponse): boolean {
  return payload.ok === true && payload.timezone === "America/Belize" &&
    !!payload.window && isIsoDate(payload.window.start) && isIsoDate(payload.window.end) &&
    payload.window.start < payload.window.end &&
    typeof payload.updatedAt === "string" && Number.isFinite(Date.parse(payload.updatedAt)) &&
    (["villa", "main-house"] as const).every((unit) =>
      Array.isArray(payload.units?.[unit]?.booked) && payload.units[unit].booked.every((range) =>
        isIsoDate(range.start) && isIsoDate(range.end) && range.start < range.end,
      ),
    )
}

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

function formatMonth(monthStart: string): string {
  return monthFormatter.format(new Date(`${monthStart}T12:00:00Z`))
}

function formatDay(isoDate: string): string {
  return dayFormatter.format(new Date(`${isoDate}T12:00:00Z`))
}

type DayState = "open" | "booked" | "unknown"

function UnitMonth({
  unit,
  monthStart,
  booked,
  today,
  window,
}: {
  unit: StayUnit
  monthStart: string
  booked: DateRange[]
  today: string
  window: DateRange
}) {
  const cells = useMemo(() => monthGrid(monthStart), [monthStart])
  const copy = UNIT_COPY[unit]

  const stateOf = (isoDate: string | null): DayState | null => {
    if (!isoDate || isoDate.slice(0, 7) !== monthStart.slice(0, 7)) return null
    const checked = isoDate >= today && isoDate >= window.start && isoDate < window.end
    if (!checked) return "unknown"
    return isDateBooked(isoDate, booked) ? "booked" : "open"
  }

  const openNights = cells.filter((isoDate) => stateOf(isoDate) === "open").length

  return (
    <section
      data-testid={`availability-unit-${unit}`}
      aria-label={`${copy.title} availability for ${formatMonth(monthStart)}`}
      className="min-w-0"
    >
      <div className="flex items-end justify-between gap-3 border-b border-border/70 pb-4">
        <div>
          <h3 className="font-display text-[1.75rem] leading-none text-foreground">{copy.title}</h3>
          <p className="mt-1.5 text-xs text-muted-foreground">{copy.hint}</p>
        </div>
        <p key={monthStart} className={cn(styles.monthIn, "text-right text-xs tabular-nums text-muted-foreground")}>
          <span className="font-display text-xl leading-none text-foreground">{openNights}</span> open nights
        </p>
      </div>
      <div className="mt-4 grid grid-cols-7 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {WEEKDAYS.map((day) => (
          <span key={day} aria-hidden>
            {day.slice(0, 2)}
          </span>
        ))}
      </div>
      <div key={monthStart} className={cn(styles.monthIn, "mt-2 grid grid-cols-7 gap-y-1.5")}>
        {cells.map((isoDate, index) => {
          if (!isoDate) {
            return <span key={`empty-${index}`} className="h-11" aria-hidden />
          }

          const state = stateOf(isoDate) ?? "unknown"
          const column = index % 7
          const prevBooked = column > 0 && stateOf(cells[index - 1] ?? null) === "booked"
          const nextBooked = column < 6 && stateOf(cells[index + 1] ?? null) === "booked"
          const isToday = isoDate === today

          return (
            <span
              key={isoDate}
              data-testid={`availability-day-${unit}-${isoDate}`}
              data-booked={state === "unknown" ? "unknown" : state === "booked" ? "true" : "false"}
              aria-label={`${formatDay(isoDate)}, ${state === "unknown" ? "not available to check" : state === "booked" ? "booked" : "open"}`}
              className="relative flex h-11 items-center justify-center text-sm tabular-nums"
            >
              {state === "booked" ? (
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-1 left-0 right-0 bg-ink",
                    !prevBooked && "left-1 rounded-l-full",
                    !nextBooked && "right-1 rounded-r-full",
                  )}
                />
              ) : null}
              <span
                aria-hidden
                className={cn(
                  "relative",
                  state === "booked" && "text-sand-light/55 line-through decoration-sand-light/40",
                  state === "open" && "text-foreground",
                  state === "unknown" && "text-muted-foreground/35",
                )}
              >
                {Number(isoDate.slice(-2))}
              </span>
              {isToday ? (
                <span aria-hidden className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-canary-deep" />
              ) : null}
            </span>
          )
        })}
      </div>
    </section>
  )
}

export function AvailabilityCalendar() {
  const [availability, setAvailability] = useState<PublicAvailability | null>(null)
  const [loading, setLoading] = useState(true)
  const [monthStart, setMonthStart] = useState(() => startOfMonth(todayInPropertyTz()))
  const today = todayInPropertyTz()

  useEffect(() => {
    let cancelled = false
    let inFlight = false
    let requestController: AbortController | null = null

    const load = async () => {
      if (inFlight) return
      inFlight = true
      const controller = new AbortController()
      requestController = controller
      const timeout = setTimeout(() => controller.abort(), 25_000)
      try {
        const response = await fetch("/api/availability", {
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: controller.signal,
        })
        if (!response.ok) throw new Error("Availability unavailable")
        const payload = (await response.json()) as AvailabilityResponse
        if (!validAvailability(payload)) throw new Error("Invalid availability")
        if (cancelled) return
        setAvailability({
          timezone: payload.timezone,
          window: payload.window,
          updatedAt: payload.updatedAt,
          units: payload.units,
        })
        setMonthStart((current) => {
          const firstMonth = startOfMonth(payload.window.start)
          const lastMonth = startOfMonth(addDays(payload.window.end, -1))
          return current < firstMonth ? firstMonth : current > lastMonth ? lastMonth : current
        })
      } catch {
        if (!cancelled) setAvailability(null)
      } finally {
        clearTimeout(timeout)
        requestController = null
        inFlight = false
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    const interval = setInterval(() => { void load() }, 120_000)
    const refresh = () => { if (document.visibilityState === "visible") void load() }
    window.addEventListener("focus", refresh)
    document.addEventListener("visibilitychange", refresh)
    return () => {
      cancelled = true
      requestController?.abort()
      clearInterval(interval)
      window.removeEventListener("focus", refresh)
      document.removeEventListener("visibilitychange", refresh)
    }
  }, [])

  if (!availability) return (
    <section
      id="availability"
      aria-label="Availability"
      className="[--anchor-extra:16px] py-14 sm:py-20"
    >
      <Container size="wide">
        <div className="flex flex-col gap-5 border-y border-border/70 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <div className="flex items-start gap-4">
            <span aria-hidden className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand-deep">
              <CalendarDays className="h-5 w-5 text-lagoon" strokeWidth={1.6} />
            </span>
            <div className="space-y-1">
              <p className="eyebrow eyebrow-plain">Availability</p>
              <p role="status" className="max-w-xl text-[15px] leading-6 text-foreground/85">
                {loading
                  ? "Checking available dates…"
                  : "Send your preferred dates above and we’ll confirm availability personally."}
              </p>
            </div>
          </div>
          {!loading ? (
            <a href="#booking-form" className="link-underline inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-medium text-lagoon">
              <ArrowUp className="h-4 w-4" aria-hidden />
              Back to your request
            </a>
          ) : null}
        </div>
      </Container>
    </section>
  )

  const firstMonth = startOfMonth(availability.window.start)
  const lastMonth = startOfMonth(addDays(availability.window.end, -1))

  const navButton =
    "focus-ring flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/20 text-foreground transition-[background-color,color,border-color] duration-500 ease-[var(--ease-out-expo)] hover:border-ink hover:bg-ink hover:text-sand-light disabled:pointer-events-none disabled:opacity-30"

  return (
    <section
      id="availability"
      data-testid="availability-calendar"
      aria-label="Live availability"
      className="[--anchor-extra:16px] py-20 sm:py-28"
    >
      <Container size="wide">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <div className="flow flow-md">
            <p data-reveal="fade" className="eyebrow">
              Live availability
            </p>
            <SplitText as="h2" text="Villa & Main House, *booked separately.*" className="text-section max-w-[16ch] text-balance" />
          </div>
          <div data-reveal="up" className="flow flow-md">
            <p className="text-lede max-w-md">
              Check open nights, then send your preferred dates. We confirm every request personally.
            </p>
            <a href="#booking-form" className="link-underline inline-flex min-h-11 w-fit items-center gap-2 text-sm font-medium text-lagoon">
              <ArrowUp className="h-4 w-4" aria-hidden />
              Back to your request
            </a>
          </div>
        </div>

        <div className="mt-10 rounded-[28px] border border-border/70 bg-surface p-5 shadow-[var(--shadow-subtle)] sm:mt-14 sm:p-8 lg:p-10">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className={navButton}
              aria-label="Previous month"
              data-testid="availability-prev-month"
              disabled={monthStart <= firstMonth}
              onClick={() => setMonthStart((current) => addMonths(current, -1))}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <p
              aria-live="polite"
              className="min-w-0 text-center font-display text-[1.75rem] leading-none text-foreground sm:text-[2.25rem]"
              data-testid="availability-month-label"
            >
              {formatMonth(monthStart)}
            </p>
            <button
              type="button"
              className={navButton}
              aria-label="Next month"
              data-testid="availability-next-month"
              disabled={monthStart >= lastMonth}
              onClick={() => setMonthStart((current) => addMonths(current, 1))}
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-0 md:divide-x md:divide-border/70">
            <div className="md:pr-8 lg:pr-10">
              <UnitMonth unit="villa" monthStart={monthStart} booked={availability.units.villa.booked} today={today} window={availability.window} />
            </div>
            <div className="md:pl-8 lg:pl-10">
              <UnitMonth
                unit="main-house"
                monthStart={monthStart}
                booked={availability.units["main-house"].booked}
                today={today}
                window={availability.window}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
              <li className="inline-flex items-center gap-2.5">
                <span className="h-3 w-6 rounded-full border border-border bg-white" aria-hidden />
                Open
              </li>
              <li className="inline-flex items-center gap-2.5">
                <span className="h-3 w-6 rounded-full bg-ink" aria-hidden />
                Booked
              </li>
              <li className="inline-flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-canary-deep" aria-hidden />
                Today
              </li>
            </ul>
            <p className="text-xs leading-5 text-muted-foreground">
              Calendar updates automatically. For dates after {formatDay(addDays(availability.window.end, -1))}, send us a request.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
