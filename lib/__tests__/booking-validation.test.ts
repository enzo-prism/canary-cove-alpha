import { describe, expect, test } from "vitest"

import { todayInPropertyTz } from "@/lib/availability/dates"
import {
  countNights,
  EMAIL_MISMATCH_MESSAGE,
  emailsMatch,
  formatBookingDate,
  INVALID_ADULT_GUESTS_MESSAGE,
  INVALID_DATE_MESSAGE,
  INVALID_DATE_RANGE_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  isBlank,
  isValidEmail,
  MAIN_HOUSE_ELIGIBILITY_MESSAGE,
  PAST_DATE_MESSAGE,
  validateAdultGuests,
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
    expect(countNights("2026-02-30", "2026-03-02")).toBeNull()
  })

  test("rejects same-day and reversed ranges, the zero-night stay guard", () => {
    expect(validateDateRange("2026-06-01", "2026-06-01", "2026-06-01")).toBe(INVALID_DATE_RANGE_MESSAGE)
    expect(validateDateRange("2026-06-05", "2026-06-01", "2026-06-01")).toBe(INVALID_DATE_RANGE_MESSAGE)
    expect(validateDateRange("2026-06-01", "2026-06-06", "2026-06-01")).toBeNull()
    expect(validateDateRange("", "")).toBeNull()
  })

  test("rejects past and impossible dates while keeping either date optional", () => {
    const today = "2026-10-13"
    expect(validateDateRange("2026-10-12", "2026-10-18", today)).toBe(PAST_DATE_MESSAGE)
    expect(validateDateRange("", "2026-10-12", today)).toBe(PAST_DATE_MESSAGE)
    expect(validateDateRange("2026-02-30", "", today)).toBe(INVALID_DATE_MESSAGE)
    expect(validateDateRange("2026-10-13", "", today)).toBeNull()
    expect(validateDateRange("", "2026-10-14", today)).toBeNull()
  })

  test("uses the property day while UTC is already on the next date", () => {
    expect(todayInPropertyTz(new Date("2026-10-14T01:00:00Z"))).toBe("2026-10-13")
  })

  test.each(["Pacific/Auckland", "Pacific/Kiritimati", "America/Los_Angeles"])(
    "keeps date labels and night counts stable for %s guests",
    (timezone) => {
      const previousTimezone = process.env.TZ
      process.env.TZ = timezone
      try {
        expect(formatBookingDate("2026-12-31")).toBe("Dec 31, 2026")
        expect(formatBookingDate("2027-01-01")).toBe("Jan 1, 2027")
        expect(countNights("2026-12-31", "2027-01-02")).toBe(2)
        expect(countNights("2026-03-07", "2026-03-10")).toBe(3)
      } finally {
        if (previousTimezone === undefined) delete process.env.TZ
        else process.env.TZ = previousTimezone
      }
    },
  )
})

describe("adult party size", () => {
  test.each(["", " ", "1", "4", "10"])("accepts optional or whole counts: %s", (count) => {
    expect(validateAdultGuests(count)).toBeNull()
  })

  test.each(["0", "-1", "1.5", "1e2", "NaN", "Infinity", "9007199254740992"])(
    "rejects a supplied count that cannot be a valid whole party size: %s",
    (count) => {
      expect(validateAdultGuests(count)).toBe(INVALID_ADULT_GUESTS_MESSAGE)
    },
  )
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
