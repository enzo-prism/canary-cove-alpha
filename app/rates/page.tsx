import Image from "next/image"
import { ArrowUpRight, CalendarRange, ChefHat, CircleDollarSign, ShieldCheck, Sparkles } from "lucide-react"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Container } from "@/components/layout/container"
import { RatesServicesBrowser, type RatesServiceGroup } from "@/components/rates-services-browser"
import { PageStructuredData } from "@/components/structured-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { IMAGES } from "@/lib/images"
import { PAGE_METADATA } from "@/lib/seo"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"

export const metadata = PAGE_METADATA.rates

const VALUE_HIGHLIGHTS = [
  {
    title: "Private chef included",
    description: "Menus are tailored to your group and meals are cooked at the villa.",
    icon: ChefHat,
  },
  {
    title: "Groceries at cost",
    description: "No pantry markup, so your provisioning stays straightforward.",
    icon: CircleDollarSign,
  },
  {
    title: "No automatic service fee",
    description: "Gratuities are entirely optional and always left to your discretion.",
    icon: ShieldCheck,
  },
] as const

const VILLA_SEASONS = [
  {
    name: "Low Season",
    months: "February, March, June, July, August, September, October",
    rates: [
      { label: "1–2 Suites", price: "$1,000" },
      { label: "3 Suites", price: "$1,250" },
    ],
  },
  {
    name: "High Season",
    months: "May, November",
    rates: [
      { label: "1–2 Suites", price: "$1,200" },
      { label: "3 Suites", price: "$1,500" },
    ],
  },
  {
    name: "Peak Season",
    months: "December, January, April",
    rates: [
      { label: "1–2 Suites", price: "$1,500" },
      { label: "3 Suites", price: "$1,800" },
    ],
  },
] as const

const MAIN_HOUSE_SEASONS = [
  {
    name: "Low Season",
    months: "February, March, June, July, August, September, October",
    rates: [{ label: "5 Suites", price: "$2,500" }],
  },
  {
    name: "High Season",
    months: "May, November",
    rates: [{ label: "5 Suites", price: "$3,000" }],
  },
  {
    name: "Peak Season",
    months: "December, January, April",
    rates: [{ label: "5 Suites", price: "$3,600" }],
  },
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
] as const

const RATE_PERSPECTIVES = [
  {
    quote:
      "This was one of the most complete trips we have ever taken. The house, the staff, and the way the team handled every last-minute need made the whole stay feel effortless.",
    author: TESTIMONIAL_SPOTLIGHTS.rates[0].author,
    year: TESTIMONIAL_SPOTLIGHTS.rates[0].year,
  },
  {
    quote:
      "A truly unforgettable stay, made memorable by the amazing staff, the beautiful house, and grounds we would happily return to.",
    author: TESTIMONIAL_SPOTLIGHTS.rates[1].author,
    year: TESTIMONIAL_SPOTLIGHTS.rates[1].year,
  },
] as const

const MONTH_ABBREVIATIONS: Record<string, string> = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec",
}

