"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Container } from "@/components/layout/container"

export type SectionContent = {
  id: string
  label: string
  title: string
  description: string
  bullets?: string[]
  note?: string
  images?: { src: string; alt: string }[]
}

type SectionPageContentProps = {
  eyebrow: string
  title: string
  intro: string
  sections: SectionContent[]
  aside?: ReactNode
}

export function SectionPageContent({ eyebrow, title, intro, sections, aside }: SectionPageContentProps) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
      <Container className="flow flow-lg">
        <Badge variant="outline" className="w-fit flex flex-wrap items-center gap-3">
          {eyebrow}
          <span className="h-1 w-1 rounded-full bg-primary" />
          One private estate
        </Badge>

        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flow flow-md">
            <h1 className="text-display">{title}</h1>
            <p className="text-body text-foreground/80 sm:text-lg">{intro}</p>
            <div className="flex flex-wrap gap-3">
              {sections.map((section) => (
                <Button key={section.id} asChild variant="outline" size="sm" className="rounded-full">
                  <Link href={`#${section.id}`}>{section.label}</Link>
                </Button>
              ))}
            </div>
          </div>

          {aside && (
            <Card className="rounded-[28px] border border-border/70 bg-surface">
              <CardContent className="p-6">{aside}</CardContent>
            </Card>
          )}
        </div>

        <div className="flow flow-md">
          {sections.map((section) => (
            <Card key={section.id} id={section.id} className="scroll-mt-28 rounded-[28px] border border-border/70 bg-surface">
              <CardContent className="p-6 flow flow-sm">
                <Badge variant="outline" className="w-fit">
                  {section.label}
                </Badge>
                <h2 className="text-section">{section.title}</h2>
                <p className="text-body text-foreground/80">{section.description}</p>
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                        <span className="mt-2 h-1.5 w-3 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.note && <p className="text-sm text-muted-foreground">{section.note}</p>}
                {section.images && section.images.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {section.images.map((image) => (
                      <Card key={image.src} className="overflow-hidden rounded-[22px] border-border/70">
                        <CardContent className="p-0">
                          <AspectRatio ratio={4 / 3}>
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              sizes="(min-width: 1024px) 500px, (min-width: 640px) 50vw, 100vw"
                              className="object-cover"
                              priority={section.id === "overview"}
                            />
                          </AspectRatio>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
