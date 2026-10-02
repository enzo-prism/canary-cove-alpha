import type { CalendarEvent } from "@/lib/availability/types"

/** Synthetic fixture data for classifier and public-payload tests. End dates are exclusive. */
export const SAMPLE_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: "guest-a-trip", title: "Guest A Trip", start: "2030-10-13", end: "2030-10-24" },
  { id: "guest-a-arrival", title: "Arrival 4 persons", start: "2030-10-13", end: "2030-10-14" },
  { id: "guest-a-villa", title: "Villa", start: "2030-10-13", end: "2030-10-14" },
  { id: "guest-a-departure", title: "Guest A Departure", start: "2030-10-23", end: "2030-10-24" },
  { id: "guest-b-stay", title: "Guest B", start: "2030-11-28", end: "2030-12-07" },
  { id: "guest-b-arrival", title: "Guest B Arrival Main House", start: "2030-11-28", end: "2030-11-29" },
  { id: "guest-b-departure", title: "Guest B Departure", start: "2030-12-06", end: "2030-12-07" },
  { id: "guest-c-villa", title: "Guest C villa 6 pax", start: "2030-12-28", end: "2031-01-06" },
  { id: "guest-d-villa", title: "Guest D villa", start: "2031-02-20", end: "2031-02-28" },
  { id: "guest-e-villa", title: "Guest E Villa", start: "2031-03-28", end: "2031-04-04" },
]
