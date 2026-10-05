import type { CSSProperties } from "react"
import Image from "next/image"
import { Anchor, Bike, Droplets, Sailboat, TreePalm, Waves } from "lucide-react"

import { ExperiencesGalleryMosaic } from "@/components/experiences-gallery-mosaic"
import { ExperiencesGuestHighlights } from "@/components/experiences-guest-highlights"
import { ExperiencesHero } from "@/components/experiences-hero"
import { ChapterMark } from "@/components/explore/chapter-mark"
import { DaysFilmstrip, type FilmstripDay } from "@/components/explore/days-filmstrip"
import { ExploreClosingCta } from "@/components/explore/explore-closing-cta"
import { PriceLedger, type LedgerRow } from "@/components/explore/price-ledger"
import { CLIP_UP, RISE } from "@/components/explore/reveal-classes"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Container } from "@/components/layout/container"
import { AmbientVideo } from "@/components/motion/ambient-video"
import { Marquee } from "@/components/motion/marquee"
import { Parallax } from "@/components/motion/parallax"
import { ScrollWordReveal } from "@/components/motion/scroll-word-reveal"
import { SplitText } from "@/components/motion/split-text"
import { PageStructuredData } from "@/components/structured-data"
import { CtaLink } from "@/components/ui/cta-link"
import { IMAGES, imageObjectPosition, type ImageRecord } from "@/lib/images"
import { PAGE_METADATA } from "@/lib/seo"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"
import { cn } from "@/lib/utils"

export const metadata = PAGE_METADATA.experiences

const ACTIVITIES = [
  "Snorkeling",
  "Scuba diving",
  "Paddle boarding",
  "Sea kayaks",
  "Hobie Cat sailing",
  "Bone fishing",
  "Cave tubing",
  "Ziplining",
  "Mayan ruins",
  "Sunset cruises",
  "Wakeboarding",
  "Beach volleyball",
] as const

const INCLUDED = [
  { title: "Snorkel & swim", detail: "Snorkel gear for reef days and the swim platform with slide.", icon: Waves },
  { title: "Pool & hot tub", detail: "Passive solar-heated infinity pool and on-site hot tub.", icon: Droplets },
  { title: "Beach games", detail: "Beach bikes, volleyball, horseshoes, and corn hole.", icon: Bike },
  { title: "Paddle & sail", detail: "Sea kayaks, paddle boards, and a Hobie catamaran.", icon: Sailboat },
  { title: "Docks & crew", detail: "Private docks and on-site staff to help you launch and plan.", icon: Anchor },
  { title: "Shore time", detail: "Shoreline lounging, hammocks, and easy access to San Pedro.", icon: TreePalm },
] as const

const ADD_ON_LEDGER: LedgerRow[] = [
  {
    category: "Diving",
    detail: "Guided reef dives arranged with local crews. Nitrox on request.",
    prices: [
      { value: 100, label: "One-tank trip" },
      { value: 125, label: "Two-tank trip" },
    ],
  },
  {
    category: "Fishing",
    detail: "Guided half-day and full-day trips, or offshore for serious anglers.",
    prices: [
      { value: 275, label: "Half-day" },
      { value: 400, label: "Full-day" },
      { value: 600, label: "Offshore charter" },
    ],
  },
  {
    category: "Private boat",
    detail: "Transfers into San Pedro, or longer runs wherever the day goes.",
    prices: [
      { value: 75, label: "Round-trip to San Pedro" },
      { value: 100, suffix: "/hour", label: "Plus gas" },
    ],
  },
]

const ARRANGED = ["Snuba", "Tubing", "Wakeboarding", "Spa services", "Kid care"] as const

// Studio shot of the infinity pool (2560px), shared with the homepage hero.
const INFINITY_POOL: ImageRecord = {
  src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059670/canarycove-haydeelustudio-521-scaled_ohjnr1.webp",
  alt: "Infinity pool with a yellow umbrella, palms and the sea beyond",
  focal: { x: 42, y: 50 },
}

// Photo budget: every frame here is a 1500px+ original. The low-res reef and
// dock snapshots (800px) stay off this page; the registry alts for
// IMG_2121 / IMG_1127 describe other scenes, so their alts are set here.
const DOCK_SWIM: ImageRecord = {
  src: IMAGES.jungleAdventure.src,
  alt: "Two guests swimming off the Canary Cove dock in clear turquoise water",
  focal: { x: 50, y: 40 },
}

