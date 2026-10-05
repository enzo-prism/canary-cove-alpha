"use client"

import { Info } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function NitroxPopover() {
  return (
    <Popover>
      <PopoverTrigger className="focus-ring inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-medium text-foreground transition-colors hover:border-ink/40 data-[state=open]:border-ink data-[state=open]:bg-ink data-[state=open]:text-sand-light">
        Nitrox
        <Info aria-hidden="true" className="size-3.5 opacity-70" />
      </PopoverTrigger>
      <PopoverContent className="w-64 rounded-2xl border-border/80 bg-surface p-4 text-[13px] leading-relaxed text-muted-foreground shadow-[var(--shadow-soft)]">
        Optional nitrox fills are available for certified divers and are billed per tank.
      </PopoverContent>
    </Popover>
  )
}
