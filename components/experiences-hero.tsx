import Image from "next/image"
import type { CSSProperties } from "react"

import { Container } from "@/components/layout/container"
import { LocalTime } from "@/components/motion/local-time"
import { Parallax } from "@/components/motion/parallax"
import { SplitText } from "@/components/motion/split-text"
import { CtaLink } from "@/components/ui/cta-link"
import { IMAGES, imageObjectPosition } from "@/lib/images"

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties

const CHAPTERS = [
  { index: "01", label: "Included with your stay", href: "#on-the-water" },
  { index: "02", label: "Add-on adventures", href: "#diving-fishing" },
  { index: "03", label: "Shape the week", href: "#the-week" },
  { index: "04", label: "Activity gallery", href: "#activity-gallery" },
] as const

/**
 * Full-bleed opener. It tucks under the sticky header with
 * -mt-[var(--site-header-height)] and pads the same amount back, so the
 * photograph runs to the top of the viewport while the h1 always sits below
 * the header. Entrances are CSS keyframes (run before hydration); the photo
 * settles in a slow Ken Burns inside a scroll parallax layer.
 */
export function ExperiencesHero() {
  const image = IMAGES.waterSlide

  return (
    <section
      data-testid="experiences-hero"
      className="relative isolate -mt-[var(--site-header-height)] flex min-h-[40rem] flex-col justify-end overflow-hidden bg-ink pt-[calc(var(--site-header-height)+3rem)] text-white sm:min-h-[46rem] lg:h-[100svh] lg:max-h-[68rem] lg:min-h-[44rem]"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Parallax amount={9} scale={1.08}>
          <div className="ken-burns absolute inset-0">
            <Image
              src={image.src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: imageObjectPosition(image) ?? "50% 40%" }}
            />
          </div>
        </Parallax>
        {/* Scrims: the slide is bright white and runs behind the copy, so the
            copy column gets a deep left-to-right wash (lg) or a full-height
            wash (phones/tablets, where the copy spans the frame), plus a
            bottom fade for the chapter index. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,36,40,0.62)_0%,rgba(12,36,40,0.58)_35%,rgba(12,36,40,0.72)_65%,rgba(12,36,40,0.92)_100%)] lg:bg-[linear-gradient(90deg,rgba(12,36,40,0.84)_0%,rgba(12,36,40,0.76)_28%,rgba(12,36,40,0.66)_42%,rgba(12,36,40,0.3)_58%,rgba(12,36,40,0)_74%)]" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(12,36,40,0.4)_0%,rgba(12,36,40,0)_22%,rgba(12,36,40,0)_60%,rgba(12,36,40,0.85)_100%)] lg:block" />
      </div>
      <span className="sr-only">{image.alt}</span>

      <div
        className="enter-fade absolute right-[var(--gutter)] top-[calc(var(--site-header-height)+1.25rem)] hidden items-center gap-2 rounded-full border border-white/25 bg-ink/25 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85 backdrop-blur-md sm:flex"
        style={delay(900)}
      >
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-canary" />
        San Pedro <LocalTime className="text-white" />
      </div>

      <Container size="wide" className="relative pb-8 sm:pb-12 lg:pb-14">
        <div className="flow flow-lg max-w-4xl">
          <p className="eyebrow enter-fade text-white [text-shadow:0_1px_18px_rgba(8,26,29,0.55)]" style={delay(80)}>
            Experiences · Ambergris Caye
          </p>
          <SplitText
            as="h1"
            mode="enter"
            delay={160}
            text="*Belize* experiences at Canary Cove"
            className="text-display max-w-[13ch] text-balance [filter:drop-shadow(0_2px_22px_rgba(8,26,29,0.5))] sm:text-[clamp(3.75rem,8.6vw,7.25rem)]"
          />
          <p className="text-lede enter-up max-w-xl !text-white [text-shadow:0_1px_18px_rgba(8,26,29,0.6)]" style={delay(460)}>
            Calm mornings, adrenaline afternoons, and sunset cruises all planned around the tides and your pace.
          </p>
          <div className="enter-up flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center" style={delay(560)}>
            <CtaLink
              href="/book"
              variant="canary"
              size="lg"
              className="w-full justify-between sm:w-auto"
              eventName="cta_click"
              eventPayload={{ location: "experiences_hero", target: "/book" }}
            >
              Plan your days
            </CtaLink>
            <CtaLink
              href="#diving-fishing"
              variant="outline-light"
              size="lg"
              arrow="none"
              className="w-full sm:w-auto"
            >
              Add-on prices
            </CtaLink>
          </div>
        </div>

        <nav
          aria-label="Experiences chapters"
          className="enter-up mt-12 grid grid-cols-2 border-t border-white/20 sm:mt-16 lg:grid-cols-4"
          style={delay(720)}
        >
          {CHAPTERS.map((chapter) => (
            <a
              key={chapter.href}
              href={chapter.href}
              className="focus-ring flex min-h-14 items-start gap-3 border-white/15 py-4 pr-3 text-sm text-white transition-colors duration-500 hover:text-white max-lg:even:border-l max-lg:even:pl-4 max-lg:[&:nth-child(n+3)]:border-t lg:border-l lg:px-5 lg:first:border-l-0 lg:first:pl-0"
            >
              <span className="font-display text-lg italic leading-5 text-canary tabular">{chapter.index}</span>
              <span className="link-underline leading-5">{chapter.label}</span>
            </a>
          ))}
        </nav>
      </Container>
    </section>
  )
}
