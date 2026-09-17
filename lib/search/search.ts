"use client"

import Fuse, { type FuseResult } from "fuse.js"

import type { SearchItem, SearchGroup } from "@/lib/search/search-index"
import { SEARCH_GROUPS, SEARCH_ITEMS, SYNONYMS } from "@/lib/search/search-index"

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
  pricing: ["rate", "rates", "price", "pricing", "cost", "availability", "calendar", "hold", "how much", "per night", "nightly"],
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
  "getting-here": [
    "bze",
    "belize city",
    "airport",
    "flight",
    "transfer",
    "customs",
    "immigration",
    "get there",
    "getting there",
    "how to get",
    "how to arrive",
    "directions",
  ],
  "getting-around": ["san pedro", "town", "water taxi", "boat to town", "golf cart", "charter"],
  reliability: [
    "wifi",
    "wi fi",
    "internet",
    "generator",
    "power",
    "water",
    "security",
    "safe",
    "safes",
    "work calls",
    "video calls",
    "zoom",
    "remote work",
  ],
  policies: ["payment", "deposit", "cancellation", "cancel", "refund", "policy", "policies", "refundable", "pay"],
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
      "Share your preferred dates and any celebrations. Our team will confirm availability and send a tailored quote.",
      "Our rates are published below for full transparency.",
    ],
    links: [
      { label: "Book", href: "/book" },
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
    .replace(/\bwi fi\b/g, "wifi")
  return applySynonyms(normalized)
}

// Whole-word synonym expansion (multi-word keys first); the canonical token
// is appended so the original wording still participates in matching.
function applySynonyms(normalized: string) {
  if (!normalized) return normalized
  const words = normalized.split(" ")
  const canonical = new Set<string>()
  const entries = Object.entries(SYNONYMS).sort((a, b) => b[0].length - a[0].length)
  for (const [phrase, target] of entries) {
    const phraseWords = phrase.split(" ")
    const found =
      phraseWords.length === 1
        ? words.includes(phrase)
        : words.some((_, i) => phraseWords.every((word, j) => words[i + j] === word))
    if (found && !words.includes(target)) {
      canonical.add(target)
    }
  }
  return canonical.size > 0 ? `${normalized} ${Array.from(canonical).join(" ")}` : normalized
}

// Word-boundary trigger matching: every trigger word must appear as a whole
// query word (consecutive for multi-word triggers). Substring matching caused
// "scallops" to trigger the contact intent via "call".
function triggerMatches(queryWords: string[], trigger: string) {
  const triggerWords = normalizeQuery(trigger).split(" ").filter(Boolean)
  if (triggerWords.length === 0) return false
  if (triggerWords.length === 1) {
    return queryWords.includes(triggerWords[0])
  }
  return queryWords.some((_, i) => triggerWords.every((word, j) => queryWords[i + j] === word))
}

