import type { CalendarEvent } from "@/lib/availability/types"

/**
 * Independently invented names, party sizes, dates, and stay lengths for tests.
 * Never copy or date-shift property-calendar bookings into these fixtures.
 * End dates are exclusive. Production availability reads the private calendar.
 */
export const SAMPLE_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: "fixture-paperkite-trip", title: "Mira Paperkite Trip", start: "2042-02-11", end: "2042-02-16" },
  { id: "fixture-paperkite-arrival", title: "Arrival 3 persons", start: "2042-02-11", end: "2042-02-12" },
  { id: "fixture-paperkite-villa", title: "Villa", start: "2042-02-11", end: "2042-02-12" },
  { id: "fixture-paperkite-departure", title: "Mira Paperkite Departure", start: "2042-02-15", end: "2042-02-16" },
  { id: "fixture-cloudberry-stay", title: "Theo Cloudberry", start: "2042-03-07", end: "2042-03-11" },
  { id: "fixture-cloudberry-arrival", title: "Theo Cloudberry Arrival Main House", start: "2042-03-07", end: "2042-03-08" },
  { id: "fixture-cloudberry-departure", title: "Theo Cloudberry Departure", start: "2042-03-10", end: "2042-03-11" },
  { id: "fixture-starfern-villa", title: "Lena Starfern villa 5 pax", start: "2042-04-19", end: "2042-04-24" },
  { id: "fixture-pebblewing-villa", title: "Noah Pebblewing villa", start: "2042-05-04", end: "2042-05-07" },
  { id: "fixture-moonquill-villa", title: "Iris Moonquill Villa", start: "2042-07-18", end: "2042-07-20" },
]
