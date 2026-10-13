"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"

const SiteSearch = dynamic(() => import("@/components/site-search").then((module) => module.SiteSearch), {
  ssr: false,
})

export function HeaderSearch() {
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)
  const [shortcutHint, setShortcutHint] = useState("Ctrl K")
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  const openSearch = () => {
    // Preserve the keyboard shortcut or in-page entry point as well as the
    // header button. A mobile-menu opener disappears, so it uses the fallback.
    if (!document.querySelector('[data-testid="search-modal"][data-state="open"]')) {
      openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    }
    setReady(true)
    setOpen(true)
  }

  const restoreFocus = (event: Event) => {
    event.preventDefault()
    const active = document.activeElement
    // Navigation may already have focused the next page, or another dialog.
    if (active instanceof HTMLElement && active !== document.body && active.isConnected && !active.closest('[data-testid="search-modal"]')) return
    const opener = openerRef.current
    const target = opener && opener !== document.body && opener.isConnected && opener.getClientRects().length > 0
      ? opener
      : triggerRef.current
    target?.focus({ preventScroll: true })
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

  useEffect(() => {
    if (typeof navigator === "undefined") return
    const isApple = /Mac|iPhone|iPad|iPod/.test(navigator.platform)
    setShortcutHint(isApple ? "⌘K" : "Ctrl K")
  }, [])

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        ref={triggerRef}
        aria-label="Open site search"
        data-testid="search-open-button"
        onClick={openSearch}
        className="h-11 w-11 rounded-full border border-border/70 bg-background/75 text-foreground hover:bg-foreground hover:text-background lg:h-10 lg:w-auto lg:gap-2.5 lg:px-4"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden text-sm font-medium lg:inline">Search</span>
        <kbd
          aria-hidden="true"
          className="hidden h-5 items-center rounded-md border border-current/25 px-1.5 text-[11px] font-medium opacity-70 lg:inline-flex"
        >
          {shortcutHint}
        </kbd>
        <span className="sr-only">Search</span>
      </Button>
      {ready ? (
        <SiteSearch variant="header" hideTrigger open={open} onOpenChange={setOpen} onCloseAutoFocus={restoreFocus} />
      ) : null}
    </>
  )
}
