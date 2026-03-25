import Image from "next/image"
import { Anchor, ArrowUpRight, Compass, House, ShipWheel, Trees } from "lucide-react"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Container } from "@/components/layout/container"
import { PageStructuredData } from "@/components/structured-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { IMAGES } from "@/lib/images"
import { PAGE_METADATA } from "@/lib/seo"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"

export const metadata = PAGE_METADATA.adventures

const ADVENTURE_ZONES = [
  {
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
    image: IMAGES.landAdventure,
    icon: House,
  },
  {
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
    image: IMAGES.sanPedroSouvenirs,
    icon: Anchor,
  },
  {
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
    image: IMAGES.mainlandJaguar,
    icon: Trees,
  },
] as const

const STORY_TILES = [
  {
    type: "quote" as const,
    quote:
      "A piece of heaven on earth. Swimming with sharks, rays, starfish, and conch felt like a dream, and the staff made the entire trip joyful, effortless, and deeply recharging for our family.",
    author: TESTIMONIAL_SPOTLIGHTS.adventures[0].author,
    year: TESTIMONIAL_SPOTLIGHTS.adventures[0].year,
  },
  {
    type: "image" as const,
    image: IMAGES.kidsPlatform,
    caption: "Floating platform afternoons between snorkel runs",
    layout: "standard" as const,
  },
  {
    type: "image" as const,
    image: IMAGES.guestSnorkelGroup,
    caption: "Easy group scuba stops once everyone is in the water",
    layout: "standard" as const,
  },
  {
    type: "quote" as const,
    quote:
      "The scenery is breathtaking, the facilities are fantastic, and the staff's hospitality was the best. Snorkeling, diving, kayaking, paddle boarding, and Hol Chan made this one unforgettable.",
    author: TESTIMONIAL_SPOTLIGHTS.adventures[1].author,
    year: TESTIMONIAL_SPOTLIGHTS.adventures[1].year,
  },
  {
    type: "image" as const,
    image: IMAGES.divingFun,
    caption: "First reef-drop moments become the stories everybody keeps telling",
    layout: "wide" as const,
  },
] as const

