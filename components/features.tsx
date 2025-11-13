import Link from "next/link"
import { Compass, Droplet, Sparkles } from "lucide-react"

const pillars = [
  {
    icon: Sparkles,
    eyebrow: "Lorem ipsum",
    title: "Dolor sit amet",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    detail: "Fusce a dui a lorem pulvinar ultricies et et nulla.",
    href: "/stay",
  },
  {
    icon: Compass,
    eyebrow: "Consectetur",
    title: "Adipiscing elit",
    description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
    detail: "Integer laoreet sem at mauris luctus, in interdum dolor faucibus.",
    href: "/experiences",
  },
  {
    icon: Droplet,
    eyebrow: "Tempor",
    title: "Eiusmod incididunt",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    detail: "Curabitur quis lacus vitae orci efficitur gravida ut a dolor.",
    href: "/dining",
  },
]

const modules = [
  {
    title: "Lorem ipsum",
    subtitle: "Dolor sit amet consectetur",
    image: "/scuba-diving-coral-reef-tropical-fish.jpg",
  },
  {
    title: "Adipiscing elit",
    subtitle: "Sed do eiusmod tempor",
    image: "/fine-dining-gourmet-chef-plating-food.jpg",
  },
  {
    title: "Consectetur risus",
    subtitle: "Ut labore et dolore magna",
    image: "/tropical-island-beach-boat-trip.jpg",
  },
]

export function Features() {
  return (
    <section className="px-4 pb-24">
      <div className="mx-auto max-w-6xl space-y-16">
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Lorem ipsum</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h2>
            <p className="text-lg text-muted-foreground">
              Integer finibus lacus eget accumsan molestie. Pellentesque habitant morbi tristique senectus et netus et
              malesuada fames ac turpis egestas.
            </p>
            <Link
              href="/about"
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Lorem ipsum dolor →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {pillars.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className="group flex h-full flex-col rounded-3xl border border-border/80 bg-surface p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-elevated text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">{pillar.eyebrow}</p>
                  <h3 className="mt-2 text-xl font-semibold text-foreground">{pillar.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{pillar.description}</p>
                  <p className="mt-4 text-sm text-foreground">{pillar.detail}</p>
                  <Link
                    href={pillar.href}
                    className="mt-6 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Lorem ipsum →
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-[40px] border border-border/80 bg-gradient-to-br from-surface via-white to-surface-elevated p-8">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Lorem ipsum</p>
            <h3 className="text-3xl font-semibold">Dolor sit amet consectetur adipiscing elit.</h3>
            <p className="text-lg text-muted-foreground">
              Phasellus vitae lectus nec lectus suscipit consequat. Vestibulum ante ipsum primis in faucibus orci luctus et
              ultrices posuere cubilia curae.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {modules.map((module) => (
              <div key={module.title} className="space-y-4 rounded-3xl border border-white/60 bg-white/70 p-4 backdrop-blur">
                <div className="overflow-hidden rounded-2xl">
                  <img src={module.image} alt={module.title} className="h-56 w-full object-cover transition duration-700 ease-out hover:scale-105" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{module.title}</p>
                  <p className="mt-2 text-base text-foreground">{module.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
