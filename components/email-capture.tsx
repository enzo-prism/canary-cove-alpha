"use client"

import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const FORM_ENDPOINT = "https://formspree.io/f/xvzarybk"

export function EmailCapture() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "sending") return

    setStatus("sending")
    const formData = new FormData()
    formData.append("email", email)
    formData.append("source", "Homepage updates signup")

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
        return
      }

      setStatus("error")
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="rounded-[28px] border border-border/70 bg-surface p-6 sm:p-10">
      <div className="flow flow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">Updates</p>
        <h2 className="text-section">Be first to hear about open dates.</h2>
        <p className="text-body text-foreground/80">
          A single email when new availability or seasonal offers open up.
        </p>
      </div>
      <form className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end" onSubmit={handleSubmit} data-testid="email-capture-form">
        <div className="flex-1">
          <Label htmlFor="updates-email" className="sr-only">
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
            className="h-11 flex-1 rounded-full border-border bg-transparent px-4 text-sm"
            data-testid="email-capture-input"
          />
        </div>
        <Button type="submit" size="lg" className="h-11 px-6" disabled={status === "sending"} data-testid="email-capture-submit">
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
