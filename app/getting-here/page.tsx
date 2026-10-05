import type { CSSProperties } from "react"
import { Handshake, Plane, PlaneLanding, Sailboat } from "lucide-react"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { Footer } from "@/components/footer"
import { ArrivalJourney, type JourneyStep } from "@/components/getting-here/arrival-journey"
import { ArrivalSnapshots } from "@/components/getting-here/arrival-snapshots"
import { Header } from "@/components/header"
import { Container } from "@/components/layout/container"
import { ScrollWordReveal } from "@/components/motion/scroll-word-reveal"
import { PageHero } from "@/components/page-hero"
import { SectionHeading } from "@/components/section-heading"
import { PageStructuredData } from "@/components/structured-data"
import { TestimonialsGrid } from "@/components/testimonials-grid"
import { CtaLink } from "@/components/ui/cta-link"
import { IMAGES } from "@/lib/images"
import { PAGE_METADATA } from "@/lib/seo"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"

export const metadata = PAGE_METADATA.gettingHere

const DIGITAL_FORMS_URL = "https://ideclare.gov.bz/Belize_Digital_Forms/"

const STEPS: JourneyStep[] = [
  {
    title: "Clear customs & immigration",
    meta: "BZE · Belize City",
    icon: <PlaneLanding />,
    detail: (
      <p>
        Use the{" "}
        <TrackedLink
          href={DIGITAL_FORMS_URL}
          eventName="outbound_click"
          eventPayload={{ location: "getting_here_steps", target: "belize_digital_forms" }}
          className="focus-ring link-underline-static rounded-sm font-medium text-foreground"
        >
          Belize digital forms
        </TrackedLink>{" "}
        (ideclare.gov.bz). On the form, list BELIZE as the destination country and SAN PEDRO as where you are staying.
      </p>
    ),
  },
  {
    title: "Hop on a commuter flight",
    meta: "Maya Island Air or Tropic Air · 15 min",
    icon: <Plane />,
    detail: (
      <p>
        After baggage claim, head to Maya Island Air or Tropic Air. Our staff books this for you. It’s a 15-minute
        flight to Ambergris Caye, landing in San Pedro.
      </p>
    ),
  },
  {
    title: "Meet our team in San Pedro",
    meta: "San Pedro · 5–10 min to the dock",
    icon: <Handshake />,
    detail: (
      <p>
        Our staff meets you at the San Pedro airport. The boat dock is a 10-minute walk or a 5-minute taxi ride away.
      </p>
    ),
  },
  {
    title: "Boat to Canary Cove",
    meta: "About 6 miles north · 15 min",
    icon: <Sailboat />,
    detail: (
      <p>
        Board our boat for a 15-minute ride about 6 miles north to the compound. Your bags come with you; we handle the
        rest.
      </p>
    ),
  },
]

const TIMING = [
  { leg: "Commuter flight to San Pedro", time: "15 min" },
  { leg: "Airport to the dock", time: "10-min walk · 5-min taxi" },
  { leg: "Boat ride north", time: "15 min" },
] as const

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties

