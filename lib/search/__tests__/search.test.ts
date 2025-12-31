import { describe, expect, it } from "vitest"

import { POPULAR_QUESTIONS } from "@/lib/search/search-index"
import { normalizeQuery, runSearch } from "@/lib/search/search"

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
