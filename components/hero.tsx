import { HeroImageRotator } from "@/components/hero-image-rotator"

export function Hero() {
  return (
    <section
      data-testid="hero-visual"
      aria-label="Canary Cove property photography"
      className="relative isolate overflow-hidden bg-background"
    >
      <HeroImageRotator className="min-h-[82svh] sm:min-h-[86svh] lg:min-h-[96svh]" />
    </section>
  )
}
