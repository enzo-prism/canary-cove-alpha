"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { motion, useScroll, useTransform } from "motion/react"

import { Container } from "@/components/layout/container"
import { useMotionOk } from "@/components/motion/use-motion-ok"
import { imageObjectPosition, type ImageRecord } from "@/lib/images"
import { cn } from "@/lib/utils"

export type FilmstripDay = ImageRecord & {
  day: string
  caption: string
}

type DaysFilmstripProps = {
  id?: string
  items: FilmstripDay[]
  heading: ReactNode
  /** Closing card at the end of the strip (a CTA). */
  endCard?: ReactNode
}

// Pin only where a 4:5 card plus the heading fit comfortably in the viewport.
const PIN_QUERY = "(min-width: 1024px) and (min-height: 760px)"

/**
 * A week of days as a filmstrip. On large screens the section pins under the
 * header and vertical scrolling drives the strip sideways (scroll-linked, no
 * hijacking: the page keeps native scroll). On phones, tablets and for
 * reduced motion it is a native horizontal snap scroller with a progress line.
 */
export function DaysFilmstrip({ id, items, heading, endCard }: DaysFilmstripProps) {
  const ok = useMotionOk()
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)
  const [pinned, setPinned] = useState(false)
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    if (!ok) {
      setPinned(false)
      return
    }
    const media = window.matchMedia(PIN_QUERY)
    const sync = () => setPinned(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [ok])

  useEffect(() => {
    if (!pinned) return
    const track = trackRef.current
    const viewport = viewportRef.current
    if (!track || !viewport) return
    const measure = () => setDistance(Math.max(0, track.scrollWidth - viewport.clientWidth))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [pinned])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] })
  const { scrollXProgress } = useScroll({ container: viewportRef })
  const x = useTransform(scrollYProgress, (value) => -value * distance)
  const progress = pinned ? scrollYProgress : scrollXProgress

  const nudge = (direction: 1 | -1) => {
    const viewport = viewportRef.current
    const card = trackRef.current?.querySelector("li")
    if (!viewport || !card) return
    viewport.scrollBy({ left: direction * (card.getBoundingClientRect().width + 20), behavior: "smooth" })
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative"
      style={pinned ? { height: `calc(100svh - var(--site-header-height) + ${distance}px)` } : undefined}
    >
      <div
        className={cn(
          "py-20 sm:py-28",
          pinned &&
            "sticky top-[var(--site-header-height)] flex h-[calc(100svh-var(--site-header-height))] flex-col justify-center overflow-hidden py-10",
        )}
      >
        <Container size="wide">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
            <div className="min-w-0 flex-1">{heading}</div>
            <div className="flex w-full items-center gap-4 sm:w-auto">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground tabular">
                {String(items.length).padStart(2, "0")} days
              </span>
              <div className="relative h-px flex-1 overflow-hidden bg-border sm:w-40 sm:flex-none">
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 origin-left bg-ink"
                  style={{ scaleX: progress }}
                />
              </div>
              {!pinned ? (
                <div className="hidden gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={() => nudge(-1)}
                    aria-label="Previous day"
                    className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 hover:bg-ink hover:text-sand-light"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudge(1)}
                    aria-label="Next day"
                    className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 hover:bg-ink hover:text-sand-light"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </Container>

        <div
          ref={viewportRef}
          role={pinned ? undefined : "region"}
          aria-label={pinned ? undefined : "A week of days (scrolls sideways)"}
          tabIndex={pinned ? undefined : 0}
          className={cn(
            "focus-ring mt-10 sm:mt-12",
            pinned
              ? "overflow-visible"
              : "no-scrollbar snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-pl-6 sm:scroll-pl-8",
          )}
        >
          <motion.ol
            ref={trackRef}
            style={pinned ? { x } : undefined}
            className="flex w-max gap-4 px-6 sm:gap-5 sm:px-8 lg:px-[max(3rem,calc((100vw_-_1320px)/2_+_3rem))]"
          >
            {items.map((item, index) => (
              <li
                key={item.src}
                className="group w-[78vw] max-w-[22rem] shrink-0 snap-start sm:w-[20rem] lg:w-[min(clamp(17rem,25vw,23rem),calc(46svh*0.8))] lg:max-w-none"
              >
                <figure className="flow flow-sm">
                  <div className="media-frame zoom-media relative aspect-[4/5]">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 20rem, 78vw"
                      className="object-cover"
                      style={{ objectPosition: imageObjectPosition(item) }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,36,40,0.35)_0%,transparent_32%)]" />
                    <span className="absolute left-4 top-4 rounded-full bg-sand-light/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink backdrop-blur tabular">
                      Day {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <figcaption className="flow flow-xs pr-4">
                    <span className="font-display text-[1.75rem] leading-none text-foreground">{item.day}</span>
                    <span className="text-body block">{item.caption}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
            {endCard ? (
              <li className="w-[78vw] max-w-[22rem] shrink-0 snap-start sm:w-[20rem] lg:w-[min(clamp(17rem,25vw,23rem),calc(46svh*0.8))] lg:max-w-none">
                {endCard}
              </li>
            ) : null}
          </motion.ol>
        </div>
      </div>
    </section>
  )
}
