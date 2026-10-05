"use client"

import { forwardRef, type ReactNode } from "react"

import { AlertCircle, ArrowRight, Check, ChevronLeft, LoaderCircle, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import styles from "@/components/book/wizard.module.css"

export type WizardStepMeta = {
  id: string
  label: string
  icon: LucideIcon
}

/** Direction of the last step change; null until the guest first moves (no entrance on page load). */
export type WizardDirection = "forward" | "back" | null

/** Shared field skin for wizard inputs (16px text on phones avoids iOS zoom). */
export const wizardFieldClass =
  "min-h-[52px] rounded-2xl border-border/90 bg-white/75 px-4 text-base shadow-[inset_0_1px_2px_rgba(13,35,39,0.05)] transition-[border-color,box-shadow,background-color] duration-300 ease-[var(--ease-out-expo)] placeholder:text-muted-foreground/60 hover:border-ink/35 focus-visible:border-lagoon focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-lagoon/15 focus-visible:ring-offset-0 aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/[0.03] sm:text-[15px]"

export const wizardTextareaClass = cn(wizardFieldClass, "min-h-[148px] resize-y py-3.5 leading-6")

type StepIndicatorProps = {
  steps: WizardStepMeta[]
  currentIndex: number
  visitedCount: number
  onSelectStep: (index: number) => void
  /** Short reassurance shown opposite the step counter. */
  hint?: string
  className?: string
}

/**
 * Segmented progress: one hairline segment per step. Completed segments fill
 * with ink, the current one with canary (plus a single sheen as it fills).
 * Visited steps stay clickable so guests can jump back.
 */
export function FormStepIndicator({ steps, currentIndex, visitedCount, onSelectStep, hint, className }: StepIndicatorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[13px] font-medium tabular-nums text-foreground" aria-live="polite">
          Step {currentIndex + 1} of {steps.length} · {steps[currentIndex]?.label}
        </p>
        {hint ? <p className="text-right text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <nav aria-label="Form progress">
        <ol className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {steps.map((step, index) => {
            const isComplete = index < currentIndex
            const isCurrent = index === currentIndex
            const isReachable = index < visitedCount

            return (
              <li key={step.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => onSelectStep(index)}
                  disabled={!isReachable || isCurrent}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`${step.label}${isComplete ? " (completed)" : ""}${isCurrent ? " (current step)" : ""}`}
                  className={cn(
                    "group/seg flex min-h-11 w-full flex-col justify-start gap-2 rounded-md pt-1 text-left outline-none",
                    "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                    isReachable && !isCurrent ? "cursor-pointer" : "cursor-default",
                  )}
                >
                  <span aria-hidden className="relative block h-[3px] w-full overflow-hidden rounded-full bg-ink/10">
                    <span
                      className={cn(
                        styles.segmentFill,
                        "absolute inset-0 rounded-full",
                        isCurrent ? "bg-canary-deep" : "bg-ink",
                        isComplete || isCurrent ? "scale-x-100" : "scale-x-0",
                        isReachable && !isCurrent && "group-hover/seg:bg-lagoon",
                      )}
                    />
                    {isCurrent ? <span key={`sheen-${currentIndex}`} className={cn(styles.segmentActive, "absolute inset-0")} /> : null}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "flex items-center gap-1 text-[11px] font-medium tracking-[0.02em] transition-colors duration-500 sm:text-xs",
                      isCurrent
                        ? "text-foreground"
                        : isComplete
                          ? "text-foreground/70 group-hover/seg:text-lagoon"
                          : "text-muted-foreground",
                    )}
                  >
                    {isComplete ? (
                      <Check className={cn(styles.checkPop, "hidden h-3 w-3 shrink-0 text-lagoon sm:block")} strokeWidth={2.5} />
                    ) : null}
                    <span className="truncate">{step.label}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}

type StepPanelProps = {
  stepId: string
  active: boolean
  labelledBy: string
  direction?: WizardDirection
  children: ReactNode
}

/**
 * One wizard step. Inactive steps unmount their fields (values live in the
 * parent's state). A newly shown step slides in from the direction of travel
 * with a CSS keyframe, so its fields are interactive immediately.
 */
export function StepPanel({ stepId, active, labelledBy, direction = null, children }: StepPanelProps) {
  return (
    <section
      id={stepId}
      hidden={!active}
      aria-labelledby={labelledBy}
      className={cn(
        "flex flex-col gap-6",
        direction === "forward" && styles.stepForward,
        direction === "back" && styles.stepBack,
        direction && styles.cascade,
      )}
    >
      {active ? children : null}
    </section>
  )
}

type StepHeadingProps = {
  id: string
  title: string
  helper?: string
}

export const StepHeading = forwardRef<HTMLHeadingElement, StepHeadingProps>(function StepHeading(
  { id, title, helper },
  ref,
) {
  return (
    <div className="space-y-2">
      <h3
        ref={ref}
        id={id}
        tabIndex={-1}
        className="font-display text-[1.75rem] leading-[1.08] tracking-[-0.01em] text-balance text-foreground outline-none sm:text-[2.125rem]"
      >
        {title}
      </h3>
      {helper ? <p className="max-w-lg text-[15px] leading-6 text-muted-foreground">{helper}</p> : null}
    </div>
  )
})

type OptionCardProps = {
  id: string
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  icon: LucideIcon
  title: string
  description: string
  meta?: string
}

/** Large tappable radio card. The title sits in its own span so it can be matched exactly. */
export function OptionCard({ id, name, value, checked, onChange, icon: Icon, title, description, meta }: OptionCardProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group/opt relative flex cursor-pointer gap-4 rounded-[22px] border p-4 text-left sm:p-5",
        "transition-[border-color,background-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] focus-ring-within",
        checked
          ? "border-ink bg-white shadow-[0_18px_44px_-18px_rgba(13,35,39,0.35)]"
          : "border-border/80 bg-white/50 hover:border-ink/40 hover:bg-white/80",
      )}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors duration-500",
          checked ? "bg-ink text-canary" : "bg-sand-deep text-foreground",
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={1.6} />
      </span>
      <span className="min-w-0 flex-1 space-y-1 pr-7">
        <span className="block text-base font-medium leading-6 text-foreground">{title}</span>
        <span className="block text-sm leading-5 text-muted-foreground">{description}</span>
        {meta ? (
          <span className="flex items-center gap-2 pt-1 text-[13px] font-medium leading-5 text-foreground/80">
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-canary-deep" />
            {meta}
          </span>
        ) : null}
      </span>
      <span
        aria-hidden
        className={cn(
          "absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border transition-colors duration-300 sm:right-5 sm:top-5",
          checked ? "border-ink bg-ink text-sand-light" : "border-border bg-white",
        )}
      >
        {checked ? <Check className={cn(styles.checkPop, "h-3.5 w-3.5")} strokeWidth={3} /> : null}
      </span>
    </label>
  )
}

