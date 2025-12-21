import { EMOJI } from "@/lib/emoji"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const sections = [
  {
    title: `At Canary Cove ${EMOJI.land}`,
    description:
      "Land and water fun start right outside your villa doors. Ride into town by golf cart or walk the beachfront when you want a change of scenery.",
    bullets: [
      "Bicycles for local beach riding.",
      "Oceanfront sand volleyball court.",
      "Horseshoes, corn hole, Spikeball, and more.",
      "Basketball court and strength workout area.",
      "Onsite staff to assist with gear and plans.",
      "Frigatebird feeding after reef fishing.",
    ],
  },
  {
    title: `In San Pedro Town ${EMOJI.boats}`,
    description:
      "A 15-minute water taxi ride from the private dock makes it easy to explore local shops, cafes, and the beach park.",
    bullets: [
      "Shopping, dining, and local handicrafts.",
      "Beach park, ice cream shops, and beachside cafes and bars.",
      "Water taxis run every two hours from the dock.",
      "Town is walkable, or use the Canary Cove golf cart.",
    ],
  },
  {
    title: `Mainland Belize ${EMOJI.dayTrips}`,
    description:
      "Private tours on the mainland are arranged with trusted partners for day trips or overnight adventures.",
    bullets: [
      "Belize Zoo and Tropical Education Center.",
      "Cave tubing and ziplining in the jungle.",
      "Belize City visits and Mayan ruins tours.",
      "Private helicopter and charter helicopter tours.",
      "Day excursions and overnight mainland trips arranged for you.",
    ],
  },
]

export function WaysToEnjoy() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-foreground">
          So many ways to enjoy Canary Cove, Ambergris Caye, and Belize
        </h2>
        <p className="text-base text-muted-foreground">
          Your most memorable tropical island experiences are just outside your villa doors. Our staff coordinates equipment,
          reservations, and trips to San Pedro and the mainland so you can make the most of your time.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {sections.map((section) => (
          <Card
            key={section.title}
            className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]"
          >
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-xl font-semibold text-foreground">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6 pt-0">
              <p className="text-sm text-muted-foreground">{section.description}</p>
              <ul className="grid gap-2 text-sm text-foreground">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
