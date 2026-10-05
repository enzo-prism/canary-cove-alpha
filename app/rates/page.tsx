import Image from "next/image"
import type { CSSProperties } from "react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Container } from "@/components/layout/container"
import { CountUp } from "@/components/motion/count-up"
import { Marquee } from "@/components/motion/marquee"
import { Parallax } from "@/components/motion/parallax"
import { ScrollWordReveal } from "@/components/motion/scroll-word-reveal"
import { PageHero } from "@/components/page-hero"
import { RatesServicesBrowser, type RatesServiceGroup } from "@/components/rates-services-browser"
import { Drift } from "@/components/rates/drift"
import { SeasonLedger, type LedgerSeason } from "@/components/rates/season-ledger"
import { SectionHeading } from "@/components/section-heading"
import { PageStructuredData } from "@/components/structured-data"
import { CtaLink } from "@/components/ui/cta-link"
import { IMAGES, imageObjectPosition } from "@/lib/images"
import { PAGE_METADATA } from "@/lib/seo"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"

export const metadata = PAGE_METADATA.rates

const VALUE_POINTS = [
  {
    title: "Private chef included",
    description: "Menus are tailored to your group and meals are cooked at the villa.",
  },
  {
    title: "Groceries at cost",
    description: "No pantry markup, so your provisioning stays straightforward.",
  },
  {
    title: "No automatic service fee",
    description: "Gratuities are entirely optional and always left to your discretion.",
  },
] as const

const LOW_MONTHS = [1, 2, 5, 6, 7, 8, 9] as const
const HIGH_MONTHS = [4, 10] as const
const PEAK_MONTHS = [11, 0, 3] as const

const VILLA_SEASONS: readonly LedgerSeason[] = [
  {
    name: "Low Season",
    monthsShort: "Feb, Mar, Jun–Oct",
    months: LOW_MONTHS,
    tone: "low",
    rates: [
      { label: "1–2 Suites", price: "$1,000" },
      { label: "3 Suites", price: "$1,250" },
    ],
  },
  {
    name: "High Season",
    monthsShort: "May, Nov",
    months: HIGH_MONTHS,
    tone: "high",
    rates: [
      { label: "1–2 Suites", price: "$1,200" },
      { label: "3 Suites", price: "$1,500" },
    ],
  },
  {
    name: "Peak Season",
    monthsShort: "Dec, Jan, Apr",
    months: PEAK_MONTHS,
    tone: "peak",
    rates: [
      { label: "1–2 Suites", price: "$1,500" },
      { label: "3 Suites", price: "$1,800" },
    ],
  },
]

const MAIN_HOUSE_SEASONS = [
  { name: "Low Season", monthsShort: "Feb, Mar, Jun–Oct", price: "$2,500", tone: "bg-lagoon-soft" },
  { name: "High Season", monthsShort: "May, Nov", price: "$3,000", tone: "bg-canary" },
  { name: "Peak Season", monthsShort: "Dec, Jan, Apr", price: "$3,600", tone: "bg-coral" },
] as const

