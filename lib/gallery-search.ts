import {
  GALLERY_CATEGORIES,
  GALLERY_PHOTOS,
  type GalleryAmenity,
  type GalleryCategory,
  type GalleryPhoto,
  type GalleryRoom,
} from "@/lib/gallery-photos"

export type GalleryFilter = {
  query: string
  category: GalleryCategory | "all"
  amenity?: GalleryAmenity | "all"
  room?: GalleryRoom | "all"
}

export const DEFAULT_GALLERY_FILTER: GalleryFilter = {
  query: "",
  category: "all",
  amenity: "all",
  room: "all",
}

const CATEGORY_LABELS = new Map(GALLERY_CATEGORIES.map((entry) => [entry.id, entry.label]))

/**
 * Amenity sub-groups inside the Pool & terrace category, in the order the
 * client asked for them. Membership comes from each photo's own caption/tags,
 * never from inference — see the evidence rule enforced by the unit tests.
 */
export const GALLERY_AMENITY_LABELS: { id: GalleryAmenity; label: string }[] = [
  { id: "pool", label: "Pool" },
  { id: "infinity-edge", label: "Infinity Edge" },
  { id: "pool-bar", label: "Pool Bar" },
  { id: "hot-tub", label: "Hot Tub" },
]

/**
 * Room sub-groups inside the Suites & bedrooms category, in the order the
 * client asked for them: each suite with its own bedroom and bathroom, then
 * the bunk room. Only photos the owner named by room carry an assignment, so
 * the chips are always narrower than the category — an unnamed bathroom stays
 * reachable under "All suites & bedrooms" rather than being filed on a guess.
 */
export const GALLERY_ROOM_LABELS: { id: GalleryRoom; label: string }[] = [
  { id: "suite-1", label: "Suite 1" },
  { id: "suite-2", label: "Suite 2" },
  { id: "suite-3", label: "Suite 3" },
  { id: "bunk-room", label: "Bunk Room" },
]

/**
 * Guest vocabulary rarely matches caption vocabulary: people search "bedroom"
 * for a photo captioned "suite", or "food" for one captioned "ceviche". Each
 * group below is fully connected — typing any word in a group matches photos
 * described with any other word in it.
 */
const SYNONYM_GROUPS: string[][] = [
  ["bedroom", "bed", "suite", "room", "sleeping", "master"],
  ["bathroom", "shower", "vanity", "ensuite", "bath"],
  ["pool", "swim", "swimming", "infinity", "poolside"],
  ["hottub", "jacuzzi", "spa"],
  ["food", "dining", "dinner", "lunch", "meal", "plated", "cuisine", "eat"],
  ["chef", "cook", "cooking", "kitchen"],
  ["drink", "cocktail", "bar", "beverage"],
  ["boat", "dock", "pier", "marina", "sail"],
  ["snorkel", "snorkeling", "dive", "diving", "scuba", "underwater", "reef"],
  ["fish", "fishing", "catch"],
  ["sunset", "sunrise", "dusk", "golden"],
  ["beach", "sand", "shore", "shoreline", "seaside"],
  ["living", "lounge", "greatroom", "seating", "sofa"],
  ["staff", "team", "people", "guest", "host"],
  ["outside", "outdoor", "exterior", "grounds", "lawn", "garden"],
  ["kid", "child", "children", "family"],
  ["wedding", "celebration", "party", "event"],
]

const SYNONYMS = new Map<string, string[]>()
for (const group of SYNONYM_GROUPS) {
  for (const word of group) {
    SYNONYMS.set(word, group)
  }
}

