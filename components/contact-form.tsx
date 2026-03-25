"use client"

import { useState, type FormEvent } from "react"

import { trackFormSubmitAttempt, trackFormSubmitError, trackFormSubmitSuccess } from "@/lib/analytics"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const FORM_ENDPOINT = "https://formspree.io/f/xvzarybk"
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
        trackFormSubmitSuccess("contact")
        return
      }

      setStatus("error")
      trackFormSubmitError("contact", "response")
    } catch (error) {
      setStatus("error")
      trackFormSubmitError("contact", "network")
    }
  }

  return (
    <Card className="rounded-[28px] border border-border/70 bg-surface" data-testid="contact-form-card">
      <CardContent className="p-6">
        {status === "success" ? (
          <div className="flow flow-sm" aria-live="polite" data-testid="contact-success">
            <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">Message sent</p>
            <h2 className="text-section">Thanks for reaching out.</h2>
            <p className="text-body text-foreground/80">
              Your note is in. We respond within one business day with next steps and availability.
            </p>
            <Button type="button" variant="outline" className="w-fit" onClick={() => setStatus("idle")}>
              Send another message
            </Button>
          </div>
        ) : (
          <form className="flow flow-md" onSubmit={handleSubmit}>
            <div className="flow flow-xs">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                required
                autoComplete="name"
                placeholder="Alex Martin…"
                className="h-12 rounded-2xl border-border bg-transparent px-4"
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
                className="h-12 rounded-2xl border-border bg-transparent px-4"
              />
            </div>
            <div className="flow flow-xs">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={6}
                maxLength={MAX_MESSAGE_LENGTH}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Tell us about your dates, questions, or plans…"
                className="rounded-2xl border-border bg-transparent px-4 py-3"
              />
              <p className="text-xs text-muted-foreground">
                {message.length} of {MAX_MESSAGE_LENGTH} max characters
              </p>
            </div>
            {status === "error" ? (
              <p className="text-sm text-destructive" role="alert" data-testid="contact-error">
                Something went wrong. Please try again or email us directly.
              </p>
            ) : null}
            <Button type="submit" size="lg" className="w-full" disabled={status === "sending"} data-testid="contact-submit">
              {status === "sending" ? "Sending…" : "Send message"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
