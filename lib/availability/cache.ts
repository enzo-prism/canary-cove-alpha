import type { PublicAvailability } from "@/lib/availability/types"

const CACHE_TTL_MS = 15 * 60 * 1000

type CacheEntry = {
  value: PublicAvailability
  expiresAt: number
}

let entry: CacheEntry | null = null

export function readAvailabilityCache(now = Date.now()): PublicAvailability | null {
  if (!entry || entry.expiresAt <= now) return null
  return entry.value
}

export function writeAvailabilityCache(value: PublicAvailability, now = Date.now()): void {
  entry = { value, expiresAt: now + CACHE_TTL_MS }
}

export function clearAvailabilityCache(): void {
  entry = null
}
