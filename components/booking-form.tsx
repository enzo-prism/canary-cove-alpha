"use client"

import { useState, type FormEvent } from "react"

import { CalendarRange, Send } from "lucide-react"

import { trackFormSubmitAttempt, trackFormSubmitError, trackFormSubmitSuccess, trackLeadConversion } from "@/lib/analytics"
import { appendFormspreeOpsMetadata } from "@/lib/formspree-ops"
import { LEAD_FORM_CONFIG } from "@/lib/lead-forms"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

const FORM_ENDPOINT = "/api/forms"
const FORM_KEY = "booking"

type BookingFormProps = {
  className?: string
  defaultAccommodation?: "villa" | "main-house"
  defaultReturningGuest?: "yes" | "no"
}

export function BookingForm({ className, defaultAccommodation, defaultReturningGuest }: BookingFormProps) {
  const [alertOpen, setAlertOpen] = useState(false)
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [accommodation, setAccommodation] = useState(defaultAccommodation ?? "")
  const [validationError, setValidationError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    confirmEmail?: string
    departure?: string
  }>({})

  const today = new Date().toISOString().slice(0, 10)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "sending") return

    const form = event.currentTarget
    const formData = new FormData(form)
    appendFormspreeOpsMetadata(formData, FORM_KEY)
    const email = String(formData.get("email") ?? "").trim()
    const confirmEmail = String(formData.get("confirmEmail") ?? "").trim()
    const arrival = String(formData.get("arrival") ?? "").trim()
    const departure = String(formData.get("departure") ?? "").trim()
    const requestedAccommodation = String(formData.get("accommodation") ?? "").trim()
    const returningGuest = String(formData.get("returningGuest") ?? "").trim()

    if (email !== confirmEmail) {
      setFieldErrors({
        confirmEmail: "Please make sure both email fields match before sending your request.",
      })
      setValidationError("Please make sure both email fields match before sending your request.")
      trackFormSubmitError(FORM_KEY, "email_mismatch")
      form.querySelector<HTMLInputElement>("#confirmEmail")?.focus()
      return
    }

    // Same-day arrival/departure is zero nights and is not a valid estate stay.
    if (arrival && departure && departure <= arrival) {
      setFieldErrors({
        departure: "Departure date must be after your arrival date.",
      })
      setValidationError("Departure date must be after your arrival date.")
      trackFormSubmitError(FORM_KEY, "invalid_date_range")
      form.querySelector<HTMLInputElement>("#departure")?.focus()
      return
    }

    if (requestedAccommodation === "main-house" && returningGuest !== "yes") {
      setValidationError("The 5-suite Main House is available only to returning Canary Cove guests. Please choose the Villa for a first stay.")
      trackFormSubmitError(FORM_KEY, "main_house_eligibility")
      form.querySelector<HTMLButtonElement>("#returningGuest")?.focus()
      return
    }

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
        setFieldErrors({})
        setValidationError(null)
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

  const fieldClassName =
    "min-h-12 rounded-[20px] border-border/80 bg-background/85 px-4 shadow-inner shadow-primary/5 focus-visible:ring-primary/30"
  const textareaClassName =
    "min-h-[168px] rounded-[24px] border-border/80 bg-background/85 px-4 py-3 shadow-inner shadow-primary/5 focus-visible:ring-primary/30"
  const selectClassName =
    "min-h-12 rounded-[20px] border-border/80 bg-background/85 px-4 shadow-inner shadow-primary/5 focus:ring-primary/30"
  const sectionClassName = "form-section space-y-4"

  const handleAlertChange = (open: boolean) => {
    setAlertOpen(open)
    if (!open && status === "success") {
      setStatus("idle")
    }
  }

  return (
    <AlertDialog open={alertOpen} onOpenChange={handleAlertChange}>
      <Card
        data-testid="booking-form-card"
        className={cn(
          "form-shell relative space-y-6 rounded-[32px] p-5 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-6",
          className,
        )}
      >
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-3 p-0">
            <Badge
              variant="secondary"
              className="w-fit gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-black"
            >
              <Send className="h-4 w-4" />
              Request to book
            </Badge>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-foreground text-balance">Tell us about your stay.</CardTitle>
              <CardDescription className="text-sm leading-6 text-muted-foreground">
                Share your preferred dates and any celebrations. Our team will confirm availability and send a tailored quote.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="form-meta">Reply within one business day</span>
              <span className="form-meta">One group on property</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-0 pt-6">
            <Alert className="rounded-[24px] border-border/70 bg-surface-elevated/70">
              <CalendarRange className="h-4 w-4" />
              <AlertTitle>We confirm every stay personally.</AlertTitle>
              <AlertDescription>
                Sending this form places a tentative hold while we confirm availability, pricing, and next steps with you
                directly.
              </AlertDescription>
            </Alert>

            {validationError ? (
              <Alert className="rounded-[24px] border-destructive/40 bg-destructive/5 text-destructive" data-testid="booking-validation-summary">
                <AlertTitle>Check a couple of details</AlertTitle>
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            ) : null}

            <fieldset className={sectionClassName} aria-labelledby="booking-guest-details">
              <legend className="sr-only">Guest details</legend>
              <div className="space-y-1">
                <p className="form-kicker">Guest details</p>
                <h3 id="booking-guest-details" className="text-base font-semibold text-foreground">
                  Who should we coordinate with?
                </h3>
                <p className="form-helper">We&apos;ll use one lead contact for the quote, hold, and follow-up.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    autoComplete="given-name"
                    placeholder="Alexandra…"
                    className={fieldClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    autoComplete="family-name"
                    placeholder="Martin…"
                    className={fieldClassName}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    required
                    autoComplete="tel"
                    placeholder="+1 (242) 555-0123…"
                    className={fieldClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    spellCheck={false}
                    inputMode="email"
                    placeholder="alex@example.com…"
                    className={fieldClassName}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmEmail">Confirm Email Address</Label>
                <Input
                  id="confirmEmail"
                  name="confirmEmail"
                  type="email"
                  required
                  autoComplete="off"
                  spellCheck={false}
                  inputMode="email"
                  placeholder="Confirm your email…"
                  className={fieldClassName}
                  aria-invalid={fieldErrors.confirmEmail ? true : undefined}
                  aria-describedby="confirmEmail-note confirmEmail-error"
                  onChange={() => {
                    if (!fieldErrors.confirmEmail) return
                    setFieldErrors((current) => ({ ...current, confirmEmail: undefined }))
                    setValidationError(null)
                  }}
                />
                <p id="confirmEmail-note" className="form-helper">
                  We’ll use this address for the quote, availability confirmation, and follow-up.
                </p>
                {fieldErrors.confirmEmail ? (
                  <p id="confirmEmail-error" className="form-error" role="alert" data-testid="booking-validation-error">
                    {fieldErrors.confirmEmail}
                  </p>
                ) : null}
              </div>
            </fieldset>

            <Separator />

            <fieldset className={sectionClassName} aria-labelledby="booking-stay-details">
              <legend className="sr-only">Stay details</legend>
              <div className="space-y-1">
                <p className="form-kicker">Stay details</p>
                <h3 id="booking-stay-details" className="text-base font-semibold text-foreground">
                  Tell us when and who is traveling.
                </h3>
                <p className="form-helper">If your dates are flexible, share the closest fit and explain the rest in the note below.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="accommodation">Accommodation requested</Label>
                  <Select
                    name="accommodation"
                    required
                    defaultValue={defaultAccommodation}
                    onValueChange={setAccommodation}
                  >
                    <SelectTrigger id="accommodation" className={selectClassName}>
                      <SelectValue placeholder="Choose an accommodation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="villa">Villa (1–3 suites)</SelectItem>
                      <SelectItem value="main-house">Main House (5 suites)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="returningGuest">Have you stayed at Canary Cove before?</Label>
                  <Select name="returningGuest" required defaultValue={defaultReturningGuest}>
                    <SelectTrigger id="returningGuest" className={selectClassName}>
                      <SelectValue placeholder="Choose yes or no" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes, I am a returning guest</SelectItem>
                      <SelectItem value="no">No, this would be my first stay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {accommodation === "main-house" ? (
                <Alert className="rounded-[24px] border-primary/25 bg-primary/5">
                  <AlertTitle>Main House eligibility</AlertTitle>
                  <AlertDescription>
                    The full 5-suite Main House is reserved for returning guests and carries a separate $10,000 damage deposit.
                  </AlertDescription>
                </Alert>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="arrival">Preferred Arrival Date</Label>
                  <Input
                    id="arrival"
                    name="arrival"
                    type="date"
                    min={today}
                    autoComplete="off"
                    className={fieldClassName}
                    onChange={() => {
                      if (!fieldErrors.departure) return
                      setFieldErrors((current) => ({ ...current, departure: undefined }))
                      setValidationError(null)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departure">Preferred Departure Date</Label>
                  <Input
                    id="departure"
                    name="departure"
                    type="date"
                    min={today}
                    autoComplete="off"
                    className={fieldClassName}
                    aria-invalid={fieldErrors.departure ? true : undefined}
                    aria-describedby={fieldErrors.departure ? "departure-error" : undefined}
                    onChange={() => {
                      if (!fieldErrors.departure) return
                      setFieldErrors((current) => ({ ...current, departure: undefined }))
                      setValidationError(null)
                    }}
                  />
                  {fieldErrors.departure ? (
                    <p id="departure-error" className="form-error" role="alert" data-testid="booking-validation-error">
                      {fieldErrors.departure}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="adultGuests">Number of Adult Guests</Label>
                  <Input
                    id="adultGuests"
                    name="adultGuests"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="4 adults…"
                    className={fieldClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childGuests">Children under 21 and ages</Label>
                  <Input
                    id="childGuests"
                    name="childGuests"
                    autoComplete="off"
                    placeholder="2 children, ages 8 and 10…"
                    className={fieldClassName}
                  />
                </div>
              </div>
            </fieldset>

            <Separator />

            <fieldset className={sectionClassName} aria-labelledby="booking-trip-notes">
              <legend className="sr-only">Trip notes</legend>
              <div className="space-y-1">
                <p className="form-kicker">Trip notes</p>
                <h3 id="booking-trip-notes" className="text-base font-semibold text-foreground">
                  Share the stay you have in mind.
                </h3>
                <p className="form-helper">Tell us about the feel of the trip: celebrations, reef days, pace, food, or anything else to plan around.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requests">Message <span className="text-muted-foreground">(optional)</span></Label>
                <Textarea
                  id="requests"
                  name="requests"
                  rows={5}
                  autoComplete="off"
                  placeholder="Celebrations, preferred pace, reef days, dietary notes, or anything else we should plan around…"
                  className={textareaClassName}
                />
                <p className="form-helper">The more context you share here, the more precise the hold and quote will be.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral">How did you hear about Canary Cove? <span className="text-muted-foreground">(optional)</span></Label>
                <Select name="referral">
                  <SelectTrigger id="referral" className={selectClassName}>
                    <SelectValue placeholder="How did you hear about Canary Cove?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="returning-guest">Previous stay / returning guest</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="other-search">Other search engine</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </fieldset>

            <Separator />

            <div className="form-section flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full flex-col gap-2 sm:w-auto">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto focus-ring"
                  disabled={status === "sending"}
                  data-testid="booking-submit"
                >
                  {status === "sending" ? "Sending request…" : "Send booking request"}
                  <Send className="h-4 w-4" />
                </Button>
                {status === "error" ? (
                  <p className="form-error" role="alert" aria-live="polite" data-testid="booking-error">
                    Something went wrong. Please try again or email us directly.
                  </p>
                ) : null}
              </div>
              <div className="max-w-md space-y-2">
                <p className="text-sm font-medium text-foreground">One private group at a time.</p>
                <p className="form-helper">
                  Sending this form places a tentative hold while we confirm availability, pricing, and next steps with you directly.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-left">
              <span className="form-meta">Chef service included</span>
              <span className="form-meta">Courtesy hold after review</span>
              <span className="form-meta">Tailored quote</span>
            </div>
            {validationError && !fieldErrors.confirmEmail && !fieldErrors.departure ? (
              <p className="form-error" role="alert" data-testid="booking-validation-error">
                {validationError}
              </p>
            ) : null}
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
