import type { Metadata } from "next"

import { EMOJI } from "@/lib/emoji"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { NitroxPopover } from "@/components/nitrox-popover"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
  title: "Canary Cove Rates | Seasons, Villa Pricing, and Add-Ons",
  description:
    "Seasonal villa rates plus pricing for boats, fishing, diving, and additional services at Canary Cove.",
}

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl xl:max-w-7xl space-y-12">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Canary Cove Rates {EMOJI.rates}
            </h1>
          </div>

          <Card className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-2xl font-semibold text-foreground">A Note From Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6 pt-0 text-base text-muted-foreground">
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
                We look forward to creating a truly special vacation for you and your guests.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <div className="space-y-5">
              <h2 className="text-3xl font-semibold text-foreground">Villa Accommodations</h2>
              {villaSeasons.map((season) => (
                <Card
                  key={season.name}
                  className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]"
                >
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="text-2xl font-semibold text-foreground">{season.name}</CardTitle>
                    <Badge variant="outline" className="w-fit border-border/70 text-sm uppercase tracking-[0.2em] text-muted-foreground">
                      {season.months}
                    </Badge>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 pt-0">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {season.rates.map((rate) => (
                        <Card key={rate.label} className="rounded-2xl border-transparent bg-surface/70 shadow-none">
                          <CardContent className="p-5">
                            <p className="text-base font-semibold text-foreground">{rate.label}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{rate.description}</p>
                            <p className="mt-3 text-3xl font-semibold text-foreground">{rate.price}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-5">
              <h2 className="text-3xl font-semibold text-foreground">Main House Accommodations</h2>
              <Alert className="border-primary/20 bg-primary/5">
                <AlertTitle className="text-base font-semibold text-foreground">Repeat guests only</AlertTitle>
                <AlertDescription className="text-sm text-muted-foreground">
                  The Main House is reserved for repeat guests only and is ideal for larger groups such as family reunions.
                </AlertDescription>
              </Alert>
              {mainHouseSeasons.map((season) => (
                <Card
                  key={season.name}
                  className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]"
                >
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="text-2xl font-semibold text-foreground">{season.name}</CardTitle>
                    <Badge variant="outline" className="w-fit border-border/70 text-sm uppercase tracking-[0.2em] text-muted-foreground">
                      {season.months}
                    </Badge>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 pt-0">
                    <p className="text-3xl font-semibold text-foreground">{season.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-5">
              <h2 className="text-3xl font-semibold text-foreground">Boat Services</h2>
              <Card className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Service</TableHead>
                        <TableHead className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Details</TableHead>
                        <TableHead className="text-right text-xs uppercase tracking-[0.2em] text-muted-foreground">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold text-foreground">Complimentary Transfers</TableCell>
                        <TableCell className="text-muted-foreground">
                          Free arrival and departure boat transfers to ensure a seamless experience.
                        </TableCell>
                        <TableCell className="text-right font-semibold text-foreground">Included</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold text-foreground">Vern Boat Rental</TableCell>
                        <TableCell className="text-muted-foreground">
                          Round-trip travel to town on our 30-foot boat, <em>Vern</em>.
                        </TableCell>
                        <TableCell className="text-right font-semibold text-foreground">$75</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold text-foreground">Long Trip Adventures</TableCell>
                        <TableCell className="text-muted-foreground">Extended excursions.</TableCell>
                        <TableCell className="text-right font-semibold text-foreground">$100 per hour + fuel</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-5">
              <h2 className="text-3xl font-semibold text-foreground">Fishing Packages</h2>
              <Card className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
                <CardContent className="space-y-5 p-6">
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
                </CardContent>
              </Card>
            </div>

            <div className="space-y-5">
              <h2 className="text-3xl font-semibold text-foreground">Water Sports Adventures</h2>
              <Card className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
                <CardContent className="space-y-6 p-6">
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
                      <li className="flex flex-wrap items-center gap-1">
                        <NitroxPopover />
                        <span>+$15 per tank</span>
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
                </CardContent>
              </Card>
            </div>

            <div className="space-y-5">
              <h2 className="text-3xl font-semibold text-foreground">Golf Cart Rentals</h2>
              <Card className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
                <CardContent className="space-y-5 p-6">
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
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-3xl border border-border/70 bg-white/90 text-center shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-foreground">Ready to Plan Your Stay?</h2>
                <p className="mt-2 text-base text-muted-foreground">
                  Contact us to confirm availability, discuss your group’s needs, and begin planning your Canary Cove experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
