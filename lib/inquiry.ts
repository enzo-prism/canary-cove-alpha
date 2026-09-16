export type AccommodationChoice = "villa" | "main-house"
export type ReturningGuestChoice = "yes" | "no"
export type MainHouseEligibility = "ok" | "needs-returning" | "blocked"

export const MAIN_HOUSE_FIRST_STAY_MESSAGE =
  "The 5-suite Main House is available only to returning Canary Cove guests. Please choose the Villa for a first stay."

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isAccommodationChoice(value: string): value is AccommodationChoice {
  return value === "villa" || value === "main-house"
}

export function isReturningGuestChoice(value: string): value is ReturningGuestChoice {
  return value === "yes" || value === "no"
}

export function mainHouseEligibility(
  accommodation: string,
  returningGuest: string,
): MainHouseEligibility {
  if (accommodation !== "main-house") return "ok"
  if (returningGuest === "yes") return "ok"
  if (returningGuest === "no") return "blocked"
  return "needs-returning"
}

export function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value)
}

export function validateDateRange(arrival: string, departure: string) {
  if (!arrival || !departure) {
    return "Please choose both an arrival date and a departure date."
  }

  if (departure <= arrival) {
    return "Departure date must be after your arrival date."
  }

  return null
}

export function parseIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatStayWindow(arrival: string, departure: string) {
  const arrivalDate = parseIsoDate(arrival)
  const departureDate = parseIsoDate(departure)
  if (!arrivalDate || !departureDate) return null

  const sameYear = arrivalDate.getUTCFullYear() === departureDate.getUTCFullYear()
  const arrivalFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
    timeZone: "UTC",
  })
  const departureFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })

  return `${arrivalFormatter.format(arrivalDate)} – ${departureFormatter.format(departureDate)}`
}

export function isInquiryPath(pathname: string | null | undefined) {
  return pathname === "/book" || pathname === "/contact"
}
