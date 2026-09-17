import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { RatesServicesBrowser, type RatesServiceGroup } from "@/components/rates-services-browser"
import { PageStructuredData } from "@/components/structured-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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

type SeasonRate = {
  label: string
  price: string
}

type Season = {
  name: string
  monthsShort: string
  rates: readonly SeasonRate[]
}

const VILLA_SEASONS: readonly Season[] = [
  {
    name: "Low Season",
    monthsShort: "Feb, Mar, Jun–Oct",
    rates: [
      { label: "1–2 Suites", price: "$1,000" },
      { label: "3 Suites", price: "$1,250" },
    ],
  },
  {
    name: "High Season",
    monthsShort: "May, Nov",
    rates: [
      { label: "1–2 Suites", price: "$1,200" },
      { label: "3 Suites", price: "$1,500" },
    ],
  },
  {
    name: "Peak Season",
    monthsShort: "Dec, Jan, Apr",
    rates: [
      { label: "1–2 Suites", price: "$1,500" },
      { label: "3 Suites", price: "$1,800" },
    ],
  },
]

const MAIN_HOUSE_SEASONS: readonly Season[] = [
  { name: "Low Season", monthsShort: "Feb, Mar, Jun–Oct", rates: [{ label: "5 Suites", price: "$2,500" }] },
  { name: "High Season", monthsShort: "May, Nov", rates: [{ label: "5 Suites", price: "$3,000" }] },
  { name: "Peak Season", monthsShort: "Dec, Jan, Apr", rates: [{ label: "5 Suites", price: "$3,600" }] },
]

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
] as const

const RATE_PERSPECTIVES = [
  {
    quote: TESTIMONIAL_SPOTLIGHTS.rates[0].quote,
    author: TESTIMONIAL_SPOTLIGHTS.rates[0].author,
    year: TESTIMONIAL_SPOTLIGHTS.rates[0].year,
  },
  {
    quote: TESTIMONIAL_SPOTLIGHTS.rates[1].quote,
    author: TESTIMONIAL_SPOTLIGHTS.rates[1].author,
    year: TESTIMONIAL_SPOTLIGHTS.rates[1].year,
  },
] as const

const RATE_ANCHORS = [
  { label: "Villa rates", href: "#villa-accommodations" },
  { label: "Main House", href: "#main-house-accommodations" },
  { label: "What's included", href: "#included-costs" },
  { label: "Add-ons", href: "#additional-services" },
] as const

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">{children}</p>
}

