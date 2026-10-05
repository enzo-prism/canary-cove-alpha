import Image from "next/image"
import type { CSSProperties } from "react"
import { Phone } from "lucide-react"

import { Parallax } from "@/components/motion/parallax"
import { IMAGES, imageObjectPosition } from "@/lib/images"

const INCLUDED = [
  { title: "Private chef", detail: "Cooked at the villa" },
  { title: "Boat transfers", detail: "Arrival & departure" },
  { title: "Groceries at cost", detail: "No pantry markup" },
  { title: "No automatic service fee", detail: "Gratuities optional" },
] as const

/**
 * The sticky "your stay" column beside the booking wizard: an arched estate
 * photo with the from-price, what every stay includes, and a direct line.
 */
export function EstateSummary() {
  const image = IMAGES.heroVillaSeating

  return (
    <div className="flex flex-col gap-8 sm:grid sm:grid-cols-2 sm:items-start sm:gap-x-8 sm:gap-y-6 lg:flex lg:flex-col lg:gap-8">
      <div
        data-reveal="clip"
        className="media-frame arch relative aspect-[4/5] w-full sm:row-span-2 lg:aspect-auto lg:h-[min(34rem,calc(100svh-var(--site-header-height)-23rem))] lg:min-h-[20rem]"
      >
        <Parallax amount={6}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1320px) 480px, (min-width: 1024px) 36vw, 100vw"
            className="object-cover"
            style={{ objectPosition: imageObjectPosition(image) ?? "50% 60%" }}
          />
        </Parallax>
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 space-y-2 p-6 text-white sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">Villa · 1–2 suites</p>
          <p className="font-display text-[3rem] leading-none tracking-[-0.01em]">
            <span className="text-[1.25rem] align-top text-white/70">from </span>
            $1,000
            <span className="text-[1.25rem] text-white/70"> / night</span>
          </p>
          <p className="max-w-xs text-sm leading-5 text-white/75">
            Main House (5 suites) from $2,500 a night for returning guests.
          </p>
        </div>
      </div>

      <div>
        <p data-reveal="fade" className="eyebrow">
          Included with every stay
        </p>
        <ul data-reveal="stagger" className="mt-4 divide-y divide-border/80 border-y border-border/80">
          {INCLUDED.map((item, index) => (
            <li
              key={item.title}
              className="flex items-baseline justify-between gap-4 py-2.5"
              style={{ "--stagger-index": index } as CSSProperties}
            >
              <span className="text-[15px] font-medium text-foreground">{item.title}</span>
              <span className="text-right text-[13px] leading-5 text-muted-foreground">{item.detail}</span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href="tel:+5016105121"
        className="focus-ring group flex min-h-14 items-center gap-4 rounded-2xl border border-border/80 bg-white/40 px-4 py-3 transition-colors duration-500 hover:border-ink/40 hover:bg-white/80"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-canary transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-[-8deg]">
          <Phone className="h-4 w-4" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-medium text-foreground">Prefer to talk? Call Gil · 610-5121</span>
          <span className="block text-[13px] text-muted-foreground">8am–5pm Belize time (UTC−6)</span>
        </span>
      </a>
    </div>
  )
}