function AdventureZoneCard({
  title,
  eyebrow,
  description,
  bullets,
  image,
  icon: Icon,
}: (typeof ADVENTURE_ZONES)[number]) {
  return (
    <Card className="surface-panel overflow-hidden rounded-[30px] border-border/60 bg-white/94 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
      <div className="relative aspect-[1.65] overflow-hidden border-b border-border/55 bg-surface-muted">
        <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="(min-width: 1024px) 30vw, 100vw" />
      </div>
      <div className="flow px-6 pb-6 pt-5 sm:px-7 sm:pb-7">
        <div className="flow-xs">
          <div className="flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            <Icon className="size-3.5" />
            <span>{eyebrow}</span>
          </div>
          <h2 className="text-[1.55rem] font-semibold tracking-tight text-foreground sm:text-[1.7rem]">{title}</h2>
          <p className="text-sm leading-7 text-muted-foreground">{description}</p>
        </div>

        <ul className="grid gap-3 text-sm leading-6 text-foreground/88">
          {bullets.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

function StoryTile({ tile }: { tile: (typeof STORY_TILES)[number] }) {
  if (tile.type === "image") {
    const isWide = tile.layout === "wide"

    return (
      <Card className={`group relative overflow-hidden rounded-[26px] border-border/60 bg-white/90 ${isWide ? "sm:col-span-2" : ""}`}>
        <div className={`relative min-h-[220px] sm:min-h-[248px] ${isWide ? "aspect-[1.85]" : "aspect-[1.05]"}`}>
          <Image
            src={tile.image.src}
            alt={tile.image.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes={isWide ? "(min-width: 1280px) 40vw, (min-width: 640px) 48vw, 100vw" : "(min-width: 640px) 24vw, 100vw"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className={`text-sm font-medium leading-6 text-white ${isWide ? "max-w-[24rem]" : "max-w-[16rem]"}`}>{tile.caption}</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="surface-inset flex min-h-[220px] flex-col justify-between rounded-[26px] border-border/55 bg-white/92 p-5 sm:min-h-[248px] sm:p-6">
      <div className="flow-sm">
        <div className="flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          <Compass className="size-3.5" />
          <span>Guest note</span>
        </div>
        <p className="text-sm leading-7 text-foreground/88">“{tile.quote}”</p>
      </div>
      <div className="pt-5 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
        {tile.author} · {tile.year}
      </div>
    </Card>
  )
}

export default function Page() {
  return (
    <main id="main-content" className="min-h-screen bg-[linear-gradient(180deg,#f7f2e9_0%,#f1eadf_22%,#f7f2e8_100%)]">
      <PageStructuredData path="/adventures" />
      <Header />

      <section className="relative isolate overflow-hidden border-b border-border/45 bg-foreground/10">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059662/Canary-Cove-Villa-Private-Luxury-Beachfront_volg74.webp"
            alt="Canary Cove beachfront villa with turquoise water and palms on Ambergris Caye"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,23,33,0.28)_0%,rgba(8,23,33,0.42)_48%,rgba(8,23,33,0.52)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,23,33,0.14)_65%,rgba(8,23,33,0.35)_100%)]" />
        </div>

        <Container
          size="wide"
          className="relative flex min-h-[390px] items-center justify-center pb-28 pt-28 text-center sm:min-h-[440px] sm:pb-32 sm:pt-32 lg:min-h-[500px] lg:pb-40"
        >
          <div className="max-w-3xl flow flow-md text-white">
            <div className="flex items-center justify-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.36em] text-white/80">
              <ShipWheel className="size-4" />
              <span>Ambergris Caye and beyond</span>
            </div>
            <div className="flow-xs">
              <h1 className="font-serif text-[3rem] font-medium tracking-tight text-white sm:text-[4.2rem] lg:text-[4.9rem]">
                Belize Adventures
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-7 text-white/84 sm:text-lg sm:leading-8">
                Discover the best of land, sea, and island town life with a private dock, trusted local crews, and a staff that
                can shape each day around your group.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative z-10 -mt-20 px-4 pb-12 sm:px-6 lg:-mt-24 lg:px-8">
        <Container size="wide">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-7">
            {ADVENTURE_ZONES.map((zone) => (
              <AdventureZoneCard key={zone.title} {...zone} />
            ))}
          </div>
        </Container>
      </section>

      <section className="px-4 pb-16 pt-6 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <Container size="wide" className="flow flow-xl">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-start">
            <div className="flow flow-md">
              <div className="flow-xs">
                <Badge className="w-fit bg-transparent text-muted-foreground">Featured adventure</Badge>
                <div className="max-w-2xl flow flow-xs">
                  <h2 className="text-section text-[2.25rem] sm:text-[2.7rem]">Private reef days planned around your group</h2>
                  <p className="text-body max-w-xl">
                    Start with snorkeling or scuba straight from the dock, then layer in tubing, sandbar time, or mainland add-ons
                    as the group&apos;s energy changes.
                  </p>
                </div>
              </div>

              <Card className="group relative overflow-hidden rounded-[32px] border-border/55 bg-foreground text-white shadow-[0_28px_80px_rgba(15,23,42,0.18)]">
                <div className="relative min-h-[360px] sm:min-h-[420px]">
                  <Image
                    src={IMAGES.scubaPhoto.src}
                    alt={IMAGES.scubaPhoto.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(min-width: 1280px) 46vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,16,22,0.08)_5%,rgba(5,16,22,0.4)_45%,rgba(5,16,22,0.82)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <div className="max-w-[34rem] flow flow-sm">
                      <div className="flex flex-wrap gap-2">
                        <Badge className="border-white/20 bg-white/12 text-white backdrop-blur-sm">Hol Chan to mainland</Badge>
                        <Badge className="border-white/20 bg-white/12 text-white backdrop-blur-sm">Staff-coordinated</Badge>
                      </div>
                      <div className="flow-xs">
                        <h3 className="font-serif text-[2rem] font-medium tracking-tight sm:text-[2.35rem]">
                          Reef, snorkel, and scuba days without the logistics headache
                        </h3>
                        <p className="max-w-2xl text-sm leading-7 text-white/82 sm:text-base">
                          Canary Cove handles the timing, dock departures, and local coordination so the day feels easy whether
                          you&apos;re chasing turtles, planning a family snorkel, or adding a mainland excursion.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3 pt-1">
                        <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90">
                          <TrackedLink
                            href="/book"
                            eventName="cta_click"
                            eventPayload={{ location: "adventures_feature", target: "/book" }}
                          >
                            Start planning
                            <ArrowUpRight className="size-4" />
                          </TrackedLink>
                        </Button>
                        <Button
                          asChild
                          size="lg"
                          variant="outline"
                          className="border-white/24 bg-white/8 text-white hover:bg-white hover:text-foreground"
                        >
                          <TrackedLink
                            href="/rates"
                            eventName="cta_click"
                            eventPayload={{ location: "adventures_feature", target: "/rates" }}
                          >
                            View rates
                          </TrackedLink>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flow flow-md">
              <div className="flow-xs">
                <Badge className="w-fit bg-transparent text-muted-foreground">Guest adventures & stories</Badge>
                <div className="max-w-xl flow flow-xs">
                  <h2 className="text-section text-[2rem] sm:text-[2.4rem]">How it actually feels once you&apos;re here</h2>
                  <p className="text-body">
                    The guestbook says the same thing again and again: the water is unreal, the staff makes the trip effortless,
                    and every family finds its own version of adventure.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {STORY_TILES.map((tile, index) => (
                  <StoryTile
                    key={tile.type === "quote" ? `${tile.author}-${tile.year}` : `${tile.caption}-${index}`}
                    tile={tile}
                  />
                ))}
              </div>

              <Card className="surface-inset rounded-[28px] border-border/55 bg-white/88 p-5 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
                  <div className="flow-xs">
                    <p className="text-[0.7rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">Dock departures</p>
                    <p className="text-sm leading-6 text-foreground/86">
                      Private water access makes reef days, fishing, and town runs easier from the start.
                    </p>
                  </div>
                  <div className="flow-xs">
                    <p className="text-[0.7rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">Custom pacing</p>
                    <p className="text-sm leading-6 text-foreground/86">
                      Keep things slow with pool afternoons or stack the itinerary with mainland excursions.
                    </p>
                  </div>
                  <div className="flow-xs">
                    <p className="text-[0.7rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">Local crews</p>
                    <p className="text-sm leading-6 text-foreground/86">
                      Dive guides, drivers, and tour partners are coordinated around your group&apos;s comfort level.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  )
}
