"use client"

import { useRef, useState, type FormEvent } from "react"

import {
  BedDouble,
  CalendarDays,
  ChefHat,
  Compass,
  House,
  Mail,
  Minus,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Sunrise,
  Users,
  Waves,
  type LucideIcon,
} from "lucide-react"

import { trackFormSubmitAttempt, trackFormSubmitError, trackFormSubmitSuccess, trackLeadConversion } from "@/lib/analytics"
import {
  countNights,
  isBlank,
  validateDateRange,
  validateEmailPair,
  validateMainHouseEligibility,
} from "@/lib/booking-validation"
import { appendFormspreeOpsMetadata } from "@/lib/formspree-ops"
import { LEAD_FORM_CONFIG } from "@/lib/lead-forms"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChipOption,
  FieldLabel,
  focusStepError,
  FormStepIndicator,
  OptionCard,
  StepError,
  StepHeading,
  StepPanel,
  WizardNav,
  type WizardStepMeta,
} from "@/components/form-wizard"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"

const FORM_ENDPOINT = "/api/forms"
const FORM_KEY = "booking"

const STEPS: WizardStepMeta[] = [
  { id: "stay", label: "Stay", icon: House },
  { id: "dates", label: "Dates", icon: CalendarDays },
  { id: "party", label: "Party", icon: Users },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "finish", label: "Finish", icon: Sparkles },
]

const ACCOMMODATION_OPTIONS = [
  {
    value: "villa",
    title: "Villa (1–3 suites)",
    description: "Private villa with plunge pool, ideal for first stays and smaller groups.",
    meta: "Most first stays choose the Villa",
    icon: BedDouble,
  },
  {
    value: "main-house",
    title: "Main House (5 suites)",
    description: "The full 5-suite Main House for larger groups, reserved for returning guests.",
    meta: "Whole-estate buyout",
    icon: House,
  },
] as const

const RETURNING_GUEST_OPTIONS = [
  { value: "yes", label: "Yes, I am a returning guest" },
  { value: "no", label: "No, this would be my first stay" },
] as const

const REFERRAL_OPTIONS = [
  { value: "returning-guest", label: "Previous stay / returning guest" },
  { value: "google", label: "Google" },
  { value: "other-search", label: "Other search engine" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "other", label: "Other" },
] as const

const REQUEST_STARTERS: Array<{ label: string; icon: LucideIcon; text: string }> = [
  { label: "Reef days", icon: Waves, text: "We'd love a few reef and boat days." },
  { label: "Chef dinners", icon: ChefHat, text: "Chef-hosted dinners are a priority for us." },
  { label: "Slow pace", icon: Sunrise, text: "We're after a slow, restful pace." },
  { label: "Adventures", icon: Compass, text: "We'd like to mix in mainland adventures." },
]

type BookingFormProps = {
  className?: string
  defaultAccommodation?: "villa" | "main-house"
  defaultReturningGuest?: "yes" | "no"
}

type BookingValues = {
  accommodation: string
  returningGuest: string
  arrival: string
  departure: string
  adultGuests: string
  childGuests: string
  firstName: string
  lastName: string
  phone: string
  email: string
  confirmEmail: string
  requests: string
  referral: string
}

const emptyValues = (defaults: Partial<BookingValues> = {}): BookingValues => ({
  accommodation: "",
  returningGuest: "",
  arrival: "",
  departure: "",
  adultGuests: "",
  childGuests: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  confirmEmail: "",
  requests: "",
  referral: "",
  ...defaults,
})

const formatIsoDate = (iso: string): string => {
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
}

const ACCOMMODATION_TITLES: Record<string, string> = {
  villa: "Villa (1–3 suites)",
  "main-house": "Main House (5 suites)",
}

const REFERRAL_LABELS: Record<string, string> = Object.fromEntries(REFERRAL_OPTIONS.map((option) => [option.value, option.label]))

