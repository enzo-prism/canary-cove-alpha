"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"

export type SectionContent = {
  id: string
  label: string
  title: string
  description: string
  bullets?: string[]
  note?: string
  images?: { src: string; alt: string }[]
}

type SectionPageContentProps = {
  eyebrow: string
  title: string
  intro: string
  sections: SectionContent[]
  aside?: ReactNode
}

export function SectionPageContent({ eyebrow, title, intro, sections, aside }: SectionPageContentProps) {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-14 sm:px-6 sm:pb-28 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface/80 via-white to-surface-muted/60" />
      <div className="absolute left-[12%] top-[18%] -z-10 h-64 w-64 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute right-[8%] bottom-[18%] -z-10 h-72 w-72 rounded-full bg-primary/5 blur-[140px]" />

      <div className="mx-auto max-w-6xl xl:max-w-7xl space-y-10">
        <div className="flex flex-wrap items-center gap-3 rounded-full border border-border/70 bg-white/70 px-5 py-2 text-xs uppercase tracking-[0.32em] text-muted-foreground backdrop-blur">
          {eyebrow}
          <span className="h-1 w-1 rounded-full bg-primary" />
          One private estate
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{title}</h1>
            <p className="text-lg text-muted-foreground sm:text-xl">{intro}</p>
            <div className="flex flex-wrap gap-2">
              {sections.map((section) => (
                <Link
                  key={section.id}
                  href={`#${section.id}`}
                  className="rounded-full border border-border/70 bg-white/80 px-4 py-2 text-sm font-medium text-foreground transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 hover:text-primary"
                >
                  {section.label}
                </Link>
              ))}
            </div>
          </div>

          {aside && (
            <div className="rounded-3xl border border-border/70 bg-white/90 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              {aside}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="scroll-mt-28 rounded-3xl border border-border/70 bg-white/90 p-6 shadow-[0_16px_55px_rgba(15,23,42,0.08)]"
            >
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{section.label}</p>
                <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">{section.title}</h2>
                <p className="text-base text-muted-foreground">{section.description}</p>
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="mt-2 h-1.5 w-3 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.note && <p className="text-sm text-muted-foreground">{section.note}</p>}
                {section.images && section.images.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {section.images.map((image) => (
                      <div key={image.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/70">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(min-width: 1024px) 500px, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                          priority={section.id === "overview"}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
