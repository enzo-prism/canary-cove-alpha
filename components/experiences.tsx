import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"

const journeys = [
  {
    id: "01",
    title: "Lorem ipsum",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.",
    image: "/scuba-diving-coral-reef-tropical-fish.jpg",
    details: ["Lorem ipsum dolor", "Sed do eiusmod tempor", "Ut enim ad minim veniam"],
    href: "/experiences/power-boating",
  },
  {
    id: "02",
    title: "Dolor sit amet",
    description: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/fine-dining-gourmet-chef-plating-food.jpg",
    details: ["Duis aute irure", "Dolor in reprehenderit", "Voluptate velit esse"],
    href: "/dining",
  },
  {
    id: "03",
    title: "Consectetur elit",
    description: "Suspendisse potenti donec lacinia turpis vitae eros fermentum, vitae porta erat tincidunt.",
    image: "/tropical-island-beach-boat-trip.jpg",
    details: ["Integer mollis leo", "Nulla facilisi", "Vestibulum ante ipsum"],
    href: "/experiences",
  },
]

export function Experiences() {
  return (
    <section className="px-4 pb-32">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Lorem ipsum</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Dolor sit amet consectetur adipiscing elit.</h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Maecenas malesuada, orci vitae efficitur sagittis, mi lacus scelerisque nisl, vel pharetra ipsum mi vel
              lorem. Morbi dapibus libero nec lacus pharetra, quis iaculis lorem porttitor.
            </p>
          </div>
          <Button asChild variant="ghost" className="self-start border border-border/70 bg-white/70 text-foreground focus-ring">
            <Link href="/experiences">
              View master calendar <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {journeys.map((journey) => (
            <article key={journey.id} className="flex h-full flex-col rounded-[32px] border border-border/70 bg-white/80 p-6 backdrop-blur">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-muted-foreground">
                <span>{journey.id}</span>
                <span>Concierge ready</span>
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-foreground">{journey.title}</h3>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{journey.description}</p>
              <div className="mt-6 overflow-hidden rounded-2xl">
                <img src={journey.image} alt={journey.title} className="h-52 w-full object-cover transition duration-500 hover:scale-105" />
              </div>
              <ul className="mt-6 space-y-3 text-sm text-foreground">
                {journey.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={journey.href}
                className="mt-6 inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Lorem ipsum dolor <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>

        <div className="rounded-[32px] border border-border/80 bg-surface-elevated/70 p-8 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Lorem ipsum</p>
              <h3 className="mt-3 text-2xl font-semibold text-foreground">
                Dolor sit amet consectetur adipiscing elit sed do.
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Aliquam tempus nisl ac tellus dignissim, eu vestibulum leo pellentesque. Proin dictum nibh id quam
                facilisis, et tempus elit tempus.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-white/40 bg-white/80 px-4 py-2 text-sm text-muted-foreground">
                Lorem ipsum
              </div>
              <div className="rounded-full border border-white/40 bg-white/80 px-4 py-2 text-sm text-muted-foreground">
                Dolor sit amet
              </div>
              <div className="rounded-full border border-white/40 bg-white/80 px-4 py-2 text-sm text-muted-foreground">
                Consectetur
              </div>
              <Button asChild className="focus-ring">
                <Link href="/contact">
                  Start your itinerary <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
