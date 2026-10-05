"use client"

import { useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react"

import { Parallax } from "@/components/motion/parallax"
import { useMotionOk } from "@/components/motion/use-motion-ok"
import { CLIP_UP, RISE } from "@/components/explore/reveal-classes"
import { imageObjectPosition, type ImageRecord } from "@/lib/images"
import { cn } from "@/lib/utils"

export type MealStop = {
  id?: string
  time: string
  title: string
  body: ReactNode
  image: ImageRecord
  icon: ReactNode
}

/**
 * "A day at the table": stops from morning to night along a vertical line that
 * fills with scroll progress. Each stop's marker lights canary as it arrives.
 * Desktop alternates photo and copy around a center spine; phones run the
 * spine down the left edge.
 */
export function MealTimeline({ stops }: { stops: MealStop[] }) {
  const ref = useRef<HTMLOListElement>(null)
  const ok = useMotionOk()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.65", "end 0.65"] })
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  const scaleY = useTransform(smooth, (value) => (ok ? value : 1))
  const [reached, setReached] = useState(0)

  // A stop lights up when the filling line reaches its marker.
  useMotionValueEvent(smooth, "change", (value) => {
    const list = ref.current
    if (!list) return
    const height = list.offsetHeight || 1
    let count = 0
    list.querySelectorAll<HTMLElement>(":scope > li").forEach((item) => {
      const marker = item.querySelector<HTMLElement>("[data-marker]")
      const offset = item.offsetTop + (marker?.offsetTop ?? 0) + (marker?.offsetHeight ?? 0) / 2
      if (offset / height <= value + 0.005) count += 1
    })
    setReached((current) => (current === count ? current : count))
  })

  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute bottom-0 left-[1.1rem] top-0 w-px bg-border lg:left-1/2">
        <motion.div className="absolute inset-0 origin-top bg-canary-deep" style={{ scaleY }} />
      </div>

      <ol ref={ref} className="relative flex flex-col gap-16 sm:gap-20 lg:gap-28">
        {stops.map((stop, index) => {
          const flip = index % 2 === 1
          return (
            <li
              key={stop.title}
              id={stop.id}
              data-reveal="group"
              className="relative grid [--anchor-extra:2rem] gap-6 pl-12 lg:grid-cols-2 lg:items-center lg:gap-24 lg:pl-0"
            >
              <span
                aria-hidden="true"
                data-marker=""
                className={cn(
                  "absolute left-[1.1rem] top-1 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border transition-[background-color,color,border-color,box-shadow] duration-700 lg:left-1/2 lg:top-1/2 lg:h-11 lg:w-11 lg:-translate-y-1/2",
                  !ok || index < reached
                    ? "border-canary-deep bg-canary text-ink shadow-[0_0_0_6px_rgba(244,198,61,0.18)]"
                    : "border-border bg-background text-muted-foreground",
                )}
              >
                {stop.icon}
              </span>

              {/* Food shots are 960–1334px phone photos: capped at 30rem so they
                  stay crisp, and pulled toward the spine. */}
              <div className={cn("relative w-full lg:max-w-[30rem]", flip ? "lg:order-2" : "lg:order-1 lg:justify-self-end")}>
                <div className={cn("media-frame relative aspect-[4/3] w-full", CLIP_UP)}>
                  <Parallax amount={6}>
                    <Image
                      src={stop.image.src}
                      alt={stop.image.alt}
                      fill
                      sizes="(min-width: 1024px) 480px, 88vw"
                      className="object-cover"
                      style={{ objectPosition: imageObjectPosition(stop.image) }}
                    />
                  </Parallax>
                </div>
              </div>

              <div
                className={cn(
                  "flow flow-md",
                  flip ? "lg:order-1 lg:items-end lg:text-right" : "lg:order-2",
                  RISE,
                )}
                style={{ transitionDelay: "160ms" }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-lagoon">{stop.time}</p>
                <h3 className="font-display text-[2rem] leading-[1.05] text-foreground sm:text-[2.6rem]">{stop.title}</h3>
                <div className="text-body max-w-md">{stop.body}</div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
