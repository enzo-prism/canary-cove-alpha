"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function FacebookLink() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <a
              href="https://www.facebook.com/CanaryCove/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Canary Cove on Facebook"
            >
              Facebook
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="text-xs">Follow Canary Cove on Facebook</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
