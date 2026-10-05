import dynamic from "next/dynamic"
import type { CSSProperties } from "react"
import { ArrowUpRight } from "lucide-react"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { EditorialSplit } from "@/components/editorial-split"
import { IntroStatement } from "@/components/home/intro-statement"
import { OpenSearchButton } from "@/components/open-search-button"
import { PageStructuredData } from "@/components/structured-data"
import { CtaLink } from "@/components/ui/cta-link"
import { ESTATE_SPACES, EDITORIAL_SECTIONS, PROCESS_STEPS, HOMEPAGE_TESTIMONIALS } from "@/lib/homepage-content"
import { PAGE_METADATA } from "@/lib/seo"

const ModelCarousel = dynamic(() => import("@/components/model-carousel").then((module) => module.ModelCarousel))
const PropertyFilm = dynamic(() => import("@/components/property-film").then((module) => module.PropertyFilm))
const TestimonialSlider = dynamic(() =>
  import("@/components/testimonial-slider").then((module) => module.TestimonialSlider),
)
const DayAtTheCove = dynamic(() => import("@/components/home/day-at-the-cove").then((module) => module.DayAtTheCove))
const ProcessSteps = dynamic(() => import("@/components/process-steps").then((module) => module.ProcessSteps))

export const metadata = PAGE_METADATA.home

const QUICK_ANSWERS = [
  { href: "/rates", label: "Rates & seasons", note: "From $1,000 a night, chef included" },
  { href: "/getting-here", label: "Getting here", note: "BZE to San Pedro to our dock" },
  { href: "/dining", label: "Private chef", note: "Lunch and dinner, made on site" },
  { href: "/reviews", label: "Guest reviews", note: "Guestbook notes, word for word" },
] as const

export default function Home() {
  return (
    <>
      <Header />
      <main tabIndex={-1} id="main-content" className="min-h-screen outline-none">
      <PageStructuredData path="/" />
      <Hero />

      <Section padding="tight" className="relative z-10">
        <IntroStatement />
      </Section>

      <Section padding="tight" className="bg-sand-light/70">
        <ModelCarousel models={ESTATE_SPACES} />
      </Section>

      <Section padding="tight">
        <Container size="wide" className="flow gap-24 sm:gap-28 lg:gap-36">
          {/* Only "The estate" split: the days story is told by the timeline below. */}
          {EDITORIAL_SECTIONS.slice(0, 1).map((section, index) => (
            <EditorialSplit key={section.title} {...section} index={index} reverse={index % 2 === 1} />
          ))}
        </Container>
      </Section>

      <Section id="a-day-at-the-cove" padding="tight" className="bg-sand-light/70">
        <DayAtTheCove />
      </Section>

      <section id="property-film" className="bg-sand-light/70 pb-16 sm:pb-20 lg:pb-24">
        <PropertyFilm />
      </section>

      <Section padding="tight">
        <Container size="wide">
          <div className="flow gap-10">
            <TestimonialSlider testimonials={HOMEPAGE_TESTIMONIALS} />
            <div className="lg:pl-[calc(40%+1.6rem)]">
              <CtaLink
                href="/reviews#guest-testimonials"
                variant="outline"
                eventName="cta_click"
                eventPayload={{ location: "homepage_testimonials", target: "/reviews#guest-testimonials" }}
              >
                Read more reviews
              </CtaLink>
            </div>
          </div>
        </Container>
      </Section>

      <Section padding="tight" className="bg-sand-light/70">
        <Container size="wide">
          <ProcessSteps steps={PROCESS_STEPS} />
        </Container>
      </Section>

      <Section padding="tight">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <div className="flow flow-lg">
              <p data-reveal="fade" className="eyebrow">
                Plan your stay
              </p>
              <h2 data-reveal="up" className="text-section max-w-[12ch]">
                Get to the right answer <span className="italic-accent">fast.</span>
              </h2>
              <p data-reveal="up" className="text-lede max-w-md">
                Search rates, dining, logistics, or adventures without digging through the whole site.
              </p>
              <div data-reveal="up" style={{ "--reveal-delay": "120ms" } as CSSProperties}>
                <OpenSearchButton className="h-14 border-ink/20 bg-sand-light px-6 sm:min-w-[320px]">
                  Ask about rates, flights, menus…
                </OpenSearchButton>
              </div>
            </div>
            <ul data-reveal="stagger" className="border-t border-ink/15">
              {QUICK_ANSWERS.map((item, index) => (
                <li key={item.href} className="border-b border-ink/15" style={{ "--stagger-index": index } as CSSProperties}>
                  <TrackedLink
                    href={item.href}
                    eventName="cta_click"
                    eventPayload={{ location: "home_plan", target: item.href }}
                    className="group focus-ring flex items-center justify-between gap-6 py-6 sm:py-7"
                  >
                    <span className="flow flow-xs">
                      <span className="font-display text-[clamp(1.75rem,3vw,2.6rem)] leading-none text-foreground transition-colors duration-300 group-hover:text-lagoon">
                        {item.label}
                      </span>
                      <span className="text-sm text-muted-foreground">{item.note}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/20 text-foreground transition-[background-color,color,border-color,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-sand-light"
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
    </main>
      <Footer cta />
    </>
  )
}
