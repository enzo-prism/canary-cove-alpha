import { describe, expect, it } from "vitest"

import { isSameOriginRequest } from "@/lib/same-origin"

const headers = (values: Record<string, string | null>) => ({
  get: (name: string) => values[name] ?? null,
})

describe("same-origin request validation", () => {
  it("prefers the public Host header over Vercel's forwarded deployment host", () => {
    expect(
      isSameOriginRequest(
        headers({
          origin: "https://www.canarycove.com",
          host: "www.canarycove.com",
          "x-forwarded-host": "v0-canary-cove-navbar-structure.vercel.app",
          "x-forwarded-proto": "https",
        }),
      ),
    ).toBe(true)
  })

  it("rejects a mismatched origin", () => {
    expect(
      isSameOriginRequest(
        headers({
          origin: "https://attacker.example",
          host: "www.canarycove.com",
          "x-forwarded-proto": "https",
        }),
      ),
    ).toBe(false)
  })

  it("falls back to forwarded host when Host is unavailable", () => {
    expect(
      isSameOriginRequest(
        headers({
          origin: "https://preview.example",
          "x-forwarded-host": "preview.example",
          "x-forwarded-proto": "https",
        }),
      ),
    ).toBe(true)
  })
})