const SERVICE_GROUPS: RatesServiceGroup[] = [
  {
    id: "boat-services",
    kicker: "Boat services",
    title: "Transfers and dock-based logistics",
    items: [
      {
        service: "Complimentary Transfers",
        details: "Free arrival and departure boat transfers.",
        price: "Included",
        tone: "included",
      },
      {
        service: "Vern Boat Rental",
        details: "Round-trip travel to town on our 30-foot boat, Vern.",
        price: "$75",
      },
      {
        service: "Long Trip Adventures",
        details: "Extended excursions for custom island runs and flexible itineraries.",
        price: "$100 per hour + fuel",
      },
    ],
  },
  {
    id: "fishing-packages",
    kicker: "Fishing",
    title: "Guided reef and offshore fishing days",
    items: [
      {
        service: "Half-Day Fishing Adventure",
        details: "A guided half-day experience in Belize's rich fishing waters.",
        price: "$275",
      },
      {
        service: "Full-Day Fishing Excursion",
        details: "A full day exploring premier fishing locations.",
        price: "$400",
      },
      {
        service: "Deep-Sea Fishing Offshore",
        details: "An offshore deep-sea adventure for serious anglers.",
        price: "$600 per day",
        note: "Replacement tackle billed at cost if needed",
      },
    ],
  },
  {
    id: "water-sports-adventures",
    kicker: "Water sports",
    title: "Included gear plus guided reef add-ons",
    items: [
      {
        service: "Snorkeling",
        details: "Complimentary local snorkeling with gear included.",
        price: "Included",
        tone: "included",
        note: "Park fees apply",
      },
      {
        service: "Scuba Diving — One Tank",
        details: "Single-tank guided dive arranged with local crews.",
        price: "$100",
      },
      {
        service: "Scuba Diving — Two Tank",
        details: "Two-tank guided dive for guests who want a longer reef day.",
        price: "$125",
      },
      {
        service: "Paddle Boards & Kayaks",
        details: "Complimentary use of paddle boards and kayaks.",
        price: "Included",
        tone: "included",
      },
      {
        service: "Sailing",
        details: "Complimentary Hobie Cat sailing experiences.",
        price: "Included",
        tone: "included",
      },
    ],
  },
  {
    id: "golf-cart-rentals",
    kicker: "Island transport",
    title: "Golf carts for flexible San Pedro runs",
    items: [
      {
        service: "Golf Cart Rental (Half-Day)",
        details: "Explore the island at your own pace for a shorter outing.",
        price: "$50",
      },
      {
        service: "Golf Cart Rental (Full-Day)",
        details: "Maximum flexibility for island exploration.",
        price: "$80",
      },
    ],
  },
]

const INCLUDED_TICKER = [
  "Private chef",
  "Groceries at cost",
  "Arrival & departure boat transfers",
  "Snorkel gear",
  "Paddle boards & kayaks",
  "Hobie Cat sailing",
  "No automatic service fee",
] as const

const [FIRST_PERSPECTIVE, SECOND_PERSPECTIVE] = TESTIMONIAL_SPOTLIGHTS.rates

const RATE_ANCHORS = [
  { label: "Villa rates", href: "#villa-accommodations" },
  { label: "Main House", href: "#main-house-accommodations" },
  { label: "What's included", href: "#included-costs" },
  { label: "Add-ons", href: "#additional-services" },
] as const

const priceValue = (price: string) => Number(price.replace(/[^0-9]/g, ""))
const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties

function FromPrice({ price }: { price: string }) {
  return (
    <>
      <span className="mr-1.5 align-middle font-sans text-[13px] text-muted-foreground">from</span>
      {price}
    </>
  )
}

