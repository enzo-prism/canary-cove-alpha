import { AvailabilityCalendar } from "@/components/availability-calendar"
import { BookingForm } from "@/components/booking-form"
import { BookingPolicies } from "@/components/booking-policies"
import { EstateSummary } from "@/components/book/estate-summary"
import { StayAssurance } from "@/components/book/stay-assurance"
import { Container } from "@/components/layout/container"
import { PageShell } from "@/components/layout/page-shell"
import { PageHero } from "@/components/page-hero"
import { PhotoCarousel } from "@/components/photo-carousel"
import { CtaLink } from "@/components/ui/cta-link"
import { PAGE_METADATA } from "@/lib/seo"

export const metadata = PAGE_METADATA.book

type BookPageProps = {
  searchParams: Promise<{ accommodation?: string; returning?: string }>
}

const KEEP_EXPLORING = [
  { href: "/stay", label: "The villa & spaces" },
  { href: "/rates", label: "Rates by season" },
  { href: "/experiences", label: "Experiences" },
  { href: "/getting-here", label: "Getting here" },
] as const

export default async function Page({ searchParams }: BookPageProps) {
  const params = await searchParams
  const defaultAccommodation = params.accommodation === "main-house" ? "main-house" : undefined
  const defaultReturningGuest = params.returning === "yes" ? "yes" : undefined

  return (
    <PageShell path="/book">
      <PageHero
        variant="plain"
        eyebrow="One group at a time"
        title="Tell us your dates. We’ll take it *from there.*"
        lede="Share your window and the shape of the trip. A person confirms availability and sends a tailored quote, usually within one business day."
        actions={
          <>
            <CtaLink href="#booking-form" size="lg" className="w-full justify-between sm:w-auto sm:justify-center">
              Start your request
            </CtaLink>
            <CtaLink href="#availability" variant="outline" size="lg" arrow="none" className="w-full sm:w-auto">
              See open nights
            </CtaLink>
          </>
        }
        facts={[
          { label: "Villa from", value: "$1,000/night" },
          { label: "Secures your dates", value: "50% deposit" },
          { label: "We reply", value: "1 business day" },
          { label: "Private chef", value: "Included" },
        ]}
        className="pb-12 sm:pb-16 lg:pb-20"
      />

      {/* The request desk: wizard first in reading order (and on phones), sticky estate summary beside it on desktop. */}
      <section
        id="booking-form"
        aria-label="Booking request form"
        className="scroll-mt-[calc(var(--site-header-height)+16px)] pb-8"
      >
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14 xl:gap-20">
            <div id="form" className="order-1 min-w-0 scroll-mt-[calc(var(--site-header-height)+16px)] lg:order-2">
              <BookingForm defaultAccommodation={defaultAccommodation} defaultReturningGuest={defaultReturningGuest} />
            </div>
            <aside
              aria-label="Your stay at a glance"
              className="order-2 min-w-0 lg:sticky lg:top-[calc(var(--site-header-height)+24px)] lg:order-1 lg:self-start"
            >
              <EstateSummary />
            </aside>
          </div>
        </Container>
      </section>

      <AvailabilityCalendar />

      <StayAssurance />

      <BookingPolicies />

      <PhotoCarousel />

      <nav aria-label="Keep exploring" className="pb-24 sm:pb-32">
        <Container size="wide">
          <div className="flex flex-col gap-6 border-t border-border/80 pt-10 lg:flex-row lg:items-center lg:justify-between">
            <p className="font-display text-[2rem] leading-none text-foreground">Still exploring?</p>
            <ul className="flex flex-wrap gap-x-8 gap-y-2">
              {KEEP_EXPLORING.map((link) => (
                <li key={link.href}>
                  <CtaLink href={link.href} variant="text">
                    {link.label}
                  </CtaLink>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </nav>
    </PageShell>
  )
}
