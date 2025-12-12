import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

const villaSeasons = [
  {
    name: "Low Season",
    months: "February, March, June, July, August, September, October",
    rates: [
      {
        label: "1–2 Suites",
        description: "Enjoy our luxurious suites at an exceptional low-season value",
        price: "$1,000",
      },
      {
        label: "3 Suites",
        description: "Spacious comfort with three private suites",
        price: "$1,250",
      },
    ],
  },
  {
    name: "High Season",
    months: "May, November",
    rates: [
      {
        label: "1–2 Suites",
        description: "Premium accommodations during the vibrant high season",
        price: "$1,200",
      },
      {
        label: "3 Suites",
        description: "Ideal for families or groups seeking extra space",
        price: "$1,500",
      },
    ],
  },
  {
    name: "Peak Season",
    months: "December, January, April",
    rates: [
      {
        label: "1–2 Suites",
        description: "The ultimate luxury experience during peak season",
        price: "$1,500",
      },
      {
        label: "3 Suites",
        description: "Our most exclusive villa offering",
        price: "$1,800",
      },
    ],
  },
]

const mainHouseSeasons = [
  {
    name: "Low Season",
    months: "February, March, June, July, August, September, October",
    price: "$2,500",
  },
  {
    name: "High Season",
    months: "May, November",
    price: "$3,000",
  },
  {
    name: "Peak Season",
    months: "December, January, April",
    price: "$3,600",
  },
]

