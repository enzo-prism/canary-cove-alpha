import { PROPERTY_TIMEZONE, type DateRange } from "@/lib/availability/types"

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const MS_PER_DAY = 86_400_000

export function isIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false
  const date = new Date(`${value}T12:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function todayInPropertyTz(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PROPERTY_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now)
}

export function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function startOfMonth(isoDate: string): string {
  return `${isoDate.slice(0, 7)}-01`
}

export function addMonths(isoDate: string, months: number): string {
  const date = new Date(`${startOfMonth(isoDate)}T12:00:00Z`)
  date.setUTCMonth(date.getUTCMonth() + months)
  return `${date.toISOString().slice(0, 7)}-01`
}

export function rangesOverlap(left: DateRange, right: DateRange): boolean {
  return left.start < right.end && right.start < left.end
}

export function mergeRanges(ranges: DateRange[]): DateRange[] {
  const sorted = [...ranges].filter((range) => range.start < range.end).sort((left, right) => {
    const startOrder = left.start.localeCompare(right.start)
    return startOrder !== 0 ? startOrder : left.end.localeCompare(right.end)
  })

  const merged: DateRange[] = []
  for (const range of sorted) {
    const last = merged[merged.length - 1]
    if (!last || range.start > last.end) {
      merged.push({ start: range.start, end: range.end })
      continue
    }
    if (range.end > last.end) last.end = range.end
  }
  return merged
}

export function isDateBooked(isoDate: string, ranges: DateRange[]): boolean {
  return ranges.some((range) => isoDate >= range.start && isoDate < range.end)
}

export function monthGrid(monthStart: string): Array<string | null> {
  const first = new Date(`${startOfMonth(monthStart)}T12:00:00Z`)
  const weekday = first.getUTCDay()
  const daysInMonth = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate()
  const cells: Array<string | null> = Array.from({ length: weekday }, () => null)

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(`${monthStart.slice(0, 7)}-${String(day).padStart(2, "0")}`)
  }

  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function daysBetween(start: string, end: string): number {
  const startDate = new Date(`${start}T12:00:00Z`)
  const endDate = new Date(`${end}T12:00:00Z`)
  return Math.round((endDate.getTime() - startDate.getTime()) / MS_PER_DAY)
}
