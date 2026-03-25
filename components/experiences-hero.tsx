import Image from "next/image"

import { Container } from "@/components/layout/container"
import { IMAGES } from "@/lib/images"

export function ExperiencesHero() {
  return (
    <section className="relative -mt-[84px] overflow-hidden border-b border-white/10 pt-[104px] sm:-mt-[88px] sm:pt-[112px] lg:-mt-[92px] lg:pt-[120px]">
      <div className="absolute inset-0">
        <Image
          src={IMAGES.heroBackgroundEstate.src}
          alt={IMAGES.heroBackgroundEstate.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,22,34,0.44)_0%,rgba(9,40,58,0.26)_26%,rgba(7,53,72,0.58)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_42%)]" />
      </div>

      <Container className="relative z-10 flex min-h-[420px] items-center justify-center pb-16 pt-10 sm:min-h-[520px] sm:pb-20 lg:min-h-[620px] lg:pb-24">
        <div className="mx-auto max-w-4xl text-center text-white flow flow-md">
          <p className="text-[11px] uppercase tracking-[0.38em] text-white/72">Canary Cove experiences</p>
          <h1 className="text-5xl font-medium tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">
            Belize experiences at Canary Cove
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-white/84 sm:text-lg sm:leading-8">
            Calm mornings, adrenaline afternoons, and sunset cruises all planned around the tides and your pace.
          </p>
        </div>
      </Container>
    </section>
  )
}