function AnchorIndex() {
  return (
    <nav aria-label="On this page" className="pt-1">
      <ol className="grid grid-cols-2 gap-x-6 gap-y-1 sm:flex sm:flex-wrap sm:gap-x-8">
        {RATE_ANCHORS.map((anchor, index) => (
          <li key={anchor.href}>
            <a
              href={anchor.href}
              className="focus-ring group inline-flex min-h-11 items-center gap-2.5 rounded-sm text-[15px] text-foreground/80 transition-colors hover:text-foreground"
            >
              <span className="font-display text-sm text-muted-foreground tabular">0{index + 1}</span>
              <span className="link-underline">{anchor.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default function Page() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-background outline-none">
      <PageStructuredData path="/rates" />

      <PageHero
        variant="split"
        eyebrow="Rates · Ambergris Caye"
        title="One estate. One group. *Priced* by the night."
        lede="Suites from $1,000 a night with a private chef and arrival transfers already folded in. Pick your season, count your suites, then layer reef days and boat runs below."
        actions={
          <>
            <CtaLink
              href="/book"
              size="lg"
              eventName="cta_click"
              eventPayload={{ location: "rates_hero", target: "/book" }}
            >
              Check dates
            </CtaLink>
            <CtaLink
              href="#villa-accommodations"
              variant="text"
              arrow="none"
              className="px-2"
            >
              See the seasons
            </CtaLink>
          </>
        }
        facts={[
          { label: "1–2 suites", value: <FromPrice price="$1,000" /> },
          { label: "3 suites", value: <FromPrice price="$1,250" /> },
          { label: "Main House", value: <FromPrice price="$2,500" /> },
          { label: "Private chef", value: "Included" },
        ]}
        image={{ src: IMAGES.heroVillaSeating.src, alt: IMAGES.heroVillaSeating.alt, focal: { x: 60, y: 50 } }}
        imageClassName="sm:max-w-[30rem] lg:max-w-none"
      >
        <AnchorIndex />
      </PageHero>

      {/* ── Villa ledger ─────────────────────────────────────────────── */}
      <section id="villa-accommodations" className="scroll-mt-24 border-t border-border/70 py-20 sm:py-28 lg:py-32">
        <Container size="wide">
          <div className="flow flow-xl">
            <SectionHeading
              titleClassName="text-section"
              eyebrow="Villa accommodations"
              title="Villa nights, by *season* and suite count."
              align="split"
              lede={
                <div className="flow flow-sm">
                  <p>
                    Three seasons. Two footprints. Chef and arrival transfers already in — pick your suites, find your
                    months, and read across.
                  </p>
                  <p className="text-body">
                    New here? The villa books by the suite: take one or two, or all three. Returning groups can reserve
                    the full{" "}
                    <a
                      href="#main-house-accommodations"
                      className="focus-ring link-underline-static whitespace-nowrap rounded-sm font-medium text-foreground"
                    >
                      5-suite Main House
                    </a>{" "}
                    instead.
                  </p>
                </div>
              }
            />
            <SeasonLedger seasons={VILLA_SEASONS} />
          </div>
        </Container>
      </section>

      {/* ── Main House (reef band) ───────────────────────────────────── */}
      <section
        id="main-house-accommodations"
        className="surface-reef relative isolate scroll-mt-24 overflow-hidden py-20 sm:py-28 lg:py-36"
      >
        {/* Ghost numeral: desktop only, parked in the band's top-right corner
            above the price ledger so it never sits behind a number. */}
        <Drift
          distance={60}
          className="absolute right-[4%] top-0 -z-10 hidden -translate-y-[12%] select-none lg:block"
        >
          <span className="block font-display text-[14rem] leading-none text-white/[0.06]">
            5
          </span>
        </Drift>

        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
            <div className="flow flow-xl">
              <SectionHeading
                titleClassName="text-section"
                eyebrow="Main House · Repeat guests"
                title="The full *5-suite* Main House, for groups coming back."
                tone="light"
                lede="Repeat guests only. This 5-suite Main House option is best for reunions and larger family groups that already know they want the whole estate flowing as one home base."
              />

              <div data-reveal="up" style={delay(200)} className="flow flow-md border-t border-white/15 pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-canary">
                  Main House booking requirements
                </p>
                <ul className="flow flow-sm text-[15px] leading-relaxed text-white/80 sm:text-base">
                  <li className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-canary" />
                    Available only to returning Canary Cove guests.
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-canary" />
                    <span>
                      A separate <span className="font-medium text-white">$10,000 damage deposit</span> applies to every
                      Main House stay.
                    </span>
                  </li>
                </ul>
              </div>

              <div data-reveal="up" style={delay(320)}>
                <CtaLink
                  href="/book?accommodation=main-house"
                  variant="canary"
                  size="lg"
                  eventName="cta_click"
                  eventPayload={{ location: "rates_main_house", target: "/book" }}
                >
                  Request the Main House
                </CtaLink>
              </div>
            </div>

            <div className="lg:pt-24">
              <div data-reveal="fade" className="flex items-baseline justify-between gap-4 pb-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">5 suites · nightly</p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">Per night</p>
              </div>
              <dl
                data-reveal="stagger"
                style={{ "--stagger-step": "140ms" } as CSSProperties}
                className="border-t border-white/25"
              >
                {MAIN_HOUSE_SEASONS.map((season, index) => (
                  <div
                    key={season.name}
                    style={{ "--stagger-index": index } as CSSProperties}
                    className="flex items-end justify-between gap-6 border-b border-white/15 py-6 sm:py-8"
                  >
                    <dt className="flow flow-xs">
                      <span className="flex items-center gap-2.5 text-[17px] font-medium text-white">
                        <span aria-hidden="true" className={`size-2 rounded-full ${season.tone}`} />
                        {season.name}
                      </span>
                      <span className="text-sm text-white/60">{season.monthsShort}</span>
                    </dt>
                    <dd className="whitespace-nowrap font-display text-5xl leading-none text-white sm:text-6xl lg:text-7xl">
                      <CountUp value={priceValue(season.price)} prefix="$" />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      {/* ── What's included ──────────────────────────────────────────── */}
      <section id="included-costs" className="scroll-mt-24 bg-surface pb-20 sm:pb-28 lg:pb-32">
        <div className="border-b border-border/70 py-6 sm:py-8">
          <Marquee
            duration={48}
            items={INCLUDED_TICKER.map((item) => (
              <span key={item} className="px-6 font-display text-3xl italic text-foreground sm:px-10 sm:text-5xl">
                {item}
              </span>
            ))}
            separator={<span className="size-2 rounded-full bg-canary" />}
          />
        </div>

        <Container size="wide" className="pt-20 sm:pt-28 lg:pt-32">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <figure className="flow flow-sm lg:sticky lg:top-[calc(var(--site-header-height)+2rem)] lg:self-start">
              <div data-reveal="clip" className="media-frame relative aspect-[4/5] w-full">
                <Parallax amount={6}>
                  <Image
                    src={IMAGES.chefMarvinPlates.src}
                    alt={IMAGES.chefMarvinPlates.alt}
                    fill
                    className="object-cover"
                    style={{ objectPosition: imageObjectPosition(IMAGES.chefMarvinPlates) }}
                    sizes="(min-width: 1320px) 520px, (min-width: 1024px) 40vw, 100vw"
                  />
                </Parallax>
              </div>
              <figcaption data-reveal="fade" className="max-w-sm text-[13px] leading-relaxed text-muted-foreground">
                Chef Marvin plating dinner in the villa kitchen — every stay&apos;s meals are cooked to your group&apos;s
                preferences.
              </figcaption>
            </figure>

            <div className="flow flow-xl">
              <SectionHeading
                titleClassName="text-section"
                eyebrow="What's included"
                title="The nightly rate *arrives* with the staff, the kitchen, and the boats."
              />

              <ol data-reveal="stagger" style={{ "--stagger-step": "120ms" } as CSSProperties} className="border-t border-ink/70">
                {VALUE_POINTS.map((point, index) => (
                  <li
                    key={point.title}
                    style={{ "--stagger-index": index } as CSSProperties}
                    className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 border-b border-border/80 py-6 sm:grid-cols-[4rem_minmax(0,0.9fr)_minmax(0,1.1fr)] sm:gap-x-6 sm:py-8"
                  >
                    <span className="font-display text-2xl leading-none text-muted-foreground tabular sm:text-3xl">
                      0{index + 1}
                    </span>
                    <h3 className="text-title text-[1.6rem] sm:text-[1.9rem]">{point.title}</h3>
                    <p className="text-body col-start-2 mt-2 sm:col-start-3 sm:mt-0">{point.description}</p>
                  </li>
                ))}
              </ol>

              <div className="flow flow-lg pt-4">
                <ScrollWordReveal
                  text="For repeat guests, you’ll notice that our rates have remained *unchanged* for over a decade."
                  className="font-display text-[1.9rem] leading-[1.15] text-foreground sm:text-[2.5rem]"
                />
                <div data-reveal="up" className="max-w-2xl space-y-5 text-[15px] leading-[1.8] text-foreground/80 sm:text-base">
                  <p>
                    During that time, we&apos;ve continued to invest heavily in the property, adding ensuite bathrooms to
                    all rooms, a hot tub, and thoughtful upgrades to elevate the experience.
                  </p>
                  <p>
                    For new guests comparing costs, it&apos;s important to understand what&apos;s included. Your stay
                    comes with a private chef who prepares meals exactly to your preferences, with no grocery markup. For a
                    group of four, dining out for multiple meals per day quickly becomes far more expensive. We also do not
                    add a mandatory service charge.
                  </p>
                  <p>
                    While many guests choose to tip generously, gratuities are always optional and entirely at your
                    discretion. We look forward to creating a truly special vacation for you and your guests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Add-ons ──────────────────────────────────────────────────── */}
      <section id="additional-services" className="scroll-mt-24 py-20 sm:py-28 lg:py-32">
        <Container size="wide">
          <div className="flow flow-xl">
            <SectionHeading
              titleClassName="text-section"
              eyebrow="Additional services & experiences"
              title="Boats, fishing, reef days, and carts — one *searchable* list."
              align="split"
              lede="Boat runs, fishing charters, dive days, golf carts, and included gear all live in one place so pricing is easy to skim and easy to search."
            />
            <RatesServicesBrowser groups={SERVICE_GROUPS} />
          </div>
        </Container>
      </section>

      {/* ── Guest perspectives ───────────────────────────────────────── */}
      <section className="border-t border-border/70 bg-surface py-20 sm:py-28 lg:py-32">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
            <div className="flow flow-xl lg:sticky lg:top-[calc(var(--site-header-height)+2rem)] lg:self-start">
              <SectionHeading
                titleClassName="text-section"
                eyebrow="Guest perspectives"
                title="Guests do the same math — then mention how *complete* it felt."
              />
              <figure data-reveal="up" className="flow flow-md border-l-2 border-canary pl-6 sm:pl-8">
                <blockquote className="text-lg leading-relaxed text-foreground/85">“{SECOND_PERSPECTIVE.quote}”</blockquote>
                <figcaption className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  {SECOND_PERSPECTIVE.author} · {SECOND_PERSPECTIVE.year}
                </figcaption>
              </figure>
            </div>
            <figure className="relative flow flow-lg pt-10 lg:pt-0">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-1 -top-6 font-display text-[8rem] leading-none text-canary sm:-left-12 sm:-top-12 sm:text-[11rem]"
              >
                “
              </span>
              <blockquote
                data-reveal="up"
                className="relative font-display text-[1.5rem] leading-[1.28] text-foreground sm:text-[2.1rem] lg:text-[2.35rem]"
              >
                {FIRST_PERSPECTIVE.quote}
              </blockquote>
              <figcaption className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                {FIRST_PERSPECTIVE.author} · {FIRST_PERSPECTIVE.year}
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      {/* ── Planning ─────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 lg:py-32">
        <Container size="wide">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
            <div data-reveal="clip" className="media-frame relative aspect-[4/3] w-full lg:aspect-[5/4]">
              <Parallax amount={8}>
                <Image
                  src={IMAGES.diningRoom.src}
                  alt={IMAGES.diningRoom.alt}
                  fill
                  className="object-cover"
                  style={{ objectPosition: imageObjectPosition(IMAGES.diningRoom) }}
                  sizes="(min-width: 1320px) 700px, (min-width: 1024px) 55vw, 100vw"
                />
              </Parallax>
            </div>
            <SectionHeading
              titleClassName="text-section"
              eyebrow="Planning help"
              title="One clear quote, *chef included.*"
              lede="Share your dates, suite count, chef expectations, and likely add-ons — we'll map them into a simpler recommendation for your group."
              action={
                <>
                  <CtaLink
                    href="/book"
                    size="lg"
                    className="w-full justify-between sm:w-auto sm:justify-center"
                    eventName="cta_click"
                    eventPayload={{ location: "rates_planning", target: "/book" }}
                  >
                    Check dates
                  </CtaLink>
                  <CtaLink
                    href="/contact"
                    variant="outline"
                    size="lg"
                    arrow="none"
                    className="w-full sm:w-auto"
                    eventName="cta_click"
                    eventPayload={{ location: "rates_planning", target: "/contact" }}
                  >
                    Ask about your group
                  </CtaLink>
                </>
              }
            />
          </div>
        </Container>
      </section>

    </main>
      <Footer />
    </>
  )
}
