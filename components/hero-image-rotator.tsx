"use client"

import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { IMAGES } from "@/lib/images"

type HeroImage = {
  src: string
  alt: string
  objectPosition?: string
}

// Only use large-format assets here. Full-bleed hero backgrounds need enough
// source width to stay sharp on wide desktop screens and high-density displays.
const HERO_IMAGES: HeroImage[] = [
  {
    ...IMAGES.heroVillaSeating,
    objectPosition: "60% center",
  },
  {
    ...IMAGES.heroBackgroundPool,
    objectPosition: "54% center",
  },
  {
    ...IMAGES.heroBackgroundLawn,
    objectPosition: "58% center",
  },
  {
    ...IMAGES.heroBackgroundEstate,
    objectPosition: "62% center",
  },
  {
    ...IMAGES.heroVillaDining,
    objectPosition: "56% center",
  },
  {
    ...IMAGES.heroBackgroundBar,
    objectPosition: "58% center",
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

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % photos.length)
  }, [photos.length])

  useEffect(() => {
    const previousOrder = window.sessionStorage.getItem(HERO_ORDER_STORAGE_KEY)
    const shuffled = getRandomizedHeroImages(previousOrder)

    setPhotos(shuffled)
    setActiveIndex(0)
    window.sessionStorage.setItem(HERO_ORDER_STORAGE_KEY, getOrderKey(shuffled))
  }, [])

  useEffect(() => {
    if (photos.length < 2) return
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (media.matches) return
    const interval = window.setInterval(goNext, ROTATE_INTERVAL)
    return () => window.clearInterval(interval)
  }, [goNext, photos.length])

  return (
    <div
      className={cn("relative min-h-[60vh] w-full overflow-hidden bg-surface-elevated", className)}
    >
      {photos.map((photo, index) => (
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
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,22,0.14)_0%,rgba(7,18,22,0.02)_34%,rgba(7,18,22,0.18)_64%,rgba(7,18,22,0.5)_100%)]"
      />
      {children ? <div className="relative z-10 h-full">{children}</div> : null}
    </div>
  )
}
