import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Container } from "@/components/layout/container"
import { IMAGES } from "@/lib/images"
import { ExperiencesGalleryMosaic } from "@/components/experiences-gallery-mosaic"
import { ExperiencesGuestHighlights } from "@/components/experiences-guest-highlights"
import { ExperiencesHero } from "@/components/experiences-hero"
import { PageStructuredData } from "@/components/structured-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PAGE_METADATA } from "@/lib/seo"

export const metadata = PAGE_METADATA.experiences

const ACTIVITY_GALLERY_ITEMS = [
  IMAGES.turtleDive,
  IMAGES.waterSlide,
  IMAGES.zooVisit,
  IMAGES.drinksBar,
  IMAGES.mainDock,
  IMAGES.hammock,
  IMAGES.adventureGroup,
  IMAGES.belizeSign,
]

const FEATURED_ACTIVITY_CARDS = [
  {
    ...ACTIVITY_GALLERY_ITEMS[0],
    label: "Scuba diving with sea turtles",
    className: "col-span-2 row-span-2",
  },
  {
    // Wide landscape: a tall row-span-2 cell would crop away half the frame.
    ...ACTIVITY_GALLERY_ITEMS[1],
    label: "Dockside slides into clear water",
    className: "col-span-2",
  },
  {
    ...ACTIVITY_GALLERY_ITEMS[2],
    label: "Mainland wildlife day trips",
    className: "",
  },
  {
    ...ACTIVITY_GALLERY_ITEMS[4],
    label: "Boat departures from the private dock",
    className: "",
  },
  {
    // Wide landscape: a tall row-span-2 cell would crop away half the frame.
    ...ACTIVITY_GALLERY_ITEMS[3],
    label: "Cocktails mixed to your timing",
    className: "col-span-2",
  },
  {
    ...ACTIVITY_GALLERY_ITEMS[5],
    label: "Hammock resets between adventures",
    className: "",
  },
  {
    ...ACTIVITY_GALLERY_ITEMS[6],
    label: "Long lunches on the water",
    className: "",
  },
  {
    ...ACTIVITY_GALLERY_ITEMS[7],
    label: "Belize moments beyond the estate",
    className: "",
  },
] as const

const EXPERIENCE_HIGHLIGHTS = [
  {
    quote:
      "In 6 days we packed enough adventure into a fabulous vacation to last a long time. The staff ensured safety first, and incredible fun was had by all.",
    author: "G. & family",
    year: "2017",
  },
  {
    quote:
      "It was a week of golden moments: nurse sharks, rays settling into the sand, and sliding into the perfect water. Thank you for providing a little bit of heaven.",
    author: "C., R., & crew",
    year: "2017",
  },
] as const

export default function Page() {
  return (
    <main id="main-content" className="min-h-screen bg-[linear-gradient(180deg,#f6f1e6_0%,#f2ecdf_26%,#f7f2e9_100%)]">
      <PageStructuredData path="/experiences" />
      <Header />
      <ExperiencesHero />

      <section className="relative z-10 px-4 pb-16 pt-0 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <Container size="wide" className="-mt-10 flow flow-xl sm:-mt-14 lg:-mt-16">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="surface-panel border-border/55 bg-white/92">
              <CardHeader className="px-6 pb-3 pt-6 sm:px-8 sm:pt-8">
                <CardTitle className="text-section text-[1.9rem] sm:text-[2.1rem]">Included with your stay</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
                <ul className="space-y-2.5 text-sm leading-6 text-foreground/88 sm:text-[0.95rem]">
                  <li>Snorkel gear for reef days and the swim platform with slide.</li>
                  <li>Passive solar-heated infinity pool and on-site hot tub.</li>
                  <li>Beach bikes, volleyball, horseshoes, and corn hole.</li>
                  <li>Sea kayaks, paddle boards, and a Hobie catamaran.</li>
                  <li>Private docks and on-site staff to help you launch and plan.</li>
                  <li>Shoreline lounging, hammocks, and easy access to San Pedro.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="surface-panel border-border/55 bg-white/92">
              <CardHeader className="px-6 pb-3 pt-6 sm:px-8 sm:pt-8">
                <CardTitle className="text-section text-[1.9rem] sm:text-[2.1rem]">Add-on adventures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
                <p className="text-sm leading-7 text-muted-foreground sm:text-[0.95rem]">
                  Power boating, diving, fishing, and mainland excursions are coordinated with Canary Cove staff so your group can
                  move seamlessly from dock days to off-property adventures.
                </p>
                <ul className="space-y-2.5 text-sm leading-6 text-foreground/88 sm:text-[0.95rem]">
                  <li>Diving: $100 one-tank or $125 two-tank trips, plus Nitrox on request.</li>
                  <li>Fishing: $275 half-day, $400 full-day, or $600 offshore charters.</li>
                  <li>Private boat transfers: $75 round-trip to San Pedro or $100/hour plus gas.</li>
                  <li>Snuba, tubing, wakeboarding, spa services, and kid care can all be arranged.</li>
                </ul>
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  Fuel, marine park fees, hot-tub heating, and gratuities are additional
                </p>
              </CardContent>
            </Card>
          </div>

          <ExperiencesGalleryMosaic items={FEATURED_ACTIVITY_CARDS} />

          <ExperiencesGuestHighlights highlights={EXPERIENCE_HIGHLIGHTS} />
        </Container>
      </section>
      <Footer />
    </main>
  )
}
