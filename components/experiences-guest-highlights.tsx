import { ChapterMark } from "@/components/explore/chapter-mark"
import { ExploreHeading } from "@/components/explore/explore-heading"
import { RISE } from "@/components/explore/reveal-classes"
import { cn } from "@/lib/utils"

type GuestHighlight = {
  quote: string
  author: string
  year: string
}

type ExperiencesGuestHighlightsProps = {
  highlights: readonly GuestHighlight[]
}

/**
 * Guest-book excerpts set as an editorial spread: oversized canary quote
 * marks, serif text, the second note offset down the page. Quote text is
 * rendered exactly as supplied (lib/testimonial-spotlights.ts).
 */
export function ExperiencesGuestHighlights({ highlights }: ExperiencesGuestHighlightsProps) {
  return (
    <section className="flow flow-xl">
      <div className="flow flow-lg">
        <ChapterMark index="05" label="From the guest book" />
        <ExploreHeading title="Adventure highlights from *guests*" />
      </div>

      <div className="grid gap-14 md:grid-cols-2 md:gap-10 lg:gap-20">
        {highlights.map((highlight, index) => (
          <figure
            key={`${highlight.author}-${highlight.year}`}
            data-reveal="group"
            className={cn("relative flow flow-lg", index % 2 === 1 && "md:mt-28")}
          >
            <span
              aria-hidden="true"
              className={cn("block h-12 font-display text-[6rem] leading-[0.9] text-canary", RISE)}
            >
              &ldquo;
            </span>
            <blockquote
              className={cn("font-display text-[1.45rem] leading-[1.35] text-foreground sm:text-[1.65rem]", RISE)}
              style={{ transitionDelay: "120ms" }}
            >
              <p>{highlight.quote}</p>
            </blockquote>
            <figcaption
              className={cn("flex items-center gap-3 border-t border-border pt-5 text-sm", RISE)}
              style={{ transitionDelay: "240ms" }}
            >
              <span className="font-medium text-foreground">{highlight.author}</span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-canary-deep" />
              <span className="text-muted-foreground tabular">{highlight.year}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
