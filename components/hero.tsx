import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SiteSearch } from "@/components/site-search"

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-4 pb-24 pt-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-surface to-surface-muted" />
      <div className="absolute right-[5%] top-[15%] -z-10 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="order-2 space-y-8 lg:order-1">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/70 px-5 py-2 text-xs uppercase tracking-[0.3em] text-muted-foreground backdrop-blur">
            Welcome to Canary Cove!
            <span className="h-1 w-1 rounded-full bg-primary" />
            Ambergris Caye, Belize
          </div>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.6rem]">
              Your All-Inclusive Dream Vacation on Belize’s Ambergris Caye
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Canary Cove is a private, staffed beachfront estate reserved entirely for your group. Enjoy chef-prepared meals,
              private docks and boats, an infinity pool, and a full lineup of water-sport gear—so every day runs on your schedule.
              Our 5-acre compound is built for celebrations and slow island living, with a villa that hosts up to 10 guests.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Our all-inclusive model includes the estate, private-chef service, staff, and on-site amenities. Groceries and
              beverages, boat fuel, diving/fishing/excursions, hot-tub heating, gratuities, and the 9% Belize hotel tax are
              additional.
            </p>
          </div>

          <SiteSearch className="max-w-2xl" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="focus-ring">
              <Link href="/book">
                Book 🗓️ <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="border border-border/70 bg-white/60 text-foreground shadow-sm focus-ring"
            >
              <Link href="/stay">
                Preview Villa 🏡
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="rounded-[32px] border border-white/40 bg-white/80 p-4 shadow-[0_35px_120px_rgba(15,23,42,0.15)] backdrop-blur-xl">
            <div className="overflow-hidden rounded-[28px] border border-white/60">
              <video
                className="h-[420px] w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059677/outside_sq8dvn.webp"
              >
                <source
                  src="https://res.cloudinary.com/dhqpqfw6w/video/upload/v1762995355/pv_mwqjho.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
