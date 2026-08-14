"use client"

import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type OpenSearchButtonProps = {
  className?: string
  children?: string
}

export function OpenSearchButton({ className, children = "Search the site" }: OpenSearchButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "h-12 w-full justify-start rounded-full px-4 text-muted-foreground hover:text-foreground sm:w-auto",
        className,
      )}
      onClick={() => {
        window.dispatchEvent(new Event("canary-cove:open-search"))
      }}
    >
      <Search className="h-4 w-4" />
      {children}
    </Button>
  )
}
