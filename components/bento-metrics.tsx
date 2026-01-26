import Image from "next/image"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type BentoMetricsProps = {
  title: string
  description: string
  metrics: readonly { value: string; label: string }[]
  details: readonly { title: string; items: readonly string[] }[]
  primaryImage: { src: string; alt: string }
  secondaryImage: { src: string; alt: string }
}

export function BentoMetrics({
  title,
  description,
  metrics,
  details,
  primaryImage,
  secondaryImage,
}: BentoMetricsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
      <div className="rounded-[28px] border border-border/70 bg-surface p-6 sm:p-8">
        <div className="flow flow-sm">
          <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">Performance</p>
          <h2 className="text-section">{title}</h2>
          <p className="text-body text-foreground/80">{description}</p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-border/70 px-4 py-4">
              <p className="text-lg font-semibold text-foreground">{metric.value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">{metric.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Accordion type="single" collapsible>
            {details.map((detail) => (
              <AccordionItem key={detail.title} value={detail.title}>
                <AccordionTrigger className="text-sm uppercase tracking-[0.24em] text-foreground hover:no-underline">
                  {detail.title}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  <ul className="grid gap-2">
                    {detail.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      <div className="grid gap-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-surface-muted">
          <Image src={primaryImage.src} alt={primaryImage.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-surface-muted">
          <Image src={secondaryImage.src} alt={secondaryImage.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        </div>
      </div>
    </div>
  )
}