function RateGlance() {
  const rows = [
    { label: "Villa · 1–2 suites", price: "from $1,000/night" },
    { label: "Villa · 3 suites", price: "from $1,250/night" },
    { label: "Main House · 5 suites", price: "from $2,500/night · repeat guests" },
  ] as const

  return (
    <dl className="border-t border-border/60">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-baseline justify-between gap-6 border-b border-border/60 py-3.5"
        >
          <dt className="text-[0.95rem] font-medium text-foreground/80">{row.label}</dt>
          <dd className="shrink-0 text-right text-[0.95rem] font-semibold tabular-nums text-foreground">
            {row.price}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function SeasonRateTable({ seasons, caption }: { seasons: readonly Season[]; caption: string }) {
  return (
    <Card className="surface-panel overflow-hidden rounded-[28px] border-border/60 bg-white/95 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead className="hidden md:table-header-group">
          <tr className="border-b border-border/60">
            <th scope="col" className="w-[22%] px-6 py-4 pl-8 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Season
            </th>
            <th scope="col" className="w-[34%] px-6 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Travel months
            </th>
            <th scope="col" className="w-[22%] px-6 py-4 text-right text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              1–2 suites
            </th>
            <th scope="col" className="w-[22%] px-6 py-4 pr-8 text-right text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              3 suites
            </th>
          </tr>
        </thead>
        <tbody className="grid gap-3 p-4 sm:p-5 md:table-row-group md:p-0">
          {seasons.map((season) => (
            <tr
              key={season.name}
              className="grid gap-2 rounded-[20px] border border-border/55 bg-white/70 p-5 md:table-row md:rounded-none md:border-0 md:border-t md:border-border/55 md:bg-transparent md:p-0 md:first:border-t-0"
            >
              <th
                scope="row"
                className="text-lg font-semibold tracking-tight text-foreground md:px-6 md:py-5 md:pl-8 md:text-[1.05rem] md:font-semibold"
              >
                {season.name}
              </th>
              <td className="text-sm leading-6 text-muted-foreground md:px-6 md:py-5">{season.monthsShort}</td>
              {season.rates.map((rate) => (
                <td key={rate.label} className="md:px-6 md:py-5 md:text-right md:last:pr-8">
                  <div className="flex items-baseline justify-between gap-4 md:block">
                    <span className="text-sm text-muted-foreground md:hidden">{rate.label}</span>
                    <span className="text-base font-semibold tabular-nums tracking-tight text-foreground md:text-lg">
                      {rate.price}
                      <span className="text-sm font-medium text-muted-foreground">/night</span>
                    </span>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

function MainHouseRateRail({ seasons }: { seasons: readonly Season[] }) {
  return (
    <dl className="flow flow-sm">
      {seasons.map((season) => (
        <div
          key={season.name}
          className="flex items-baseline justify-between gap-4 border-b border-border/55 pb-3.5 last:border-b-0 last:pb-0"
        >
          <dt className="flow-xs">
            <span className="block text-[0.95rem] font-semibold text-foreground">{season.name}</span>
            <span className="block text-[0.82rem] leading-5 text-muted-foreground">{season.monthsShort}</span>
          </dt>
          <dd className="shrink-0 whitespace-nowrap text-lg font-semibold tabular-nums tracking-tight text-foreground">
            {season.rates[0].price}
            <span className="text-sm font-medium text-muted-foreground">/night</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}

function PerspectiveStack({ perspectives }: { perspectives: typeof RATE_PERSPECTIVES }) {
  const [first, second] = perspectives

  return (
    <div className="flow flow-lg">
      <figure className="border-l-2 border-primary/30 pl-6 sm:pl-8">
        <blockquote className="max-w-3xl text-balance text-xl font-medium leading-9 tracking-tight text-foreground sm:text-2xl sm:leading-10">
          “{first.quote}”
        </blockquote>
        <figcaption className="mt-4 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          {first.author} · {first.year}
        </figcaption>
      </figure>
      <figure className="border-l-2 border-primary/30 pl-6 sm:pl-8 md:ml-16">
        <blockquote className="max-w-2xl text-lg leading-8 text-foreground/85">{second.quote}”</blockquote>
        <figcaption className="mt-4 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          {second.author} · {second.year}
        </figcaption>
      </figure>
    </div>
  )
}

export default function Page() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background outline-none">
      <PageStructuredData path="/rates" />
      <Header />

      <Section padding="tight" className="overflow-hidden">
        <Container size="wide">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-14">
            <div className="flow flow-md max-w-2xl">
              <Eyebrow>Rates · Ambergris Caye</Eyebrow>
              <h1 className="text-balance text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-[3.9rem]">
                One estate. One group. Priced by the night.
              </h1>
              <p className="max-w-xl text-base leading-7 text-foreground/72 sm:text-lg sm:leading-8">
                Suites from $1,000 a night with a private chef and arrival transfers already folded in. Pick your
                season, count your suites, then layer reef days and boat runs below.
              </p>
              <RateGlance />
              <div className="flex flex-col gap-5 pt-1">
                <Button asChild size="lg" className="w-full sm:w-fit">
                  <TrackedLink href="/book" eventName="cta_click" eventPayload={{ location: "rates_hero", target: "/book" }}>
                    Check dates
                    <ArrowUpRight className="size-4" />
                  </TrackedLink>
                </Button>
                <nav aria-label="On this page" className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
                  {RATE_ANCHORS.map((anchor, index) => (
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

            <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] bg-surface-muted shadow-[0_24px_70px_rgba(15,23,42,0.10)] lg:aspect-[4/5]">
              <Image
                src={IMAGES.villaPool.src}
                alt={IMAGES.villaPool.alt}
                fill
                priority
                className="object-cover"
                style={{ objectPosition: imageObjectPosition(IMAGES.villaPool) }}
                sizes="(min-width: 1024px) 44vw, 100vw"
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section id="included-costs" padding="tight" className="scroll-mt-24 bg-surface">
        <Container size="default">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <div className="flow flow-md lg:sticky lg:top-28 lg:self-start">
              <div className="flow flow-sm">
                <Eyebrow>What&apos;s included</Eyebrow>
                <h2 className="text-section max-w-md text-[2rem] sm:text-[2.5rem]">
                  The nightly rate arrives with the staff, the kitchen, and the boats.
                </h2>
              </div>
              <figure className="flow-xs">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-surface-muted">
                  <Image
                    src={IMAGES.chefMarvinPlates.src}
                    alt={IMAGES.chefMarvinPlates.alt}
                    fill
                    className="object-cover"
                    style={{ objectPosition: imageObjectPosition(IMAGES.chefMarvinPlates) }}
                    sizes="(min-width: 1024px) 42vw, 100vw"
                  />
                </div>
                <figcaption className="text-[0.82rem] leading-6 text-muted-foreground">
                  Chef Marvin plating dinner in the villa kitchen — every stay&apos;s meals are cooked to your group&apos;s
                  preferences.
                </figcaption>
              </figure>
            </div>

            <div className="flow flow-md lg:pt-2">
              <dl className="border-t border-border/60">
                {VALUE_POINTS.map((point) => (
                  <div key={point.title} className="grid gap-1 border-b border-border/60 py-5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:gap-6">
                    <dt className="text-[0.98rem] font-semibold text-foreground">{point.title}</dt>
                    <dd className="text-[0.95rem] leading-7 text-foreground/75">{point.description}</dd>
                  </div>
                ))}
              </dl>
              <div className="max-w-2xl space-y-5 text-[0.98rem] leading-8 text-foreground/82">
                <p>
                  For repeat guests, you&apos;ll notice that our rates have remained unchanged for over a decade. During
                  that time, we&apos;ve continued to invest heavily in the property, adding ensuite bathrooms to all rooms,
                  a hot tub, and thoughtful upgrades to elevate the experience.
                </p>
                <p>
                  For new guests comparing costs, it&apos;s important to understand what&apos;s included. Your stay comes
                  with a private chef who prepares meals exactly to your preferences, with no grocery markup. For a group
                  of four, dining out for multiple meals per day quickly becomes far more expensive. We also do not add a
                  mandatory service charge.
                </p>
                <p>
                  While many guests choose to tip generously, gratuities are always optional and entirely at your
                  discretion. We look forward to creating a truly special vacation for you and your guests.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="villa-accommodations" padding="tight" className="scroll-mt-24">
        <Container size="default">
          <div className="flow flow-sm max-w-3xl">
            <Eyebrow>Villa accommodations</Eyebrow>
            <h2 className="text-section text-[2rem] sm:text-[2.5rem]">Villa nights, by season and suite count.</h2>
            <p className="text-body max-w-2xl">
              Three seasons. Two footprints. Chef and arrival transfers already in — pick your suites, find your months,
              and read across.
            </p>
            <p className="max-w-2xl text-[0.95rem] leading-7 text-foreground/72">
              New here? The villa books by the suite: take one or two, or all three. Returning groups can reserve the
              full{" "}
              <a
                href="#main-house-accommodations"
                className="rounded-sm font-medium whitespace-nowrap text-foreground underline underline-offset-4 transition-colors hover:text-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                5-suite Main House
              </a>{" "}
              instead.
            </p>
          </div>
          <div className="mt-8">
            <SeasonRateTable seasons={VILLA_SEASONS} caption="Villa nightly rates by season and suite count" />
          </div>
        </Container>
      </Section>

      <Section id="main-house-accommodations" padding="tight" className="scroll-mt-24 bg-surface">
        <Container size="default">
          <Card className="surface-panel rounded-[32px] border-border/60 bg-white/95 p-6 shadow-[0_26px_75px_rgba(15,23,42,0.10)] sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-10">
              <div className="flow flow-md">
                <div className="flow flow-sm">
                  <Eyebrow>Main House · Repeat guests</Eyebrow>
                  <h2 className="text-section max-w-xl text-[2rem] sm:text-[2.5rem]">
                    The full 5-suite Main House, for groups coming back.
                  </h2>
                  <p className="text-body max-w-2xl">
                    Repeat guests only. This 5-suite Main House option is best for reunions and larger family groups
                    that already know they want the whole estate flowing as one home base.
                  </p>
                </div>
                <div className="border-l-2 border-primary/40 pl-5 sm:pl-6">
                  <div className="flow-xs max-w-2xl">
                    <p className="text-sm font-semibold text-foreground">Main House booking requirements</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Available only to returning Canary Cove guests. A separate $10,000 damage deposit applies to
                      every Main House stay.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flow flow-md rounded-[24px] bg-surface-elevated/60 p-5 sm:p-6">
                <MainHouseRateRail seasons={MAIN_HOUSE_SEASONS} />
                <Button asChild size="lg" className="w-full">
                  <TrackedLink
                    href="/book?accommodation=main-house"
                    eventName="cta_click"
                    eventPayload={{ location: "rates_main_house", target: "/book" }}
                  >
                    Request the Main House
                    <ArrowUpRight className="size-4" />
                  </TrackedLink>
                </Button>
              </div>
            </div>
          </Card>
        </Container>
      </Section>

      <Section id="additional-services" padding="tight" className="scroll-mt-24">
        <Container size="wide">
          <RatesServicesBrowser groups={SERVICE_GROUPS} />
        </Container>
      </Section>

      <Section padding="tight" className="bg-surface">
        <Container size="narrow">
          <div className="flow flow-sm max-w-3xl">
            <Eyebrow>Guest perspectives</Eyebrow>
            <h2 className="text-section text-[2rem] sm:text-[2.5rem]">
              Guests do the same math — then mention how complete it felt.
            </h2>
          </div>
          <div className="mt-10">
            <PerspectiveStack perspectives={RATE_PERSPECTIVES} />
          </div>
        </Container>
      </Section>

      <Section padding="tight">
        <Container size="default">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-surface-muted">
              <Image
                src={IMAGES.diningRoom.src}
                alt={IMAGES.diningRoom.alt}
                fill
                className="object-cover"
                style={{ objectPosition: imageObjectPosition(IMAGES.diningRoom) }}
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            <div className="flow flow-md">
              <div className="flow flow-sm">
                <Eyebrow>Planning help</Eyebrow>
                <h2 className="text-section text-[2rem] sm:text-[2.5rem]">
                  Send your dates. We&apos;ll price the trip straight.
                </h2>
                <p className="text-body max-w-xl">
                  Share your dates, suite count, chef expectations, and likely add-ons — we&apos;ll map them into a
                  simpler recommendation for your group.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-fit">
                  <TrackedLink href="/book" eventName="cta_click" eventPayload={{ location: "rates_planning", target: "/book" }}>
                    Check dates
                    <ArrowUpRight className="size-4" />
                  </TrackedLink>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full border-border/70 bg-white/80 sm:w-fit">
                  <TrackedLink href="/contact" eventName="cta_click" eventPayload={{ location: "rates_planning", target: "/contact" }}>
                    Ask about your group
                  </TrackedLink>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </main>
  )
}

