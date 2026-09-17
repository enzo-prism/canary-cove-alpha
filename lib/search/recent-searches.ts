const STORAGE_KEY = "cc-search-recent"
const MAX_RECENT = 5
const MIN_LENGTH = 3

export function readRecentSearches(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((entry): entry is string => typeof entry === "string").slice(0, MAX_RECENT)
  } catch {
    return []
  }
}

export function recordRecentSearch(query: string) {
  const value = query.trim()
  if (typeof window === "undefined" || value.length < MIN_LENGTH) return
  try {
    const next = [value, ...readRecentSearches().filter((entry) => entry.toLowerCase() !== value.toLowerCase())].slice(
      0,
      MAX_RECENT,
    )
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Private mode or quota: recents are a convenience, never load-bearing.
  }
}

export function removeRecentSearch(query: string) {
  if (typeof window === "undefined") return
  try {
    const next = readRecentSearches().filter((entry) => entry !== query)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Ignore storage failures.
  }
}
