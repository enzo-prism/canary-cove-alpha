"use client"

import { useState } from "react"

import { countMatches, GuestReviewsBrowser, type TestimonialGroup } from "@/components/guest-reviews-browser"

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
    <div className="flow flow-lg">
      <div className="max-w-2xl flow flow-sm">
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
          Browse by theme
        </p>
        <h2 className="text-section text-[1.7rem] text-foreground sm:text-[2.1rem]">
          Fourteen years, four obsessions.
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {THEMES.map((theme) => {
          const count = countMatches(groups, [...theme.words])
          const active = themeLabel === theme.label
          return (
            <button
              key={theme.label}
              type="button"
              onClick={() => handleThemeSelect(theme.label)}
              aria-pressed={active}
              className="group rounded-[24px] border border-border/60 bg-white/80 px-5 py-5 text-left transition-colors hover:border-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-pressed:border-primary/50 aria-pressed:bg-white"
            >
              <span className="flex items-baseline justify-between gap-4">
                <span className="text-base font-semibold tracking-tight text-foreground">{theme.label}</span>
                <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {count} note{count === 1 ? "" : "s"}
                </span>
              </span>
              <span className="mt-1.5 block text-sm leading-6 text-muted-foreground">{theme.blurb}</span>
            </button>
          )
        })}
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
