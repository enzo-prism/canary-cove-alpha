import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeroImageRotator } from "@/components/hero-image-rotator"
import { Container } from "@/components/layout/container"

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <HeroImageRotator className="min-h-[82vh] sm:min-h-[88vh] lg:min-h-[94vh]">
        <Container className="pointer-events-none relative z-10 flex h-full flex-col gap-10 py-10 sm:py-12 lg:py-14">
          <div className="flex items-start justify-between gap-6">
            <div className="rounded-[18px] border border-white/20 bg-black/45 p-3 backdrop-blur sm:p-4">
              <Image
                src="/canary-cove-logo.png"
                alt="Canary Cove logo"
                width={394}
                height={351}
                priority
                className="h-12 w-auto sm:h-14 lg:h-16"
              />
            </div>
            <Badge className="border border-white/40 bg-white/10 text-white">Private estate</Badge>
          </div>
          <div
            data-testid="hero-copy"
            className="pointer-events-auto mt-auto max-w-xl rounded-[24px] border border-white/15 bg-black/70 p-7 backdrop-blur-sm sm:p-8 flow flow-md"
          >
            <p data-testid="hero-eyebrow" className="text-[11px] uppercase tracking-[0.4em] text-white/70">
              Ambergris Caye, Belize
            </p>
            <h1 data-testid="hero-headline" className="text-display text-white">
              Private estate. Endless water.
            </h1>
            <p data-testid="hero-subhead" className="text-base leading-relaxed text-white/90 sm:text-lg">
              One group at a time with chef service, private boats, and oceanfront amenities.
            </p>
            <Button
              asChild
              size="lg"
              data-testid="hero-cta"
              className="w-fit bg-white text-foreground hover:bg-white/90"
            >
              <Link href="/book">Book your stay</Link>
            </Button>
          </div>
        </Container>
      </HeroImageRotator>
    </section>
  )
}