type ChipOptionProps = {
  id: string
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  icon?: LucideIcon
  label: string
  className?: string
}

export function ChipOption({ id, name, value, checked, onChange, icon: Icon, label, className }: ChipOptionProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium",
        "transition-[border-color,background-color,color] duration-500 ease-[var(--ease-out-expo)] focus-ring-within",
        checked
          ? "border-ink bg-ink text-sand-light"
          : "border-border/90 bg-white/55 text-foreground hover:border-ink/45 hover:bg-white",
        className,
      )}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        onClick={(event) => {
          // Optional chip groups can be cleared by choosing the active chip again.
          if (checked) {
            event.preventDefault()
            onChange("")
          }
        }}
        className="sr-only"
      />
      {checked ? (
        <Check aria-hidden className={cn(styles.checkPop, "h-3.5 w-3.5 shrink-0 text-canary")} strokeWidth={3} />
      ) : Icon ? (
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      ) : null}
      <span>{label}</span>
    </label>
  )
}

type WizardNavProps = {
  onBack?: () => void
  onNext: () => void
  showBack: boolean
  nextLabel: string
  isSubmit?: boolean
  disabled?: boolean
  loading?: boolean
  submitTestId?: string
  nextTestId?: string
  /** Quiet note in place of the Back button (first step). */
  note?: string
}

