import Image from "next/image"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { HeroImageRotator } from "@/components/hero-image-rotator"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"

const HERO_HEADLINE = "Private estate on Ambergris Caye"
const HERO_SUPPORTING_LINE = "One private booking at a time, with chef service and direct reef access."

export function Hero() {
  return (
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
                  <TrackedLink
                    href="/about#guest-testimonials"
                    eventName="cta_click"
                    eventPayload={{ location: "hero", target: "/about#guest-testimonials" }}
                  >
                    Reviews from guests
                  </TrackedLink>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </HeroImageRotator>
    </section>
  )
}
