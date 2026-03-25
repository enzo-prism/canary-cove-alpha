"use client"

import { CalendarDays, Quote, Search, X } from "lucide-react"
import { useDeferredValue, useEffect, useMemo, useState } from "react"

import { trackReviewArchiveFilter, trackReviewNoteOpen } from "@/lib/analytics"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type TestimonialEntry = {
  quote: string
  author?: string
}

export type TestimonialGroup = {
  year: string
  entries: TestimonialEntry[]
}

type ReviewCard = TestimonialEntry & {
  id: string
  visitLabel: string
  visitDisplayLabel: string
  yearKey: string
}

type VisitGroup = {
  label: string
  displayLabel: string
  entries: ReviewCard[]
}

type ArchiveYearGroup = {
  yearKey: string
  reviewCount: number
  visitCount: number
  visits: VisitGroup[]
}

type GuestReviewsBrowserProps = {
  groups: TestimonialGroup[]
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const extractYearKey = (label: string) => {
  const match = label.match(/(\d{4})$/)
  return match?.[1] ?? label
}

const formatVisitLabel = (label: string) => {
  const match = label.match(/^(\d{1,2})\/(\d{4})$/)
  if (!match) return label

  const monthIndex = Number(match[1]) - 1
  const year = match[2]

  return MONTH_NAMES[monthIndex] ? `${MONTH_NAMES[monthIndex]} ${year}` : label
}

const buildArchiveGroups = (groups: TestimonialGroup[], query: string, selectedYear: string) => {
  const archive = new Map<string, ArchiveYearGroup>()

  groups.forEach((group) => {
    const yearKey = extractYearKey(group.year)
    if (selectedYear !== "All" && yearKey !== selectedYear) return

    const matchingEntries = group.entries
      .filter((entry) => {
        if (!query) return true
        const haystack = [entry.quote, entry.author, group.year].filter(Boolean).join(" ").toLowerCase()
        return haystack.includes(query)
      })
      .map((entry, index) => ({
        ...entry,
        id: `${group.year}-${index}`,
        visitLabel: group.year,
        visitDisplayLabel: formatVisitLabel(group.year),
        yearKey,
      }))

    if (!matchingEntries.length) return

    if (!archive.has(yearKey)) {
      archive.set(yearKey, {
        yearKey,
        reviewCount: 0,
        visitCount: 0,
        visits: [],
      })
    }

    const archiveYear = archive.get(yearKey)
    if (!archiveYear) return

    archiveYear.reviewCount += matchingEntries.length
    archiveYear.visitCount += 1
    archiveYear.visits.push({
      label: group.year,
      displayLabel: formatVisitLabel(group.year),
      entries: matchingEntries,
    })
  })

  return Array.from(archive.values())
}

export function GuestReviewsBrowser({ groups }: GuestReviewsBrowserProps) {
  const [query, setQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState("All")
  const [active, setActive] = useState<ReviewCard | null>(null)
  const [open, setOpen] = useState(false)
  const [openYears, setOpenYears] = useState<string[]>([])

  const deferredQuery = useDeferredValue(query.trim().toLowerCase())
  const yearOptions = useMemo(() => ["All", ...Array.from(new Set(groups.map((group) => extractYearKey(group.year))))], [groups])
  const archiveGroups = useMemo(
    () => buildArchiveGroups(groups, deferredQuery, selectedYear),
    [deferredQuery, groups, selectedYear],
  )

  const filteredCount = useMemo(
    () => archiveGroups.reduce((count, group) => count + group.reviewCount, 0),
    [archiveGroups],
  )

  const totalCount = useMemo(
    () => groups.reduce((count, group) => count + group.entries.length, 0),
    [groups],
  )

  const hasFilters = query.length > 0 || selectedYear !== "All"

  useEffect(() => {
    if (archiveGroups.length === 0) {
      setOpenYears([])
      return
    }

    const nextOpenYears =
      hasFilters || deferredQuery
        ? archiveGroups.map((group) => group.yearKey)
        : archiveGroups.slice(0, 1).map((group) => group.yearKey)

    setOpenYears(nextOpenYears)
  }, [archiveGroups, deferredQuery, hasFilters])

  const handleOpen = (testimonial: ReviewCard) => {
    trackReviewNoteOpen(testimonial.yearKey, testimonial.visitLabel)
    setActive(testimonial)
    setOpen(true)
  }

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
    trackReviewArchiveFilter(year)
  }

  const clearFilters = () => {
    setQuery("")
    setSelectedYear("All")
  }

  return (
    <>
      <Card
        id="guest-testimonials"
        className="scroll-mt-24 rounded-[32px] border border-border/70 bg-white/92 shadow-[0_18px_55px_rgba(15,23,42,0.08)]"
      >
        <CardContent className="space-y-8 p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Badge variant="outline" className="border-border/70 text-muted-foreground">
                Guestbook Archive
              </Badge>
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Browse every guest note
                </h2>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                  Search for a phrase, jump to a year, and open any note for the full story. The archive stays compact until
                  you choose where to dive in.
                </p>
              </div>
            </div>
            <div className="rounded-[24px] border border-border/60 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
              {filteredCount} of {totalCount} reviews visible
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(240px,0.75fr)]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search staff, scuba, snorkeling, food, family..."
                className="h-12 rounded-[20px] border-border/70 bg-background/85 pl-11 text-sm"
                aria-label="Search guest reviews"
              />
            </label>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                Browse by year
              </div>
              <Select value={selectedYear} onValueChange={handleYearChange}>
                <SelectTrigger className="h-12 rounded-[20px] border-border/70 bg-background/85 px-4 text-sm">
                  <SelectValue placeholder="Choose a year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year === "All" ? "All years" : year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasFilters ? (
            <div className="flex flex-col gap-3 rounded-[24px] border border-border/60 bg-background/65 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Focused view for {selectedYear !== "All" ? selectedYear : "all years"}
                {query ? ` matching "${query}"` : ""}.
              </p>
              <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="w-fit rounded-full">
                <X className="h-4 w-4" />
                Clear filters
              </Button>
            </div>
          ) : null}

          {archiveGroups.length > 0 ? (
            <div className="rounded-[28px] border border-border/60 bg-background/55 px-5 py-2 sm:px-6">
              <Accordion type="multiple" value={openYears} onValueChange={setOpenYears} className="divide-y divide-border/60">
                {archiveGroups.map((group) => (
                  <AccordionItem key={group.yearKey} value={group.yearKey} className="border-none">
                    <AccordionTrigger className="items-start gap-4 py-5 text-left hover:no-underline">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{group.yearKey}</h3>
                          <Badge variant="outline" className="border-border/70 text-muted-foreground">
                            {group.reviewCount} review{group.reviewCount === 1 ? "" : "s"}
                          </Badge>
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {group.visitCount} guestbook {group.visitCount === 1 ? "entry" : "entries"} preserved from this year.
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="space-y-5">
                        {group.visits.map((visit) => (
                          <section
                            key={visit.label}
                            className="space-y-4 rounded-[24px] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(249,246,239,0.95)_100%)] p-4 sm:p-5"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="space-y-1">
                                <p className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">Guestbook entry</p>
                                <h4 className="text-lg font-semibold text-foreground sm:text-xl">{visit.displayLabel}</h4>
                              </div>
                              <Badge variant="outline" className="border-border/70 text-muted-foreground">
                                {visit.entries.length} note{visit.entries.length === 1 ? "" : "s"}
                              </Badge>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                              {visit.entries.map((testimonial) => (
                                <button
                                  key={testimonial.id}
                                  type="button"
                                  onClick={() => handleOpen(testimonial)}
                                  className="group flex min-h-[220px] h-full flex-col rounded-[24px] border border-border/60 bg-white/92 p-5 text-left shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/10 hover:shadow-[0_18px_42px_rgba(15,23,42,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                                  aria-label={`Open guest review from ${testimonial.author ?? "a guest"} (${testimonial.visitLabel})`}
                                >
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Quote className="h-4 w-4" />
                                    <span className="text-[11px] uppercase tracking-[0.3em]">Guest review</span>
                                  </div>
                                  <p className="mt-4 line-clamp-5 text-[15px] leading-7 text-foreground sm:text-base">
                                    "{testimonial.quote}"
                                  </p>
                                  <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                                    <span className="text-sm font-medium leading-6 text-foreground/90">
                                      {testimonial.author ?? "Guest at Canary Cove"}
                                    </span>
                                    <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                                      Open note
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </section>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-border/70 bg-background/65 px-6 py-12 text-center">
              <p className="text-lg font-medium text-foreground">No reviews match that filter yet.</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Try a broader search, or clear the year filter to browse the full archive again.
              </p>
              <Button type="button" variant="outline" className="mt-6 rounded-full" onClick={clearFilters}>
                Reset filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          if (!nextOpen) setActive(null)
        }}
      >
        <DialogContent className="max-w-2xl rounded-[32px] border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,244,236,0.98)_100%)] p-0">
          {active ? (
            <div className="space-y-6 p-6 sm:p-8">
              <DialogHeader className="space-y-3 text-left">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-border/70 text-muted-foreground">
                    {active.visitDisplayLabel}
                  </Badge>
                  <Badge variant="outline" className="border-border/70 text-muted-foreground">
                    Guestbook note
                  </Badge>
                </div>
                <DialogTitle className="text-2xl font-semibold text-foreground">
                  {active.author ?? "Guest at Canary Cove"}
                </DialogTitle>
                <DialogDescription className="text-sm leading-6 text-muted-foreground">
                  Shared by a Canary Cove guest and preserved in the review archive.
                </DialogDescription>
              </DialogHeader>
              <p className="text-base leading-8 text-foreground sm:text-[1.05rem]">"{active.quote}"</p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
