import type { CSSProperties } from "react"
import Image from "next/image"
import { CakeSlice, Coffee, Martini, Moon, Ship, Utensils } from "lucide-react"

import { DiningServiceLedger } from "@/components/dining-service-ledger"
import { ChapterMark } from "@/components/explore/chapter-mark"
import { ExploreClosingCta } from "@/components/explore/explore-closing-cta"
import { ExploreHeading } from "@/components/explore/explore-heading"
import { MealTimeline, type MealStop } from "@/components/explore/meal-timeline"
import { RISE } from "@/components/explore/reveal-classes"
import { Footer } from "@/components/footer"
import { GalleryGrid } from "@/components/gallery-grid"
import { Header } from "@/components/header"
import { Container } from "@/components/layout/container"
import { Parallax } from "@/components/motion/parallax"
import { ScrollWordReveal } from "@/components/motion/scroll-word-reveal"
import { SplitText } from "@/components/motion/split-text"
import { PageStructuredData } from "@/components/structured-data"
import { CtaLink } from "@/components/ui/cta-link"
import { IMAGES, imageObjectPosition } from "@/lib/images"
import { PAGE_METADATA } from "@/lib/seo"
import { cn } from "@/lib/utils"

export const metadata = PAGE_METADATA.dining

const DINING_ANCHORS = [
  { label: "How dining works", href: "#how-dining-works" },
  { label: "The table", href: "#the-table" },
  { label: "Photo gallery", href: "#dining-gallery" },
  { label: "Guest notes", href: "#dining-notes" },
  { label: "Plan your stay", href: "#dining-plan" },
] as const

const DINING_BASICS = [
  { label: "Private chef", value: "Lunches & dinners daily" },
  { label: "Groceries", value: "Stocked before arrival · at cost" },
  { label: "Table", value: "Villa, dock, beach & boat days" },
  { label: "Drinks", value: "Rum punch & Lava Cake fame" },
] as const

const DAY_AT_THE_TABLE: MealStop[] = [
  {
    // Redirect target: /dining/breakfast → /dining#breakfast-snacks
    id: "breakfast-snacks",
    time: "Morning",
    title: "Breakfasts & snacks",
    body: "The kitchen arrives stocked for self-serve mornings and grazing between meals.",
    image: IMAGES.viewFromKitchen,
    icon: <Coffee className="h-4 w-4" strokeWidth={1.75} />,
  },
  {
    time: "Midday",
    title: "Lunch, wherever you land",
    body: "Cooked by the chef and served in the villa dining room, on the pool deck, at the dock, or packed for the boat.",
    image: IMAGES.diningSpread,
    icon: <Utensils className="h-4 w-4" strokeWidth={1.75} />,
  },
  {
    time: "Golden hour",
    title: "Sundowners by the pool",
    body: "Cold drinks and rum punch without leaving the water. The dockside rum punch is remembered by name in the guestbooks.",
    image: IMAGES.logoDrink,
    icon: <Martini className="h-4 w-4" strokeWidth={1.75} />,
  },
  {
    time: "Evening",
    title: "Dinner where the day lands",
    body: "Long villa table, dock at sunset, or barefoot on the sand — the setting follows the mood, and staff handle the cleanup.",
    image: IMAGES.shrimpDinner,
    icon: <Moon className="h-4 w-4" strokeWidth={1.75} />,
  },
  {
    // Redirect target: /dining/special-moments → /dining#special-moments
    id: "special-moments",
    time: "Any night",
    title: "Celebrations",
    body: "Milestone dinners for birthdays, anniversaries, and reunions. Save room: the Lava Cake is the dessert guests remember by name.",
    image: IMAGES.diningTable,
    icon: <CakeSlice className="h-4 w-4" strokeWidth={1.75} />,
  },
  {
    // Redirect target: /dining/eating-out → /dining#eating-out
    id: "eating-out",
    time: "Night out",
    title: "Dinner in San Pedro",
    body: "When the group wants a night in town, our 30-foot boat runs you in and back ($75 round-trip), and water taxis leave from the dock every two hours.",
    image: IMAGES.drinksBar,
    icon: <Ship className="h-4 w-4" strokeWidth={1.75} />,
  },
]

