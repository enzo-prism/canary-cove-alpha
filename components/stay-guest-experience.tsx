import type { CSSProperties } from "react"

import { SectionHeading } from "@/components/section-heading"
import { StayChapters, type StayChapter } from "@/components/stay/stay-chapters"
import { IMAGES } from "@/lib/images"
import type { Testimonial } from "@/lib/testimonial-spotlights"

const experienceRows: StayChapter[] = [
  {
    title: "Arrival and hosting",
    detail: "From the San Pedro pickup to the welcome at the dock, the stay starts smoothly and stays personal.",
    image: IMAGES.heroBackgroundEstate,
  },
  {
    title: "Chef-led dining",
    detail:
      "Private lunches and dinners are served at the estate so your group never has to work around a restaurant schedule.",
    image: IMAGES.shrimpDinner,
  },
  {
    title: "Quiet private suites",
    detail: "Three king rooms give everyone space to reset between reef days, pool afternoons, and long dinners.",
    image: IMAGES.villaMasterBedroom,
  },
  {
    title: "Waterfront downtime",
    detail: "Hammocks, loungers, and the dock keep the estate feeling calm even on the fullest itinerary.",
    image: IMAGES.heroBackgroundPool,
  },
]

type StayGuestExperienceProps = {
  testimonials: Testimonial[]
}

function PerspectiveStack({ perspectives }: { perspectives: Testimonial[] }) {
  const [first, second] = perspectives

  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
      <figure className="relative pt-14 sm:pt-[4.5rem] lg:col-span-8" data-reveal="blur">
        <span
          aria-hidden="true"
          className="font-display pointer-events-none absolute -left-1 -top-1 select-none text-[6rem] leading-[0.8] text-canary sm:-left-2 sm:text-[7.5rem]"
        >
          “
        </span>
        <blockquote className="font-display relative text-balance text-[clamp(1.7rem,3vw,2.75rem)] leading-[1.15] text-foreground">
          {first.quote}
        </blockquote>
        <figcaption className="eyebrow mt-8">
          {first.author} · {first.year}
        </figcaption>
      </figure>
      {second ? (
        <figure
          className="border-t border-ink/15 pt-8 lg:col-span-4 lg:self-end lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
          data-reveal="up"
          style={{ "--reveal-delay": "200ms" } as CSSProperties}
        >
          <blockquote className="text-lg leading-8 text-foreground/85">“{second.quote}”</blockquote>
          <figcaption className="eyebrow eyebrow-plain mt-5">
            {second.author} · {second.year}
          </figcaption>
        </figure>
      ) : null}
    </div>
  )
}

export function StayGuestExperience({ testimonials }: StayGuestExperienceProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-14 px-[var(--gutter)] sm:gap-20 lg:gap-12">
      <SectionHeading
        align="split"
        eyebrow="The guest experience"
        title="How the stay feels *once you arrive.*"
        lede="From the dock welcome to the quiet hours on the waterfront, the estate runs at your group’s pace."
      />

      <StayChapters chapters={experienceRows} />

      <div className="flex flex-col gap-12 pt-6 sm:pt-10 lg:pt-16">
        <p className="eyebrow" data-reveal="fade">
          What guests say about the stay
        </p>
        <PerspectiveStack perspectives={testimonials.slice(0, 2)} />
      </div>
    </div>
  )
}
