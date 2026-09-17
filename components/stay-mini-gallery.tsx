"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"

import { PhotoLightbox } from "@/components/photo-lightbox"
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
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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
      className="surface-panel relative overflow-hidden rounded-[32px] bg-white/95 p-3 sm:p-4"
      data-testid="stay-mini-gallery"
    >
      <div className="space-y-4">
        <Carousel opts={{ align: "start", loop: true }} setApi={setApi} aria-label="Stay photo tour">
          <CarouselContent>
            {galleryItems.map((photo, index) => (
              <CarouselItem key={photo.src}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`View photo: ${photo.alt}`}
                  className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-[24px] border border-border/40 bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:aspect-[21/9]"
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
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="ghost"
            aria-label="Previous photo"
            className="left-3 size-11 border border-border/60 bg-white/92 text-foreground shadow-[0_10px_20px_rgba(15,23,42,0.12)] hover:bg-white sm:left-4"
          />
          <CarouselNext
            variant="ghost"
            aria-label="Next photo"
            className="right-3 size-11 border border-border/60 bg-white/92 text-foreground shadow-[0_10px_20px_rgba(15,23,42,0.12)] hover:bg-white sm:right-4"
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
                  "relative h-2 rounded-full transition-all after:absolute after:-inset-2 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 motion-reduce:transition-none motion-safe:hover:scale-110 motion-safe:active:scale-100",
                  selectedIndex === index ? "w-10 bg-foreground" : "w-2 bg-muted-foreground/40 hover:bg-foreground/55",
                )}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={selectedIndex === index ? "true" : undefined}
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
      <PhotoLightbox
        images={galleryItems.map((photo) => ({ src: photo.src, alt: photo.alt, caption: photo.caption }))}
        openIndex={openIndex}
        onClose={() => setOpenIndex(null)}
      />
    </div>
  )
}
