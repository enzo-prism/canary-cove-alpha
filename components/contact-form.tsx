"use client"

import { useState, type FormEvent } from "react"

import { trackFormSubmitAttempt, trackFormSubmitError, trackFormSubmitSuccess, trackLeadConversion } from "@/lib/analytics"
import { appendFormspreeOpsMetadata } from "@/lib/formspree-ops"
import { LEAD_FORM_CONFIG } from "@/lib/lead-forms"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const FORM_ENDPOINT = "/api/forms"
const FORM_KEY = "contact"
const MAX_MESSAGE_LENGTH = 3000

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "sending") return

    trackFormSubmitAttempt("contact")
    setStatus("sending")
    const form = event.currentTarget
    const formData = new FormData(form)
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
        form.reset()
        setMessage("")
        setStatus("success")
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

  return (
    <Card className="form-shell h-fit rounded-[32px]" data-testid="contact-form-card">
      <CardContent className="p-6 sm:p-7">
        {status === "success" ? (
          <div className="flow flow-sm" aria-live="polite" data-testid="contact-success">
            <h2 className="text-section text-balance">Thanks for reaching out.</h2>
            <p className="text-body text-foreground/80">
              Your note is in. We respond within one business day with next steps and availability.
            </p>
            <Button type="button" variant="outline" className="w-fit" onClick={() => setStatus("idle")}>
              Send another message
            </Button>
          </div>
        ) : (
          <form className="flow flow-md" onSubmit={handleSubmit}>
            <div className="flow flow-sm">
              <h2 className="text-section text-balance">Ask about dates, logistics, or the stay itself.</h2>
              <p className="text-body max-w-xl text-foreground/80">
                If you already know your travel window, include it below and we&apos;ll point you to the fastest next step.
              </p>
            </div>

            <div className="form-section grid gap-4 md:grid-cols-2">
              <div className="flow flow-xs">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Alex Martin…"
                  className="min-h-12 rounded-[20px] border-border/80 bg-background/80 px-4"
                />
              </div>
              <div className="flow flow-xs">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  spellCheck={false}
                  inputMode="email"
                  placeholder="alex@example.com…"
                  className="min-h-12 rounded-[20px] border-border/80 bg-background/80 px-4"
                />
              </div>
              <div className="flow flow-xs md:col-span-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={6}
                  maxLength={MAX_MESSAGE_LENGTH}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  autoComplete="off"
                  placeholder="Tell us about your dates, questions, or plans…"
                  className="min-h-[180px] rounded-[24px] border-border/80 bg-background/80 px-4 py-3"
                />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="form-helper">Helpful context: travel dates, group size, or the pace you have in mind.</p>
                  <p className="form-helper tabular-nums">
                    {message.length} of {MAX_MESSAGE_LENGTH} max characters
                  </p>
                </div>
              </div>
            </div>

            {status === "error" ? (
              <p className="form-error" role="alert" aria-live="polite" data-testid="contact-error">
                Something went wrong. Please try again or email us directly.
              </p>
            ) : null}
            <div className="flex flex-col gap-3 border-t border-border/60 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="form-helper max-w-md">
                We read every note directly. If you&apos;re already ready to book, the booking page will get you to a quote faster.
              </p>
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={status === "sending"} data-testid="contact-submit">
                {status === "sending" ? "Sending…" : "Send Message"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
