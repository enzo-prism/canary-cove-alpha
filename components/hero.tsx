import Image from "next/image"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { HeroImageRotator } from "@/components/hero-image-rotator"
import { Container } from "@/components/layout/container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

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

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <HeroImageRotator className="min-h-[88vh] sm:min-h-[92vh] lg:min-h-screen">
        <Container className="relative z-10 flex h-full items-end pb-10 pt-28 sm:pb-14 sm:pt-32 lg:pb-16 lg:pt-36">
          <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.48fr)] lg:items-end">
            <div
              data-testid="hero-copy"
              className="relative flow flow-md max-w-3xl overflow-hidden rounded-[32px] border border-white/30 bg-[color:rgba(251,247,239,0.82)] p-6 text-foreground shadow-[0_28px_70px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:p-8 lg:p-10"
            >
              <div
                data-testid="hero-contrast-overlay"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.88)_0%,rgba(251,247,239,0.78)_45%,rgba(232,224,205,0.58)_100%)]"
              />
              <div className="flex items-center gap-4">
                <div className="relative z-10 rounded-[20px] border border-[#1f617f]/35 bg-[linear-gradient(160deg,rgba(8,62,88,0.92)_0%,rgba(18,110,145,0.82)_100%)] p-3 shadow-[0_14px_32px_rgba(8,62,88,0.18)] backdrop-blur">
                  <Image
                    src="/canary-cove-logo.png"
                    alt="Canary Cove logo"
                    width={394}
                    height={351}
                    priority
                    className="h-12 w-auto sm:h-14"
                  />
                </div>
                <Badge className="relative z-10 border border-foreground/10 bg-white/55 text-foreground shadow-none">
                  Private Belize estate
                </Badge>
              </div>

              <div className="relative z-10 flow flow-sm">
                <h1 data-testid="hero-headline" className="text-display max-w-2xl text-foreground">
                  Private estate. Endless water.
                </h1>
                <p data-testid="hero-subhead" className="max-w-2xl text-base text-foreground/80 sm:text-lg lg:text-xl">
                  One group at a time with chef service, private boats, and oceanfront amenities designed to feel fully yours.
                </p>
              </div>

              <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  asChild
                  size="lg"
                  data-testid="hero-cta"
                  className="w-fit bg-foreground text-background hover:bg-foreground/92"
                >
                  <TrackedLink href="/book" eventName="cta_click" eventPayload={{ location: "hero", target: "/book" }}>
                    Book your stay
                  </TrackedLink>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-fit border-foreground/15 bg-white/55 text-foreground hover:bg-white hover:text-foreground"
                >
                  <TrackedLink href="/rates" eventName="cta_click" eventPayload={{ location: "hero", target: "/rates" }}>
                    See rates
                  </TrackedLink>
                </Button>
              </div>

              <Separator className="relative z-10 bg-foreground/10" />

              <div className="relative z-10 grid gap-3 sm:grid-cols-3">
                {HERO_FACTS.map((fact) => (
                  <div key={fact.label} className="rounded-[22px] border border-white/45 bg-white/42 px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-foreground/55">{fact.label}</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{fact.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex lg:justify-end">
              <div className="flow flow-sm w-full max-w-sm rounded-[28px] border border-white/15 bg-white/10 p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.2)] backdrop-blur-lg">
                <p className="text-[11px] uppercase tracking-[0.34em] text-white/68">Reserved for your group</p>
                <p className="text-lg font-semibold leading-tight text-white">
                  A staffed, waterfront stay that feels calm from arrival to departure.
                </p>
                <ul className="space-y-3 text-sm text-white/78">
                  {HERO_HIGHLIGHTS.map((highlight) => (
                    <li key={highlight} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 rounded-full bg-white/70" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </HeroImageRotator>
    </section>
  )
}
