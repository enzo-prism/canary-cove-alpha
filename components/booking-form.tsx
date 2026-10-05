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
  MoonStar,
  Plus,
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
import {
  ChipOption,
  FieldLabel,
  focusStepError,
  focusStepHeading,
  FormStepIndicator,
  OptionCard,
  StepError,
  StepHeading,
  StepPanel,
  WizardNav,
  wizardFieldClass,
  wizardTextareaClass,
  type WizardDirection,
  type WizardStepMeta,
} from "@/components/form-wizard"
import { SuccessMark } from "@/components/book/success-mark"
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
import styles from "@/components/book/wizard.module.css"

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
    description: "Private villa with infinity pool, ideal for first stays and smaller groups.",
    meta: "From $1,000 a night · most first stays",
    icon: BedDouble,
  },
  {
    value: "main-house",
    title: "Main House (5 suites)",
    description: "The full 5-suite Main House for larger groups, reserved for returning guests.",
    meta: "From $2,500 a night · whole-estate buyout",
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
  const [direction, setDirection] = useState<WizardDirection>(null)
  const [visitedCount, setVisitedCount] = useState(1)
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [alertOpen, setAlertOpen] = useState(false)
  const [stepError, setStepError] = useState<string | null>(null)
  const [stepErrorTestId, setStepErrorTestId] = useState("booking-validation-error")
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set())
  const headingRefs = useRef<Array<HTMLHeadingElement | null>>([])
  const cardRef = useRef<HTMLDivElement | null>(null)

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
    requestAnimationFrame(() => focusStepHeading(headingRefs.current[index] ?? null, cardRef.current))
  }

  const goToStep = (index: number) => {
    const clamped = Math.max(0, Math.min(index, STEPS.length - 1))
    setStepError(null)
    setInvalidFields(new Set())
    if (clamped !== stepIndex) setDirection(clamped > stepIndex ? "forward" : "back")
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
        setDirection(null)
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
      <div
        ref={cardRef}
        data-testid="booking-form-card"
        className={cn(
          "relative overflow-hidden rounded-[28px] border border-border/70 bg-surface shadow-[var(--shadow-soft)]",
          className,
        )}
      >
        {/* A thin canary horizon along the top edge: the card's one spark. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-canary-deep/70 to-transparent"
        />
        <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-8 lg:p-10">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-3">
              <p className="eyebrow eyebrow-plain">Request to book</p>
              <h2 className="font-display text-[2.25rem] leading-[1.02] tracking-[-0.015em] text-foreground sm:text-[2.75rem]">
                Tell us about your <span className="italic-accent">stay.</span>
              </h2>
            </div>
            <ul className="hidden shrink-0 space-y-1.5 pt-1 text-right text-xs leading-5 text-muted-foreground sm:block">
              <li>About two minutes</li>
              <li>No payment taken here</li>
            </ul>
          </div>

          <FormStepIndicator
            className="mt-7"
            steps={STEPS}
            currentIndex={stepIndex}
            visitedCount={visitedCount}
            hint="Reply within one business day"
            onSelectStep={(index) => {
              if (index < visitedCount) goToStep(index)
            }}
          />

          <div className="mt-8 space-y-6">
            <StepError id="booking-step-error" message={stepError} testId={stepErrorTestId} />

            <StepPanel stepId="booking-step-stay" active={stepIndex === 0} labelledBy="booking-stay-heading" direction={direction}>
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
              {values.accommodation === "main-house" ? (
                <div
                  className={cn(
                    styles.popIn,
                    "flex items-start gap-3.5 rounded-[20px] border border-lagoon/20 bg-lagoon/[0.06] px-4 py-4 sm:px-5",
                  )}
                >
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-lagoon" strokeWidth={1.6} aria-hidden />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Main House eligibility</p>
                    <p className="text-sm leading-6 text-foreground/80">
                      The full 5-suite Main House is reserved for returning guests and carries a separate $10,000 damage
                      deposit.
                    </p>
                  </div>
                </div>
              ) : null}
              <fieldset aria-describedby={invalidFields.has("returningGuest") ? "booking-step-error" : undefined}>
                <legend className="text-[15px] font-medium text-foreground">
                  Have you stayed at Canary Cove before? <span aria-hidden className="text-canary-deep">*</span>
                </legend>
                <div className="mt-3 grid gap-2.5 sm:flex sm:flex-wrap">
                  {RETURNING_GUEST_OPTIONS.map((option) => (
                    <ChipOption
                      key={option.value}
                      id={`returning-${option.value}`}
                      name="returningGuest"
                      value={option.value}
                      checked={values.returningGuest === option.value}
                      onChange={(value) => setValue("returningGuest", value)}
                      label={option.label}
                      className="justify-center sm:justify-start"
                    />
                  ))}
                </div>
              </fieldset>
              <WizardNav
                onNext={handleNext}
                showBack={false}
                nextLabel="Continue"
                nextTestId="booking-next"
                note="A person confirms every request personally. Nothing is charged here."
              />
            </StepPanel>

            <StepPanel stepId="booking-step-dates" active={stepIndex === 1} labelledBy="booking-dates-heading" direction={direction}>
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
                  <Label htmlFor="arrival" className="text-[13px] font-medium leading-5 text-foreground/85">
                    Preferred Arrival Date
                  </Label>
                  <Input
                    id="arrival"
                    name="arrival"
                    type="date"
                    min={today}
                    autoComplete="off"
                    value={values.arrival}
                    onChange={(event) => setValue("arrival", event.target.value)}
                    className={cn(wizardFieldClass, "tabular-nums")}
                    aria-invalid={invalidFields.has("departure") ? true : undefined}
                    aria-describedby={invalidFields.has("departure") ? "booking-step-error" : undefined}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departure" className="text-[13px] font-medium leading-5 text-foreground/85">
                    Preferred Departure Date
                  </Label>
                  <Input
                    id="departure"
                    name="departure"
                    type="date"
                    min={values.arrival || today}
                    autoComplete="off"
                    value={values.departure}
                    onChange={(event) => setValue("departure", event.target.value)}
                    className={cn(wizardFieldClass, "tabular-nums")}
                    aria-invalid={invalidFields.has("departure") ? true : undefined}
                    aria-describedby={invalidFields.has("departure") ? "booking-step-error" : undefined}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                {nights !== null && nights > 0 && values.arrival && values.departure ? (
                  <p
                    key={`${values.arrival}-${values.departure}`}
                    className={cn(
                      styles.popIn,
                      "inline-flex items-center gap-2.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-sand-light",
                    )}
                    aria-live="polite"
                  >
                    <MoonStar className="h-4 w-4 text-canary" aria-hidden />
                    <span className="tabular-nums">
                      {formatIsoDate(values.arrival)} → {formatIsoDate(values.departure)} · {nights} night
                      {nights === 1 ? "" : "s"}
                    </span>
                  </p>
                ) : null}
                <a
                  href="#availability"
                  className="link-underline inline-flex min-h-11 items-center gap-2 text-sm font-medium text-lagoon"
                >
                  <CalendarDays className="h-4 w-4" aria-hidden />
                  See open nights on the calendar
                </a>
              </div>
              <WizardNav onBack={handleBack} onNext={handleNext} showBack nextLabel="Continue" nextTestId="booking-next" />
            </StepPanel>

            <StepPanel stepId="booking-step-party" active={stepIndex === 2} labelledBy="booking-party-heading" direction={direction}>
              <StepHeading
                id="booking-party-heading"
                ref={(node) => {
                  headingRefs.current[2] = node
                }}
                title="Who's traveling?"
                helper="Adults first — then add children under 21 with their ages so we can plan rooms."
              />
              <div className="space-y-2">
                <Label htmlFor="adultGuests" className="text-[13px] font-medium leading-5 text-foreground/85">
                  Number of Adult Guests
                </Label>
                <div className="flex items-center gap-2 rounded-[22px] border border-border/80 bg-white/55 p-2">
                  <button
                    type="button"
                    aria-label="Fewer adults"
                    onClick={() => adjustAdults(-1)}
                    disabled={values.adultGuests === "" || values.adultGuests === "1"}
                    className="focus-ring flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sand-deep text-foreground transition-colors duration-300 hover:bg-ink hover:text-sand-light disabled:pointer-events-none disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" aria-hidden />
                  </button>
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
                    className="wizard-number h-12 min-h-12 border-0 bg-transparent text-center font-display text-[2rem] leading-none tabular-nums shadow-none focus-visible:ring-2 focus-visible:ring-lagoon/25 focus-visible:ring-offset-0 sm:text-[2rem]"
                    aria-invalid={invalidFields.has("adultGuests") ? true : undefined}
                    aria-describedby={invalidFields.has("adultGuests") ? "booking-step-error" : undefined}
                  />
                  <button
                    type="button"
                    aria-label="More adults"
                    onClick={() => adjustAdults(1)}
                    className="focus-ring flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink text-sand-light transition-colors duration-300 hover:bg-lagoon"
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="childGuests" className="text-[13px] font-medium leading-5 text-foreground/85">
                  Children under 21 and ages
                </Label>
                <Input
                  id="childGuests"
                  name="childGuests"
                  autoComplete="off"
                  placeholder="2 children, ages 8 and 10…"
                  value={values.childGuests}
                  onChange={(event) => setValue("childGuests", event.target.value)}
                  className={wizardFieldClass}
                  aria-describedby="childGuests-note"
                />
                <p id="childGuests-note" className="form-helper">
                  Leave blank if no children are traveling.
                </p>
              </div>
              <WizardNav onBack={handleBack} onNext={handleNext} showBack nextLabel="Continue" nextTestId="booking-next" />
            </StepPanel>

            <StepPanel stepId="booking-step-contact" active={stepIndex === 3} labelledBy="booking-contact-heading" direction={direction}>
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
                    className={wizardFieldClass}
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
                    className={wizardFieldClass}
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
                  className={wizardFieldClass}
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
                    className={wizardFieldClass}
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
                    className={wizardFieldClass}
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

            <StepPanel stepId="booking-step-finish" active={stepIndex === 4} labelledBy="booking-finish-heading" direction={direction}>
              <StepHeading
                id="booking-finish-heading"
                ref={(node) => {
                  headingRefs.current[4] = node
                }}
                title="Anything we should plan around?"
                helper="A line or two on the nature of this request — celebrations, pace, reef days, or dining."
              />
              <div className="space-y-3">
                <Label htmlFor="requests" className="text-[13px] font-medium leading-5 text-foreground/85">
                  Nature of inquiry <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Suggested trip details">
                  {REQUEST_STARTERS.map((starter) => {
                    const added = values.requests.includes(starter.text)
                    return (
                      <button
                        key={starter.label}
                        type="button"
                        onClick={() => addRequestStarter(starter.text)}
                        aria-pressed={added}
                        className={cn(
                          "focus-ring inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors duration-500",
                          added
                            ? "border-lagoon/30 bg-lagoon/10 text-lagoon"
                            : "border-border/90 bg-white/55 text-foreground hover:border-ink/40 hover:bg-white",
                        )}
                      >
                        <starter.icon className="h-3.5 w-3.5" aria-hidden />
                        {starter.label}
                      </button>
                    )
                  })}
                </div>
                <Textarea
                  id="requests"
                  name="requests"
                  rows={4}
                  autoComplete="off"
                  placeholder="Tell us about the trip you have in mind…"
                  value={values.requests}
                  onChange={(event) => setValue("requests", event.target.value)}
                  className={wizardTextareaClass}
                  aria-describedby="requests-helper"
                />
                <p id="requests-helper" className="form-helper">
                  Optional, but a short purpose note helps us quote the stay you actually want.
                </p>
              </div>
              <fieldset>
                <legend className="text-[15px] font-medium text-foreground">
                  How did you hear about Canary Cove?{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
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
              <div className="rounded-[22px] bg-sand-deep/60 p-4 sm:p-6">
                <p className="eyebrow eyebrow-plain">Your request</p>
                <dl className="mt-3 divide-y divide-border/80">
                  {reviewRows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-3 py-2.5 first:pt-1 last:pb-0">
                      <div className="flex min-w-0 items-start gap-3">
                        <row.icon className="mt-1 h-4 w-4 shrink-0 text-lagoon" strokeWidth={1.75} aria-hidden />
                        <div className="min-w-0">
                          <dt className="text-xs text-muted-foreground">{row.label}</dt>
                          <dd className="truncate text-sm font-medium text-foreground">{row.value}</dd>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => goToStep(row.step)}
                        aria-label={`Edit ${row.label.toLowerCase()}`}
                        className="focus-ring min-h-11 shrink-0 rounded-full px-3 text-[13px] font-medium text-lagoon transition-colors hover:bg-white/70"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="flex items-start gap-3 text-sm leading-6 text-foreground/80">
                <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-lagoon" aria-hidden />
                <p>
                  Sending places a tentative hold while we confirm availability, pricing, and next steps with you
                  directly. Chef service included.
                </p>
              </div>
              {status === "error" ? (
                <p
                  className={cn(styles.nudge, "rounded-2xl border border-destructive/25 bg-destructive/[0.06] px-4 py-3 text-sm text-destructive")}
                  role="alert"
                  aria-live="polite"
                  data-testid="booking-error"
                >
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
          </div>
        </form>
      </div>
      <AlertDialogContent className="w-[calc(100%-2rem)] max-w-md gap-6 rounded-[28px] border-border/70 bg-surface p-7 shadow-[var(--shadow-lift)] sm:rounded-[28px] sm:p-9">
        <SuccessMark />
        <AlertDialogHeader className="gap-3 text-left sm:text-left">
          <AlertDialogTitle className="font-display text-[2.5rem] font-normal leading-none tracking-[-0.01em]">
            Request received
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px] leading-6 text-muted-foreground">
            Thanks for sharing your dates. Our team will confirm availability and follow up with next steps shortly.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ol className="space-y-3 border-t border-border/70 pt-5 text-sm text-foreground/85">
          {[
            "We check the calendar for your dates",
            "A tailored quote, usually within one business day",
            "A 50% deposit secures your stay",
          ].map((line, index) => (
            <li key={line} className="flex items-baseline gap-3">
              <span aria-hidden="true" className="font-display text-lg leading-none text-lagoon tabular-nums">0{index + 1}</span>
              {line}
            </li>
          ))}
        </ol>
        <AlertDialogFooter>
          <AlertDialogAction className="h-12 w-full px-7 text-[15px] sm:w-auto">Got it</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
