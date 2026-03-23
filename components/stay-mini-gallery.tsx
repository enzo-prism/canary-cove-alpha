"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { IMAGES } from "@/lib/images"
import { cn } from "@/lib/utils"

type GalleryItem = {
  src: string
  alt: string
  caption?: string
}

const miniPhotos = [
  { ...IMAGES.heroVillaSeating, caption: "Pool deck with shaded loungers" },
  { ...IMAGES.villaPool, caption: "Infinity pool and waterfront deck" },
  { ...IMAGES.villaInteriorWide, caption: "Open-air great room and kitchen" },
  { ...IMAGES.villaMasterBedroom, caption: "Primary suite with airy views" },
  { ...IMAGES.mainDock, caption: "Private dock for reef departures" },
]

type StayMiniGalleryProps = {
  items?: GalleryItem[]
}

export function StayMiniGallery({ items }: StayMiniGalleryProps) {
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
    <div
      className="surface-panel relative overflow-hidden rounded-[38px] bg-white/95 p-3 sm:p-5"
      data-testid="stay-mini-gallery"
    >
      <div className="space-y-4">
        <Carousel opts={{ align: "start", loop: true }} setApi={setApi}>
          <CarouselContent>
            {galleryItems.map((photo, index) => (
              <CarouselItem key={photo.src}>
                <AspectRatio
                  ratio={21 / 9}
                  className="relative overflow-hidden rounded-[30px] border border-border/40 bg-surface-elevated"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    priority={index === 0}
                    decoding="async"
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(min-width: 1024px) 1000px, 100vw"
                    className="object-cover"
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="ghost"
            className="-left-1 h-10 w-10 border border-border/60 bg-white/90 text-foreground shadow-[0_10px_20px_rgba(15,23,42,0.1)] hover:bg-white sm:-left-2 lg:-left-5"
          />
          <CarouselNext
            variant="ghost"
            className="-right-1 h-10 w-10 border border-border/60 bg-white/90 text-foreground shadow-[0_10px_20px_rgba(15,23,42,0.1)] hover:bg-white sm:-right-2 lg:-right-5"
          />
        </Carousel>
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-2">
            {galleryItems.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollTo(index)}
                className={cn(
                  "h-2 rounded-full transition-all motion-reduce:transition-none motion-safe:hover:scale-110 motion-safe:active:scale-100",
                  selectedIndex === index ? "w-10 bg-foreground" : "w-2 bg-muted-foreground/35 hover:bg-foreground/55",
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          {galleryItems[selectedIndex]?.caption ? (
            <p className="text-center text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {galleryItems[selectedIndex].caption}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
