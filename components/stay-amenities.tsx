import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const basics = [
  "Complimentary airport pickup and drop-off between San Pedro and Canary Cove.",
  "Private chef-prepared and served lunches and dinners with cleanup handled by staff.",
  "Kitchen stocked before arrival for self-serve breakfasts and snacks (food and beverages billed at cost).",
  "Complete staff onsite daily to handle your stay on property and beyond.",
  "On-site managers available whenever you need them.",
  "Central air conditioning with adjustable room thermostats and ceiling fans.",
  "Non-smoking property.",
  "Dining furniture indoors and out.",
  "Daily housekeeping with laundry service available.",
  "Golf cart available for drives into town.",
]

const outdoorAmenities = [
  "Passive solar-heated infinity pool with swim-up bar.",
  "Pool lounge setup with flat-screen TV, speakers, iPod dock, and Viking gas grill.",
  "Water activities included: snorkeling, kayaking, Hobie catamaran, swim platform with slide, paddleboards, pool, and hot tub.",
  "Private dock with boat and driver for reef snorkeling; you only pay for the gas.",
  "Outdoor freshwater shower.",
  "Land activities equipment: beach bikes, volleyball, horseshoes, corn hole, and private gardens.",
]

const roomAmenities = [
  "Flat-panel television",
  "Blu-ray player",
  "Coffee, tea, and espresso station",
  "Wine chiller",
  "Twice-daily housekeeping service",
  "Evening ice and water delivery",
  "Down duvets and pillows",
  "Bedside reading lights and outlets",
  "Blackout curtains",
  "Alarm radio",
  "Iron and ironing board",
  "Hairdryer",
  "In-room safe",
  "Thick terry bathrobes",
  "Double vanity sinks",
  "Lighted make-up mirror",
  "Premium toiletries",
]

const confidence = [
  "Compound is walled on three sides, well-lit, and secure.",
  "6 1/2 miles from town with limited access by road.",
  "Double locking doors and smoke detectors throughout.",
  "Onsite desalination and water filtration provides purified water across the compound.",
  "High-performance generator keeps power, refrigeration, internet, and air conditioning running.",
  "Compound can operate independently of island services if needed.",
  "Fiber internet direct to Canary Cove for streaming and work.",
  "Staff living onsite with access to emergency services 24/7.",
  "Outdoor surveillance cameras discreetly placed for safety and privacy.",
  "Motorola radio system reaches San Pedro for quick assistance.",
  "Highly maintained equipment throughout the compound.",
  "No incidents in the 15+ years we have lived in Belize.",
]

const extras = [
  "Meal provisions planned and shopped in advance based on your preferences; only the food and beverage cost is extra.",
  "Spa services in-villa, on the terrace, or on the beach under a shady palm tree.",
  "Child care by our staff.",
  "World-class SCUBA diving and fishing excursions with Canary Cove staff through Poseidon Belize.",
  "SCUBA diving certification.",
  "Power-boat activities: SCUBA, Snuba, tubing, wakeboarding, and boat rides (daily use + gas).",
  "Water and land excursions beyond Ambergris Caye arranged for you.",
  "Water taxi into town.",
  "Private helipad access from Belize's international airport can be arranged by request.",
  "Private destination events, parties, and weddings.",
]

export function StayAmenities() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-foreground">All-inclusive basics and amenities</h2>
        <p className="text-base text-muted-foreground">
          An all-inclusive stay with private chef and staff means more fun and relaxation. We meet you in San Pedro and welcome you
          at the dock with tropical drinks, then handle the details so you can settle into vacation mode.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-2xl font-semibold text-foreground">Included with your stay</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6 pt-0">
            <p className="text-sm text-muted-foreground">
              The essentials are covered from arrival to departure so you can focus on relaxing.
            </p>
            <ul className="grid gap-2 text-sm text-foreground">
              {basics.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-2xl font-semibold text-foreground">Outdoor amenities and activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6 pt-0">
            <p className="text-sm text-muted-foreground">
              The property is set up for pool days, reef time, and easy nights outdoors.
            </p>
            <ul className="grid gap-2 text-sm text-foreground">
              {outdoorAmenities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)] lg:col-span-2">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-2xl font-semibold text-foreground">Comfort and confidence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6 pt-0">
            <p className="text-sm text-muted-foreground">
              Modern infrastructure and thoughtful planning keep the estate comfortable, secure, and independent when needed.
            </p>
            <ul className="grid gap-2 text-sm text-foreground sm:grid-cols-2">
              {confidence.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-2xl font-semibold text-foreground">Basic room amenities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6 pt-0">
            <p className="text-sm text-muted-foreground">Comfort features are stocked in every room.</p>
            <ul className="grid gap-2 text-sm text-foreground sm:grid-cols-2">
              {roomAmenities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-2xl font-semibold text-foreground">Extras and adventures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6 pt-0">
            <p className="text-sm text-muted-foreground">
              Add-on services and excursions are arranged in advance and billed separately. Share your tastes and interests on the
              booking form or ask us about personal requirements.
            </p>
            <ul className="grid gap-2 text-sm text-foreground">
              {extras.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