export function BookingForm({ className, defaultAccommodation, defaultReturningGuest }: BookingFormProps) {
  const [values, setValues] = useState<BookingValues>(() =>
    emptyValues({ accommodation: defaultAccommodation ?? "", returningGuest: defaultReturningGuest ?? "" }),
  )
  const [stepIndex, setStepIndex] = useState(0)
  const [visitedCount, setVisitedCount] = useState(1)
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [alertOpen, setAlertOpen] = useState(false)
  const [stepError, setStepError] = useState<string | null>(null)
  const [stepErrorTestId, setStepErrorTestId] = useState("booking-validation-error")
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set())
  const headingRefs = useRef<Array<HTMLHeadingElement | null>>([])

  const today = new Date().toISOString().slice(0, 10)
  const nights = countNights(values.arrival, values.departure)

  const setValue = (key: keyof BookingValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }))
    if (invalidFields.has(key)) {
      setInvalidFields((current) => {
        const next = new Set(current)
        next.delete(key)
        return next
      })
    }
    setStepError(null)
  }

  const focusHeading = (index: number) => {
    requestAnimationFrame(() => headingRefs.current[index]?.focus({ preventScroll: true }))
  }

  const goToStep = (index: number) => {
    const clamped = Math.max(0, Math.min(index, STEPS.length - 1))
    setStepError(null)
    setInvalidFields(new Set())
    setStepIndex(clamped)
    setVisitedCount((current) => Math.max(current, clamped + 1))
    focusHeading(clamped)
  }

  const failStep = (message: string, fields: string[] = [], testId = "booking-validation-error") => {
    setStepError(message)
    setStepErrorTestId(testId)
    setInvalidFields(new Set(fields))
    focusStepError("booking-step-error")
  }

  /** Validates one step. Returns true when the guest may continue. */
  const validateStep = (index: number): boolean => {
    if (index === 0) {
      if (isBlank(values.accommodation)) {
        failStep("Please choose where you'd like to stay to continue.", ["accommodation"])
        return false
      }
      if (isBlank(values.returningGuest)) {
        failStep("Please let us know if you've stayed with us before.", ["returningGuest"])
        return false
      }
      const eligibility = validateMainHouseEligibility(values.accommodation, values.returningGuest)
      if (eligibility) {
        failStep(eligibility, ["accommodation", "returningGuest"], "booking-validation-summary")
        trackFormSubmitError(FORM_KEY, "main_house_eligibility")
        return false
      }
      return true
    }

    if (index === 1) {
      const range = validateDateRange(values.arrival, values.departure)
      if (range) {
        failStep(range, ["departure"])
        trackFormSubmitError(FORM_KEY, "invalid_date_range")
        return false
      }
      return true
    }

    if (index === 2) {
      if (values.adultGuests.trim() !== "") {
        const adults = Number.parseInt(values.adultGuests, 10)
        if (Number.isNaN(adults) || adults < 1) {
          failStep("Please enter at least 1 adult, or leave the field blank if you're not sure yet.", ["adultGuests"])
          return false
        }
      }
      return true
    }

    if (index === 3) {
      if (isBlank(values.firstName)) {
        failStep("Please enter your first name.", ["firstName"])
        return false
      }
      if (isBlank(values.lastName)) {
        failStep("Please enter your last name.", ["lastName"])
        return false
      }
      if (isBlank(values.phone)) {
        failStep("Please add a phone number so we can reach you quickly.", ["phone"])
        return false
      }
      const emailError = validateEmailPair(values.email, values.confirmEmail)
      if (emailError) {
        failStep(emailError, ["email", "confirmEmail"])
        trackFormSubmitError(FORM_KEY, "email_mismatch")
        return false
      }
      return true
    }

    return true
  }

  const handleNext = () => {
    if (!validateStep(stepIndex)) return
    goToStep(stepIndex + 1)
  }

  const handleBack = () => {
    goToStep(stepIndex - 1)
  }

  const buildFormData = () => {
    const formData = new FormData()
    for (const [key, value] of Object.entries(values)) {
      // Mirror native form semantics: untouched radio groups are omitted, text fields send "".
      if (value === "" && (key === "accommodation" || key === "returningGuest" || key === "referral")) continue
      formData.set(key, value)
    }
    appendFormspreeOpsMetadata(formData, FORM_KEY)
    return formData
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "sending") return

    for (let index = 0; index < STEPS.length; index += 1) {
      if (!validateStep(index)) {
        // failStep already moved focus to the error; don't steal it back to the heading.
        setStepIndex(index)
        setVisitedCount((current) => Math.max(current, index + 1))
        return
      }
    }

    setStepError(null)
    setInvalidFields(new Set())
    trackFormSubmitAttempt(FORM_KEY)
    setStatus("sending")

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: buildFormData(),
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        setValues(emptyValues({ accommodation: defaultAccommodation ?? "", returningGuest: defaultReturningGuest ?? "" }))
        setStepIndex(0)
        setVisitedCount(1)
        setStepError(null)
        setInvalidFields(new Set())
        setStatus("success")
        setAlertOpen(true)
        trackFormSubmitSuccess(FORM_KEY)
        trackLeadConversion(FORM_KEY, LEAD_FORM_CONFIG[FORM_KEY].surface, { sendVercel: false })
        return
      }

      setStatus("error")
      trackFormSubmitError(FORM_KEY, "response")
    } catch (error) {
      setStatus("error")
      trackFormSubmitError(FORM_KEY, "network")
    }
  }

  const handleAlertChange = (open: boolean) => {
    setAlertOpen(open)
    if (!open && status === "success") {
      setStatus("idle")
    }
  }

  const adjustAdults = (delta: number) => {
    const current = Number.parseInt(values.adultGuests, 10)
    const next = Number.isNaN(current) ? (delta > 0 ? 1 : "") : Math.max(1, current + delta)
    setValue("adultGuests", next === "" ? "" : String(next))
  }

  const addRequestStarter = (text: string) => {
    if (values.requests.includes(text)) return
    setValue("requests", values.requests.trim() ? `${values.requests.trim()} ${text}` : text)
  }

  const fieldClassName =
    "min-h-12 rounded-2xl border-border/80 bg-background/85 px-4 shadow-inner shadow-primary/5 focus-visible:ring-primary/30"
  const textareaClassName =
    "min-h-[140px] rounded-3xl border-border/80 bg-background/85 px-4 py-3 shadow-inner shadow-primary/5 focus-visible:ring-primary/30"

  const reviewRows: Array<{ icon: LucideIcon; label: string; value: string; step: number }> = [
    {
      icon: House,
      label: "Stay",
      value: `${ACCOMMODATION_TITLES[values.accommodation] ?? "Not chosen"} · ${values.returningGuest === "yes" ? "Returning guest" : "First stay"}`,
      step: 0,
    },
    {
      icon: CalendarDays,
      label: "Dates",
      value:
        values.arrival && values.departure
          ? `${formatIsoDate(values.arrival)} → ${formatIsoDate(values.departure)}${nights !== null && nights > 0 ? ` · ${nights} night${nights === 1 ? "" : "s"}` : ""}`
          : "Flexible dates",
      step: 1,
    },
    {
      icon: Users,
      label: "Party",
      value: [
        values.adultGuests ? `${values.adultGuests} adult${values.adultGuests === "1" ? "" : "s"}` : null,
        values.childGuests ? `Children: ${values.childGuests}` : null,
      ]
        .filter(Boolean)
        .join(" · ") || "To be confirmed",
      step: 2,
    },
    {
      icon: Mail,
      label: "Contact",
      value: `${values.firstName} ${values.lastName} · ${values.email} · ${values.phone}`.trim(),
      step: 3,
    },
  ]

  return (
    <AlertDialog open={alertOpen} onOpenChange={handleAlertChange}>
      <Card
        data-testid="booking-form-card"
        className={cn(
          "form-shell relative space-y-6 rounded-[32px] p-5 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-6",
          className,
        )}
      >
        <form onSubmit={handleSubmit} noValidate>
          <CardHeader className="space-y-4 p-0">
            <div className="space-y-2">
              <Badge
                variant="secondary"
                className="w-fit gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-black"
              >
                <Send className="h-3.5 w-3.5" aria-hidden />
                Request to book
              </Badge>
              <CardTitle className="text-2xl font-semibold tracking-tight text-foreground text-balance">
                Tell us about your stay.
              </CardTitle>
              <CardDescription className="text-sm leading-6 text-muted-foreground">
                Five short steps. We confirm availability personally and reply within one business day.
              </CardDescription>
            </div>
            <FormStepIndicator
              steps={STEPS}
              currentIndex={stepIndex}
              visitedCount={visitedCount}
              onSelectStep={(index) => {
                if (index < visitedCount) goToStep(index)
              }}
            />
          </CardHeader>

          <CardContent className="space-y-6 p-0 pt-6">
            <StepError id="booking-step-error" message={stepError} testId={stepErrorTestId} />

            <StepPanel stepId="booking-step-stay" active={stepIndex === 0} labelledBy="booking-stay-heading">
              <StepHeading
                id="booking-stay-heading"
                ref={(node) => {
                  headingRefs.current[0] = node
                }}
                title="Which space fits your group?"
                helper="One private group on property at a time. The Main House opens to returning guests."
              />
              <fieldset aria-describedby={invalidFields.has("accommodation") ? "booking-step-error" : undefined}>
                <legend className="sr-only">Accommodation requested</legend>
                <div className="grid gap-3">
                  {ACCOMMODATION_OPTIONS.map((option) => (
                    <OptionCard
                      key={option.value}
                      id={`accommodation-${option.value}`}
                      name="accommodation"
                      value={option.value}
                      checked={values.accommodation === option.value}
                      onChange={(value) => setValue("accommodation", value)}
                      icon={option.icon}
                      title={option.title}
                      description={option.description}
                      meta={option.meta}
                    />
                  ))}
                </div>
              </fieldset>
              <fieldset aria-describedby={invalidFields.has("returningGuest") ? "booking-step-error" : undefined}>
                <legend className="text-[15px] font-semibold text-foreground">
                  Have you stayed at Canary Cove before? <span aria-hidden className="text-destructive">*</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {RETURNING_GUEST_OPTIONS.map((option) => (
                    <ChipOption
                      key={option.value}
                      id={`returning-${option.value}`}
                      name="returningGuest"
                      value={option.value}
                      checked={values.returningGuest === option.value}
                      onChange={(value) => setValue("returningGuest", value)}
                      label={option.label}
                    />
                  ))}
                </div>
              </fieldset>
              {values.accommodation === "main-house" ? (
                <Alert className="rounded-3xl border-primary/25 bg-primary/5">
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                  <AlertTitle>Main House eligibility</AlertTitle>
                  <AlertDescription>
                    The full 5-suite Main House is reserved for returning guests and carries a separate $10,000 damage
                    deposit.
                  </AlertDescription>
                </Alert>
              ) : null}
              <WizardNav onNext={handleNext} showBack={false} nextLabel="Continue" nextTestId="booking-next" />
            </StepPanel>

            <StepPanel stepId="booking-step-dates" active={stepIndex === 1} labelledBy="booking-dates-heading">
              <StepHeading
                id="booking-dates-heading"
                ref={(node) => {
                  headingRefs.current[1] = node
                }}
                title="When would you like to come?"
                helper="Share your closest fit — flexible dates are fine, just leave these blank."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="arrival">Preferred Arrival Date</Label>
                  <Input
                    id="arrival"
                    name="arrival"
                    type="date"
                    min={today}
                    autoComplete="off"
                    value={values.arrival}
                    onChange={(event) => setValue("arrival", event.target.value)}
                    className={fieldClassName}
                    aria-invalid={invalidFields.has("departure") ? true : undefined}
                    aria-describedby={invalidFields.has("departure") ? "booking-step-error" : undefined}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departure">Preferred Departure Date</Label>
                  <Input
                    id="departure"
                    name="departure"
                    type="date"
                    min={values.arrival || today}
                    autoComplete="off"
                    value={values.departure}
                    onChange={(event) => setValue("departure", event.target.value)}
                    className={fieldClassName}
                    aria-invalid={invalidFields.has("departure") ? true : undefined}
                    aria-describedby={invalidFields.has("departure") ? "booking-step-error" : undefined}
                  />
                </div>
              </div>
              {nights !== null && nights > 0 && values.arrival && values.departure ? (
                <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.07] px-4 py-2 text-sm font-medium text-foreground" aria-live="polite">
                  <CalendarDays className="h-4 w-4 text-primary" aria-hidden />
                  {formatIsoDate(values.arrival)} → {formatIsoDate(values.departure)} · {nights} night
                  {nights === 1 ? "" : "s"}
                </p>
              ) : null}
              <WizardNav onBack={handleBack} onNext={handleNext} showBack nextLabel="Continue" nextTestId="booking-next" />
            </StepPanel>

            <StepPanel stepId="booking-step-party" active={stepIndex === 2} labelledBy="booking-party-heading">
              <StepHeading
                id="booking-party-heading"
                ref={(node) => {
                  headingRefs.current[2] = node
                }}
                title="Who's traveling?"
                helper="Adults first — then add children under 21 with their ages so we can plan rooms."
              />
              <div className="space-y-2">
                <Label htmlFor="adultGuests">Number of Adult Guests</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Fewer adults"
                    onClick={() => adjustAdults(-1)}
                    disabled={values.adultGuests === "" || values.adultGuests === "1"}
                    className="h-12 w-12 shrink-0 rounded-full"
                  >
                    <Minus className="h-4 w-4" aria-hidden />
                  </Button>
                  <Input
                    id="adultGuests"
                    name="adultGuests"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="2"
                    value={values.adultGuests}
                    onChange={(event) => setValue("adultGuests", event.target.value)}
                    className={cn(fieldClassName, "wizard-number text-center text-lg font-semibold tabular-nums")}
                    aria-invalid={invalidFields.has("adultGuests") ? true : undefined}
                    aria-describedby={invalidFields.has("adultGuests") ? "booking-step-error" : undefined}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="More adults"
                    onClick={() => adjustAdults(1)}
                    className="h-12 w-12 shrink-0 rounded-full"
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="childGuests">Children under 21 and ages</Label>
                <Input
                  id="childGuests"
                  name="childGuests"
                  autoComplete="off"
                  placeholder="2 children, ages 8 and 10…"
                  value={values.childGuests}
                  onChange={(event) => setValue("childGuests", event.target.value)}
                  className={fieldClassName}
                />
                <p className="form-helper">Leave blank if no children are traveling.</p>
              </div>
              <WizardNav onBack={handleBack} onNext={handleNext} showBack nextLabel="Continue" nextTestId="booking-next" />
            </StepPanel>

            <StepPanel stepId="booking-step-contact" active={stepIndex === 3} labelledBy="booking-contact-heading">
              <StepHeading
                id="booking-contact-heading"
                ref={(node) => {
                  headingRefs.current[3] = node
                }}
                title="Where should we send your quote?"
                helper="One lead contact for the quote, hold, and follow-up."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <FieldLabel htmlFor="firstName" required>First Name</FieldLabel>
                  <Input
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    placeholder="Alexandra…"
                    value={values.firstName}
                    onChange={(event) => setValue("firstName", event.target.value)}
                    className={fieldClassName}
                    aria-required
                    aria-invalid={invalidFields.has("firstName") ? true : undefined}
                    aria-describedby={invalidFields.has("firstName") ? "booking-step-error" : undefined}
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel htmlFor="lastName" required>Last Name</FieldLabel>
                  <Input
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    placeholder="Martin…"
                    value={values.lastName}
                    onChange={(event) => setValue("lastName", event.target.value)}
                    className={fieldClassName}
                    aria-required
                    aria-invalid={invalidFields.has("lastName") ? true : undefined}
                    aria-describedby={invalidFields.has("lastName") ? "booking-step-error" : undefined}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="phone" required>Phone Number</FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+501 610-5121…"
                  value={values.phone}
                  onChange={(event) => setValue("phone", event.target.value)}
                  className={fieldClassName}
                  aria-required
                  aria-invalid={invalidFields.has("phone") ? true : undefined}
                  aria-describedby={invalidFields.has("phone") ? "booking-step-error" : "phone-note"}
                />
                <p id="phone-note" className="form-helper">
                  Include your country code so we can reach you quickly.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <FieldLabel htmlFor="email" required>Email Address</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    spellCheck={false}
                    inputMode="email"
                    placeholder="alex@example.com…"
                    value={values.email}
                    onChange={(event) => setValue("email", event.target.value)}
                    className={fieldClassName}
                    aria-required
                    aria-invalid={invalidFields.has("email") ? true : undefined}
                    aria-describedby={invalidFields.has("email") ? "booking-step-error" : undefined}
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel htmlFor="confirmEmail" required>Confirm Email Address</FieldLabel>
                  <Input
                    id="confirmEmail"
                    name="confirmEmail"
                    type="email"
                    autoComplete="off"
                    spellCheck={false}
                    inputMode="email"
                    placeholder="Confirm your email…"
                    value={values.confirmEmail}
                    onChange={(event) => setValue("confirmEmail", event.target.value)}
                    className={fieldClassName}
                    aria-required
                    aria-invalid={invalidFields.has("confirmEmail") ? true : undefined}
                    aria-describedby={invalidFields.has("confirmEmail") ? "booking-step-error" : "confirmEmail-note"}
                  />
                  <p id="confirmEmail-note" className="form-helper">
                    We&apos;ll use this address for the quote and confirmation.
                  </p>
                </div>
              </div>
              <WizardNav onBack={handleBack} onNext={handleNext} showBack nextLabel="Continue" nextTestId="booking-next" />
            </StepPanel>

            <StepPanel stepId="booking-step-finish" active={stepIndex === 4} labelledBy="booking-finish-heading">
              <StepHeading
                id="booking-finish-heading"
                ref={(node) => {
                  headingRefs.current[4] = node
                }}
                title="Anything we should plan around?"
                helper="A line or two on the nature of this request — celebrations, pace, reef days, or dining."
              />
              <div className="space-y-2">
                <Label htmlFor="requests">
                  Nature of inquiry <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Suggested trip details">
                  {REQUEST_STARTERS.map((starter) => (
                    <Button
                      key={starter.label}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addRequestStarter(starter.text)}
                      className="gap-1.5 rounded-full"
                    >
                      <starter.icon className="h-3.5 w-3.5" aria-hidden />
                      {starter.label}
                    </Button>
                  ))}
                </div>
                <Textarea
                  id="requests"
                  name="requests"
                  rows={4}
                  autoComplete="off"
                  placeholder="Tell us about the trip you have in mind…"
                  value={values.requests}
                  onChange={(event) => setValue("requests", event.target.value)}
                  className={textareaClassName}
                  aria-describedby="requests-helper"
                />
                <p id="requests-helper" className="form-helper">
                  Optional, but a short purpose note helps us quote the stay you actually want.
                </p>
              </div>
              <fieldset>
                <legend className="text-[15px] font-semibold text-foreground">
                  How did you hear about Canary Cove?{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {REFERRAL_OPTIONS.map((option) => (
                    <ChipOption
                      key={option.value}
                      id={`referral-${option.value}`}
                      name="referral"
                      value={option.value}
                      checked={values.referral === option.value}
                      onChange={(value) => setValue("referral", value)}
                      label={option.label}
                    />
                  ))}
                </div>
              </fieldset>
              <div className="space-y-3 rounded-3xl border border-border/60 bg-surface-elevated/80 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Review your request
                </p>
                <dl className="divide-y divide-border/60">
                  {reviewRows.map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                        <div className="min-w-0">
                          <dt className="text-xs font-medium text-muted-foreground">{row.label}</dt>
                          <dd className="truncate text-sm font-medium text-foreground">{row.value}</dd>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => goToStep(row.step)}
                        aria-label={`Edit ${row.label.toLowerCase()}`}
                        className="shrink-0"
                      >
                        Edit
                      </Button>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="flex items-start gap-3 rounded-3xl border border-primary/25 bg-primary/5 px-4 py-3.5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <p className="text-sm leading-5 text-foreground/90">
                  Sending places a tentative hold while we confirm availability, pricing, and next steps with you
                  directly. Chef service included.
                </p>
              </div>
              {status === "error" ? (
                <p className="form-error" role="alert" aria-live="polite" data-testid="booking-error">
                  Something went wrong. Please try again or email us directly.
                </p>
              ) : null}
              <WizardNav
                onBack={handleBack}
                onNext={handleNext}
                showBack
                nextLabel={status === "sending" ? "Sending request…" : "Send booking request"}
                isSubmit
                loading={status === "sending"}
                submitTestId="booking-submit"
              />
            </StepPanel>
          </CardContent>
        </form>
      </Card>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Request received</AlertDialogTitle>
          <AlertDialogDescription>
            Thanks for sharing your dates. Our team will confirm availability and follow up with next steps shortly.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Got it</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
