import { blockedUnitsFor, classifyCalendarEvents } from "@/lib/availability/classify"
import { availabilityWindow, mergeRanges } from "@/lib/availability/dates"
import {
  PROPERTY_TIMEZONE,
  STAY_UNITS,
  type CalendarEvent,
  type DateRange,
  type PublicAvailability,
  type StayUnit,
} from "@/lib/availability/types"

export function toPublicAvailability(events: CalendarEvent[], now = new Date()): PublicAvailability {
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
    window: availabilityWindow(now),
    updatedAt: now.toISOString(),
    units: {
      villa: { booked: mergeRanges(ranges.villa) },
      "main-house": { booked: mergeRanges(ranges["main-house"]) },
    },
  }
}

export function emptyPublicAvailability(now = new Date()): PublicAvailability {
  return toPublicAvailability([], now)
}

export { STAY_UNITS }
