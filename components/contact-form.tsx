"use client"

import { useState, type FormEvent } from "react"
import { Check, Send } from "lucide-react"

import { InquiryField, inquiryControlClassName, inquiryTextareaClassName } from "@/components/forms/inquiry-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { trackFormSubmitAttempt, trackFormSubmitError, trackFormSubmitSuccess, trackLeadConversion } from "@/lib/analytics"
import { appendFormspreeOpsMetadata } from "@/lib/formspree-ops"
import { isValidEmail } from "@/lib/inquiry"
import { LEAD_FORM_CONFIG } from "@/lib/lead-forms"
import { SITE_CONTACTS, SITE_INQUIRY_EMAIL, SITE_INQUIRY_MAILTO } from "@/lib/site-config"
import { cn } from "@/lib/utils"

const FORM_ENDPOINT = "/api/forms"
const FORM_KEY = "contact"
const MAX_MESSAGE_LENGTH = 3000
const MIN_MESSAGE_LENGTH = 8

type ContactStatus = "idle" | "sending" | "success" | "error"

type FieldErrors = {
  name?: string
  email?: string
  message?: string
}

function focusInquiryField(id: string) {
  const element = document.getElementById(id)
  if (!(element instanceof HTMLElement)) return
  element.scrollIntoView({ behavior: "smooth", block: "center" })
  element.focus()
}

export function ContactForm() {
  const [status, setStatus] = useState<ContactStatus>("idle")
  const [message, setMessage] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const clearFieldError = (key: keyof FieldErrors) => {
    setFieldErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "sending") return

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const note = String(formData.get("message") ?? "").trim()

    const nextErrors: FieldErrors = {}
    if (!name) nextErrors.name = "Name is required."
    if (!email) nextErrors.email = "Email is required."
    else if (!isValidEmail(email)) nextErrors.email = "Please enter a valid email address."
    if (!note) nextErrors.message = "Please add a short note so we know how to help."
    else if (note.length < MIN_MESSAGE_LENGTH) {
      nextErrors.message = "Please add a little more detail so we can reply usefully."
    }

    const firstErrorKey = (Object.keys(nextErrors) as Array<keyof FieldErrors>)[0]
    if (firstErrorKey) {
      setFieldErrors(nextErrors)
      trackFormSubmitError(FORM_KEY, "incomplete")
      focusInquiryField(firstErrorKey)
      return
    }

    appendFormspreeOpsMetadata(formData, FORM_KEY)
    trackFormSubmitAttempt("contact")
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
        setMessage("")
        setFieldErrors({})
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
        <div className="inquiry-canvas" data-testid="contact-form-card">
          <div className="space-y-5" aria-live="polite" data-testid="contact-success">
            <span className="flex size-12 items-center justify-center rounded-full border border-border bg-surface">
              <Check className="size-5" aria-hidden="true" />
            </span>
            <div className="space-y-3">
              <h2 className="text-section text-balance">Thanks for reaching out.</h2>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                Your note is in. We respond within one business day with next steps and availability.
              </p>
            </div>
            <Button type="button" variant="outline" className="w-fit" onClick={() => setStatus("idle")}>
              Send another message
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
    <div className="inquiry-canvas" data-testid="contact-form-card">
      <form className="space-y-8" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-6 md:grid-cols-2">
          <InquiryField id="name" label="Name" error={fieldErrors.name}>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              required
              placeholder="Your name"
              className={inquiryControlClassName}
              onChange={() => clearFieldError("name")}
            />
          </InquiryField>
          <InquiryField id="email" label="Email" error={fieldErrors.email}>
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
          id="message"
          label="Message"
          hint="Dates, group size, or the pace you have in mind all help."
          error={fieldErrors.message}
        >
          <Textarea
            id="message"
            name="message"
            rows={7}
            maxLength={MAX_MESSAGE_LENGTH}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value)
              clearFieldError("message")
            }}
            autoComplete="off"
            required
            placeholder="Tell us what you need"
            className={cn(inquiryTextareaClassName, "min-h-[220px]")}
          />
          <p className="form-helper tabular-nums">
            {message.length} of {MAX_MESSAGE_LENGTH} max characters
          </p>
        </InquiryField>

        {status === "error" ? (
          <p className="form-error max-w-xl text-sm leading-6" role="alert" aria-live="polite" data-testid="contact-error">
            Something went wrong. Please try again,{" "}
            <a className="underline underline-offset-4" href={SITE_CONTACTS.gil.telHref}>
              call {SITE_CONTACTS.gil.name} at {SITE_CONTACTS.gil.internationalLabel}
            </a>
            , or email{" "}
            <a className="underline underline-offset-4" href={SITE_INQUIRY_MAILTO}>
              {SITE_INQUIRY_EMAIL}
            </a>
            .
          </p>
        ) : null}

        <div className="flex flex-col gap-5 border-t border-border/70 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="form-helper max-w-md text-sm leading-6">
            We read every note. Ready to hold nights?{" "}
            <a href="/book" className="text-foreground underline underline-offset-4">
              Request a stay
            </a>{" "}
            is faster than a general message.
          </p>
          <Button
            type="submit"
            size="lg"
            className="h-14 w-full px-8 text-base sm:w-auto"
            disabled={status === "sending"}
            data-testid="contact-submit"
          >
            {status === "sending" ? "Sending…" : "Send message"}
            <Send className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </form>
    </div>
  )
}
