import type { CSSProperties } from "react"
import Image from "next/image"
import { Anchor, House, Trees } from "lucide-react"

import { ChapterMark } from "@/components/explore/chapter-mark"
import { ExploreClosingCta } from "@/components/explore/explore-closing-cta"
import { ExploreHeading } from "@/components/explore/explore-heading"
import { PriceLedger } from "@/components/explore/price-ledger"
import { CLIP_UP, DRAW_X, RISE } from "@/components/explore/reveal-classes"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Container } from "@/components/layout/container"
import { Parallax } from "@/components/motion/parallax"
import { SplitText } from "@/components/motion/split-text"
import { PageHero } from "@/components/page-hero"
import { ReefEncounters } from "@/components/reef-encounters"
import { PageStructuredData } from "@/components/structured-data"
import { CtaLink } from "@/components/ui/cta-link"
import { IMAGES, imageObjectPosition, type ImageRecord } from "@/lib/images"
import { PAGE_METADATA } from "@/lib/seo"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"
import { cn } from "@/lib/utils"

export const metadata = PAGE_METADATA.adventures

const ADVENTURE_ZONES = [
  {
    id: "at-canary-cove",
    title: "At Canary Cove",
    eyebrow: "On-property play",
    description:
      "Start with the things that make the estate feel easy: dock departures, beach gear, pool time, and enough outdoor setup to keep every age occupied between bigger outings.",
    bullets: [
      "Bikes for beach cruising and golf-cart runs into town.",
      "Volleyball, corn hole, horseshoes, and space to move.",
      "Paddle boards, kayaks, and dock time right out front.",
      "Staff on hand to help line up gear, boats, and timing.",
    ],
    image: IMAGES.bikes,
    icon: House,
  },
  {
    id: "san-pedro",
    title: "In San Pedro Town",
    eyebrow: "Easy island access",
    description:
      "A quick ride from the private dock gets your group into the rhythm of Ambergris Caye for shopping, beach bars, easy lunches, and afternoons that stay flexible.",
    bullets: [
      "Water taxis run from the dock every two hours.",
      "Town is walkable for shops, cafes, and beach bars.",
      "Ice cream stops, local handicrafts, and beach park hangouts.",
      "Head back to the villa whenever the pace shifts.",
    ],
    image: IMAGES.drinksBar,
    icon: Anchor,
  },
  {
    // Redirect target: /adventures/day-trips → /adventures#day-trips
    id: "day-trips",
    title: "Mainland Belize",
    eyebrow: "Day trips and beyond",
    description:
      "When your crew wants something wilder, Canary Cove can arrange private day trips and custom mainland adventures with trusted Belize partners.",
    bullets: [
      "Cave tubing and ziplining in the jungle.",
      "Belize Zoo visits and wildlife-focused day trips.",
      "Mayan ruins, Belize City, and overnight add-ons.",
      "Private helicopter and charter options by request.",
    ],
    image: IMAGES.zooVisit,
    icon: Trees,
  },
] as const

const BOAT_SERVICES = [
  { service: "Arrival & departure transfers", detail: "Free boat transfers to and from the estate.", price: "Included" },
  { service: "Vern to San Pedro", detail: "Round-trip travel to town on our 30-foot boat, Vern.", price: "$75" },
  {
    service: "Long trip adventures",
    detail: "Extended excursions for custom island runs and flexible itineraries.",
    price: "$100/hr + fuel",
  },
] as const

const PACING_NOTES = [
  {
    title: "Dock departures",
    text: "Private water access makes reef days, fishing, and town runs easier from the start.",
  },
  {
    title: "Custom pacing",
    text: "Keep things slow with pool afternoons or stack the itinerary with mainland excursions.",
  },
  {
    title: "Local crews",
    text: "Dive guides, drivers, and tour partners are coordinated around your group's comfort level.",
  },
] as const

// IMG_2121's registry alt describes a jungle trip; the frame is a dock swim.
const DOCK_SWIM: ImageRecord = {
  src: IMAGES.jungleAdventure.src,
  alt: "Two guests swimming off the Canary Cove dock in clear turquoise water",
  focal: { x: 50, y: 40 },
}

