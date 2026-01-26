"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function FacebookLink() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href="https://www.facebook.com/CanaryCove/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Canary Cove on Facebook"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Facebook
          </a>
        </TooltipTrigger>
        <TooltipContent className="text-xs">Follow Canary Cove on Facebook</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
