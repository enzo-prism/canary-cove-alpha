"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { motion, useMotionValue, useMotionValueEvent, useScroll } from "motion/react"

import { useMotionOk } from "@/components/motion/use-motion-ok"
import { PhotoLightbox } from "@/components/photo-lightbox"
import { SectionHeading } from "@/components/section-heading"
import type { StayGalleryFeature } from "@/components/stay-gallery-section"
import { cloudinaryBlurDataUrl } from "@/lib/cloudinary-blur"
import { imageObjectPosition } from "@/lib/images"
import { cn } from "@/lib/utils"

type OutdoorFilmstripProps = {
  id: string
  eyebrow: string
  title: string
  description: string
  items: StayGalleryFeature[]
}

// Frame rhythm along the strip (width follows from the shared height, which
// is clamp(280px, 40svh, 500px) on tablets and up). `sizes` tracks that width.
const FRAMES = [
  { aspect: "sm:aspect-[16/10]", sizes: "(min-width: 640px) 640px, 78vw" },
  { aspect: "sm:aspect-[4/5]", sizes: "(min-width: 640px) 320px, 78vw" },
  { aspect: "sm:aspect-[3/2]", sizes: "(min-width: 640px) 600px, 78vw" },
  { aspect: "sm:aspect-square", sizes: "(min-width: 640px) 400px, 78vw" },
  { aspect: "sm:aspect-[4/5]", sizes: "(min-width: 640px) 320px, 78vw" },
  { aspect: "sm:aspect-[16/10]", sizes: "(min-width: 640px) 640px, 78vw" },
  { aspect: "sm:aspect-[4/5]", sizes: "(min-width: 640px) 320px, 78vw" },
  { aspect: "sm:aspect-[3/2]", sizes: "(min-width: 640px) 600px, 78vw" },
  { aspect: "sm:aspect-[4/5]", sizes: "(min-width: 640px) 320px, 78vw" },
]

// Left edge of the strip lines up with the 1320px content column.
const EDGE = "max(var(--gutter), calc((100vw - 1320px) / 2 + var(--gutter)))"

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * "Outside" as a filmstrip. On desktop (motion allowed) the section pins under
 * the header and vertical scrolling pans the strip sideways; everywhere else it
 * is a native horizontal snap scroller with arrow buttons. Both modes share
 * one DOM, so the lightbox order and buttons never change.
 */
