import { IMAGES } from "@/lib/images"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"

export const MODEL_LINEUP = [
  {
    name: "Main Villa",
    tagline: "Open-air living with three king suites.",
    summary: "An airy great room, accordion glass doors, and a private patio facing the sea.",
    image: IMAGES.heroVillaSeating,
    finishes: [
      { name: "Limestone", color: "#e7e1d6" },
      { name: "Driftwood", color: "#c9bca6" },
      { name: "Seagrass", color: "#9cab94" },
    ],
    stats: [
      { label: "Sleeps", value: "Up to 10" },
      { label: "Suites", value: "3 king" },
      { label: "Baths", value: "Ensuite" },
    ],
    cta: { label: "Explore the villa", href: "/stay#villa" },
  },
  {
    name: "King Suites",
    tagline: "Quiet rooms with full privacy.",
    summary: "Ensuite baths, blackout curtains, and direct access to the grounds.",
    image: IMAGES.villaBedroom,
    finishes: [
      { name: "Ivory", color: "#ede8de" },
      { name: "Sand", color: "#d6cbb7" },
      { name: "Palm", color: "#b0b8a1" },
    ],
    stats: [
      { label: "Beds", value: "3 king" },
      { label: "Climate", value: "AC + fans" },
      { label: "Wake", value: "Water views" },
    ],
    cta: { label: "See suites", href: "/stay#suites" },
  },
  {
    name: "Pool Deck",
    tagline: "Infinity waterline, all-day sun.",
    summary: "Swim-up bar, shaded seating, and a hot tub ready for evening resets.",
    image: IMAGES.villaPool,
    finishes: [
      { name: "Coral", color: "#e6c5a9" },
      { name: "Shell", color: "#e9e2d6" },
      { name: "Lagoon", color: "#9aaea8" },
    ],
    stats: [
      { label: "Pool", value: "Infinity" },
      { label: "Bar", value: "Swim-up" },
      { label: "Hot tub", value: "On site" },
    ],
    cta: { label: "View outdoor living", href: "/stay#amenities" },
  },
  {
    name: "Private Docks",
    tagline: "Two docks. Total access.",
    summary: "Walk straight onto the water, launch for reef days, and return on your schedule.",
    image: IMAGES.mainDock,
    finishes: [
      { name: "Teak", color: "#b18964" },
      { name: "Harbor", color: "#8f9aa1" },
      { name: "Salt", color: "#e5e1d9" },
    ],
    stats: [
      { label: "Docks", value: "Two" },
      { label: "Boats", value: "Private" },
      { label: "Gear", value: "On site" },
    ],
    cta: { label: "See experiences", href: "/experiences#on-the-water" },
  },
  {
    name: "Chef Service",
    tagline: "Meals that match the view.",
    summary: "Private chef lunches and dinners served daily so the schedule stays yours.",
    image: IMAGES.chefCarry,
    finishes: [
      { name: "Porcelain", color: "#f1ece3" },
      { name: "Coconut", color: "#d9cfc1" },
      { name: "Cedar", color: "#a98b6d" },
    ],
    stats: [
      { label: "Meals", value: "Daily" },
      { label: "Service", value: "Full staff" },
      { label: "Kitchen", value: "On site" },
    ],
    cta: { label: "Explore dining", href: "/dining" },
  },
] as const

export const EDITORIAL_SECTIONS = [
  {
    eyebrow: "Designed to live big",
    title: "Architectural calm, Belize air.",
    description:
      "A private estate that feels engineered for rest. Glass, breeze, and open space bring the outside in.",
    image: IMAGES.villaInteriorWide,
    href: "/stay",
    cta: "Tour the estate",
  },
  {
    eyebrow: "Daily rhythms",
    title: "Sea mornings. Pool afternoons.",
    description:
      "Spend the day on the water, return to a swim-up bar, and settle in for chef-prepared dinners.",
    image: IMAGES.diningRoom,
    href: "/experiences",
    cta: "Plan your days",
  },
] as const

export const PROCESS_STEPS = [
  {
    title: "Design",
    description: "Share your dates, group size, and preferences. We tailor the stay.",
  },
  {
    title: "Confirm",
    description: "Lock the schedule, finalize menus, and arrange excursions.",
  },
  {
    title: "Arrive",
    description: "We meet you in San Pedro and deliver you directly to the dock.",
  },
  {
    title: "Settle in",
    description: "Chef, staff, and boats are ready. The estate is yours.",
  },
] as const

export const BENTO_METRICS = [
  { value: "One group", label: "Private booking only" },
  { value: "Three suites", label: "King beds + ensuite baths" },
  { value: "Two docks", label: "Boats ready for reef days" },
  { value: "Chef daily", label: "Lunch and dinner service" },
] as const

export const BENTO_DETAILS = [
  {
    title: "Outdoor living",
    items: [
      "Infinity pool with swim-up bar and shaded seating.",
      "Hot tub and outdoor shower steps from the water.",
      "Viking gas grill and dining setups indoors and out.",
    ],
  },
  {
    title: "On-site support",
    items: [
      "Private chef lunches and dinners served daily.",
      "Daily housekeeping and laundry support available.",
      "On-site managers and drivers coordinate arrivals.",
    ],
  },
  {
    title: "Water access",
    items: [
      "Private dock with boat and driver for reef trips.",
      "Snorkel gear, paddleboards, kayaks, and Hobie cat.",
      "Swim platform with slide for easy water time.",
    ],
  },
] as const

export const SPEC_GROUPS = [
  {
    title: "Exterior",
    items: [
      "Infinity pool with swim-up bar and lounge deck.",
      "Two private docks and covered boat access.",
      "Hot tub, gardens, and outdoor shower.",
      "Viking gas grill and outdoor dining setups.",
    ],
  },
  {
    title: "Interior",
    items: [
      "Three king suites with ensuite baths.",
      "Great room with accordion glass doors.",
      "Indoor dining for eight and chef-ready kitchen.",
      "High-speed Wi-Fi and climate control in every room.",
    ],
  },
  {
    title: "Services",
    items: [
      "Private chef-prepared lunches and dinners.",
      "Daily housekeeping with laundry support.",
      "Airport pickup and drop-off from San Pedro.",
      "On-site managers and 24/7 staff access.",
    ],
  },
  {
    title: "Marine + adventure",
    items: [
      "Private boat with driver for reef days (gas only).",
      "Snorkel gear, paddleboards, kayaks, Hobie cat.",
      "Swim platform with slide and water toys.",
      "Golf cart and bikes for island exploration.",
    ],
  },
  {
    title: "Infrastructure",
    items: [
      "Backup generators and on-site water filtration.",
      "Secure compound with lighting and access control.",
      "Fiber internet for remote work and streaming.",
      "On-site storage for gear and equipment.",
    ],
  },
] as const

export const HOMEPAGE_TESTIMONIALS = [
  {
    ...TESTIMONIAL_SPOTLIGHTS.home[0],
    image: IMAGES.villaPool,
  },
  {
    ...TESTIMONIAL_SPOTLIGHTS.home[1],
    image: IMAGES.chefNatalie,
  },
  {
    ...TESTIMONIAL_SPOTLIGHTS.home[2],
    image: IMAGES.tubing,
  },
  {
    ...TESTIMONIAL_SPOTLIGHTS.home[3],
    image: IMAGES.livingRoom,
  },
  {
    ...TESTIMONIAL_SPOTLIGHTS.home[4],
    image: IMAGES.diningRoom,
  },
  {
    ...TESTIMONIAL_SPOTLIGHTS.home[5],
    image: IMAGES.romanticViews,
  },
] as const
