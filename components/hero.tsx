import Link from "next/link"
import { ArrowUpRight, Play } from "lucide-react"

import { Button } from "@/components/ui/button"

const stats = [
  { label: "Lorem ipsum", value: "Vestibulum" },
  { label: "Dolor sit amet", value: "Consectetur" },
  { label: "Adipiscing elit", value: "Ultricies" },
]

const highlights = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
]

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-4 pb-24 pt-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-surface to-surface-muted" />
      <div className="absolute right-[5%] top-[15%] -z-10 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/70 px-5 py-2 text-xs uppercase tracking-[0.3em] text-muted-foreground backdrop-blur">
            Lorem ipsum
            <span className="h-1 w-1 rounded-full bg-primary" />
            Dolor sit amet
          </div>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.6rem]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Curabitur feugiat turpis nec mauris gravida, eget sodales est aliquet. Aenean commodo magna sed nisl
              imperdiet, sed fermentum ligula sodales.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="focus-ring">
              <Link href="/contact">
                Reserve a Villa <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="border border-border/70 bg-white/60 text-foreground shadow-sm focus-ring"
            >
              <Link href="/gallery">
                <Play className="mr-2 h-4 w-4" />
                Preview Estate Film
              </Link>
            </Button>
          </div>

          <ul className="space-y-4 text-base text-muted-foreground">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-3 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="grid gap-6 border-t border-border/70 pt-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-semibold text-foreground sm:text-2xl">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
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
                poster="/luxury-tropical-beachfront-villa-sunset-ocean-view.jpg"
              >
                <source
                  src="https://res.cloudinary.com/dhqpqfw6w/video/upload/v1762995355/pv_mwqjho.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-border/70 bg-surface-elevated/80 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Lorem ipsum</p>
              <div className="grid gap-4 text-sm text-foreground">
                <div className="flex items-center justify-between">
                  <span>Lorem ipsum dolor sit amet</span>
                  <span className="text-muted-foreground">Consectetur</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sed do eiusmod tempor</span>
                  <span className="text-muted-foreground">Tempor</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ut enim ad minim veniam</span>
                  <span className="text-muted-foreground">Venenatis</span>
                </div>
              </div>
              <Link
                href="/stay"
                className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Lorem ipsum dolor →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
