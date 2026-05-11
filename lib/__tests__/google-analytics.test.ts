import { describe, expect, it } from "vitest"

import { buildGoogleAnalyticsPageLocation } from "@/lib/google-analytics"

describe("buildGoogleAnalyticsPageLocation", () => {
  it("uses the canonical origin and preserves the path", () => {
    expect(buildGoogleAnalyticsPageLocation("http://localhost:3000/book?source=local#form")).toBe(
      "https://www.canarycove.com/book",
    )
  })

  it("keeps only campaign and click attribution parameters", () => {
    expect(
      buildGoogleAnalyticsPageLocation(
        "https://preview.example.com/contact?utm_source=google&utm_campaign=spring&email=guest%40example.com&gclid=abc123#welcome",
      ),
    ).toBe("https://www.canarycove.com/contact?utm_source=google&utm_campaign=spring&gclid=abc123")
  })

  it("supports relative URLs against the canonical domain", () => {
    expect(buildGoogleAnalyticsPageLocation("/rates?gbraid=gb-1&wbraid=wb-2&message=private")).toBe(
      "https://www.canarycove.com/rates?gbraid=gb-1&wbraid=wb-2",
    )
  })
})
