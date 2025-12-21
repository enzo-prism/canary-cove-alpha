"use client"

import { useMemo, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Testimonial } from "@/lib/testimonial-spotlights"

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
}

export function TestimonialsGrid({ groups, testimonials: testimonialsProp }: TestimonialsGridProps) {
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
  const [active, setActive] = useState<TestimonialWithYear | null>(null)
  const [open, setOpen] = useState(false)

  const handleOpen = (testimonial: TestimonialWithYear) => {
    setActive(testimonial)
    setOpen(true)
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {testimonials.map((testimonial, index) => (
          <button
            key={`${testimonial.year}-${index}`}
            type="button"
            onClick={() => handleOpen(testimonial)}
            className="group flex h-full flex-col gap-3 rounded-2xl border border-border/60 bg-white/90 p-5 text-left shadow-sm shadow-black/5 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/10 hover:shadow-[0_14px_30px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none"
            aria-label={`Open testimonial from ${testimonial.author ?? "guest"} (${testimonial.year})`}
          >
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{testimonial.year}</span>
            <p className="text-sm leading-relaxed text-foreground">"{testimonial.quote}"</p>
            {testimonial.author ? (
              <span className="text-xs font-semibold text-foreground">- {testimonial.author}</span>
            ) : null}
          </button>
        ))}
      </div>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          if (!nextOpen) setActive(null)
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-foreground">
              {active?.author ?? "Guest testimonial"}
            </DialogTitle>
            {active ? <DialogDescription>{active.year}</DialogDescription> : null}
          </DialogHeader>
          {active ? <p className="text-base leading-relaxed text-foreground">"{active.quote}"</p> : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
