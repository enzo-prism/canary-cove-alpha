"use client"

import { useEffect, useMemo, useState } from "react"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { addDays, addMonths, isDateBooked, isIsoDate, monthGrid, startOfMonth, todayInPropertyTz } from "@/lib/availability/dates"
import type { DateRange, PublicAvailability, StayUnit } from "@/lib/availability/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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

  return (
    <section
      data-testid={`availability-unit-${unit}`}
      aria-label={`${copy.title} availability for ${formatMonth(monthStart)}`}
      className="rounded-[26px] border border-border/60 bg-surface-elevated/80 p-4 sm:p-5"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[15px] font-semibold text-foreground">{copy.title}</h3>
        <p className="text-[12px] text-muted-foreground">{copy.hint}</p>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {cells.map((isoDate, index) => {
          if (!isoDate) {
            return <span key={`empty-${index}`} className="min-h-10" aria-hidden />
          }

          const bookedDay = isDateBooked(isoDate, booked)
          const checkedDay = isoDate >= today && isoDate >= window.start && isoDate < window.end
          const isToday = isoDate === today
          return (
            <span
              key={isoDate}
              data-testid={`availability-day-${unit}-${isoDate}`}
              data-booked={checkedDay ? (bookedDay ? "true" : "false") : "unknown"}
              aria-label={`${formatDay(isoDate)}, ${checkedDay ? (bookedDay ? "booked" : "open") : "not available to check"}`}
              className={cn(
                "flex min-h-10 items-center justify-center rounded-xl text-sm tabular-nums",
                !checkedDay
                  ? "bg-transparent text-muted-foreground/50"
                  : bookedDay
                  ? "bg-[#0B1F24] text-white"
                  : "bg-background/80 text-foreground",
                isToday && checkedDay && !bookedDay && "ring-1 ring-[#B98A2F]",
              )}
            >
              {Number(isoDate.slice(-2))}
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
    <section id="availability" aria-label="Availability" className="scroll-mt-[calc(var(--site-header-height)+16px)] px-4 pt-10 sm:px-6 lg:px-8">
      <p role="status" className="mx-auto max-w-6xl text-sm leading-6 text-muted-foreground">
        {loading ? "Checking available dates…" : "Send your preferred dates below and we’ll confirm availability personally."}
      </p>
    </section>
  )

  const firstMonth = startOfMonth(availability.window.start)
  const lastMonth = startOfMonth(addDays(availability.window.end, -1))

  return (
    <section
      id="availability"
      data-testid="availability-calendar"
      aria-label="Live availability"
      className="scroll-mt-[calc(var(--site-header-height)+16px)] px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="form-shell mx-auto max-w-6xl p-5 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#B98A2F]">Live availability</p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Villa &amp; Main House, booked separately.
            </h2>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Check open nights, then send your preferred dates below. We confirm every request personally.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous month"
              data-testid="availability-prev-month"
              disabled={monthStart <= firstMonth}
              onClick={() => setMonthStart((current) => addMonths(current, -1))}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </Button>
            <p className="min-w-[10rem] text-center text-sm font-semibold text-foreground" data-testid="availability-month-label">
              {formatMonth(monthStart)}
            </p>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next month"
              data-testid="availability-next-month"
              disabled={monthStart >= lastMonth}
              onClick={() => setMonthStart((current) => addMonths(current, 1))}
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <UnitMonth unit="villa" monthStart={monthStart} booked={availability.units.villa.booked} today={today} window={availability.window} />
          <UnitMonth
            unit="main-house"
            monthStart={monthStart}
            booked={availability.units["main-house"].booked}
            today={today}
            window={availability.window}
          />
        </div>

        <ul className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <li className="inline-flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-sm bg-[#0B1F24]" aria-hidden />
            Booked
          </li>
          <li className="inline-flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-sm border border-border/70 bg-background/80" aria-hidden />
            Open
          </li>
        </ul>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Calendar updates automatically. For dates after {formatDay(addDays(availability.window.end, -1))}, send us a request.
        </p>
      </div>
    </section>
  )
}
