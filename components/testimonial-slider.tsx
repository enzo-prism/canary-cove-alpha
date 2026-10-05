"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"

import { imageObjectPosition, type ImageRecord } from "@/lib/images"
import { cn } from "@/lib/utils"

type Testimonial = {
  quote: string
  author?: string
  year: string
  image: ImageRecord
}

type TestimonialSliderProps = {
  testimonials: readonly Testimonial[]
}

export function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
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
  const visibleDots = testimonials.map((_, index) => index)

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

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

  const active = testimonials[selectedIndex] ?? testimonials[0]

  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
      <div className="flow flow-lg">
        <p data-reveal="fade" className="eyebrow">
          Guest stories
        </p>
        <h2 data-reveal="up" className="text-section max-w-[12ch]">
          Real stays, <span className="italic-accent">unforgettable</span> moments.
        </h2>
        <p data-reveal="up" className="text-lede max-w-sm">
          Notes left in the guestbook, word for word. Swipe through, or read the full archive.
        </p>
        <p aria-hidden="true" className="tabular hidden font-display text-6xl leading-none text-foreground/15 lg:block">
          {String(selectedIndex + 1).padStart(2, "0")}
          <span className="text-3xl"> / {String(testimonials.length).padStart(2, "0")}</span>
        </p>
        <span className="sr-only" aria-live="polite">
          {active ? `Testimonial ${selectedIndex + 1} of ${testimonials.length}` : null}
        </span>
      </div>
      <div className="min-w-0">
        <div
          className="overflow-hidden touch-pan-y overscroll-x-contain overscroll-y-contain carousel-viewport cursor-grab select-none active:cursor-grabbing focus-ring rounded-[var(--radius-media)]"
          ref={(node) => {
            viewportNode.current = node
            viewportRef(node)
          }}
          tabIndex={0}
          aria-label="Testimonial slider"
          onKeyDown={handleKeyDown}
          onPointerEnter={() => {
            hoverRef.current = true
          }}
          onPointerLeave={() => {
            hoverRef.current = false
          }}
          data-testid="testimonial-carousel-viewport"
        >
          <div className="flex carousel-track">
            {testimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.author ?? "guest"}-${testimonial.year}`}
                role="group"
                aria-roledescription="slide"
                data-testid={`testimonial-slide-${index}`}
                className="min-w-0 flex-[0_0_100%] carousel-slide"
              >
                <figure
                  data-testid={`testimonial-card-${index}`}
                  className="relative flex min-h-[460px] flex-col justify-end overflow-hidden rounded-[var(--radius-media)] bg-ink sm:min-h-[540px]"
                >
                  <Image
                    src={testimonial.image.src}
                    alt={testimonial.image.alt}
                    fill
                    decoding="async"
                    loading="lazy"
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className={cn(
                      "object-cover transition-transform duration-[2000ms] ease-[var(--ease-out-expo)] motion-reduce:transition-none",
                      index === selectedIndex ? "scale-100" : "scale-110",
                    )}
                    style={{ objectPosition: imageObjectPosition(testimonial.image) }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-reef-deep via-reef-deep/70 via-[55%] to-reef-deep/10" />
                  <div className="relative z-10 flow flow-lg p-7 sm:p-11">
                    <svg viewBox="0 0 32 24" aria-hidden="true" className="h-7 w-9 fill-canary">
                      <path d="M0 24V14C0 6 4.5 1.2 12.5 0l1.3 3.4C9.6 4.6 7.5 7.4 7.3 11H13v13H0zm18.6 0V14c0-8 4.5-12.8 12.5-14l1.3 3.4c-4.2 1.2-6.3 4-6.5 7.6h5.7v13H18.6z" />
                    </svg>
                    <blockquote
                      data-testid={`testimonial-quote-${index}`}
                      className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.15] text-pretty text-white"
                    >
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <figcaption className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-white/70">
                      <span aria-hidden="true" className="h-px w-8 bg-canary" />
                      {testimonial.author ?? "Guest"} · {testimonial.year}
                    </figcaption>
                  </div>
                </figure>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-7 flex items-center gap-2">
          {visibleDots.map((index) => {
            const testimonial = testimonials[index]
            return (
              <button
                key={`${testimonial.author ?? "guest"}-${testimonial.year}-dot`}
                type="button"
                onClick={() => scrollTo(index)}
                aria-label={`Go to testimonial ${index + 1}`}
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
