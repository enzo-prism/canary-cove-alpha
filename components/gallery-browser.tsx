"use client"

import Image from "next/image"
import { Search, X } from "lucide-react"
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react"

import { PhotoLightbox } from "@/components/photo-lightbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cloudinaryBlurDataUrl } from "@/lib/cloudinary-blur"
import { GALLERY_PHOTOS, type GalleryCategory } from "@/lib/gallery-photos"
import {
  ACTIVE_GALLERY_AMENITIES,
  ACTIVE_GALLERY_CATEGORIES,
  countGalleryPhotosByAmenity,
  countGalleryPhotosByCategory,
  filterGalleryPhotos,
  orderGalleryPhotos,
} from "@/lib/gallery-search"
import type { GalleryAmenity } from "@/lib/gallery-photos"

/** Browse order is a pure function of the manifest, so it is computed once. */
const ORDERED_PHOTOS = orderGalleryPhotos(GALLERY_PHOTOS)

/**
 * Photos rendered before the first "load more". Enough to fill a large desktop
 * screen twice over, small enough that a phone on cellular is not asked to lay
 * out 225 images to show the first row.
 */
const INITIAL_VISIBLE = 36
const LOAD_MORE_STEP = 36

export function GalleryBrowser() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<GalleryCategory | "all">("all")
  const [amenity, setAmenity] = useState<GalleryAmenity | "all">("all")
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  // True once an IntersectionObserver is watching the end of the grid. While it
  // is, a "load more" button would be unreachable — scrolling far enough to tap
  // it is exactly what loads the next page and pushes it out from under the
  // finger — so the button is only offered when auto-loading is unavailable.
  const [autoLoads, setAutoLoads] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const deferredQuery = useDeferredValue(query)

  const filtered = useMemo(
    () => filterGalleryPhotos(ORDERED_PHOTOS, { query: deferredQuery, category, amenity }),
    [amenity, category, deferredQuery],
  )
  const categoryCounts = useMemo(
    () => countGalleryPhotosByCategory(ORDERED_PHOTOS, deferredQuery),
    [deferredQuery],
  )
  const amenityCounts = useMemo(
    () => countGalleryPhotosByAmenity(ORDERED_PHOTOS, deferredQuery),
    [deferredQuery],
  )

  // Any change to the filter puts the grid back at the top of a fresh result
  // set; keeping a grown count would dump the user deep into a list they have
  // not scrolled.
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE)
  }, [amenity, category, deferredQuery])

  useEffect(() => {
    if (category !== "pool") setAmenity("all")
  }, [category])

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])
  const hasMore = visible.length < filtered.length

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

  const hasFilters = query.trim().length > 0 || category !== "all" || amenity !== "all"
  const resetFilters = () => {
    setQuery("")
    setCategory("all")
    setAmenity("all")
  }

  // The lightbox only ever receives the photos already on screen, so swiping
  // stays in step with what the visitor has actually browsed and the dialog
  // never mounts the entire library.
  const lightboxImages = useMemo(
    () => visible.map((photo) => ({ src: photo.src, alt: photo.alt, caption: photo.alt })),
    [visible],
  )

  return (
    <div className="space-y-8" data-testid="gallery-browser">
      {/* Pinned directly under the site header. The header shrinks on scroll,
          so the offset tracks its live height instead of a fixed number - a
          few pixels of drift here shows a sliver of scrolling photo above the
          bar. */}
      <div className="sticky top-[var(--site-header-height)] z-30 -mx-4 space-y-4 border-b border-border/60 bg-background/92 px-4 py-4 backdrop-blur-xl sm:mx-0 sm:rounded-[28px] sm:border sm:px-5 sm:shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-3 rounded-[22px] border border-border/70 bg-white/90 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search bedrooms, pool, chef, sunset, snorkeling..."
            className="h-auto border-0 bg-transparent px-0 py-0 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-sm"
            aria-label="Search photos"
            data-testid="gallery-search-input"
          />
          {query ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setQuery("")}
              className="h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              aria-label="Clear search"
              data-testid="gallery-search-clear"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>

        <div
          className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 pr-14 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pr-14"
          role="group"
          aria-label="Filter photos by category"
          data-testid="gallery-category-filters"
        >
          {[{ id: "all" as const, label: "All photos" }, ...ACTIVE_GALLERY_CATEGORIES].map((entry) => {
            const count = categoryCounts.get(entry.id) ?? 0
            const isActive = category === entry.id
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => setCategory(entry.id)}
                disabled={count === 0 && !isActive}
                aria-pressed={isActive}
                data-testid={`gallery-filter-${entry.id}`}
                className={`shrink-0 snap-start rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40 ${
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border/70 bg-white/80 text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                }`}
              >
                {entry.label}
                <span className={`ml-2 tabular-nums ${isActive ? "text-background/80" : "text-muted-foreground"}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {category === "pool" && ACTIVE_GALLERY_AMENITIES.length > 0 ? (
          <div
            className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 pr-14 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pr-14"
            role="group"
            aria-label="Filter by pool amenity"
            data-testid="gallery-amenity-filters"
          >
            {[{ id: "all" as const, label: "All pool & terrace" }, ...ACTIVE_GALLERY_AMENITIES].map((entry) => {
              const count = amenityCounts.get(entry.id) ?? 0
              const isActive = amenity === entry.id
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setAmenity(entry.id)}
                  disabled={count === 0 && !isActive}
                  aria-pressed={isActive}
                  data-testid={`gallery-amenity-filter-${entry.id}`}
                  className={`shrink-0 snap-start rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40 ${
                    isActive
                      ? "border-foreground bg-foreground text-background"
                      : "border-border/60 bg-white/70 text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                  }`}
                >
                  {entry.label}
                  <span className={`ml-1.5 tabular-nums ${isActive ? "text-background/80" : "text-muted-foreground"}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        ) : null}

      </div>

      {/* Deliberately outside the sticky block: on a 390px phone the pinned bar
          has to stay short enough to leave most of the screen for photos. */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge
          variant="outline"
          className="border-border/70 bg-white/75 text-muted-foreground"
          data-testid="gallery-result-count"
        >
          {filtered.length} of {ORDERED_PHOTOS.length} photos
        </Badge>
        {hasFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="rounded-full text-muted-foreground hover:bg-white/80 hover:text-foreground"
            data-testid="gallery-reset"
          >
            Reset filters
          </Button>
        ) : null}
      </div>

      {filtered.length > 0 ? (
        <>
          {/* CSS columns give a true masonry layout that keeps every photo at
              its own aspect ratio - nothing in this gallery is cropped. */}
          <div
            className="columns-2 gap-3 sm:columns-2 sm:gap-4 lg:columns-3 xl:columns-4"
            data-testid="gallery-grid"
          >
            {visible.map((photo, index) => {
              const blurDataURL = cloudinaryBlurDataUrl(photo.src)
              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`View photo: ${photo.alt}`}
                  data-testid="gallery-photo"
                  className="group mb-3 block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-border/60 bg-surface text-left shadow-sm shadow-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:mb-4"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
                    loading="lazy"
                    placeholder={blurDataURL ? "blur" : "empty"}
                    blurDataURL={blurDataURL}
                    className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </button>
              )
            })}
          </div>

          {hasMore ? (
            <div ref={sentinelRef} className="flex justify-center pt-2">
              {autoLoads ? (
                <p
                  className="text-sm text-muted-foreground"
                  role="status"
                  aria-live="polite"
                  data-testid="gallery-loading-more"
                >
                  Loading more photos… ({filtered.length - visible.length} left)
                </p>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={loadMore}
                  className="rounded-full px-6"
                  data-testid="gallery-load-more"
                >
                  Load more photos ({filtered.length - visible.length} left)
                </Button>
              )}
            </div>
          ) : (
            <p className="pt-2 text-center text-sm text-muted-foreground" data-testid="gallery-end">
              You&rsquo;ve reached the end of {category === "all" && !query ? "the gallery" : "these results"}.
            </p>
          )}
        </>
      ) : (
        <div
          className="rounded-[28px] border border-dashed border-border/70 bg-background/65 px-6 py-16 text-center"
          data-testid="gallery-empty"
        >
          <p className="text-lg font-medium text-foreground">No photos match that search yet.</p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Try a broader word like &ldquo;pool&rdquo;, &ldquo;bedroom&rdquo;, or &ldquo;boat&rdquo;, or clear the
            filters to browse all {ORDERED_PHOTOS.length} photos.
          </p>
          <Button type="button" variant="outline" className="mt-6 rounded-full" onClick={resetFilters}>
            Reset filters
          </Button>
        </div>
      )}

      <PhotoLightbox images={lightboxImages} openIndex={openIndex} onClose={() => setOpenIndex(null)} />
    </div>
  )
}
