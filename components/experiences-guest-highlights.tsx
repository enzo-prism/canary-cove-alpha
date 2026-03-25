type GuestHighlight = {
  quote: string
  author: string
  year: string
}

type ExperiencesGuestHighlightsProps = {
  highlights: readonly GuestHighlight[]
}

export function ExperiencesGuestHighlights({ highlights }: ExperiencesGuestHighlightsProps) {
  return (
    <section className="flow flow-md">
      <div className="mx-auto max-w-3xl text-center flow flow-xs">
        <p className="text-[11px] uppercase tracking-[0.34em] text-muted-foreground">From the guest book</p>
        <h2 className="text-section">Adventure highlights from guests</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {highlights.map((highlight) => (
          <article
            key={`${highlight.author}-${highlight.year}`}
            className="surface-panel relative px-6 py-7 sm:px-8"
          >
            <span className="absolute left-6 top-5 text-4xl leading-none text-primary/16 sm:left-8">“</span>
            <div className="pl-5 sm:pl-7">
              <p className="text-sm leading-7 text-foreground/88 sm:text-base">{highlight.quote}</p>
              <div className="mt-5 border-t border-border/60 pt-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{highlight.author}</p>
                <p>{highlight.year}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
