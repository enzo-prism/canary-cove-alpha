import Image from "next/image"

import { IMAGES, imageObjectPosition } from "@/lib/images"
import type { Testimonial } from "@/lib/testimonial-spotlights"

const experienceRows = [
  {
    title: "Arrival and hosting",
    detail: "From the San Pedro pickup to the welcome at the dock, the stay starts smoothly and stays personal.",
    image: IMAGES.gilBoat,
  },
  {
    title: "Chef-led dining",
    detail:
      "Private lunches and dinners are served at the estate so your group never has to work around a restaurant schedule.",
    image: IMAGES.chefMarvinPortrait,
  },
  {
    title: "Quiet private suites",
    detail: "Three king rooms give everyone space to reset between reef days, pool afternoons, and long dinners.",
    image: IMAGES.villaMasterBedroom,
  },
  {
    title: "Waterfront downtime",
    detail: "Hammocks, loungers, and the dock keep the estate feeling calm even on the fullest itinerary.",
    image: IMAGES.romanticViews,
  },
]

type StayGuestExperienceProps = {
  testimonials: Testimonial[]
}

function PerspectiveStack({ perspectives }: { perspectives: Testimonial[] }) {
  const [first, second] = perspectives

  return (
    <div className="flow flow-lg">
      <figure className="border-l-2 border-primary/30 pl-6 sm:pl-8">
        <blockquote className="max-w-3xl text-balance text-xl font-medium leading-9 tracking-tight text-foreground sm:text-2xl sm:leading-10">
          “{first.quote}”
        </blockquote>
        <figcaption className="mt-4 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          {first.author} · {first.year}
        </figcaption>
      </figure>
      {second ? (
        <figure className="border-l-2 border-primary/30 pl-6 sm:pl-8 md:ml-16">
          <blockquote className="max-w-2xl text-lg leading-8 text-foreground/85">“{second.quote}”</blockquote>
          <figcaption className="mt-4 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            {second.author} · {second.year}
          </figcaption>
        </figure>
      ) : null}
    </div>
  )
}

export function StayGuestExperience({ testimonials }: StayGuestExperienceProps) {
  return (
    <div className="flow flow-xl">
      <div className="max-w-2xl flow flow-sm">
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">The guest experience</p>
        <h2 className="text-section text-[2rem] text-foreground sm:text-[2.5rem]">How the stay feels once you arrive.</h2>
      </div>

      <ol className="border-t border-border/60">
        {experienceRows.map((row, index) => (
          <li
            key={row.title}
            className="flex items-center gap-5 border-b border-border/60 py-5 sm:gap-7 sm:py-6"
          >
            <span aria-hidden="true" className="w-8 shrink-0 text-sm font-semibold tabular-nums text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="relative hidden aspect-square w-24 shrink-0 overflow-hidden rounded-[20px] border border-border/55 bg-surface-muted sm:block">
              <Image
                src={row.image.src}
                alt=""
                fill
                className="object-cover"
                style={{ objectPosition: imageObjectPosition(row.image) }}
                sizes="96px"
              />
            </span>
            <span className="flow-xs">
              <h3 className="text-lg font-semibold text-foreground">{row.title}</h3>
              <p className="max-w-2xl text-[0.95rem] leading-7 text-foreground/75">{row.detail}</p>
            </span>
          </li>
        ))}
      </ol>

      <div className="flow flow-md pt-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
          What guests say about the stay
        </p>
        <PerspectiveStack perspectives={testimonials.slice(0, 2)} />
      </div>
    </div>
  )
}