export const metadata: Metadata = {
  title: "Canary Cove Rates | Canary Cove",
  description:
    "Published rates for the Canary Cove villa and main house, plus boat, fishing, and activity pricing.",
}

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl xl:max-w-7xl space-y-12">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Canary Cove Rates</h1>
          </div>

          <div className="rounded-3xl border border-border/70 bg-white/90 p-6 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
            <h2 className="text-2xl font-semibold text-foreground">A Note From Us</h2>
            <div className="mt-3 space-y-4 text-base text-muted-foreground">
              <p>Our rates are published below for full transparency.</p>
              <p>
                For our repeat guests, you’ll notice that our rates have remained unchanged for over a decade. During that time,
                we’ve continued to invest heavily in the property—adding ensuite bathrooms to all rooms, a hot tub, and other
                thoughtful upgrades to elevate the experience.
              </p>
              <p>
                For new guests comparing costs, it’s important to understand what’s included. Your stay comes with a{" "}
                <strong>private chef who prepares meals exactly to your preferences</strong>, with{" "}
                <strong>no markup on food purchases</strong>. For a group of four, dining out for multiple meals per day quickly
                becomes far more expensive. We also <strong>do not add a mandatory service charge</strong>. While many guests
                choose to tip generously, gratuities are always optional and entirely at your discretion.
              </p>
              <p>
                The <strong>Main House</strong> is reserved for <strong>repeat guests only</strong> and is ideal for larger groups
                such as family reunions.
              </p>
              <p>We look forward to creating a truly special vacation for you and your guests.</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-5">
              <h2 className="text-3xl font-semibold text-foreground">Villa Accommodations</h2>
              {villaSeasons.map((season) => (
                <div
                  key={season.name}
                  className="rounded-3xl border border-border/70 bg-white/90 p-6 shadow-[0_16px_55px_rgba(15,23,42,0.08)]"
                >
                  <h3 className="text-2xl font-semibold text-foreground">{season.name}</h3>
                  <p className="mt-1 text-sm uppercase tracking-[0.2em] text-muted-foreground">{season.months}</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {season.rates.map((rate) => (
                      <div key={rate.label} className="rounded-2xl bg-surface/70 p-5">
                        <p className="text-base font-semibold text-foreground">{rate.label}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{rate.description}</p>
                        <p className="mt-3 text-3xl font-semibold text-foreground">{rate.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-5">
              <h2 className="text-3xl font-semibold text-foreground">Main House Accommodations</h2>
              <p className="text-sm text-muted-foreground italic">Available to repeat guests only</p>
              {mainHouseSeasons.map((season) => (
                <div
                  key={season.name}
                  className="rounded-3xl border border-border/70 bg-white/90 p-6 shadow-[0_16px_55px_rgba(15,23,42,0.08)]"
                >
                  <h3 className="text-2xl font-semibold text-foreground">{season.name}</h3>
                  <p className="mt-1 text-sm uppercase tracking-[0.2em] text-muted-foreground">{season.months}</p>
                  <p className="mt-3 text-3xl font-semibold text-foreground">{season.price}</p>
                </div>
              ))}
            </div>

            <div className="space-y-5">
              <h2 className="text-3xl font-semibold text-foreground">Boat Services</h2>
              <div className="rounded-3xl border border-border/70 bg-white/90 p-6 shadow-[0_16px_55px_rgba(15,23,42,0.08)] space-y-5">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Complimentary Transfers</h3>
                  <p className="mt-2 text-base text-muted-foreground">
                    Free arrival and departure boat transfers to ensure a seamless experience
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Vern Boat Rental</h3>
                  <p className="mt-2 text-base text-muted-foreground">
                    Round-trip travel to town on our 30-foot boat, <em>Vern</em>
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">$75</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Long Trip Adventures</h3>
                  <p className="mt-2 text-base text-muted-foreground">Extended excursions</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">$100 per hour + fuel</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <h2 className="text-3xl font-semibold text-foreground">Fishing Packages</h2>
              <div className="rounded-3xl border border-border/70 bg-white/90 p-6 shadow-[0_16px_55px_rgba(15,23,42,0.08)] space-y-5">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Half-Day Fishing Adventure</h3>
                  <p className="mt-2 text-base text-muted-foreground">
                    A guided half-day experience in Belize’s rich fishing waters
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">$275</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Full-Day Fishing Excursion</h3>
                  <p className="mt-2 text-base text-muted-foreground">
                    A full day exploring premier fishing locations with our expert crew
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">$400</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Deep-Sea Fishing Offshore</h3>
                  <p className="mt-2 text-base text-muted-foreground">
                    An offshore deep-sea adventure for serious anglers
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">$600 per day</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    <strong>Note:</strong> Replacement tackle costs may apply.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <h2 className="text-3xl font-semibold text-foreground">Water Sports Adventures</h2>
              <div className="rounded-3xl border border-border/70 bg-white/90 p-6 shadow-[0_16px_55px_rgba(15,23,42,0.08)] space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Snorkeling</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-base text-muted-foreground">
                    <li>Complimentary local snorkeling with gear included</li>
                    <li>Park fees apply where required</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Diving</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-base text-muted-foreground">
                    <li>
                      <strong>One-tank dive:</strong> $100
                    </li>
                    <li>
                      <strong>Two-tank dive:</strong> $125
                    </li>
                    <li>
                      <strong>Nitrox:</strong> +$15 per tank
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Paddle Boards & Kayaks</h3>
                  <p className="mt-2 text-base text-muted-foreground">
                    Complimentary use of paddle boards and kayaks
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Sailing</h3>
                  <p className="mt-2 text-base text-muted-foreground">
                    Complimentary Hobie Cat sailing experiences
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <h2 className="text-3xl font-semibold text-foreground">Golf Cart Rentals</h2>
              <div className="rounded-3xl border border-border/70 bg-white/90 p-6 shadow-[0_16px_55px_rgba(15,23,42,0.08)] space-y-5">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Half-Day Rental</h3>
                  <p className="mt-2 text-base text-muted-foreground">Explore the island at your own pace</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">$50</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Full-Day Rental</h3>
                  <p className="mt-2 text-base text-muted-foreground">
                    Maximum flexibility for island exploration
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">$80</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Flexible Options</h3>
                  <p className="mt-2 text-base text-muted-foreground">
                    Rental durations can be adjusted to fit your schedule
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-white/90 p-6 text-center shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
              <h2 className="text-2xl font-semibold text-foreground">Ready to Plan Your Stay?</h2>
              <p className="mt-2 text-base text-muted-foreground">
                Contact us to confirm availability, discuss your group’s needs, and begin planning your Canary Cove experience.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
