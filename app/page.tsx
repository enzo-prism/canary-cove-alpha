import type { Metadata } from "next"
import Link from "next/link"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { SiteSearch } from "@/components/site-search"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { ModelCarousel } from "@/components/model-carousel"
import { EditorialSplit } from "@/components/editorial-split"
import { ProcessSteps } from "@/components/process-steps"
import { BentoMetrics } from "@/components/bento-metrics"
import { SpecsAccordion } from "@/components/specs-accordion"
import { TestimonialSlider } from "@/components/testimonial-slider"
import { EmailCapture } from "@/components/email-capture"
import {
  MODEL_LINEUP,
  EDITORIAL_SECTIONS,
  PROCESS_STEPS,
  BENTO_METRICS,
  BENTO_DETAILS,
  SPEC_GROUPS,
  HOMEPAGE_TESTIMONIALS,
} from "@/lib/homepage-content"
import { IMAGES } from "@/lib/images"

export const metadata: Metadata = {
  title: "Canary Cove | Private Belize Estate on Ambergris Caye",
  description:
    "Private, fully staffed beachfront estate on Ambergris Caye with chef service, boats, and gear. Reserved for one group at a time.",
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Section padding="tight">
        <Container size="narrow">
          <div data-testid="hero-copy" className="flow flow-md">
            <h1 data-testid="hero-headline" className="text-display text-foreground">
              Private estate. Endless water.
            </h1>
            <p data-testid="hero-subhead" className="text-lg text-muted-foreground sm:text-xl">
              One group at a time with chef service, private boats, and oceanfront amenities.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" data-testid="hero-cta" className="w-fit">
                <Link href="/book">Book your stay</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-fit">
                <Link href="/rates">See rates</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
      <Section padding="tight">
        <Container>
          <ModelCarousel models={MODEL_LINEUP} />
        </Container>
      </Section>
      <Section>
        <Container className="space-y-14">
          {EDITORIAL_SECTIONS.map((section, index) => (
            <EditorialSplit key={section.title} {...section} reverse={index % 2 === 1} />
          ))}
        </Container>
      </Section>
      <Section id="property-film" padding="tight" className="scroll-mt-24">
        <Container size="wide">
          <div className="relative overflow-hidden rounded-[32px] border border-border/70">
            <div className="relative h-[360px] sm:h-[480px] lg:h-[620px]">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059677/outside_sq8dvn.webp"
              >
                <source
                  src="https://res.cloudinary.com/dhqpqfw6w/video/upload/v1762995355/pv_mwqjho.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-10">
              <Badge className="border border-white/40 bg-white/10 text-white">Diving film</Badge>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                World-class diving with a giant manta ray.
              </h2>
              <p className="mt-3 text-sm text-white/75 sm:text-base">
                A 60-second GoPro tour of the reef and the underwater world that surrounds Canary Cove.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90">
                  <Link href="/book">Book your stay</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/70 text-white hover:bg-white hover:text-foreground">
                  <Link href="/rates">See rates</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
      <Section padding="tight">
        <Container size="wide">
          <BentoMetrics
            title="A private resort without the noise."
            description="Every space, service, and detail is designed to feel calm, confident, and entirely yours."
            metrics={BENTO_METRICS}
            details={BENTO_DETAILS}
            primaryImage={IMAGES.bathroomAlt}
            secondaryImage={IMAGES.romanticViews}
          />
        </Container>
      </Section>
      <Section padding="tight">
        <Container>
          <ProcessSteps steps={PROCESS_STEPS} />
        </Container>
      </Section>
      <Section padding="tight">
        <Container>
          <div className="flow flow-md">
            <TestimonialSlider testimonials={HOMEPAGE_TESTIMONIALS} />
            <Button asChild variant="outline" size="sm" className="w-fit">
              <Link href="/about#guest-testimonials">Read more reviews</Link>
            </Button>
          </div>
        </Container>
      </Section>
      <Section padding="tight">
        <Container>
          <SpecsAccordion groups={SPEC_GROUPS} />
        </Container>
      </Section>
      <Section padding="tight">
        <Container size="narrow">
          <div className="flow flow-md">
            <EmailCapture />
            <div className="rounded-[24px] border border-border/70 bg-surface px-6 py-5">
              <Badge className="bg-transparent">Plan your stay</Badge>
              <div className="mt-4">
                <SiteSearch className="max-w-2xl" />
              </div>
            </div>
          </div>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}
