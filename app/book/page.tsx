import { CalendarClock, ShieldCheck, Users } from "lucide-react"

import { BookingForm } from "@/components/booking-form"
import { BookingPolicies } from "@/components/booking-policies"
import { InquiryIntro } from "@/components/forms/inquiry-intro"
import { PageShell } from "@/components/layout/page-shell"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { PhotoCarousel } from "@/components/photo-carousel"
import { TestimonialsGrid } from "@/components/testimonials-grid"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"
import { PAGE_METADATA } from "@/lib/seo"

export const metadata = PAGE_METADATA.book

type BookPageProps = {
  searchParams: Promise<{ accommodation?: string; returning?: string }>
}

export default async function Page({ searchParams }: BookPageProps) {
  const params = await searchParams
  const defaultAccommodation = params.accommodation === "main-house" ? "main-house" : undefined
  const defaultReturningGuest = params.returning === "yes" ? "yes" : undefined

  return (
    <PageShell path="/book" wash>
      <Section padding="tight">
        <Container className="space-y-16 sm:space-y-20">
          <InquiryIntro
            kicker="Request a stay"
            title="Hold dates for your group"
            lede="This is a request, not checkout. Share the nights you want. We confirm availability in person, then send a quote."
            notes={[
              { icon: CalendarClock, label: "Reply within one business day" },
              { icon: Users, label: "One group on property" },
              { icon: ShieldCheck, label: "Courtesy hold after review" },
            ]}
          />

          <BookingForm
            defaultAccommodation={defaultAccommodation}
            defaultReturningGuest={defaultReturningGuest}
          />

          <div className="space-y-10 border-t border-border/70 pt-12">
            <BookingPolicies />
            <section id="comfort-confidence" className="scroll-mt-[calc(var(--site-header-height)+1.5rem)] space-y-5">
              <p className="form-kicker">Comfort &amp; confidence</p>
              <h2 className="text-section">The estate is set up to stay easy.</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {[
                  "Central air conditioning, non-smoking property, indoor/outdoor dining.",
                  "Walled, well-lit compound with onsite staff and discreet security.",
                  "Purified water from onsite desalination and filtration.",
                  "Backup generator and fiber internet for reliable power and streaming.",
                  "Double locking doors, smoke detectors, and in-room safes.",
                  "Private helipad access from Belize's international airport by request.",
                ].map((item) => (
                  <li key={item} className="rounded-2xl border border-border/70 bg-surface px-5 py-4 text-sm leading-6 text-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <div className="space-y-4">
              <h2 className="text-section">Why guests return</h2>
              <TestimonialsGrid testimonials={TESTIMONIAL_SPOTLIGHTS.book} />
            </div>
          </div>
        </Container>
      </Section>
      <PhotoCarousel />
    </PageShell>
  )
}
