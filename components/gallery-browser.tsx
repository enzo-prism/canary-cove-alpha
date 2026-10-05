"use client"

import Image from "next/image"
import { ArrowUp, ChevronLeft, ChevronRight, Search, X } from "lucide-react"
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react"

import { BrandBird } from "@/components/brand-mark"
import { Chip, ChipRail } from "@/components/gallery/chip-rail"
import { SplitText } from "@/components/motion/split-text"
import { PhotoLightbox } from "@/components/photo-lightbox"
import { CtaLink } from "@/components/ui/cta-link"
import { cloudinaryBlurDataUrl } from "@/lib/cloudinary-blur"
import {
  GALLERY_PHOTOS,
  type GalleryAmenity,
  type GalleryCategory,
  type GalleryPhoto,
  type GalleryRoom,
} from "@/lib/gallery-photos"
import {
  ACTIVE_GALLERY_AMENITIES,
  ACTIVE_GALLERY_CATEGORIES,
  ACTIVE_GALLERY_ROOMS,
  countGalleryPhotosByAmenity,
  countGalleryPhotosByCategory,
  countGalleryPhotosByRoom,
  filterGalleryPhotos,
  getGalleryCategoryLabel,
  orderGalleryPhotos,
} from "@/lib/gallery-search"
import { cn } from "@/lib/utils"

/*
 * The library opens on the studio set: these professional frames lead
 * "All photos" (and lead any filtered view they belong to), so the first
 * screen reads as the estate rather than a phone snapshot. The rest keep the
 * manifest's spread order. Ids that ever leave the manifest are skipped.
 */
const LEAD_PHOTO_IDS = [
  "heroVillaSeating",
  "livingRoom",
  "villaMasterBedroom",
  "heroVillaDining",
  "diningRoom",
  "heroVillaInterior",
  "villaInteriorWide",
  "bedroomGardenView",
  "livingRoomPhoto",
  "viewFromKitchen",
  "suite1BedroomSecondAngle",
  "bunkRoomMadeUp",
]

function leadWithStudioSet(photos: GalleryPhoto[]) {
  const rank = new Map(LEAD_PHOTO_IDS.map((id, index) => [id, index]))
  const lead = photos.filter((photo) => rank.has(photo.id)).sort((a, b) => rank.get(a.id)! - rank.get(b.id)!)
  return [...lead, ...photos.filter((photo) => !rank.has(photo.id))]
}

/** Browse order is a pure function of the manifest, so it is computed once. */
const ORDERED_PHOTOS = leadWithStudioSet(orderGalleryPhotos(GALLERY_PHOTOS))

/*
 * Justified-row heights (px) per breakpoint, mirroring the grid's --row
 * values. A tile renders at about row × ratio and grows to close its row, so
 * `sizes` is derived per photo instead of a blanket viewport share — a 180px
 * phone tile must not fetch an 828px file.
 */
const ROW_PX = { base: 104, sm: 176, lg: 240, xl: 272 } as const
// How far a tile can grow past its basis to close a row. Wide rows can end
// up with two 3:2 frames sharing ~1.5× their basis; phone rows pack tighter.
const ROW_GROWTH = { base: 1.15, wide: 1.47 } as const

function tileSizes(ratio: number) {
  const at = (row: number, cap: number, growth: number = ROW_GROWTH.wide) =>
    Math.min(Math.round(row * ratio * growth), cap)
  return [
    `(min-width: 1280px) ${at(ROW_PX.xl, 1224)}px`,
    `(min-width: 1024px) ${at(ROW_PX.lg, 928)}px`,
    `(min-width: 640px) ${at(ROW_PX.sm, 704)}px`,
    `${at(ROW_PX.base, 342, ROW_GROWTH.base)}px`,
  ].join(", ")
}

/**
 * Photos rendered before the first "load more". Enough to fill a large desktop
 * screen twice over, small enough that a phone on cellular is not asked to lay
 * out 225 images to show the first row.
 */
const INITIAL_VISIBLE = 36
const LOAD_MORE_STEP = 36

/** Right edge of <Container size="wide"> content, for full-bleed bars. */
const WIDE_EDGE = "max(3rem, calc((100% - 1320px) / 2 + 3rem))"

