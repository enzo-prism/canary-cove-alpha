"use client"

import { Info } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function NitroxPopover() {
  return (
    <Popover>
      <PopoverTrigger className="inline-flex items-center gap-1 font-semibold text-foreground underline-offset-4 hover:underline">
        Nitrox
        <Info className="h-3 w-3 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-64 text-xs text-muted-foreground">
        Optional nitrox fills are available for certified divers and are billed per tank.
      </PopoverContent>
    </Popover>
  )
}
