import { blockedUnitsFor, classifyCalendarEvents } from "@/lib/availability/classify"
import { mergeRanges } from "@/lib/availability/dates"
import {
  PROPERTY_TIMEZONE,
  STAY_UNITS,
  type CalendarEvent,
  type DateRange,
  type PublicAvailability,
  type StayUnit,
} from "@/lib/availability/types"

export function toPublicAvailability(events: CalendarEvent[]): PublicAvailability {
  const classified = classifyCalendarEvents(events)
  const ranges: Record<StayUnit, DateRange[]> = {
    villa: [],
    "main-house": [],
  }

  for (const event of classified) {
    for (const unit of blockedUnitsFor(event)) {
      ranges[unit].push({ start: event.start, end: event.end })
    }
  }

  return {
    timezone: PROPERTY_TIMEZONE,
    units: {
      villa: { booked: mergeRanges(ranges.villa) },
      "main-house": { booked: mergeRanges(ranges["main-house"]) },
    },
  }
}

export function emptyPublicAvailability(): PublicAvailability {
  return {
    timezone: PROPERTY_TIMEZONE,
    units: {
      villa: { booked: [] },
      "main-house": { booked: [] },
    },
  }
}

export { STAY_UNITS }
