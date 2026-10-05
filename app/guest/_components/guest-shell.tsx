import Image from "next/image"
import type { CSSProperties, ReactNode } from "react"

import { BrandLogo, BrandMark } from "@/components/brand-mark"
import { IMAGES } from "@/lib/images"

/*
 * Shared frame for the private guest pages (access, error). Pure markup and
 * CSS entrances: no analytics, no third-party widgets, no client state, so it
 * is safe in both the server pages and the client error boundary.
 */

export const enterDelay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties

const PANEL_IMAGE = IMAGES.heroBackgroundEstate

export function GuestShell({ children, footnote }: { children: ReactNode; footnote?: ReactNode }) {
  return (
    <main className="relative grid min-h-[100dvh] bg-background text-foreground lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* Photo panel (desktop): the estate from the beach path. */}
      <div className="enter-clip relative hidden overflow-hidden bg-ink lg:block" style={enterDelay(80)}>
        <Image
          src={PANEL_IMAGE.src}
          alt={PANEL_IMAGE.alt}
          fill
          priority
          sizes="52vw"
          className="ken-burns object-cover"
          style={PANEL_IMAGE.focal ? { objectPosition: `${PANEL_IMAGE.focal.x}% ${PANEL_IMAGE.focal.y}%` } : undefined}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-ink/30" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-12 text-white">
          <div className="enter-up flow flow-xs" style={enterDelay(700)}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">Ambergris Caye · Belize</p>
            <p className="max-w-[16ch] font-display text-[2.6rem] leading-[1.02]">
              For the guests already on their way.
            </p>
          </div>
          <BrandLogo tone="light" height={72} className="enter-fade h-[72px] w-auto" />
        </div>
      </div>

      <div className="relative flex min-h-[100dvh] flex-col px-6 pb-8 pt-6 sm:px-12 sm:pt-10 lg:px-16 xl:px-24">
        <div className="enter-fade flex items-center justify-between gap-4" style={enterDelay(120)}>
          <BrandMark height={48} className="h-12" />
          <span className="inline-flex items-center gap-2 rounded-full bg-sand-light px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-muted-foreground ring-1 ring-inset ring-border">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lagoon" />
            Private
          </span>
        </div>

        {/* Phone: a slim band of the same photograph. */}
        <div className="enter-clip media-frame relative mt-8 aspect-[16/9] w-full lg:hidden" style={enterDelay(160)}>
          <Image
            src={PANEL_IMAGE.src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            style={PANEL_IMAGE.focal ? { objectPosition: `${PANEL_IMAGE.focal.x}% ${PANEL_IMAGE.focal.y}%` } : undefined}
          />
        </div>

        <div className="flex flex-1 items-center py-10 sm:py-14">
          <div className="w-full max-w-md">{children}</div>
        </div>

        {footnote ? (
          <div className="enter-fade text-[13px] leading-6 text-muted-foreground" style={enterDelay(900)}>
            {footnote}
          </div>
        ) : null}
      </div>
    </main>
  )
}
