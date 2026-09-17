import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { DiningServiceLedger } from "@/components/dining-service-ledger"
import { Footer } from "@/components/footer"
import { GalleryGrid } from "@/components/gallery-grid"
import { Header } from "@/components/header"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { PageStructuredData } from "@/components/structured-data"
import { Button } from "@/components/ui/button"
import { IMAGES, imageObjectPosition } from "@/lib/images"
import { PAGE_METADATA } from "@/lib/seo"

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

const TABLE_MATRIX = [
  {
    lead: "Private chef",
    text: "Chef-prepared lunches and dinners served daily, with cleanup handled by staff.",
  },
  {
    lead: "Groceries at cost",
    text: "No pantry markup, so provisioning stays straightforward.",
  },
  {
    lead: "Guest favorites",
    text: "Lava Cake and dockside rum punch — both remembered by name in the guestbooks.",
  },
  {
    lead: "Where you'll eat",
    text: "The villa dining room, the pool deck, the dock, or packed for the boat.",
  },
  {
    lead: "Breakfasts & snacks",
    text: "The kitchen arrives stocked for self-serve mornings and grazing between meals.",
  },
  {
    lead: "Celebrations",
    text: "Milestone dinners for birthdays, anniversaries, and reunions.",
  },
] as const

const DINING_GALLERY_GROUPS = [
  {
    eyebrow: "Group one",
    heading: "Kitchen & chef",
    photos: [
      { ...IMAGES.chefMarvinPortrait, caption: "Chef Marvin" },
      { ...IMAGES.chefMarvinPlates, caption: "Plated and served" },
      { ...IMAGES.chefMarvinKitchen, caption: "At the range" },
      { ...IMAGES.viewFromKitchen, caption: "Kitchen island" },
    ],
  },
  {
    eyebrow: "Group two",
    heading: "Table & gatherings",
    photos: [
      { ...IMAGES.diningRoom, caption: "Dining room" },
      { ...IMAGES.diningSpread, caption: "The full spread" },
      { ...IMAGES.diningFoodDetail, caption: "Dinner details" },
      { ...IMAGES.diningDetailTwo, caption: "From the kitchen" },
      { ...IMAGES.diningDetailThree, caption: "Plated for guests" },
      { ...IMAGES.romanticViews, caption: "Golden hour" },
    ],
  },
  {
    eyebrow: "Group three",
    heading: "From the pass",
    photos: [
      { ...IMAGES.dinnerPlated, caption: "Plated dinner" },
      { ...IMAGES.dinnerAlt, caption: "Dinner service" },
      { ...IMAGES.shrimpDinner, caption: "Shrimp dinner" },
      { ...IMAGES.diningPlatter, caption: "Chef's platter" },
      { ...IMAGES.tacosAlt, caption: "Taco spread" },
      { ...IMAGES.saladAlt, caption: "Fresh salad" },
      { ...IMAGES.caramba, caption: "Caramba night" },
      { ...IMAGES.diningTable, caption: "Mini cheesecakes" },
    ],
  },
  {
    eyebrow: "Group four",
    heading: "Sundowners",
    photos: [
      { ...IMAGES.chipsAndDrinks, caption: "Poolside snacks" },
      { ...IMAGES.logoDrink, caption: "House pour" },
      { ...IMAGES.drinksBar, caption: "Night out in town" },
    ],
  },
]

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

