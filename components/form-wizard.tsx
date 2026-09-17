"use client"

import { forwardRef, type ReactNode } from "react"

import { ArrowRight, Check, ChevronLeft, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export type WizardStepMeta = {
  id: string
  label: string
  icon: LucideIcon
}

type StepIndicatorProps = {
  steps: WizardStepMeta[]
  currentIndex: number
  visitedCount: number
  onSelectStep: (index: number) => void
}

export function FormStepIndicator({ steps, currentIndex, visitedCount, onSelectStep }: StepIndicatorProps) {
  const progress = Math.round(((currentIndex + 1) / steps.length) * 100)

  return (
    <div className="space-y-3">
      <nav aria-label="Form progress" className="flex items-center gap-1.5 sm:gap-2">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isComplete = index < currentIndex
          const isCurrent = index === currentIndex
          const isReachable = index < visitedCount

          return (
            <div key={step.id} className="flex flex-1 items-center gap-1.5 last:flex-none sm:gap-2">
              <button
                type="button"
                onClick={() => onSelectStep(index)}
                disabled={!isReachable || isCurrent}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`${step.label}${isComplete ? " (completed)" : ""}${isCurrent ? " (current step)" : ""}`}
                title={step.label}
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors",
                  "motion-safe:transition-all motion-safe:duration-200",
                  isCurrent && "border-primary bg-primary text-primary-foreground shadow-sm",
                  isComplete && "border-primary/60 bg-primary/10 text-primary",
                  !isCurrent && !isComplete && "border-border/70 bg-background/80 text-muted-foreground",
                  isReachable && !isCurrent && "cursor-pointer hover:border-primary/50 hover:text-foreground focus-ring",
                  !isReachable && "cursor-default opacity-70",
                )}
              >
                {isComplete ? <Check className="h-4 w-4" aria-hidden /> : <Icon className="h-4 w-4" aria-hidden />}
              </button>
              {index < steps.length - 1 ? (
                <div
                  aria-hidden
                  className={cn(
                    "h-0.5 flex-1 rounded-full",
                    index < currentIndex ? "bg-primary/70" : "bg-border/70",
                  )}
                />
              ) : null}
            </div>
          )
        })}
      </nav>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-semibold text-foreground" aria-live="polite">
          Step {currentIndex + 1} of {steps.length} · {steps[currentIndex]?.label}
        </p>
        <p className="text-xs tabular-nums text-muted-foreground">{progress}%</p>
      </div>
      <div
        className="h-1 overflow-hidden rounded-full bg-border/60"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={currentIndex + 1}
        aria-label="Form progress"
      >
        <div
          className="h-full rounded-full bg-primary motion-safe:transition-[width] motion-safe:duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

type StepPanelProps = {
  stepId: string
  active: boolean
  labelledBy: string
  children: ReactNode
}

export function StepPanel({ stepId, active, labelledBy, children }: StepPanelProps) {
  return (
    <section id={stepId} hidden={!active} aria-labelledby={labelledBy} className="space-y-5">
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
    <div className="space-y-1.5">
      <h3 ref={ref} id={id} tabIndex={-1} className="text-xl font-semibold tracking-tight text-foreground outline-none">
        {title}
      </h3>
      {helper ? <p className="form-helper max-w-md">{helper}</p> : null}
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

export function OptionCard({ id, name, value, checked, onChange, icon: Icon, title, description, meta }: OptionCardProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "relative flex cursor-pointer gap-3.5 rounded-3xl border p-4 text-left",
        "motion-safe:transition-all motion-safe:duration-200 focus-ring-within",
        checked
          ? "border-primary/70 bg-primary/[0.07] shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
          : "border-border/70 bg-background/80 hover:border-primary/40 hover:bg-primary/[0.03]",
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
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border",
          checked ? "border-primary/40 bg-primary text-primary-foreground" : "border-border/70 bg-surface text-foreground",
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1 space-y-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-[15px] font-semibold leading-6 text-foreground">{title}</span>
          {checked ? (
            <span aria-hidden className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
          ) : null}
        </span>
        <span className="block text-sm leading-5 text-muted-foreground">{description}</span>
        {meta ? <span className="block text-xs font-medium leading-5 text-foreground/80">{meta}</span> : null}
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
}

export function ChipOption({ id, name, value, checked, onChange, icon: Icon, label }: ChipOptionProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium",
        "motion-safe:transition-all motion-safe:duration-200 focus-ring-within",
        checked
          ? "border-primary/70 bg-primary text-primary-foreground shadow-sm"
          : "border-border/70 bg-background/80 text-foreground hover:border-primary/40 hover:bg-primary/[0.04]",
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
      {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden /> : null}
      {label}
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
}: WizardNavProps) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
      {showBack && onBack ? (
        <Button type="button" variant="ghost" size="lg" onClick={onBack} className="w-full gap-1.5 sm:w-auto">
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Back
        </Button>
      ) : (
        <span className="hidden sm:block" />
      )}
      <Button
        type={isSubmit ? "submit" : "button"}
        size="lg"
        disabled={disabled ?? loading}
        data-testid={isSubmit ? submitTestId : nextTestId}
        className="w-full gap-2 sm:w-auto"
        onClick={isSubmit ? undefined : onNext}
      >
        {loading ? "Sending…" : nextLabel}
        {!isSubmit && !loading ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
      </Button>
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
      <Label htmlFor={htmlFor}>{children}</Label>
      {required ? (
        <span aria-hidden className="text-sm font-medium leading-none text-destructive">
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
      id={id}
      role="alert"
      tabIndex={-1}
      data-testid={testId}
      className="form-error rounded-2xl border border-destructive/30 bg-destructive/[0.06] px-4 py-3 outline-none"
    >
      {message}
    </p>
  )
}

/** Moves focus to a freshly rendered step error so SR and sighted users land on it. */
export function focusStepError(id: string) {
  requestAnimationFrame(() => {
    document.getElementById(id)?.focus({ preventScroll: false })
  })
}
