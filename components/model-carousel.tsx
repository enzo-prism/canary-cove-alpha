"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { Button } from "@/components/ui/button"
import { imageObjectPosition, type ImageRecord } from "@/lib/images"
import { cn } from "@/lib/utils"

type Model = {
  name: string
  tagline: string
  summary: string
  image: ImageRecord
  stats: readonly { label: string; value: string }[]
  cta: { label: string; href: string }
}

type ModelCarouselProps = {
  models: readonly Model[]
}

export function ModelCarousel({ models }: ModelCarouselProps) {
  const [viewportRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    duration: 25,
    containScroll: "trimSnaps",
    dragFree: false,
    skipSnaps: false,
    slidesToScroll: 1,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const viewportNode = useRef<HTMLDivElement | null>(null)
  const wheelLockRef = useRef<number | null>(null)
  const hoverRef = useRef(false)
  const keyThrottleRef = useRef<number>(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])
  const visibleDots = models.map((_, index) => index)

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const now = Date.now()
      if (now - keyThrottleRef.current < 250) return
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        emblaApi?.scrollPrev()
        keyThrottleRef.current = now
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        emblaApi?.scrollNext()
        keyThrottleRef.current = now
      }
    },
    [emblaApi],
  )

  useEffect(() => {
    const node = viewportNode.current
    if (!node || !emblaApi) return
    const dominance = 1.2

    const handleWheel = (event: WheelEvent) => {
      if (wheelLockRef.current) return
      const target = event.target as Node | null
      if (!hoverRef.current && (!target || !node.contains(target))) return

      const absX = Math.abs(event.deltaX)
      const absY = Math.abs(event.deltaY)
      let delta = 0

      if (absX > absY * dominance) {
        delta = event.deltaX
      } else if (event.shiftKey && absY > 0) {
        delta = event.deltaY
      }

      if (Math.abs(delta) < 12) return

      event.preventDefault()
      event.stopPropagation()
      wheelLockRef.current = window.setTimeout(() => {
        wheelLockRef.current = null
      }, 350)

      if (delta > 0) {
        emblaApi.scrollNext()
      } else {
        emblaApi.scrollPrev()
      }
    }

    node.addEventListener("wheel", handleWheel, { passive: false })
    return () => {
      node.removeEventListener("wheel", handleWheel)
      if (wheelLockRef.current) {
        window.clearTimeout(wheelLockRef.current)
        wheelLockRef.current = null
      }
    }
  }, [emblaApi])

  const count = String(models.length).padStart(2, "0")

  return (
    <div className="flow gap-10 sm:gap-12">
      <div className="mx-auto flex w-full max-w-[1320px] items-end justify-between gap-6 px-[var(--gutter)]">
        <div className="flow flow-md">
          <p data-reveal="fade" className="eyebrow">
            The estate
          </p>
          <h2 data-reveal="up" className="text-section max-w-[14ch]">
            Spaces that scale with <span className="italic-accent">your stay.</span>
          </h2>
        </div>
        <div className="hidden shrink-0 items-center gap-5 sm:flex">
          <p aria-hidden="true" className="tabular font-display text-2xl text-foreground">
            {String(selectedIndex + 1).padStart(2, "0")}
            <span className="text-muted-foreground"> / {count}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              aria-label="Previous space"
              className="h-12 w-12 border-ink/20"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={scrollNext}
              aria-label="Next space"
              className="h-12 w-12 border-ink/20"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-[var(--gutter)]">
        <div
          className="overflow-hidden touch-pan-y overscroll-x-contain overscroll-y-contain carousel-viewport cursor-grab select-none active:cursor-grabbing focus-ring rounded-[var(--radius-media)]"
          ref={(node) => {
            viewportNode.current = node
            viewportRef(node)
          }}
          tabIndex={0}
          aria-label="Estate spaces slider"
          onKeyDown={handleKeyDown}
          onPointerEnter={() => {
            hoverRef.current = true
          }}
          onPointerLeave={() => {
            hoverRef.current = false
          }}
          data-testid="model-carousel-viewport"
        >
          <div className="flex carousel-track">
            {models.map((model, index) => {
              const active = index === selectedIndex
              return (
                <div
                  key={model.name}
                  data-testid={`model-slide-${index}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${models.length}: ${model.name}`}
                  className="min-w-0 flex-[0_0_100%] carousel-slide"
                >
                  <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:items-stretch lg:gap-14">
                    <div className="media-frame relative aspect-[4/3] w-full min-w-0 lg:aspect-auto lg:min-h-[560px]">
                      <Image
                        src={model.image.src}
                        alt={model.image.alt}
                        fill
                        decoding="async"
                        loading="lazy"
                        sizes="(min-width: 1320px) 820px, (min-width: 1024px) 62vw, 100vw"
                        className={cn(
                          "object-cover transition-transform duration-[1800ms] ease-[var(--ease-out-expo)] motion-reduce:transition-none",
                          active ? "scale-100" : "scale-110",
                        )}
                        style={{ objectPosition: imageObjectPosition(model.image) }}
                      />
                    </div>
                    <div
                      data-testid={`model-stack-${index}`}
                      className={cn(
                        "flex min-w-0 flex-col justify-center gap-10 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] motion-reduce:transition-none lg:py-4",
                        active ? "opacity-100" : "opacity-40",
                      )}
                    >
                      <div data-testid={`model-text-${index}`} className="flex flex-col gap-5">
                        <h3 data-testid={`model-title-${index}`} className="text-display pb-1 text-[clamp(2.6rem,4.6vw,4.5rem)]">
                          {model.name}
                        </h3>
                        <p
                          data-testid={`model-tagline-${index}`}
                          className="text-[12px] font-semibold uppercase tracking-[0.24em] text-lagoon"
                        >
                          {model.tagline}
                        </p>
                        <p data-testid={`model-summary-${index}`} className="text-lede max-w-md text-foreground/80">
                          {model.summary}
                        </p>
                      </div>

                      <div data-testid={`model-actions-${index}`} className="flex flex-col gap-7">
                        <dl data-testid={`model-stats-${index}`} className="grid grid-cols-3 border-y border-ink/15">
                          {model.stats.map((stat, statIndex) => (
                            <div
                              key={stat.label}
                              className={cn("flow flow-xs py-4", statIndex > 0 && "border-l border-ink/15 pl-4")}
                            >
                              <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{stat.label}</dt>
                              <dd className="font-display text-xl leading-tight text-foreground sm:text-2xl">{stat.value}</dd>
                            </div>
                          ))}
                        </dl>
                        <TrackedLink
                          href={model.cta.href}
                          data-testid={`model-cta-${index}`}
                          eventName="cta_click"
                          eventPayload={{ location: "model_carousel", target: model.cta.href, label: model.name }}
                          className="group focus-ring inline-flex min-h-11 w-fit items-center gap-3 rounded-full text-[15px] font-medium text-foreground"
                        >
                          <span className="roll">
                            <span>{model.cta.label}</span>
                            <span aria-hidden="true">{model.cta.label}</span>
                          </span>
                          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sand-light">
                            <ChevronRight className="arrow-nudge h-4 w-4" />
                          </span>
                        </TrackedLink>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2">
          {visibleDots.map((index) => {
            const model = models[index]
            return (
              <button
                key={model.name}
                type="button"
                onClick={() => scrollTo(index)}
                aria-label={`Go to ${model.name}`}
                aria-current={index === selectedIndex ? "true" : undefined}
                className={cn(
                  "relative h-[3px] rounded-full transition-[width,background-color] duration-500 ease-[var(--ease-out-expo)] after:absolute after:-inset-x-1 after:-inset-y-5 after:content-['']",
                  index === selectedIndex ? "w-14 bg-foreground" : "w-7 bg-muted-foreground/35 hover:bg-muted-foreground/60",
                )}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
