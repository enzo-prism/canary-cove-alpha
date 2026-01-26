import Image from "next/image"
import { HeroImageRotator } from "@/components/hero-image-rotator"
import { Container } from "@/components/layout/container"

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <HeroImageRotator className="min-h-[82vh] sm:min-h-[88vh] lg:min-h-[94vh]">
        <Container className="pointer-events-none relative z-10 flex h-full items-center justify-center py-10 sm:py-12 lg:py-14">
          <div className="rounded-[20px] border border-white/25 bg-black/35 p-4 backdrop-blur sm:p-5">
            <Image
              src="/canary-cove-logo.png"
              alt="Canary Cove logo"
              width={394}
              height={351}
              priority
              className="h-16 w-auto sm:h-20 lg:h-24"
            />
          </div>
        </Container>
      </HeroImageRotator>
    </section>
  )
}
