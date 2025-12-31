"use client"

import Fuse, { type FuseResult } from "fuse.js"

import type { SearchItem, SearchGroup } from "@/lib/search/search-index"
import { SEARCH_GROUPS, SEARCH_ITEMS } from "@/lib/search/search-index"

export type SearchIntent =
  | "pricing"
  | "included"
  | "dining"
  | "getting-here"
  | "getting-around"
  | "reliability"
  | "policies"
  | "contact"

export type AnswerLink = {
  label: string
  href: string
}

export type InstantAnswer = {
  intent: SearchIntent | "ask-us"
  title: string
  bullets: string[]
  links: AnswerLink[]
}

export type GroupedResults = {
  group: SearchGroup
  items: SearchItem[]
}

export type SearchOutput = {
  query: string
  normalizedQuery: string
  expandedQuery: string
  intent: SearchIntent | null
  answer: InstantAnswer | null
  groups: GroupedResults[]
  totalResults: number
}

const INTENT_PRIORITY: SearchIntent[] = [
  "pricing",
  "included",
  "dining",
  "getting-here",
  "getting-around",
  "reliability",
  "policies",
  "contact",
]

const INTENT_TRIGGERS: Record<SearchIntent, string[]> = {
  pricing: ["rate", "rates", "price", "pricing", "cost", "availability", "calendar", "hold"],
  included: [
    "included",
    "all inclusive",
    "all-inclusive",
    "extra",
    "extras",
    "fees",
    "tax",
    "gratuity",
    "gratuities",
    "tips",
    "service charge",
    "fuel",
    "hot tub",
    "hot tub heating",
  ],
  dining: ["chef", "food", "meals", "groceries", "alcohol", "beverages", "dietary", "provisioning"],
  "getting-here": ["bze", "belize city", "airport", "flight", "transfer", "customs", "immigration"],
  "getting-around": ["san pedro", "town", "water taxi", "boat to town", "golf cart", "charter"],
  reliability: ["wifi", "wi fi", "internet", "generator", "power", "water", "security", "safe", "safes"],
  policies: ["payment", "deposit", "cancellation", "cancel", "refund", "policy", "policies"],
  contact: ["contact", "call", "message", "reach", "support"],
}

const INTENT_GROUPS: Record<SearchIntent, SearchGroup[]> = {
  pricing: ["Pricing & availability"],
  included: ["What’s included & extra costs"],
  dining: ["Dining & chef service"],
  "getting-here": ["Getting here & getting around"],
  "getting-around": ["Getting here & getting around"],
  reliability: ["Villa, amenities & comfort"],
  policies: ["Policies"],
  contact: ["Contact"],
}

