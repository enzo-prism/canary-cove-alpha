"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { SEARCH_ITEMS } from "@/lib/search-index"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

type SiteSearchProps = {
  className?: string
  placeholder?: string
}

export function SiteSearch({
  className,
  placeholder = "Search rates, dining, adventures, travel logistics…",
}: SiteSearchProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  const items = useMemo(() => SEARCH_ITEMS, [])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-xl", className)}>
      <Command
        loop
        shouldFilter
        className="w-full"
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false)
        }}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-white/90 px-4 py-3 shadow-sm backdrop-blur focus-within:ring-2 focus-within:ring-primary/30">
          <Search className="h-5 w-5 text-muted-foreground" />
          <CommandInput
            value={query}
            onFocus={() => setOpen(true)}
            onValueChange={(value) => {
              setQuery(value)
              setOpen(true)
            }}
            placeholder={placeholder}
            className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {open && (
          <CommandList className="absolute z-20 mt-2 max-h-[380px] w-full overflow-auto rounded-2xl border border-border/70 bg-white/95 p-2 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur">
            <CommandEmpty className="px-3 py-6 text-sm text-muted-foreground">
              No matches. Try “suites”, “diving”, “boat”, “chef”, or “cancellation”.
            </CommandEmpty>

            {items.map((item) => (
              <CommandItem
                key={`${item.href}-${item.title}`}
                value={`${item.title} ${item.section} ${(item.keywords ?? []).join(" ")}`}
                onSelect={() => {
                  router.push(item.href)
                  setOpen(false)
                  setQuery("")
                }}
                className="flex cursor-pointer flex-col gap-0.5 rounded-xl px-3 py-2 text-sm text-foreground outline-none aria-selected:bg-primary/10 aria-selected:text-primary"
              >
                <span className="font-medium">{item.title}</span>
                <span className="text-xs text-muted-foreground">{item.section}</span>
                {item.description && <span className="text-xs text-muted-foreground">{item.description}</span>}
              </CommandItem>
            ))}
          </CommandList>
        )}
      </Command>
    </div>
  )
}
