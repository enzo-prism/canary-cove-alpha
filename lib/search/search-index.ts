export const SEARCH_GROUPS = [
  "Pricing & availability",
  "What’s included & extra costs",
  "Dining & chef service",
  "Villa, amenities & comfort",
  "Getting here & getting around",
  "Adventures, boats & add-ons",
  "Policies",
  "Contact",
] as const

export type SearchGroup = (typeof SEARCH_GROUPS)[number]

export type SearchItem = {
  id: string
  title: string
  description?: string
  href: string
  group: SearchGroup
  keywords: string[]
  intent?: string
  type: "page" | "section" | "faq"
}

export type RecommendedChip = {
  label: string
  query: string
}

export type PopularQuestion = {
  question: string
  query: string
}

export const RECOMMENDED_CHIPS: RecommendedChip[] = [
  { label: "Rates & availability", query: "rates availability calendar" },
  { label: "What’s included vs extra costs?", query: "included extra costs fees" },
  { label: "How do we get there?", query: "getting here BZE airport transfer" },
]

export const POPULAR_QUESTIONS: PopularQuestion[] = [
  {
    question: "What’s included in the stay, and what costs extra?",
    query: "included extra costs fees gratuity tax",
  },
  {
    question: "How do rates work (1–2 suites vs 3 suites)?",
    query: "1-2 suites 3 suites rates seasonal",
  },
  {
    question: "How many guests can the villa sleep, and what’s the bed setup?",
    query: "villa sleeps guests bed setup king suites bunk room",
  },
  {
    question: "How does the private chef + groceries provisioning work?",
    query: "private chef groceries provisioning billed at cost",
  },
  {
    question: "Are groceries and alcohol included?",
    query: "groceries alcohol included billed at cost",
  },
  {
    question: "Do you have Wi‑Fi and backup power for work calls?",
    query: "wifi internet backup power generator",
  },
  {
    question: "How secure is the property?",
    query: "security walled compound onsite staff safes",
  },
  {
    question: "How do we get from Belize City (BZE) to Canary Cove?",
    query: "BZE Belize City airport flight transfer San Pedro",
  },
  {
    question: "How do we get into San Pedro from the property?",
    query: "San Pedro boat to town golf cart",
  },
  {
    question: "What are the payment terms and cancellation policy?",
    query: "payment terms cancellation policy refund",
  },
]

