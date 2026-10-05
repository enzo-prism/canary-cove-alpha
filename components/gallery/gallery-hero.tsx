import Image from "next/image"
import type { CSSProperties } from "react"

import { CountIn } from "@/components/gallery/count-in"
import { Container } from "@/components/layout/container"
import { SplitText } from "@/components/motion/split-text"
import { IMAGES, imageObjectPosition, type ImageRecord } from "@/lib/images"

/*
 * Three straight studio frames in a staggered column composition: a tall
 * lead frame and two landscape frames offset beside it. Each wipes up on load
 * (CSS `enter-clip` keyframes, so they land before hydration) with its photo
 * settling from a slow zoom; a caption strip names the chapters they open.
 */
type Frame = {
  image: ImageRecord
  label: string
  className: string
  ratio: string
  sizes: string
  delay: number
}

// Studio frames that are not among the grid's lead photos, so the hero never
// repeats the first row of the library directly beneath it.
const LIVING_LOUNGE: ImageRecord = {
  src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059562/canarycove-haydeelustudio-35-scaled_qbgcui.webp",
  alt: "Living room with sofa, woven armchair, and media wall opening to the terrace",
}
const KITCHEN_ISLAND: ImageRecord = {
  src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059578/canarycove-haydeelustudio-39-scaled_neuxea.webp",
  alt: "Villa kitchen with a wide cooking island, hardwood cabinetry, and garden windows",
}

const FRAMES: Frame[] = [
  {
    image: { ...IMAGES.heroBackgroundLawn, focal: { x: 42, y: 50 } },
    label: "Grounds",
    className: "col-start-1 row-span-2 row-start-1 self-center",
    ratio: "aspect-[4/5]",
    sizes: "(min-width: 1320px) 300px, (min-width: 1024px) 23vw, 52vw",
    delay: 320,
  },
  {
    image: LIVING_LOUNGE,
    label: "Living",
    className: "col-start-2 row-start-1 self-end",
    ratio: "aspect-[4/3]",
    sizes: "(min-width: 1320px) 260px, (min-width: 1024px) 20vw, 44vw",
    delay: 460,
  },
  {
    image: KITCHEN_ISLAND,
    label: "Kitchen",
    className: "col-start-2 row-start-2 self-start",
    ratio: "aspect-[4/3]",
    sizes: "(min-width: 1320px) 260px, (min-width: 1024px) 20vw, 44vw",
    delay: 600,
  },
]

type GalleryHeroProps = {
  total: number
  chapters: number
}

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties

export function GalleryHero({ total, chapters }: GalleryHeroProps) {
  return (
    <section className="relative overflow-x-clip pb-12 pt-10 sm:pb-16 sm:pt-14 lg:pb-20 lg:pt-16">
      <Container size="wide">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div className="flow flow-lg">
            <p className="eyebrow enter-fade" style={delay(80)}>
              Gallery · Ambergris Caye
            </p>
            <SplitText
              as="h1"
              mode="enter"
              delay={140}
              text="Every photo of *Canary Cove*"
              className="text-display max-w-[13ch] text-balance"
            />
            <p className="text-lede enter-up max-w-xl" style={delay(420)}>
              The estate, the suites, the food and the water: every picture used across this site plus the full
              archive, shown whole and uncropped. Search for what you want to see, or tap any frame to open it full
              screen and swipe through.
            </p>

            <dl className="enter-up grid max-w-xl grid-cols-2 gap-6 border-t border-border/80 pt-6" style={delay(540)}>
              <div className="flow flow-xs">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Photographs
                </dt>
                <dd className="font-display text-[3.25rem] leading-[0.9] text-foreground sm:text-[4.25rem]">
                  <CountIn value={total} delay={600} />
                </dd>
              </div>
              <div className="flow flow-xs">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Chapters
                </dt>
                <dd className="font-display text-[3.25rem] leading-[0.9] text-foreground sm:text-[4.25rem]">
                  <CountIn value={chapters} delay={760} duration={1600} />
                </dd>
              </div>
            </dl>
          </div>

          <div
            role="group"
            aria-label="A few frames from the library"
            className="mx-auto grid w-full max-w-[34rem] grid-cols-[1.15fr_1fr] grid-rows-[auto_auto] gap-3 sm:gap-4 lg:max-w-none"
          >
            {FRAMES.map((frame) => (
              <figure key={frame.image.src} className={`flow flow-xs ${frame.className}`}>
                <div
                  className={`media-frame enter-clip relative ${frame.ratio} w-full`}
                  style={delay(frame.delay)}
                >
                  <Image
                    src={frame.image.src}
                    alt={frame.image.alt}
                    fill
                    sizes={frame.sizes}
                    className="object-cover"
                    style={{ objectPosition: imageObjectPosition(frame.image) }}
                  />
                </div>
                <figcaption
                  className="enter-fade flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
                  style={delay(frame.delay + 500)}
                >
                  <span aria-hidden="true" className="h-px w-5 bg-ink/25" />
                  {frame.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
