import dynamic from "next/dynamic"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { EditorialSplit } from "@/components/editorial-split"
import { OpenSearchButton } from "@/components/open-search-button"
import { ProcessSteps } from "@/components/process-steps"
import { PageStructuredData } from "@/components/structured-data"
import {
  ESTATE_SPACES,
  EDITORIAL_SECTIONS,
  PROCESS_STEPS,
  HOME_PROOF_POINTS,
  HOMEPAGE_TESTIMONIALS,
} from "@/lib/homepage-content"
import { PAGE_METADATA } from "@/lib/seo"

const ModelCarousel = dynamic(() => import("@/components/model-carousel").then((module) => module.ModelCarousel))
const PropertyFilm = dynamic(() => import("@/components/property-film").then((module) => module.PropertyFilm))
const TestimonialSlider = dynamic(() =>
  import("@/components/testimonial-slider").then((module) => module.TestimonialSlider),
)

export const metadata = PAGE_METADATA.home

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen">
      <PageStructuredData path="/" />
      <Header />
      <Hero />
      <Section padding="tight" className="relative z-10 pt-8 sm:pt-10 lg:pt-12">
        <Container size="wide" className="space-y-10 sm:space-y-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOME_PROOF_POINTS.map((point) => (
              <div key={point.label} className="surface-inset px-5 py-5">
                <p className="text-lg font-semibold text-foreground">{point.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{point.label}</p>
              </div>
            ))}
          </div>
          <ModelCarousel models={ESTATE_SPACES} />
        </Container>
      </Section>
      <Section padding="tight">
        <Container className="space-y-14">
          {EDITORIAL_SECTIONS.map((section, index) => (
            <EditorialSplit key={section.title} {...section} reverse={index % 2 === 1} />
          ))}
        </Container>
      </Section>
      <Section id="property-film" padding="tight" className="scroll-mt-24">
        <Container size="wide">
          <PropertyFilm />
        </Container>
      </Section>
      <Section padding="tight">
        <Container>
          <div className="flow flow-md">
            <TestimonialSlider testimonials={HOMEPAGE_TESTIMONIALS} />
            <Button asChild variant="outline" size="sm" className="w-fit">
              <TrackedLink
                href="/reviews#guest-testimonials"
                eventName="cta_click"
                eventPayload={{ location: "homepage_testimonials", target: "/reviews#guest-testimonials" }}
              >
                Read more reviews
              </TrackedLink>
            </Button>
          </div>
        </Container>
      </Section>
      <Section padding="tight">
        <Container>
          <ProcessSteps steps={PROCESS_STEPS} />
        </Container>
      </Section>
      <Section padding="tight">
        <Container>
          <div className="surface-panel px-6 py-6 sm:px-8 sm:py-8">
            <Badge className="bg-transparent">Plan your stay</Badge>
            <div className="mt-5 flow flow-sm">
              <h2 className="text-section">Get to the right answer fast.</h2>
              <p className="text-body max-w-xl">
                Search rates, dining, logistics, or adventures without digging through the whole site.
              </p>
            </div>
            <div className="mt-6">
              <OpenSearchButton />
            </div>
          </div>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}
