import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { IMAGES } from "@/lib/images"
import type { Testimonial } from "@/lib/testimonial-spotlights"

const experienceCards = [
  {
    title: "Arrival and hosting",
    detail: "From the San Pedro pickup to the welcome at the dock, the stay starts smoothly and stays personal.",
    image: IMAGES.gilBoat,
  },
  {
    title: "Chef-led dining",
    detail: "Private lunches and dinners are served at the estate so your group never has to work around a restaurant schedule.",
    image: IMAGES.chefNataliePortrait,
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

export function StayGuestExperience({ testimonials }: StayGuestExperienceProps) {
  return (
    <div className="flow flow-xl">
      <div className="flow flow-sm text-center">
        <p className="text-[11px] uppercase tracking-[0.36em] text-muted-foreground">The guest experience</p>
        <h2 className="text-section text-foreground">How the stay feels once you arrive.</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {experienceCards.map((card) => (
          <Card
            key={card.title}
            className="overflow-hidden rounded-[28px] border border-border/60 bg-[#0f2030] text-white shadow-[0_18px_45px_rgba(15,23,42,0.14)]"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src={card.image.src} alt={card.image.alt} fill className="object-cover" sizes="(min-width: 1280px) 280px, 100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06111b] via-[#06111b]/40 to-transparent" />
            </div>
            <CardContent className="flow flow-xs p-5">
              <h3 className="text-base font-semibold">{card.title}</h3>
              <p className="text-sm leading-relaxed text-white/72">{card.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flow flow-sm lg:pr-6">
          <p className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">What guests say about the stay</p>
          <h3 className="text-section text-foreground">What guests say about the stay</h3>
          <p className="text-body">
            Notes on the home, staff, and what it feels like to settle into the estate with your own group and no outside noise.
          </p>
        </div>
        {testimonials.slice(0, 2).map((testimonial) => (
          <Card key={`${testimonial.year}-${testimonial.author}`} className="surface-panel rounded-[28px] border-border/60 bg-surface/95">
            <CardContent className="flow flow-sm p-7">
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{testimonial.year}</p>
              <p className="text-base leading-relaxed text-foreground">"{testimonial.quote}"</p>
              {testimonial.author ? <p className="text-sm text-muted-foreground">- {testimonial.author}</p> : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
