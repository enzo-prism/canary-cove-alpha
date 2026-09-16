import { Clock3, Mail, MessageCircle } from "lucide-react"

import { ContactChannels } from "@/components/forms/contact-channels"
import { ContactDetails } from "@/components/contact-details"
import { ContactForm } from "@/components/contact-form"
import { InquiryIntro } from "@/components/forms/inquiry-intro"
import { Container } from "@/components/layout/container"
import { PageShell } from "@/components/layout/page-shell"
import { Section } from "@/components/layout/section"
import { TestimonialsGrid } from "@/components/testimonials-grid"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"
import { PAGE_METADATA } from "@/lib/seo"

export const metadata = PAGE_METADATA.contact

export default function Page() {
  return (
    <PageShell path="/contact" wash>
      <Section padding="tight">
        <Container className="space-y-16 sm:space-y-20">
          <InquiryIntro
            kicker="Write to us"
            title="Ask about the stay"
            lede="A note, a call, or an email. We reply within one business day — and you can reach us directly if the form is not the right path."
            notes={[
              { icon: Clock3, label: "Reply within one business day" },
              { icon: MessageCircle, label: "A real note, not an empty send" },
              { icon: Mail, label: "Phone and email stay available" },
            ]}
          />

          <div className="mx-auto w-full max-w-3xl space-y-12">
            <ContactChannels />
            <ContactForm />
          </div>
          <ContactDetails />

          <div className="space-y-4 border-t border-border/70 pt-12">
            <div className="space-y-2">
              <h2 className="text-section">Guests on our team</h2>
              <p className="text-body max-w-2xl">A few notes about the people who make every stay feel effortless.</p>
            </div>
            <TestimonialsGrid testimonials={TESTIMONIAL_SPOTLIGHTS.contact} />
          </div>
        </Container>
      </Section>
    </PageShell>
  )
}