// Chef Marvin appears twice on this page (hero inset + "How dining works"),
// so the gallery sticks to the kitchen, the food and the bar. Wide editorial
// slots (the full-width closer, the 2-column tiles) get the sharpest files.
const DINING_GALLERY_GROUPS = [
  {
    eyebrow: "Group one",
    heading: "Kitchen & table",
    photos: [
      { ...IMAGES.viewFromKitchen, caption: "Kitchen island" },
      { ...IMAGES.diningSpread, caption: "The full spread" },
      { ...IMAGES.diningFoodDetail, caption: "Dinner details" },
      { ...IMAGES.diningDetailTwo, caption: "From the kitchen" },
      { ...IMAGES.diningDetailThree, caption: "Plated for guests" },
      { ...IMAGES.diningRoom, caption: "The dining room" },
    ],
  },
  {
    eyebrow: "Group two",
    heading: "From the pass",
    photos: [
      { ...IMAGES.dinnerPlated, caption: "Plated dinner" },
      { ...IMAGES.dinnerAlt, caption: "Dinner service" },
      { ...IMAGES.shrimpDinner, caption: "Shrimp dinner" },
      { ...IMAGES.diningPlatter, caption: "Chef's platter" },
      { ...IMAGES.saladAlt, caption: "Fresh salad" },
      { ...IMAGES.tacosAlt, caption: "Taco spread" },
      { ...IMAGES.caramba, caption: "Caramba night" },
      { ...IMAGES.diningTable, caption: "Mini cheesecakes" },
    ],
  },
  {
    eyebrow: "Group three",
    heading: "Sundowners",
    photos: [
      { ...IMAGES.logoDrink, focal: { x: 84, y: 50 }, caption: "House pour" },
      { ...IMAGES.romanticViews, caption: "Golden hour" },
      { ...IMAGES.drinksBar, caption: "Night out in town" },
      { ...IMAGES.chipsAndDrinks, caption: "Poolside snacks" },
    ],
  },
]

const GALLERY_PHOTO_COUNT = DINING_GALLERY_GROUPS.reduce((total, group) => total + group.photos.length, 0)

const DINING_NOTES = [
  {
    quote:
      "What a perfect vacation! The house is wonderful, staff beyond our wildest dreams, dining like no other! Thank you for one of the most memorable vacations of our lives. We will be back for sure.",
    author: "Bernthal/Stambaugh family",
    year: "2024",
  },
  {
    quote:
      "Thanks so much for taking such amazing care of us at all points. And the food was AMAZING!!",
    author: "Art",
    year: "2017",
  },
  {
    quote:
      "Thank you SO much for making us have an amazing trip! I will always remember the Lava Cake!",
    author: "Ben",
    year: "2017",
  },
] as const

const enter = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties

