import Image from "next/image"
import type { ReactNode } from "react"

import { Container } from "@/components/layout/container"
import { Parallax } from "@/components/motion/parallax"
import { SplitText } from "@/components/motion/split-text"
import { RISE } from "@/components/explore/reveal-classes"
import { imageObjectPosition, type ImageRecord } from "@/lib/images"
import { cn } from "@/lib/utils"

type ExploreClosingCtaProps = {
  id?: string
  eyebrow: string
  /** Wrap words in *asterisks* for the italic accent. */
  title: string
  lede: ReactNode
  image: ImageRecord
  actions: ReactNode
  /** Small print under the actions (an aside, a quote attribution). */
  note?: ReactNode
  className?: string
}

/**
 * Full-bleed closing band shared by the Explore pages: a deep parallax photo,
 * a serif word-rise headline and the page's last calls to action.
 */
export function ExploreClosingCta({ id, eyebrow, title, lede, image, actions, note, className }: ExploreClosingCtaProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate overflow-hidden bg-ink text-white",
        className,
      )}
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Parallax amount={10} scale={1.2}>
          <Image
            src={image.src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: imageObjectPosition(image) }}
          />
        </Parallax>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,36,40,0.35)_0%,rgba(12,36,40,0.55)_45%,rgba(12,36,40,0.92)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_0%_100%,rgba(12,36,40,0.7),transparent_70%)]" />
      </div>

      <Container size="wide" className="flex min-h-[34rem] flex-col justify-end py-20 sm:min-h-[40rem] sm:py-28 lg:min-h-[46rem] lg:py-32">
        <div data-reveal="group" className="flow flow-lg max-w-3xl">
          <p className="eyebrow text-white/75">{eyebrow}</p>
          <SplitText as="h2" text={title} className="text-display max-w-[14ch] text-balance" />
          <div className={cn("text-lede max-w-xl !text-white/80", RISE)} style={{ transitionDelay: "260ms" }}>
            {lede}
          </div>
          {/* Phones: the pair stacks full width, primary label left / arrow right. */}
          <div
            className={cn(
              "flex flex-col gap-3 pt-2 max-sm:[&>*]:w-full max-sm:[&>*:first-child]:justify-between sm:flex-row sm:flex-wrap sm:items-center",
              RISE,
            )}
            style={{ transitionDelay: "380ms" }}
          >
            {actions}
          </div>
          {note ? (
            <div className={cn("text-sm text-white/60", RISE)} style={{ transitionDelay: "460ms" }}>
              {note}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