function ArrivalCard() {
  return (
    <div
      data-reveal="up"
      className="relative flex flex-col overflow-hidden rounded-[var(--radius-media)] bg-background shadow-[var(--shadow-soft)] ring-1 ring-border/70 sm:flex-row"
    >
      <div className="flow flow-lg flex-1 p-6 sm:p-8 lg:p-10">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Belize digital forms
          </p>
          <span aria-hidden="true" className="size-2 rounded-full bg-canary" />
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
          <div className="flow flow-xs">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Destination country
            </dt>
            <dd className="whitespace-nowrap font-display text-[clamp(1.6rem,7vw,2.25rem)] leading-none text-foreground lg:text-[2.6rem]">BELIZE</dd>
          </div>
          <div className="flow flow-xs">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Staying in</dt>
            <dd className="whitespace-nowrap font-display text-[clamp(1.6rem,7vw,2.25rem)] leading-none text-foreground lg:text-[2.6rem]">SAN PEDRO</dd>
          </div>
          <div className="col-span-2 flow flow-xs">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Flights</dt>
            <dd className="text-[17px] text-foreground">Maya Island Air or Tropic Air</dd>
          </div>
        </dl>
        <div>
          <CtaLink
            href={DIGITAL_FORMS_URL}
            arrow="diag"
            eventName="outbound_click"
            eventPayload={{ location: "getting_here", target: "belize_digital_forms" }}
          >
            Fill Belize digital forms
          </CtaLink>
        </div>
      </div>

      {/* Perforated stub */}
      <div className="relative flex items-center justify-between gap-4 border-t-2 border-dashed border-border bg-sand-deep/60 px-6 py-5 sm:w-36 sm:flex-col sm:justify-center sm:border-l-2 sm:border-t-0 sm:px-4 sm:py-8">
        <span aria-hidden="true" className="absolute -left-3 -top-3 size-6 rounded-full bg-surface" />
        <span aria-hidden="true" className="absolute -right-3 -top-3 size-6 rounded-full bg-surface sm:-bottom-3 sm:-left-3 sm:right-auto sm:top-auto" />
        <p className="font-display text-3xl leading-none text-foreground">BZE</p>
        <Plane aria-hidden="true" className="size-4 text-lagoon sm:rotate-90" />
        <p className="text-center text-[11px] font-semibold uppercase leading-snug tracking-[0.2em] text-muted-foreground">
          San Pedro
        </p>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <>
      <Header />
      <main tabIndex={-1} id="main-content" className="min-h-screen bg-background outline-none">
      <PageStructuredData path="/getting-here" />

      <PageHero
        eyebrow="Travel made easy"
        title="Getting to *Canary Cove*"
        lede="A simple, guided journey: customs, a short hop to San Pedro, and a quick boat ride to Canary Cove."
        actions={
          <>
            <CtaLink href="#arrival-steps" size="lg" className="w-full justify-between sm:w-auto sm:justify-center">
              See the route
            </CtaLink>
            <CtaLink
              href={DIGITAL_FORMS_URL}
              variant="outline"
              size="lg"
              arrow="diag"
              className="w-full justify-between sm:w-auto sm:justify-center"
              eventName="outbound_click"
              eventPayload={{ location: "getting_here_hero", target: "belize_digital_forms" }}
            >
              Belize digital forms
            </CtaLink>
          </>
        }
        facts={[
          { label: "Commuter flight", value: "15 min" },
          { label: "Airport to dock", value: "5–10 min" },
          { label: "Boat ride north", value: "15 min" },
          { label: "Boat transfers", value: "Complimentary" },
        ]}
        image={{ src: IMAGES.heroBackgroundLawn.src, alt: IMAGES.heroBackgroundLawn.alt, focal: { x: 50, y: 32 } }}
      />

      {/* ── The route ────────────────────────────────────────────────── */}
      <section id="arrival-steps" className="scroll-mt-24 border-t border-border/70 py-20 sm:py-28 lg:py-32">
        <Container size="wide">
          <div className="flow flow-xl">
            <SectionHeading
              titleClassName="text-section"
              eyebrow="The route"
              title="Four *easy* legs, airport to dock."
              align="split"
              lede="Land at BZE, hop to San Pedro, and step onto our boat. Our team handles the bookings and meets you along the way."
            />
            <ArrivalJourney steps={STEPS} />
          </div>
        </Container>
      </section>

      {/* ── Before you fly ───────────────────────────────────────────── */}
      <section className="bg-surface py-20 sm:py-28 lg:py-32">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
            <div className="flow flow-xl">
              <SectionHeading
                titleClassName="text-section"
                eyebrow="Before you fly"
                title="Three answers for the *arrival* form."
                lede="Fill in the Belize digital forms before you land. These are the details guests ask about most."
              />
              <ArrivalCard />
            </div>

            <div className="flow flow-xl lg:pt-6">
              <div data-reveal="up" className="flow flow-md">
                <p className="eyebrow">Timing</p>
                <dl className="border-t border-ink/70">
                  {TIMING.map((row) => (
                    <div
                      key={row.leg}
                      className="flex items-baseline justify-between gap-6 border-b border-border/80 py-4"
                    >
                      <dt className="text-[15px] text-foreground/80 sm:text-base">{row.leg}</dt>
                      <dd className="text-right font-display text-xl leading-tight text-foreground sm:text-2xl">
                        {row.time}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div data-reveal="up" style={delay(120)} className="flow flow-md">
                <p className="eyebrow">We handle</p>
                <p className="text-body">
                  Local flight bookings, complimentary airport pickup and drop-off, and luggage on the boat to the
                  estate. We welcome you at the dock with tropical drinks.
                </p>
              </div>

              <div data-reveal="up" style={delay(200)} className="flow flow-md">
                <p className="eyebrow">On-site transport</p>
                <p className="text-body">
                  Private helipad available with advance notice, including direct access from Belize&apos;s
                  international airport by request. Golf cart ready for town runs.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Arrival impressions (reef band) ──────────────────────────── */}
      <section className="surface-reef relative overflow-hidden py-20 sm:py-28 lg:py-36">
        <Container size="wide">
          <div className="flow flow-xl">
            <ScrollWordReveal
              text="From the airstrip to the dock, *we carry it* — flights booked, bags on the boat, tropical drinks waiting."
              className="max-w-[22ch] font-display text-[2.4rem] leading-[1.02] text-white sm:text-6xl lg:text-7xl"
            />
            <div className="grid gap-10 border-t border-white/15 pt-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] lg:gap-16">
              <SectionHeading
                titleClassName="text-title"
                eyebrow="Arrival impressions"
                title="The *welcome* ride."
                tone="light"
                size="title"
                lede="Guests often mention the welcome ride and the dock greeting as part of the Canary Cove magic."
              />
              <TestimonialsGrid testimonials={TESTIMONIAL_SPOTLIGHTS.gettingHere} tone="light" />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Getting around ───────────────────────────────────────────── */}
      <section id="getting-around" className="scroll-mt-24 py-20 sm:py-28 lg:py-32">
        <Container size="wide">
          <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <div className="flow flow-xl lg:sticky lg:top-[calc(var(--site-header-height)+2rem)]">
              <SectionHeading
                titleClassName="text-section"
                eyebrow="On the island"
                title="Getting *around*"
                lede="Canary Cove sits about 6.5 miles north of San Pedro and is accessed primarily by boat."
              />
              <div data-reveal="up" className="flow flow-md">
                <p className="text-body max-w-xl">
                  Arrival and departure boat transfers are complimentary. For trips into town, we can run our 30-foot
                  boat ($75 round-trip) or arrange private charters ($100/hr + gas). Golf carts are available—ask about
                  current policies and rates. Prefer to skip the commuter flight? We can help arrange a direct boat
                  transfer from Belize City.
                </p>
                <div>
                  <CtaLink
                    href="/rates#boat-services"
                    variant="text"
                    eventName="cta_click"
                    eventPayload={{ location: "getting_here_around", target: "/rates#boat-services" }}
                  >
                    Boat & cart rates
                  </CtaLink>
                </div>
              </div>
            </div>

            <div className="flow flow-md">
              <h3 data-reveal="fade" className="eyebrow">
                Arrival snapshots
              </h3>
              <ArrivalSnapshots
                items={[
                  { ...IMAGES.sanPedroWelcome, caption: "Arrival in San Pedro" },
                  { ...IMAGES.helipad, caption: "Helipad" },
                ]}
              />
            </div>
          </div>
        </Container>
      </section>

    </main>
      <Footer cta />
    </>
  )
}
