import type { CSSProperties } from "react"

import { HeroImageRotator } from "@/components/hero-image-rotator"
import { LocalTime } from "@/components/motion/local-time"
import { Magnetic } from "@/components/motion/magnetic"
import { ScrollFade } from "@/components/motion/scroll-fade"
import { SplitText } from "@/components/motion/split-text"
import { CtaLink } from "@/components/ui/cta-link"

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties

function HeroRail() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden px-[var(--gutter)] pb-7 md:block">
      <div className="enter-fade flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70" style={delay(1300)}>
        <span className="tabular">17° 59′ N · 87° 54′ W</span>
        <span className="flex items-center gap-5">
          <span>
            San Pedro <LocalTime className="text-white" />
          </span>
          <span className="flex items-center gap-3">
            Scroll
            <span aria-hidden="true" className="relative h-9 w-px overflow-hidden bg-white/25">
              <span className="scroll-cue absolute inset-0 bg-canary" />
            </span>
          </span>
        </span>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section
      data-testid="hero-visual"
      aria-label="Canary Cove property photography"
      className="relative isolate overflow-hidden bg-ink"
    >
      <HeroImageRotator
        className="min-h-[86svh] sm:min-h-[calc(100svh-var(--site-header-height))] lg:min-h-[max(640px,calc(100svh-var(--site-header-height)))]"
        chrome={<HeroRail />}
      >
        <div className="absolute inset-0 flex items-end">
          <ScrollFade className="w-full">
            <div className="w-full px-[var(--gutter)] pb-10 pt-24 sm:pb-14 md:pb-28">
              <div data-testid="homepage-intro" className="flow flow-lg w-full text-white">
                <p className="eyebrow enter-fade text-white [text-shadow:0_1px_18px_rgba(8,26,29,0.55)]" style={delay(150)}>
                  Private estate · Belize Barrier Reef
                </p>
                <SplitText
                  as="h1"
                  mode="enter"
                  delay={220}
                  step={80}
                  data-testid="homepage-intro-heading"
                  text="Private estate on *Ambergris Caye*"
                  className="text-hero text-balance [text-shadow:0_2px_40px_rgba(8,26,29,0.35)] lg:max-w-[13ch]"
                />
                <div className="grid gap-6 border-t border-white/25 pt-6 md:grid-cols-[1fr_auto] md:items-end md:gap-10">
                  <p
                    data-testid="homepage-intro-subhead"
                    className="enter-up max-w-md text-[17px] leading-relaxed text-white [text-shadow:0_1px_18px_rgba(8,26,29,0.55)] sm:text-lg"
                    style={delay(650)}
                  >
                    One private booking at a time, with chef service and direct reef access.
                  </p>
                  <div className="enter-up flex flex-col gap-3 sm:flex-row sm:items-center" style={delay(780)}>
                    <Magnetic className="w-full sm:w-auto">
                      <CtaLink
                        href="/book"
                        variant="canary"
                        size="lg"
                        data-testid="homepage-primary-cta"
                        eventName="cta_click"
                        eventPayload={{ location: "homepage_hero", target: "/book" }}
                        className="w-full justify-between sm:w-auto"
                      >
                        Book your stay
                      </CtaLink>
                    </Magnetic>
                    <CtaLink
                      href="/rates"
                      variant="outline-light"
                      size="lg"
                      arrow="none"
                      data-testid="homepage-secondary-cta"
                      eventName="cta_click"
                      eventPayload={{ location: "homepage_hero", target: "/rates" }}
                      className="w-full sm:w-auto"
                    >
                      See rates
                    </CtaLink>
                  </div>
                </div>
              </div>
            </div>
          </ScrollFade>
        </div>
      </HeroImageRotator>
    </section>
  )
}