function SeasonCard({
  season,
}: {
  season: (typeof VILLA_SEASONS)[number] | (typeof MAIN_HOUSE_SEASONS)[number]
}) {
  const monthTokens = season.months.split(", ").map((month) => MONTH_ABBREVIATIONS[month] ?? month)

  return (
    <Card className="surface-panel overflow-hidden rounded-[30px] border-border/60 bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="border-b border-border/45 bg-[linear-gradient(180deg,rgba(251,247,239,0.96)_0%,rgba(247,241,232,0.84)_100%)] px-5 py-5 sm:px-6">
        <div className="flow-xs">
          <h3 className="text-[1.55rem] font-semibold tracking-tight text-foreground">{season.name}</h3>
          <div className="flow-xs">
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">Travel months</p>
            <div className="flex flex-wrap gap-2">
              {monthTokens.map((month) => (
                <span
                  key={`${season.name}-${month}`}
                  className="inline-flex min-w-11 items-center justify-center rounded-full border border-border/55 bg-white/86 px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-foreground/72"
                >
                  {month}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 px-5 py-5 sm:px-6 sm:py-6">
        <p className="text-[0.62rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">Nightly pricing</p>
        <div className="grid gap-3">
          {season.rates.map((rate) => (
            <div
              key={`${season.name}-${rate.label}`}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-[18px] border border-border/55 bg-[linear-gradient(180deg,rgba(252,248,241,0.98)_0%,rgba(247,241,232,0.9)_100%)] px-4 py-3.5"
            >
              <span className="text-sm font-medium leading-5 text-foreground/78">{rate.label}</span>
              <span className="text-lg font-semibold tracking-tight text-foreground">{rate.price}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function PerspectiveCard({
  quote,
  author,
  year,
}: {
  quote: string
  author?: string
  year: string
}) {
  return (
    <Card className="surface-inset rounded-[26px] border-border/60 bg-white/92 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="flow flow-sm">
        <div className="flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          <Sparkles className="size-3.5" />
          <span>Guest perspective</span>
        </div>
        <p className="text-sm leading-7 text-foreground/88">“{quote}”</p>
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          {author} · {year}
        </p>
      </div>
    </Card>
  )
}

export default function Page() {
  const [firstPerspective, secondPerspective] = RATE_PERSPECTIVES

  return (
    <main id="main-content" className="min-h-screen bg-[linear-gradient(180deg,#f8f3ea_0%,#f2ebdf_24%,#f8f3e8_100%)]">
      <PageStructuredData path="/rates" />
      <Header />

      <section className="relative isolate overflow-hidden border-b border-border/45">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(207,173,123,0.2),transparent_40%),linear-gradient(180deg,rgba(250,244,235,0.98)_0%,rgba(244,236,224,0.94)_100%)]" />
        <div className="absolute inset-y-0 left-0 hidden w-[22vw] min-w-[180px] lg:block">
          <Image
            src={IMAGES.heroBackgroundEstate.src}
            alt={IMAGES.heroBackgroundEstate.alt}
            fill
            priority
            className="object-cover opacity-20 [mask-image:linear-gradient(90deg,black,transparent)]"
            sizes="22vw"
          />
        </div>
        <div className="absolute inset-y-0 right-0 hidden w-[18vw] min-w-[150px] lg:block">
          <Image
            src={IMAGES.villaPool.src}
            alt={IMAGES.villaPool.alt}
            fill
            className="object-cover opacity-14 [mask-image:linear-gradient(270deg,black,transparent)]"
            sizes="18vw"
          />
        </div>

        <Container size="wide" className="relative py-18 sm:py-22 lg:py-24">
          <div className="max-w-3xl flow flow-sm">
            <div className="flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.34em] text-muted-foreground">
              <CalendarRange className="size-4" />
              <span>Transparent pricing</span>
            </div>
            <h1 className="text-balance text-[2.9rem] font-semibold tracking-tight text-foreground sm:text-[4rem]">
              Canary Cove Rates
            </h1>
            <p className="max-w-2xl text-base leading-7 text-foreground/72 sm:text-lg sm:leading-8">
              Review suite pricing, the full 5-suite Main House option, and every bookable add-on in one place so the full trip cost is easy to
              understand.
            </p>
          </div>
        </Container>
      </section>

      <section className="px-4 pb-18 pt-8 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8 lg:pb-24">
        <Container size="wide">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.16fr)_minmax(380px,0.84fr)] xl:items-start">
            <div className="flow flow-xl">
              <Card className="surface-panel overflow-hidden rounded-[34px] border-border/60 bg-white/95 shadow-[0_26px_75px_rgba(15,23,42,0.1)]">
                <div className="grid gap-8 px-6 py-7 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(290px,0.75fr)] lg:gap-10 lg:px-10 lg:py-10">
                  <div id="included-costs" className="flow flow-md">
                    <div className="flow-xs">
                      <Badge className="w-fit bg-transparent text-muted-foreground">A note from us</Badge>
                      <h2 className="max-w-3xl text-section text-[2.1rem] sm:text-[2.5rem]">Published the way guests actually compare value</h2>
                      <p className="max-w-3xl text-body text-[1.02rem] leading-8">
                        Our rates have stayed steady for years while the estate, the rooms, and the guest experience kept improving. What matters most
                        is what is already included once you arrive.
                      </p>
                    </div>

                    <div className="max-w-3xl space-y-5 text-[0.98rem] leading-8 text-foreground/82">
                      <p>
                        For repeat guests, you&apos;ll notice that our rates have remained unchanged for over a decade. During that time, we&apos;ve continued
                        to invest heavily in the property, adding ensuite bathrooms to all rooms, a hot tub, and thoughtful upgrades to elevate the
                        experience.
                      </p>
                      <p>
                        For new guests comparing costs, it&apos;s important to understand what&apos;s included. Your stay comes with a private chef who prepares
                        meals exactly to your preferences, with no grocery markup. For a group of four, dining out for multiple meals per day quickly
                        becomes far more expensive. We also do not add a mandatory service charge.
                      </p>
                      <p>
                        While many guests choose to tip generously, gratuities are always optional and entirely at your discretion. We look forward to
                        creating a truly special vacation for you and your guests.
                      </p>
                    </div>
                  </div>

                  <div className="flow flow-md lg:pt-1">
                    <div className="relative min-h-[240px] overflow-hidden rounded-[30px] border border-border/55 bg-surface-muted shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                      <Image
                        src={IMAGES.villaPool.src}
                        alt={IMAGES.villaPool.alt}
                        fill
                        priority
                        className="object-cover"
                        sizes="(min-width: 1280px) 24vw, 100vw"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,24,0.06)_0%,rgba(7,18,24,0.58)_100%)]" />
                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                        <div className="max-w-xs flow flow-xs text-white">
                          <Badge className="w-fit border-white/18 bg-white/12 text-white backdrop-blur-sm">One group at a time</Badge>
                          <p className="font-serif text-[1.7rem] font-medium leading-tight tracking-tight sm:text-[1.9rem]">
                            Private estate pricing, not a resort menu
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                      {VALUE_HIGHLIGHTS.map(({ title, description, icon: Icon }) => (
                        <div key={title} className="surface-inset rounded-[24px] border border-border/55 bg-surface/85 p-4">
                          <div className="flow-xs">
                            <div className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Icon className="size-4.5" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">{title}</p>
                            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card id="villa-accommodations" className="surface-panel scroll-mt-28 rounded-[32px] border-border/60 bg-white/94 p-6 shadow-[0_22px_65px_rgba(15,23,42,0.08)] sm:p-8">
                <div className="flow-xs">
                  <Badge className="w-fit bg-transparent text-muted-foreground">Villa accommodations</Badge>
                  <div className="max-w-2xl flow-xs">
                    <h2 className="text-section text-[2rem] sm:text-[2.4rem]">Seasonal rates for suites or a fuller villa footprint</h2>
                    <p className="text-body">
                      Choose the footprint that fits your group, then layer in adventures and transport on the right without losing the core stay math.
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {VILLA_SEASONS.map((season) => (
                    <SeasonCard key={season.name} season={season} />
                  ))}
                </div>
              </Card>

              <Card id="main-house-accommodations" className="surface-panel scroll-mt-28 rounded-[32px] border-border/60 bg-white/94 p-6 shadow-[0_22px_65px_rgba(15,23,42,0.08)] sm:p-8">
                <div className="flow-xs">
                  <Badge className="w-fit bg-transparent text-muted-foreground">Main house accommodations</Badge>
                  <div className="max-w-2xl flow-xs">
                    <h2 className="text-section text-[2rem] sm:text-[2.4rem]">Reserved for returning groups who want the full 5-suite setup</h2>
                    <p className="text-body">
                      Repeat guests only. This 5-suite Main House option is best for reunions and larger family groups that already know they want the
                      whole estate flowing as one home base.
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {MAIN_HOUSE_SEASONS.map((season) => (
                    <SeasonCard key={season.name} season={season} />
                  ))}
                </div>
              </Card>

              <Card className="surface-panel overflow-hidden rounded-[32px] border-border/60 bg-white/94 shadow-[0_22px_65px_rgba(15,23,42,0.08)]">
                <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                  <div className="relative min-h-[240px] border-b border-border/50 lg:min-h-full lg:border-b-0 lg:border-r">
                    <Image
                      src={IMAGES.diningRoom.src}
                      alt={IMAGES.diningRoom.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 28vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,18,23,0.05)_0%,rgba(6,18,23,0.54)_100%)]" />
                  </div>
                  <div className="flow flow-md px-6 py-7 sm:px-8 sm:py-8">
                    <div className="flow-xs">
                      <Badge className="w-fit bg-transparent text-muted-foreground">Planning help</Badge>
                      <h2 className="text-section text-[2rem] sm:text-[2.3rem]">Want us to help translate this into a real trip budget?</h2>
                      <p className="text-body">
                        We can help map your dates, suite count, chef expectations, and likely add-ons into a simpler recommendation for your group.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button asChild size="lg">
                        <TrackedLink href="/book" eventName="cta_click" eventPayload={{ location: "rates_planning", target: "/book" }}>
                          Check dates
                          <ArrowUpRight className="size-4" />
                        </TrackedLink>
                      </Button>
                      <Button asChild size="lg" variant="outline" className="border-border/70 bg-white/80">
                        <TrackedLink href="/contact" eventName="cta_click" eventPayload={{ location: "rates_planning", target: "/contact" }}>
                          Ask about your group
                        </TrackedLink>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flow flow-xl xl:sticky xl:top-28">
              <RatesServicesBrowser groups={SERVICE_GROUPS} />

              <section className="flow flow-md">
                <div className="flow-xs">
                  <Badge className="w-fit bg-transparent text-muted-foreground">Guest perspectives</Badge>
                  <div className="max-w-xl flow-xs">
                    <h2 className="text-section text-[2rem] sm:text-[2.35rem]">The pricing lands because the stay feels complete once you&apos;re there</h2>
                    <p className="text-body">
                      These notes tend to mention the same thing: the house, the staff, and the ease of the trip all working together.
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  <PerspectiveCard quote={firstPerspective.quote} author={firstPerspective.author} year={firstPerspective.year} />
                  <PerspectiveCard quote={secondPerspective.quote} author={secondPerspective.author} year={secondPerspective.year} />
                </div>
              </section>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  )
}
