"use client"

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import { motion, useScroll, useSpring } from "motion/react"
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, RotateCcw, Search, X } from "lucide-react"

import { trackReviewArchiveFilter, trackReviewNoteOpen, trackSectionJump } from "@/lib/analytics"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SplitText } from "@/components/motion/split-text"
import { useMotionOk } from "@/components/motion/use-motion-ok"
import { Highlight } from "@/components/search-highlight"
import { cn } from "@/lib/utils"

export type TestimonialGroup = {
  year: string
  entries: Array<{ quote: string; author?: string }>
}

type VisitArchive = {
  label: string
  monthKey: string
  yearKey: string
  entries: Array<{ quote: string; author?: string }>
}

type YearArchive = {
  yearKey: string
  label: string
  visits: VisitArchive[]
}

type ArchivedReview = {
  id: string
  quote: string
  author: string
  visitLabel: string
  yearKey: string
}

const VISIT_LABELS: Record<string, string> = {
  "1": "January visit",
  "2": "February visit",
  "3": "March visit",
  "4": "April visit",
  "5": "May visit",
  "6": "June visit",
  "7": "July visit",
  "8": "August visit",
  "9": "September visit",
  "10": "October visit",
  "11": "November visit",
  "12": "December visit",
}

function buildReviewArchive(groups: TestimonialGroup[]): {
  years: YearArchive[]
  reviews: ArchivedReview[]
} {
  const sortedGroups = [...groups].sort((a, b) => {
    const [monthA, yearA] = a.year.split("/").map(Number)
    const [monthB, yearB] = b.year.split("/").map(Number)
    return yearB - yearA || monthB - monthA
  })

  const years: YearArchive[] = []
  const reviews: ArchivedReview[] = []

  sortedGroups.forEach((group) => {
    const [monthRaw, yearRaw] = group.year.split("/")
    const yearKey = yearRaw || group.year
    const monthKey = monthRaw || ""
    const visitLabel = `${VISIT_LABELS[monthKey] ?? "Guest visit"} ${yearKey}`

    const reviewIds = group.entries.map((_, entryIndex) => `${yearKey}-${monthKey}-${entryIndex}`)
    reviewIds.forEach((id, entryIndex) => {
      reviews.push({
        id,
        quote: group.entries[entryIndex].quote,
        author: group.entries[entryIndex].author ?? "Guest at Canary Cove",
        visitLabel,
        yearKey,
      })
    })

    let year = years.find((entry) => entry.yearKey === yearKey)
    if (!year) {
      year = { yearKey, label: yearKey, visits: [] }
      years.push(year)
    }
    year.visits.push({
      label: visitLabel,
      monthKey,
      yearKey,
      entries: group.entries,
    })
  })

  return { years, reviews }
}

function matchesQuery(review: ArchivedReview, queryWords: string[]) {
  if (queryWords.length === 0) return true
  const haystack = `${review.quote} ${review.author} ${review.visitLabel}`.toLowerCase()
  return queryWords.every((word) => haystack.includes(word))
}

export function matchesAnyWord(review: ArchivedReview, words: string[]) {
  if (words.length === 0) return false
  const haystack = `${review.quote} ${review.author} ${review.visitLabel}`.toLowerCase()
  return words.some((word) => haystack.includes(word))
}

export function countMatches(groups: TestimonialGroup[], words: string[]) {
  if (words.length === 0) return 0
  const { reviews } = buildReviewArchive(groups)
  return reviews.filter((review) => matchesAnyWord(review, words)).length
}

