"use client"

import { useRef, useState } from "react"
import { Play } from "lucide-react"
import { motion, useScroll, useTransform } from "motion/react"

import { AmbientVideo } from "@/components/motion/ambient-video"
import { useMotionOk } from "@/components/motion/use-motion-ok"
import { CtaLink } from "@/components/ui/cta-link"
import { VideoPlayer } from "@/components/video-player"

const FILM_POSTER = "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059677/outside_sq8dvn.webp"
const FILM_SRC = "https://res.cloudinary.com/dhqpqfw6w/video/upload/q_auto,vc_auto,w_1280/v1762995355/pv_mwqjho.mp4"
const AMBIENT_SRC = "/videos/ambient/manta-loop.mp4"
const AMBIENT_POSTER = "/videos/ambient/manta-loop-poster.jpg"

/**
 * "Below the surface" band. A silent, decorative manta loop plays behind the
 * copy (outside the film's test boundary); the real diving film with sound
 * stays poster-first and only starts after a guest clicks play. The frame
 * widens from an inset card to full bleed as it scrolls into view.
 */
export function PropertyFilm() {
  const [playing, setPlaying] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const ok = useMotionOk()
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "start 0.2"] })
  const clipPath = useTransform(scrollYProgress, (p) =>
    ok ? `inset(0% ${(1 - p) * 4}% round ${(1 - p) * 28}px)` : "inset(0% 0% round 0px)",
  )
  const textY = useTransform(scrollYProgress, [0, 1], ok ? [80, 0] : [0, 0])

  return (
    <div ref={frameRef} className="relative">
      <motion.div style={{ clipPath }} className="surface-reef relative overflow-hidden">
        {!playing ? (
          <div aria-hidden="true" className="absolute inset-0">
            <AmbientVideo src={AMBIENT_SRC} poster={AMBIENT_POSTER} className="scale-105 opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_40%,rgba(8,26,29,0.05)_0%,rgba(8,26,29,0.55)_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-reef-deep via-reef-deep/30 to-reef-deep/40" />
          </div>
        ) : null}

        <div data-testid="property-film" className="relative z-10">
          {playing ? (
            <div className="relative mx-auto min-h-[420px] w-full max-w-[1440px] sm:min-h-[560px] lg:min-h-[86vh]">
              <VideoPlayer
                src={FILM_SRC}
                poster={FILM_POSTER}
                title="World-class diving with a giant manta ray"
                autoPlay
                loop
                muted
                preload="metadata"
                fill
                testId="property-film-player"
                videoTestId="property-film-video"
              />
            </div>
          ) : (
            <div className="mx-auto flex min-h-[600px] max-w-[1440px] flex-col px-[max(var(--gutter),calc(4vw+1.25rem))] py-12 sm:min-h-[680px] sm:py-16 lg:min-h-[92vh] lg:py-20">
              <p className="eyebrow text-white/75">Below the surface</p>
              <div className="flex flex-1 items-center justify-center py-10">
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  data-testid="property-film-play"
                  className="group focus-ring relative flex h-32 w-32 items-center justify-center rounded-full sm:h-40 sm:w-40"
                  aria-label="Play diving film"
                >
                  <svg viewBox="0 0 100 100" aria-hidden="true" className="spin-slow absolute inset-0 h-full w-full">
                    <defs>
                      <path id="film-ring" d="M50,50 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" />
                    </defs>
                    <text className="fill-white/80 text-[8px] font-semibold uppercase tracking-[0.3em]">
                      <textPath href="#film-ring">Play the film · Watch the reef ·</textPath>
                    </text>
                  </svg>
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-canary text-ink shadow-[0_0_60px_rgba(255,228,26,0.35)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110 sm:h-20 sm:w-20">
                    <Play className="ml-1 h-6 w-6 fill-current" />
                  </span>
                  <span className="sr-only">Play diving film</span>
                </button>
              </div>
              <motion.div data-testid="property-film-copy" style={{ y: textY }} className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
                <h2
                  data-testid="property-film-heading"
                  className="max-w-[16ch] font-display text-[clamp(2.4rem,5.6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] text-white text-balance"
                >
                  World-class diving with a <span className="italic-accent text-canary">giant manta ray.</span>
                </h2>
                <div className="flow flow-lg lg:items-end lg:text-right">
                  <p className="max-w-sm text-[17px] leading-relaxed text-white/75">
                    The Belize Barrier Reef starts beyond the dock. Our boats take you there, and bring you back for lunch.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <CtaLink
                      href="/book"
                      variant="light"
                      eventName="cta_click"
                      eventPayload={{ location: "dive_film", target: "/book" }}
                    >
                      Book your stay
                    </CtaLink>
                    <CtaLink
                      href="/adventures#reef-encounters"
                      variant="outline-light"
                      arrow="none"
                      eventName="cta_click"
                      eventPayload={{ location: "dive_film", target: "/adventures" }}
                    >
                      More reef films
                    </CtaLink>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
