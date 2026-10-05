import { ContactDetails } from "@/components/contact-details"
import { ContactForm } from "@/components/contact-form"
import { ProcessLine, PullQuote } from "@/components/conversion-sections"
import { Container } from "@/components/layout/container"
import { PageShell } from "@/components/layout/page-shell"
import { PageHero } from "@/components/page-hero"
import { SectionHeading } from "@/components/section-heading"
import { CtaLink } from "@/components/ui/cta-link"
import { IMAGES } from "@/lib/images"
import { PAGE_METADATA } from "@/lib/seo"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"

export const metadata = PAGE_METADATA.contact

const CONTACT_QUOTE = TESTIMONIAL_SPOTLIGHTS.contact[0]

export default function Page() {
  return (
    <PageShell path="/contact">
      <PageHero
        variant="split"
        eyebrow="Contact"
        title="Ask us *anything.*"
        lede="Dates, boats, chefs, logistics — a person reads every note and points you to the fastest next step."
        actions={
          <>
            <CtaLink href="#contact-form" size="lg" className="w-full justify-between sm:w-auto sm:justify-center">
              Write to us
            </CtaLink>
            <CtaLink
              href="/book"
              variant="outline"
              size="lg"
              className="w-full justify-between sm:w-auto sm:justify-center"
            >
              Ready to book
            </CtaLink>
          </>
        }
        facts={[
          { label: "We reply", value: "1 business day" },
          { label: "Calling hours", value: "8am–5pm" },
          { label: "Time zone", value: "UTC−6" },
          { label: "Who answers", value: "Gil & Consi" },
        ]}
        image={{ src: IMAGES.heroBackgroundPool.src, alt: IMAGES.heroBackgroundPool.alt, focal: { x: 55, y: 50 } }}
        imageClassName="aspect-[4/3] lg:aspect-[4/5]"
      />

      {/* Letter + people: the form leads, the direct lines sit beside it. */}
      <section
        id="contact-form"
        aria-label="Contact form"
        className="[--anchor-extra:16px] pb-20 sm:pb-28"
      >
        <Container size="wide">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-12 xl:gap-16">
            <div className="min-w-0">
              <ContactForm />
            </div>
            <aside
              aria-label="Direct lines"
              className="min-w-0 lg:sticky lg:top-[calc(var(--site-header-height)+24px)] lg:self-start"
            >
              <ContactDetails />
            </aside>
          </div>
        </Container>
      </section>

      <section aria-label="What happens next" className="bg-surface py-20 sm:py-28">
        <Container size="wide">
          <SectionHeading
            eyebrow="What happens next"
            title="From a note to the *dock.*"
            lede="Tip: check spam for anything from Canary Cove and add us to your contacts so the reply lands."
            align="split"
          />
          <ProcessLine
            className="mt-14 sm:mt-20"
            steps={[
              { title: "You write", text: "Two short steps, under a minute." },
              { title: "We reply", text: "Gil or Consi, within one business day." },
              { title: "You move fast", text: "Stays graduate to a booking request." },
            ]}
          />
        </Container>
      </section>

      <section aria-label="Guest quote" className="py-24 sm:py-32">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:items-end lg:gap-20">
            <PullQuote quote={CONTACT_QUOTE.quote} author={CONTACT_QUOTE.author} />
            <div data-reveal="up" className="flow flow-md border-t border-border/80 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <p className="text-body">Already know your dates? Skip the back-and-forth and send a booking request.</p>
              <CtaLink href="/book" size="lg">
                Request to book
              </CtaLink>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  )
}
