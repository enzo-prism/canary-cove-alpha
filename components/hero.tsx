import { TrackedLink } from "@/components/analytics/tracked-link"
import { HeroImageRotator } from "@/components/hero-image-rotator"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section
      data-testid="hero-visual"
      aria-label="Canary Cove property photography"
      className="relative isolate overflow-hidden bg-background"
    >
      <HeroImageRotator className="min-h-[82svh] sm:min-h-[86svh] lg:min-h-[96svh]">
        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-6 pb-16 pt-28 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
            <div data-testid="homepage-intro" className="flow flow-sm max-w-3xl text-white">
              <p className="text-[11px] uppercase tracking-[0.34em] text-white/72">Ambergris Caye, Belize</p>
              <h1
                data-testid="homepage-intro-heading"
                className="max-w-[14ch] text-4xl font-semibold leading-[0.94] tracking-tight text-pretty sm:text-5xl sm:leading-[0.98] lg:text-6xl"
              >
                Private estate on Ambergris Caye
              </h1>
              <p data-testid="homepage-intro-subhead" className="max-w-2xl text-base leading-7 text-white/84 sm:text-lg">
                One private booking at a time, with chef service and direct reef access.
              </p>
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  data-testid="homepage-primary-cta"
                  className="h-12 bg-white text-foreground hover:bg-white/90"
                >
                  <TrackedLink href="/book" eventName="cta_click" eventPayload={{ location: "homepage_hero", target: "/book" }}>
                    Request a stay
                  </TrackedLink>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  data-testid="homepage-secondary-cta"
                  className="h-12 w-full border-white/70 bg-transparent text-white hover:bg-white hover:text-foreground sm:w-auto"
                >
                  <TrackedLink
                    href="/rates"
                    eventName="cta_click"
                    eventPayload={{ location: "homepage_hero", target: "/rates" }}
                  >
                    See rates
                  </TrackedLink>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </HeroImageRotator>
    </section>
  )
}