function DiningBasics() {
  return (
    <dl className="border-t border-border/60">
      {DINING_BASICS.map((row) => (
        <div
          key={row.label}
          data-testid="dining-basic"
          className="flex items-baseline justify-between gap-6 border-b border-border/60 py-3.5"
        >
          <dt className="text-[0.95rem] font-medium text-foreground/80">
            <span aria-hidden="true" className="mr-2 text-muted-foreground">
              •
            </span>
            {row.label}
          </dt>
          <dd className="shrink-0 text-right text-[0.95rem] font-semibold tabular-nums text-foreground">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export default function Page() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background outline-none">
      <PageStructuredData path="/dining" />
      <Header />

      <Section padding="tight" className="overflow-hidden">
        <Container size="wide">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-14">
            <div className="flow flow-md max-w-2xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                Dining · Ambergris Caye
              </p>
              <h1 className="text-balance text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-[3.9rem]">
                A private chef, cooking to your table.
              </h1>
              <p className="max-w-xl text-base leading-7 text-foreground/72 sm:text-lg sm:leading-8">
                Lunches and dinners cooked in the villa kitchen, groceries at cost, and a table that moves from the
                dining room to the dock. Tell us what you love — the menus follow.
              </p>
              <DiningBasics />
              <div className="flex flex-col gap-5 pt-1">
                <Button asChild size="lg" className="w-full sm:w-fit">
                  <TrackedLink
                    href="/book"
                    eventName="cta_click"
                    eventPayload={{ location: "dining_hero", target: "/book" }}
                  >
                    Check dates
                    <ArrowUpRight className="size-4" />
                  </TrackedLink>
                </Button>
                <nav aria-label="On this page" className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
                  {DINING_ANCHORS.map((anchor, index) => (
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

      <Section id="how-dining-works" padding="tight" className="scroll-mt-24 bg-surface">
        <Container size="default">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <div className="flow flow-md lg:sticky lg:top-28 lg:self-start">
              <div className="flow flow-sm">
                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                  How dining works
                </p>
                <h2 className="text-section max-w-md text-[2rem] text-foreground sm:text-[2.5rem]">
                  The kitchen moves around your group&apos;s tastes.
                </h2>
              </div>
              <figure className="flow-xs">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-surface-muted">
                  <Image
                    src={IMAGES.chefMarvinPortrait.src}
                    alt={IMAGES.chefMarvinPortrait.alt}
                    fill
                    className="object-cover"
                    style={{ objectPosition: imageObjectPosition(IMAGES.chefMarvinPortrait) }}
                    sizes="(min-width: 1024px) 42vw, 100vw"
                  />
                </div>
                <figcaption className="text-[0.82rem] leading-6 text-muted-foreground">
                  Chef Marvin — every lunch and dinner is cooked in the villa kitchen to your group&apos;s preferences.
                </figcaption>
              </figure>
            </div>

            <div className="lg:pt-2">
              <DiningServiceLedger />
            </div>
          </div>
        </Container>
      </Section>

      <Section id="the-table" padding="tight" className="scroll-mt-24">
        <Container size="default">
          <div className="flow flow-sm max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">The table</p>
            <h2 className="text-section text-[2rem] text-foreground sm:text-[2.5rem]">
              What dinner at Canary Cove actually looks like.
            </h2>
          </div>
          <dl className="mt-8 border-t border-border/60">
            {TABLE_MATRIX.map((row) => (
              <div
                key={row.lead}
                className="grid gap-1 border-b border-border/60 py-5 sm:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] sm:gap-6"
              >
                <dt className="text-[0.98rem] font-semibold text-foreground">{row.lead}</dt>
                <dd className="max-w-3xl text-[0.95rem] leading-7 text-foreground/75">{row.text}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section id="dining-gallery" padding="tight" className="scroll-mt-24 bg-surface">
        <Container size="default">
          <div className="flow flow-md">
            <div className="flow flow-sm max-w-2xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                Photo gallery
              </p>
              <h2 className="text-section text-[2rem] text-foreground sm:text-[2.5rem]">
                From the kitchen, the table, and the bar.
              </h2>
              <p className="text-body">Twenty-one frames across four groups — select any photo to open the viewer.</p>
            </div>
            {DINING_GALLERY_GROUPS.map((group) => (
              <div key={group.heading} className="flow flow-sm">
                <div className="flow-xs">
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                    {group.eyebrow}
                  </p>
                  <h3 className="text-xl font-semibold text-foreground">{group.heading}</h3>
                </div>
                <GalleryGrid items={group.photos} />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="dining-notes" padding="tight" className="scroll-mt-24">
        <Container size="narrow">
          <div className="flow flow-sm max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
              Guest notes on the food
            </p>
            <h2 className="text-section text-[2rem] text-foreground sm:text-[2.5rem]">
              Dessert gets its own thank-you notes.
            </h2>
          </div>
          <div className="flow flow-lg mt-10">
            {DINING_NOTES.map((note, index) => (
              <figure
                key={`${note.year}-${note.author}`}
                className={`border-l-2 border-primary/30 pl-6 sm:pl-8 ${index === 1 ? "md:ml-16" : ""} ${index === 2 ? "md:ml-8" : ""}`}
              >
                <blockquote
                  className={
                    index === 0
                      ? "max-w-3xl text-balance text-xl font-medium leading-9 tracking-tight text-foreground sm:text-2xl sm:leading-10"
                      : "max-w-2xl text-lg leading-8 text-foreground/85"
                  }
                >
                  “{note.quote}”
                </blockquote>
                <figcaption className="mt-4 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                  {note.author} · {note.year}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="dining-plan" padding="tight" className="scroll-mt-24 bg-surface">
        <Container size="default">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-surface-muted">
              <Image
                src={IMAGES.villaLawn.src}
                alt={IMAGES.villaLawn.alt}
                fill
                className="object-cover"
                style={{ objectPosition: imageObjectPosition(IMAGES.villaLawn) }}
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            <div className="flow flow-md">
              <div className="flow flow-sm">
                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                  Plan your stay
                </p>
                <h2 className="text-section text-[2rem] text-foreground sm:text-[2.5rem]">
                  Hungry? Send your dates.
                </h2>
                <p className="text-body max-w-xl">
                  Tell us your dates, your group, and what you love to eat — the chef plans the week around your
                  table.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-fit">
                  <TrackedLink
                    href="/book"
                    eventName="cta_click"
                    eventPayload={{ location: "dining_plan", target: "/book" }}
                  >
                    Check dates
                    <ArrowUpRight className="size-4" />
                  </TrackedLink>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full border-border/70 bg-white/80 sm:w-fit">
                  <TrackedLink
                    href="/rates"
                    eventName="cta_click"
                    eventPayload={{ location: "dining_plan", target: "/rates" }}
                  >
                    See rates
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
