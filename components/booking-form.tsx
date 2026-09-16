"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Building2, CalendarRange, Check, Home, Send, Users } from "lucide-react"

import { InquiryField, inquiryControlClassName, inquiryTextareaClassName } from "@/components/forms/inquiry-field"
import { ChoiceCards } from "@/components/forms/choice-cards"
import { InquirySection } from "@/components/forms/inquiry-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { trackFormSubmitAttempt, trackFormSubmitError, trackFormSubmitSuccess, trackLeadConversion } from "@/lib/analytics"
import { appendFormspreeOpsMetadata } from "@/lib/formspree-ops"
import {
  formatStayWindow,
  isValidEmail,
  MAIN_HOUSE_FIRST_STAY_MESSAGE,
  mainHouseEligibility,
  validateDateRange,
  type AccommodationChoice,
  type ReturningGuestChoice,
} from "@/lib/inquiry"
import { LEAD_FORM_CONFIG } from "@/lib/lead-forms"
import { SITE_CONTACTS, SITE_INQUIRY_EMAIL, SITE_INQUIRY_MAILTO } from "@/lib/site-config"
import { cn } from "@/lib/utils"

const FORM_ENDPOINT = "/api/forms"
const FORM_KEY = "booking"

const ACCOMMODATION_OPTIONS = [
  {
    value: "villa" as const,
    title: "Villa (1–3 suites)",
    description: "The right first stay. One group, chef service, the dock.",
    icon: Home,
  },
  {
    value: "main-house" as const,
    title: "Main House (5 suites)",
    description: "Returning guests only. Full estate, separate damage deposit.",
    icon: Building2,
  },
]

const RETURNING_OPTIONS = [
  {
    value: "yes" as const,
    title: "Yes, I am a returning guest",
    description: "We have hosted you at Canary Cove before.",
    icon: Users,
  },
  {
    value: "no" as const,
    title: "No, this would be my first stay",
    description: "Start with the Villa. The Main House waits for a return.",
    icon: Users,
  },
]

const REFERRAL_OPTIONS = [
  { value: "returning-guest", label: "Previous stay / returning guest" },
  { value: "google", label: "Google" },
  { value: "other-search", label: "Other search engine" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "other", label: "Other" },
] as const

type BookingFormProps = {
  className?: string
  defaultAccommodation?: AccommodationChoice
  defaultReturningGuest?: ReturningGuestChoice
}

type FieldErrors = {
  firstName?: string
  lastName?: string
  phone?: string
  email?: string
  confirmEmail?: string
  accommodation?: string
  returningGuest?: string
  arrival?: string
  departure?: string
  adultGuests?: string
}

type BookingStatus = "idle" | "sending" | "success" | "error"

function requiredMessage(label: string) {
  return `${label} is required.`
}

function focusInquiryField(id: string) {
  const element = document.getElementById(id)
  if (!(element instanceof HTMLElement)) return
  element.scrollIntoView({ behavior: "smooth", block: "center" })
  element.focus()
}

