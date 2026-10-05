import { generateKeyPairSync } from "node:crypto"

import { describe, expect, test } from "vitest"

import { listCalendarEvents } from "@/lib/availability/google-calendar"
import { toPublicAvailability } from "@/lib/availability/public-payload"

const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 })
const SERVICE_ACCOUNT_JSON = JSON.stringify({
  client_email: "canary-cove-calendar-reader@canary-cove-calendar.iam.gserviceaccount.com",
  private_key: privateKey.export({ type: "pkcs8", format: "pem" }),
})

describe("listCalendarEvents", () => {
  test("returns missing-credentials when the service account JSON is absent", async () => {
    const result = await listCalendarEvents({ env: {} })
    expect(result).toEqual({ ok: false, reason: "missing-credentials" })
  })

  test("reads all-day events via events.list and drops titles from the public payload", async () => {
    const fetchImpl: typeof fetch = async (input, init) => {
      const url = String(input)
      if (url.includes("oauth2.googleapis.com/token")) {
        expect(init?.method).toBe("POST")
        return Response.json({ access_token: "test-token" })
      }

      expect(url).toContain("/calendars/canarycove%40gmail.com/events")
      expect(url).toContain("singleEvents=true")
      expect(new URL(url).searchParams.get("timeMin")).toBe("2042-01-18T00:00:00-06:00")
      expect(new URL(url).searchParams.get("timeMax")).toBe("2043-07-20T00:00:00-06:00")
      expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer test-token")
      return Response.json({
        items: [
          {
            id: "fixture-paperkite-trip",
            status: "confirmed",
            summary: "Mira Paperkite Trip",
            start: { date: "2042-02-11" },
            end: { date: "2042-02-16" },
            transparency: "transparent",
          },
          {
            id: "cancelled",
            status: "cancelled",
            summary: "Should be ignored",
            start: { date: "2042-02-01" },
            end: { date: "2042-02-03" },
          },
        ],
      })
    }

    const result = await listCalendarEvents({
      env: { GOOGLE_CALENDAR_SERVICE_ACCOUNT_JSON: SERVICE_ACCOUNT_JSON },
      fetchImpl,
      now: new Date("2042-01-18T18:00:00Z"),
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.events).toEqual([
      { id: "fixture-paperkite-trip", title: "Mira Paperkite Trip", start: "2042-02-11", end: "2042-02-16" },
    ])

    const publicPayload = toPublicAvailability(result.events)
    expect(JSON.stringify(publicPayload)).not.toMatch(/Mira Paperkite/)
    expect(publicPayload.units.villa.booked).toEqual([{ start: "2042-02-11", end: "2042-02-16" }])
    expect(publicPayload.units["main-house"].booked).toEqual([{ start: "2042-02-11", end: "2042-02-16" }])
  })

  test("reads every page and includes timed events that start and end on the same day", async () => {
    const pages: string[] = []
    const fetchImpl: typeof fetch = async (input) => {
      if (String(input).includes("oauth2.googleapis.com")) return Response.json({ access_token: "test-token" })
      const page = new URL(String(input)).searchParams.get("pageToken") ?? "first"
      pages.push(page)
      return Response.json(page === "first" ? {
        items: [{ id: "timed", summary: "Villa", start: { dateTime: "2042-02-11T14:00:00-06:00" }, end: { dateTime: "2042-02-11T18:00:00-06:00" } }],
        nextPageToken: "second",
      } : {
        items: [{ id: "midnight", summary: "Main House", start: { dateTime: "2042-02-18T14:00:00-06:00" }, end: { dateTime: "2042-02-21T00:00:00-06:00" } }],
      })
    }
    const result = await listCalendarEvents({ env: { GOOGLE_CALENDAR_SERVICE_ACCOUNT_JSON: SERVICE_ACCOUNT_JSON }, fetchImpl })
    expect(pages).toEqual(["first", "second"])
    expect(result).toEqual({ ok: true, events: [
      { id: "timed", title: "Villa", start: "2042-02-11", end: "2042-02-12" },
      { id: "midnight", title: "Main House", start: "2042-02-18", end: "2042-02-21" },
    ] })
  })

  test("fails safely if pagination repeats or Google refuses calendar access", async () => {
    for (const denied of [false, true]) {
      const fetchImpl: typeof fetch = async (input) => {
        if (String(input).includes("oauth2.googleapis.com")) return Response.json({ access_token: "test-token" })
        return denied ? Response.json({}, { status: 403 }) : Response.json({ items: [], nextPageToken: "repeat" })
      }
      expect(await listCalendarEvents({ env: { GOOGLE_CALENDAR_SERVICE_ACCOUNT_JSON: SERVICE_ACCOUNT_JSON }, fetchImpl }))
        .toEqual({ ok: false, reason: "upstream" })
    }
  })
})
