"use client"

import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

type OpenSearchButtonProps = {
  className?: string
  children?: string
}

/**
 * Secondary, in-page way into the site search. It only asks the header's
 * search (the single `search-open-button`) to open, so there is still exactly
 * one search dialog and one Cmd/Ctrl+K handler on the page.
 */
export function OpenSearchButton({ className, children = "Search the site" }: OpenSearchButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "focus-ring group inline-flex h-12 w-full items-center gap-3 rounded-full bg-sand-light pl-2 pr-6 text-[15px] font-medium text-foreground ring-1 ring-inset ring-border transition-[background-color,color,box-shadow] duration-500 hover:bg-ink hover:text-sand-light hover:ring-ink sm:w-auto motion-safe:active:scale-[0.98]",
        className,
      )}
      onClick={() => {
        window.dispatchEvent(new Event("canary-cove:open-search"))
      }}
    >
      <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sand-light transition-colors duration-500 group-hover:bg-canary group-hover:text-ink"
      >
        <Search className="h-4 w-4" />
      </span>
      {children}
    </button>
  )
}
