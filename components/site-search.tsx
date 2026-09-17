"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowUpRight, Check, Clock, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { trackSearchOpen, trackSearchRefine, trackSearchResultClick } from "@/lib/analytics"
import { POPULAR_QUESTIONS, RECOMMENDED_CHIPS } from "@/lib/search/search-index"
import { readRecentSearches, recordRecentSearch, removeRecentSearch } from "@/lib/search/recent-searches"
import { findSuggestion, getAskUsAnswer, runSearch } from "@/lib/search/search"
import { Highlight } from "@/components/search-highlight"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

type SiteSearchProps = {
  className?: string
  placeholder?: string
  variant?: "default" | "header"
  hideTrigger?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type SearchSource = "input" | "chip" | "question" | null

export function SiteSearch({
  className,
  placeholder = "Search rates, dining, adventures, travel logistics...",
  variant = "default",
  hideTrigger = false,
  open: openProp,
  onOpenChange,
}: SiteSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = openProp ?? uncontrolledOpen
  const setOpen = onOpenChange ?? setUncontrolledOpen
  const dialogId = "site-search-dialog"
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl K")
  const [searchSource, setSearchSource] = useState<SearchSource>(null)
  const [recents, setRecents] = useState<string[]>([])

  const searchOutput = useMemo(
    () =>
      runSearch(query, {
        allowFallback: searchSource === "chip" || searchSource === "question",
      }),
    [query, searchSource],
  )

  const { answer, groups, totalResults } = searchOutput
  const trimmedQuery = query.trim()
  const highlightTokens = useMemo(() => trimmedQuery.split(/\s+/).filter(Boolean), [trimmedQuery])
  const visibleCount = useMemo(
    () => groups.reduce((count, group) => count + group.items.length, 0),
    [groups],
  )
  const suggestion = useMemo(
    () => (trimmedQuery.length > 0 && totalResults === 0 ? findSuggestion(trimmedQuery) : null),
    [trimmedQuery, totalResults],
  )

  useEffect(() => {
    if (hideTrigger) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [hideTrigger, setOpen])

  useEffect(() => {
    if (!open) {
      setQuery("")
      setSearchSource(null)
    } else {
      setRecents(readRecentSearches())
      trackSearchOpen()
    }
  }, [open])

  useEffect(() => {
    if (typeof navigator === "undefined") return
    const isApple = /Mac|iPhone|iPad|iPod/.test(navigator.platform)
    setShortcutLabel(isApple ? "Cmd K" : "Ctrl K")
  }, [])

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
  }

  const handleChipClick = (_label: string, chipQuery: string) => {
    setQuery(chipQuery)
    setSearchSource("chip")
    trackSearchRefine("chip", chipQuery)
  }

  const handleQuestionClick = (_question: string, questionQuery: string) => {
    setQuery(questionQuery)
    setSearchSource("question")
    trackSearchRefine("question", questionQuery)
  }

  const handleRecentClick = (recentQuery: string) => {
    setQuery(recentQuery)
    setSearchSource("input")
  }

  const handleRecentRemove = (recentQuery: string) => {
    removeRecentSearch(recentQuery)
    setRecents(readRecentSearches())
  }

  const handleResultSelect = (group: string, href: string) => {
    trackSearchResultClick(group, href)
    if (trimmedQuery.length >= 3) {
      recordRecentSearch(trimmedQuery)
    }
    router.push(href)
    setOpen(false)
  }

  const handleAnswerLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    group: string,
    href: string,
  ) => {
    // Plain click: client-side navigation. Middle-click / cmd-click keeps the
    // href behavior (new tab) since those don't fire onClick the same way.
    if (!event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) {
      event.preventDefault()
      handleResultSelect(group, href)
      return
    }
    trackSearchResultClick(group, href)
    setOpen(false)
  }

  const fallbackAnswer = getAskUsAnswer()

  return (
    <div className={cn(variant === "header" ? "contents" : "w-full max-w-xl", className)}>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {hideTrigger ? null : (
        <DialogTrigger asChild aria-controls={dialogId}>
          <Button
            type="button"
            variant="outline"
            className="flex min-h-11 w-full items-center justify-between gap-3 rounded-full border-border bg-transparent px-4 py-3 text-base text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
            aria-label="Open site search"
            data-testid="search-open-button"
          >
            <span className="flex min-w-0 items-center gap-3">
              <Search className="h-5 w-5 shrink-0" />
              <span className="truncate text-left">{placeholder}</span>
            </span>
            <span className="hidden items-center gap-1 rounded-full border border-border px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:inline-flex">
              {shortcutLabel}
            </span>
          </Button>
        </DialogTrigger>
        )}
        <DialogContent
          id={dialogId}
          className="gap-0 overflow-hidden rounded-[28px] border-border/60 bg-surface p-0 shadow-[0_26px_75px_rgba(15,23,42,0.12)] duration-150 max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:top-auto max-sm:max-h-[92dvh] max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-[28px] max-sm:duration-200 max-sm:data-[state=open]:slide-in-from-bottom max-sm:data-[state=open]:slide-in-from-left-0 sm:max-w-2xl motion-reduce:animate-none"
          data-testid="search-modal"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Site search</DialogTitle>
            <DialogDescription>Search the Canary Cove site for rates, logistics, dining, and adventure details.</DialogDescription>
          </DialogHeader>
          <Command loop shouldFilter={false}>
            <div className="flex items-center gap-3 border-b border-border/70 py-1 pl-4 pr-12">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <CommandInput
                value={query}
                onValueChange={(value) => {
                  setQuery(value)
                  setSearchSource("input")
                }}
                placeholder={placeholder}
                className="h-13 flex-1 rounded-none border-0 px-0 text-base focus-visible:ring-0"
                autoFocus
                data-testid="search-input"
                aria-label="Search Canary Cove"
                enterKeyHint="search"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="hidden rounded-sm text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:block"
              >
                esc
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-full px-2 py-2 text-sm font-medium text-foreground sm:hidden"
              >
                Cancel
              </button>
            </div>
            {trimmedQuery.length === 0 ? (
              <>
                <div
                  className="space-y-4 border-b border-border/70 px-4 py-4"
                  data-testid="search-empty"
                >
                  <div className="space-y-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                      Recommended searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {RECOMMENDED_CHIPS.map((chip) => (
                        <Button
                          key={chip.label}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="min-h-11 rounded-full border-border text-foreground hover:bg-surface-muted hover:text-foreground"
                          onClick={() => handleChipClick(chip.label, chip.query)}
                          data-testid="search-chip"
                        >
                          {chip.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  {recents.length > 0 ? (
                    <div className="space-y-1" data-testid="search-recent">
                      <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        Recent
                      </p>
                      <div className="divide-y divide-border/50">
                        {recents.map((recent) => (
                          <div key={recent} className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleRecentClick(recent)}
                              data-testid="search-recent-item"
                              className="flex min-h-11 flex-1 items-center rounded-lg px-2 text-left text-sm text-foreground/80 transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                            >
                              <span className="truncate">{recent}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRecentRemove(recent)}
                              aria-label={`Remove recent search ${recent}`}
                              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
                <CommandList className="max-h-[50dvh] overscroll-contain sm:max-h-[360px]">
                  <CommandGroup
                    heading="Popular questions"
                    data-testid="search-group"
                  >
                    {POPULAR_QUESTIONS.map((question) => (
                      <CommandItem
                        key={question.question}
                        value={question.question}
                        onSelect={() => handleQuestionClick(question.question, question.query)}
                        className="mx-2 flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-3 text-sm text-foreground outline-none aria-selected:bg-surface-muted"
                        data-testid="search-question"
                      >
                        <span>{question.question}</span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </>
            ) : (
              <>
                <CommandList className="max-h-[50dvh] overscroll-contain sm:max-h-[420px]">
                  {answer ? (
                    <div className="px-4 pb-2 pt-4" data-testid="search-answer">
                      <div className="rounded-[20px] border border-border/60 bg-white/80 p-4">
                        <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          Instant answer
                        </p>
                        <p className="mt-2.5 text-base font-semibold text-foreground">{answer.title}</p>
                        <ul className="mt-2 space-y-1.5 text-sm leading-6 text-foreground/75">
                          {answer.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-2.5">
                              <span aria-hidden="true" className="text-muted-foreground">
                                –
                              </span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                          {answer.links.map((link) => (
                            <a
                              key={link.href}
                              href={link.href}
                              onClick={(event) => handleAnswerLinkClick(event, "instant_answer", link.href)}
                              className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                            >
                              {link.label}
                              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {groups.length > 0 ? (
                    <>
                      {groups.map((group) => (
                        <CommandGroup
                          key={group.group}
                          heading={group.group}
                          data-testid="search-group"
                        >
                          {group.items.map((item) => (
                            <CommandItem
                              key={item.id}
                              value={`${item.title} ${item.description ?? ""} ${item.keywords.join(" ")}`}
                              onSelect={() => handleResultSelect(group.group, item.href)}
                              aria-label={`${item.title}, ${item.group}`}
                              className="relative mx-2 flex min-h-12 cursor-pointer flex-col gap-0.5 rounded-xl px-3 py-3 text-sm outline-none aria-selected:bg-surface-muted aria-selected:before:absolute aria-selected:before:inset-y-2 aria-selected:before:left-0 aria-selected:before:w-[2px] aria-selected:before:bg-primary"
                              data-testid="search-item"
                            >
                              <span className="flex items-center gap-2">
                                <span className="rounded-full border border-border/60 px-1.5 py-px text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                  {item.type}
                                </span>
                                <span className="truncate font-medium text-foreground">
                                  <Highlight text={item.title} tokens={highlightTokens} />
                                </span>
                              </span>
                              {item.description ? (
                                <span className="line-clamp-1 pl-0 text-xs text-muted-foreground">
                                  <Highlight text={item.description} tokens={highlightTokens} />
                                </span>
                              ) : null}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))}
                    </>
                  ) : (
                    <div className="space-y-4 px-4 py-6" data-testid="search-no-results">
                      <div className="space-y-1 text-center">
                        <p className="text-sm font-semibold text-foreground">No matches for “{trimmedQuery}”</p>
                        <p className="text-xs text-muted-foreground">
                          Try searching for rates, chef, airport transfers, or cancellation policy.
                        </p>
                      </div>
                      {suggestion ? (
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setQuery(suggestion)
                              setSearchSource("input")
                            }}
                            data-testid="search-suggestion"
                            className="rounded-full border border-border/70 bg-white/90 px-4 py-2 text-sm text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-ring"
                          >
                            Did you mean “{suggestion}”?
                          </button>
                        </div>
                      ) : null}
                      <div className="flex flex-wrap justify-center gap-2">
                        {RECOMMENDED_CHIPS.map((chip) => (
                          <Button
                            key={chip.label}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="min-h-11 rounded-full border-border/70 bg-white/90 text-foreground hover:bg-white"
                            onClick={() => handleChipClick(chip.label, chip.query)}
                            data-testid="search-chip"
                          >
                            {chip.label}
                          </Button>
                        ))}
                      </div>
                      <Card className="rounded-2xl border border-border/70 bg-background">
                        <CardContent className="space-y-3 p-4 text-center">
                          <p className="text-sm font-semibold text-foreground">{fallbackAnswer.title}</p>
                          <p className="text-xs text-muted-foreground">{fallbackAnswer.bullets[0]}</p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {fallbackAnswer.links.map((link) => (
                              <Button
                                key={link.href}
                                asChild
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                              >
                                <a
                                  href={link.href}
                                  onClick={(event) => handleAnswerLinkClick(event, "fallback_answer", link.href)}
                                >
                                  {link.label}
                                  <ArrowUpRight className="h-3 w-3" />
                                </a>
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CommandList>
                <div className="flex items-center justify-between gap-3 border-t border-border/60 px-4 py-2.5">
                  <p role="status" className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {totalResults === 0
                      ? "No results"
                      : visibleCount === totalResults
                        ? `${totalResults} result${totalResults === 1 ? "" : "s"}`
                        : `Showing ${visibleCount} of ${totalResults}`}
                  </p>
                  <p className="hidden items-center gap-3 text-[11px] text-muted-foreground sm:flex" aria-hidden="true">
                    <span>↑↓ navigate</span>
                    <span>↵ open</span>
                    <span>esc close</span>
                  </p>
                </div>
              </>
            )}
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  )
}
