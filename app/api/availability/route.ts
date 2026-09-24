import { listCalendarEvents } from "@/lib/availability/google-calendar"
import { clearAvailabilityCache, readAvailabilityCache, writeAvailabilityCache } from "@/lib/availability/cache"
import { toPublicAvailability } from "@/lib/availability/public-payload"

export const dynamic = "force-dynamic"

const SUCCESS_CACHE = "public, s-maxage=900, stale-while-revalidate=60"
const FAILURE_CACHE = "no-store"

function unavailable(status: number) {
  return Response.json({ ok: false }, { status, headers: { "Cache-Control": FAILURE_CACHE } })
}

export async function GET() {
  const cached = readAvailabilityCache()
  if (cached) {
    return Response.json({ ok: true, ...cached }, { headers: { "Cache-Control": SUCCESS_CACHE } })
  }

  try {
    const result = await listCalendarEvents()
    if (!result.ok) {
      if (result.reason === "missing-credentials") {
        clearAvailabilityCache()
        return unavailable(503)
      }
      return unavailable(502)
    }

    const availability = toPublicAvailability(result.events)
    writeAvailabilityCache(availability)
    return Response.json({ ok: true, ...availability }, { headers: { "Cache-Control": SUCCESS_CACHE } })
  } catch {
    return unavailable(502)
  }
}
