import type { CalendarEvent } from "@/lib/availability/types"

/** Verified sample stays from the property calendar (24 Sep 2026). End dates are exclusive. */
export const SAMPLE_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: "lyn-trip", title: "Lyn Saucier Trip", start: "2026-10-13", end: "2026-10-24" },
  { id: "lyn-arrival", title: "Arrival 4 persons", start: "2026-10-13", end: "2026-10-14" },
  { id: "lyn-villa", title: "Villa", start: "2026-10-13", end: "2026-10-14" },
  { id: "lyn-departure", title: "Lyn Saucier Departure", start: "2026-10-23", end: "2026-10-24" },
  { id: "don-stay", title: "Don Listwin", start: "2026-11-28", end: "2026-12-07" },
  { id: "don-arrival", title: "Don Arrival Main House", start: "2026-11-28", end: "2026-11-29" },
  { id: "don-departure", title: "Don Departure", start: "2026-12-06", end: "2026-12-07" },
  { id: "doug-villa", title: "Doug Overstreet villa 6 pax", start: "2026-12-28", end: "2027-01-06" },
  { id: "rob-villa", title: "Rob Keller and Sue Kuck villa", start: "2027-02-20", end: "2027-02-28" },
  { id: "sonja-villa", title: "Sonja and Trent Ess Villa", start: "2027-03-28", end: "2027-04-04" },
]
