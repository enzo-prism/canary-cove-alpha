import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import { GET } from "@/app/api/availability/route"
import { clearAvailabilityCache } from "@/lib/availability/cache"
import { listCalendarEvents } from "@/lib/availability/google-calendar"

vi.mock("@/lib/availability/google-calendar", () => ({ listCalendarEvents: vi.fn() }))

beforeEach(() => {
  clearAvailabilityCache()
  vi.clearAllMocks()
  vi.useFakeTimers({ toFake: ["Date"] })
  vi.setSystemTime(new Date("2026-10-02T18:00:00Z"))
})

afterEach(() => vi.useRealTimers())

describe("public availability endpoint", () => {
  test("returns dates and checked bounds, keeps names private, and expires cached reads", async () => {
    vi.mocked(listCalendarEvents).mockResolvedValue({ ok: true, events: [
      { id: "private-id", title: "Private Guest Villa", start: "2026-10-10", end: "2026-10-15" },
    ] })
    const response = await GET()
    const payload = await response.json()
    expect(response.status).toBe(200)
    expect(payload.window).toEqual({ start: "2026-10-02", end: "2028-04-02" })
    expect(payload.units.villa.booked).toEqual([{ start: "2026-10-10", end: "2026-10-15" }])
    expect(payload.units["main-house"].booked).toEqual([])
    expect(JSON.stringify(payload)).not.toMatch(/Private|Guest|private-id/)
    await GET()
    expect(listCalendarEvents).toHaveBeenCalledTimes(1)

    vi.setSystemTime(new Date("2026-10-02T18:01:01Z"))
    vi.mocked(listCalendarEvents).mockResolvedValue({ ok: false, reason: "upstream" })
    const failed = await GET()
    expect(failed.status).toBe(502)
    expect(failed.headers.get("Cache-Control")).toBe("no-store")
    expect(await failed.json()).toEqual({ ok: false })
  })

  test("missing credentials and unexpected errors never masquerade as open dates", async () => {
    vi.mocked(listCalendarEvents).mockResolvedValue({ ok: false, reason: "missing-credentials" })
    expect((await GET()).status).toBe(503)
    vi.mocked(listCalendarEvents).mockRejectedValue(new Error("private upstream details"))
    const response = await GET()
    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ ok: false })
  })
})
