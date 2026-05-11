"use client"

import { useState, type FormEvent } from "react"

import { trackFormSubmitAttempt, trackFormSubmitError, trackFormSubmitSuccess, trackLeadConversion } from "@/lib/analytics"
import { appendFormspreeOpsMetadata } from "@/lib/formspree-ops"
import { LEAD_FORM_CONFIG } from "@/lib/lead-forms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const FORM_ENDPOINT = "/api/forms"
const FORM_KEY = "email_capture"

export function EmailCapture() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "sending") return

    trackFormSubmitAttempt(FORM_KEY)
    setStatus("sending")
    const formData = new FormData()
    formData.append("email", email)
    formData.append("source", "Homepage updates signup")
    appendFormspreeOpsMetadata(formData, FORM_KEY)

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        setEmail("")
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

  return (
    <div className="form-shell px-6 py-6 sm:px-8 sm:py-8" data-testid="email-capture-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flow flow-sm">
          <p className="form-kicker">Updates</p>
          <h2 className="text-section text-balance">Be first to hear about open dates.</h2>
          <p className="text-body max-w-xl text-foreground/80">
            A single email when availability shifts, seasonal offers open up, or a better-fit date window appears.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="form-meta">Low-volume</span>
          <span className="form-meta">Availability only</span>
        </div>
      </div>
      <form
        className="form-section mt-6 flex flex-col gap-4 sm:flex-row sm:items-end"
        onSubmit={handleSubmit}
        data-testid="email-capture-form"
      >
        <div className="flex-1">
          <Label htmlFor="updates-email" className="text-sm font-medium text-foreground">
            Email address
          </Label>
          <Input
            id="updates-email"
            type="email"
            name="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            spellCheck={false}
            inputMode="email"
            placeholder="Email address…"
            aria-describedby="updates-email-note email-capture-status"
            className="mt-2 min-h-12 flex-1 rounded-[20px] border-border/80 bg-background/80 px-4"
            data-testid="email-capture-input"
          />
          <p id="updates-email-note" className="form-helper mt-2">
            We only email when there is something worth acting on.
          </p>
        </div>
        <Button
          type="submit"
          size="lg"
          className="min-h-12 px-6 sm:self-end"
          disabled={status === "sending"}
          data-testid="email-capture-submit"
        >
          {status === "sending" ? "Joining…" : "Join the list"}
        </Button>
      </form>
      <div className="mt-3 min-h-[1.25rem]" aria-live="polite" data-testid="email-capture-status">
        {status === "success" ? (
          <p className="text-xs uppercase tracking-[0.2em] text-foreground">
            You&apos;re on the list. We&apos;ll only email for openings and seasonal updates.
          </p>
        ) : status === "error" ? (
          <p className="text-xs uppercase tracking-[0.2em] text-destructive">
            We couldn&apos;t save that email. Please try again.
          </p>
        ) : (
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            No noise. Only availability and new experiences.
          </p>
        )}
      </div>
    </div>
  )
}
