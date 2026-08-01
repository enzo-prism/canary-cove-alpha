import { describe, expect, it } from "vitest"

import { GALLERY_CATEGORIES, GALLERY_PHOTOS, type GalleryPhoto } from "@/lib/gallery-photos"
import {
  ACTIVE_GALLERY_CATEGORIES,
  countGalleryPhotosByCategory,
  filterGalleryPhotos,
  getGalleryCategoryLabel,
  normalizeGalleryText,
  orderGalleryPhotos,
} from "@/lib/gallery-search"

const photo = (overrides: Partial<GalleryPhoto> = {}): GalleryPhoto => ({
  id: "test",
  src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1/test.jpg",
  alt: "A test photo",
  category: "pool",
  tags: [],
  width: 1600,
  height: 1200,
  source: "site",
  usedIn: [],
  ...overrides,
})

describe("normalizeGalleryText", () => {
  it("lowercases, strips punctuation, and collapses whitespace", () => {
    expect(normalizeGalleryText("  Spa-Inspired   EN-SUITE, bath!  ")).toBe("spa inspired en suite bath")
  })

  it("folds curly apostrophes so possessives tokenize cleanly", () => {
    expect(normalizeGalleryText("the villa’s kitchen")).toBe("the villas kitchen")
  })
})

describe("filterGalleryPhotos", () => {
  const photos = [
    photo({ id: "bed", alt: "Bedroom with a king bed", category: "suites-bedrooms", tags: ["suite"] }),
    photo({ id: "pool", alt: "Infinity pool at dusk", category: "pool", tags: ["swim"] }),
    photo({ id: "plate", alt: "Plated ceviche", category: "dining-food", tags: ["seafood"] }),
  ]

  it("returns everything for an empty filter", () => {
    expect(filterGalleryPhotos(photos, { query: "", category: "all" })).toHaveLength(3)
  })

  it("filters by category", () => {
    const result = filterGalleryPhotos(photos, { query: "", category: "pool" })
    expect(result.map((entry) => entry.id)).toEqual(["pool"])
  })

  it("matches on caption words", () => {
    const result = filterGalleryPhotos(photos, { query: "ceviche", category: "all" })
    expect(result.map((entry) => entry.id)).toEqual(["plate"])
  })

  it("matches on tags that never appear in the caption", () => {
    const result = filterGalleryPhotos(photos, { query: "seafood", category: "all" })
    expect(result.map((entry) => entry.id)).toEqual(["plate"])
  })

  it("matches on the category label so chips and search agree", () => {
    const result = filterGalleryPhotos(photos, { query: "dining", category: "all" })
    expect(result.map((entry) => entry.id)).toEqual(["plate"])
  })

  it("treats singular and plural as the same word", () => {
    expect(filterGalleryPhotos(photos, { query: "bedrooms", category: "all" })).toHaveLength(1)
    expect(filterGalleryPhotos(photos, { query: "bedroom", category: "all" })).toHaveLength(1)
  })

  it("resolves guest vocabulary through synonyms", () => {
    // Nothing is captioned "swimming" or "food"; the synonym groups carry these.
    expect(filterGalleryPhotos(photos, { query: "swimming", category: "all" })[0]?.id).toBe("pool")
    expect(filterGalleryPhotos(photos, { query: "food", category: "all" })[0]?.id).toBe("plate")
  })

  it("matches on a prefix so results react while the user is still typing", () => {
    expect(filterGalleryPhotos(photos, { query: "infin", category: "all" })[0]?.id).toBe("pool")
  })

  it("narrows rather than widens as more words are typed", () => {
    expect(filterGalleryPhotos(photos, { query: "king bed", category: "all" })).toHaveLength(1)
    expect(filterGalleryPhotos(photos, { query: "king ceviche", category: "all" })).toHaveLength(0)
  })

  it("combines a text query with a category", () => {
    expect(filterGalleryPhotos(photos, { query: "bed", category: "pool" })).toHaveLength(0)
    expect(filterGalleryPhotos(photos, { query: "bed", category: "suites-bedrooms" })).toHaveLength(1)
  })

  it("returns nothing for a query that matches nothing", () => {
    expect(filterGalleryPhotos(photos, { query: "snowstorm", category: "all" })).toHaveLength(0)
  })
})

