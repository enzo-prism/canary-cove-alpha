import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PhotoCarousel } from "@/components/photo-carousel"
import { BookingForm } from "@/components/booking-form"
import { EMOJI } from "@/lib/emoji"

export const metadata: Metadata = {
  title: "Book Canary Cove | Check availability and request to book",
  description:
    "View live availability and request to book Canary Cove—our private, all-inclusive beachfront estate on Ambergris Caye.",
}

export default function Page() {
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

            <BookingForm className="order-1 lg:order-2" />
          </div>
        </div>
      </section>
      <PhotoCarousel />
      <Footer />
    </main>
  )
}
