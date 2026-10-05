import { describe, expect, test } from "vitest"

import { classifyCalendarEvents, guestNameTokens } from "@/lib/availability/classify"
import { isDateBooked, mergeRanges } from "@/lib/availability/dates"
import { toPublicAvailability } from "@/lib/availability/public-payload"
import { SAMPLE_CALENDAR_EVENTS } from "@/lib/availability/sample-events"

const classified = classifyCalendarEvents(SAMPLE_CALENDAR_EVENTS)
const byTitle = Object.fromEntries(classified.map((event) => [event.title, event]))
const checkedAt = new Date("2042-02-03T18:00:00Z")
const publicAvailability = toPublicAvailability(SAMPLE_CALENDAR_EVENTS, checkedAt)

describe("guest name tokens", () => {
  test("strips unit and stay-marker words so overlapping titles can match", () => {
    expect(guestNameTokens("Theo Cloudberry Arrival Main House")).toEqual(["theo", "cloudberry"])
    expect(guestNameTokens("Theo Cloudberry")).toEqual(["theo", "cloudberry"])
    expect(guestNameTokens("Ada Meridian")).toEqual(["ada", "meridian"])
    expect(guestNameTokens("Arrival 3 persons")).toEqual([])
    expect(guestNameTokens("Villa")).toEqual([])
  })
})

