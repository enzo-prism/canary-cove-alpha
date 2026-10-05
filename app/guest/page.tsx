import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { LogOut } from "lucide-react"

import { logoutGuest } from "@/app/guest/actions"
import { enterDelay } from "@/app/guest/_components/guest-shell"
import { BrandGlyph } from "@/components/brand-glyph"
import { requireGuestSession } from "@/lib/guest-auth-dal"
import { IMAGES } from "@/lib/images"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Private guest guide | Canary Cove",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

const BANNER = IMAGES.heroBackgroundPool

export default async function GuestGuidePage() {
  await requireGuestSession()

  return (
    <main className="min-h-[100dvh] bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-6 py-6 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Canary Cove home" className="focus-ring enter-fade inline-flex items-center gap-2.5 rounded-full">
          <BrandGlyph className="h-9 w-9" />
          <span className="font-display text-[1.35rem] uppercase leading-none tracking-[0.04em]">Canary Cove</span>
        </Link>
        <form action={logoutGuest}>
          <button
            type="submit"
            className="focus-ring group inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium text-foreground ring-1 ring-inset ring-border transition-colors duration-500 hover:bg-ink hover:text-sand-light hover:ring-ink"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </form>
      </div>

      <section className="mx-auto w-full max-w-[1200px] px-6 pb-20 pt-8 sm:px-8 sm:pt-14 lg:px-12">
        <div className="flow flow-lg max-w-3xl">
          <p className="eyebrow enter-fade" style={enterDelay(120)}>
            Private guest area
          </p>
          <h1 className="enter-up text-display max-w-[14ch]" style={enterDelay(200)}>
            Canary Cove guest guide
          </h1>
        </div>

        <div className="enter-clip media-frame relative mt-12 aspect-[4/3] w-full sm:aspect-[21/9]" style={enterDelay(320)}>
          <Image
            src={BANNER.src}
            alt={BANNER.alt}
            fill
            priority
            sizes="(min-width: 1200px) 1104px, 100vw"
            className="object-cover"
            style={BANNER.focal ? { objectPosition: `${BANNER.focal.x}% ${BANNER.focal.y}%` } : undefined}
          />
        </div>

        <div
          className="surface-reef enter-up relative -mt-16 ml-auto mr-0 w-full max-w-2xl overflow-hidden rounded-[var(--radius-media)] p-8 shadow-[var(--shadow-lift)] sm:-mt-24 sm:mr-8 sm:p-12"
          style={enterDelay(620)}
        >
          <p className="eyebrow mb-5">In preparation</p>
          <h2 className="font-display text-[2rem] leading-[1.05] text-white sm:text-[2.6rem]">
            Guest information is being prepared
          </h2>
          <p className="mt-5 max-w-xl text-[1.0625rem] leading-8 text-white/75">
            Don&apos;s guest details will appear here after the final sketch is approved. No private phone numbers, emergency contacts, itineraries, or documents have been published yet.
          </p>
        </div>
      </section>
    </main>
  )
}
