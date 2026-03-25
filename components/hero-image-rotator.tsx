"use client"

import { useCallback, useEffect, useState, type ReactNode } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { IMAGES } from "@/lib/images"

type HeroImage = {
  src: string
  alt: string
}

const HERO_IMAGES: HeroImage[] = [
  {
    ...IMAGES.heroBackgroundEstate,
  },
  {
    ...IMAGES.heroBackgroundPool,
  },
  {
    ...IMAGES.heroBackgroundDrink,
  },
  {
    ...IMAGES.heroBackgroundBar,
  },
  {
    ...IMAGES.heroBackgroundLawn,
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
  let nextOrder = shuffle(HERO_IMAGES)
  let attempts = 0

  while (previousOrder && HERO_IMAGES.length > 1 && getOrderKey(nextOrder) === previousOrder && attempts < 8) {
    nextOrder = shuffle(HERO_IMAGES)
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
          sizes="(min-width: 1280px) 1200px, (min-width: 1024px) 900px, 100vw"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out motion-reduce:transition-none",
            index === activeIndex ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div
        data-testid="hero-contrast-overlay"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/70"
      />
      {children ? <div className="relative z-10 h-full">{children}</div> : null}
    </div>
  )
}
