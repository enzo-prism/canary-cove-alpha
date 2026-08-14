import { IMAGES } from "@/lib/images"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"

export const ESTATE_SPACES = [
  {
    name: "Main Villa",
    tagline: "Open-air living with three king suites.",
    summary: "An airy great room, accordion glass doors, and a private patio facing the sea.",
    image: IMAGES.heroVillaSeating,
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
    image: IMAGES.chefMarvinPlates,
    stats: [
      { label: "Meals", value: "Daily" },
      { label: "Service", value: "Full staff" },
      { label: "Kitchen", value: "On site" },
    ],
    cta: { label: "Explore dining", href: "/dining" },
  },
] as const

/** @deprecated Use ESTATE_SPACES */
export const MODEL_LINEUP = ESTATE_SPACES

export const EDITORIAL_SECTIONS = [
  {
    eyebrow: "The estate",
    title: "Quiet rooms. Open air. The reef at the dock.",
    description:
      "A private beachfront villa with three king suites, an infinity pool, and indoor-outdoor living reserved for one group at a time.",
    image: IMAGES.villaInteriorWide,
    href: "/stay",
    cta: "Tour the estate",
  },
  {
    eyebrow: "The days",
    title: "Sea mornings. Chef dinners. Your pace.",
    description:
      "Spend the day on the water, return to a swim-up bar, and sit down to lunch and dinner prepared on site.",
    image: IMAGES.diningRoom,
    href: "/experiences",
    cta: "Plan your days",
  },
] as const

export const PROCESS_STEPS = [
  {
    title: "Inquire",
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

export const HOME_PROOF_POINTS = [
  { value: "One group", label: "Private booking only" },
  { value: "Three suites", label: "King beds + ensuite baths" },
  { value: "Two docks", label: "Boats ready for reef days" },
  { value: "Chef daily", label: "Lunch and dinner service" },
] as const

export const BENTO_METRICS = HOME_PROOF_POINTS

export const HOMEPAGE_TESTIMONIALS = [
  {
    ...TESTIMONIAL_SPOTLIGHTS.home[0],
    image: IMAGES.villaPool,
  },
  {
    ...TESTIMONIAL_SPOTLIGHTS.home[1],
    image: IMAGES.chefMarvinKitchen,
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