const INSTANT_ANSWERS: Record<SearchIntent, InstantAnswer> = {
  pricing: {
    intent: "pricing",
    title: "Rates & availability",
    bullets: [
      "Check dates in the live calendar, then share your trip details so we can confirm or place a courtesy hold.",
      "Our rates are published below for full transparency.",
    ],
    links: [
      { label: "Availability calendar", href: "/book#availability-calendar" },
      { label: "Rates & seasons", href: "/rates" },
    ],
  },
  included: {
    intent: "included",
    title: "What’s included vs extra costs",
    bullets: [
      "Your stay comes with a private chef who prepares meals exactly to your preferences, with no markup on food purchases.",
      "We do not add a mandatory service charge.",
      "Gratuities are always optional and entirely at your discretion.",
      "Private dock with boat and driver (gas only). Hot tub on site (heating is a daily add-on).",
    ],
    links: [
      { label: "Included vs extra costs", href: "/rates#included-costs" },
      { label: "Outdoor amenities", href: "/stay#outside" },
      { label: "Dining details", href: "/dining#how-dining-works" },
    ],
  },
  dining: {
    intent: "dining",
    title: "Dining & provisioning",
    bullets: [
      "Your private chef prepares and serves lunch and dinner whenever you'd like, and our team handles cleanup.",
      "The kitchen is stocked before arrival for self-serve breakfasts and snacks, with food and beverage purchases billed at cost.",
      "Chef service, cooking, and cleanup included.",
      "Groceries, alcohol, and beverages billed at cost.",
    ],
    links: [
      { label: "How dining works", href: "/dining#how-dining-works" },
      { label: "Dining overview", href: "/dining" },
    ],
  },
  "getting-here": {
    intent: "getting-here",
    title: "Getting here",
    bullets: [
      "After baggage claim, head to Maya Island Air or Tropic Air. Our staff books this for you. It’s a 15-minute flight to Ambergris Caye, landing in San Pedro.",
      "Our staff meets you at the San Pedro airport. The boat dock is a 10-minute walk or a 5-minute taxi ride away.",
      "Board our boat for a 15-minute ride about 6 miles north to the compound.",
    ],
    links: [
      { label: "Arrival steps", href: "/getting-here#arrival-steps" },
      { label: "Travel overview", href: "/getting-here" },
    ],
  },
  "getting-around": {
    intent: "getting-around",
    title: "Getting around",
    bullets: [
      "Canary Cove sits about 6.5 miles north of San Pedro and is accessed primarily by boat.",
      "Arrival and departure boat transfers are complimentary.",
      "For trips into town, we can run our 30-foot boat ($75 round-trip) or arrange private charters ($100/hr + gas).",
      "Golf carts are available—ask about current policies and rates.",
    ],
    links: [
      { label: "Getting around", href: "/getting-here#getting-around" },
      { label: "Boat services", href: "/rates#boat-services" },
    ],
  },
  reliability: {
    intent: "reliability",
    title: "Wi‑Fi, power, water, and security",
    bullets: [
      "Backup generator and fiber internet for reliable power and streaming.",
      "Walled, well-lit compound with onsite staff and discreet security.",
      "Purified water from onsite desalination and filtration.",
      "Double locking doors, smoke detectors, and in-room safes.",
    ],
    links: [
      { label: "Comfort & confidence", href: "/book#comfort-confidence" },
      { label: "All-inclusive service", href: "/stay#services" },
    ],
  },
  policies: {
    intent: "policies",
    title: "Payment terms & cancellation policy",
    bullets: [
      "50% down, balance due 45 business days prior to arrival.",
      "Cancellations must be made in writing.",
      "If a guest cancellation is made more than 60 business days before the scheduled guest arrival date, a full (100%) refund less a 10% administrative fee will be given.",
      "If a guest cancellation is made less than 45 business days before the scheduled guest arrival date, NO refund of any deposit will be given and the full deposit will be forfeited (includes early check-outs or no-shows).",
    ],
    links: [
      { label: "Payment terms", href: "/book#payment-terms" },
      { label: "Cancellation policy", href: "/book#cancellation-policy" },
    ],
  },
  contact: {
    intent: "contact",
    title: "Contact & planning help",
    bullets: [
      "Reach out and we’ll respond within one business day.",
      "Reach our team by phone or contact form for bookings, questions, and travel planning support.",
    ],
    links: [
      { label: "Contact Canary Cove", href: "/contact" },
      { label: "Book your stay", href: "/book" },
    ],
  },
}

const ASK_US_ANSWER: InstantAnswer = {
  intent: "ask-us",
  title: "Ask us anything",
  bullets: [
    "Reach out and we’ll respond within one business day.",
    "Reach our team by phone or contact form for bookings, questions, and travel planning support.",
  ],
  links: [
    { label: "Contact Canary Cove", href: "/contact" },
    { label: "Book your stay", href: "/book" },
  ],
}

const SEARCH_ITEMS_NORMALIZED = SEARCH_ITEMS.map((item) => ({
  ...item,
  normalizedTitle: normalizeQuery(item.title),
  normalizedDescription: item.description ? normalizeQuery(item.description) : "",
  normalizedKeywords: item.keywords.map((keyword) => normalizeQuery(keyword)),
}))

const fuse = new Fuse(SEARCH_ITEMS_NORMALIZED, {
  includeScore: true,
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
  keys: [
    { name: "normalizedTitle", weight: 0.5 },
    { name: "normalizedDescription", weight: 0.3 },
    { name: "normalizedKeywords", weight: 0.2 },
  ],
})

const intentTriggerList = INTENT_PRIORITY.flatMap((intent) =>
  INTENT_TRIGGERS[intent].map((phrase) => ({
    intent,
    phrase,
  })),
)

const intentFuse = new Fuse(intentTriggerList, {
  includeScore: true,
  threshold: 0.25,
  ignoreLocation: true,
  keys: ["phrase"],
})

export function normalizeQuery(query: string) {
  const normalized = query
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  return normalized.replace(/\bwi fi\b/g, "wifi")
}

export function expandSynonyms(query: string) {
  const normalized = normalizeQuery(query)
  if (!normalized) {
    return { expandedQuery: "", matchedIntents: [] as SearchIntent[] }
  }

  const matchedIntents = new Set<SearchIntent>()
  for (const intent of INTENT_PRIORITY) {
    const triggers = INTENT_TRIGGERS[intent]
    if (triggers.some((trigger) => normalized.includes(normalizeQuery(trigger)))) {
      matchedIntents.add(intent)
    }
  }

  const tokens = new Set(normalized.split(" ").filter(Boolean))
  for (const intent of matchedIntents) {
    INTENT_TRIGGERS[intent].forEach((trigger) => {
      normalizeQuery(trigger)
        .split(" ")
        .filter(Boolean)
        .forEach((token) => tokens.add(token))
    })
  }

  return {
    expandedQuery: Array.from(tokens).join(" "),
    matchedIntents: Array.from(matchedIntents),
  }
}

