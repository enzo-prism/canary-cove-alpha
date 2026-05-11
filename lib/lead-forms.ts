export const LEAD_FORM_CONFIG = {
  booking: {
    endpoint: "https://formspree.io/f/xqeqllek",
    surface: "booking_form",
    leadSource: "booking_request",
  },
  contact: {
    endpoint: "https://formspree.io/f/xvzarybk",
    surface: "contact_form",
    leadSource: "contact_inquiry",
  },
  email_capture: {
    endpoint: "https://formspree.io/f/xvzarybk",
    surface: "email_capture",
    leadSource: "email_capture",
  },
} as const

export type LeadFormKey = keyof typeof LEAD_FORM_CONFIG

export function isLeadFormKey(value: unknown): value is LeadFormKey {
  return typeof value === "string" && value in LEAD_FORM_CONFIG
}