export function WizardNav({
  onBack,
  onNext,
  showBack,
  nextLabel,
  isSubmit,
  disabled,
  loading,
  submitTestId,
  nextTestId,
  note,
}: WizardNavProps) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
      {showBack && onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="focus-ring group/back inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full px-4 text-[15px] font-medium text-foreground/75 transition-colors duration-300 hover:text-foreground sm:-ml-3 sm:justify-start"
        >
          <ChevronLeft
            className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/back:-translate-x-0.5"
            aria-hidden
          />
          Back
        </button>
      ) : note ? (
        <p className="text-center text-xs leading-5 text-muted-foreground sm:max-w-[17rem] sm:text-left">{note}</p>
      ) : (
        <span className="hidden sm:block" />
      )}
      <button
        type={isSubmit ? "submit" : "button"}
        disabled={disabled ?? loading}
        data-testid={isSubmit ? submitTestId : nextTestId}
        onClick={isSubmit ? undefined : onNext}
        className={cn(
          "group/next focus-ring relative inline-flex h-14 w-full touch-manipulation items-center justify-between gap-4 rounded-full bg-ink pl-7 pr-2 text-[15px] font-medium text-sand-light",
          "transition-[background-color] duration-500 ease-[var(--ease-out-expo)] hover:bg-lagoon",
          "disabled:cursor-progress disabled:opacity-80 sm:w-auto sm:min-w-[13.5rem]",
        )}
      >
        <span>{loading ? "Sending…" : nextLabel}</span>
        <span
          aria-hidden
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-500",
            isSubmit ? "bg-canary text-ink" : "bg-sand-light/12 text-sand-light group-hover/next:bg-canary group-hover/next:text-ink",
          )}
        >
          {loading ? (
            <LoaderCircle className="h-4 w-4 motion-safe:animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/next:translate-x-0.5" />
          )}
        </span>
      </button>
    </div>
  )
}

type FieldLabelProps = {
  htmlFor: string
  required?: boolean
  children: ReactNode
}

/** Label with the required marker kept outside the label text for exact accessible names. */
export function FieldLabel({ htmlFor, required, children }: FieldLabelProps) {
  return (
    <span className="flex items-center gap-1">
      <Label htmlFor={htmlFor} className="text-[13px] font-medium leading-5 text-foreground/85">
        {children}
      </Label>
      {required ? (
        <span aria-hidden className="text-[13px] font-medium leading-none text-canary-deep">
          *
        </span>
      ) : null}
    </span>
  )
}

type StepErrorProps = {
  id: string
  message: string | null
  testId?: string
}

export function StepError({ id, message, testId }: StepErrorProps) {
  if (!message) return null
  return (
    <p
      key={message}
      id={id}
      role="alert"
      tabIndex={-1}
      data-testid={testId}
      className={cn(
        styles.nudge,
        "flex items-start gap-3 rounded-2xl border border-destructive/25 bg-destructive/[0.06] px-4 py-3.5 text-sm leading-5 text-destructive outline-none",
      )}
    >
      <AlertCircle className="mt-px h-4 w-4 shrink-0" aria-hidden />
      <span>{message}</span>
    </p>
  )
}

/** Moves focus to a freshly rendered step error so SR and sighted users land on it. */
export function focusStepError(id: string) {
  requestAnimationFrame(() => {
    // Leave focus alone if the guest is already typing a correction: moving it
    // mid-entry would swallow keystrokes. The alert role still announces it.
    const active = document.activeElement
    if (active instanceof HTMLElement && (active.matches("input, textarea, select") || active.isContentEditable)) return
    document.getElementById(id)?.focus({ preventScroll: false })
  })
}

/**
 * After a step change the card can shrink or grow under the guest. If the
 * card's top has scrolled above the sticky header, bring it back into view so
 * the new step's heading is what they see. No-op when it is already visible.
 */
export function keepCardInView(card: HTMLElement | null) {
  if (!card) return
  const header = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--site-header-height")) || 72
  const top = card.getBoundingClientRect().top
  if (top >= header) return
  // Instant on purpose: the new step already slides in, and WebKit's smooth
  // scroll fights the sticky header's scroll listeners.
  window.scrollBy({ top: top - header - 16, behavior: "instant" })
}

/**
 * Moves focus to a new step's heading (for screen readers) unless the guest has
 * already started typing in that step: stealing focus mid-entry would drop keystrokes.
 */
export function focusStepHeading(heading: HTMLElement | null, card: HTMLElement | null) {
  const active = document.activeElement
  const typing =
    active instanceof HTMLElement &&
    card?.contains(active) &&
    (active.matches("input, textarea, select") || active.isContentEditable)
  if (!typing) heading?.focus({ preventScroll: true })
  keepCardInView(card)
}
