import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "Contact Canary Cove | Talk to our team",
  description:
    "Reach out to the Canary Cove team for bookings, questions, or travel help. We reply within one business day.",
}

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              We’d love to hear from you!
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">Reach out and we’ll respond within one business day.</p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <form className="space-y-4 rounded-2xl border border-border/70 bg-white/90 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-2xl border border-border/80 bg-white/95 px-4 py-3 text-foreground shadow-inner shadow-black/5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-2xl border border-border/80 bg-white/95 px-4 py-3 text-foreground shadow-inner shadow-black/5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  maxLength={3000}
                  className="w-full rounded-2xl border border-border/80 bg-white/95 px-4 py-3 text-foreground shadow-inner shadow-black/5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
                />
                <p className="text-xs text-muted-foreground">0 of 3000 max characters</p>
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background"
              >
                Send message
              </button>
            </form>

            <div className="space-y-6 rounded-2xl border border-border/70 bg-white/90 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Other Ways to Get in Touch</p>
                <p className="text-lg font-semibold text-foreground">Gil, Canary Cove Manager</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Phone from Belize</p>
                  <p>610-5121</p>
                  <p className="mt-2 font-medium text-foreground">Phone from Outside Belize</p>
                  <p>011 501-610-5121</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-lg font-semibold text-foreground">Consi, Booking Manager</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Phone from Belize</p>
                  <p>626-7534</p>
                  <p className="mt-2 font-medium text-foreground">Phone from Outside Belize</p>
                  <p>011 501-626-7534</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Canary Cove Location</p>
                <p className="text-sm text-muted-foreground">17′ 59.914 NORTH</p>
                <p className="text-sm text-muted-foreground">87′ 54.901 WEST</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Address</p>
                <p className="text-sm text-muted-foreground">
                  Canary Cove
                  <br />
                  6 1/2 Miles North San Pedro Town,
                  <br />
                  Ambergris Caye Belize
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
