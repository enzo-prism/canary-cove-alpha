import type { CSSProperties } from "react"
import Image from "next/image"

import { LocalTime } from "@/components/motion/local-time"
import { Magnetic } from "@/components/motion/magnetic"
import { Parallax } from "@/components/motion/parallax"
import { SplitText } from "@/components/motion/split-text"
import { CtaLink } from "@/components/ui/cta-link"

// Infinity pool, yellow umbrella and the sea beyond (studio set, 2560px).
const CLOSING_IMAGE = {
  src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059670/canarycove-haydeelustudio-521-scaled_ohjnr1.webp",
  alt: "Infinity pool with a yellow umbrella and the sea beyond the palms",
}

/** Closing invitation: a big serif line, the booking CTA, and a wide estate photo that wipes up. */
export function StayClosingCta() {
  return (
    <section aria-labelledby="stay-closing-heading" className="py-24 sm:py-32 lg:py-40">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col items-center gap-14 px-[var(--gutter)] sm:gap-20">
        <div className="flex max-w-4xl flex-col items-center gap-7 text-center">
          <p className="eyebrow eyebrow-plain" data-reveal="fade">
            Plan your dates
          </p>
          <SplitText
            as="h2"
            id="stay-closing-heading"
            text="Send your dates. We’ll *set the rhythm.*"
            className="text-display max-w-[14ch] text-balance"
          />
          <p className="text-lede max-w-xl" data-reveal="up" style={{ "--reveal-delay": "160ms" } as CSSProperties}>
            Reserve the estate for your group and we&apos;ll handle the rhythm of the stay, from dock arrival to chef
            service and days on the water.
          </p>
          <div
            className="flex w-full flex-col items-stretch gap-3 pt-2 sm:w-auto sm:flex-row sm:items-center"
            data-reveal="up"
            style={{ "--reveal-delay": "260ms" } as CSSProperties}
          >
            <Magnetic>
              <CtaLink
                href="/book"
                size="lg"
                className="w-full justify-between sm:w-auto sm:justify-center"
                eventName="cta_click"
                eventPayload={{ location: "stay_closing", target: "/book" }}
              >
                Inquire now
              </CtaLink>
            </Magnetic>
            <CtaLink
              href="/rates"
              variant="outline"
              size="lg"
              arrow="none"
              className="w-full sm:w-auto"
              eventName="cta_click"
              eventPayload={{ location: "stay_closing", target: "/rates" }}
            >
              See rates
            </CtaLink>
          </div>
        </div>

        <div data-reveal="clip" className="media-frame relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
          <Parallax amount={8}>
            <Image
              src={CLOSING_IMAGE.src}
              alt={CLOSING_IMAGE.alt}
              fill
              className="object-cover"
              style={{ objectPosition: "50% 25%" }}
              sizes="(min-width: 1320px) 1240px, 100vw"
            />
          </Parallax>
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-2.5 rounded-full bg-sand-light/90 px-4 py-2 text-[13px] text-ink backdrop-blur sm:bottom-6 sm:left-6">
            <span aria-hidden="true" className="block size-1.5 rounded-full bg-canary-deep" />
            Now in San Pedro
            <LocalTime className="font-medium" />
          </span>
        </div>
      </div>
    </section>
  )
}