function DiningBasics() {
  return (
    <dl className="border-t border-border">
      {DINING_BASICS.map((row, index) => (
        <div
          key={row.label}
          data-testid="dining-basic"
          className="enter-up flex flex-col gap-1 border-b border-border py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          style={enter(520 + index * 90)}
        >
          <dt className="flex items-baseline gap-3 text-[0.95rem] font-medium text-foreground/80">
            <span aria-hidden="true" className="w-6 font-display text-base italic text-lagoon tabular">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>
              <span aria-hidden="true" className="mr-2 text-canary-deep">
                •
              </span>
              {row.label}
            </span>
          </dt>
          <dd className="pl-9 font-display text-[1.3rem] leading-tight text-foreground sm:pl-0 sm:text-right">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function DiningHero() {
  const room = IMAGES.diningRoom
  const portrait = IMAGES.chefMarvinPortrait
  return (
    <section className="relative overflow-hidden pb-20 pt-10 sm:pb-28 sm:pt-16 lg:pb-32 lg:pt-20">
      <Container size="wide">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
          <div className="flow flow-xl min-w-0">
            <div className="flow flow-lg">
              <p className="eyebrow enter-fade" style={enter(80)}>
                Dining · Ambergris Caye
              </p>
              <SplitText
                as="h1"
                mode="enter"
                delay={140}
                text="A private chef, cooking to your *table.*"
                className="text-display max-w-[13ch] text-balance"
              />
              <p className="text-lede enter-up max-w-xl" style={enter(420)}>
                Lunches and dinners cooked in the villa kitchen, groceries at cost, and a table that moves from the
                dining room to the dock. Tell us what you love — the menus follow.
              </p>
            </div>
            <DiningBasics />
            <div className="enter-up flex flex-col gap-6" style={enter(900)}>
              <div>
                <CtaLink
                  href="/book"
                  size="lg"
                  className="w-full justify-between sm:w-auto"
                  eventName="cta_click"
                  eventPayload={{ location: "dining_hero", target: "/book" }}
                >
                  Check dates
                </CtaLink>
              </div>
              {/* Phones: one swipeable row of 44px chips; desktop: a quiet text index. */}
              <nav
                aria-label="On this page"
                className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 text-sm sm:mx-0 sm:flex-wrap sm:gap-x-5 sm:gap-y-1 sm:overflow-visible sm:px-0"
              >
                {DINING_ANCHORS.map((anchor) => (
                  <a
                    key={anchor.href}
                    href={anchor.href}
                    className="focus-ring inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border border-ink/15 px-4 font-medium text-foreground transition-colors hover:border-ink sm:rounded-none sm:border-0 sm:px-0 sm:text-foreground/80 sm:hover:text-foreground"
                  >
                    <span className="link-underline">{anchor.label}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[34rem] pb-[14%] lg:max-w-none lg:pb-[12%]">
            <div className="media-frame arch enter-clip relative aspect-[4/5] w-[88%]" style={enter(240)}>
              <Parallax amount={6}>
                <Image
                  src={room.src}
                  alt={room.alt}
                  fill
                  sizes="(min-width: 1320px) 520px, (min-width: 1024px) 40vw, (min-width: 640px) 30rem, 82vw"
                  className="object-cover"
                  style={{ objectPosition: imageObjectPosition(room) ?? "50% 50%" }}
                />
              </Parallax>
            </div>
            {/* Chef portrait is a 960px phone shot: kept at inset size. */}
            <figure
              className="enter-up absolute bottom-0 right-0 w-[42%] max-w-[15rem]"
              style={enter(620)}
            >
              <div className="media-frame relative aspect-[4/5] shadow-[var(--shadow-lift)] ring-[6px] ring-background sm:ring-8">
                <Image
                  src={portrait.src}
                  alt={portrait.alt}
                  fill
                  sizes="(min-width: 640px) 240px, 42vw"
                  className="object-cover"
                  style={{ objectPosition: imageObjectPosition(portrait) }}
                />
              </div>
              <figcaption className="mt-3 text-[13px] text-muted-foreground">Chef Marvin</figcaption>
            </figure>
            <span
              aria-hidden="true"
              className="enter-fade absolute -left-3 bottom-[22%] h-28 w-28 sm:-left-8 sm:h-36 sm:w-36"
              style={enter(1100)}
            >
              <svg viewBox="0 0 100 100" className="spin-scroll h-full w-full">
                <defs>
                  <path id="dining-ring" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                </defs>
                <circle cx="50" cy="50" r="49" className="fill-canary" />
                <text className="fill-ink text-[9px] font-semibold uppercase tracking-[0.16em]">
                  <textPath href="#dining-ring">Chef Marvin · lunch & dinner ·</textPath>
                </text>
              </svg>
              <Utensils className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-ink" strokeWidth={1.5} />
            </span>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default function Page() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-background outline-none">
      <PageStructuredData path="/dining" />
      <DiningHero />

      <section
        id="how-dining-works"
        className="bg-sand-light py-24 sm:py-32 lg:py-36"
      >
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <div className="flow flow-xl lg:sticky lg:top-[calc(var(--site-header-height)+2.5rem)] lg:self-start">
              <ChapterMark index="01" label="How dining works" />
              <SplitText
                as="h2"
                text="The kitchen moves around your group's *tastes.*"
                className="text-section max-w-[14ch] text-balance"
              />
              <figure className="flow flow-sm">
                <div data-reveal="clip" className="media-frame relative aspect-[4/5] w-full max-w-md sm:aspect-[5/4] lg:aspect-[4/5]">
                  <Parallax amount={6}>
                    <Image
                      src={IMAGES.chefMarvinKitchen.src}
                      alt={IMAGES.chefMarvinKitchen.alt}
                      fill
                      sizes="(min-width: 480px) 448px, 92vw"
                      className="object-cover"
                      style={{ objectPosition: imageObjectPosition(IMAGES.chefMarvinKitchen) }}
                    />
                  </Parallax>
                </div>
                <figcaption data-reveal="fade" className="max-w-md text-[13px] leading-6 text-muted-foreground">
                  Chef Marvin — every lunch and dinner is cooked in the villa kitchen to your group&apos;s preferences.
                </figcaption>
              </figure>
            </div>
            <div className="lg:pt-24">
              <DiningServiceLedger />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-32 lg:py-40">
        <Container size="narrow">
          <ScrollWordReveal
            text="No pantry markup. The chef cooks what your group loves, and the table follows the day — *dining room, dock, beach or boat.*"
            className="font-display text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.1] text-balance text-foreground"
          />
        </Container>
      </section>

      <section id="the-table" className="pb-24 sm:pb-32 lg:pb-40">
        <Container size="wide" className="flex flex-col gap-14 sm:gap-20">
          <div className="flow flow-lg">
            <ChapterMark index="02" label="The table" />
            <ExploreHeading
              title="A day at the *table*"
              align="split"
              lede="What dinner at Canary Cove actually looks like, from the first coffee to the last rum punch."
            />
          </div>
          <MealTimeline stops={DAY_AT_THE_TABLE} />
        </Container>
      </section>

      <section id="dining-gallery" className="bg-sand-light py-24 sm:py-32">
        <Container size="wide" className="flex flex-col gap-16 sm:gap-24">
          <div className="flow flow-lg">
            <ChapterMark index="03" label="Photo gallery" />
            <ExploreHeading
              title="From the kitchen, the table, and the *bar.*"
              align="split"
              lede={`${GALLERY_PHOTO_COUNT} frames across ${DINING_GALLERY_GROUPS.length} groups. Select any photo to open the viewer.`}
            />
          </div>
          {DINING_GALLERY_GROUPS.map((group, index) => (
            <div key={group.heading} className="grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
              <div
                data-reveal="group"
                className="flex items-baseline gap-4 border-t border-border pt-4 lg:sticky lg:top-[calc(var(--site-header-height)+2rem)] lg:flex-col lg:gap-2 lg:self-start"
              >
                <p className={cn("text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground", RISE)}>
                  <span className="sr-only">{group.eyebrow}: </span>
                  <span aria-hidden="true" className="tabular">
                    {String(index + 1).padStart(2, "0")} / {String(DINING_GALLERY_GROUPS.length).padStart(2, "0")}
                  </span>
                </p>
                <h3 className={cn("font-display text-[1.75rem] leading-none text-foreground sm:text-[2rem]", RISE)}>
                  {group.heading}
                </h3>
                <p className={cn("ml-auto text-[13px] text-muted-foreground tabular lg:ml-0", RISE)}>
                  {group.photos.length} photos
                </p>
              </div>
              <GalleryGrid items={group.photos} layout="editorial" />
            </div>
          ))}
        </Container>
      </section>

      <section
        id="dining-notes"
        className="surface-reef relative isolate overflow-hidden py-24 sm:py-32 lg:py-40"
      >
        <div aria-hidden="true" className="caustics pointer-events-none absolute inset-0 -z-10 opacity-60" />
        <Container size="wide" className="flex flex-col gap-14 sm:gap-20">
          <div className="flow flow-lg">
            <ChapterMark index="04" label="Guest notes on the food" tone="light" />
            <ExploreHeading title="Dessert gets its own *thank-you* notes." tone="light" />
          </div>

          <figure data-reveal="group" className="grid gap-8 lg:grid-cols-[6rem_minmax(0,1fr)] lg:gap-10">
            <span aria-hidden="true" className={cn("font-display text-[7rem] leading-[0.7] text-canary lg:text-[10rem]", RISE)}>
              &ldquo;
            </span>
            <div className="flow flow-lg">
              <blockquote
                className={cn("max-w-4xl font-display text-[1.85rem] leading-[1.2] text-white sm:text-[2.6rem] lg:text-[3.1rem]", RISE)}
                style={{ transitionDelay: "120ms" }}
              >
                <p>{DINING_NOTES[0].quote}</p>
              </blockquote>
              <figcaption
                className={cn("text-[11px] font-semibold uppercase tracking-[0.26em] text-white/65", RISE)}
                style={{ transitionDelay: "240ms" }}
              >
                {DINING_NOTES[0].author} · {DINING_NOTES[0].year}
              </figcaption>
            </div>
          </figure>

          <div className="grid gap-10 border-t border-white/15 pt-12 md:grid-cols-2 md:gap-16 lg:ml-[8rem]">
            {DINING_NOTES.slice(1).map((note, index) => (
              <figure
                key={`${note.year}-${note.author}`}
                data-reveal="group"
                className={cn("flow flow-md", index === 1 && "md:mt-16")}
              >
                <blockquote className={cn("font-display text-[1.5rem] leading-[1.3] text-white sm:text-[1.8rem]", RISE)}>
                  <p>&ldquo;{note.quote}&rdquo;</p>
                </blockquote>
                <figcaption
                  className={cn("text-[11px] font-semibold uppercase tracking-[0.26em] text-white/65", RISE)}
                  style={{ transitionDelay: "140ms" }}
                >
                  {note.author} · {note.year}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <ExploreClosingCta
        id="dining-plan"
        eyebrow="Plan your stay"
        title="Hungry? Send your *dates.*"
        lede="Tell us your dates, your group, and what you love to eat — the chef plans the week around your table."
        image={IMAGES.heroVillaSeating}
        actions={
          <>
            <CtaLink
              href="/book"
              variant="canary"
              size="lg"
              eventName="cta_click"
              eventPayload={{ location: "dining_plan", target: "/book" }}
            >
              Check dates
            </CtaLink>
            <CtaLink
              href="/rates"
              variant="outline-light"
              size="lg"
              arrow="none"
              eventName="cta_click"
              eventPayload={{ location: "dining_plan", target: "/rates" }}
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
