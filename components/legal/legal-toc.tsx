"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type LegalTocProps = {
  items: { id: string; title: string }[]
  articleId: string
}

/**
 * Sticky contents list for the legal pages: highlights the section being read
 * and fills a hairline with reading progress through the document.
 */
export function LegalToc({ items, articleId }: LegalTocProps) {
  const [active, setActive] = useState<string | null>(null)
  const fillRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const article = document.getElementById(articleId)
    const fill = fillRef.current
    if (!article || !fill) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = article.getBoundingClientRect()
      const anchor = window.innerHeight * 0.5
      const progress = Math.min(1, Math.max(0, (anchor - rect.top) / Math.max(1, rect.height)))
      fill.style.transform = `scaleY(${progress})`
      // Current section: the last one whose top has passed 35% of the screen.
      let current: string | null = null
      for (const item of items) {
        const section = document.getElementById(item.id)
        if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.35) current = item.id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [articleId, items])

  return (
    <nav aria-label="Contents" className="relative pl-5">
      <span aria-hidden="true" className="absolute bottom-1 left-0 top-1 w-px bg-border" />
      <span
        ref={fillRef}
        aria-hidden="true"
        className="absolute bottom-1 left-0 top-1 w-px origin-top bg-lagoon"
        style={{ transform: "scaleY(0)" }}
      />
      <p className="eyebrow eyebrow-plain mb-5">Contents</p>
      <ol className="flow gap-1">
        {items.map((item, index) => {
          const current = active === item.id
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "focus-ring group flex min-h-11 items-center gap-3 rounded-sm py-1.5 text-[15px] transition-colors duration-500",
                  current ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "tabular text-[11px] font-semibold tracking-[0.16em] transition-colors duration-500",
                    current ? "text-lagoon" : "text-muted-foreground",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "transition-transform duration-500 ease-[var(--ease-out-expo)]",
                    current ? "translate-x-1" : "group-hover:translate-x-0.5",
                  )}
                >
                  {item.title}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
