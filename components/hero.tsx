import Link from "next/link"
import { ArrowUpRight, Play } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-4 pb-24 pt-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-surface to-surface-muted" />
      <div className="absolute right-[5%] top-[15%] -z-10 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
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
              Canary Cove is truly a one-of-a-kind elite beachfront experience that is all inclusive—with world-class
              amenities, a vast array of sports equipment, activities, private chef-prepared meals to order, and a full staff
              to make your Belize vacation as fun as it is relaxing. Enjoy a memorable tropical island vacation at our private,
              5-acre property. Built in 2005, our private compound is an ideal celebration destination for a special getaway
              with family and friends looking for the beauty and fun of the tropics with all of the comforts of a fully-staffed
              private home in a Villa for up to 10 guests.
            </p>
          </div>

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
                <Play className="mr-2 h-4 w-4" />
                Preview Villa 🏡
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative">
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
