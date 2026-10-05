"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"

import { CtaLink } from "@/components/ui/cta-link"
import { useMotionOk } from "@/components/motion/use-motion-ok"
import { DAY_MOMENTS } from "@/lib/homepage-content"
import { imageObjectPosition } from "@/lib/images"
import { cn } from "@/lib/utils"

function MomentCard({ moment, index, pinned }: { moment: (typeof DAY_MOMENTS)[number]; index: number; pinned: boolean }) {
  return (
    <article
      className={cn(
        "group flex shrink-0 flex-col gap-5",
        pinned ? "w-[calc(min(54vh,520px)*0.8)]" : "w-[78vw] snap-start sm:w-[52vw] md:w-[40vw]",
        pinned && index % 2 === 1 && "mt-[8vh]",
      )}
    >
      <div className="media-frame zoom-media relative aspect-[4/5] w-full">
        <Image
          src={moment.image.src}
          alt={moment.image.alt}
          fill
          sizes="(min-width: 1024px) 34vw, 82vw"
          className="object-cover"
          style={{ objectPosition: imageObjectPosition(moment.image) }}
        />
        <span className="absolute left-4 top-4 rounded-full bg-sand-light/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink backdrop-blur">
          {String(index + 1).padStart(2, "0")} · {moment.time}
        </span>
      </div>
      <div className="flow flow-xs pr-4">
        <h3 className="text-title">{moment.title}</h3>
        <p className="text-body">{moment.description}</p>
      </div>
    </article>
  )
}

function Intro() {
  return (
    <div className="flow flow-lg w-full max-w-md shrink-0 lg:w-[min(30vw,420px)]">
      <p className="eyebrow">A day at the cove</p>
      <h2 className="text-section">
        Sea mornings. Chef dinners. <span className="italic-accent">Your pace.</span>
      </h2>
      <p className="text-lede">
        Nothing is scheduled for you. Spend the day on the water, come back to the pool, and sit down to meals made on site.
      </p>
      <div className="pt-2">
        <CtaLink
          href="/experiences"
          variant="outline"
          eventName="cta_click"
          eventPayload={{ location: "home_day_timeline", target: "/experiences" }}
        >
          Plan your days
        </CtaLink>
      </div>
    </div>
  )
}

/**
 * Desktop: the section pins under the header and the day slides past
 * horizontally as you scroll down (a sun arc tracks progress).
 * Touch, narrow screens and reduced motion: a native swipe row.
 */
export function DayAtTheCove() {
  const ok = useMotionOk()
  const [wide, setWide] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (min-height: 640px)")
    const sync = () => setWide(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  const pinned = ok && wide

  useEffect(() => {
    if (!pinned) return
    const track = trackRef.current
    if (!track) return
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [pinned])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] })
  // Driven straight from scroll (Lenis already smooths wheel input); a spring
  // here lagged behind fast flicks, so the pin released mid-slide.
  const smooth = scrollYProgress
  const x = useTransform(smooth, [0, 1], [0, -distance])
  const sunX = useTransform(smooth, [0, 1], ["0%", "100%"])
  // Follows the dashed quadratic arc below: y(t) = 10 − 36t + 36t² in a 0–10 viewBox.
  const sunY = useTransform(smooth, (t) => `${(10 - 36 * t + 36 * t * t) * 10}%`)

  if (!pinned) {
    return (
      <div ref={sectionRef} className="flow gap-10">
        <div className="px-[var(--gutter)]">
          <Intro />
        </div>
        <div
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] pb-2"
          data-lenis-prevent
          tabIndex={0}
          aria-label="A day at the cove"
        >
          {DAY_MOMENTS.map((moment, index) => (
            <MomentCard key={moment.title} moment={moment} index={index} pinned={false} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={sectionRef} className="relative" style={{ height: `calc(100vh + ${distance}px)` } as CSSProperties}>
      <div className="sticky top-[var(--site-header-height)] flex h-[calc(100vh-var(--site-header-height))] flex-col justify-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} className="flex w-max items-start gap-[4vw] px-[var(--gutter)] will-change-transform">
          <div className="flex h-full items-center pr-[2vw]">
            <Intro />
          </div>
          {DAY_MOMENTS.map((moment, index) => (
            <MomentCard key={moment.title} moment={moment} index={index} pinned />
          ))}
          <div className="w-[8vw] shrink-0" />
        </motion.div>
        <div aria-hidden="true" className="mx-[var(--gutter)] mt-6 flex items-center gap-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Sunrise</span>
          <div className="relative h-10 flex-1">
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
              <path d="M0 10 Q50 -8 100 10" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 5" className="text-ink/35" vectorEffect="non-scaling-stroke" />
            </svg>
            <motion.span
              className="absolute -ml-2 -mt-2 h-4 w-4 rounded-full bg-canary shadow-[0_0_24px_6px_rgba(244,198,61,0.45)]"
              style={{ left: sunX, top: sunY }}
            />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Sunset</span>
        </div>
      </div>
    </div>
  )
}