describe("countGalleryPhotosByCategory", () => {
  const photos = [
    photo({ id: "a", category: "pool", alt: "Infinity pool" }),
    photo({ id: "b", category: "pool", alt: "Pool loungers" }),
    photo({ id: "c", category: "dining-food", alt: "Plated ceviche" }),
  ]

  it("counts every photo per category with no query", () => {
    const counts = countGalleryPhotosByCategory(photos, "")
    expect(counts.get("all")).toBe(3)
    expect(counts.get("pool")).toBe(2)
    expect(counts.get("dining-food")).toBe(1)
  })

  it("counts only photos matching the current query", () => {
    const counts = countGalleryPhotosByCategory(photos, "ceviche")
    expect(counts.get("all")).toBe(1)
    expect(counts.get("dining-food")).toBe(1)
    expect(counts.get("pool")).toBeUndefined()
  })
})

describe("gallery data", () => {
  it("ships a non-trivial library", () => {
    expect(GALLERY_PHOTOS.length).toBeGreaterThan(200)
  })

  it("has no duplicate ids or image URLs", () => {
    expect(new Set(GALLERY_PHOTOS.map((entry) => entry.id)).size).toBe(GALLERY_PHOTOS.length)
    expect(new Set(GALLERY_PHOTOS.map((entry) => entry.src)).size).toBe(GALLERY_PHOTOS.length)
  })

  it("gives every photo alt text, a known category, and real dimensions", () => {
    const categories = new Set(GALLERY_CATEGORIES.map((entry) => entry.id))
    for (const entry of GALLERY_PHOTOS) {
      expect(entry.alt.length, entry.id).toBeGreaterThan(3)
      expect(categories.has(entry.category), `${entry.id} -> ${entry.category}`).toBe(true)
      expect(entry.width, entry.id).toBeGreaterThan(0)
      expect(entry.height, entry.id).toBeGreaterThan(0)
    }
  })

  it("makes every photo reachable through at least one category chip", () => {
    for (const category of ACTIVE_GALLERY_CATEGORIES) {
      expect(filterGalleryPhotos(GALLERY_PHOTOS, { query: "", category: category.id }).length).toBeGreaterThan(0)
    }
    const chipTotal = ACTIVE_GALLERY_CATEGORIES.reduce(
      (total, category) =>
        total + filterGalleryPhotos(GALLERY_PHOTOS, { query: "", category: category.id }).length,
      0,
    )
    expect(chipTotal).toBe(GALLERY_PHOTOS.length)
  })

  it("carries the previously uncategorized site photos, not just the new ingests", () => {
    const sitePhotos = GALLERY_PHOTOS.filter((entry) => entry.source === "site")
    expect(sitePhotos.length).toBeGreaterThan(60)
    expect(sitePhotos.every((entry) => entry.tags.length > 0)).toBe(true)
  })

  it("answers the searches a guest is most likely to type", () => {
    for (const query of ["bedroom", "pool", "chef", "dinner", "boat", "sunset", "bathroom", "snorkeling"]) {
      expect(
        filterGalleryPhotos(GALLERY_PHOTOS, { query, category: "all" }).length,
        `no results for "${query}"`,
      ).toBeGreaterThan(0)
    }
  })

  it("finds the staff the property is known by name", () => {
    // The vision captions only ever said "chef", so the Chef Marvin pack was
    // invisible to the one search a guest or Gil would actually type.
    const marvin = filterGalleryPhotos(GALLERY_PHOTOS, { query: "marvin", category: "all" })
    expect(marvin.length).toBeGreaterThan(0)
    expect(marvin.every((entry) => entry.source === "gil-2026-07")).toBe(true)
  })

  it("still reaches the open-fire cooking shots through chef vocabulary", () => {
    // That photo carries no "chef" tag of its own; "outdoor-cooking" has to
    // resolve through the chef/cook synonym group.
    const chef = filterGalleryPhotos(GALLERY_PHOTOS, { query: "chef", category: "all" })
    expect(chef.some((entry) => entry.tags.includes("outdoor-cooking"))).toBe(true)
  })
})

