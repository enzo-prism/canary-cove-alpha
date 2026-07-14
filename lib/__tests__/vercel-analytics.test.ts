import { describe, expect, it } from "vitest"

import {
  sanitizeAnalyticsUrl,
  sanitizeVercelAnalyticsEvent,
  sanitizeVercelAnalyticsPayload,
} from "@/lib/vercel-analytics"

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

describe("sanitizeVercelAnalyticsEvent", () => {
  it("drops private guest paths instead of sending them to analytics", () => {
    expect(
      sanitizeVercelAnalyticsEvent({
        type: "pageview",
        url: "https://www.canarycove.com/guest?next=%2Fguest",
      }),
    ).toBeNull()
  })

  it("keeps public pageviews while stripping query strings and hashes", () => {
    expect(
      sanitizeVercelAnalyticsEvent({
        type: "pageview",
        url: "https://www.canarycove.com/book?utm_source=google#form",
      }),
    ).toEqual({
      type: "pageview",
      url: "https://www.canarycove.com/book",
    })
  })
})

describe("sanitizeVercelAnalyticsPayload", () => {
  it("keeps only flat custom data values", () => {
    expect(
      sanitizeVercelAnalyticsPayload({
        form: "booking",
        nested: { unsafe: true },
        reason: undefined,
        surface: "booking_form",
      }),
    ).toEqual({
      form: "booking",
      surface: "booking_form",
    })
  })

  it("strips queries and hashes from URL-like payload fields", () => {
    expect(
      sanitizeVercelAnalyticsPayload({
        target: "/book?utm_source=google#form",
        location: "hero",
      }),
    ).toEqual({
      target: "/book",
      location: "hero",
    })
  })

  it("drops overly long strings and caps custom properties", () => {
    expect(
      sanitizeVercelAnalyticsPayload({
        location: "hero",
        note: "x".repeat(256),
        target: "/contact",
        extra: "ignored",
      }),
    ).toEqual({
      location: "hero",
      target: "/contact",
    })
  })
})
