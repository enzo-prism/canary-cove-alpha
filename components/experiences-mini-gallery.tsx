"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { IMAGES } from "@/lib/images"

type GalleryItem = {
  src: string
  alt: string
  caption?: string
}

const miniPhotos = [
  { ...IMAGES.tubing, caption: "Tubing and boat days" },
  { ...IMAGES.divingFun, caption: "Reef dives and snorkel time" },
  { ...IMAGES.caveTubing, caption: "Cave tubing adventures" },
  { ...IMAGES.landAdventure, caption: "Mainland jungle excursions" },
  { ...IMAGES.romanticViews, caption: "Sunset cruises and calm water" },
  { ...IMAGES.mainDock, caption: "Private dock departures" },
]

type ExperiencesMiniGalleryProps = {
  items?: GalleryItem[]
}

export function ExperiencesMiniGallery({ items }: ExperiencesMiniGalleryProps) {
  const galleryItems = items ?? miniPhotos
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback((carouselApi: CarouselApi) => {
    setSelectedIndex(carouselApi.selectedScrollSnap())
  }, [])

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api],
  )

  useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api, onSelect])

  return (
    <Card className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
      <CardContent className="space-y-4 p-4 sm:p-6">
        <Carousel opts={{ align: "start", loop: true }} setApi={setApi}>
          <CarouselContent>
            {galleryItems.map((photo, index) => (
              <CarouselItem key={photo.src}>
                <AspectRatio ratio={16 / 9} className="relative overflow-hidden rounded-2xl bg-surface-elevated">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1024px) 1000px, 100vw"
                    className="object-cover"
                  />
                  {photo.caption ? (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent p-3">
                      <p className="text-xs font-medium text-white/90">{photo.caption}</p>
                    </div>
                  ) : null}
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="ghost"
            className="left-3 h-9 w-9 border border-white/70 bg-white/80 text-foreground hover:bg-white"
          />
          <CarouselNext
            variant="ghost"
            className="right-3 h-9 w-9 border border-white/70 bg-white/80 text-foreground hover:bg-white"
          />
        </Carousel>
        <div className="flex flex-wrap justify-center gap-2">
          {galleryItems.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all motion-reduce:transition-none motion-safe:hover:scale-110 motion-safe:active:scale-100 ${
                selectedIndex === index
                  ? "w-8 bg-foreground"
                  : "w-2 bg-muted-foreground/40 hover:bg-foreground/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
