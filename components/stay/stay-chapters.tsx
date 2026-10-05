"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import Image from "next/image"

import { imageObjectPosition, type ImageRecord } from "@/lib/images"
import { cn } from "@/lib/utils"

export type StayChapter = {
  title: string
  detail: string
  image: ImageRecord
}

const pad = (n: number) => String(n).padStart(2, "0")

/**
 * "How the stay feels": on desktop the photo column pins while the chapters
 * scroll past; each new chapter wipes its photo up over the last one. On
 * phones every chapter carries its own photo with a clip reveal.
 */
export function StayChapters({ chapters }: { chapters: StayChapter[] }) {
  const [active, setActive] = useState(0)
  const stepRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const steps = stepRefs.current.filter(Boolean) as HTMLLIElement[]
    if (!steps.length || typeof IntersectionObserver === "undefined") return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = Number((entry.target as HTMLElement).dataset.index)
          if (Number.isFinite(index)) setActive(index)
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    )
    steps.forEach((step) => io.observe(step))
    return () => io.disconnect()
  }, [])

  return (
    <div className="grid lg:grid-cols-12 lg:gap-16">
      {/* Pinned photo stack (desktop) */}
      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-[calc(var(--site-header-height)+1.5rem)] h-[calc(100svh-var(--site-header-height)-3rem)] max-h-[860px]">
          <div className="media-frame h-full w-full">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.title}
                aria-hidden={index !== active || undefined}
                className="absolute inset-0 transition-[clip-path] duration-[1300ms] ease-[var(--ease-in-out-quart)] motion-reduce:transition-none"
                style={{ clipPath: index <= active ? "inset(0 0 0 0)" : "inset(100% 0 0 0)", zIndex: index }}
              >
                <Image
                  src={chapter.image.src}
                  alt={chapter.image.alt}
                  fill
                  sizes="(min-width: 1320px) 640px, 50vw"
                  className={cn(
                    "object-cover transition-transform duration-[2000ms] ease-[var(--ease-out-expo)] motion-reduce:transition-none",
                    index === active ? "scale-100" : "scale-[1.14]",
                  )}
                  style={{ objectPosition: imageObjectPosition(chapter.image) }}
                />
              </div>
            ))}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1/3 bg-gradient-to-t from-ink/55 to-transparent"
            />
            <div aria-hidden="true" className="absolute bottom-6 left-7 right-7 z-30 flex items-end justify-between text-white">
              <span className="font-display text-5xl leading-none">
                <span key={active} className="enter-up inline-block">
                  {pad(active + 1)}
                </span>
                <span className="text-2xl text-white/60"> / {pad(chapters.length)}</span>
              </span>
              <span className="flex gap-1.5 pb-2">
                {chapters.map((chapter, index) => (
                  <span
                    key={chapter.title}
                    className={cn(
                      "block h-[3px] rounded-full transition-[width,background-color] duration-700 ease-[var(--ease-out-expo)]",
                      index === active ? "w-8 bg-canary" : "w-3 bg-white/45",
                    )}
                  />
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters */}
      <ol className="flex flex-col gap-16 sm:gap-20 lg:col-span-5 lg:col-start-8 lg:gap-0">
        {chapters.map((chapter, index) => (
          <li
            key={chapter.title}
            ref={(node) => {
              stepRefs.current[index] = node
            }}
            data-index={index}
            className="flex flex-col gap-7 lg:min-h-[78svh] lg:justify-center"
          >
            <div
              data-reveal="clip"
              className="media-frame relative aspect-[4/5] sm:aspect-[3/2] lg:hidden"
              style={{ "--reveal-delay": "60ms" } as CSSProperties}
            >
              <Image
                src={chapter.image.src}
                alt={chapter.image.alt}
                fill
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: imageObjectPosition(chapter.image) }}
              />
            </div>
            <div
              className={cn(
                "flow flow-md transition-opacity duration-700 ease-[var(--ease-out-expo)]",
                index === active ? "lg:opacity-100" : "lg:opacity-35",
              )}
            >
              <span aria-hidden="true" className="tabular text-xs font-medium tracking-[0.24em] text-muted-foreground">
                {pad(index + 1)} — {pad(chapters.length)}
              </span>
              <h3 data-reveal="up" className="font-display text-[clamp(2rem,3.4vw,3.25rem)] leading-[1.02] text-foreground">
                {chapter.title}
              </h3>
              <p
                data-reveal="up"
                style={{ "--reveal-delay": "120ms" } as CSSProperties}
                className="text-lede max-w-md"
              >
                {chapter.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