describe("getGalleryCategoryLabel", () => {
  it("labels the all-photos pseudo category", () => {
    expect(getGalleryCategoryLabel("all")).toBe("All photos")
  })

  it("labels a real category", () => {
    expect(getGalleryCategoryLabel("suites-bedrooms")).toBe("Suites & bedrooms")
  })
})

describe("orderGalleryPhotos", () => {
  it("keeps every photo exactly once", () => {
    const ordered = orderGalleryPhotos(GALLERY_PHOTOS)
    expect(ordered).toHaveLength(GALLERY_PHOTOS.length)
    expect(new Set(ordered.map((entry) => entry.id)).size).toBe(GALLERY_PHOTOS.length)
  })

  it("is a pure function of its input, so server and client agree", () => {
    const first = orderGalleryPhotos(GALLERY_PHOTOS).map((entry) => entry.id)
    const second = orderGalleryPhotos(GALLERY_PHOTOS).map((entry) => entry.id)
    expect(first).toEqual(second)
    expect(GALLERY_PHOTOS.map((entry) => entry.id)).not.toEqual(first)
  })

  it("does not open the gallery on a bathroom detail shot", () => {
    const [lead] = orderGalleryPhotos(GALLERY_PHOTOS)
    expect(lead.tags.map((tag) => tag.toLowerCase())).not.toContain("bathroom")
  })

  it("prefers a photo already used on the site over an archive one in the same category", () => {
    const ordered = orderGalleryPhotos([
      photo({ id: "archive", category: "pool", usedIn: [] }),
      photo({ id: "on-site", category: "pool", usedIn: ["app/page.tsx"] }),
    ])
    expect(ordered.map((entry) => entry.id)).toEqual(["on-site", "archive"])
  })

  it("sinks detail shots below the photos that sell the room", () => {
    const ordered = orderGalleryPhotos([
      photo({ id: "vanity", category: "suites-bedrooms", tags: ["vanity"] }),
      photo({ id: "bed", category: "suites-bedrooms", tags: ["king-bed"] }),
    ])
    expect(ordered.map((entry) => entry.id)).toEqual(["bed", "vanity"])
  })

  it("spreads a large category across the whole grid instead of a single block", () => {
    const ordered = orderGalleryPhotos(GALLERY_PHOTOS)
    const half = Math.floor(ordered.length / 2)
    const inFirstHalf = ordered
      .slice(0, half)
      .filter((entry) => entry.category === "suites-bedrooms").length
    const total = ordered.filter((entry) => entry.category === "suites-bedrooms").length

    // An even spread puts roughly half of the biggest category in each half.
    expect(inFirstHalf / total).toBeGreaterThan(0.35)
    expect(inFirstHalf / total).toBeLessThan(0.65)
  })

  it("never runs more than a handful of one category back to back", () => {
    const ordered = orderGalleryPhotos(GALLERY_PHOTOS)
    let longestRun = 1
    let run = 1
    for (let index = 1; index < ordered.length; index += 1) {
      run = ordered[index].category === ordered[index - 1].category ? run + 1 : 1
      longestRun = Math.max(longestRun, run)
    }
    expect(longestRun).toBeLessThanOrEqual(4)
  })

  it("interleaves a small category through a large one rather than appending it", () => {
    const many = Array.from({ length: 8 }, (_, index) =>
      photo({ id: `pool-${index}`, category: "pool" }),
    )
    const few = [photo({ id: "sunset-0", category: "sunset-views" })]
    const positions = orderGalleryPhotos([...many, ...few]).map((entry) => entry.id)

    expect(positions.indexOf("sunset-0")).toBeGreaterThan(0)
    expect(positions.indexOf("sunset-0")).toBeLessThan(positions.length - 1)
  })
})
