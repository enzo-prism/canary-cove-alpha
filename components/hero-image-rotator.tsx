"use client"

import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

type HeroImage = {
  src: string
  alt: string
  objectPosition?: string
}

// Only use large-format assets here. Full-bleed hero backgrounds need enough
// source width to stay sharp on wide desktop screens and high-density displays.
const HERO_IMAGES: HeroImage[] = [
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059680/IMG_1835_w1onmi.webp",
    alt: "Beach path view of the pink Canary Cove villa and pool terrace",
    objectPosition: "60% center",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059677/outside_sq8dvn.webp",
    alt: "Villa pool and deck overlooking the water",
    objectPosition: "54% center",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059675/canarycove-haydeelustudio-32-scaled_forayc.webp",
    alt: "Villa living room with airy seating and harbor views",
    objectPosition: "58% center",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059670/canarycove-haydeelustudio-521-scaled_ohjnr1.webp",
    alt: "Canary Cove villa view opening toward the water",
    objectPosition: "62% center",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059679/IMG_1198_d9bmki.webp",
    alt: "Canary Cove cocktail in focus with guests relaxing by the pool",
    objectPosition: "56% center",
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
}

export function HeroImageRotator({ className, children }: HeroImageRotatorProps) {
  const [photos, setPhotos] = useState<HeroImage[]>(HERO_IMAGES)
  const [activeIndex, setActiveIndex] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  // Only the first slide is rendered on the server / first paint so the
  // remaining slides never compete with LCP; they mount (and start fetching)
  // right after hydration, well before the first 8s rotation.
  const [showAllSlides, setShowAllSlides] = useState(false)

  const goNext = useCallback(() => {
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
      className={cn("relative min-h-[60vh] w-full overflow-hidden bg-surface-elevated", className)}
    >
      {(showAllSlides ? photos : photos.slice(0, 1)).map((photo, index) => (
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          fill
          priority={index === 0}
          sizes="100vw"
          style={
            {
              objectPosition: photo.objectPosition ?? "center center",
            } satisfies CSSProperties
          }
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out motion-reduce:transition-none",
            index === activeIndex ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div
        data-testid="hero-contrast-overlay"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,22,0.06)_0%,rgba(7,18,22,0.01)_40%,rgba(7,18,22,0.05)_72%,rgba(7,18,22,0.18)_100%)]"
      />
      {photos.length > 1 ? (
        <div
          data-testid="hero-rotate-indicator"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center sm:bottom-7"
        >
          <div className="flex items-center gap-1.5 rounded-full border border-white/18 bg-black/12 px-3 py-2 shadow-[0_18px_50px_rgba(7,18,22,0.18)] backdrop-blur-xl">
            {photos.map((photo, index) => {
              const isActive = index === activeIndex

              return (
                <span
                  key={photo.src}
                  className={cn(
                    "relative h-[2px] w-5 overflow-hidden rounded-full bg-white/16 sm:w-7",
                    isActive && "bg-white/20",
                  )}
                >
                  {isActive ? (
                    <span
                      key={`${photo.src}-${activeIndex}`}
                      className="absolute inset-0 origin-left rounded-full bg-white/82"
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
      {children ? <div className="relative z-10 h-full">{children}</div> : null}
    </div>
  )
}