type GuestReviewsBrowserProps = {
  groups: TestimonialGroup[]
  query?: string
  onQueryChange?: (query: string) => void
  themeWords?: string[] | null
  themeLabel?: string | null
  onClearTheme?: () => void
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`

/** Scroll offset for year anchors: below the header and, on phones, the sticky year strip. */
const YEAR_SCROLL_MARGIN = "scroll-mt-[calc(var(--site-header-height)+4.75rem)] lg:scroll-mt-[calc(var(--site-header-height)+1.5rem)]"

export function GuestReviewsBrowser({
  groups,
  query: externalQuery,
  onQueryChange,
  themeWords = null,
  themeLabel = null,
  onClearTheme,
}: GuestReviewsBrowserProps) {
  const [internalQuery, setInternalQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState("all")
  const [openNoteId, setOpenNoteId] = useState<string | null>(null)
  const [activeYear, setActiveYear] = useState<string | null>(null)
  const noteOpenerRef = useRef<HTMLElement | null>(null)
  const ledgerRef = useRef<HTMLDivElement | null>(null)
  const stripRef = useRef<HTMLDivElement | null>(null)
  const motionOk = useMotionOk()

  const query = externalQuery ?? internalQuery
  const setQuery = onQueryChange ?? setInternalQuery
  const queryWords = useMemo(
    () => query.toLowerCase().split(/\s+/).map((word) => word.trim()).filter(Boolean),
    [query],
  )
  // Theme filters match ANY word (broad net); typed queries match ALL words.
  const highlightWords = themeWords ?? queryWords

  const { years, reviews } = useMemo(() => buildReviewArchive(groups), [groups])
  const yearOptions = useMemo(() => years.map((year) => year.yearKey), [years])

  const filteredReviews = useMemo(
    () =>
      reviews.filter((review) => {
        const matchesYear = selectedYear === "all" || review.yearKey === selectedYear
        if (!matchesYear) return false
        if (themeWords) return matchesAnyWord(review, themeWords)
        return matchesQuery(review, queryWords)
      }),
    [reviews, queryWords, selectedYear, themeWords],
  )

  const hasFilters = queryWords.length > 0 || selectedYear !== "all" || themeWords !== null

  const filteredYears = useMemo(() => {
    const visibleIds = new Set(filteredReviews.map((review) => review.id))
    return years
      .map((year) => ({
        ...year,
        visits: year.visits
          .map((visit) => ({
            ...visit,
            entries: visit.entries
              .map((entry, entryIndex) => ({ ...entry, id: `${visit.yearKey}-${visit.monthKey}-${entryIndex}` }))
              .filter((entry) => visibleIds.has(entry.id)),
          }))
          .filter((visit) => visit.entries.length > 0),
      }))
      .filter((year) => (selectedYear === "all" || year.yearKey === selectedYear) && year.visits.length > 0)
  }, [filteredReviews, selectedYear, years])

  const reviewCount = filteredReviews.length
  const visitCount = filteredYears.reduce((count, year) => count + year.visits.length, 0)
  const totalNotes = reviews.length
  const totalVisits = years.reduce((count, year) => count + year.visits.length, 0)

  const openNote = openNoteId ? (reviews.find((review) => review.id === openNoteId) ?? null) : null
  const openNoteIndex = openNote ? filteredReviews.findIndex((review) => review.id === openNote.id) : -1

  // Scroll-linked timeline: the lagoon line down the ledger fills as you read.
  const { scrollYProgress } = useScroll({ target: ledgerRef, offset: ["start 0.6", "end 0.6"] })
  const lineProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  // Scroll-spy: the last year block whose top has passed the middle of the
  // screen is "current"; none while the ledger is still below the fold.
  useEffect(() => {
    const ledger = ledgerRef.current
    if (!ledger) return
    let frame = 0
    const update = () => {
      frame = 0
      const middle = window.innerHeight * 0.5
      const sections = ledger.querySelectorAll<HTMLElement>("[data-year-section]")
      let current: string | null = null
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= middle) current = section.getAttribute("data-year-section")
      }
      const ledgerBottom = ledger.getBoundingClientRect().bottom
      setActiveYear(ledgerBottom < middle * 0.4 ? null : current)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [filteredYears])

  // Keep the current year's chip visible in the phone strip.
  useEffect(() => {
    const strip = stripRef.current
    if (!strip || !activeYear) return
    const chip = strip.querySelector<HTMLElement>(`[data-year-chip="${activeYear}"]`)
    if (!chip || strip.scrollWidth <= strip.clientWidth) return
    strip.scrollTo({ left: Math.max(0, chip.offsetLeft - 24), behavior: "smooth" })
  }, [activeYear])

  const handleQueryChange = (value: string) => {
    // Typing takes over from any theme starting point.
    if (value !== "") {
      onClearTheme?.()
    }
    setQuery(value)
  }

  const handleYearChange = (value: string) => {
    setSelectedYear(value)
    trackReviewArchiveFilter(value)
  }

  const handleReset = () => {
    setQuery("")
    setSelectedYear("all")
    onClearTheme?.()
    trackReviewArchiveFilter("all")
  }

  const handleNoteOpen = (review: ArchivedReview) => {
    // Controlled dialog without a trigger: remember the opener so focus can be restored on close.
    noteOpenerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    setOpenNoteId(review.id)
    trackReviewNoteOpen(review.yearKey, review.visitLabel)
  }

  const handleNoteCloseAutoFocus = (event: Event) => {
    if (noteOpenerRef.current) {
      event.preventDefault()
      noteOpenerRef.current.focus()
    }
  }

  const stepNote = (direction: 1 | -1) => {
    if (openNoteIndex < 0) return
    const next = filteredReviews[openNoteIndex + direction]
    if (next) setOpenNoteId(next.id)
  }

  const statusText = hasFilters
    ? `${reviewCount} matching note${reviewCount === 1 ? "" : "s"} · ${visitCount} visit${visitCount === 1 ? "" : "s"}`
    : `${totalNotes} notes · ${totalVisits} visits`

  return (
    <div className={cn("flow flow-xl", YEAR_SCROLL_MARGIN)} id="guest-testimonials">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
        <div className="flow flow-md">
          <p data-reveal="fade" className="eyebrow">
            The archive
          </p>
          <SplitText as="h2" text="Every note, *newest first.*" className="text-section max-w-[16ch]" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor="reviews-search" className="sr-only">
            Search guest notes
          </label>
          <div className="group/search relative sm:w-80">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within/search:text-foreground"
              aria-hidden="true"
            />
            <input
              id="reviews-search"
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              placeholder="Search staff, food, reef days…"
              className="h-12 w-full rounded-full bg-sand-light pl-11 pr-4 text-base text-foreground outline-none ring-1 ring-inset ring-border transition-shadow placeholder:text-muted-foreground/80 focus-visible:ring-2 focus-visible:ring-lagoon/50 sm:text-sm"
            />
          </div>
          <label htmlFor="reviews-year" className="sr-only">
            Filter by year
          </label>
          <div className="relative">
            <select
              id="reviews-year"
              value={selectedYear}
              onChange={(event) => handleYearChange(event.target.value)}
              className="h-12 w-full appearance-none rounded-full bg-sand-light pl-5 pr-11 text-sm font-medium text-foreground outline-none ring-1 ring-inset ring-border transition-shadow focus-visible:ring-2 focus-visible:ring-lagoon/50 sm:w-auto"
            >
              <option value="all">All years</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-11 flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        <p role="status" className="tabular text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          {statusText}
        </p>
        {hasFilters ? (
          <span className="flex flex-wrap items-center gap-2">
            {themeWords && themeLabel ? (
              <span className="enter-up inline-flex h-10 items-center gap-2 rounded-full bg-ink pl-4 pr-1 text-xs font-medium text-sand-light">
                Theme: {themeLabel}
                <button
                  type="button"
                  onClick={() => onClearTheme?.()}
                  aria-label={`Clear ${themeLabel} theme filter`}
                  className="focus-ring inline-flex size-8 items-center justify-center rounded-full bg-sand-light/10 transition-colors hover:bg-canary hover:text-ink"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </span>
            ) : null}
            <button
              type="button"
              onClick={handleReset}
              className="focus-ring group inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-xs font-medium text-foreground ring-1 ring-inset ring-border transition-colors duration-500 hover:bg-ink hover:text-sand-light hover:ring-ink"
            >
              <RotateCcw className="size-3.5 transition-transform duration-500 group-hover:-rotate-180" aria-hidden="true" />
              Reset filters
            </button>
          </span>
        ) : null}
      </div>

      {filteredYears.length > 0 ? (
        <>
          {/* Year index. Pinned under the header on phones, where the ledger
              runs long; a quiet row of jump links on larger screens. */}
          <nav
            aria-label="Archive years"
            className="sticky top-[var(--site-header-height)] z-20 -mx-6 border-b border-border/70 bg-sand/90 backdrop-blur-xl backdrop-saturate-150 sm:-mx-8 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:backdrop-blur-none"
          >
            <div ref={stripRef} className="no-scrollbar flex gap-1 overflow-x-auto px-6 py-2 sm:px-8 lg:flex-wrap lg:px-0 lg:py-0">
              {filteredYears.map((year) => {
                const current = activeYear === year.yearKey
                return (
                  <a
                    key={year.yearKey}
                    href={`#year-${year.yearKey}`}
                    data-year-chip={year.yearKey}
                    aria-current={current ? "location" : undefined}
                    onClick={() => trackSectionJump("reviews", `year-${year.yearKey}`)}
                    className={cn(
                      "focus-ring tabular inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors duration-500",
                      current ? "bg-ink text-sand-light" : "text-foreground/70 hover:bg-ink/[0.06] hover:text-foreground",
                    )}
                  >
                    {year.label}
                  </a>
                )
              })}
            </div>
          </nav>

          <div ref={ledgerRef} className="relative">
            {/* Timeline rail with a scroll-linked fill. */}
            <span aria-hidden="true" className="absolute bottom-0 left-[5px] top-0 w-px bg-border lg:left-[7px]" />
            <motion.span
              aria-hidden="true"
              className="absolute bottom-0 left-[5px] top-0 w-px origin-top bg-lagoon lg:left-[7px]"
              style={{ scaleY: motionOk ? lineProgress : 1 }}
            />

            {filteredYears.map((year) => {
              const notes = year.visits.reduce((count, visit) => count + visit.entries.length, 0)
              const current = activeYear === year.yearKey
              let running = 0
              return (
                <section
                  key={year.yearKey}
                  id={`year-${year.yearKey}`}
                  data-year-section={year.yearKey}
                  aria-labelledby={`year-heading-${year.yearKey}`}
                  className={cn(
                    "relative grid gap-6 pb-16 pl-8 pt-2 sm:pb-20 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-12 lg:pl-14",
                    YEAR_SCROLL_MARGIN,
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-0 top-[1.1rem] h-[11px] w-[11px] rounded-full border-2 transition-[background-color,border-color,transform] duration-700 ease-[var(--ease-out-expo)] lg:top-[1.6rem] lg:h-[15px] lg:w-[15px]",
                      current ? "scale-110 border-canary bg-canary" : "border-border bg-sand",
                    )}
                  />
                  <div className="lg:sticky lg:top-[calc(var(--site-header-height)+2rem)] lg:self-start">
                    <h3
                      id={`year-heading-${year.yearKey}`}
                      data-reveal="up"
                      className="tabular font-display text-[3.5rem] leading-[0.9] text-foreground sm:text-[4.5rem] lg:text-[6rem]"
                    >
                      {year.label}
                    </h3>
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      {plural(notes, "note")} · {plural(year.visits.length, "visit")}
                    </p>
                  </div>

                  <div className="flow flow-xl min-w-0">
                    {year.visits.map((visit) => {
                      const visitId = `visit-${visit.yearKey}-${visit.monthKey}`
                      return (
                        <div key={visit.monthKey} role="group" aria-labelledby={visitId} className="flow flow-xs">
                          <h4
                            id={visitId}
                            className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground"
                          >
                            {visit.label}
                            <span aria-hidden="true" className="h-px flex-1 bg-border/80" />
                            <span className="tabular tracking-[0.16em]">{plural(visit.entries.length, "note")}</span>
                          </h4>
                          <ol data-reveal="stagger" style={{ "--stagger-step": "60ms" } as CSSProperties}>
                            {visit.entries.map((entry, entryIndex) => {
                              running += 1
                              const author = entry.author ?? "Guest at Canary Cove"
                              return (
                                <li
                                  key={entry.id}
                                  className="border-b border-border/70"
                                  style={{ "--stagger-index": Math.min(entryIndex, 6) } as CSSProperties}
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleNoteOpen({
                                        id: entry.id,
                                        quote: entry.quote,
                                        author,
                                        visitLabel: visit.label,
                                        yearKey: visit.yearKey,
                                      })
                                    }
                                    aria-label={`Open note from ${entry.author ?? "a Canary Cove guest"}`}
                                    className="focus-ring group -mx-3 grid w-[calc(100%+1.5rem)] grid-cols-[1.75rem_minmax(0,1fr)] items-start gap-3 rounded-xl px-3 py-4 sm:py-5 text-left transition-colors duration-500 hover:bg-sand-light sm:grid-cols-[2.25rem_minmax(0,1fr)_auto] sm:gap-5"
                                  >
                                    <span className="tabular pt-[0.3rem] text-[11px] font-semibold tracking-[0.12em] text-muted-foreground">
                                      {String(running).padStart(2, "0")}
                                    </span>
                                    <span className="min-w-0">
                                      <span className="line-clamp-2 text-base leading-7 text-foreground/85 transition-colors group-hover:text-foreground sm:text-[1.0625rem]">
                                        <Highlight text={`“${entry.quote}”`} tokens={highlightWords} />
                                      </span>
                                      <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                        {author}
                                      </span>
                                    </span>
                                    <span
                                      aria-hidden="true"
                                      className="mt-0.5 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground ring-1 ring-inset ring-border sm:flex transition-[background-color,color,box-shadow] duration-500 group-hover:bg-ink group-hover:text-sand-light group-hover:ring-ink"
                                    >
                                      <ArrowUpRight className="h-4 w-4 arrow-nudge arrow-nudge-diag" />
                                    </span>
                                  </button>
                                </li>
                              )
                            })}
                          </ol>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-[var(--radius-media)] border border-dashed border-border px-6 py-16 text-center">
          <p className="font-display text-[1.9rem] leading-tight text-foreground">No notes match these filters</p>
          <p className="text-body max-w-md">
            Try a different word — “reef”, “chef”, “kids” — or reset the filters.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="focus-ring mt-3 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-sand-light transition-colors duration-500 hover:bg-lagoon"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Reset filters
          </button>
        </div>
      )}

      <Dialog open={openNote !== null} onOpenChange={(nextOpen) => !nextOpen && setOpenNoteId(null)}>
        <DialogContent
          className="max-h-[88dvh] gap-0 overflow-y-auto rounded-[28px] border-border/70 bg-sand-light p-7 shadow-[var(--shadow-lift)] sm:max-w-2xl sm:p-12 [&>button:last-child]:right-4 [&>button:last-child]:top-4 [&>button:last-child]:flex [&>button:last-child]:size-11 [&>button:last-child]:items-center [&>button:last-child]:justify-center [&>button:last-child]:rounded-full [&>button:last-child]:bg-sand-deep [&>button:last-child]:opacity-100 [&>button:last-child]:transition-colors [&>button:last-child]:hover:bg-ink [&>button:last-child]:hover:text-sand-light"
          onCloseAutoFocus={handleNoteCloseAutoFocus}
        >
          {openNote ? (
            <>
              <DialogHeader className="gap-3 pr-10 text-left">
                <p className="eyebrow">{openNote.visitLabel}</p>
                <DialogTitle className="font-display text-[2rem] font-normal leading-[1.05] tracking-[-0.01em] text-foreground sm:text-[2.5rem]">
                  Note from {openNote.author}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Shared in the Canary Cove guestbook.
                </DialogDescription>
              </DialogHeader>
              <div key={openNote.id} className="enter-up relative mt-8 border-t border-border pt-8">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-1 left-0 select-none font-display text-[5rem] leading-none text-canary"
                >
                  &ldquo;
                </span>
                <p className="pt-8 font-display text-[1.4rem] leading-[1.4] text-foreground sm:text-[1.6rem]">
                  “{openNote.quote}”
                </p>
              </div>
              {filteredReviews.length > 1 && openNoteIndex >= 0 ? (
                <div className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-5">
                  <button
                    type="button"
                    onClick={() => stepNote(-1)}
                    disabled={openNoteIndex === 0}
                    className="focus-ring group inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-foreground ring-1 ring-inset ring-border transition-colors hover:bg-ink hover:text-sand-light disabled:pointer-events-none disabled:opacity-35"
                  >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Newer
                  </button>
                  <span className="tabular text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {openNoteIndex + 1} / {filteredReviews.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => stepNote(1)}
                    disabled={openNoteIndex === filteredReviews.length - 1}
                    className="focus-ring group inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-foreground ring-1 ring-inset ring-border transition-colors hover:bg-ink hover:text-sand-light disabled:pointer-events-none disabled:opacity-35"
                  >
                    Older
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ) : null}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