describe("sample event classification", () => {
  test("recognizes common Main House title formats", () => {
    for (const title of ["Guest MainHouse", "Guest Main-House", "Guest Main House"]) {
      expect(classifyCalendarEvents([{ id: title, title, start: "2042-02-09", end: "2042-02-10" }])[0].unit).toBe("main-house")
    }
  })
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
        title: "Mira Paperkite Trip",
        start: "2042-02-11",
        end: "2042-02-16",
        unit: "both",
        source: "untagged",
        flagged: true,
        reason: "Untagged; no overlapping tagged event shares a guest name.",
      },
      {
        title: "Arrival 3 persons",
        start: "2042-02-11",
        end: "2042-02-12",
        unit: "both",
        source: "untagged",
        flagged: true,
        reason: "Untagged; no overlapping tagged event shares a guest name.",
      },
      {
        title: "Villa",
        start: "2042-02-11",
        end: "2042-02-12",
        unit: "villa",
        source: "title",
        flagged: false,
        reason: "Title contains 'villa'.",
      },
      {
        title: "Mira Paperkite Departure",
        start: "2042-02-15",
        end: "2042-02-16",
        unit: "both",
        source: "untagged",
        flagged: true,
        reason: "Untagged; no overlapping tagged event shares a guest name.",
      },
      {
        title: "Theo Cloudberry",
        start: "2042-03-07",
        end: "2042-03-11",
        unit: "main-house",
        source: "inherited",
        flagged: false,
        reason: "Inherited Main House from overlapping 'Theo Cloudberry Arrival Main House'.",
      },
      {
        title: "Theo Cloudberry Arrival Main House",
        start: "2042-03-07",
        end: "2042-03-08",
        unit: "main-house",
        source: "title",
        flagged: false,
        reason: "Title contains 'main house'.",
      },
      {
        title: "Theo Cloudberry Departure",
        start: "2042-03-10",
        end: "2042-03-11",
        unit: "main-house",
        source: "inherited",
        flagged: false,
        reason: "Inherited Main House from overlapping 'Theo Cloudberry'.",
      },
      {
        title: "Lena Starfern villa 5 pax",
        start: "2042-04-19",
        end: "2042-04-24",
        unit: "villa",
        source: "title",
        flagged: false,
        reason: "Title contains 'villa'.",
      },
      {
        title: "Noah Pebblewing villa",
        start: "2042-05-04",
        end: "2042-05-07",
        unit: "villa",
        source: "title",
        flagged: false,
        reason: "Title contains 'villa'.",
      },
      {
        title: "Iris Moonquill Villa",
        start: "2042-07-18",
        end: "2042-07-20",
        unit: "villa",
        source: "title",
        flagged: false,
        reason: "Title contains 'villa'.",
      },
    ])
  })

  test("does not let a villa-only stay block the Main House", () => {
    expect(byTitle["Lena Starfern villa 5 pax"].unit).toBe("villa")
    expect(publicAvailability.units["main-house"].booked).not.toContainEqual({
      start: "2042-04-19",
      end: "2042-04-24",
    })
    expect(isDateBooked("2042-04-19", publicAvailability.units.villa.booked)).toBe(true)
    expect(isDateBooked("2042-04-19", publicAvailability.units["main-house"].booked)).toBe(false)
  })

  test("inherits Theo Cloudberry onto Main House and leaves Villa open those nights", () => {
    expect(byTitle["Theo Cloudberry"].unit).toBe("main-house")
    expect(isDateBooked("2042-03-07", publicAvailability.units["main-house"].booked)).toBe(true)
    expect(isDateBooked("2042-03-10", publicAvailability.units["main-house"].booked)).toBe(true)
    expect(isDateBooked("2042-03-11", publicAvailability.units["main-house"].booked)).toBe(false)
    expect(isDateBooked("2042-03-07", publicAvailability.units.villa.booked)).toBe(false)
  })

  test("treats untagged Mira Paperkite events as blocking both units and flags them", () => {
    expect(byTitle["Mira Paperkite Trip"].flagged).toBe(true)
    expect(byTitle["Mira Paperkite Trip"].unit).toBe("both")
    expect(isDateBooked("2042-02-11", publicAvailability.units.villa.booked)).toBe(true)
    expect(isDateBooked("2042-02-15", publicAvailability.units.villa.booked)).toBe(true)
    expect(isDateBooked("2042-02-16", publicAvailability.units.villa.booked)).toBe(false)
    expect(isDateBooked("2042-02-11", publicAvailability.units["main-house"].booked)).toBe(true)
    expect(isDateBooked("2042-02-15", publicAvailability.units["main-house"].booked)).toBe(true)
  })

  test("uses exclusive end dates so Feb 11-16 blocks through Feb 15", () => {
    const nights = [
      "2042-02-11",
      "2042-02-12",
      "2042-02-15",
      "2042-03-07",
      "2042-03-10",
      "2042-04-19",
      "2042-04-23",
      "2042-05-04",
      "2042-05-06",
      "2042-07-18",
      "2042-07-19",
    ]
    for (const night of nights) {
      const villa = isDateBooked(night, publicAvailability.units.villa.booked)
      const mainHouse = isDateBooked(night, publicAvailability.units["main-house"].booked)
      expect(villa || mainHouse).toBe(true)
    }

    expect(isDateBooked("2042-02-16", publicAvailability.units.villa.booked)).toBe(false)
    expect(isDateBooked("2042-03-11", publicAvailability.units["main-house"].booked)).toBe(false)
    expect(isDateBooked("2042-04-24", publicAvailability.units.villa.booked)).toBe(false)
  })

  test("public payload is dates only", () => {
    const serialized = JSON.stringify(publicAvailability)
    expect(serialized).not.toMatch(/Paperkite|Cloudberry|Starfern|Pebblewing|Moonquill|Arrival|Departure|persons|pax/i)
    expect(publicAvailability).toEqual({
      timezone: "America/Belize",
      window: { start: "2042-02-03", end: "2043-08-05" },
      updatedAt: checkedAt.toISOString(),
      units: {
        villa: {
          booked: [
            { start: "2042-02-11", end: "2042-02-16" },
            { start: "2042-04-19", end: "2042-04-24" },
            { start: "2042-05-04", end: "2042-05-07" },
            { start: "2042-07-18", end: "2042-07-20" },
          ],
        },
        "main-house": {
          booked: [
            { start: "2042-02-11", end: "2042-02-16" },
            { start: "2042-03-07", end: "2042-03-11" },
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
        { start: "2042-02-11", end: "2042-02-12" },
        { start: "2042-02-11", end: "2042-02-16" },
        { start: "2042-02-15", end: "2042-02-16" },
      ]),
    ).toEqual([{ start: "2042-02-11", end: "2042-02-16" }])
  })
})