const WEEK: FilmstripDay[] = [
  { ...IMAGES.scubaPhoto, day: "Reef day", caption: "Reef dives and snorkel time, guided by local crews." },
  { ...IMAGES.tubing, focal: { x: 62, y: 50 }, day: "Boat day", caption: "Tubing, wakeboarding and long runs over clear water." },
  { ...DOCK_SWIM, day: "Dock day", caption: "Private dock departures, or stay put with kayaks and the slide." },
  { ...IMAGES.caveTubing, day: "Jungle day", caption: "Cave tubing and ziplining on the mainland." },
  { ...IMAGES.zooVisit, focal: { x: 45, y: 50 }, day: "Wildlife day", caption: "Belize Zoo visits and wildlife-focused day trips." },
  {
    ...IMAGES.logoDrink,
    focal: { x: 84, y: 50 },
    day: "Slow evening",
    caption: "Sunset cruises and calm water, then dinner at the villa.",
  },
]

const ACTIVITY_GALLERY_ITEMS = [
  {
    src: IMAGES.adventureGroup.src,
    alt: "Bartender shaking a cocktail at the outdoor bar with the sea behind",
    focal: { x: 45, y: 45 },
    label: "Cocktails mixed to your timing",
  },
  { ...IMAGES.belizeSign, label: "Belize moments beyond the estate" },
  { ...IMAGES.hammock, label: "Hammock resets between adventures" },
  { ...IMAGES.drinksBar, label: "Nights out in San Pedro" },
  { ...IMAGES.chipsAndDrinks, focal: { x: 45, y: 60 }, label: "Poolside snacks" },
  { ...IMAGES.gilBoat, label: "Out on the water with Gil" },
  { ...IMAGES.wedding, label: "Celebrations by the water" },
  { ...IMAGES.sanPedroWelcome, label: "San Pedro, a short ride away" },
]

const EXPERIENCE_HIGHLIGHTS = [
  {
    quote: TESTIMONIAL_SPOTLIGHTS.experiences[0].quote,
    author: TESTIMONIAL_SPOTLIGHTS.experiences[0].author,
    year: TESTIMONIAL_SPOTLIGHTS.experiences[0].year,
  },
  {
    quote: TESTIMONIAL_SPOTLIGHTS.experiences[1].quote,
    author: TESTIMONIAL_SPOTLIGHTS.experiences[1].author,
    year: TESTIMONIAL_SPOTLIGHTS.experiences[1].year,
  },
] as const

const reveal = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties

function ActivityMarquee() {
  return (
    <div className="border-b border-border/80 bg-sand-light py-6 sm:py-8">
      <p className="sr-only">Activities: {ACTIVITIES.join(", ")}.</p>
      <div aria-hidden="true">
        <Marquee
          duration={70}
          items={ACTIVITIES.map((activity, index) => (
            <span
              key={activity}
              className={cn(
                "font-display text-[2rem] leading-none text-foreground sm:text-[3rem] lg:text-[3.5rem]",
                index % 2 === 1 && "italic text-lagoon",
              )}
            >
              {activity}
            </span>
          ))}
          separator={<span className="mx-6 h-2 w-2 rounded-full bg-canary sm:mx-10" />}
        />
      </div>
    </div>
  )
}