function detectIntent(query: string, matchedIntents: SearchIntent[]) {
  if (!query) return null
  const normalized = normalizeQuery(query)

  for (const intent of INTENT_PRIORITY) {
    const triggers = INTENT_TRIGGERS[intent]
    if (triggers.some((trigger) => normalized.includes(normalizeQuery(trigger)))) {
      return intent
    }
  }

  const fuzzyMatch = intentFuse.search(normalized)[0]
  if (fuzzyMatch && fuzzyMatch.score !== undefined && fuzzyMatch.score <= 0.25) {
    return fuzzyMatch.item.intent
  }

  if (matchedIntents.length > 0) {
    const sorted = INTENT_PRIORITY.find((intent) => matchedIntents.includes(intent))
    return sorted ?? null
  }

  return null
}

function groupResults(items: SearchItem[], intent: SearchIntent | null) {
  const grouped = new Map<SearchGroup, SearchItem[]>()
  items.forEach((item) => {
    if (!grouped.has(item.group)) {
      grouped.set(item.group, [])
    }
    grouped.get(item.group)?.push(item)
  })

  let groupOrder = [...SEARCH_GROUPS]
  if (intent) {
    const preferred = INTENT_GROUPS[intent] ?? []
    groupOrder = [
      ...preferred,
      ...groupOrder.filter((group) => !preferred.includes(group)),
    ]
  }

  return groupOrder
    .filter((group) => grouped.has(group))
    .map((group) => ({
      group,
      items: grouped.get(group) ?? [],
    }))
}

export function runSearch(query: string, options?: { allowFallback?: boolean }): SearchOutput {
  const normalizedQuery = normalizeQuery(query)
  const { expandedQuery, matchedIntents } = expandSynonyms(query)
  const intent = detectIntent(query, matchedIntents)

  if (!normalizedQuery) {
    return {
      query,
      normalizedQuery,
      expandedQuery,
      intent,
      answer: null,
      groups: [],
      totalResults: 0,
    }
  }

  const combined = new Map<string, { item: SearchItem; score: number }>()
  const addResults = (results: FuseResult<SearchItem>[], weight: number) => {
    results.forEach((result) => {
      const score = (result.score ?? 1) * weight
      const existing = combined.get(result.item.id)
      if (!existing || score < existing.score) {
        combined.set(result.item.id, { item: result.item, score })
      }
    })
  }

  const terms: Array<{ term: string; weight: number }> = [
    { term: normalizedQuery, weight: 1 },
  ]
  if (expandedQuery && expandedQuery !== normalizedQuery) {
    terms.push({ term: expandedQuery, weight: 1.05 })
  }

  const tokenSet = new Set<string>()
  normalizedQuery.split(" ").forEach((token) => tokenSet.add(token))
  expandedQuery.split(" ").forEach((token) => tokenSet.add(token))
  tokenSet.forEach((token) => {
    if (!token || token.length < 2) return
    if (token === normalizedQuery || token === expandedQuery) return
    const weight = token.length <= 3 ? 1.2 : 1.1
    terms.push({ term: token, weight })
  })

  terms.forEach(({ term, weight }) => {
    addResults(fuse.search(term), weight)
  })

  const boosted = Array.from(combined.values())
    .map((result) => {
      let score = result.score
      if (intent && result.item.intent === intent) {
        score *= 0.6
      }
      if (intent && INTENT_GROUPS[intent]?.includes(result.item.group)) {
        score *= 0.75
      }
      return {
        item: result.item,
        score,
      }
    })
    .sort((a, b) => a.score - b.score)
    .map((result) => result.item)

  const groups = groupResults(boosted, intent)
  const answer = intent ? INSTANT_ANSWERS[intent] ?? null : null

  if (options?.allowFallback && boosted.length === 0) {
    return {
      query,
      normalizedQuery,
      expandedQuery,
      intent,
      answer: ASK_US_ANSWER,
      groups: [],
      totalResults: 0,
    }
  }

  return {
    query,
    normalizedQuery,
    expandedQuery,
    intent,
    answer,
    groups,
    totalResults: boosted.length,
  }
}

export function getAskUsAnswer() {
  return ASK_US_ANSWER
}
