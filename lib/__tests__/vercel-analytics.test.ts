import { describe, expect, it } from "vitest"

import { sanitizeAnalyticsUrl } from "@/lib/vercel-analytics"

describe("sanitizeAnalyticsUrl", () => {
  it("removes query strings and hashes from absolute urls", () => {
    expect(sanitizeAnalyticsUrl("https://www.canarycove.com/book?utm_source=google#form")).toBe(
      "https://www.canarycove.com/book",
    )
  })

  it("removes query strings and hashes from relative urls", () => {
    expect(sanitizeAnalyticsUrl("/experiences?source=search#gallery")).toBe("/experiences")
  })

  it("returns clean urls unchanged", () => {
    expect(sanitizeAnalyticsUrl("/stay")).toBe("/stay")
  })
})
