import { useMemo, type CSSProperties } from "react"

import type { Testimonial } from "@/lib/testimonial-spotlights"
import { cn } from "@/lib/utils"

type TestimonialEntry = {
  quote: string
  author?: string
}

type TestimonialGroup = {
  year: string
  entries: TestimonialEntry[]
}

type TestimonialWithYear = TestimonialEntry & {
  year: string
}

type TestimonialsGridProps = {
  groups?: TestimonialGroup[]
  testimonials?: Testimonial[]
  /** `light` for use on `.surface-reef` bands. */
  tone?: "default" | "light"
}

/**
 * Guestbook notes as large serif quote cards. Every note is shown in full and
 * verbatim — never clipped mid-word.
 */
export function TestimonialsGrid({ groups, testimonials: testimonialsProp, tone = "default" }: TestimonialsGridProps) {
  const testimonials = useMemo<TestimonialWithYear[]>(
    () =>
      testimonialsProp ??
      (groups ?? []).flatMap((group) =>
        group.entries.map((entry) => ({
          ...entry,
          year: group.year,
        })),
      ),
    [groups, testimonialsProp],
  )
  const light = tone === "light"

  return (
    <div
      data-reveal="stagger"
      style={{ "--stagger-step": "120ms" } as CSSProperties}
      className={cn("grid items-start gap-4 sm:gap-5", testimonials.length > 1 && "md:grid-cols-2", testimonials.length > 2 && "xl:grid-cols-3")}
    >
      {testimonials.map((testimonial, index) => (
        <figure
          key={`${testimonial.year}-${index}`}
          style={{ "--stagger-index": index } as CSSProperties}
          className={cn(
            "flex h-full flex-col gap-6 rounded-[var(--radius-media)] border p-6 sm:p-8",
            light ? "border-white/15 bg-white/[0.04]" : "border-border/80 bg-surface",
          )}
        >
          <span className="flex items-center justify-between gap-4">
            <span
              aria-hidden="true"
              className={cn("font-display text-6xl leading-[0.6]", light ? "text-canary" : "text-lagoon")}
            >
              “
            </span>
            <span
              className={cn(
                "text-[11px] font-semibold uppercase tracking-[0.24em] tabular",
                light ? "text-white/65" : "text-muted-foreground",
              )}
            >
              {testimonial.year}
            </span>
          </span>
          <blockquote
            className={cn(
              "font-display text-[1.3rem] leading-[1.32] sm:text-[1.5rem]",
              light ? "text-white" : "text-foreground",
            )}
          >
            {testimonial.quote}
          </blockquote>
          <figcaption className={cn("mt-auto pt-2 text-sm font-medium", light ? "text-white/80" : "text-foreground")}>
            {testimonial.author ?? "Guest"}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
