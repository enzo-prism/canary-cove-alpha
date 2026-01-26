import type { Metadata } from "next"

import { ContactDetails } from "@/components/contact-details"
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"
import { TestimonialsGrid } from "@/components/testimonials-grid"

export const metadata: Metadata = {
  title: "Contact Canary Cove | Call, Message, or Send a Request",
  description:
    "Reach our team by phone or contact form for bookings, questions, and travel planning support.",
}

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-5xl xl:max-w-6xl space-y-12">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              We’d love to hear from you!
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">Reach out and we’ll respond within one business day.</p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <ContactForm />
            <ContactDetails />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Guests on our team</h2>
              <p className="text-base text-muted-foreground">
                A few notes about the people who make every stay feel effortless.
              </p>
            </div>
            <TestimonialsGrid testimonials={TESTIMONIAL_SPOTLIGHTS.contact} />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
