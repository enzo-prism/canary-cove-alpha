"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Highlight = {
  id: string
  title: string
  tabLabel: string
  description: string
  features: string[]
}

const highlights: Highlight[] = [
  {
    id: "villa",
    title: "The Villa",
    tabLabel: "Villa",
    description:
      "Three king suites with ensuite baths open onto an airy great room, accordion glass doors, and ocean-facing patio. The villa sleeps up to 10 guests, including up to two small children in the bunk room and a queen sleeper sofa.",
    features: [
      "Book the entire villa for your group.",
      "Choose to open 1, 2, or all 3 suites.",
      "Unused suites remain locked and aren't charged.",
      "Gourmet kitchen + indoor dining for eight.",
    ],
  },
  {
    id: "outside",
    title: "Outside, just for you",
    tabLabel: "Outdoors",
    description:
      "A private infinity pool, swim-up bar, Viking grill, gardens, hammocks, and two docks create a true \"your own resort\" feel - no shared spaces, no schedules.",
    features: [
      "Infinity pool and shaded deck.",
      "Swim-up bar with fridge, tap, and TV.",
      "Two private docks for lounging and fishing.",
      "Hot tub on site (heating is a daily add-on).",
    ],
  },
]

function HighlightCard({ highlight }: { highlight: Highlight }) {
  return (
    <Card className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-2xl font-semibold text-foreground">{highlight.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-6 pb-6 pt-0">
        <p className="text-base text-muted-foreground">{highlight.description}</p>
        <ul className="grid gap-2 text-sm text-foreground sm:grid-cols-2">
          {highlight.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export function StayHighlights() {
  return (
    <div className="space-y-6">
      <div className="lg:hidden">
        <Tabs defaultValue={highlights[0]?.id ?? "villa"}>
          <TabsList className="grid w-full grid-cols-2 rounded-full bg-surface/70 p-1 text-sm text-muted-foreground">
            {highlights.map((highlight) => (
              <TabsTrigger
                key={highlight.id}
                value={highlight.id}
                className="rounded-full text-xs font-semibold uppercase tracking-[0.2em] data-[state=active]:text-foreground"
              >
                {highlight.tabLabel}
              </TabsTrigger>
            ))}
          </TabsList>
          {highlights.map((highlight) => (
            <TabsContent key={highlight.id} value={highlight.id} className="mt-4">
              <HighlightCard highlight={highlight} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <div className="hidden gap-6 lg:grid lg:grid-cols-2">
        {highlights.map((highlight) => (
          <HighlightCard key={highlight.id} highlight={highlight} />
        ))}
      </div>
    </div>
  )
}