/** Lowercase, strip punctuation, and collapse whitespace. */
export function normalizeGalleryText(value: string) {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Crude singularizer so "beds"/"bed" and "suites"/"suite" are the same token. */
function singularize(token: string) {
  if (token.length > 3 && token.endsWith("ies")) return `${token.slice(0, -3)}y`
  if (token.length > 3 && (token.endsWith("ses") || token.endsWith("xes") || token.endsWith("hes"))) {
    return token.slice(0, -2)
  }
  if (token.length > 3 && token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1)
  return token
}

function tokenize(value: string) {
  return normalizeGalleryText(value).split(" ").filter(Boolean).map(singularize)
}

/**
 * Everything a photo can be matched on, as one normalized token set: caption,
 * tags, and the human label of its category (so "suites" finds every photo in
 * "Suites & bedrooms" even when the caption never says the word).
 */
function buildHaystack(photo: GalleryPhoto) {
  const tokens = new Set<string>()
  const add = (value: string) => tokenize(value).forEach((token) => tokens.add(token))

  add(photo.alt)
  photo.tags.forEach(add)
  add(CATEGORY_LABELS.get(photo.category) ?? photo.category)
  add(photo.category)

  for (const token of Array.from(tokens)) {
    for (const synonym of SYNONYMS.get(token) ?? []) {
      tokens.add(singularize(synonym))
    }
  }

  return tokens
}

const HAYSTACKS = new WeakMap<GalleryPhoto, Set<string>>()

function haystackFor(photo: GalleryPhoto) {
  let tokens = HAYSTACKS.get(photo)
  if (!tokens) {
    tokens = buildHaystack(photo)
    HAYSTACKS.set(photo, tokens)
  }
  return tokens
}

/**
 * A photo matches when every search token matches, so extra words narrow the
 * result instead of widening it. A token matches on an exact token hit, on a
 * synonym of one, or as a prefix — the last one is what makes the grid react
 * sensibly while someone is still typing.
 */
function matchesQuery(photo: GalleryPhoto, queryTokens: string[]) {
  if (queryTokens.length === 0) return true
  const haystack = haystackFor(photo)

  return queryTokens.every((token) => {
    if (haystack.has(token)) return true
    if ((SYNONYMS.get(token) ?? []).some((synonym) => haystack.has(singularize(synonym)))) return true
    if (token.length < 3) return false
    for (const candidate of haystack) {
      if (candidate.startsWith(token)) return true
    }
    return false
  })
}

/**
 * Detail shots — a vanity, a shower screen — belong in the gallery but should
 * not be the first thing a guest sees in a category that is otherwise selling
 * the room.
 */
const DEMOTED_TAGS = new Set(["bathroom", "ensuite", "en-suite", "shower", "vanity", "toilet"])

function isDetailShot(photo: GalleryPhoto) {
  return photo.tags.some((tag) => DEMOTED_TAGS.has(tag.toLowerCase()))
}

const CATEGORY_RANK = new Map(GALLERY_CATEGORIES.map((entry, index) => [entry.id, index]))

/**
 * Default browse order. Raw manifest order groups every source together, which
 * puts a bathroom first and buries 60 consecutive bedroom frames at the end. So:
 *
 * 1. Rank inside each category — photos already chosen for a site page first
 *    (they are the hand-picked ones), detail shots last, manifest order as the
 *    stable tiebreak.
 * 2. Interleave the categories proportionally, by giving every photo the
 *    fractional position it occupies within its own category and sorting on
 *    that. A 65-photo category and a 3-photo one both spread evenly across the
 *    whole grid, so every screenful stays varied instead of running in blocks.
 *
 * Pure function of the manifest, so it survives a data regeneration and renders
 * identically on the server and the client.
 */
export function orderGalleryPhotos(photos: GalleryPhoto[]): GalleryPhoto[] {
  const buckets = new Map<GalleryCategory, GalleryPhoto[]>()
  photos.forEach((photo) => {
    const bucket = buckets.get(photo.category)
    if (bucket) bucket.push(photo)
    else buckets.set(photo.category, [photo])
  })

  const manifestIndex = new Map(photos.map((photo, index) => [photo.id, index]))
  const spread = new Map<string, number>()

  for (const bucket of buckets.values()) {
    bucket.sort((a, b) => {
      const promoted = Number(a.usedIn.length === 0) - Number(b.usedIn.length === 0)
      if (promoted !== 0) return promoted
      const detail = Number(isDetailShot(a)) - Number(isDetailShot(b))
      if (detail !== 0) return detail
      return (manifestIndex.get(a.id) ?? 0) - (manifestIndex.get(b.id) ?? 0)
    })
    bucket.forEach((photo, index) => {
      spread.set(photo.id, (index + 0.5) / bucket.length)
    })
  }

  return [...photos].sort((a, b) => {
    const bySpread = (spread.get(a.id) ?? 0) - (spread.get(b.id) ?? 0)
    if (bySpread !== 0) return bySpread
    const byCategory = (CATEGORY_RANK.get(a.category) ?? 0) - (CATEGORY_RANK.get(b.category) ?? 0)
    if (byCategory !== 0) return byCategory
    return (manifestIndex.get(a.id) ?? 0) - (manifestIndex.get(b.id) ?? 0)
  })
}

export function filterGalleryPhotos(
  photos: GalleryPhoto[],
  filter: GalleryFilter,
): GalleryPhoto[] {
  const queryTokens = tokenize(filter.query)
  return photos.filter((photo) => {
    if (filter.category !== "all" && photo.category !== filter.category) return false
    if (filter.amenity && filter.amenity !== "all") {
      // Amenity sub-groups only exist inside the pool category, so an amenity
      // filter never surfaces a bedroom or dining photo even if one carried a
      // stray amenity tag.
      if (photo.category !== "pool") return false
      if (!(photo.amenities ?? []).includes(filter.amenity)) return false
    }
    if (filter.room && filter.room !== "all") {
      // Same containment rule as amenities: room sub-groups only exist inside
      // the suites-bedrooms category.
      if (photo.category !== "suites-bedrooms") return false
      if (photo.room !== filter.room) return false
    }
    return matchesQuery(photo, queryTokens)
  })
}

/**
 * Photo counts per category for the current text query, so a chip can show how
 * many results it would actually yield and disable itself when it would yield
 * none.
 */
export function countGalleryPhotosByCategory(photos: GalleryPhoto[], query: string) {
  const queryTokens = tokenize(query)
  const counts = new Map<GalleryCategory | "all", number>()
  counts.set("all", 0)

  for (const photo of photos) {
    if (!matchesQuery(photo, queryTokens)) continue
    counts.set("all", (counts.get("all") ?? 0) + 1)
    counts.set(photo.category, (counts.get(photo.category) ?? 0) + 1)
  }

  return counts
}

export function getGalleryCategoryLabel(category: GalleryCategory | "all") {
  if (category === "all") return "All photos"
  return CATEGORY_LABELS.get(category) ?? category
}

/**
 * Photo counts per pool amenity sub-group for the current text query. A photo
 * in several sub-groups (an infinity pool with a swim-up bar) is counted once
 * in "all" but once in each sub-group it belongs to.
 */
export function countGalleryPhotosByAmenity(photos: GalleryPhoto[], query: string) {
  const queryTokens = tokenize(query)
  const counts = new Map<GalleryAmenity | "all", number>()
  counts.set("all", 0)

  for (const photo of photos) {
    if (photo.category !== "pool") continue
    if (!matchesQuery(photo, queryTokens)) continue
    counts.set("all", (counts.get("all") ?? 0) + 1)
    for (const amenity of photo.amenities ?? []) {
      counts.set(amenity, (counts.get(amenity) ?? 0) + 1)
    }
  }

  return counts
}

/** Categories that actually have photos, in the canonical display order. */
export const ACTIVE_GALLERY_CATEGORIES = GALLERY_CATEGORIES.filter((category) =>
  GALLERY_PHOTOS.some((photo) => photo.category === category.id),
)

/** Pool amenity sub-groups that have at least one assigned photo. */
export const ACTIVE_GALLERY_AMENITIES = GALLERY_AMENITY_LABELS.filter((amenity) =>
  GALLERY_PHOTOS.some((photo) => (photo.amenities ?? []).includes(amenity.id)),
)

/**
 * Photo counts per room sub-group for the current text query. "all" counts the
 * whole suites-bedrooms category, including the photos with no room yet, so the
 * chip row never implies photos have gone missing.
 */
export function countGalleryPhotosByRoom(photos: GalleryPhoto[], query: string) {
  const queryTokens = tokenize(query)
  const counts = new Map<GalleryRoom | "all", number>()
  counts.set("all", 0)

  for (const photo of photos) {
    if (photo.category !== "suites-bedrooms") continue
    if (!matchesQuery(photo, queryTokens)) continue
    counts.set("all", (counts.get("all") ?? 0) + 1)
    if (photo.room) counts.set(photo.room, (counts.get(photo.room) ?? 0) + 1)
  }

  return counts
}

/** Room sub-groups that have at least one assigned photo. */
export const ACTIVE_GALLERY_ROOMS = GALLERY_ROOM_LABELS.filter((room) =>
  GALLERY_PHOTOS.some((photo) => photo.room === room.id),
)