export function expandSynonyms(query: string) {
  const normalized = normalizeQuery(query)
  if (!normalized) {
    return { expandedQuery: "", matchedIntents: [] as SearchIntent[] }
  }

  const queryWords = normalized.split(" ").filter(Boolean)
  const matchedIntents = new Set<SearchIntent>()
  for (const intent of INTENT_PRIORITY) {
    const triggers = INTENT_TRIGGERS[intent]
    if (triggers.some((trigger) => triggerMatches(queryWords, trigger))) {
      matchedIntents.add(intent)
    }
  }

  const tokens = new Set(queryWords)
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

function detectIntent(query: string) {
  if (!query) return null
  const normalized = normalizeQuery(query)
  const queryWords = normalized.split(" ").filter(Boolean)

  for (const intent of INTENT_PRIORITY) {
    const triggers = INTENT_TRIGGERS[intent]
    if (triggers.some((trigger) => triggerMatches(queryWords, trigger))) {
      return intent
    }
  }

  // Fuzzy intent is a typo safety net, not a guesser: short queries need a
  // near-exact match ("pool" must not become policies).
  const fuzzyCap = normalized.length <= 4 ? 0.15 : 0.25
  const fuzzyMatch = intentFuse.search(normalized)[0]
  if (fuzzyMatch && fuzzyMatch.score !== undefined && fuzzyMatch.score <= fuzzyCap) {
    return fuzzyMatch.item.intent
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

// Re-rank bonuses (subtracted from the Fuse score; lower is better). Exact
// title and keyword matches must beat intent-boosted fuzzy matches so a
// perfect hit like "Pool, docks, and outdoor spaces" can never rank second.
const RERANK = {
  exactTitle: 0.3,
  titlePrefix: 0.22,
  titleToken: 0.15,
  titleTokenCap: 0.3,
  keywordHit: 0.08,
  keywordHitCap: 0.24,
  phrase: 0.1,
  fullQuery: 0.25,
  multiToken: 0.05,
  multiTokenCap: 0.15,
  intentItem: 0.6,
  intentGroup: 0.75,
} as const

const MAX_ITEMS_PER_GROUP = 4
const MAX_TOTAL_ITEMS = 12

const TYPE_RANK: Record<SearchItem["type"], number> = {
  page: 0,
  section: 1,
  faq: 2,
}

function rerankScore(item: SearchItem, baseScore: number, queryWords: string[], normalizedQuery: string) {
  const title = normalizeQuery(item.title)
  const titleWords = title.split(" ").filter(Boolean)
  const keywordSet = new Set(item.keywords.map((keyword) => normalizeQuery(keyword)))
  const keywordWords = new Set<string>()
  keywordSet.forEach((keyword) => keyword.split(" ").forEach((word) => keywordWords.add(word)))

  let score = baseScore
  if (title === normalizedQuery) {
    score -= RERANK.exactTitle
  }
  if (normalizedQuery.length >= 3 && titleWords.some((word) => word.startsWith(normalizedQuery))) {
    score -= RERANK.titlePrefix
  }
  const titleTokenHits = queryWords.filter((word) => titleWords.includes(word)).length
  score -= Math.min(titleTokenHits * RERANK.titleToken, RERANK.titleTokenCap)
  const keywordHits = queryWords.filter((word) => keywordWords.has(word)).length
  score -= Math.min(keywordHits * RERANK.keywordHit, RERANK.keywordHitCap)
  if (queryWords.length >= 2 && `${title} ${normalizeQuery(item.description ?? "")}`.includes(normalizedQuery)) {
    score -= RERANK.phrase
  }
  // A complete match of the user's own query beats an expansion-token match.
  if (queryWords.length > 0 && queryWords.every((word) => titleWords.includes(word) || keywordWords.has(word))) {
    score -= RERANK.fullQuery
  }
  const anywhereHits = queryWords.filter(
    (word) => titleWords.includes(word) || keywordWords.has(word),
  ).length
  if (anywhereHits > 1) {
    score -= Math.min((anywhereHits - 1) * RERANK.multiToken, RERANK.multiTokenCap)
  }
  return Math.max(score, 0.001)
}

export function runSearch(query: string, options?: { allowFallback?: boolean }): SearchOutput {
  const normalizedQuery = normalizeQuery(query)
  const { expandedQuery } = expandSynonyms(query)
  const intent = detectIntent(query)

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
  const addResults = (results: FuseResult<SearchItem>[], weight: number, rescoreOnly: boolean) => {
    results.forEach((result) => {
      const score = (result.score ?? 1) * weight
      const existing = combined.get(result.item.id)
      if (!existing) {
        if (!rescoreOnly) {
          combined.set(result.item.id, { item: result.item, score })
        }
        return
      }
      if (score < existing.score) {
        existing.score = score
      }
    })
  }

  const queryWords = normalizedQuery.split(" ").filter(Boolean)
  // Direct terms (the user's own query + its words) build the recall set.
  // Expansion terms only rescore existing candidates: an expansion token that
  // exactly matches some item scores 0 no matter its weight, which dragged
  // the whole catalog into single-token queries.
  addResults(fuse.search(normalizedQuery), 1, false)
  queryWords.forEach((token) => {
    if (!token || token.length < 2 || token === normalizedQuery) return
    addResults(fuse.search(token), token.length <= 3 ? 1.5 : 1.35, false)
  })
  if (intent && expandedQuery && expandedQuery !== normalizedQuery) {
    addResults(fuse.search(expandedQuery), 1.15, true)
    expandedQuery.split(" ").forEach((token) => {
      if (!token || token.length < 2 || queryWords.includes(token) || token === expandedQuery) return
      addResults(fuse.search(token), token.length <= 3 ? 1.5 : 1.35, true)
    })
  }

  let candidates = Array.from(combined.values())
  // Short queries fuzz-match noise ("dog" hit "dock"); require a literal
  // substring so only genuine matches survive.
  if (normalizedQuery.length <= 3) {
    candidates = candidates.filter(({ item }) =>
      `${normalizeQuery(item.title)} ${normalizeQuery(item.description ?? "")} ${item.keywords.map((keyword) => normalizeQuery(keyword)).join(" ")}`.includes(
        normalizedQuery,
      ),
    )
  }

  const ranked = candidates
    .map((result) => {
      let score = rerankScore(result.item, result.score, queryWords, normalizedQuery)
      if (intent && result.item.intent === intent) {
        score *= RERANK.intentItem
      }
      if (intent && INTENT_GROUPS[intent]?.includes(result.item.group)) {
        score *= RERANK.intentGroup
      }
      return {
        item: result.item,
        score,
      }
    })
    .sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score
      const typeOrder = TYPE_RANK[a.item.type] - TYPE_RANK[b.item.type]
      if (typeOrder !== 0) return typeOrder
      const groupOrder = SEARCH_GROUPS.indexOf(a.item.group) - SEARCH_GROUPS.indexOf(b.item.group)
      if (groupOrder !== 0) return groupOrder
      return a.item.id < b.item.id ? -1 : 1
    })
    .map((result) => result.item)

  const totalResults = ranked.length
  const capped = ranked.slice(0, MAX_TOTAL_ITEMS)
  const perGroupCount = new Map<SearchGroup, number>()
  const visible = capped.filter((item) => {
    const count = perGroupCount.get(item.group) ?? 0
    if (count >= MAX_ITEMS_PER_GROUP) return false
    perGroupCount.set(item.group, count + 1)
    return true
  })

  const groups = groupResults(visible, intent)
  const answer = intent ? INSTANT_ANSWERS[intent] ?? null : null

  if (options?.allowFallback && ranked.length === 0) {
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
    totalResults,
  }
}

// Closest title for "did you mean" when a longer query matches nothing.
export function findSuggestion(query: string) {
  const normalized = normalizeQuery(query)
  if (normalized.length < 4) return null
  const best = fuse.search(normalized)[0]
  if (!best || best.score === undefined || best.score > 0.5) return null
  return best.item.title
}

export function getAskUsAnswer() {
  return ASK_US_ANSWER
}
