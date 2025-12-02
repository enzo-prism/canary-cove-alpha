"use client"

import type { FormEvent } from "react"
import type { Metadata } from "next"
import { Calendar, Clock3, Send, Sparkles } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PhotoCarousel } from "@/components/photo-carousel"
import { Button } from "@/components/ui/button"
import { EMOJI } from "@/lib/emoji"

const stayDetails = [
  { label: "Sleeps", value: "Up to 10 guests across suites & villa" },
  { label: "Arrival", value: "Flexible; private dock & airport transfers" },
  { label: "Minimum stay", value: "4 nights (peak), 3 nights (shoulder)" },
]

export const metadata: Metadata = {
  title: "Book Canary Cove | Check availability and request to book",
  description:
    "View live availability and request to book Canary Cove—our private, all-inclusive beachfront estate on Ambergris Caye.",
}

export default function Page() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <main className="min-h-screen">
      <Header />
      <section className="relative overflow-hidden px-4 pb-20 pt-14 sm:pb-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface/80 via-white to-surface-muted/60" />
        <div className="absolute left-[12%] top-[18%] -z-10 h-64 w-64 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-[8%] bottom-[18%] -z-10 h-72 w-72 rounded-full bg-primary/5 blur-[140px]" />

        <div className="mx-auto flex max-w-6xl flex-col gap-10">

          <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="order-2 space-y-8 lg:order-1">
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  Availability & holds {EMOJI.book}
                </h1>
                <p className="text-lg text-muted-foreground sm:text-xl">
                  Check dates in the live calendar, then share your trip details so we can confirm or place a courtesy hold.
                </p>
              </div>

              <div className="rounded-[28px] border border-border/80 bg-white/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
                <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-3">
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                    Live availability {EMOJI.book}
                  </p>
                </div>
                <div className="overflow-hidden rounded-2xl border border-border/70 bg-white">
                  <iframe
                    height="280"
                    title="Bookingmood widget"
                    src="https://www.bookingmood.com/embed/939b7bb6-8e48-4256-a7af-0ec62e4a4d68"
                    style={{ width: "100%", border: "none" }}
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="space-y-4 rounded-3xl border border-border/70 bg-white/90 p-5 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
                <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
                  Payment & policies {EMOJI.rates}
                </p>
                <div className="space-y-2">
                  <p className="text-base font-semibold text-foreground">Payment Terms</p>
                  <p className="text-sm text-muted-foreground">
                    50% down, balance due 45 business days prior to arrival.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-base font-semibold text-foreground">Cancellation Policy</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      Cancellations must be made in writing. If a guest cancellation is made more than 60 business days
                      before the scheduled guest arrival date, a full (100%) refund less a 10% administrative fee will
                      be given.
                    </li>
                    <li>
                      If a guest cancellation is made less than 60 business days before the scheduled guest arrival date
                      but more than 45 business days before the scheduled guest arrival date 50% of the total amount
                      deposited will be refunded.
                    </li>
                    <li>
                      If a guest cancellation is made less than 45 business days before the scheduled guest arrival
                      date, NO refund of any deposit will be given and the full deposit will be forfeited (includes
                      early check-outs or no-shows).
                    </li>
                    <li>
                      The balance is due 45 business days prior to check-in or your special event. Any amounts accrued
                      during your stay will be charged upon your departure.
                    </li>
                    <li>
                      Note: NO REFUNDS OF DEPOSITS WILL BE GIVEN for cancellations of reservations for the dates of
                      December 16th-January 7th once your reservation has been confirmed.
                    </li>
                    <li>Business days are considered any day of the week Monday to Friday.</li>
                    <li>
                      We strongly recommend full coverage travel insurance in the event of delays / cancellations,
                      weather, health, family, personal issues, etc.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <form
              className="frosted-panel relative order-1 space-y-6 rounded-[32px] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)] lg:order-2"
              onSubmit={handleSubmit}
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  <Send className="h-4 w-4" />
                  Request to book {EMOJI.book}
                </div>
                <p className="text-2xl font-semibold text-foreground">Tell us about your stay.</p>
                <p className="text-sm text-muted-foreground">
                  Share your preferred dates and any celebrations. Our team will confirm availability and send a tailored quote. {EMOJI.concierge}
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
          </div>
        </div>
      </section>

      <PhotoCarousel />
      <Footer />
    </main>
  )
}
