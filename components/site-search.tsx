"use client"

import { useEffect, useMemo, useState } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { useRouter } from "next/navigation"
import { ArrowUpRight, Check, Clock, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { trackSearchOpen, trackSearchRefine, trackSearchResultClick } from "@/lib/analytics"
import { POPULAR_QUESTIONS, RECOMMENDED_CHIPS } from "@/lib/search/search-index"
import { readRecentSearches, recordRecentSearch, removeRecentSearch } from "@/lib/search/recent-searches"
import { findSuggestion, getAskUsAnswer, runSearch } from "@/lib/search/search"
import { Highlight } from "@/components/search-highlight"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

/*
 * Sheet motion: a soft drop-and-settle on desktop, a slide-up sheet on phones.
 * Radix keeps the content mounted until the exit animation ends. Rows rise in
 * with a short stagger when the palette opens.
 */
const SHEET_STYLES = `
@keyframes cc-search-in { from { opacity: 0; transform: translate3d(0, -14px, 0) scale(0.975); } to { opacity: 1; transform: none; } }
@keyframes cc-search-out { to { opacity: 0; transform: translate3d(0, -8px, 0) scale(0.985); } }
@keyframes cc-search-up { from { transform: translate3d(0, 100%, 0); } to { transform: none; } }
@keyframes cc-search-down { to { transform: translate3d(0, 100%, 0); } }
@keyframes cc-search-rise { from { opacity: 0; transform: translate3d(0, 10px, 0); } to { opacity: 1; transform: none; } }
.cc-search-sheet[data-state="open"] { animation: cc-search-up 520ms cubic-bezier(0.16, 1, 0.3, 1); }
.cc-search-sheet[data-state="closed"] { animation: cc-search-down 260ms cubic-bezier(0.76, 0, 0.24, 1) forwards; }
@media (min-width: 640px) {
  .cc-search-sheet[data-state="open"] { animation: cc-search-in 460ms cubic-bezier(0.16, 1, 0.3, 1); }
  .cc-search-sheet[data-state="closed"] { animation: cc-search-out 180ms ease-in forwards; }
}
.cc-search-rise { animation: cc-search-rise 620ms cubic-bezier(0.16, 1, 0.3, 1) both; }
@media (prefers-reduced-motion: reduce) {
  .cc-search-sheet[data-state], .cc-search-rise { animation: none !important; }
}
`

/** Serif group titles; cmdk renders the heading itself. */
const GROUP_CLASS =
  "px-3 pt-4 sm:px-4 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-0 [&_[cmdk-group-heading]]:font-display [&_[cmdk-group-heading]]:text-[1.3rem] [&_[cmdk-group-heading]]:font-normal [&_[cmdk-group-heading]]:leading-tight [&_[cmdk-group-heading]]:text-foreground"

const ITEM_CLASS =
  "group/item relative flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-foreground outline-none transition-colors duration-200 aria-selected:bg-sand aria-selected:text-foreground aria-selected:before:absolute aria-selected:before:inset-y-3 aria-selected:before:left-0 aria-selected:before:w-[3px] aria-selected:before:rounded-full aria-selected:before:bg-canary"

const KBD_CLASS =
  "inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] px-1 text-[10px] font-semibold text-foreground/70 ring-1 ring-inset ring-border"

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
      <style href="cc-search-sheet" precedence="default">
        {SHEET_STYLES}
      </style>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {hideTrigger ? null : (
        <DialogTrigger asChild aria-controls={dialogId}>
          <button
            type="button"
            className="focus-ring group flex min-h-12 w-full items-center justify-between gap-3 rounded-full bg-sand-light px-5 py-3 text-base text-muted-foreground ring-1 ring-inset ring-border transition-colors duration-500 hover:text-foreground hover:ring-ink/30"
            aria-label="Open site search"
            data-testid="search-open-button"
          >
            <span className="flex min-w-0 items-center gap-3">
              <Search className="h-5 w-5 shrink-0" />
              <span className="truncate text-left">{placeholder}</span>
            </span>
            <span className="hidden items-center rounded-md px-2 py-1 text-[11px] font-medium tracking-[0.12em] text-muted-foreground ring-1 ring-inset ring-border sm:inline-flex">
              {shortcutLabel}
            </span>
          </button>
        </DialogTrigger>
        )}
        <DialogPortal>
          <DialogOverlay className="bg-ink/40 backdrop-blur-[6px] duration-300 motion-reduce:animate-none" />
          <DialogPrimitive.Content
            id={dialogId}
            data-slot="dialog-content"
            data-testid="search-modal"
            onCloseAutoFocus={(event) => {
              // HeaderSearch restores focus to its trigger with preventScroll;
              // Radix's default focus() would scroll the page on close.
              event.preventDefault()
            }}
            className="cc-search-sheet fixed inset-0 z-[90] flex h-[100dvh] flex-col overflow-hidden bg-sand-light pt-[env(safe-area-inset-top)] text-foreground shadow-[var(--shadow-lift)] outline-none ring-1 ring-ink/10 sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-[9vh] sm:h-auto sm:pt-0 sm:max-h-[min(82vh,46rem)] sm:w-[min(44rem,calc(100vw-3rem))] sm:-translate-x-1/2 sm:rounded-[28px] max-sm:pb-[env(safe-area-inset-bottom)]"
          >
            <DialogHeader className="sr-only">
              <DialogTitle>Site search</DialogTitle>
              <DialogDescription>Search the Canary Cove site for rates, logistics, dining, and adventure details.</DialogDescription>
            </DialogHeader>
            <Command loop shouldFilter={false} className="min-h-0 flex-1 rounded-none bg-transparent text-foreground">
              <div className="flex shrink-0 items-center gap-3 border-b border-border/80 py-1.5 pl-5 pr-3 sm:py-2 sm:pl-6 sm:pr-4">
                <Search className="h-[18px] w-[18px] shrink-0 text-foreground/60" aria-hidden="true" />
                <CommandInput
                  value={query}
                  onValueChange={(value) => {
                    setQuery(value)
                    setSearchSource("input")
                  }}
                  placeholder={placeholder}
                  className="h-14 flex-1 rounded-none border-0 px-0 text-[17px] text-foreground placeholder:text-muted-foreground/75 focus-visible:ring-0 sm:text-lg"
                  autoFocus
                  data-testid="search-input"
                  aria-label="Search Canary Cove"
                  enterKeyHint="search"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="focus-ring hidden h-8 items-center rounded-md px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground ring-1 ring-inset ring-border transition-colors hover:bg-ink hover:text-sand-light hover:ring-ink sm:pointer-fine:inline-flex"
                >
                  esc
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="focus-ring min-h-11 shrink-0 rounded-full px-3 text-sm font-medium text-foreground sm:pointer-fine:hidden"
                >
                  Cancel
                </button>
              </div>
              {trimmedQuery.length === 0 ? (
                <>
                  <div className="flow flow-lg shrink-0 border-b border-border/80 px-5 py-5 sm:px-6" data-testid="search-empty">
                    <div className="flow flow-sm">
                      <p className="eyebrow eyebrow-plain">Recommended searches</p>
                      <div className="flex flex-wrap gap-2">
                        {RECOMMENDED_CHIPS.map((chip, index) => (
                          <button
                            key={chip.label}
                            type="button"
                            className="cc-search-rise focus-ring inline-flex min-h-11 items-center rounded-full bg-sand px-4 text-sm font-medium text-foreground ring-1 ring-inset ring-border transition-colors duration-300 hover:bg-ink hover:text-sand-light hover:ring-ink"
                            style={{ animationDelay: `${120 + index * 60}ms` }}
                            onClick={() => handleChipClick(chip.label, chip.query)}
                            data-testid="search-chip"
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {recents.length > 0 ? (
                      <div className="flow flow-xs" data-testid="search-recent">
                        <p className="eyebrow eyebrow-plain flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          Recent
                        </p>
                        <div className="divide-y divide-border/70">
                          {recents.map((recent) => (
                            <div key={recent} className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleRecentClick(recent)}
                                data-testid="search-recent-item"
                                className="focus-ring flex min-h-11 flex-1 items-center rounded-lg px-1 text-left text-[15px] text-foreground/80 transition-colors hover:text-foreground"
                              >
                                <span className="truncate">{recent}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRecentRemove(recent)}
                                aria-label={`Remove recent search ${recent}`}
                                className="focus-ring inline-flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-ink hover:text-sand-light"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <CommandList className="min-h-0 max-h-none flex-1 overscroll-contain pb-3" data-lenis-prevent>
                    <CommandGroup heading="Popular questions" data-testid="search-group" className={GROUP_CLASS}>
                      {POPULAR_QUESTIONS.map((question, index) => (
                        <CommandItem
                          key={question.question}
                          value={question.question}
                          onSelect={() => handleQuestionClick(question.question, question.query)}
                          className={cn(ITEM_CLASS, "cc-search-rise justify-between text-[15px]")}
                          style={{ animationDelay: `${200 + Math.min(index, 8) * 35}ms` }}
                          data-testid="search-question"
                        >
                          <span>{question.question}</span>
                          <span
                            aria-hidden="true"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors group-aria-selected/item:bg-ink group-aria-selected/item:text-sand-light"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </>
              ) : (
                <>
                  <CommandList className="min-h-0 max-h-none flex-1 overscroll-contain pb-3" data-lenis-prevent>
                    {answer ? (
                      <div className="cc-search-rise px-4 pb-2 pt-4 sm:px-5" data-testid="search-answer">
                        <div className="surface-reef overflow-hidden rounded-[20px] p-5 sm:p-6">
                          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/70">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-canary text-ink">
                              <Check className="h-3 w-3" aria-hidden="true" />
                            </span>
                            Instant answer
                          </p>
                          <p className="mt-3 font-display text-[1.6rem] leading-[1.1] text-white">{answer.title}</p>
                          <ul className="mt-3 space-y-1.5 text-sm leading-6 text-white/75">
                            {answer.bullets.map((bullet) => (
                              <li key={bullet} className="flex gap-2.5">
                                <span aria-hidden="true" className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-canary" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                            {answer.links.map((link) => (
                              <a
                                key={link.href}
                                href={link.href}
                                onClick={(event) => handleAnswerLinkClick(event, "instant_answer", link.href)}
                                className="focus-ring group inline-flex min-h-9 items-center gap-1.5 rounded-sm text-sm font-medium text-canary"
                              >
                                <span className="link-underline">{link.label}</span>
                                <ArrowUpRight className="arrow-nudge arrow-nudge-diag h-3.5 w-3.5" aria-hidden="true" />
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
                            className={GROUP_CLASS}
                          >
                            {group.items.map((item) => (
                              <CommandItem
                                key={item.id}
                                value={`${item.title} ${item.description ?? ""} ${item.keywords.join(" ")}`}
                                onSelect={() => handleResultSelect(group.group, item.href)}
                                aria-label={`${item.title}, ${item.group}`}
                                className={cn(ITEM_CLASS, "min-h-12 flex-col items-stretch gap-1")}
                                data-testid="search-item"
                              >
                                <span className="flex items-center gap-2.5">
                                  <span className="shrink-0 rounded-full bg-sand-deep px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                    {item.type}
                                  </span>
                                  <span className="truncate text-[15px] font-medium text-foreground">
                                    <Highlight text={item.title} tokens={highlightTokens} />
                                  </span>
                                </span>
                                {item.description ? (
                                  <span className="line-clamp-1 text-[13px] text-muted-foreground">
                                    <Highlight text={item.description} tokens={highlightTokens} />
                                  </span>
                                ) : null}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        ))}
                      </>
                    ) : (
                      <div className="flow flow-lg px-5 py-8 sm:px-6" data-testid="search-no-results">
                        <div className="flow flow-xs text-center">
                          <p className="font-display text-[1.75rem] leading-tight text-foreground">
                            No matches for “{trimmedQuery}”
                          </p>
                          <p className="text-sm text-muted-foreground">
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
                              className="focus-ring min-h-11 rounded-full bg-canary px-5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-sand-light"
                            >
                              Did you mean “{suggestion}”?
                            </button>
                          </div>
                        ) : null}
                        <div className="flex flex-wrap justify-center gap-2">
                          {RECOMMENDED_CHIPS.map((chip) => (
                            <button
                              key={chip.label}
                              type="button"
                              className="focus-ring inline-flex min-h-11 items-center rounded-full bg-sand px-4 text-sm font-medium text-foreground ring-1 ring-inset ring-border transition-colors duration-300 hover:bg-ink hover:text-sand-light hover:ring-ink"
                              onClick={() => handleChipClick(chip.label, chip.query)}
                              data-testid="search-chip"
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>
                        <div className="flow flow-sm rounded-[20px] bg-sand p-5 text-center ring-1 ring-inset ring-border/80">
                          <p className="font-display text-[1.35rem] leading-tight text-foreground">{fallbackAnswer.title}</p>
                          <p className="text-[13px] text-muted-foreground">{fallbackAnswer.bullets[0]}</p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {fallbackAnswer.links.map((link) => (
                              <a
                                key={link.href}
                                href={link.href}
                                onClick={(event) => handleAnswerLinkClick(event, "fallback_answer", link.href)}
                                className="focus-ring group inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-medium text-sand-light transition-colors hover:bg-lagoon"
                              >
                                {link.label}
                                <ArrowUpRight className="arrow-nudge arrow-nudge-diag h-3.5 w-3.5" aria-hidden="true" />
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CommandList>
                  <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border/80 px-5 py-3 sm:px-6">
                    <p role="status" className="tabular text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {totalResults === 0
                        ? "No results"
                        : visibleCount === totalResults
                          ? `${totalResults} result${totalResults === 1 ? "" : "s"}`
                          : `Showing ${visibleCount} of ${totalResults}`}
                    </p>
                    <p className="hidden items-center gap-3 text-[11px] text-muted-foreground sm:flex" aria-hidden="true">
                      <span className="flex items-center gap-1.5"><kbd className={KBD_CLASS}>↑↓</kbd> navigate</span>
                      <span className="flex items-center gap-1.5"><kbd className={KBD_CLASS}>↵</kbd> open</span>
                      <span className="flex items-center gap-1.5"><kbd className={KBD_CLASS}>esc</kbd> close</span>
                    </p>
                  </div>
                </>
              )}
            </Command>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </div>
  )
}
