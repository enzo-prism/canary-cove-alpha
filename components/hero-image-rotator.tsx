"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"

import { cn } from "@/lib/utils"
import { IMAGES, type ImageFocal } from "@/lib/images"
import { useMotionOk } from "@/components/motion/use-motion-ok"

type HeroImage = {
  src: string
  alt: string
  focal?: ImageFocal
  /** Horizontal crop bias, percent from the left edge (defaults to center). */
  focusX?: number
}

// Only use large-format assets here. Full-bleed hero backgrounds need enough
// source width to stay sharp on wide desktop screens and high-density displays.
// The first slide is fixed (it is the LCP image) and should be the brightest,
// most "this is the place" frame; the rest are shuffled per session.
const HERO_IMAGES: HeroImage[] = [
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059670/canarycove-haydeelustudio-521-scaled_ohjnr1.webp",
    alt: "Infinity pool and yellow umbrella looking out to the sea at Canary Cove",
    focusX: 40,
  },
  {
    ...IMAGES.heroVillaDining,
    focusX: 45,
  },
  {
    ...IMAGES.heroVillaSeating,
    focusX: 55,
  },
  {
    ...IMAGES.heroBackgroundLawn,
    focusX: 55,
  },
  {
    ...IMAGES.livingRoom,
    focusX: 58,
  },
]

const ROTATE_INTERVAL = 8000
const HERO_ORDER_STORAGE_KEY = "canary-cove:hero-image-order"

const shuffle = (items: HeroImage[]) => {
  const array = [...items]
  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[array[index], array[swapIndex]] = [array[swapIndex], array[index]]
  }
  return array
}

const getOrderKey = (items: HeroImage[]) => items.map((item) => item.src).join("|")

const getRandomizedHeroImages = (previousOrder?: string | null) => {
  let nextOrder = [HERO_IMAGES[0], ...shuffle(HERO_IMAGES.slice(1))]
  let attempts = 0

  while (previousOrder && HERO_IMAGES.length > 1 && getOrderKey(nextOrder) === previousOrder && attempts < 8) {
    nextOrder = [HERO_IMAGES[0], ...shuffle(HERO_IMAGES.slice(1))]
    attempts += 1
  }

  return nextOrder
}

type HeroImageRotatorProps = {
  className?: string
  children?: ReactNode
  /** Rendered over the photography, under the copy (e.g. the info rail). */
  chrome?: ReactNode
}

export function HeroImageRotator({ className, children, chrome }: HeroImageRotatorProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const motionOk = useMotionOk()
  const [hasRotated, setHasRotated] = useState(false)
  // Scroll-linked depth: the photography sinks and dims as the page scrolls
  // away. Applied to an inner layer so the hero box itself never moves.
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end start"] })
  const layerY = useTransform(scrollYProgress, [0, 1], motionOk ? ["0%", "22%"] : ["0%", "0%"])
  const layerScale = useTransform(scrollYProgress, [0, 1], motionOk ? [1, 1.08] : [1, 1])
  const dim = useTransform(scrollYProgress, [0, 1], motionOk ? [0, 0.55] : [0, 0])
  const [photos, setPhotos] = useState<HeroImage[]>(HERO_IMAGES)
  const [activeIndex, setActiveIndex] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  // Only the first slide is rendered on the server / first paint so the
  // remaining slides never compete with LCP; they mount (and start fetching)
  // right after hydration, well before the first 8s rotation.
  const [showAllSlides, setShowAllSlides] = useState(false)

  const goNext = useCallback(() => {
    setHasRotated(true)
    setActiveIndex((prev) => (prev + 1) % photos.length)
  }, [photos.length])

  useEffect(() => {
    const previousOrder = window.sessionStorage.getItem(HERO_ORDER_STORAGE_KEY)
    const shuffled = getRandomizedHeroImages(previousOrder)

    setPhotos(shuffled)
    setActiveIndex(0)
    window.sessionStorage.setItem(HERO_ORDER_STORAGE_KEY, getOrderKey(shuffled))

    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback
        : (cb: () => void) => window.setTimeout(cb, 200)
    const cancelIdle =
      typeof window.cancelIdleCallback === "function" ? window.cancelIdleCallback : window.clearTimeout
    const idleHandle = idle(() => setShowAllSlides(true))

    return () => cancelIdle(idleHandle as number)
  }, [])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncPreference = () => setPrefersReducedMotion(media.matches)

    syncPreference()
    media.addEventListener("change", syncPreference)

    return () => media.removeEventListener("change", syncPreference)
  }, [])

  useEffect(() => {
    if (photos.length < 2 || !showAllSlides) return
    if (prefersReducedMotion) return
    const interval = window.setInterval(goNext, ROTATE_INTERVAL)
    return () => window.clearInterval(interval)
  }, [goNext, photos.length, prefersReducedMotion, showAllSlides])

  return (
    <div
      ref={rootRef}
      className={cn("relative min-h-[60vh] w-full overflow-hidden bg-ink", className)}
    >
      <motion.div className="absolute inset-0 will-change-transform" style={{ y: layerY, scale: layerScale }}>
        {(showAllSlides ? photos : photos.slice(0, 1)).map((photo, index) => {
          const active = index === activeIndex
          return (
            <div
              key={photo.src}
              data-active={active ? "" : undefined}
              className={cn(
                "hero-slide absolute inset-0",
                active ? "opacity-100" : "opacity-0",
                active && !hasRotated && "ken-burns",
              )}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority={index === 0}
                sizes="(min-width: 2560px) 2560px, 100vw"
                style={
                  {
                    // The per-image horizontal bias wins on x; a record-level focal
                    // point supplies y (and x when no bias is set).
                    objectPosition: `${photo.focusX ?? photo.focal?.x ?? 50}% ${photo.focal?.y ?? 50}%`,
                  } satisfies CSSProperties
                }
                className="object-cover"
              />
            </div>
          )
        })}
      </motion.div>
      <div
        data-testid="hero-contrast-overlay"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,26,29,0.42)_0%,rgba(8,26,29,0.08)_28%,rgba(8,26,29,0.32)_52%,rgba(8,26,29,0.84)_100%)]"
      />
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-reef-deep" style={{ opacity: dim }} />
      {photos.length > 1 ? (
        <div
          data-testid="hero-rotate-indicator"
          aria-hidden="true"
          className="pointer-events-none absolute left-[var(--gutter)] top-6 z-20 md:bottom-9 md:left-1/2 md:top-auto md:-translate-x-1/2"
        >
          <div className="flex items-center gap-1.5">
            {photos.map((photo, index) => {
              const isActive = index === activeIndex

              return (
                <span
                  key={photo.src}
                  className={cn(
                    "relative h-[2px] w-8 overflow-hidden rounded-full bg-white/25 sm:w-12",
                    isActive && "bg-white/30",
                  )}
                >
                  {isActive ? (
                    <span
                      key={`${photo.src}-${activeIndex}`}
                      className="absolute inset-0 origin-left rounded-full bg-canary"
                      style={
                        prefersReducedMotion
                          ? ({
                              transform: "scaleX(1)",
                              opacity: 0.8,
                            } as CSSProperties)
                          : ({
                              animationName: "hero-slide-progress",
                              animationDuration: `${ROTATE_INTERVAL}ms`,
                              animationTimingFunction: "linear",
                              animationFillMode: "forwards",
                            } as CSSProperties)
                      }
                    />
                  ) : null}
                </span>
              )
            })}
          </div>
        </div>
      ) : null}
      {chrome}
      {children ? <div className="absolute inset-0 z-10">{children}</div> : null}
    </div>
  )
}