// Registry alts for these two describe other scenes; the frames show a guest
// holding up a lionfish and divers on a lionfish hunt.
const FISHING_SNAPSHOTS = [
  {
    image: { src: IMAGES.fishingTrophy.src, alt: "Guest holding up a lionfish catch" },
    caption: "Showing off the catch",
  },
  {
    image: { src: IMAGES.lionFishCatch.src, alt: "Divers hunting lionfish over the reef" },
    caption: "Lionfish hunting on the reef",
  },
] as const

const STORY_IMAGES = [
  { image: IMAGES.kidsPlatform, caption: "Floating platform afternoons between snorkel runs" },
  { image: IMAGES.guestSnorkelGroup, caption: "Easy group scuba stops once everyone is in the water" },
  { image: IMAGES.divingFun, caption: "First reef-drop moments become the stories everybody keeps telling" },
] as const

const GUEST_STORIES = TESTIMONIAL_SPOTLIGHTS.adventures

function MediaFrame({
  image,
  className,
  sizes,
  amount = 6,
}: {
  image: ImageRecord
  className?: string
  sizes: string
  amount?: number
}) {
  return (
    <div className={cn("media-frame relative", className)}>
      <Parallax amount={amount}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: imageObjectPosition(image) }}
        />
      </Parallax>
    </div>
  )
}

/**
 * Three zones as open editorial rows: a parallax photograph and the copy,
 * alternating sides, separated by hairlines that draw in. No boxed cards —
 * nothing here is clickable.
 */
