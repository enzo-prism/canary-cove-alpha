import { ArrowRight, ArrowUpRight } from "lucide-react"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { StayAmenities } from "@/components/stay-amenities"
import { StayClosingCta } from "@/components/stay-closing-cta"
import { StayGuestExperience } from "@/components/stay-guest-experience"
import { StayMiniGallery } from "@/components/stay-mini-gallery"
import { StayOutdoorGallery } from "@/components/stay-outdoor-gallery"
import { StayVillaGallery } from "@/components/stay-villa-gallery"
import { PageStructuredData } from "@/components/structured-data"
import { Button } from "@/components/ui/button"
import { PAGE_METADATA } from "@/lib/seo"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"

export const metadata = PAGE_METADATA.stay

const STAY_ANCHORS = [
  { label: "Inside the villa", href: "#inside-the-villa" },
  { label: "Outside", href: "#outside-the-villa" },
  { label: "Included", href: "#amenities" },
  { label: "Guest notes", href: "#guest-experience" },
] as const

function StayGlance() {
  const rows = [
    { label: "The villa · 3 king suites", value: "Sleeps up to 10" },
    { label: "Meals", value: "Chef-led, served daily" },
    { label: "Waterfront", value: "2 docks, boats on site" },
    { label: "Booking", value: "One booking at a time" },
  ] as const

  return (
    <dl className="border-t border-border/60">
      {rows.map((row) => (
        <div key={row.label} className="flex items-baseline justify-between gap-6 border-b border-border/60 py-3.5">
          <dt className="text-[0.95rem] font-medium text-foreground/80">{row.label}</dt>
          <dd className="shrink-0 text-right text-[0.95rem] font-semibold tabular-nums text-foreground">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function Page() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background outline-none">
      <PageStructuredData path="/stay" />
      <Header />

      <Section padding="tight" className="overflow-hidden">
        <Container size="wide">
          <div className="flow flow-md mx-auto max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
              Stay · Ambergris Caye
            </p>
            <h1 className="text-balance text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-[3.9rem]">
              One estate. Your group. Nothing shared.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-foreground/72 sm:text-lg sm:leading-8">
              Three king suites, a pool deck made for all-day lounging, two docks with boats on site, and a chef-led
              table — one private booking at a time.
            </p>
            <p className="max-w-2xl text-[0.95rem] leading-7 text-foreground/72">
              The villa sleeps up to 10 across its suites. Returning groups can take the{" "}
              <a
                href="#main-house-stay"
                className="rounded-sm font-medium whitespace-nowrap text-foreground underline underline-offset-4 transition-colors hover:text-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                5-suite Main House
              </a>{" "}
              instead.
            </p>
            <StayGlance />
            <div className="flex flex-col gap-5 pt-1">
              <Button asChild size="lg" className="w-full sm:w-fit">
                <TrackedLink
                  href="/book"
                  eventName="cta_click"
                  eventPayload={{ location: "stay_hero_book", target: "/book" }}
                >
                  Check dates
                  <ArrowUpRight className="size-4" />
                </TrackedLink>
              </Button>
              <nav aria-label="On this page" className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
                {STAY_ANCHORS.map((anchor, index) => (
                  <span key={anchor.href} className="flex items-center gap-2">
                    {index > 0 ? (
                      <span aria-hidden="true" className="text-border">
                        /
                      </span>
                    ) : null}
                    <a
                      href={anchor.href}
                      className="rounded-sm font-medium text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {anchor.label}
                    </a>
                  </span>
                ))}
              </nav>
            </div>
          </div>
          <div className="mx-auto mt-10 max-w-6xl">
            <StayMiniGallery />
          </div>
        </Container>
      </Section>

      <div id="villa" className="scroll-mt-28">
        <Section padding="tight" className="bg-surface">
          <Container size="default">
            <StayVillaGallery />
          </Container>
        </Section>
      </div>

      <div id="outside" className="scroll-mt-28">
        <Section padding="tight">
          <Container size="default">
            <StayOutdoorGallery />
          </Container>
        </Section>
      </div>

      <div id="services" className="scroll-mt-28">
        <Section padding="tight" className="bg-surface">
          <Container size="default">
            <StayAmenities />
          </Container>
        </Section>
      </div>

      <Section id="guest-experience" padding="tight" className="scroll-mt-24">
        <Container size="default">
          <StayGuestExperience testimonials={TESTIMONIAL_SPOTLIGHTS.stay} />
        </Container>
      </Section>

      <Section id="main-house-stay" padding="tight" className="scroll-mt-24 bg-surface">
        <Container size="default">
          <TrackedLink
            href="/stay/main-house"
            eventName="cta_click"
            eventPayload={{ location: "stay_hero", target: "/stay/main-house" }}
            className="surface-panel group grid gap-6 rounded-[32px] border-border/60 bg-white/95 p-6 shadow-[0_26px_75px_rgba(15,23,42,0.10)] transition-colors hover:border-border sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 lg:p-10"
          >
            <span className="flow flow-sm">
              <span className="block text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                Main House · Returning guests
              </span>
              <span className="text-section block text-[1.9rem] text-foreground sm:text-[2.3rem]">
                Main House · 5 suites
              </span>
              <span className="text-body block max-w-2xl">
                The full estate as one home base, from $2,500 a night in low season. A separate $10,000 damage deposit
                applies.
              </span>
            </span>
            <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform motion-safe:group-active:scale-[0.98]">
              Tour the Main House
              <ArrowRight className="size-4" />
            </span>
          </TrackedLink>
        </Container>
      </Section>

      <Section padding="tight">
        <Container size="default">
          <StayClosingCta />
        </Container>
      </Section>

      <Footer />
    </main>
  )
}
