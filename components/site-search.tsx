"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { SEARCH_ITEMS } from "@/lib/search-index"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type SiteSearchProps = {
  className?: string
  placeholder?: string
}

export function SiteSearch({
  className,
  placeholder = "Search rates, dining, adventures, travel logistics…",
}: SiteSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  const items = useMemo(() => SEARCH_ITEMS, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (!open) {
      setQuery("")
    }
  }, [open])

  return (
    <div className={cn("w-full max-w-xl", className)}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="flex w-full items-center justify-between gap-3 rounded-2xl border-border/70 bg-white/90 px-4 py-3 text-base text-muted-foreground shadow-sm backdrop-blur hover:bg-white"
            aria-label="Open site search"
          >
            <span className="flex items-center gap-3">
              <Search className="h-5 w-5" />
              <span className="text-left">{placeholder}</span>
            </span>
            <span className="hidden items-center gap-1 rounded-full border border-border/70 bg-white/70 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:inline-flex">
              Ctrl K
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-xl gap-0 overflow-hidden p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Site search</DialogTitle>
          </DialogHeader>
          <Command loop shouldFilter>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder={placeholder}
              className="h-12 rounded-none border-b border-border/70 px-4 text-base"
              autoFocus
            />
            <CommandList className="max-h-[380px]">
              <CommandEmpty className="px-4 py-6 text-sm text-muted-foreground">
                No matches. Try “suites”, “diving”, “boat”, “chef”, or “cancellation”.
              </CommandEmpty>

              {items.map((item) => (
                <CommandItem
                  key={`${item.href}-${item.title}`}
                  value={`${item.title} ${item.section} ${(item.keywords ?? []).join(" ")}`}
                  onSelect={() => {
                    router.push(item.href)
                    setOpen(false)
                  }}
                  className="flex cursor-pointer flex-col gap-0.5 rounded-xl px-4 py-3 text-sm text-foreground outline-none aria-selected:bg-primary/10 aria-selected:text-black"
                >
                  <span className="font-medium">{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.section}</span>
                  {item.description && <span className="text-xs text-muted-foreground">{item.description}</span>}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  )
}
