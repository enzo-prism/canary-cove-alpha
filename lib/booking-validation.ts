export const EMAIL_MISMATCH_MESSAGE = "Please make sure both email fields match before sending your request."
export const INVALID_DATE_RANGE_MESSAGE = "Departure date must be after your arrival date."
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
  if (!arrival || !departure) return null
  const start = new Date(`${arrival}T12:00:00`)
  const end = new Date(`${departure}T12:00:00`)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null
  return Math.round((end.getTime() - start.getTime()) / 86_400_000)
}

/** Returns the error message when the date range is invalid, otherwise null. */
export function validateDateRange(arrival: string, departure: string): string | null {
  if (arrival && departure && departure <= arrival) return INVALID_DATE_RANGE_MESSAGE
  return null
}

/** Returns the error message when a first-time guest requests the Main House, otherwise null. */
export function validateMainHouseEligibility(accommodation: string, returningGuest: string): string | null {
  if (accommodation === "main-house" && returningGuest !== "yes") return MAIN_HOUSE_ELIGIBILITY_MESSAGE
  return null
}
