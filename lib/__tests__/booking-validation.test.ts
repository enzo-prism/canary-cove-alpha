import { describe, expect, test } from "vitest"

import {
  countNights,
  EMAIL_MISMATCH_MESSAGE,
  emailsMatch,
  INVALID_DATE_RANGE_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  isBlank,
  isValidEmail,
  MAIN_HOUSE_ELIGIBILITY_MESSAGE,
  validateDateRange,
  validateEmailPair,
  validateMainHouseEligibility,
} from "@/lib/booking-validation"

describe("isBlank", () => {
  test("treats empty and whitespace-only strings as blank", () => {
    expect(isBlank("")).toBe(true)
    expect(isBlank("   ")).toBe(true)
    expect(isBlank(" Alex ")).toBe(false)
  })
})

describe("email validation", () => {
  test("accepts well-formed addresses and rejects malformed ones", () => {
    expect(isValidEmail("alex@example.com")).toBe(true)
    expect(isValidEmail("alex+tag@canarycove.co.bz")).toBe(true)
    expect(isValidEmail("not-an-email")).toBe(false)
    expect(isValidEmail("alex@")).toBe(false)
    expect(isValidEmail("")).toBe(false)
  })

  test("matches addresses case-insensitively after trimming", () => {
    expect(emailsMatch("Alex@Example.com ", " alex@example.COM")).toBe(true)
    expect(emailsMatch("alex@example.com", "mismatch@example.com")).toBe(false)
  })

  test("validateEmailPair reports format errors before mismatch errors", () => {
    expect(validateEmailPair("alex@example.com", "alex@example.com")).toBeNull()
    expect(validateEmailPair("", "")).toBe(INVALID_EMAIL_MESSAGE)
    expect(validateEmailPair("not-an-email", "not-an-email")).toBe(INVALID_EMAIL_MESSAGE)
    expect(validateEmailPair("alex@example.com", "mismatch@example.com")).toBe(EMAIL_MISMATCH_MESSAGE)
  })
})

describe("date range validation", () => {
  test("counts whole nights between ISO dates", () => {
    expect(countNights("2026-06-01", "2026-06-06")).toBe(5)
    expect(countNights("2026-06-01", "2026-06-01")).toBe(0)
    expect(countNights("", "2026-06-06")).toBeNull()
    expect(countNights("2026-06-01", "")).toBeNull()
  })

  test("rejects same-day and reversed ranges, the zero-night stay guard", () => {
    expect(validateDateRange("2026-06-01", "2026-06-01")).toBe(INVALID_DATE_RANGE_MESSAGE)
    expect(validateDateRange("2026-06-05", "2026-06-01")).toBe(INVALID_DATE_RANGE_MESSAGE)
    expect(validateDateRange("2026-06-01", "2026-06-06")).toBeNull()
    expect(validateDateRange("", "")).toBeNull()
  })
})

describe("main house eligibility", () => {
  test("reserves the main house for returning guests", () => {
    expect(validateMainHouseEligibility("main-house", "no")).toBe(MAIN_HOUSE_ELIGIBILITY_MESSAGE)
    expect(validateMainHouseEligibility("main-house", "")).toBe(MAIN_HOUSE_ELIGIBILITY_MESSAGE)
    expect(validateMainHouseEligibility("main-house", "yes")).toBeNull()
    expect(validateMainHouseEligibility("villa", "no")).toBeNull()
    expect(validateMainHouseEligibility("", "")).toBeNull()
  })
})
