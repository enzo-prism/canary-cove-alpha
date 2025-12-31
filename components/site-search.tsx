"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowUpRight, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { trackEvent } from "@/lib/analytics"
import { POPULAR_QUESTIONS, RECOMMENDED_CHIPS } from "@/lib/search/search-index"
import { getAskUsAnswer, runSearch } from "@/lib/search/search"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

type SiteSearchProps = {
  className?: string
  placeholder?: string
}

type SearchSource = "input" | "chip" | "question" | null

export function SiteSearch({
  className,
  placeholder = "Search rates, dining, adventures, travel logistics…",
}: SiteSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const dialogId = "site-search-dialog"
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl K")
  const [searchSource, setSearchSource] = useState<SearchSource>(null)

  const searchOutput = useMemo(
    () =>
      runSearch(query, {
        allowFallback: searchSource === "chip" || searchSource === "question",
      }),
    [query, searchSource],
  )

  const { answer, groups } = searchOutput

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (!open) {
      setQuery("")
      setSearchSource(null)
    }
  }, [open])

  useEffect(() => {
    if (open) {
      trackEvent("search_open")
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    if (!query.trim()) return
    const handle = window.setTimeout(() => {
      trackEvent("search_query_change", { query: query.trim() })
    }, 300)
    return () => window.clearTimeout(handle)
  }, [open, query])

  useEffect(() => {
    if (typeof navigator === "undefined") return
    const isApple = /Mac|iPhone|iPad|iPod/.test(navigator.platform)
    setShortcutLabel(isApple ? "⌘ K" : "Ctrl K")
  }, [])

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
  }

  const handleChipClick = (label: string, chipQuery: string) => {
    setQuery(chipQuery)
    setSearchSource("chip")
    trackEvent("search_chip_click", { label })
  }

  const handleQuestionClick = (question: string, questionQuery: string) => {
    setQuery(questionQuery)
    setSearchSource("question")
    trackEvent("search_question_click", { question })
  }

  const handleResultSelect = (id: string, href: string) => {
    trackEvent("search_result_click", { id, href })
    router.push(href)
    setOpen(false)
  }

  const fallbackAnswer = getAskUsAnswer()

  return (
    <div className={cn("w-full max-w-xl", className)}>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild aria-controls={dialogId}>
          <Button
            type="button"
            variant="outline"
            className="flex w-full items-center justify-between gap-3 rounded-2xl border-border/70 bg-white/90 px-4 py-3 text-base text-muted-foreground shadow-sm backdrop-blur hover:bg-white"
            aria-label="Open site search"
            data-testid="search-open-button"
          >
            <span className="flex items-center gap-3">
              <Search className="h-5 w-5" />
              <span className="text-left">{placeholder}</span>
            </span>
            <span className="hidden items-center gap-1 rounded-full border border-border/70 bg-white/70 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:inline-flex">
              {shortcutLabel}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent
          id={dialogId}
          className="max-w-2xl gap-0 overflow-hidden p-0"
          data-testid="search-modal"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Site search</DialogTitle>
          </DialogHeader>
          <Command loop shouldFilter={false}>
            <CommandInput
              value={query}
              onValueChange={(value) => {
                setQuery(value)
                setSearchSource("input")
              }}
              placeholder={placeholder}
              className="h-12 rounded-none border-b border-border/70 px-4 text-base"
              autoFocus
              data-testid="search-input"
              aria-label="Search Canary Cove"
            />
            {query.trim().length === 0 ? (
              <>
                <div
                  className="space-y-3 border-b border-border/70 px-4 py-4"
                  data-testid="search-empty"
                >
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Recommended searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {RECOMMENDED_CHIPS.map((chip) => (
                        <Button
                          key={chip.label}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-full border-border/70 bg-white/90 text-foreground hover:bg-white"
                          onClick={() => handleChipClick(chip.label, chip.query)}
                          data-testid="search-chip"
                        >
                          {chip.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <CommandList className="max-h-[360px]">
                  <CommandGroup
                    heading="Popular questions"
                    data-testid="search-group"
                  >
                    {POPULAR_QUESTIONS.map((question) => (
                      <CommandItem
                        key={question.question}
                        value={question.question}
                        onSelect={() => handleQuestionClick(question.question, question.query)}
                        className="mx-1 my-1 cursor-pointer rounded-xl border border-border/70 bg-white/90 px-4 py-3 text-sm text-foreground shadow-sm shadow-black/5 aria-selected:bg-primary/10 aria-selected:text-black"
                        data-testid="search-question"
                      >
                        {question.question}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </>
            ) : (
              <CommandList className="max-h-[420px]">
                {answer ? (
                  <div className="px-4 pb-3 pt-4" data-testid="search-answer">
                    <Card className="rounded-2xl border border-border/70 bg-white/90 shadow-sm">
                      <CardContent className="space-y-3 p-4">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
                          <span>Instant answer</span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-base font-semibold text-foreground">{answer.title}</p>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {answer.bullets.map((bullet) => (
                              <li key={bullet} className="flex gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70" aria-hidden="true" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {answer.links.map((link) => (
                            <Button
                              key={link.href}
                              asChild
                              variant="outline"
                              size="sm"
                              className="rounded-full"
                            >
                              <a href={link.href}>
                                {link.label}
                                <ArrowUpRight className="h-3 w-3" />
                              </a>
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
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
                            onSelect={() => handleResultSelect(item.id, item.href)}
                            className="flex cursor-pointer flex-col gap-1 rounded-xl px-4 py-3 text-sm text-foreground outline-none aria-selected:bg-primary/10 aria-selected:text-black"
                            data-testid="search-item"
                          >
                            <span className="font-medium">{item.title}</span>
                            <span className="text-xs text-muted-foreground">{item.group}</span>
                            {item.description ? (
                              <span className="text-xs text-muted-foreground">{item.description}</span>
                            ) : null}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </>
                ) : (
                  <div className="space-y-4 px-4 py-6" data-testid="search-no-results">
                    <div className="space-y-1 text-center">
                      <p className="text-sm font-semibold text-foreground">No results</p>
                      <p className="text-xs text-muted-foreground">
                        Try searching for rates, chef, airport transfers, or cancellation policy.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {RECOMMENDED_CHIPS.map((chip) => (
                        <Button
                          key={chip.label}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-full border-border/70 bg-white/90 text-foreground hover:bg-white"
                          onClick={() => handleChipClick(chip.label, chip.query)}
                          data-testid="search-chip"
                        >
                          {chip.label}
                        </Button>
                      ))}
                    </div>
                    <Card className="rounded-2xl border border-border/70 bg-white/90 shadow-sm">
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
                              <a href={link.href}>
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
            )}
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  )
}
