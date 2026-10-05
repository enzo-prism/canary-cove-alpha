"use client"

import { useState, type CSSProperties } from "react"
import { ArrowDownRight } from "lucide-react"

import { countMatches, GuestReviewsBrowser, type TestimonialGroup } from "@/components/guest-reviews-browser"
import { SplitText } from "@/components/motion/split-text"
import { cn } from "@/lib/utils"

const THEMES = [
  {
    label: "Staff & hosting",
    words: ["staff", "gil", "mike", "crew", "sergio", "nathalie", "host"],
    blurb: "Gil, Mike, and the crew by name.",
  },
  {
    label: "Food & chef",
    words: ["food", "chef", "meal", "meals", "dining", "dinner", "lunch", "breakfast", "cook", "lava cake"],
    blurb: "Private lunches, dinners, and Lava Cake.",
  },
  {
    label: "Reef days",
    words: ["reef", "reefs", "snorkel", "scuba", "dive", "diving", "hol chan", "mexico rock", "shark", "sharks", "ray", "rays", "moray", "lobster"],
    blurb: "Sharks, rays, and Mexico Rocks.",
  },
  {
    label: "Kids & family",
    words: ["kid", "kids", "family", "children", "daughter", "son"],
    blurb: "Notes written by the kids themselves.",
  },
] as const

export function ReviewsArchive({ groups }: { groups: TestimonialGroup[] }) {
  const [query, setQuery] = useState("")
  const [themeLabel, setThemeLabel] = useState<string | null>(null)

  const activeTheme = THEMES.find((theme) => theme.label === themeLabel) ?? null

  const handleThemeSelect = (label: string) => {
    setThemeLabel((current) => (current === label ? null : label))
    setQuery("")
    const target = document.getElementById("guest-testimonials")
    if (!target) return
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" })
  }

  return (
    <div className="flex flex-col gap-24 sm:gap-32">
      <div className="flow flow-xl">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16">
          <div className="flow flow-md">
            <p data-reveal="fade" className="eyebrow">
              Browse by theme
            </p>
            <SplitText as="h2" text="Fourteen years, four *obsessions.*" className="text-section max-w-[14ch]" />
          </div>
          <p data-reveal="up" className="text-lede max-w-md lg:justify-self-end">
            Pick a thread and the archive below narrows to every note that mentions it. Pick it again to let go.
          </p>
        </div>

        <div data-reveal="stagger" className="grid border-t border-border sm:grid-cols-2">
          {THEMES.map((theme, index) => {
            const count = countMatches(groups, [...theme.words])
            const active = themeLabel === theme.label
            return (
              <button
                key={theme.label}
                type="button"
                onClick={() => handleThemeSelect(theme.label)}
                aria-pressed={active}
                style={{ "--stagger-index": index } as CSSProperties}
                className={cn(
                  "focus-ring group relative isolate flex min-h-[9.5rem] flex-col justify-between gap-6 overflow-hidden border-b border-border px-1 py-7 text-left sm:px-7 sm:py-8 sm:[&:nth-child(odd)]:border-r",
                  active ? "text-sand-light" : "text-foreground",
                )}
              >
                {/* Ink fill that wipes up behind the pressed theme. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0 -z-10 origin-bottom bg-ink transition-transform duration-700 ease-[var(--ease-out-expo)] motion-reduce:transition-none",
                    active ? "scale-y-100" : "scale-y-0",
                  )}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-20 bg-sand-light opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="flex items-center justify-between gap-4">
                  <span
                    className={cn(
                      "tabular text-[11px] font-semibold tracking-[0.24em]",
                      active ? "text-canary" : "text-muted-foreground",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors",
                      active ? "text-sand-light/70" : "text-muted-foreground",
                    )}
                  >
                    {count} note{count === 1 ? "" : "s"}
                  </span>
                </span>
                <span className="flex items-end justify-between gap-4">
                  <span className="flow flow-xs">
                    <span className="font-display text-[2rem] leading-none sm:text-[2.6rem]">{theme.label}</span>
                    <span
                      className={cn(
                        "block text-sm leading-6 transition-colors",
                        active ? "text-sand-light/70" : "text-muted-foreground",
                      )}
                    >
                      {theme.blurb}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-[background-color,color,transform] duration-500 ease-[var(--ease-out-expo)]",
                      active
                        ? "rotate-45 bg-canary text-ink"
                        : "bg-ink/[0.06] text-foreground group-hover:bg-ink group-hover:text-sand-light",
                    )}
                  >
                    <ArrowDownRight className="h-4 w-4" />
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <GuestReviewsBrowser
        groups={groups}
        query={query}
        onQueryChange={setQuery}
        themeWords={activeTheme ? [...activeTheme.words] : null}
        themeLabel={themeLabel}
        onClearTheme={() => setThemeLabel(null)}
      />
    </div>
  )
}
