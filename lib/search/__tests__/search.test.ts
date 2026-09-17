import { describe, expect, it } from "vitest"

import { POPULAR_QUESTIONS } from "@/lib/search/search-index"
import { findSuggestion, normalizeQuery, runSearch } from "@/lib/search/search"

const flattenResults = (query: string) => {
  const result = runSearch(query)
  return result.groups.flatMap((group) => group.items)
}

describe("search intent mapping", () => {
  it("maps included/extra triggers", () => {
    expect(runSearch("tax").intent).toBe("included")
    expect(runSearch("gratuity").intent).toBe("included")
  })

  it("maps reliability triggers", () => {
    expect(runSearch("wifi").intent).toBe("reliability")
    expect(runSearch("generator").intent).toBe("reliability")
  })

  it("maps dining triggers", () => {
    expect(runSearch("chef").intent).toBe("dining")
    expect(runSearch("groceries").intent).toBe("dining")
  })

  it("maps getting-here triggers", () => {
    expect(runSearch("BZE").intent).toBe("getting-here")
    expect(runSearch("airport").intent).toBe("getting-here")
  })

  it("returns policy results", () => {
    const cancellationResults = flattenResults("cancel")
    expect(cancellationResults.some((item) => item.id === "cancellation-policy")).toBe(true)

    const paymentResults = flattenResults("payment")
    expect(paymentResults.some((item) => item.id === "payment-terms")).toBe(true)
  })

  it("returns fishing packages", () => {
    const fishingResults = flattenResults("fishing")
    expect(fishingResults.some((item) => item.id === "fishing-packages")).toBe(true)
  })
})

describe("search normalization", () => {
  it("normalizes wi-fi variations", () => {
    expect(normalizeQuery("Wi-Fi")).toBe(normalizeQuery("wifi"))
    expect(normalizeQuery("WI FI")).toBe(normalizeQuery("wifi"))
  })
})

describe("popular questions coverage", () => {
  it("returns results or fallback for every popular question", () => {
    POPULAR_QUESTIONS.forEach((question) => {
      const result = runSearch(question.query, { allowFallback: true })
      const hasResults = result.totalResults > 0
      const hasFallback = result.answer?.intent === "ask-us"
      expect(hasResults || hasFallback).toBe(true)
    })
  })
})

describe("search ranking regressions", () => {
  it("never hijacks pool with the policies answer", () => {
    const result = runSearch("pool")
    expect(result.intent).not.toBe("policies")
    expect(flattenResults("pool")[0]?.id).toBe("villa-outdoors")
  })

  it("matches intent triggers on word boundaries, not substrings", () => {
    expect(runSearch("scallops").intent).not.toBe("contact")
    expect(runSearch("work calls").intent).toBe("reliability")
  })

  it("understands natural travel phrasing", () => {
    expect(runSearch("how do we get there").intent).toBe("getting-here")
    expect(runSearch("how do rates work").intent).toBe("pricing")
  })

  it("ranks dedicated pages first", () => {
    expect(flattenResults("cancellation")[0]?.id).toBe("cancellation-policy")
    expect(flattenResults("deposit")[0]?.id).toBe("payment-terms")
    expect(flattenResults("BZE")[0]?.id).toBe("arrival-steps")
  })

  it("expands synonyms without losing the original wording", () => {
    expect(runSearch("how much").intent).toBe("pricing")
    expect(normalizeQuery("how much")).toContain("price")
    expect(normalizeQuery("how much")).toContain("how much")
  })

  it("returns clean no-results for short nonsense queries", () => {
    expect(runSearch("dog").totalResults).toBe(0)
    expect(runSearch("dog").intent).toBeNull()
  })

  it("caps visible results for scannability", () => {
    const result = runSearch("rates")
    const visible = result.groups.flatMap((group) => group.items)
    expect(visible.length).toBeLessThanOrEqual(12)
    result.groups.forEach((group) => {
      expect(group.items.length).toBeLessThanOrEqual(4)
    })
  })

  it("indexes the full site, including new sections", () => {
    expect(flattenResults("gallery").some((item) => item.id === "gallery-overview")).toBe(true)
    expect(flattenResults("reviews").some((item) => item.id === "reviews-overview")).toBe(true)
    expect(flattenResults("golf cart").some((item) => item.id === "golf-cart-rentals")).toBe(true)
    expect(flattenResults("guest experience").some((item) => item.id === "guest-experience-stay")).toBe(true)
  })

  it("suggests the closest title for near-miss queries", () => {
    expect(findSuggestion("cancelltion")).toBe("Cancellation policy")
    expect(findSuggestion("dog")).toBeNull()
  })
})