function IncludedChapter() {
  return (
    <section
      id="on-the-water"
      className="py-24 sm:py-32 lg:py-40"
    >
      <Container size="wide">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20 xl:gap-28">
          <div className="relative pb-[12%] lg:sticky lg:top-[calc(var(--site-header-height)+2.5rem)] lg:self-start lg:pb-[14%]">
            <div data-reveal="clip" className="media-frame arch relative aspect-[4/5] w-[84%] sm:w-[70%] lg:w-[86%]">
              <Parallax amount={7}>
                <Image
                  src={INFINITY_POOL.src}
                  alt={INFINITY_POOL.alt}
                  fill
                  sizes="(min-width: 1320px) 480px, (min-width: 1024px) 36vw, (min-width: 640px) 70vw, 84vw"
                  className="object-cover"
                  style={{ objectPosition: imageObjectPosition(INFINITY_POOL) }}
                />
              </Parallax>
            </div>
            <div
              data-reveal="up"
              style={reveal(380)}
              className="absolute bottom-0 right-0 w-[48%] sm:right-[8%] sm:w-[38%] lg:right-0 lg:w-[46%]"
            >
              <div className="media-frame relative aspect-[4/5] shadow-[var(--shadow-lift)] ring-[6px] ring-background sm:ring-8">
                <Image
                  src={IMAGES.bikes.src}
                  alt={IMAGES.bikes.alt}
                  fill
                  sizes="(min-width: 1024px) 20vw, 48vw"
                  className="object-cover"
                  style={{ objectPosition: imageObjectPosition(IMAGES.bikes) }}
                />
              </div>
            </div>
            <span
              aria-hidden="true"
              className="spin-scroll absolute left-[70%] top-[6%] hidden h-24 w-24 sm:block lg:left-[74%]"
            >
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <defs>
                  <path id="included-ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <circle cx="50" cy="50" r="49" className="fill-canary" />
                <text className="fill-ink text-[10.5px] font-semibold uppercase tracking-[0.2em]">
                  <textPath href="#included-ring">On the house · included ·</textPath>
                </text>
              </svg>
            </span>
          </div>

          <div className="flow flow-xl lg:pt-6">
            <ChapterMark index="01" label="On the house" />
            <SplitText as="h2" text="Included with your *stay*" className="text-section max-w-[12ch] text-balance" />
            <p data-reveal="up" className="text-lede max-w-xl">
              The water toys, the pool and the docks come with the estate, kept ready by on-site staff who help you
              launch and plan.
            </p>

            <ol data-reveal="group" className="border-t border-border">
              {INCLUDED.map((item, index) => {
                const Icon = item.icon
                return (
                  <li
                    key={item.title}
                    className={cn(
                      "group grid grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-x-4 border-b border-border py-6 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:py-7",
                      RISE,
                    )}
                    style={{ transitionDelay: `${index * 90}ms` }}
                  >
                    <span
                      aria-hidden="true"
                      className="pt-1 font-display text-2xl italic leading-none text-lagoon tabular transition-colors duration-500 group-hover:text-ink"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flow flow-xs transition-transform duration-700 ease-[var(--ease-out-expo)] md:group-hover:translate-x-2">
                      <h3 className="font-display text-[1.6rem] leading-[1.1] text-foreground sm:text-[1.85rem]">
                        {item.title}
                      </h3>
                      <p className="text-body">{item.detail}</p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="hidden h-12 w-12 items-center justify-center rounded-full border border-border text-lagoon transition-colors duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-canary sm:flex"
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                  </li>
                )
              })}
            </ol>
            <p data-reveal="fade" className="text-sm text-muted-foreground">
              Snorkeling from the estate is complimentary; marine park fees apply on reef trips.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

function AddOnChapter() {
  return (
    <section
      id="diving-fishing"
      className="surface-reef relative isolate overflow-hidden py-24 sm:py-32 lg:py-40"
    >
      <div aria-hidden="true" className="caustics pointer-events-none absolute inset-0 -z-10 opacity-80" />
      <Container size="wide" className="flex flex-col gap-16 sm:gap-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-end lg:gap-20">
          <div className="flow flow-xl">
            <ChapterMark index="02" label="Arranged by the staff" tone="light" />
            <SplitText as="h2" text="Add-on *adventures*" className="text-section max-w-[12ch]" />
            <p data-reveal="up" className="text-lede max-w-xl">
              Power boating, diving, fishing, and mainland excursions are coordinated with Canary Cove staff so your
              group can move seamlessly from dock days to off-property adventures.
            </p>
            <div data-reveal="up" style={reveal(160)} className="flow flow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
                Also arranged on request
              </p>
              <ul className="flex flex-wrap gap-2">
                {ARRANGED.map((item) => (
                  <li key={item} className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/85">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <figure
            data-reveal="clip"
            className="media-frame relative aspect-[4/3]"
            style={{ background: "#0c2428 url(/videos/ambient/manta-loop-poster.jpg) center / cover no-repeat" }}
          >
            <AmbientVideo
              src="/videos/ambient/manta-loop.mp4"
              poster="/videos/ambient/manta-loop-poster.jpg"
              className="absolute inset-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(12,36,40,0.75)_100%)]" />
            <figcaption className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-ink/45 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur-md">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-canary" />
              Manta ray · footage from Canary Cove dives
            </figcaption>
          </figure>
        </div>

        <PriceLedger rows={ADD_ON_LEDGER} tone="light" />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <p data-reveal="fade" className="max-w-md text-xs font-medium uppercase leading-6 tracking-[0.24em] text-white/60">
            Fuel, marine park fees, hot-tub heating, and gratuities are additional
          </p>
          <div data-reveal="up" className="flex flex-wrap items-center gap-3">
            <CtaLink
              href="/rates#additional-services"
              variant="canary"
              eventName="cta_click"
              eventPayload={{ location: "experiences_addons", target: "/rates#additional-services" }}
            >
              See every rate
            </CtaLink>
            <CtaLink href="/adventures#reef-encounters" variant="text-light" arrow="diag">
              Watch the reef films
            </CtaLink>
          </div>
        </div>
      </Container>
    </section>
  )
}

function WeekEndCard() {
  return (
    <div className="flex aspect-[4/5] flex-col justify-between rounded-[var(--radius-media)] bg-ink p-6 text-white sm:p-7">
      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-canary" />
      <div className="flow flow-md">
        <p className="font-display text-[2.25rem] leading-[1.02]">
          Your week, <span className="italic-accent">your pace</span>
        </p>
        <p className="text-sm leading-6 text-white/70">
          Tell us who is coming and what they love. The staff line up boats, guides and timing around you.
        </p>
        <div className="pt-2">
          <CtaLink
            href="/book"
            variant="canary"
            eventName="cta_click"
            eventPayload={{ location: "experiences_week", target: "/book" }}
          >
            Plan your days
          </CtaLink>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <>
      <Header />
      <main tabIndex={-1} id="main-content" className="min-h-screen bg-background outline-none">
      <PageStructuredData path="/experiences" />
      <ExperiencesHero />
      <ActivityMarquee />

      <section aria-label="The rhythm of a stay" className="pb-4 pt-24 sm:pt-32 lg:pb-8 lg:pt-40">
        <Container size="narrow">
          <ScrollWordReveal
            text="Every day starts at the private dock. Stay close with kayaks, paddle boards and the slide, or let the staff line up the reef, the fishing and the mainland. *Your pace, every day.*"
            className="font-display text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.1] text-foreground text-balance"
          />
        </Container>
      </section>

      <IncludedChapter />
      <AddOnChapter />

      <DaysFilmstrip
        id="the-week"
        items={WEEK}
        endCard={<WeekEndCard />}
        heading={
          <div className="flow flow-lg">
            <ChapterMark index="03" label="Shape the week" />
            <SplitText as="h2" text="Six ways to spend a *day*" className="text-section max-w-[14ch] text-balance" />
          </div>
        }
      />

      <div className="bg-sand-light py-24 sm:py-32">
        <Container size="wide">
          <ExperiencesGalleryMosaic items={ACTIVITY_GALLERY_ITEMS} />
        </Container>
      </div>

      <section className="py-24 sm:py-32">
        <Container size="wide">
          <ExperiencesGuestHighlights highlights={EXPERIENCE_HIGHLIGHTS} />
        </Container>
      </section>

      <ExploreClosingCta
        eyebrow="Plan your stay"
        title="Your week, shaped *around the water.*"
        lede="Send your dates and who is coming. The staff coordinate gear, guides and departures from the private dock."
        image={IMAGES.heroVillaDining}
        actions={
          <>
            <CtaLink
              href="/book"
              variant="canary"
              size="lg"
              eventName="cta_click"
              eventPayload={{ location: "experiences_closing", target: "/book" }}
            >
              Check dates
            </CtaLink>
            <CtaLink
              href="/rates"
              variant="outline-light"
              size="lg"
              arrow="none"
              eventName="cta_click"
              eventPayload={{ location: "experiences_closing", target: "/rates" }}
            >
              See rates
            </CtaLink>
          </>
        }
      />
    </main>
      <Footer />
    </>
  )
}
