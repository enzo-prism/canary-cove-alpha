import { describe, expect, test } from "vitest"

import { classifyCalendarEvents, guestNameTokens } from "@/lib/availability/classify"
import { isDateBooked, mergeRanges } from "@/lib/availability/dates"
import { toPublicAvailability } from "@/lib/availability/public-payload"
import { SAMPLE_CALENDAR_EVENTS } from "@/lib/availability/sample-events"

const classified = classifyCalendarEvents(SAMPLE_CALENDAR_EVENTS)
const byTitle = Object.fromEntries(classified.map((event) => [event.title, event]))
const publicAvailability = toPublicAvailability(SAMPLE_CALENDAR_EVENTS)

describe("guest name tokens", () => {
  test("strips unit and stay-marker words so overlapping titles can match", () => {
    expect(guestNameTokens("Don Arrival Main House")).toEqual(["don"])
    expect(guestNameTokens("Don Listwin")).toEqual(["don", "listwin"])
    expect(guestNameTokens("Arrival 4 persons")).toEqual([])
    expect(guestNameTokens("Villa")).toEqual([])
  })
})

describe("sample event classification", () => {
  test("maps each sample event to a unit with a reason", () => {
    expect(
      classified.map((event) => ({
        title: event.title,
        start: event.start,
        end: event.end,
        unit: event.unit,
        source: event.source,
        flagged: event.flagged,
        reason: event.reason,
      })),
    ).toEqual([
      {
        title: "Lyn Saucier Trip",
        start: "2026-10-13",
        end: "2026-10-24",
        unit: "both",
        source: "untagged",
        flagged: true,
        reason: "Untagged; no overlapping tagged event shares a guest name.",
      },
      {
        title: "Arrival 4 persons",
        start: "2026-10-13",
        end: "2026-10-14",
        unit: "both",
        source: "untagged",
        flagged: true,
        reason: "Untagged; no overlapping tagged event shares a guest name.",
      },
      {
        title: "Villa",
        start: "2026-10-13",
        end: "2026-10-14",
        unit: "villa",
        source: "title",
        flagged: false,
        reason: "Title contains 'villa'.",
      },
      {
        title: "Lyn Saucier Departure",
        start: "2026-10-23",
        end: "2026-10-24",
        unit: "both",
        source: "untagged",
        flagged: true,
        reason: "Untagged; no overlapping tagged event shares a guest name.",
      },
      {
        title: "Don Listwin",
        start: "2026-11-28",
        end: "2026-12-07",
        unit: "main-house",
        source: "inherited",
        flagged: false,
        reason: "Inherited Main House from overlapping 'Don Arrival Main House'.",
      },
      {
        title: "Don Arrival Main House",
        start: "2026-11-28",
        end: "2026-11-29",
        unit: "main-house",
        source: "title",
        flagged: false,
        reason: "Title contains 'main house'.",
      },
      {
        title: "Don Departure",
        start: "2026-12-06",
        end: "2026-12-07",
        unit: "main-house",
        source: "inherited",
        flagged: false,
        reason: "Inherited Main House from overlapping 'Don Listwin'.",
      },
      {
        title: "Doug Overstreet villa 6 pax",
        start: "2026-12-28",
        end: "2027-01-06",
        unit: "villa",
        source: "title",
        flagged: false,
        reason: "Title contains 'villa'.",
      },
      {
        title: "Rob Keller and Sue Kuck villa",
        start: "2027-02-20",
        end: "2027-02-28",
        unit: "villa",
        source: "title",
        flagged: false,
        reason: "Title contains 'villa'.",
      },
      {
        title: "Sonja and Trent Ess Villa",
        start: "2027-03-28",
        end: "2027-04-04",
        unit: "villa",
        source: "title",
        flagged: false,
        reason: "Title contains 'villa'.",
      },
    ])
  })

  test("does not let a villa-only stay block the Main House", () => {
    expect(byTitle["Doug Overstreet villa 6 pax"].unit).toBe("villa")
    expect(publicAvailability.units["main-house"].booked).not.toContainEqual({
      start: "2026-12-28",
      end: "2027-01-06",
    })
    expect(isDateBooked("2026-12-28", publicAvailability.units.villa.booked)).toBe(true)
    expect(isDateBooked("2026-12-28", publicAvailability.units["main-house"].booked)).toBe(false)
  })

  test("inherits Don Listwin onto Main House and leaves Villa open those nights", () => {
    expect(byTitle["Don Listwin"].unit).toBe("main-house")
    expect(isDateBooked("2026-11-28", publicAvailability.units["main-house"].booked)).toBe(true)
    expect(isDateBooked("2026-12-06", publicAvailability.units["main-house"].booked)).toBe(true)
    expect(isDateBooked("2026-12-07", publicAvailability.units["main-house"].booked)).toBe(false)
    expect(isDateBooked("2026-11-28", publicAvailability.units.villa.booked)).toBe(false)
  })

  test("treats untagged Lyn events as blocking both units and flags them", () => {
    expect(byTitle["Lyn Saucier Trip"].flagged).toBe(true)
    expect(byTitle["Lyn Saucier Trip"].unit).toBe("both")
    expect(isDateBooked("2026-10-13", publicAvailability.units.villa.booked)).toBe(true)
    expect(isDateBooked("2026-10-23", publicAvailability.units.villa.booked)).toBe(true)
    expect(isDateBooked("2026-10-24", publicAvailability.units.villa.booked)).toBe(false)
    expect(isDateBooked("2026-10-13", publicAvailability.units["main-house"].booked)).toBe(true)
    expect(isDateBooked("2026-10-23", publicAvailability.units["main-house"].booked)).toBe(true)
  })

  test("uses exclusive end dates so Oct 13-24 blocks through Oct 23", () => {
    const nights = [
      "2026-10-13",
      "2026-10-14",
      "2026-10-23",
      "2026-11-28",
      "2026-12-06",
      "2026-12-28",
      "2027-01-05",
      "2027-02-20",
      "2027-02-27",
      "2027-03-28",
      "2027-04-03",
    ]
    for (const night of nights) {
      const villa = isDateBooked(night, publicAvailability.units.villa.booked)
      const mainHouse = isDateBooked(night, publicAvailability.units["main-house"].booked)
      expect(villa || mainHouse).toBe(true)
    }

    expect(isDateBooked("2026-10-24", publicAvailability.units.villa.booked)).toBe(false)
    expect(isDateBooked("2026-12-07", publicAvailability.units["main-house"].booked)).toBe(false)
    expect(isDateBooked("2027-01-06", publicAvailability.units.villa.booked)).toBe(false)
  })

  test("public payload is dates only", () => {
    const serialized = JSON.stringify(publicAvailability)
    expect(serialized).not.toMatch(/Lyn|Saucier|Listwin|Overstreet|Keller|Kuck|Sonja|Trent|Arrival|Departure|persons|pax/i)
    expect(publicAvailability).toEqual({
      timezone: "America/Belize",
      units: {
        villa: {
          booked: [
            { start: "2026-10-13", end: "2026-10-24" },
            { start: "2026-12-28", end: "2027-01-06" },
            { start: "2027-02-20", end: "2027-02-28" },
            { start: "2027-03-28", end: "2027-04-04" },
          ],
        },
        "main-house": {
          booked: [
            { start: "2026-10-13", end: "2026-10-24" },
            { start: "2026-11-28", end: "2026-12-07" },
          ],
        },
      },
    })
  })
})

describe("range merge", () => {
  test("merges overlapping and adjacent exclusive ranges", () => {
    expect(
      mergeRanges([
        { start: "2026-10-13", end: "2026-10-14" },
        { start: "2026-10-13", end: "2026-10-24" },
        { start: "2026-10-23", end: "2026-10-24" },
      ]),
    ).toEqual([{ start: "2026-10-13", end: "2026-10-24" }])
  })
})
