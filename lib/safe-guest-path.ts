/**
 * Normalize and validate post-login guest redirects.
 *
 * Rejects protocol-relative URLs, path traversal (`/guest/../admin` and
 * percent-encoded variants), and prefix collisions (`/guests`) that a naive
 * `startsWith("/guest")` check would accept.
 */
export const DEFAULT_GUEST_PATH = "/guest"

const normalizeGuestPathname = (rawPathname: string): string | null => {
  let decoded = rawPathname
  try {
    // Decode once so `%2e%2e` / `%2f` cannot smuggle traversal past startsWith.
    decoded = decodeURIComponent(rawPathname)
  } catch {
    return null
  }

  if (decoded.includes("\0") || decoded.includes("\\")) return null

  let url: URL
  try {
    url = new URL(decoded, "https://canary-cove.invalid")
  } catch {
    return null
  }

  // Collapse empty segments (`/guest//notes` → `/guest/notes`) after URL normalization.
  const pathname = url.pathname.replace(/\/{2,}/g, "/")
  if (pathname !== "/guest" && !pathname.startsWith("/guest/")) return null

  // Defense in depth if a segment survives normalization.
  if (pathname.split("/").some((segment) => segment === ".." || segment === ".")) {
    return null
  }

  return pathname
}

export const safeGuestPath = (value: unknown): string => {
  if (typeof value !== "string" || value.length === 0) return DEFAULT_GUEST_PATH

  // Absolute and protocol-relative URLs must never be used as redirect targets.
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return DEFAULT_GUEST_PATH
  }

  let url: URL
  try {
    url = new URL(value, "https://canary-cove.invalid")
  } catch {
    return DEFAULT_GUEST_PATH
  }

  const pathname = normalizeGuestPathname(url.pathname)
  if (!pathname) return DEFAULT_GUEST_PATH

  // Keep only path + query; drop hash (not useful server-side).
  return `${pathname}${url.search}`
}
