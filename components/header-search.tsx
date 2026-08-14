"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"

const SiteSearch = dynamic(() => import("@/components/site-search").then((module) => module.SiteSearch), {
  ssr: false,
})

export function HeaderSearch() {
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)

  const openSearch = () => {
    setReady(true)
    setOpen(true)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        openSearch()
      }
    }
    const handleCustomOpen = () => openSearch()

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("canary-cove:open-search", handleCustomOpen)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("canary-cove:open-search", handleCustomOpen)
    }
  }, [])

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Open site search"
        data-testid="search-open-button"
        onClick={openSearch}
        className="h-11 w-11 rounded-full border border-border/70 bg-background/75 text-foreground hover:bg-foreground hover:text-background"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
      {ready ? (
        <SiteSearch variant="header" hideTrigger open={open} onOpenChange={setOpen} />
      ) : null}
    </>
  )
}
