import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const basics = [
  "Complimentary airport pickup and dock transfer between San Pedro and Canary Cove.",
  "Chef-prepared lunches and dinners served daily, with cleanup handled by staff.",
  "Kitchen stocked before arrival for self-serve breakfasts and snacks.",
  "Complete staff onsite daily to support the stay on property and beyond.",
  "Central air conditioning with adjustable room thermostats and ceiling fans.",
  "Daily housekeeping with laundry service available.",
]

const outdoorAmenities = [
  "Passive solar-heated infinity pool with swim-up bar and hot tub.",
  "Pool lounge setup with flat-screen TV, speakers, and Viking gas grill.",
  "Water toys and reef-day equipment including snorkeling gear, paddleboards, and slide platform.",
  "Private dock with boat and driver for reef snorkeling; you only pay for gas.",
  "Outdoor freshwater shower and shaded places to settle in all day.",
  "Beach bikes, volleyball, horseshoes, corn hole, and private gardens.",
]

const practicalDetails = [
  {
    title: "Comfort and confidence",
    items: [
      "Fiber internet and backup generator for reliable power, cooling, and streaming.",
      "Walled, well-lit compound with staff living onsite and access to emergency services.",
      "Purified water across the estate from onsite desalination and filtration.",
    ],
  },
  {
    title: "In-room amenities",
    items: [
      "Coffee, tea, and espresso setup plus wine chiller.",
      "Blackout curtains, bedside outlets, robes, and in-room safe.",
      "Premium toiletries, double vanities, and hairdryers in every bath.",
    ],
  },
  {
    title: "Extras on request",
    items: [
      "Spa services, childcare, and provisions planned around your group.",
      "SCUBA, fishing, tubing, and private excursions arranged in advance.",
      "Helipad access and destination events coordinated by request.",
    ],
  },
]

export function StayAmenities() {
  return (
    <div id="amenities" className="scroll-mt-24 flow flow-lg">
      <div className="flow flow-sm">
        <div className="flow flow-xs">
          <p className="text-[11px] uppercase tracking-[0.36em] text-muted-foreground">Included with your stay</p>
          <h2 className="text-section text-foreground">All-inclusive basics and amenities</h2>
        </div>
        <p className="max-w-3xl text-body">
          An all-inclusive stay with private chef service and on-site staff means less logistics and more time in the water, by
          the pool, or around the table with your group.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="surface-panel rounded-[32px] border-border/60 bg-surface/95">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-2xl font-semibold text-foreground">Included with your stay</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 px-8 pb-8 pt-0">
            <p className="text-sm text-muted-foreground">
              Arrival, meals, and daily support are already folded into the rhythm of the estate.
            </p>
            <ul className="grid gap-3 text-sm leading-relaxed text-foreground">
              {basics.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 text-[10px] text-primary">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="surface-panel rounded-[32px] border-border/60 bg-surface/95">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-2xl font-semibold text-foreground">Outdoor amenities and activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 px-8 pb-8 pt-0">
            <p className="text-sm text-muted-foreground">
              Pool days, dock departures, and easy evenings outdoors are all built into the property itself.
            </p>
            <ul className="grid gap-3 text-sm leading-relaxed text-foreground">
              {outdoorAmenities.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 text-[10px] text-primary">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="surface-panel grid gap-6 rounded-[32px] border-border/60 bg-surface/92 p-6 sm:p-8 lg:grid-cols-3">
        {practicalDetails.map((detail) => (
          <div key={detail.title} className="flow flow-sm rounded-[24px] border border-border/50 bg-surface-elevated/70 p-5">
            <h3 className="text-base font-semibold text-foreground">{detail.title}</h3>
            <ul className="grid gap-3 text-sm leading-relaxed text-muted-foreground">
              {detail.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
