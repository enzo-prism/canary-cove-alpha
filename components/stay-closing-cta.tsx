import Image from "next/image"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { IMAGES } from "@/lib/images"

const closingCards = [
  {
    title: "The Villa",
    description: "King suites, indoor-outdoor living, and room for your whole group.",
    image: IMAGES.villaInteriorWide,
  },
  {
    title: "Outside, just for you",
    description: "A private pool deck, hot tub, docks, and waterline views all day.",
    image: IMAGES.heroVillaSeating,
  },
  {
    title: "All-inclusive service",
    description: "Chef-prepared meals and staff support without the resort bustle.",
    image: IMAGES.chefCarry,
  },
]

export function StayClosingCta() {
  return (
    <Card className="relative overflow-hidden rounded-[36px] border border-border/50 bg-[#0d1f2f] text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
      <div className="absolute inset-0">
        <Image src={IMAGES.villaLawn.src} alt={IMAGES.villaLawn.alt} fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,23,36,0.4),rgba(11,23,36,0.88)_55%,rgba(11,23,36,0.96)_100%)]" />
      </div>
      <CardContent className="relative z-10 flow flow-lg px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
        <div className="mx-auto max-w-3xl text-center flow flow-sm">
          <p className="text-[11px] uppercase tracking-[0.36em] text-white/68">Stay at Canary Cove</p>
          <h2 className="text-display text-white">Your private paradise awaits.</h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/74">
            Reserve the estate for your group and we&apos;ll handle the rhythm of the stay, from dock arrival to chef service and
            days on the water.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-white/90">
              <TrackedLink href="/book" eventName="cta_click" eventPayload={{ location: "stay_closing", target: "/book" }}>
                Inquire now
              </TrackedLink>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white hover:text-slate-950">
              <TrackedLink href="/rates" eventName="cta_click" eventPayload={{ location: "stay_closing", target: "/rates" }}>
                See rates
              </TrackedLink>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {closingCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[24px] border border-white/12 bg-white/10 p-3 backdrop-blur-md"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[18px]">
                <Image src={card.image.src} alt={card.image.alt} fill className="object-cover" sizes="(min-width: 1024px) 320px, 100vw" />
              </div>
              <div className="flow flow-xs px-1 pb-1 pt-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/92">{card.title}</h3>
                <p className="text-sm leading-relaxed text-white/68">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