function ZoneRows() {
  return (
    <ol className="flex flex-col">
      {ADVENTURE_ZONES.map((zone, index) => {
        const Icon = zone.icon
        return (
          <li
            key={zone.id}
            id={zone.id}
            data-reveal="group"
            className="relative scroll-mt-[calc(var(--site-header-height)+1.5rem)] py-12 first:pt-0 sm:py-16 lg:py-20"
          >
            {index > 0 ? (
              <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-px bg-border", DRAW_X)} />
            ) : null}
            {/* Even columns keep each photo under ~575px: drinksBar is a 1331px original. */}
            <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12 lg:gap-20">
              <div className={cn("media-frame relative aspect-[4/3] md:aspect-[5/4]", CLIP_UP, index % 2 === 1 && "md:order-2")}>
                <div className="zoom-media absolute inset-0">
                  <Parallax amount={5}>
                    <Image
                      src={zone.image.src}
                      alt={zone.image.alt}
                      fill
                      sizes="(min-width: 1320px) 572px, (min-width: 768px) 46vw, 100vw"
                      className="object-cover"
                      style={{ objectPosition: imageObjectPosition(zone.image) }}
                    />
                  </Parallax>
                </div>
              </div>
              <div className="flow flow-lg">
                <div className={cn("flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground", RISE)}>
                  <span aria-hidden="true" className="font-display text-xl normal-case italic tracking-normal text-lagoon tabular">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Icon aria-hidden="true" className="size-4 text-lagoon" strokeWidth={1.75} />
                  <span>{zone.eyebrow}</span>
                </div>
                <h3
                  className={cn("font-display text-[2.25rem] leading-[1.02] text-foreground sm:text-[3rem]", RISE)}
                  style={{ transitionDelay: "80ms" }}
                >
                  {zone.title}
                </h3>
                <p className={cn("text-body max-w-lg", RISE)} style={{ transitionDelay: "160ms" }}>
                  {zone.description}
                </p>
                <ul className="border-t border-border">
                  {zone.bullets.map((bullet, bulletIndex) => (
                    <li
                      key={bullet}
                      className={cn("flex gap-3 border-b border-border py-3 text-[15px] leading-6 text-foreground/85", RISE)}
                      style={{ transitionDelay: `${220 + bulletIndex * 70}ms` }}
                    >
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lagoon" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

// Guest snapshots are 400–800px originals: shown at snapshot size (≤ 240px)
// so they stay crisp on retina screens.
function GuestSnapshots() {
  return (
    <ul
      data-reveal="group"
      tabIndex={0}
      aria-label="Guest adventure photos"
      className="focus-ring no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-6 px-6 sm:mx-0 sm:grid sm:max-w-[38rem] sm:grid-cols-3 sm:overflow-visible sm:px-0"
    >
      {STORY_IMAGES.map((photo, index) => (
        <li
          key={photo.caption}
          className={cn("w-[62vw] max-w-[15rem] shrink-0 snap-start sm:w-auto", RISE)}
          style={{ transitionDelay: `${index * 110}ms` }}
        >
          <figure className="group flow flow-sm">
            <div className="media-frame zoom-media relative aspect-[4/3]">
              <Image
                src={photo.image.src}
                alt={photo.image.alt}
                fill
                sizes="(min-width: 640px) 200px, 62vw"
                className="object-cover"
              />
            </div>
            <figcaption className="text-[13px] leading-5 text-muted-foreground">{photo.caption}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

export default function Page() {
  return (
    <>
      <Header />
      <main tabIndex={-1} id="main-content" className="min-h-screen bg-background outline-none">
      <PageStructuredData path="/adventures" />

      <PageHero
        eyebrow="Adventures · Ambergris Caye"
        title="Belize adventures, from the reef to the *jungle*"
        lede="Discover the best of land, sea, and island town life with a private dock, trusted local crews, and a staff that can shape each day around your group."
        actions={
          <>
            <CtaLink
              href="/book"
              size="lg"
              className="w-full justify-between sm:w-auto"
              eventName="cta_click"
              eventPayload={{ location: "adventures_hero", target: "/book" }}
            >
              Start planning
            </CtaLink>
            <CtaLink href="#reef-encounters" variant="outline" size="lg" arrow="none" className="w-full sm:w-auto">
              Watch the reef films
            </CtaLink>
          </>
        }
        facts={[
          { label: "Reef dives", value: "from $100" },
          { label: "Fishing", value: "from $275" },
          { label: "Water taxis", value: "every 2 hrs" },
          { label: "Departures", value: "Private dock" },
        ]}
        image={{ src: IMAGES.scubaPhoto.src, alt: IMAGES.scubaPhoto.alt, focal: { x: 50, y: 45 } }}
      />

      <section className="pb-24 sm:pb-32 lg:pb-40">
        <Container size="wide" className="flex flex-col gap-14 sm:gap-20">
          <div className="flow flow-lg">
            <ChapterMark index="01" label="Above water" />
            <ExploreHeading
              title="Land, sea and island *town*"
              align="split"
              lede="Three ways out the door, all starting from the private dock. Mix them however your group likes."
            />
          </div>
          <ZoneRows />
        </Container>
      </section>

      <section id="diving" className="scroll-mt-[var(--site-header-height)] bg-sand-light py-24 sm:py-32 lg:py-40">
        <Container size="wide">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-24">
            <div className="relative pb-[18%] pr-[14%]">
              <div data-reveal="clip">
                <MediaFrame image={DOCK_SWIM} className="aspect-[5/4]" sizes="(min-width: 1320px) 530px, (min-width: 1024px) 40vw, 86vw" />
              </div>
              <div
                data-reveal="up"
                style={{ "--reveal-delay": "320ms" } as CSSProperties}
                className="absolute bottom-0 right-0 w-[46%] max-w-[17.5rem]"
              >
                <div className="media-frame relative aspect-square shadow-[var(--shadow-lift)] ring-[6px] ring-sand-light sm:ring-8">
                  <Image
                    src={IMAGES.turtleDive.src}
                    alt={IMAGES.turtleDive.alt}
                    fill
                    sizes="(min-width: 640px) 280px, 46vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="flow flow-xl">
              <ChapterMark index="02" label="Featured adventure" />
              <SplitText
                as="h2"
                text="Private reef days planned around your *group*"
                className="text-section max-w-[14ch] text-balance"
              />
              <div data-reveal="group" className="flow flow-md">
                <p className={cn("text-lede max-w-xl", RISE)}>
                  Start with snorkeling or scuba straight from the dock, then layer in tubing, sandbar time, or mainland
                  add-ons as the group&apos;s energy changes.
                </p>
                <p className={cn("text-body max-w-xl", RISE)} style={{ transitionDelay: "120ms" }}>
                  Reef, snorkel, and scuba days without the logistics headache. Canary Cove handles the timing, dock
                  departures, and local coordination so the day feels easy whether you&apos;re chasing turtles,
                  planning a family snorkel, or adding a mainland excursion.
                </p>
                <ul className={cn("flex flex-wrap gap-2 pt-1", RISE)} style={{ transitionDelay: "200ms" }}>
                  {["Hol Chan to mainland", "Staff-coordinated"].map((tag) => (
                    <li key={tag} className="rounded-full border border-ink/15 px-4 py-2 text-[13px] text-foreground/80">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
              <PriceLedger
                rows={[
                  {
                    category: "Scuba",
                    detail: "Guided by local crews. Snorkeling with gear is complimentary; park fees apply.",
                    prices: [
                      { value: 100, label: "One tank" },
                      { value: 125, label: "Two tank" },
                    ],
                  },
                ]}
              />
              <div data-reveal="up" className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <CtaLink
                  href="/book"
                  className="w-full justify-between sm:w-auto"
                  eventName="cta_click"
                  eventPayload={{ location: "adventures_feature", target: "/book" }}
                >
                  Start planning
                </CtaLink>
                <CtaLink
                  href="/rates"
                  variant="outline"
                  arrow="none"
                  className="w-full sm:w-auto"
                  eventName="cta_click"
                  eventPayload={{ location: "adventures_feature", target: "/rates" }}
                >
                  View rates
                </CtaLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <ReefEncounters />

      <section id="fishing" className="scroll-mt-[var(--site-header-height)] py-24 sm:py-32 lg:py-40">
        <Container size="wide" className="flex flex-col gap-14 sm:gap-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-end lg:gap-20">
            <div className="flow flow-xl">
              <ChapterMark index="04" label="Fishing" />
              <SplitText as="h2" text="Reef and offshore *fishing*" className="text-section max-w-[12ch] text-balance" />
              <p data-reveal="up" className="text-lede max-w-xl">
                Guided days in Belize&apos;s rich fishing waters, from a half-day on the reef to an offshore deep-sea
                run for serious anglers. Boats leave from the private dock.
              </p>
            </div>
            {/* Guest snapshots (640–768px originals): kept at snapshot size so
                they stay sharp on retina screens. */}
            <div data-reveal="group" className="grid max-w-[36rem] grid-cols-2 gap-3 sm:gap-5 lg:justify-self-end">
              {FISHING_SNAPSHOTS.map((shot, index) => (
                <figure
                  key={shot.image.src}
                  className={cn("flow flow-sm", RISE, index === 1 && "pt-10 sm:pt-16")}
                  style={{ transitionDelay: `${index * 140}ms` }}
                >
                  <div className="media-frame relative aspect-[3/2]">
                    <Image
                      src={shot.image.src}
                      alt={shot.image.alt}
                      fill
                      sizes="(min-width: 640px) 280px, 45vw"
                      className="object-cover"
                      style={{ objectPosition: imageObjectPosition(shot.image) }}
                    />
                  </div>
                  <figcaption className="text-[13px] leading-5 text-muted-foreground">{shot.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
          <PriceLedger
            rows={[
              {
                category: "Guided fishing",
                detail: "Replacement tackle billed at cost if needed.",
                prices: [
                  { value: 275, label: "Half-day adventure" },
                  { value: 400, label: "Full-day excursion" },
                  { value: 600, label: "Deep-sea offshore, per day" },
                ],
              },
            ]}
          />
        </Container>
      </section>

      <section id="boats-crew" className="scroll-mt-[var(--site-header-height)]">
        <Container size="wide">
          <div className="grid gap-12 border-t border-border pt-16 sm:pt-20 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-16 lg:pt-24">
            <div className="flow flow-xl">
              <ChapterMark index="05" label="Boats & crew" />
              <SplitText as="h2" text="The dock is where every day *begins*" className="text-section max-w-[12ch] text-balance" />
              <p data-reveal="up" className="text-lede max-w-xl">
                Transfers, town runs and longer days on the water all leave from the private dock, with a crew that
                knows these waters.
              </p>
            </div>
            {/* gilBoat is a soft snapshot: never wider than ~460px. */}
            <figure data-reveal="clip" className="flow flow-sm w-full max-w-[28rem] md:w-[clamp(18rem,32vw,28rem)]">
              <MediaFrame image={IMAGES.gilBoat} className="aspect-[4/5]" sizes="(min-width: 768px) 448px, 92vw" amount={5} />
              <figcaption className="text-[13px] leading-5 text-muted-foreground">Gil at the bow, heading out</figcaption>
            </figure>
          </div>
        </Container>

        <Container size="wide" className="py-20 sm:py-28">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-20">
            <ul>
              {BOAT_SERVICES.map((item, index) => (
                <li
                  key={item.service}
                  data-reveal="group"
                  className="relative grid gap-2 py-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-10"
                >
                  <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-px bg-border", DRAW_X)} />
                  <div className={cn("flow flow-xs", RISE)} style={{ transitionDelay: `${index * 60}ms` }}>
                    <h3 className="font-display text-[1.6rem] leading-tight text-foreground sm:text-[1.9rem]">{item.service}</h3>
                    <p className="text-body">{item.detail}</p>
                  </div>
                  <p
                    className={cn(
                      "font-display text-[1.75rem] leading-none tabular sm:text-right sm:text-[2.25rem]",
                      item.price === "Included" ? "italic text-lagoon" : "text-foreground",
                      RISE,
                    )}
                    style={{ transitionDelay: `${120 + index * 60}ms` }}
                  >
                    {item.price}
                  </p>
                </li>
              ))}
              <li aria-hidden="true" className="h-px bg-border" />
            </ul>

            <div className="flow flow-xl">
              {PACING_NOTES.map((note, index) => (
                <div key={note.title} data-reveal="group" className="flex gap-5">
                  <span
                    aria-hidden="true"
                    className={cn("font-display text-2xl italic leading-none text-lagoon tabular", RISE)}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className={cn("flow flow-xs", RISE)} style={{ transitionDelay: "100ms" }}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground">{note.title}</p>
                    <p className="text-body">{note.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-sand-light py-24 sm:py-32 lg:py-40">
        <Container size="wide" className="flex flex-col gap-14 sm:gap-20">
          <div className="flow flow-lg">
            <ChapterMark index="06" label="Guest adventures & stories" />
            <ExploreHeading
              title="How it actually feels once you're *here*"
              align="split"
              lede="The guestbook says the same thing again and again: the water is unreal, the staff makes the trip effortless, and every family finds its own version of adventure."
            />
          </div>

          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            {GUEST_STORIES.map((story, index) => (
              <div key={`${story.author}-${story.year}`} className={cn("flow flow-xl min-w-0", index === 1 && "lg:mt-24")}>
                <figure
                  data-reveal="group"
                  className="flow flow-lg"
                >
                  <span aria-hidden="true" className={cn("block h-10 font-display text-[5.5rem] leading-[0.9] text-canary", RISE)}>
                    &ldquo;
                  </span>
                  <blockquote
                    className={cn("font-display text-[1.35rem] leading-[1.4] text-foreground sm:text-[1.55rem]", RISE)}
                    style={{ transitionDelay: "120ms" }}
                  >
                    <p>{story.quote}</p>
                  </blockquote>
                  <figcaption
                    className={cn("flex items-center gap-3 border-t border-border pt-5 text-sm", RISE)}
                    style={{ transitionDelay: "220ms" }}
                  >
                    <span className="font-medium text-foreground">{story.author}</span>
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-canary-deep" />
                    <span className="text-muted-foreground tabular">{story.year}</span>
                  </figcaption>
                </figure>

                {index === 0 ? <GuestSnapshots /> : null}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <ExploreClosingCta
        eyebrow="Plan your stay"
        title="Pick the *adventures.* We’ll line up the boats."
        lede="Send your dates and the kind of days your group wants. The staff coordinate dive guides, drivers, and tour partners around you."
        image={IMAGES.heroBackgroundEstate}
        actions={
          <>
            <CtaLink
              href="/book"
              variant="canary"
              size="lg"
              eventName="cta_click"
              eventPayload={{ location: "adventures_closing", target: "/book" }}
            >
              Start planning
            </CtaLink>
            <CtaLink
              href="/experiences"
              variant="outline-light"
              size="lg"
              arrow="none"
              eventName="cta_click"
              eventPayload={{ location: "adventures_closing", target: "/experiences" }}
            >
              What&apos;s included
            </CtaLink>
          </>
        }
      />
    </main>
      <Footer />
    </>
  )
}
