import { describe, expect, it } from "vitest"

import {
  formatStayWindow,
  isInquiryPath,
  isValidEmail,
  mainHouseEligibility,
  validateDateRange,
} from "@/lib/inquiry"

describe("inquiry helpers", () => {
  it("requires both stay dates and a real night count", () => {
    expect(validateDateRange("", "")).toMatch(/arrival date and a departure date/)
    expect(validateDateRange("2026-12-10", "2026-12-10")).toMatch(/after your arrival/)
    expect(validateDateRange("2026-12-10", "2026-12-09")).toMatch(/after your arrival/)
    expect(validateDateRange("2026-12-10", "2026-12-14")).toBeNull()
  })

  it("gates the Main House to returning guests before submit", () => {
    expect(mainHouseEligibility("villa", "no")).toBe("ok")
    expect(mainHouseEligibility("main-house", "")).toBe("needs-returning")
    expect(mainHouseEligibility("main-house", "no")).toBe("blocked")
    expect(mainHouseEligibility("main-house", "yes")).toBe("ok")
  })

  it("formats only dates the guest actually sent", () => {
    expect(formatStayWindow("2026-12-10", "2026-12-14")).toBe("December 10 – December 14, 2026")
    expect(formatStayWindow("", "2026-12-14")).toBeNull()
  })

  it("treats inquiry email as a real address check", () => {
    expect(isValidEmail("alex@example.com")).toBe(true)
    expect(isValidEmail("not-an-email")).toBe(false)
  })

  it("recognizes the form pages that hide the concierge dock", () => {
    expect(isInquiryPath("/book")).toBe(true)
    expect(isInquiryPath("/contact")).toBe(true)
    expect(isInquiryPath("/")).toBe(false)
  })
})
