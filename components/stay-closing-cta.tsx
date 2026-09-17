import Image from "next/image"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { Button } from "@/components/ui/button"
import { IMAGES, imageObjectPosition } from "@/lib/images"

export function StayClosingCta() {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-surface-muted">
        <Image
          src={IMAGES.villaLawn.src}
          alt={IMAGES.villaLawn.alt}
          fill
          className="object-cover"
          style={{ objectPosition: imageObjectPosition(IMAGES.villaLawn) }}
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
      <div className="flow flow-md">
        <div className="flow flow-sm">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">Plan your dates</p>
          <h2 className="text-section text-[2rem] text-foreground sm:text-[2.5rem]">
            Send your dates. We&apos;ll set the rhythm.
          </h2>
          <p className="text-body max-w-xl">
            Reserve the estate for your group and we&apos;ll handle the rhythm of the stay, from dock arrival to chef
            service and days on the water.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-fit">
            <TrackedLink href="/book" eventName="cta_click" eventPayload={{ location: "stay_closing", target: "/book" }}>
              Inquire now
            </TrackedLink>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full border-border/70 bg-white/80 sm:w-fit">
            <TrackedLink
              href="/rates"
              eventName="cta_click"
              eventPayload={{ location: "stay_closing", target: "/rates" }}
            >
              See rates
            </TrackedLink>
          </Button>
        </div>
      </div>
    </div>
  )
}
