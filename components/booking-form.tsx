"use client"

import type { FormEvent } from "react"

import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EMOJI } from "@/lib/emoji"
import { cn } from "@/lib/utils"

type BookingFormProps = {
  className?: string
}

export function BookingForm({ className }: BookingFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <form
      className={cn(
        "frosted-panel relative space-y-6 rounded-[32px] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)]",
        className,
      )}
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          <Send className="h-4 w-4" />
          Request to book {EMOJI.book}
        </div>
        <p className="text-2xl font-semibold text-foreground">Tell us about your stay.</p>
        <p className="text-sm text-muted-foreground">
          Share your preferred dates and any celebrations. Our team will confirm availability and send a tailored quote.{" "}
          {EMOJI.concierge}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium text-foreground">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            placeholder="Alexandra"
            className="w-full rounded-2xl border border-border/80 bg-white/90 px-4 py-3 text-foreground shadow-inner shadow-primary/5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium text-foreground">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            required
            placeholder="Martin"
            className="w-full rounded-2xl border border-border/80 bg-white/90 px-4 py-3 text-foreground shadow-inner shadow-primary/5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            required
            placeholder="+1 (242) 555-0123"
            className="w-full rounded-2xl border border-border/80 bg-white/90 px-4 py-3 text-foreground shadow-inner shadow-primary/5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-border/80 bg-white/90 px-4 py-3 text-foreground shadow-inner shadow-primary/5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmEmail" className="text-sm font-medium text-foreground">
          Confirm Email Address
        </label>
        <input
          id="confirmEmail"
          name="confirmEmail"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-2xl border border-border/80 bg-white/90 px-4 py-3 text-foreground shadow-inner shadow-primary/5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="arrival" className="text-sm font-medium text-foreground">
            Preferred Arrival Date
          </label>
          <input
            id="arrival"
            name="arrival"
            type="date"
            className="w-full rounded-2xl border border-border/80 bg-white/90 px-4 py-3 text-foreground shadow-inner shadow-primary/5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="departure" className="text-sm font-medium text-foreground">
            Preferred Departure Date
          </label>
          <input
            id="departure"
            name="departure"
            type="date"
            className="w-full rounded-2xl border border-border/80 bg-white/90 px-4 py-3 text-foreground shadow-inner shadow-primary/5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="adultGuests" className="text-sm font-medium text-foreground">
            Number of Adult Guests
          </label>
          <input
            id="adultGuests"
            name="adultGuests"
            type="number"
            min={1}
            inputMode="numeric"
            placeholder="4 adults"
            className="w-full rounded-2xl border border-border/80 bg-white/90 px-4 py-3 text-foreground shadow-inner shadow-primary/5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="childGuests" className="text-sm font-medium text-foreground">
            Number of Child Guests (under 21) and Age of Each
          </label>
          <input
            id="childGuests"
            name="childGuests"
            placeholder="2 children, ages 8 and 10"
            className="w-full rounded-2xl border border-border/80 bg-white/90 px-4 py-3 text-foreground shadow-inner shadow-primary/5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="requests" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="requests"
          name="requests"
          rows={5}
          required
          placeholder="Please write a detailed message to us!"
          className="w-full rounded-2xl border border-border/80 bg-white/90 px-4 py-3 text-foreground shadow-inner shadow-primary/5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="referral" className="text-sm font-medium text-foreground">
          How did you hear about Canary Cove?
        </label>
        <select
          id="referral"
          name="referral"
          className="w-full rounded-2xl border border-border/80 bg-white/90 px-4 py-3 text-foreground shadow-inner shadow-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
          defaultValue=""
          required
        >
          <option value="" disabled>
            How did you hear about Canary Cove?
          </option>
          <option value="google">Google</option>
          <option value="other-search">Other search engine</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" className="w-full sm:w-auto focus-ring">
          Send booking request
          <Send className="h-4 w-4" />
        </Button>
        <p className="text-xs text-muted-foreground">
          We only host one group at a time. Sending this form places a tentative hold while we confirm details.
        </p>
      </div>
    </form>
  )
}