export function OutdoorFilmstrip({ id, eyebrow, title, description, items }: OutdoorFilmstripProps) {
  const ok = useMotionOk()
  const [wide, setWide] = useState(false)
  const [distance, setDistance] = useState(0)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const headerPx = useRef(72)
  const x = useMotionValue(0)
  const pinnedProgress = useMotionValue(0)
  const pinned = ok && wide && distance > 0

  const { scrollY } = useScroll()
  const { scrollXProgress } = useScroll({ container: scrollerRef })

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (min-height: 640px)")
    const sync = () => setWide(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  // Measure how far the strip must travel to show its last frame.
  useEffect(() => {
    const track = trackRef.current
    if (!track || !ok || !wide) {
      setDistance(0)
      return
    }
    const measure = () => {
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--site-header-height"))
      headerPx.current = Number.isFinite(header) ? header : 72
      setDistance(Math.max(0, Math.round(track.scrollWidth - window.innerWidth)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [ok, wide])

  const update = useCallback(() => {
    const wrap = wrapRef.current
    if (!wrap || !pinned) {
      x.set(0)
      return
    }
    // The header shrinks after scrolling; follow its live height.
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--site-header-height"))
    if (Number.isFinite(header)) headerPx.current = header
    const top = wrap.getBoundingClientRect().top
    const progress = clamp((headerPx.current - top) / distance, 0, 1)
    pinnedProgress.set(progress)
    x.set(-progress * distance)
  }, [distance, pinned, pinnedProgress, x])

  useMotionValueEvent(scrollY, "change", update)
  useEffect(update, [update])

  // Keyboard users tabbing through a pinned strip: scroll the page so the
  // focused frame pans into view. Measured after the browser's own focus
  // scroll settles, from the live layout (the card's offset inside the track
  // is independent of the current pan, because both rects carry the same x).
  const handleFocus = (event: React.FocusEvent<HTMLElement>) => {
    if (!pinned) return
    const card = event.currentTarget
    if (!card.matches(":focus-visible")) return
    requestAnimationFrame(() => {
      const wrap = wrapRef.current
      const track = trackRef.current
      if (!wrap || !track || distance <= 0) {
        card.scrollIntoView({ block: "nearest", inline: "nearest" })
        return
      }
      const cardRect = card.getBoundingClientRect()
      const offsetInTrack = cardRect.left - track.getBoundingClientRect().left
      const target = clamp((offsetInTrack + cardRect.width / 2 - window.innerWidth / 2) / distance, 0, 1)
      const wrapTop = wrap.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: wrapTop - headerPx.current + target * distance, behavior: "auto" })
      // Safety net: if the frame still is not fully on screen, let the
      // browser bring it in.
      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect()
        if (rect.left < 0 || rect.right > window.innerWidth || rect.top < 0 || rect.bottom > window.innerHeight) {
          card.scrollIntoView({ block: "nearest", inline: "nearest" })
        }
      })
    })
  }

  const nudge = (direction: 1 | -1) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    scroller.scrollBy({ left: direction * scroller.clientWidth * 0.8, behavior: "smooth" })
  }

  return (
    <div
      id={id}
      ref={wrapRef}
      className="relative scroll-mt-24"
      style={pinned ? { height: `calc(100svh - var(--site-header-height) + ${distance}px)` } : undefined}
    >
      <div
        className={cn(
          "py-20 sm:py-28",
          pinned &&
            "sticky top-[var(--site-header-height)] flex h-[calc(100svh-var(--site-header-height))] flex-col justify-center overflow-clip py-8",
        )}
      >
        <div className="mx-auto w-full max-w-[1320px] px-[var(--gutter)]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              align="split"
              eyebrow={eyebrow}
              title={title}
              lede={description}
              className="flex-1"
            />
            {pinned ? null : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => nudge(-1)}
                  aria-label="Scroll outdoor photos back"
                  className="focus-ring flex size-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-sand-light"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => nudge(1)}
                  aria-label="Scroll outdoor photos forward"
                  className="focus-ring flex size-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-sand-light"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          ref={scrollerRef}
          className={cn(
            "no-scrollbar mt-10 sm:mt-14", pinned && "sm:mt-10",
            pinned ? "overflow-visible" : "snap-x snap-mandatory overflow-x-auto overscroll-x-contain",
          )}
          style={{ scrollPaddingInlineStart: EDGE }}
        >
          <motion.div
            ref={trackRef}
            style={{ x, paddingLeft: EDGE, paddingRight: "var(--gutter)" }}
            data-reveal="stagger"
            className="flex w-max items-start gap-4 sm:gap-6 lg:gap-10"
          >
            {items.map((item, index) => {
              const blurDataURL = cloudinaryBlurDataUrl(item.image.src)
              return (
                <figure
                  key={item.title}
                  className="flow flow-sm w-[78vw] max-w-[420px] shrink-0 snap-start sm:w-auto sm:max-w-none"
                  style={{ "--stagger-index": Math.min(index, 4) } as CSSProperties}
                >
                  <button
                    type="button"
                    onFocus={handleFocus}
                    onClick={() => setOpenIndex(index)}
                    aria-label={`View photo: ${item.image.alt}`}
                    className={cn(
                      "group media-frame zoom-media relative block w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background",
                      "aspect-[4/5] sm:h-[clamp(280px,40svh,500px)] sm:w-auto sm:self-start",
                      FRAMES[index % FRAMES.length].aspect,
                    )}
                  >
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      className="object-cover"
                      style={{ objectPosition: imageObjectPosition(item.image) }}
                      sizes={FRAMES[index % FRAMES.length].sizes}
                      placeholder={blurDataURL ? "blur" : "empty"}
                      blurDataURL={blurDataURL}
                    />
                  </button>
                  <figcaption className="grid max-w-[22rem] grid-cols-[auto_1fr] gap-x-3 sm:max-w-[19rem] sm:gap-x-4">
                    <span aria-hidden="true" className="tabular pt-[0.4em] text-[11px] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flow flow-xs">
                      <h3 className="text-title text-foreground">{item.title}</h3>
                      <p className="text-sm leading-6 text-muted-foreground">{item.detail}</p>
                    </span>
                  </figcaption>
                </figure>
              )
            })}
          </motion.div>
        </div>

        <div className="mx-auto mt-8 w-full max-w-[1320px] px-[var(--gutter)] sm:mt-10">
          <div className="relative h-px w-full bg-ink/12">
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 origin-left bg-ink"
              style={{ scaleX: pinned ? pinnedProgress : scrollXProgress }}
            />
          </div>
        </div>
      </div>

      <PhotoLightbox
        images={items.map((item) => ({ src: item.image.src, alt: item.image.alt, caption: item.title }))}
        openIndex={openIndex}
        onClose={() => setOpenIndex(null)}
      />
    </div>
  )
}
