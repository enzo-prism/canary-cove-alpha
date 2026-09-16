import type { LucideIcon } from "lucide-react"

type InquiryIntroProps = {
  kicker: string
  title: string
  lede: string
  notes?: readonly { icon: LucideIcon; label: string }[]
}

export function InquiryIntro({ kicker, title, lede, notes = [] }: InquiryIntroProps) {
  return (
    <header className="mx-auto max-w-[40rem] space-y-6 text-center sm:space-y-8">
      <p className="form-kicker">{kicker}</p>
      <div className="space-y-4">
        <h1 className="text-display text-balance">{title}</h1>
        <p className="mx-auto max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-8">{lede}</p>
      </div>
      {notes.length > 0 ? (
        <ul className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-2.5">
          {notes.map((note) => {
            const Icon = note.icon
            return (
              <li
                key={note.label}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface px-3.5 py-2 text-sm text-foreground/80"
              >
                <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                {note.label}
              </li>
            )
          })}
        </ul>
      ) : null}
    </header>
  )
}
