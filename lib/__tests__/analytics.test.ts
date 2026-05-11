import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { trackMock } = vi.hoisted(() => ({
  trackMock: vi.fn(),
}))

vi.mock("@vercel/analytics", () => ({
  track: trackMock,
}))

import { trackEvent, trackLeadConversion } from "@/lib/analytics"

function getGtagMock() {
  return (window as unknown as { gtag: ReturnType<typeof vi.fn> }).gtag
}

describe("analytics helpers", () => {
  beforeEach(() => {
    trackMock.mockReset()
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        gtag: vi.fn(),
      },
    })
  })

  afterEach(() => {
    delete (globalThis as { window?: Window }).window
  })

  it("sends lead conversions to GA4 and Vercel by default", () => {
    trackLeadConversion("booking")

    expect(trackMock).toHaveBeenCalledWith("lead_submit", {
      form: "booking",
      surface: "booking_form",
    })
    expect(getGtagMock()).toHaveBeenCalledWith("event", "generate_lead", {
      form_name: "booking",
      lead_source: "booking_request",
    })
  })

  it("can suppress client-side Vercel conversion when the server owns that count", () => {
    trackLeadConversion("contact", "contact_form", { sendVercel: false })

    expect(trackMock).not.toHaveBeenCalled()
    expect(getGtagMock()).toHaveBeenCalledWith("event", "generate_lead", {
      form_name: "contact",
      lead_source: "contact_inquiry",
    })
  })

  it("derives non-conversion lead intent from book and contact CTA targets", () => {
    trackEvent("cta_click", { location: "hero", target: "/book?utm_source=ad#form" })

    expect(trackMock).toHaveBeenNthCalledWith(1, "cta_click", {
      location: "hero",
      target: "/book",
    })
    expect(trackMock).toHaveBeenNthCalledWith(2, "lead_intent", {
      intent: "book",
      surface: "hero",
    })
  })
})
