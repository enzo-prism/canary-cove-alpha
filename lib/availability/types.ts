export const PROPERTY_TIMEZONE = "America/Belize"
export const STAY_UNITS = ["villa", "main-house"] as const

export type StayUnit = (typeof STAY_UNITS)[number]
export type ClassificationUnit = StayUnit | "both"
export type ClassificationSource = "title" | "inherited" | "untagged" | "ambiguous"

export type CalendarEvent = {
  id: string
  title: string
  start: string
  end: string
}

export type DateRange = {
  start: string
  end: string
}

export type ClassifiedEvent = CalendarEvent & {
  unit: ClassificationUnit
  source: ClassificationSource
  reason: string
  flagged: boolean
}

export type PublicAvailability = {
  timezone: typeof PROPERTY_TIMEZONE
  units: Record<StayUnit, { booked: DateRange[] }>
}