/*
 * Tile wipe. The reveal observer watches the (never clipped) <li>; only the
 * media inside it is clipped. Observing a clipped element directly would let
 * the browser treat it as invisible and skip the reveal.
 */
const TILE_STYLES = `
html.js [data-reveal="cc-tile"] .cc-tile-media { transition: clip-path 1300ms var(--ease-in-out-quart) var(--reveal-delay, 0ms); }
html.js [data-reveal="cc-tile"] .cc-tile-media img { transition: transform 1800ms var(--ease-out-expo) var(--reveal-delay, 0ms); }
html.js [data-reveal="cc-tile"]:not([data-revealed]) .cc-tile-media { clip-path: inset(100% 0 0 0); }
html.js [data-reveal="cc-tile"]:not([data-revealed]) .cc-tile-media img { transform: scale(1.18); }
@media (prefers-reduced-motion: reduce) {
  html.js [data-reveal="cc-tile"] .cc-tile-media, html.js [data-reveal="cc-tile"] .cc-tile-media img { clip-path: none !important; transform: none !important; transition: none !important; }
}
@media print { html.js [data-reveal="cc-tile"] .cc-tile-media { clip-path: none !important; } }
`

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

export function GalleryBrowser() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<GalleryCategory | "all">("all")
  const [amenity, setAmenity] = useState<GalleryAmenity | "all">("all")
  const [room, setRoom] = useState<GalleryRoom | "all">("all")
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  // True once an IntersectionObserver is watching the end of the grid. While it
  // is, a "load more" button would be unreachable — scrolling far enough to tap
  // it is exactly what loads the next page and pushes it out from under the
  // finger — so the button is only offered when auto-loading is unavailable.
  const [autoLoads, setAutoLoads] = useState(false)
  const [railOverflow, setRailOverflow] = useState({ start: false, end: false })
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const barRef = useRef<HTMLDivElement | null>(null)
  const searchRef = useRef<HTMLInputElement | null>(null)

  // A visitor (or a fast test) can type before hydration finishes; adopt
  // whatever is already in the box instead of discarding it.
  useEffect(() => {
    const typed = searchRef.current?.value
    if (typed) setQuery(typed)
  }, [])
  const resultsRef = useRef<HTMLDivElement | null>(null)
  const railNodeRef = useRef<HTMLDivElement | null>(null)
  const gridRef = useRef<HTMLUListElement | null>(null)
  // While more pages are coming, the trailing (unjustified) row is held back
  // until the next page completes it. Otherwise that row would regrow when the
  // page lands and shift every tile in it (CLS). `count` ties the trim to the
  // render it was measured on; `width` re-measures after a resize.
  const [trim, setTrim] = useState<{ count: number; width: number; from: number } | null>(null)
  const [gridWidth, setGridWidth] = useState(0)

  const deferredQuery = useDeferredValue(query)

  const filtered = useMemo(
    () => filterGalleryPhotos(ORDERED_PHOTOS, { query: deferredQuery, category, amenity, room }),
    [amenity, category, deferredQuery, room],
  )
  const categoryCounts = useMemo(
    () => countGalleryPhotosByCategory(ORDERED_PHOTOS, deferredQuery),
    [deferredQuery],
  )
  const amenityCounts = useMemo(
    () => countGalleryPhotosByAmenity(ORDERED_PHOTOS, deferredQuery),
    [deferredQuery],
  )
  const roomCounts = useMemo(
    () => countGalleryPhotosByRoom(ORDERED_PHOTOS, deferredQuery),
    [deferredQuery],
  )

  // Any change to the filter puts the grid back at the top of a fresh result
  // set; keeping a grown count would dump the user deep into a list they have
  // not scrolled.
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE)
  }, [amenity, category, deferredQuery, room])

  useEffect(() => {
    if (category !== "pool") setAmenity("all")
    if (category !== "suites-bedrooms") setRoom("all")
  }, [category])

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])
  const hasMore = visible.length < filtered.length
  const trimFrom =
    hasMore && trim && trim.count === visible.length && trim.width === gridWidth ? trim.from : visible.length

  useEffect(() => {
    const grid = gridRef.current
    if (!grid || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver((entries) => {
      const width = Math.round(entries[0]?.contentRect.width ?? 0)
      setGridWidth((current) => (current === width ? current : width))
    })
    observer.observe(grid)
    return () => observer.disconnect()
  }, [filtered.length])

  // Measured before paint: find where the last flex line starts and hold that
  // row back. Runs on the render where every tile is laid out (no trim applied
  // for this count/width yet), so the measurement is never of a trimmed grid.
  useLayoutEffect(() => {
    if (!hasMore || !gridWidth) return
    if (trim && trim.count === visible.length && trim.width === gridWidth) return
    const grid = gridRef.current
    if (!grid) return
    const tiles = Array.from(grid.children) as HTMLElement[]
    const last = tiles[tiles.length - 1]
    if (!last) return
    let from = tiles.length
    while (from > 0 && Math.abs(tiles[from - 1].offsetTop - last.offsetTop) < 2) from -= 1
    // Never hold back everything (a single-row result just shows as is).
    setTrim({ count: visible.length, width: gridWidth, from: from > 0 ? from : tiles.length })
  }, [gridWidth, hasMore, trim, visible.length])

  const loadMore = useCallback(() => {
    setVisibleCount((current) => current + LOAD_MORE_STEP)
  }, [])

  // Auto-load the next page as the sentinel approaches the viewport, so the
  // grid just keeps going as someone scrolls.
  useEffect(() => {
    if (!hasMore) return
    const sentinel = sentinelRef.current
    if (!sentinel || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore()
      },
      { rootMargin: "600px 0px" },
    )
    observer.observe(sentinel)
    setAutoLoads(true)
    return () => observer.disconnect()
  }, [hasMore, loadMore, visible.length])

  const hasFilters =
    query.trim().length > 0 || category !== "all" || amenity !== "all" || room !== "all"

  /** After a filter change deep in the grid, bring the top of the new results up under the bar. */
  const settleToResults = useCallback(() => {
    const results = resultsRef.current
    const bar = barRef.current
    if (!results || !bar) return
    const barBottom = bar.getBoundingClientRect().bottom
    const top = results.getBoundingClientRect().top
    if (top >= barBottom) return
    window.scrollTo({ top: window.scrollY + top - barBottom, behavior: prefersReducedMotion() ? "auto" : "smooth" })
  }, [])

  const selectCategory = (next: GalleryCategory | "all") => {
    setCategory(next)
    settleToResults()
  }

  const resetFilters = () => {
    setQuery("")
    setCategory("all")
    setAmenity("all")
    setRoom("all")
  }

  // The lightbox only ever receives the photos already on screen, so swiping
  // stays in step with what the visitor has actually browsed and the dialog
  // never mounts the entire library.
  const lightboxImages = useMemo(
    () => visible.map((photo) => ({ src: photo.src, alt: photo.alt, caption: photo.alt })),
    [visible],
  )

  const trimmedQuery = deferredQuery.trim()
  const scopeLabel = (() => {
    if (category === "pool" && amenity !== "all") {
      return ACTIVE_GALLERY_AMENITIES.find((entry) => entry.id === amenity)?.label ?? "Pool & terrace"
    }
    if (category === "suites-bedrooms" && room !== "all") {
      return ACTIVE_GALLERY_ROOMS.find((entry) => entry.id === room)?.label ?? "Suites & bedrooms"
    }
    return category === "all" ? "All photos" : getGalleryCategoryLabel(category)
  })()

  const scrollRail = (direction: 1 | -1) => {
    const rail = railNodeRef.current
    if (!rail) return
    rail.scrollBy({ left: direction * rail.clientWidth * 0.7, behavior: prefersReducedMotion() ? "auto" : "smooth" })
  }

  const subRailClass = "enter-up -mx-6 px-6 sm:-mx-8 sm:px-8 lg:mx-0 lg:basis-full lg:px-0"

  return (
    <div className="relative pb-24 sm:pb-32" data-testid="gallery-browser">
      <style href="cc-gallery-tiles" precedence="default">
        {TILE_STYLES}
      </style>
      {/* Pinned directly under the site header. The header shrinks on scroll,
          so the offset tracks its live height instead of a fixed number - a
          few pixels of drift here shows a sliver of scrolling photo above the
          bar. This element must stay the direct parent of the category rail,
          and it is never given a reveal transform. */}
      <div
        ref={barRef}
        className="sticky top-[var(--site-header-height)] z-30 flex flex-col gap-2.5 border-b border-border/70 bg-sand/90 px-6 py-3 backdrop-blur-xl backdrop-saturate-150 sm:px-8 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-5 lg:gap-y-2.5 lg:px-[max(3rem,calc((100%-1320px)/2+3rem))]"
      >
        <label className="group/search relative flex h-11 shrink-0 cursor-text items-center gap-2.5 rounded-full bg-sand-light pl-4 pr-1.5 ring-1 ring-inset ring-border/90 transition-shadow duration-500 focus-within:ring-2 focus-within:ring-lagoon/50 lg:w-72">
          <Search
            className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-focus-within/search:text-foreground"
            aria-hidden="true"
          />
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pool, chef, sunset, snorkeling…"
            className="h-full min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/80 sm:text-sm [&::-webkit-search-cancel-button]:hidden"
            aria-label="Search photos"
            data-testid="gallery-search-input"
            type="search"
            enterKeyHint="search"
            autoComplete="off"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="focus-ring inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-foreground transition-colors hover:bg-ink hover:text-sand-light"
              aria-label="Clear search"
              data-testid="gallery-search-clear"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </label>

        <ChipRail
          activeKey={category}
          label="Filter photos by category"
          testId="gallery-category-filters"
          onOverflowChange={setRailOverflow}
          railRef={(node) => {
            railNodeRef.current = node
          }}
          className="-mx-6 px-6 [mask-image:linear-gradient(90deg,transparent,#000_1.25rem,#000_calc(100%-2.5rem),transparent)] sm:-mx-8 sm:px-8 lg:mx-0 lg:min-w-0 lg:flex-1 lg:px-0 lg:pr-28 lg:[mask-image:linear-gradient(90deg,#000_calc(100%-8rem),transparent_calc(100%-5.5rem))]"
        >
          {[{ id: "all" as const, label: "All photos" }, ...ACTIVE_GALLERY_CATEGORIES].map((entry) => {
            const count = categoryCounts.get(entry.id) ?? 0
            const isActive = category === entry.id
            return (
              <Chip
                key={entry.id}
                active={isActive}
                disabled={count === 0 && !isActive}
                onClick={() => selectCategory(entry.id)}
                label={entry.label}
                count={count}
                testId={`gallery-filter-${entry.id}`}
              />
            )
          })}
        </ChipRail>

        {/* Desktop rail arrows. Positioned against the sticky bar so the rail
            itself stays the bar's direct child. */}
        <div
          className="pointer-events-none absolute top-[34px] hidden -translate-y-1/2 items-center gap-1.5 lg:flex"
          style={{ right: WIDE_EDGE }}
        >
          {([-1, 1] as const).map((direction) => {
            const enabled = direction === -1 ? railOverflow.start : railOverflow.end
            const Icon = direction === -1 ? ChevronLeft : ChevronRight
            return (
              <button
                key={direction}
                type="button"
                onClick={() => scrollRail(direction)}
                disabled={!enabled}
                aria-label={direction === -1 ? "Scroll categories left" : "Scroll categories right"}
                className="focus-ring pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-sand-light text-foreground ring-1 ring-inset ring-border transition-[opacity,background-color,color] duration-300 hover:bg-ink hover:text-sand-light disabled:pointer-events-none disabled:opacity-30"
              >
                <Icon className="h-4 w-4" />
              </button>
            )
          })}
        </div>

        {category === "pool" && ACTIVE_GALLERY_AMENITIES.length > 0 ? (
          <ChipRail
            activeKey={amenity}
            label="Filter by pool amenity"
            testId="gallery-amenity-filters"
            size="sm"
            className={subRailClass}
          >
            {[{ id: "all" as const, label: "All pool & terrace" }, ...ACTIVE_GALLERY_AMENITIES].map((entry) => {
              const count = amenityCounts.get(entry.id) ?? 0
              const isActive = amenity === entry.id
              return (
                <Chip
                  key={entry.id}
                  size="sm"
                  active={isActive}
                  disabled={count === 0 && !isActive}
                  onClick={() => setAmenity(entry.id)}
                  label={entry.label}
                  count={count}
                  testId={`gallery-amenity-filter-${entry.id}`}
                />
              )
            })}
          </ChipRail>
        ) : null}

        {category === "suites-bedrooms" && ACTIVE_GALLERY_ROOMS.length > 0 ? (
          <ChipRail
            activeKey={room}
            label="Filter by room"
            testId="gallery-room-filters"
            size="sm"
            className={subRailClass}
          >
            {[{ id: "all" as const, label: "All suites & bedrooms" }, ...ACTIVE_GALLERY_ROOMS].map((entry) => {
              const count = roomCounts.get(entry.id) ?? 0
              const isActive = room === entry.id
              return (
                <Chip
                  key={entry.id}
                  size="sm"
                  active={isActive}
                  disabled={count === 0 && !isActive}
                  onClick={() => setRoom(entry.id)}
                  label={entry.label}
                  count={count}
                  testId={`gallery-room-filter-${entry.id}`}
                />
              )
            })}
          </ChipRail>
        ) : null}
      </div>

      <div ref={resultsRef} className="mx-auto w-full max-w-[1320px] px-6 sm:px-8 lg:px-12">
        {/* Deliberately outside the sticky block: on a 390px phone the pinned bar
            has to stay short enough to leave most of the screen for photos. */}
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pb-6 pt-8 sm:pb-8 sm:pt-12">
          <div className="flow flow-xs min-w-0">
            <p className="eyebrow eyebrow-plain">
              {trimmedQuery ? <>Results for &ldquo;{trimmedQuery}&rdquo;</> : "Now showing"}
            </p>
            <SplitText
              key={scopeLabel}
              as="h2"
              mode="enter"
              step={45}
              text={scopeLabel}
              className="text-section"
            />
          </div>
          <div className="flex items-center gap-3">
            <p className="tabular text-[13px] font-medium text-muted-foreground" data-testid="gallery-result-count">
              {visible.length} of {filtered.length} photos
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="focus-ring group inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium text-foreground ring-1 ring-inset ring-border transition-colors duration-500 hover:bg-ink hover:text-sand-light hover:ring-ink"
                data-testid="gallery-reset"
              >
                <X className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-90" aria-hidden="true" />
                Reset filters
              </button>
            ) : null}
          </div>
        </div>

        {filtered.length > 0 ? (
          <>
            {/* Justified rows: every photo keeps its own aspect ratio (nothing
                in the library is cropped) and rows fill the width exactly.
                Each item grows in proportion to its ratio, so a row shares one
                height; the trailing spacer stops a short last row stretching.
                New pages only append rows, so nothing already seen moves. */}
            <ul
              ref={gridRef}
              className="flex flex-wrap gap-2 [--row:6.5rem] after:content-[''] after:[flex-grow:1000000] sm:gap-3 sm:[--row:11rem] lg:[--row:15rem] xl:[--row:17rem]"
              data-testid="gallery-grid"
            >
              {visible.map((photo, index) => {
                const ratio = photo.width / photo.height
                const blurDataURL = cloudinaryBlurDataUrl(photo.src)
                return (
                  <li
                    key={photo.id}
                    data-reveal="cc-tile"
                    // Held-back trailing row (see `trim`): out of flow until
                    // the next page arrives to complete it.
                    className={cn("relative min-w-0", index >= trimFrom && "hidden")}
                    style={
                      {
                        flexGrow: ratio * 100,
                        flexBasis: `calc(var(--row) * ${ratio.toFixed(4)})`,
                        "--reveal-delay": `${(index % 6) * 70}ms`,
                      } as CSSProperties
                    }
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(index)}
                      aria-label={`View photo: ${photo.alt}`}
                      data-testid="gallery-photo"
                      className="focus-ring group relative block w-full cursor-zoom-in overflow-hidden rounded-[10px] bg-sand-deep text-left sm:rounded-[14px]"
                    >
                      <span aria-hidden="true" className="block" style={{ paddingBottom: `${(100 / ratio).toFixed(3)}%` }} />
                      <span className="cc-tile-media zoom-media absolute inset-0 overflow-hidden">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes={tileSizes(ratio)}
                          loading="lazy"
                          placeholder={blurDataURL ? "blur" : "empty"}
                          blurDataURL={blurDataURL}
                          className="object-cover"
                        />
                      </span>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 hidden items-end bg-gradient-to-t from-ink/75 via-ink/0 to-ink/0 p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 sm:flex sm:p-4"
                      >
                        <span className="flex w-full translate-y-2 items-end justify-between gap-3 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
                          <span className="line-clamp-2 text-[13px] font-medium leading-snug text-white">
                            {photo.alt}
                          </span>
                          <span className="tabular shrink-0 text-[11px] font-semibold tracking-[0.18em] text-white/70">
                            {String(index + 1).padStart(3, "0")}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            {hasMore ? (
              <div ref={sentinelRef} className="flex justify-center pt-12">
                {autoLoads ? (
                  <p
                    className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground"
                    role="status"
                    aria-live="polite"
                    data-testid="gallery-loading-more"
                  >
                    <span aria-hidden="true" className="relative h-px w-10 overflow-hidden bg-border">
                      <span className="gallery-load absolute inset-y-0 left-0 w-1/2 bg-ink" />
                    </span>
                    Loading more photos… ({filtered.length - visible.length} left)
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={loadMore}
                    className="focus-ring h-12 rounded-full px-6 text-sm font-medium text-foreground ring-1 ring-inset ring-border transition-colors hover:bg-ink hover:text-sand-light"
                    data-testid="gallery-load-more"
                  >
                    Load more photos ({filtered.length - visible.length} left)
                  </button>
                )}
                <style href="cc-gallery-load" precedence="default">
                  {
                    ".gallery-load{animation:gallery-load 1.4s cubic-bezier(.76,0,.24,1) infinite}@keyframes gallery-load{from{transform:translateX(-100%)}to{transform:translateX(200%)}}@media (prefers-reduced-motion:reduce){.gallery-load{animation:none}}"
                  }
                </style>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5 pt-16 text-center sm:pt-24">
                <span aria-hidden="true" className="hairline mb-4 w-full max-w-md" />
                <BrandBird height={44} />
                <p
                  className="max-w-[22ch] font-display text-[1.9rem] leading-[1.05] text-foreground sm:text-[2.5rem]"
                  data-testid="gallery-end"
                >
                  You&rsquo;ve reached the end of {category === "all" && !query ? "the gallery" : "these results"}.
                </p>
                <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
                  <CtaLink
                    href="/book"
                    className="w-full justify-between sm:w-auto"
                    eventName="cta_click"
                    eventPayload={{ location: "gallery_end", target: "/book" }}
                  >
                    Check dates
                  </CtaLink>
                  <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })}
                    className="focus-ring group inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium text-foreground ring-1 ring-inset ring-border transition-colors duration-500 hover:bg-ink hover:text-sand-light hover:ring-ink"
                  >
                    <ArrowUp className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5" aria-hidden="true" />
                    Back to top
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div
            className={cn(
              "flex flex-col items-center gap-4 rounded-[var(--radius-media)] border border-dashed border-border px-6 py-20 text-center",
            )}
            data-testid="gallery-empty"
          >
            <BrandBird height={40} className="opacity-90" />
            <p className="font-display text-[1.9rem] leading-tight text-foreground sm:text-[2.4rem]">
              No photos match that search yet.
            </p>
            <p className="text-body max-w-md">
              Try a broader word like &ldquo;pool&rdquo;, &ldquo;bedroom&rdquo;, or &ldquo;boat&rdquo;, or clear the
              filters to browse all {ORDERED_PHOTOS.length} photos.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="focus-ring mt-2 inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-medium text-sand-light transition-colors duration-500 hover:bg-lagoon"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      <PhotoLightbox images={lightboxImages} openIndex={openIndex} onClose={() => setOpenIndex(null)} />
    </div>
  )
}
