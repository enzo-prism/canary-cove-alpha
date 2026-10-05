import Image from "next/image"
import type { CSSProperties } from "react"

import { CountUp } from "@/components/motion/count-up"
import { Marquee } from "@/components/motion/marquee"
import { Parallax } from "@/components/motion/parallax"
import { ScrollWordReveal } from "@/components/motion/scroll-word-reveal"
import { HOME_MARQUEE, HOME_STATS } from "@/lib/homepage-content"
import { IMAGES, imageObjectPosition } from "@/lib/images"

export function IntroStatement() {
  return (
    <div className="flow gap-16 sm:gap-20 lg:gap-24">
      <div className="mx-auto grid w-full max-w-[1320px] gap-12 px-[var(--gutter)] lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-20">
        <div className="flow flow-xl">
          <p data-reveal="fade" className="eyebrow">
            Welcome to Canary Cove
          </p>
          <ScrollWordReveal
            text="One estate, one group at a time. Three king suites, an infinity pool, two private docks, a chef in the kitchen, and the reef *right off the dock.*"
            className="font-display text-[clamp(2rem,3.9vw,3.6rem)] leading-[1.08] tracking-[-0.015em] text-foreground"
          />
        </div>

        <div className="relative mx-auto mb-10 w-full max-w-md lg:mb-0 lg:max-w-none">
          <div data-reveal="clip" className="media-frame arch relative aspect-[4/5] w-[78%] shadow-[var(--shadow-soft)]">
            <Parallax amount={6}>
              <Image
                src={IMAGES.heroVillaSeating.src}
                alt={IMAGES.heroVillaSeating.alt}
                fill
                sizes="(min-width: 1024px) 32vw, 78vw"
                className="object-cover"
              />
            </Parallax>
          </div>
          <div
            data-reveal="clip"
            style={{ "--reveal-delay": "250ms" } as CSSProperties}
            className="media-frame absolute -bottom-8 right-0 aspect-square w-[46%] border-[6px] border-sand shadow-[var(--shadow-lift)]"
          >
            <Parallax amount={12}>
              <Image
                src={IMAGES.chefMarvinPortrait.src}
                alt={IMAGES.chefMarvinPortrait.alt}
                fill
                sizes="(min-width: 1024px) 18vw, 46vw"
                className="object-cover"
                style={{ objectPosition: imageObjectPosition(IMAGES.chefMarvinPortrait) }}
              />
            </Parallax>
          </div>
          <div
            aria-hidden="true"
            className="absolute -left-3 top-10 z-10 hidden h-28 w-28 rounded-full bg-sand p-1.5 shadow-[var(--shadow-subtle)] sm:block lg:-left-8"
          >
            <svg viewBox="0 0 100 100" className="spin-scroll h-full w-full">
              <defs>
                <path id="intro-ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text className="fill-ink text-[9.5px] font-semibold uppercase tracking-[0.3em]">
                <textPath href="#intro-ring">Ambergris Caye · Belize ·</textPath>
              </text>
              <circle cx="50" cy="50" r="9" className="fill-canary" />
            </svg>
          </div>
        </div>
      </div>

      <dl
        data-reveal="stagger"
        className="mx-auto grid w-full max-w-[1320px] grid-cols-2 gap-x-6 gap-y-10 px-[var(--gutter)] lg:grid-cols-4"
      >
        {HOME_STATS.map((stat, index) => (
          <div
            key={stat.label}
            className="flow flow-xs border-t border-ink/15 pt-5"
            style={{ "--stagger-index": index } as CSSProperties}
          >
            <dt className="order-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-foreground">{stat.label}</dt>
            <dd className="order-1 font-display text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.85] text-foreground">
              <CountUp value={stat.value} pad={2} />
            </dd>
            <dd className="order-3 text-sm text-muted-foreground">{stat.note}</dd>
          </div>
        ))}
      </dl>

      <Marquee
        duration={46}
        className="border-y border-ink/12 py-5 sm:py-6"
        itemClassName="font-display text-[clamp(1.75rem,3.4vw,3rem)] leading-none text-foreground"
        items={HOME_MARQUEE.map((item) => (
          <span key={item} className="px-6 sm:px-10">
            {item}
          </span>
        ))}
        separator={
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-canary-deep sm:h-6 sm:w-6">
            <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
          </svg>
        }
      />
    </div>
  )
}
