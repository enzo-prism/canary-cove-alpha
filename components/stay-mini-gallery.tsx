"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Expand } from "lucide-react"

import { PhotoLightbox } from "@/components/photo-lightbox"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { IMAGES, imageObjectPosition, type ImageFocal } from "@/lib/images"
import { cn } from "@/lib/utils"

type GalleryItem = {
  src: string
  alt: string
  caption?: string
  focal?: ImageFocal
}

const miniPhotos: GalleryItem[] = [
  { ...IMAGES.heroVillaSeating, caption: "Pool deck with shaded loungers" },
  { ...IMAGES.villaPool, caption: "Infinity pool and waterfront deck" },
  { ...IMAGES.villaInteriorWide, caption: "Open-air great room and kitchen" },
  { ...IMAGES.villaMasterBedroom, caption: "Primary suite with airy views" },
  { ...IMAGES.scubaPhoto, caption: "Reef days off the dock" },
]

type StayMiniGalleryProps = {
  items?: GalleryItem[]
}

const pad = (n: number) => String(n).padStart(2, "0")

/**
 * The stay "photo tour": a wide Embla filmstrip with a peek of the next frame,
 * a caption that rolls with the selection, and quiet ink controls. Built on
 * components/ui/carousel (keyboard arrows, wheel, drag-snap).
 */
export function StayMiniGallery({ items }: StayMiniGalleryProps) {
  const galleryItems = items ?? miniPhotos
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const onSelect = useCallback((carouselApi: CarouselApi) => {
    setSelectedIndex(carouselApi.selectedScrollSnap())
  }, [])

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

  const current = galleryItems[selectedIndex]

  return (
    <div className="relative" data-testid="stay-mini-gallery">
      <Carousel
        opts={{ align: "start", loop: true }}
        setApi={setApi}
        aria-label="Stay photo tour"
        className="focus-ring rounded-[var(--radius-media)]"
      >
        <CarouselContent>
          {galleryItems.map((photo, index) => {
            const active = index === selectedIndex
            return (
              <CarouselItem key={photo.src} className="mr-3 basis-[88%] sm:mr-5 sm:basis-[80%] lg:basis-[74%]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`View photo: ${photo.alt}`}
                  className="group media-frame block aspect-[4/5] w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 sm:aspect-[16/10] lg:aspect-[16/9]"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1320px) 940px, (min-width: 640px) 80vw, 88vw"
                    className={cn(
                      "object-cover transition-[transform,filter] duration-[1600ms] ease-[var(--ease-out-expo)] motion-reduce:transition-none",
                      active ? "scale-100" : "scale-[1.08] brightness-[0.82]",
                    )}
                    style={{ objectPosition: imageObjectPosition(photo) }}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/45 to-transparent"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-sand-light/85 text-ink opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <Expand className="size-4" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-display absolute bottom-4 left-5 text-[clamp(1.5rem,2.2vw,2rem)] leading-none text-white sm:bottom-6 sm:left-7"
                  >
                    {pad(index + 1)}
                  </span>
                </button>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 sm:mt-8">
        <div className="flex min-w-0 items-baseline gap-4">
          <span className="tabular shrink-0 text-xs font-medium tracking-[0.2em] text-muted-foreground">
            {pad(selectedIndex + 1)} / {pad(galleryItems.length)}
          </span>
          {current?.caption ? (
            <p
              key={selectedIndex}
              aria-live="polite"
              className="font-display enter-up truncate text-xl leading-tight text-foreground sm:text-2xl"
            >
              {current.caption}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2.5 px-1">
            {galleryItems.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "focus-ring relative h-[3px] rounded-full transition-[width,background-color] duration-700 ease-[var(--ease-out-expo)] after:absolute after:-inset-x-[5px] after:-inset-y-5 after:content-[''] motion-reduce:transition-none",
                  selectedIndex === index ? "w-12 bg-foreground" : "w-7 bg-ink/20 hover:bg-ink/45",
                )}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={selectedIndex === index ? "true" : undefined}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              aria-label="Previous photo"
              className="focus-ring flex size-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-sand-light"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => api?.scrollNext()}
              aria-label="Next photo"
              className="focus-ring flex size-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-sand-light"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
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