export function BookingForm({ className, defaultAccommodation, defaultReturningGuest }: BookingFormProps) {
  const [status, setStatus] = useState<BookingStatus>("idle")
  const [accommodation, setAccommodation] = useState<AccommodationChoice | "">(defaultAccommodation ?? "")
  const [returningGuest, setReturningGuest] = useState<ReturningGuestChoice | "">(defaultReturningGuest ?? "")
  const [submittedStayWindow, setSubmittedStayWindow] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const today = new Date().toISOString().slice(0, 10)
  const eligibility = mainHouseEligibility(accommodation, returningGuest)
  const blockedForFirstStay = eligibility === "blocked"

  useEffect(() => {
    if (status !== "success") return
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [status])

  useEffect(() => {
    if (!blockedForFirstStay) return
    document.getElementById("main-house-eligibility")?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [blockedForFirstStay])

  const clearFieldError = (key: keyof FieldErrors) => {
    setFieldErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
    setValidationError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "sending") return

    const form = event.currentTarget
    const formData = new FormData(form)
    const firstName = String(formData.get("firstName") ?? "").trim()
    const lastName = String(formData.get("lastName") ?? "").trim()
    const phone = String(formData.get("phone") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const confirmEmail = String(formData.get("confirmEmail") ?? "").trim()
    const arrival = String(formData.get("arrival") ?? "").trim()
    const departure = String(formData.get("departure") ?? "").trim()
    const adultGuests = String(formData.get("adultGuests") ?? "").trim()
    const requestedAccommodation = String(formData.get("accommodation") ?? "").trim()
    const requestedReturning = String(formData.get("returningGuest") ?? "").trim()

    const nextErrors: FieldErrors = {}
    if (!firstName) nextErrors.firstName = requiredMessage("First name")
    if (!lastName) nextErrors.lastName = requiredMessage("Last name")
    if (!phone) nextErrors.phone = requiredMessage("Phone number")
    if (!email) nextErrors.email = requiredMessage("Email")
    else if (!isValidEmail(email)) nextErrors.email = "Please enter a valid email address."
    if (!confirmEmail) nextErrors.confirmEmail = requiredMessage("Confirm email")
    if (!requestedAccommodation) nextErrors.accommodation = "Please choose an accommodation."
    if (!requestedReturning) nextErrors.returningGuest = "Please tell us whether you have stayed before."
    if (!arrival) nextErrors.arrival = "Please choose an arrival date."
    if (!departure) nextErrors.departure = "Please choose a departure date."
    if (!adultGuests) nextErrors.adultGuests = "Please tell us how many adults are traveling."

    if (email && confirmEmail && email !== confirmEmail) {
      nextErrors.confirmEmail = "Please make sure both email fields match before sending your request."
    }

    const dateRangeError = arrival && departure ? validateDateRange(arrival, departure) : null
    if (dateRangeError && arrival && departure) {
      nextErrors.departure = dateRangeError
    }

    const houseEligibility = mainHouseEligibility(requestedAccommodation, requestedReturning)
    if (houseEligibility === "blocked") {
      setFieldErrors(nextErrors)
      setValidationError(MAIN_HOUSE_FIRST_STAY_MESSAGE)
      trackFormSubmitError(FORM_KEY, "main_house_eligibility")
      focusInquiryField("returningGuest-choice-no")
      return
    }

    if (houseEligibility === "needs-returning") {
      nextErrors.returningGuest = "Please tell us whether you have stayed at Canary Cove before."
    }

    const firstErrorKey = (Object.keys(nextErrors) as Array<keyof FieldErrors>)[0]
    if (firstErrorKey) {
      const summary =
        nextErrors.confirmEmail && email !== confirmEmail
          ? nextErrors.confirmEmail
          : nextErrors.departure && arrival && departure
            ? nextErrors.departure
            : nextErrors.arrival || nextErrors.departure
              ? "Please choose both an arrival date and a departure date."
              : "Please complete the highlighted fields before sending your request."
      setFieldErrors(nextErrors)
      setValidationError(summary)
      if (nextErrors.confirmEmail && email !== confirmEmail) {
        trackFormSubmitError(FORM_KEY, "email_mismatch")
      } else if (nextErrors.departure && arrival && departure) {
        trackFormSubmitError(FORM_KEY, "invalid_date_range")
      } else {
        trackFormSubmitError(FORM_KEY, "incomplete")
      }
      const focusId =
        firstErrorKey === "accommodation"
          ? "accommodation-choice-villa"
          : firstErrorKey === "returningGuest"
            ? "returningGuest-choice-yes"
            : firstErrorKey
      window.setTimeout(() => {
        document.querySelector("[data-testid='booking-validation-summary']")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
        focusInquiryField(focusId)
      }, 0)
      return
    }

    appendFormspreeOpsMetadata(formData, FORM_KEY)
    const stayWindow = formatStayWindow(arrival, departure)

    setFieldErrors({})
    setValidationError(null)
    trackFormSubmitAttempt(FORM_KEY)
    setStatus("sending")
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        form.reset()
        setAccommodation("")
        setReturningGuest("")
        setSubmittedStayWindow(stayWindow)
        setStatus("success")
        trackFormSubmitSuccess(FORM_KEY)
        trackLeadConversion(FORM_KEY, LEAD_FORM_CONFIG[FORM_KEY].surface, { sendVercel: false })
        return
      }

      setStatus("error")
      trackFormSubmitError(FORM_KEY, "response")
    } catch {
      setStatus("error")
      trackFormSubmitError(FORM_KEY, "network")
    }
  }

  switch (status) {
    case "success":
      return (
        <div
          data-testid="booking-form-card"
          className={cn("inquiry-canvas space-y-8", className)}
        >
          <div className="space-y-5" data-testid="booking-success" role="status" aria-live="polite">
            <span className="flex size-12 items-center justify-center rounded-full border border-border bg-surface">
              <Check className="size-5" aria-hidden="true" />
            </span>
            <div className="space-y-3">
              <h2 className="text-section">Request received</h2>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                {submittedStayWindow
                  ? `We’ll confirm availability for ${submittedStayWindow} and follow up with next steps shortly.`
                  : "Our team will confirm availability and follow up with next steps shortly."}
              </p>
            </div>
            <Button type="button" variant="outline" className="w-fit" onClick={() => setStatus("idle")}>
              Send another request
            </Button>
          </div>
        </div>
      )
    case "idle":
    case "sending":
    case "error":
      break
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }

  return (
    <div data-testid="booking-form-card" className={cn("inquiry-canvas", className)}>
      <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit} noValidate>
        {validationError ? (
          <div
            className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-4"
            data-testid="booking-validation-summary"
          >
            <p className="text-sm font-semibold text-destructive">Check a couple of details</p>
            <p className="mt-1 text-sm leading-6 text-destructive" data-testid="booking-validation-error">
              {validationError}
            </p>
          </div>
        ) : null}

        <InquirySection
          icon={Home}
          step="Stay"
          title="What are you requesting?"
          description="Choose the house first. The Main House is only for guests we have already hosted."
        >
          <ChoiceCards
            legend="Accommodation requested"
            name="accommodation"
            value={accommodation}
            options={ACCOMMODATION_OPTIONS}
            onChange={(value) => {
              setAccommodation(value)
              clearFieldError("accommodation")
            }}
            error={fieldErrors.accommodation}
          />
          <ChoiceCards
            legend="Have you stayed at Canary Cove before?"
            name="returningGuest"
            value={returningGuest}
            options={RETURNING_OPTIONS}
            onChange={(value) => {
              setReturningGuest(value)
              clearFieldError("returningGuest")
            }}
            error={fieldErrors.returningGuest}
          />

          {accommodation === "main-house" ? (
            <div
              id="main-house-eligibility"
              className={cn(
                "rounded-2xl border px-5 py-4",
                blockedForFirstStay ? "border-destructive/30 bg-destructive/5" : "border-border bg-surface-elevated",
              )}
              data-testid={blockedForFirstStay ? "booking-validation-summary" : undefined}
            >
              <p className="text-sm font-semibold text-foreground">Main House eligibility</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                The full 5-suite Main House is reserved for returning guests and carries a separate $10,000 damage
                deposit.
              </p>
              {blockedForFirstStay ? (
                <>
                  <p className="mt-3 text-sm leading-6 text-destructive" data-testid="booking-validation-error">
                    {MAIN_HOUSE_FIRST_STAY_MESSAGE}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setAccommodation("villa")
                      setValidationError(null)
                      clearFieldError("accommodation")
                    }}
                  >
                    Request the Villa instead
                  </Button>
                </>
              ) : null}
            </div>
          ) : null}
        </InquirySection>

        <InquirySection
          icon={CalendarRange}
          step="Dates"
          title="When should we hold the estate?"
          description="Dates are required. This places a tentative hold while we confirm the nights in person — not a checkout."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <InquiryField id="arrival" label="Preferred Arrival Date" error={fieldErrors.arrival}>
              <Input
                id="arrival"
                name="arrival"
                type="date"
                min={today}
                autoComplete="off"
                required
                aria-invalid={fieldErrors.arrival ? true : undefined}
                className={inquiryControlClassName}
                onChange={() => clearFieldError("arrival")}
              />
            </InquiryField>
            <InquiryField id="departure" label="Preferred Departure Date" error={fieldErrors.departure}>
              <Input
                id="departure"
                name="departure"
                type="date"
                min={today}
                autoComplete="off"
                required
                aria-invalid={fieldErrors.departure ? true : undefined}
                aria-describedby={fieldErrors.departure ? "departure-error" : undefined}
                className={inquiryControlClassName}
                onChange={() => clearFieldError("departure")}
              />
            </InquiryField>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <InquiryField id="adultGuests" label="Number of Adult Guests" error={fieldErrors.adultGuests}>
              <Input
                id="adultGuests"
                name="adultGuests"
                type="number"
                min={1}
                inputMode="numeric"
                autoComplete="off"
                required
                placeholder="4"
                className={inquiryControlClassName}
                onChange={() => clearFieldError("adultGuests")}
              />
            </InquiryField>
            <InquiryField id="childGuests" label="Children under 21 and ages" optional>
              <Input
                id="childGuests"
                name="childGuests"
                autoComplete="off"
                placeholder="2 children, ages 8 and 10"
                className={inquiryControlClassName}
              />
            </InquiryField>
          </div>
        </InquirySection>

        <InquirySection
          icon={Users}
          step="Guest"
          title="Who should we write back?"
          description="One lead contact for the hold, the quote, and the follow-up."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <InquiryField id="firstName" label="First Name" error={fieldErrors.firstName}>
              <Input
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                required
                placeholder="First name"
                className={inquiryControlClassName}
                onChange={() => clearFieldError("firstName")}
              />
            </InquiryField>
            <InquiryField id="lastName" label="Last Name" error={fieldErrors.lastName}>
              <Input
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                required
                placeholder="Last name"
                className={inquiryControlClassName}
                onChange={() => clearFieldError("lastName")}
              />
            </InquiryField>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <InquiryField id="phone" label="Phone Number" error={fieldErrors.phone}>
              <Input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                placeholder="+501 610-5121"
                className={inquiryControlClassName}
                onChange={() => clearFieldError("phone")}
              />
            </InquiryField>
            <InquiryField id="email" label="Email Address" error={fieldErrors.email}>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                spellCheck={false}
                inputMode="email"
                required
                placeholder="you@example.com"
                className={inquiryControlClassName}
                onChange={() => clearFieldError("email")}
              />
            </InquiryField>
          </div>
          <InquiryField
            id="confirmEmail"
            label="Confirm Email Address"
            hint="We’ll use this address for the quote, availability confirmation, and follow-up."
            error={fieldErrors.confirmEmail}
          >
            <Input
              id="confirmEmail"
              name="confirmEmail"
              type="email"
              autoComplete="off"
              spellCheck={false}
              inputMode="email"
              required
              placeholder="Type your email again"
              className={inquiryControlClassName}
              aria-invalid={fieldErrors.confirmEmail ? true : undefined}
              aria-describedby="confirmEmail-hint confirmEmail-error"
              onChange={() => clearFieldError("confirmEmail")}
            />
          </InquiryField>
        </InquirySection>

        <InquirySection
          icon={Send}
          step="Notes"
          title="Anything we should plan around?"
          description="Celebrations, reef days, pace, or food. Optional — dates already tell us the hold."
        >
          <InquiryField id="requests" label="Message" optional>
            <Textarea
              id="requests"
              name="requests"
              rows={5}
              autoComplete="off"
              placeholder="Celebrations, preferred pace, reef days, or dietary notes"
              className={inquiryTextareaClassName}
            />
          </InquiryField>
          <InquiryField id="referral" label="How did you hear about Canary Cove?" optional>
            <select id="referral" name="referral" defaultValue="" className={inquiryControlClassName}>
              <option value="" disabled>
                Choose one
              </option>
              {REFERRAL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </InquiryField>
        </InquirySection>

        <div className="space-y-5 border-t border-border/70 pt-10 sm:pt-14">
          <div className="max-w-xl space-y-2">
            <p className="text-base font-semibold text-foreground">A request, not checkout.</p>
            <p className="form-helper text-sm leading-6">
              Sending this form places a tentative hold while we confirm availability, pricing, and next steps with you
              directly. One private group at a time.
            </p>
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-14 w-full px-8 text-base sm:w-auto"
            disabled={status === "sending" || blockedForFirstStay}
            data-testid="booking-submit"
          >
            {status === "sending" ? "Sending request…" : "Request these dates"}
            <Send className="size-4" aria-hidden="true" />
          </Button>
          {status === "error" ? (
            <p className="form-error max-w-xl text-sm leading-6" role="alert" aria-live="polite" data-testid="booking-error">
              Something went wrong. Please try again,{" "}
              <a className="underline underline-offset-4" href={SITE_CONTACTS.gil.telHref}>
                call {SITE_CONTACTS.gil.name}
              </a>
              , or email{" "}
              <a className="underline underline-offset-4" href={SITE_INQUIRY_MAILTO}>
                {SITE_INQUIRY_EMAIL}
              </a>
              .
            </p>
          ) : null}
        </div>
      </form>
    </div>
  )
}
