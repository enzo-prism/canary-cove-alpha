"use client"

import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type ChoiceCardOption<T extends string> = {
  value: T
  title: string
  description: string
  icon: LucideIcon
}

type ChoiceCardsProps<T extends string> = {
  legend: string
  name: string
  value: T | ""
  options: readonly ChoiceCardOption<T>[]
  onChange: (value: T) => void
  error?: string
  describedBy?: string
}

export function ChoiceCards<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
  error,
  describedBy,
}: ChoiceCardsProps<T>) {
  const errorId = error ? `${name}-error` : undefined

  return (
    <fieldset className="space-y-3">
      <legend className="text-[0.95rem] font-medium tracking-tight text-foreground">{legend}</legend>
      <div
        role="radiogroup"
        aria-label={legend}
        aria-invalid={error ? true : undefined}
        aria-describedby={[describedBy, errorId].filter(Boolean).join(" ") || undefined}
        className="grid gap-3 sm:grid-cols-2"
      >
        {options.map((option) => {
          const selected = value === option.value
          const Icon = option.icon

          return (
            <button
              key={option.value}
              id={`${name}-choice-${option.value}`}
              type="button"
              role="radio"
              aria-checked={selected}
              data-testid={`${name}-choice-${option.value}`}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex min-h-[7.25rem] items-start gap-4 rounded-2xl border px-4 py-4 text-left transition-colors duration-200 motion-reduce:transition-none focus-ring",
                selected
                  ? "border-foreground/70 bg-surface-elevated"
                  : "border-border bg-surface hover:border-foreground/25",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-full border",
                  selected ? "border-foreground/20 bg-background text-foreground" : "border-border bg-surface-muted text-muted-foreground",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 space-y-1">
                <span className="block text-base font-semibold text-foreground">{option.title}</span>
                <span className="block text-sm leading-6 text-muted-foreground">{option.description}</span>
              </span>
            </button>
          )
        })}
      </div>
      <input type="hidden" name={name} value={value} />
      {error ? (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}
