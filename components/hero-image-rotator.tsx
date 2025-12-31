"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { IMAGES } from "@/lib/images"
import { cn } from "@/lib/utils"

type HeroImage = {
  src: string
  alt: string
}

const HERO_IMAGES: HeroImage[] = [
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767202762/canarycove-haydeelustudio-59_x8gmzo.webp",
    alt: "Canary Cove villa seating area",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767202762/canarycove-haydeelustudio-48_wciu3z.webp",
    alt: "Canary Cove villa open-air lounge",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767202756/canarycove-haydeelustudio-55_gimbjx.webp",
    alt: "Canary Cove villa dining table",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767202751/canarycove-haydeelustudio-56_ixnmn0.webp",
    alt: "Canary Cove villa living space",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767202746/canarycove-haydeelustudio-56_1_dhk9k9.webp",
    alt: "Canary Cove villa lounge detail",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767202746/canarycove-haydeelustudio-54_1_cvfho6.webp",
    alt: "Canary Cove villa interior view",
  },
  IMAGES.logoDrink,
  IMAGES.villaBedroom,
  IMAGES.villaMasterBedroom,
  IMAGES.livingRoomAlt,
]

const ROTATE_INTERVAL = 5000

const shuffle = (items: HeroImage[]) => {
  const array = [...items]
  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[array[index], array[swapIndex]] = [array[swapIndex], array[index]]
  }
  return array
}

export function HeroImageRotator() {
  const [photos, setPhotos] = useState<HeroImage[]>(HERO_IMAGES)
  const [activeIndex, setActiveIndex] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const dialogId = "hero-image-viewer"

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % photos.length)
  }, [photos.length])

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }, [photos.length])

  useEffect(() => {
    const shuffled = shuffle(HERO_IMAGES)
    const currentSrc = HERO_IMAGES[0]?.src
    const nextIndex = shuffled.findIndex((photo) => photo.src === currentSrc)
    setPhotos(shuffled)
    if (nextIndex >= 0) {
      setActiveIndex(nextIndex)
    }
  }, [])

  useEffect(() => {
    if (dialogOpen || photos.length < 2) return
    const interval = window.setInterval(goNext, ROTATE_INTERVAL)
    return () => window.clearInterval(interval)
  }, [dialogOpen, goNext, photos.length])

  useEffect(() => {
    if (!dialogOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        goPrev()
      }
      if (event.key === "ArrowRight") {
        event.preventDefault()
        goNext()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [dialogOpen, goNext, goPrev])

  const activePhoto = photos[activeIndex] ?? photos[0]

  return (
    <Card className="rounded-[32px] border border-white/40 bg-white/80 p-4 shadow-[0_35px_120px_rgba(15,23,42,0.15)] backdrop-blur-xl">
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/60 sm:aspect-video">
          {photos.map((photo, index) => (
            <Image
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 520px, 100vw"
              className={cn(
                "object-cover transition-opacity duration-700 ease-out",
                index === activeIndex ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild aria-controls={dialogId}>
              <Button
                variant="outline"
                size="sm"
                className="absolute bottom-4 right-4 rounded-full border-white/70 bg-white/85 text-foreground shadow-sm shadow-black/10 hover:bg-white"
                aria-label="View image full screen"
              >
                View full screen
                <Maximize2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent id={dialogId} className="flex max-w-[96vw] flex-col gap-4 p-4 sm:p-6">
              <DialogHeader className="sr-only">
                <DialogTitle>Canary Cove image gallery</DialogTitle>
              </DialogHeader>
              <div className="relative flex h-[70vh] items-center justify-center overflow-hidden rounded-3xl bg-black/5">
                {activePhoto ? (
                  <Image
                    key={activePhoto.src}
                    src={activePhoto.src}
                    alt={activePhoto.alt}
                    fill
                    sizes="96vw"
                    className="object-contain"
                  />
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border-white/70 bg-white/85 text-foreground shadow-sm hover:bg-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border-white/70 bg-white/85 text-foreground shadow-sm hover:bg-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                {activeIndex + 1} of {photos.length}
              </p>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
