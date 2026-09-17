"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PhotoLightbox } from "@/components/photo-lightbox"
import { IMAGES, imageObjectPosition } from "@/lib/images"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Skeleton } from "@/components/ui/skeleton"

const photos = [
  {
    ...IMAGES.villaPool,
    caption: "🌅 Private pool, beach, and dock exclusive to your group.",
    detail: "Swim, lounge, or step onto the dock for a sunset cruise.",
  },
  {
    ...IMAGES.turtleDive,
    caption: "🤿 Calm, clear water minutes from the property.",
    detail: "Sea turtles, bright reefs, and gentle currents for all levels.",
  },
  {
    ...IMAGES.chefMarvinKitchen,
    caption: "🍽️ Private-chef dinners without leaving the villa.",
    detail: "Seasonal menus, local catch, and candlelit tables on the deck.",
  },
  {
    ...IMAGES.tubing,
    caption: "🛥️ Adventure days crafted for every age.",
    detail: "Tubing, sandbars, and blue holes planned around the tides.",
  },
  {
    ...IMAGES.wedding,
    caption: "💍 Celebrate under the palms.",
    detail: "Intimate weddings, milestone dinners, and effortless setups.",
  },
  {
    ...IMAGES.drinksBar,
    caption: "🕯️ Slow sunsets and easy evenings.",
    detail: "Drinks by the water after a day on the boats.",
  },
]

export function PhotoCarousel() {
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loadedSlides, setLoadedSlides] = useState<Record<number, boolean>>({})
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const onSelect = useCallback(
    (carouselApi: CarouselApi) => {
      setSelectedIndex(carouselApi.selectedScrollSnap())
    },
    [],
  )

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api],
  )

  const scrollPrev = useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleLoaded = useCallback((index: number) => {
    setLoadedSlides((prev) => ({ ...prev, [index]: true }))
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

  return (
    <Section id="gallery" padding="tight" className="scroll-mt-24">
      <Container className="flow flow-md">
        <Card className="relative overflow-hidden rounded-[40px] border border-border/70 bg-surface">
          <CardContent className="p-0">
            <div className="relative">
              <Carousel opts={{ align: "start", loop: true }} setApi={setApi}>
                <CarouselContent>
                  {photos.map((photo, index) => (
                    <CarouselItem key={photo.src}>
                      <button
                        type="button"
                        onClick={() => setLightboxIndex(index)}
                        aria-label={`View photo: ${photo.alt}`}
                        className="relative block h-[360px] w-full cursor-zoom-in overflow-hidden bg-surface-elevated text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:h-[480px] lg:h-[620px]"
                      >
                        {!loadedSlides[index] ? <Skeleton className="absolute inset-0" /> : null}
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          priority={index === 0}
                          decoding="async"
                          loading={index === 0 ? "eager" : "lazy"}
                          className={`object-cover transition-opacity duration-700 motion-reduce:transition-none ${loadedSlides[index] ? "opacity-100" : "opacity-0"}`}
                          style={{ objectPosition: imageObjectPosition(photo) }}
                          sizes="(min-width: 1280px) 1200px, (min-width: 1024px) 900px, 100vw"
                          onLoad={() => handleLoaded(index)}
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                          <div className="max-w-2xl rounded-2xl border border-white/20 bg-black/55 p-4 backdrop-blur-sm sm:p-5">
                            <p className="text-base text-white sm:text-lg">{photo.caption}</p>
                            <p className="mt-2 hidden text-sm text-white/80 sm:block">{photo.detail}</p>
                          </div>
                        </div>
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-white/30 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.32em] text-white/80 backdrop-blur-sm">
                    Gallery
                  </span>
                  <div className="pointer-events-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLightboxIndex(0)}
                      className="rounded-full border border-white/30 bg-black/30 px-4 text-xs uppercase tracking-[0.24em] text-white/80 backdrop-blur-sm hover:bg-white hover:text-foreground"
                    >
                      View full gallery
                    </Button>
                  </div>
                </div>
                <div className="hidden items-center justify-end lg:flex">
                  <div className="pointer-events-auto flex gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="border border-white/25 bg-black/30 text-white/80 hover:bg-white hover:text-foreground"
                      onClick={scrollPrev}
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="border border-white/25 bg-black/30 text-white/80 hover:bg-white hover:text-foreground"
                      onClick={scrollNext}
                      aria-label="Next slide"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center lg:hidden">
                  <div className="pointer-events-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="border border-white/40 bg-black/55 text-white backdrop-blur-sm hover:bg-white hover:text-foreground"
                      onClick={scrollPrev}
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center lg:hidden">
                  <div className="pointer-events-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="border border-white/40 bg-black/55 text-white backdrop-blur-sm hover:bg-white hover:text-foreground"
                      onClick={scrollNext}
                      aria-label="Next slide"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => scrollTo(index)}
              className={cn(
                "relative h-20 w-28 flex-none overflow-hidden rounded-2xl border border-border/60 bg-surface-elevated transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:h-24 sm:w-32",
                selectedIndex === index ? "opacity-100 ring-2 ring-foreground/40" : "opacity-55 hover:opacity-100",
              )}
              aria-label={`Go to slide ${index + 1}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                decoding="async"
                loading="lazy"
                sizes="112px"
                className="object-cover"
                style={{ objectPosition: imageObjectPosition(photo) }}
              />
            </button>
          ))}
        </div>
        <PhotoLightbox images={photos} openIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      </Container>
    </Section>
  )
}
