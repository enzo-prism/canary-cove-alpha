import { rangesOverlap } from "@/lib/availability/dates"
import type {
  CalendarEvent,
  ClassificationSource,
  ClassificationUnit,
  ClassifiedEvent,
  StayUnit,
} from "@/lib/availability/types"

const TITLE_NOISE = new Set([
  "a",
  "an",
  "and",
  "arrival",
  "departure",
  "for",
  "from",
  "guest",
  "guests",
  "house",
  "main",
  "night",
  "nights",
  "of",
  "pax",
  "person",
  "persons",
  "stay",
  "the",
  "to",
  "trip",
  "villa",
  "villas",
  "with",
])

function titleUnit(title: string): ClassificationUnit | null {
  const normalized = title.toLowerCase()
  const hasVilla = /\bvillas?\b/.test(normalized)
  const hasMainHouse = /\bmain\s+house\b/.test(normalized)
  if (hasVilla && hasMainHouse) return "both"
  if (hasVilla) return "villa"
  if (hasMainHouse) return "main-house"
  return null
}

export function guestNameTokens(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 0 && !TITLE_NOISE.has(token) && !/^\d+$/.test(token))
}

function sharesGuestName(left: string, right: string): boolean {
  const leftTokens = guestNameTokens(left)
  const rightTokens = guestNameTokens(right)
  if (leftTokens.length === 0 || rightTokens.length === 0) return false
  return leftTokens.some((token) => rightTokens.includes(token))
}

function unitsBlockedBy(unit: ClassificationUnit): StayUnit[] {
  switch (unit) {
    case "villa":
      return ["villa"]
    case "main-house":
      return ["main-house"]
    case "both":
      return ["villa", "main-house"]
    default: {
      const exhaustive: never = unit
      return exhaustive
    }
  }
}

function assign(
  event: CalendarEvent,
  unit: ClassificationUnit,
  source: ClassificationSource,
  reason: string,
  flagged: boolean,
): ClassifiedEvent {
  return { ...event, unit, source, reason, flagged }
}

export function classifyCalendarEvents(events: CalendarEvent[]): ClassifiedEvent[] {
  const classified = events.map((event) => {
    const fromTitle = titleUnit(event.title)
    if (fromTitle === "villa") {
      return assign(event, "villa", "title", "Title contains 'villa'.", false)
    }
    if (fromTitle === "main-house") {
      return assign(event, "main-house", "title", "Title contains 'main house'.", false)
    }
    if (fromTitle === "both") {
      return assign(event, "both", "ambiguous", "Title names both Villa and Main House.", true)
    }
    return assign(
      event,
      "both",
      "untagged",
      "Untagged; no overlapping tagged event shares a guest name.",
      true,
    )
  })

  let changed = true
  while (changed) {
    changed = false
    for (const event of classified) {
      if (event.source !== "untagged") continue

      const donors = classified.filter(
        (other) =>
          other.id !== event.id &&
          (other.unit === "villa" || other.unit === "main-house") &&
          rangesOverlap(event, other) &&
          sharesGuestName(event.title, other.title),
      )
      const donorUnits = new Set(donors.map((donor) => donor.unit))

      if (donorUnits.size === 1) {
        const unit = donors[0].unit
        const donor = donors[0]
        event.unit = unit
        event.source = "inherited"
        event.flagged = false
        event.reason = `Inherited ${unit === "villa" ? "Villa" : "Main House"} from overlapping '${donor.title}'.`
        changed = true
        continue
      }

      if (donorUnits.size > 1) {
        event.unit = "both"
        event.source = "ambiguous"
        event.flagged = true
        event.reason = "Overlapping tagged events name different units for the same guest."
        changed = true
      }
    }
  }

  return classified
}

export function blockedUnitsFor(event: ClassifiedEvent): StayUnit[] {
  return unitsBlockedBy(event.unit)
}