export const SEARCH_ITEMS: SearchItem[] = [
  {
    id: "rates-overview",
    title: "Canary Cove rates",
    description: "Our rates are published below for full transparency.",
    href: "/rates",
    group: "Pricing & availability",
    keywords: ["rates", "pricing", "price", "cost", "seasonal", "villa rates", "main house"],
    intent: "pricing",
    type: "page",
  },
  {
    id: "villa-suite-pricing",
    title: "Villa pricing: 1–2 suites vs 3 suites",
    description: "Seasonal pricing for 1–2 suites or 3 suites.",
    href: "/rates#villa-accommodations",
    group: "Pricing & availability",
    keywords: ["1-2 suites", "3 suites", "suite pricing", "villa rates", "low season", "high season", "peak season"],
    intent: "pricing",
    type: "section",
  },
  {
    id: "availability-calendar",
    title: "Availability calendar & holds",
    description:
      "Check dates in the live calendar, then share your trip details so we can confirm or place a courtesy hold.",
    href: "/book#availability-calendar",
    group: "Pricing & availability",
    keywords: ["availability", "calendar", "hold", "request", "book", "dates"],
    intent: "pricing",
    type: "section",
  },
  {
    id: "included-costs",
    title: "What’s included and what costs extra",
    description:
      "Your stay comes with a private chef who prepares meals exactly to your preferences, with no markup on food purchases.",
    href: "/rates#included-costs",
    group: "What’s included & extra costs",
    keywords: [
      "included",
      "extra costs",
      "all inclusive",
      "fees",
      "tax",
      "gratuity",
      "tips",
      "service charge",
      "no markup",
      "food purchases",
    ],
    intent: "included",
    type: "section",
  },
  {
    id: "extra-fuel-hot-tub",
    title: "Boat fuel and hot tub heating",
    description: "Private dock with boat and driver (gas only). Hot tub on site (heating is a daily add-on).",
    href: "/stay#outside",
    group: "What’s included & extra costs",
    keywords: ["fuel", "gas", "boat", "hot tub heating", "add-on", "extra", "dock"],
    intent: "included",
    type: "section",
  },
  {
    id: "dining-overview",
    title: "Dining at Canary Cove",
    description: "Sunrise espresso, beach picnics, and chef dinners under the palms—timed to your adventures.",
    href: "/dining",
    group: "Dining & chef service",
    keywords: ["dining", "chef", "meals", "menus", "food", "provisioning", "restaurants"],
    intent: "dining",
    type: "page",
  },
  {
    id: "how-dining-works",
    title: "How dining works",
    description:
      "Your private chef prepares and serves lunch and dinner whenever you'd like, and our team handles cleanup.",
    href: "/dining#how-dining-works",
    group: "Dining & chef service",
    keywords: [
      "chef",
      "groceries",
      "alcohol",
      "beverages",
      "breakfast",
      "snacks",
      "billed at cost",
      "dietary",
    ],
    intent: "dining",
    type: "section",
  },
  {
    id: "villa-bed-setup",
    title: "Villa layout & bed setup",
    description:
      "Three king suites with ensuite baths open onto an airy great room, accordion glass doors, and ocean-facing patio.",
    href: "/stay#villa",
    group: "Villa, amenities & comfort",
    keywords: ["sleeps", "guests", "bed setup", "king suites", "bunk room", "queen sleeper", "capacity"],
    intent: "amenities",
    type: "section",
  },
  {
    id: "villa-outdoors",
    title: "Pool, docks, and outdoor spaces",
    description:
      "A private, solar-heated infinity pool, swim-up bar, Viking grill, gardens, hammocks, and two docks create a true \"your own resort\" feel - no shared spaces, no schedules.",
    href: "/stay#outside",
    group: "Villa, amenities & comfort",
    keywords: ["pool", "dock", "hot tub", "grill", "gardens", "hammocks", "swim-up bar"],
    intent: "amenities",
    type: "section",
  },
  {
    id: "comfort-confidence",
    title: "Wi‑Fi, backup power, water, and security",
    description: "Backup generator and fiber internet for reliable power and streaming.",
    href: "/book#comfort-confidence",
    group: "Villa, amenities & comfort",
    keywords: ["wifi", "wi fi", "internet", "generator", "power", "water", "security", "safes", "air conditioning"],
    intent: "reliability",
    type: "section",
  },
  {
    id: "all-inclusive-service",
    title: "All-inclusive service",
    description:
      "Private chef meals, full-staff support, and smooth arrivals mean your group can focus on the fun from day one.",
    href: "/stay#services",
    group: "Villa, amenities & comfort",
    keywords: ["staff", "housekeeping", "chef meals", "airport pickup", "arrivals", "service"],
    intent: "amenities",
    type: "section",
  },
  {
    id: "arrival-steps",
    title: "Getting here from Belize City (BZE)",
    description:
      "After baggage claim, head to Maya Island Air or Tropic Air. Our staff books this for you. It’s a 15-minute flight to Ambergris Caye, landing in San Pedro.",
    href: "/getting-here#arrival-steps",
    group: "Getting here & getting around",
    keywords: ["BZE", "Belize City", "airport", "flight", "transfer", "customs", "Maya Island Air", "Tropic Air"],
    intent: "getting-here",
    type: "section",
  },
  {
    id: "getting-around",
    title: "Getting around & trips to town",
    description:
      "Arrival and departure boat transfers are complimentary. For trips into town, we can run our 30-foot boat ($75 round-trip) or arrange private charters ($100/hr + gas).",
    href: "/getting-here#getting-around",
    group: "Getting here & getting around",
    keywords: ["San Pedro", "town", "boat to town", "water taxi", "golf cart", "charter", "Vern"],
    intent: "getting-around",
    type: "section",
  },
  {
    id: "boat-services",
    title: "Boat services",
    description: "Round-trip travel to town on our 30-foot boat, Vern.",
    href: "/rates#boat-services",
    group: "Adventures, boats & add-ons",
    keywords: ["boat", "charter", "transfer", "fuel", "long trip", "Vern"],
    intent: "adventures",
    type: "section",
  },
  {
    id: "fishing-packages",
    title: "Fishing packages",
    description: "Half-day, full-day, and deep-sea fishing offshore.",
    href: "/rates#fishing-packages",
    group: "Adventures, boats & add-ons",
    keywords: ["fishing", "offshore", "half day", "full day", "deep sea"],
    intent: "adventures",
    type: "section",
  },
  {
    id: "water-sports",
    title: "Water sports adventures",
    description: "Snorkeling, diving, paddle boards, kayaks, and sailing.",
    href: "/rates#water-sports-adventures",
    group: "Adventures, boats & add-ons",
    keywords: ["snorkeling", "diving", "nitrox", "paddle boards", "kayaks", "sailing", "hobie cat"],
    intent: "adventures",
    type: "section",
  },
  {
    id: "experiences-overview",
    title: "Included gear & add-on adventures",
    description: "Included gear plus add-on boating, diving, and fishing.",
    href: "/experiences",
    group: "Adventures, boats & add-ons",
    keywords: ["experiences", "adventures", "boating", "diving", "fishing", "gear"],
    intent: "adventures",
    type: "page",
  },
  {
    id: "payment-terms",
    title: "Payment terms",
    description: "50% down, balance due 45 business days prior to arrival.",
    href: "/book#payment-terms",
    group: "Policies",
    keywords: ["payment", "deposit", "balance", "terms", "business days"],
    intent: "policies",
    type: "section",
  },
  {
    id: "cancellation-policy",
    title: "Cancellation policy",
    description: "Cancellations must be made in writing.",
    href: "/book#cancellation-policy",
    group: "Policies",
    keywords: ["cancellation", "cancel", "refund", "policy", "no refund", "business days"],
    intent: "policies",
    type: "section",
  },
  {
    id: "contact-canary-cove",
    title: "Contact Canary Cove",
    description: "Reach out and we’ll respond within one business day.",
    href: "/contact",
    group: "Contact",
    keywords: ["contact", "phone", "message", "questions", "planning", "support"],
    intent: "contact",
    type: "page",
  },
  {
    id: "book-your-stay",
    title: "Book your stay",
    description: "Check dates in the live calendar, then share your trip details so we can confirm or place a courtesy hold.",
    href: "/book",
    group: "Contact",
    keywords: ["book", "request", "availability", "calendar", "hold"],
    intent: "pricing",
    type: "page",
  },
]
