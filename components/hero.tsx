import Image from "next/image"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { HeroImageRotator } from "@/components/hero-image-rotator"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const HERO_FACTS = [
  { value: "One group", label: "Private booking only" },
  { value: "Chef daily", label: "Lunch and dinner service" },
  { value: "Two docks", label: "Boats and reef access" },
] as const

const HERO_HIGHLIGHTS = [
  "Oceanfront villa with three king suites and ensuite baths.",
  "Infinity pool, swim-up bar, hot tub, and shaded lounge deck.",
  "Private transfers, reef days, and staffed service coordinated for you.",
] as const

const HERO_HEADLINE = "Private estate on Ambergris Caye"
const HERO_SUPPORTING_LINE = "One private booking at a time, with chef service and direct reef access."

export function Hero() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-background">
        <HeroImageRotator className="min-h-[76svh] sm:min-h-[84svh] lg:min-h-[96svh]">
          <Container className="relative z-10 flex h-full items-end pb-[calc(1rem+env(safe-area-inset-bottom))] pt-28 sm:pb-12 sm:pt-32 lg:pb-16 lg:pt-36">
            <div className="w-full max-w-5xl">
              <div
                data-testid="hero-copy"
                className="flow flow-xs max-w-[18rem] overflow-hidden rounded-[24px] border border-white/16 bg-[color:rgba(10,22,28,0.46)] [background-image:linear-gradient(145deg,rgba(10,22,28,0.5)_0%,rgba(10,22,28,0.12)_100%)] p-3.5 text-white shadow-[0_22px_56px_rgba(0,0,0,0.16)] backdrop-blur-[10px] sm:flow-sm sm:max-w-[44rem] sm:rounded-[30px] sm:p-7 lg:p-8"
              >
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="relative rounded-[15px] border border-white/18 bg-[linear-gradient(160deg,rgba(8,62,88,0.92)_0%,rgba(18,110,145,0.82)_100%)] p-1.5 shadow-[0_12px_28px_rgba(8,62,88,0.2)] sm:rounded-[18px] sm:p-2.5">
                    <Image
                      src="/canary-cove-logo.png"
                      alt="Canary Cove logo"
                      width={394}
                      height={351}
                      priority
                      className="h-7 w-auto sm:h-12"
                    />
                  </div>
                </div>

                <div className="flow flow-xs max-w-3xl">
                  <h1
                    data-testid="hero-headline"
                    className="max-w-[8ch] text-[1.9rem] font-semibold leading-[0.92] tracking-tight text-pretty text-white sm:max-w-[12ch] sm:text-5xl sm:leading-[1.02] lg:text-6xl"
                  >
                    {HERO_HEADLINE}
                  </h1>
                  <p
                    data-testid="hero-subhead"
                    className="max-w-[23ch] text-[0.78rem] leading-[1.6] text-[#eef4f5] text-pretty sm:max-w-2xl sm:text-base sm:leading-7 lg:text-lg"
                  >
                    {HERO_SUPPORTING_LINE}
                  </p>
                </div>

                <div className="mt-0.5 flex flex-row flex-wrap items-center gap-1.5 sm:mt-1 sm:gap-3">
                  <Button
                    asChild
                    size="sm"
                    data-testid="hero-cta"
                    className="h-11 px-3.5 text-[12px] bg-white text-foreground hover:bg-white/92 sm:px-6 sm:text-sm"
                  >
                    <TrackedLink href="/book" eventName="cta_click" eventPayload={{ location: "hero", target: "/book" }}>
                      Book your stay
                    </TrackedLink>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="h-11 px-3.5 text-[12px] border-white/28 bg-white/8 text-white hover:bg-white/16 hover:text-white sm:px-6 sm:text-sm"
                  >
                    <TrackedLink href="/rates" eventName="cta_click" eventPayload={{ location: "hero", target: "/rates" }}>
                      See rates
                    </TrackedLink>
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </HeroImageRotator>
      </section>

      <Section padding="tight" className="bg-background pt-8 sm:pt-10 lg:pt-12">
        <Container>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
            <div className="surface-panel px-6 py-6 sm:px-8 sm:py-8">
              <Badge className="bg-transparent">Estate snapshot</Badge>
              <div className="mt-5 flow flow-sm">
                <h2 className="text-section max-w-2xl text-pretty">
                  See the property first. Get the stay details right after.
                </h2>
                <p className="text-body max-w-2xl">
                  Private groups only, chef service daily, and waterfront access coordinated around your stay instead of
                  around a resort schedule.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {HERO_FACTS.map((fact) => (
                  <div key={fact.label} className="surface-inset px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{fact.label}</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{fact.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-panel px-6 py-6 sm:px-8 sm:py-8">
              <p className="text-[11px] uppercase tracking-[0.34em] text-muted-foreground">Reserved for your group</p>
              <p className="mt-3 text-xl font-semibold leading-tight tracking-tight text-foreground">
                A staffed, waterfront stay that feels calm from arrival to departure.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                {HERO_HIGHLIGHTS.map((highlight) => (
                  <li key={highlight} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground/45" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
