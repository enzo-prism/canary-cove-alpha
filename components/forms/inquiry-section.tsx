import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

type InquirySectionProps = {
  icon: LucideIcon
  step: string
  title: string
  description: string
  children: ReactNode
}

export function InquirySection({ icon: Icon, step, title, description, children }: InquirySectionProps) {
  return (
    <section className="grid gap-8 border-t border-border/70 pt-10 sm:gap-10 sm:pt-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="flex size-10 items-center justify-center rounded-full border border-border bg-surface">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <p className="form-kicker">{step}</p>
        </div>
        <h2 className="text-section">{title}</h2>
        <p className="max-w-sm text-body">{description}</p>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  )
}
