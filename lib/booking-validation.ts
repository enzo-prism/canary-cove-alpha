import { isIsoDate, todayInPropertyTz } from "@/lib/availability/dates"

export const EMAIL_MISMATCH_MESSAGE = "Please make sure both email fields match before sending your request."
export const INVALID_DATE_RANGE_MESSAGE = "Departure date must be after your arrival date."
export const PAST_DATE_MESSAGE = "Please choose today or a future date for your stay, or leave dates blank if you're flexible."
export const INVALID_DATE_MESSAGE = "Please enter a valid arrival and departure date, or leave dates blank if you're flexible."
export const INVALID_ADULT_GUESTS_MESSAGE = "Please enter a whole number of at least 1 adult, or leave the field blank if you're not sure yet."
export const MAIN_HOUSE_ELIGIBILITY_MESSAGE =
  "The 5-suite Main House is available only to returning Canary Cove guests. Please choose the Villa for a first stay."
export const INVALID_EMAIL_MESSAGE = "Please enter a valid email address so we can reach you."

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isBlank(value: string): boolean {
  return value.trim().length === 0
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

export function emailsMatch(email: string, confirmEmail: string): boolean {
  return email.trim().toLowerCase() === confirmEmail.trim().toLowerCase()
}

/** Returns the error message when the email pair is invalid, otherwise null. */
export function validateEmailPair(email: string, confirmEmail: string): string | null {
  if (isBlank(email) || !isValidEmail(email)) return INVALID_EMAIL_MESSAGE
  if (!emailsMatch(email, confirmEmail)) return EMAIL_MISMATCH_MESSAGE
  return null
}

/** Whole nights between two `YYYY-MM-DD` dates, or null when the range is incomplete. */
export function countNights(arrival: string, departure: string): number | null {
  if (!isIsoDate(arrival) || !isIsoDate(departure)) return null
  const start = new Date(`${arrival}T12:00:00Z`)
  const end = new Date(`${departure}T12:00:00Z`)
  return Math.round((end.getTime() - start.getTime()) / 86_400_000)
}

/** Date-only values must not shift with the guest's browser timezone. */
export function formatBookingDate(iso: string): string {
  if (!isIsoDate(iso)) return iso
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

/** Returns the error message when the date range is invalid, otherwise null. */
export function validateDateRange(arrival: string, departure: string, today = todayInPropertyTz()): string | null {
  if ((arrival && !isIsoDate(arrival)) || (departure && !isIsoDate(departure))) return INVALID_DATE_MESSAGE
  if (arrival && departure && departure <= arrival) return INVALID_DATE_RANGE_MESSAGE
  if ((arrival && arrival < today) || (departure && departure < today)) return PAST_DATE_MESSAGE
  return null
}

/** Party size is optional, but a supplied count must be an actual positive integer. */
export function validateAdultGuests(value: string): string | null {
  if (isBlank(value)) return null
  const count = Number(value)
  return /^\d+$/.test(value.trim()) && Number.isSafeInteger(count) && count >= 1
    ? null
    : INVALID_ADULT_GUESTS_MESSAGE
}

/** Returns the error message when a first-time guest requests the Main House, otherwise null. */
export function validateMainHouseEligibility(accommodation: string, returningGuest: string): string | null {
  if (accommodation === "main-house" && returningGuest !== "yes") return MAIN_HOUSE_ELIGIBILITY_MESSAGE
  return null
}
