"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Expand } from "lucide-react"

import { PhotoLightbox } from "@/components/photo-lightbox"
import { IMAGES, imageObjectPosition } from "@/lib/images"
import { cn } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { Container } from "@/components/layout/container"
import { SectionHeading } from "@/components/section-heading"
import { CtaLink } from "@/components/ui/cta-link"

const photos = [
  {
    ...IMAGES.villaPool,
    caption: "Private pool, beach, and dock exclusive to your group.",
    detail: "Swim, lounge, or step onto the dock for a sunset cruise.",
  },
  {
    ...IMAGES.scubaPhoto,
    caption: "Calm, clear water minutes from the property.",
    detail: "Sea turtles, bright reefs, and gentle currents for all levels.",
  },
  {
    ...IMAGES.diningSpread,
    caption: "Private-chef dinners without leaving the villa.",
    detail: "Seasonal menus, local catch, and candlelit tables on the deck.",
  },
  {
    ...IMAGES.tubing,
    caption: "Adventure days crafted for every age.",
    detail: "Tubing, sandbars, and blue holes planned around the tides.",
  },
  {
    ...IMAGES.wedding,
    caption: "Celebrate under the palms.",
    detail: "Intimate weddings, milestone dinners, and effortless setups.",
  },
  {
    ...IMAGES.heroBackgroundDrink,
    caption: "Slow sunsets and easy evenings.",
    detail: "Drinks by the water after a day on the boats.",
  },
]

const pad = (n: number) => String(n).padStart(2, "0")

/**
 * /book's swipeable film of a stay. Embla underneath (shared Carousel), with
 * a thumbnail rail whose active frame carries a ring. Slides open the
 * fullscreen lightbox.
 */
export function PhotoCarousel() {
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const onSelect = useCallback((carouselApi: CarouselApi) => {
    setSelectedIndex(carouselApi.selectedScrollSnap())
  }, [])

  const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api])
  const scrollPrev = useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = useCallback(() => api?.scrollNext(), [api])

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

  const active = photos[selectedIndex] ?? photos[0]

  const chromeButton =
    "focus-ring pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-md transition-[background-color,color,border-color] duration-500 ease-[var(--ease-out-expo)] hover:border-white hover:bg-white hover:text-ink"

  return (
    <section id="gallery" className="py-20 sm:py-28">
      <Container size="wide">
        <SectionHeading
          eyebrow="A week at the estate"
          title="What a stay *looks like.*"
          lede="Six frames from the days you are booking: the pool and dock, the reef, the chef's table, and long evenings by the water."
          action={
            <CtaLink href="/gallery" variant="outline">
              Browse every photo
            </CtaLink>
          }
          align="split"
        />

        <div className="relative mt-10 sm:mt-14">
          <Carousel opts={{ align: "start", loop: true }} setApi={setApi} className="overflow-hidden rounded-[var(--radius-media)]">
            <CarouselContent>
              {photos.map((photo, index) => (
                <CarouselItem key={photo.src}>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    aria-label={`View photo: ${photo.alt}`}
                    className="group relative block h-[440px] w-full cursor-zoom-in overflow-hidden rounded-[var(--radius-media)] bg-sand-deep text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:h-[540px] lg:h-[640px]"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      decoding="async"
                      className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-out-expo)] motion-safe:group-hover:scale-[1.03]"
                      style={{ objectPosition: imageObjectPosition(photo) }}
                      sizes="(min-width: 1320px) 1224px, (min-width: 640px) calc(100vw - 4rem), 100vw"
                    />
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 pb-24 text-white sm:max-w-2xl sm:p-10">
                      <span className="font-display text-[1.75rem] leading-[1.1] text-balance sm:text-[2.5rem]">{photo.caption}</span>
                      <span className="hidden text-[15px] leading-6 text-white/75 sm:block">{photo.detail}</span>
                    </span>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Overlay chrome sits over the frame; only the buttons take pointer events, so swipes pass through. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-8">
            <span className="rounded-full border border-white/30 bg-ink/30 px-3.5 py-1.5 text-xs font-medium tabular-nums tracking-[0.12em] text-white backdrop-blur-md">
              {pad(selectedIndex + 1)} / {pad(photos.length)}
            </span>
            <button
              type="button"
              onClick={() => setLightboxIndex(selectedIndex)}
              className={chromeButton}
              aria-label="Open fullscreen gallery"
            >
              <Expand className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <div className="pointer-events-none absolute bottom-0 right-0 flex gap-2.5 p-5 sm:p-8">
            <button type="button" className={chromeButton} onClick={scrollPrev} aria-label="Previous slide">
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button type="button" className={chromeButton} onClick={scrollNext} aria-label="Next slide">
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>

        <div className="no-scrollbar -mx-6 mt-5 flex snap-x scroll-px-6 gap-3 overflow-x-auto px-6 py-1.5 sm:mx-0 sm:mt-6 sm:grid sm:grid-cols-6 sm:overflow-visible sm:px-0">
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => scrollTo(index)}
              className={cn(
                "relative h-16 w-24 flex-none snap-start overflow-hidden rounded-xl bg-sand-deep transition-[opacity,box-shadow] duration-500 ease-[var(--ease-out-expo)] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:h-20 sm:w-auto",
                selectedIndex === index
                  ? "opacity-100 ring-2 ring-ink ring-offset-2 ring-offset-background"
                  : "opacity-50 hover:opacity-90",
              )}
              aria-label={`Go to slide ${index + 1}`}
            >
              <Image
                src={photo.src}
                alt=""
                fill
                decoding="async"
                loading="lazy"
                sizes="(min-width: 640px) 200px, 96px"
                className="object-cover"
                style={{ objectPosition: imageObjectPosition(photo) }}
              />
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          Slide {selectedIndex + 1} of {photos.length}: {active.caption}
        </p>
        <PhotoLightbox images={photos} openIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      </Container>
    </section>
  )
}
