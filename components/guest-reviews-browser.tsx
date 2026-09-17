"use client"

import { useMemo, useRef, useState } from "react"
import { RotateCcw, Search } from "lucide-react"

import { trackReviewArchiveFilter, trackReviewNoteOpen } from "@/lib/analytics"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Highlight } from "@/components/search-highlight"

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
  const noteOpenerRef = useRef<HTMLElement | null>(null)

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
            entries: visit.entries.filter((_, entryIndex) =>
              visibleIds.has(`${visit.yearKey}-${visit.monthKey}-${entryIndex}`),
            ),
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

  return (
    <div className="flow flow-md scroll-mt-24" id="guest-testimonials">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-section text-[1.7rem] text-foreground sm:text-[2.1rem]">
          Every note, newest first.
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor="reviews-search" className="sr-only">
            Search guest notes
          </label>
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="reviews-search"
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              placeholder="Search staff, food, reef days…"
              className="h-12 w-full rounded-full border border-border/70 bg-white/92 pl-11 pr-4 text-sm text-foreground shadow-sm shadow-black/5 outline-none transition-colors placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>
          <label htmlFor="reviews-year" className="sr-only">
            Filter by year
          </label>
          <select
            id="reviews-year"
            value={selectedYear}
            onChange={(event) => handleYearChange(event.target.value)}
            className="h-12 rounded-full border border-border/70 bg-white/92 px-4 text-sm text-foreground shadow-sm shadow-black/5 outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <option value="all">All years</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
          {hasFilters
            ? `${reviewCount} matching note${reviewCount === 1 ? "" : "s"} · ${visitCount} visit${visitCount === 1 ? "" : "s"}`
            : `${totalNotes} notes · ${totalVisits} visits`}
        </p>
        {hasFilters ? (
          <span className="flex items-center gap-2">
            {themeWords && themeLabel ? (
              <span className="inline-flex h-9 items-center gap-2 rounded-full border border-primary/40 bg-white px-3 text-xs font-medium text-foreground">
                Theme: {themeLabel}
                <button
                  type="button"
                  onClick={() => onClearTheme?.()}
                  aria-label={`Clear ${themeLabel} theme filter`}
                  className="inline-flex size-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                >
                  ×
                </button>
              </span>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-9 gap-1.5 rounded-full text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3.5" />
              Reset filters
            </Button>
          </span>
        ) : null}
      </div>

      {hasFilters ? (
        filteredReviews.length > 0 ? (
          <ol className="border-t border-border/60">
            {filteredReviews.map((review) => (
              <li key={review.id} className="border-b border-border/60">
                <button
                  type="button"
                  onClick={() => handleNoteOpen(review)}
                  aria-label={`Open note from ${review.author}`}
                  className="group flex w-full items-baseline gap-4 px-1 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span className="w-14 shrink-0 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {review.yearKey}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.95rem] text-foreground/85">
                      <Highlight text={`“${review.quote}”`} tokens={highlightWords} />
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {review.author} · {review.visitLabel}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-sm font-medium text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-foreground"
                  >
                    →
                  </span>
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <div className="rounded-[24px] border border-border/60 bg-white/80 px-6 py-10 text-center">
            <p className="text-base font-semibold text-foreground">No notes match these filters</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different word — “reef”, “chef”, “kids” — or reset the filters.
            </p>
            <Button type="button" variant="outline" size="sm" onClick={handleReset} className="mt-4 rounded-full">
              Reset filters
            </Button>
          </div>
        )
      ) : (
        <Accordion type="multiple" defaultValue={years.length > 0 ? [years[0].yearKey] : []} className="flow flow-sm">
          {filteredYears.map((year) => (
            <AccordionItem
              key={year.yearKey}
              value={year.yearKey}
              id={`year-${year.yearKey}`}
              className="scroll-mt-28 rounded-[24px] border border-border/60 bg-white/80 px-5 sm:px-6"
            >
              <AccordionTrigger className="py-5 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&[data-state=open]>svg]:rotate-180">
                <span className="flex flex-1 items-baseline gap-3 text-left">
                  <span className="text-lg font-semibold tracking-tight text-foreground">{year.label}</span>
                  {(() => {
                    const notes = year.visits.reduce((count, visit) => count + visit.entries.length, 0)
                    const visits = year.visits.length
                    return (
                      <span className="text-xs text-muted-foreground">
                        {notes} note{notes === 1 ? "" : "s"} · {visits} visit{visits === 1 ? "" : "s"}
                      </span>
                    )
                  })()}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="flow flow-md">
                  {year.visits.map((visit) => {
                    const visitId = `visit-${visit.yearKey}-${visit.monthKey}`
                    return (
                      <section key={visit.monthKey} aria-labelledby={visitId} className="flow flow-xs">
                        <h3 id={visitId} className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                          {visit.label}
                        </h3>
                        <ol className="border-t border-border/55">
                          {visit.entries.map((entry, entryIndex) => {
                            const reviewId = `${visit.yearKey}-${visit.monthKey}-${entryIndex}`
                            return (
                              <li key={reviewId} className="border-b border-border/55">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleNoteOpen({
                                      id: reviewId,
                                      quote: entry.quote,
                                      author: entry.author ?? "Guest at Canary Cove",
                                      visitLabel: visit.label,
                                      yearKey: visit.yearKey,
                                    })
                                  }
                                  aria-label={`Open note from ${entry.author ?? "a Canary Cove guest"}`}
                                  className="group flex w-full items-baseline gap-4 px-1 py-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                                >
                                  <span className="min-w-0 flex-1 truncate text-[0.95rem] text-foreground/85">
                                    <Highlight text={`“${entry.quote}”`} tokens={highlightWords} />
                                  </span>
                                  <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                                    {entry.author ?? "Guest at Canary Cove"}
                                  </span>
                                  <span
                                    aria-hidden="true"
                                    className="shrink-0 text-sm font-medium text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-foreground"
                                  >
                                    →
                                  </span>
                                </button>
                              </li>
                            )
                          })}
                        </ol>
                      </section>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <Dialog open={openNote !== null} onOpenChange={(nextOpen) => !nextOpen && setOpenNoteId(null)}>
        <DialogContent
          className="max-h-[85dvh] overflow-y-auto rounded-[28px]"
          onCloseAutoFocus={handleNoteCloseAutoFocus}
        >
          {openNote ? (
            <>
              <DialogHeader className="text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    {openNote.visitLabel}
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
                  Note from {openNote.author}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Shared in the Canary Cove guestbook.
                </DialogDescription>
              </DialogHeader>
              <p className="text-[1.02rem] leading-8 text-foreground/90">“{openNote.quote}”</p>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
