import Link from "next/link"
import type { CSSProperties, ReactNode } from "react"

import { Container } from "@/components/layout/container"
import { LegalToc } from "@/components/legal/legal-toc"
import { PageHero } from "@/components/page-hero"
import { CtaLink } from "@/components/ui/cta-link"

export type LegalSection = {
  id: string
  title: string
  body: ReactNode
}

type LegalDocumentProps = {
  eyebrow: string
  /** Rendered as the page's h1; wrap a word in *asterisks* for the italic accent. */
  title: string
  intro: ReactNode
  sections: LegalSection[]
  sibling: { href: string; label: string }
}

/**
 * Long-form reading layout shared by /privacy and /terms: narrow measure,
 * numbered serif section heads, and a sticky contents rail with reading
 * progress on desktop (an inline contents list on phones).
 */
export function LegalDocument({ eyebrow, title, intro, sections, sibling }: LegalDocumentProps) {
  const toc = sections.map(({ id, title: sectionTitle }) => ({ id, title: sectionTitle }))

  return (
    <>
      <PageHero
        variant="plain"
        eyebrow={eyebrow}
        title={title}
        lede={intro}
        className="pb-10 sm:pb-14 lg:pb-16"
      >
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>{sections.length} short sections</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-canary" />
          <Link href={sibling.href} className="focus-ring inline-flex min-h-11 items-center rounded-sm text-foreground">
            <span className="link-underline-static">{sibling.label}</span>
          </Link>
        </p>
      </PageHero>

      <section className="pb-24 sm:pb-32">
        <Container size="wide">
          <div className="hairline mb-12 sm:mb-16" aria-hidden="true" />
          <div className="grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-24">
            <aside className="lg:sticky lg:top-[calc(var(--site-header-height)+2.5rem)] lg:self-start">
              <div className="rounded-[var(--radius-media)] bg-sand-light p-6 ring-1 ring-inset ring-border/70 lg:rounded-none lg:bg-transparent lg:p-0 lg:ring-0">
                <LegalToc items={toc} articleId="legal-article" />
              </div>
            </aside>

            <article id="legal-article" className="max-w-[40rem]">
              {sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`${section.id}-heading`}
                  className="border-b border-border/80 py-10 first:pt-0 sm:py-14"
                >
                  <div
                    data-reveal="up"
                    className="flow flow-md"
                    style={{ "--reveal-delay": "60ms" } as CSSProperties}
                  >
                    <p className="tabular text-[11px] font-semibold tracking-[0.24em] text-lagoon">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2
                      id={`${section.id}-heading`}
                      className="font-display text-[2rem] leading-[1.02] tracking-[-0.01em] text-foreground sm:text-[2.6rem]"
                    >
                      {section.title}
                    </h2>
                    <div className="text-[1.0625rem] leading-8 text-foreground/80 text-pretty">{section.body}</div>
                  </div>
                </section>
              ))}

              <div data-reveal="up" className="flow flow-md pt-14 sm:pt-16">
                <p className="font-display text-[1.75rem] leading-tight text-foreground sm:text-[2.1rem]">
                  Questions about any of this?
                </p>
                <p className="text-body max-w-md">
                  Reach the Canary Cove team directly through the contact page.
                </p>
                <div className="pt-2">
                  <CtaLink href="/contact">Contact the team</CtaLink>
                </div>
              </div>
            </article>
          </div>
        </Container>
      </section>
    </>
  )
}
