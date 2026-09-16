import type { ReactNode } from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export const inquiryControlClassName =
  "min-h-14 w-full rounded-2xl border border-border bg-surface px-4 text-base text-foreground shadow-none placeholder:text-muted-foreground/65 focus-visible:border-foreground/30 focus-visible:ring-2 focus-visible:ring-foreground/15 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-destructive/50"

export const inquiryTextareaClassName = cn(inquiryControlClassName, "min-h-[180px] py-4")

type InquiryFieldProps = {
  id: string
  label: string
  children: ReactNode
  hint?: string
  error?: string
  optional?: boolean
  className?: string
}

export function InquiryField({ id, label, children, hint, error, optional = false, className }: InquiryFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={cn("space-y-2.5", className)}>
      <Label htmlFor={id} className="text-[0.95rem] font-medium tracking-tight text-foreground">
        {label}
        {optional ? <span className="ml-2 text-sm font-normal text-muted-foreground">Optional</span> : null}
      </Label>
      {children}
      {hint ? (
        <p id={hintId} className="form-helper">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
