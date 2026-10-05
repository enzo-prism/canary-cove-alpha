import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Marquee } from "@/components/motion/marquee"
import { ScrollWordReveal } from "@/components/motion/scroll-word-reveal"
import { PageHero } from "@/components/page-hero"
import { StayAmenities } from "@/components/stay-amenities"
import { StayClosingCta } from "@/components/stay-closing-cta"
import { StayGuestExperience } from "@/components/stay-guest-experience"
import { StayMiniGallery } from "@/components/stay-mini-gallery"
import { StayOutdoorGallery } from "@/components/stay-outdoor-gallery"
import { StayVillaGallery } from "@/components/stay-villa-gallery"
import { StayMainHouse } from "@/components/stay/stay-main-house"
import { PageStructuredData } from "@/components/structured-data"
import { CtaLink } from "@/components/ui/cta-link"
import { IMAGES } from "@/lib/images"
import { PAGE_METADATA } from "@/lib/seo"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"

export const metadata = PAGE_METADATA.stay

const STAY_ANCHORS = [
  { label: "Inside", href: "#inside-the-villa" },
  { label: "Outside", href: "#outside-the-villa" },
  { label: "Included", href: "#amenities" },
  { label: "Guest notes", href: "#guest-experience" },
  { label: "Main House", href: "#main-house-stay" },
] as const

const HERO_FACTS = [
  { label: "Sleeps", value: "Up to 10" },
  { label: "King suites", value: "3" },
  { label: "Docks", value: "2" },
  { label: "Chef", value: "Daily" },
]

// Every word here is an amenity listed in components/stay-amenities.tsx.
const AMENITY_WORDS = [
  "Infinity pool",
  "Swim-up bar",
  "Hot tub",
  "Private dock",
  "Chef-led meals",
  "Paddleboards",
  "Airport pickup",
  "Daily housekeeping",
  "Beach bikes",
  "Outdoor shower",
  "Snorkeling gear",
  "Private gardens",
]

export default function Page() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-background outline-none">
      <PageStructuredData path="/stay" />

      <PageHero
        variant="split"
        eyebrow="Stay · Ambergris Caye"
        title="One estate. Your group. *Nothing* shared."
        lede={
          <p>
            Three king suites, a pool deck made for all-day lounging, two docks with boats on site, and a chef-led
            table — one private booking at a time. The villa sleeps up to 10; returning groups can take the{" "}
            <a
              href="#main-house-stay"
              className="link-underline-static focus-ring whitespace-nowrap rounded-sm text-foreground"
            >
              5-suite Main House
            </a>{" "}
            instead.
          </p>
        }
        actions={
          <>
            <CtaLink
              href="/book"
              size="lg"
              arrow="diag"
              eventName="cta_click"
              eventPayload={{ location: "stay_hero_book", target: "/book" }}
            >
              Check dates
            </CtaLink>
            <CtaLink
              href="/rates"
              variant="text"
              eventName="cta_click"
              eventPayload={{ location: "stay_hero_rates", target: "/rates" }}
            >
              See rates
            </CtaLink>
          </>
        }
        facts={HERO_FACTS}
        image={{ src: IMAGES.heroVillaDining.src, alt: IMAGES.heroVillaDining.alt, focal: { x: 38, y: 50 } }}
        imageClassName="sm:max-w-[34rem] lg:max-w-none"
      >
        <nav aria-label="On this page" className="-mx-[var(--gutter)] sm:mx-0 sm:-ml-2">
          <ul className="no-scrollbar flex w-0 min-w-full gap-2 overflow-x-auto px-[var(--gutter)] py-1 text-sm sm:w-auto sm:flex-wrap sm:gap-0 sm:overflow-visible sm:px-0 sm:py-0">
            {STAY_ANCHORS.map((anchor, index) => (
              <li key={anchor.href} className="shrink-0">
                <a
                  href={anchor.href}
                  className="focus-ring inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full border border-ink/15 px-4 text-foreground/80 transition-colors hover:border-ink/40 hover:text-foreground sm:border-transparent sm:px-2 sm:hover:border-transparent"
                >
                  <span aria-hidden="true" className="tabular text-[10px] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="link-underline">{anchor.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {/* Photo tour: a wide, swipeable filmstrip right under the hero. */}
      <section aria-labelledby="stay-tour-heading" className="pb-20 sm:pb-24 lg:pb-32">
        <div className="mx-auto w-full max-w-[1320px] px-[var(--gutter)]">
          <div className="mb-8 grid gap-5 sm:mb-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
            <h2 id="stay-tour-heading" className="eyebrow" data-reveal="fade">
              A first walk through
            </h2>
            <ScrollWordReveal
              text="Morning swims, reef days off the dock, *long* dinners at the chef’s table — and three quiet suites to come back to."
              className="font-display max-w-[28ch] text-[clamp(1.65rem,2.7vw,2.5rem)] leading-[1.1] text-foreground lg:justify-self-end"
            />
          </div>
          <StayMiniGallery />
        </div>
      </section>

      <div id="villa" className="scroll-mt-28">
        <section className="bg-surface py-20 sm:py-28 lg:py-36">
          <StayVillaGallery />
        </section>
      </div>

      <div id="outside" className="scroll-mt-28">
        <StayOutdoorGallery />
      </div>

      <div aria-hidden="true" className="border-y border-border/70 bg-surface py-6 sm:py-8">
        <Marquee
          duration={60}
          items={AMENITY_WORDS.map((word) => (
            <span
              key={word}
              className="font-display px-6 text-[clamp(1.85rem,3.4vw,3.25rem)] leading-none text-foreground sm:px-10"
            >
              {word}
            </span>
          ))}
          separator={<span className="block size-2 rounded-full bg-canary" />}
        />
      </div>

      <div id="services" className="scroll-mt-28">
        <section className="py-20 sm:py-28 lg:py-36">
          <StayAmenities />
        </section>
      </div>

      <section id="guest-experience" className="scroll-mt-24 bg-surface py-20 sm:py-28 lg:py-36">
        <StayGuestExperience testimonials={TESTIMONIAL_SPOTLIGHTS.stay.slice(1)} />
      </section>

      <StayMainHouse />

      <StayClosingCta />

    </main>
      <Footer />
    </>
  )
}
