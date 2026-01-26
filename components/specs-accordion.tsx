import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type SpecGroup = {
  title: string
  items: readonly string[]
}

type SpecsAccordionProps = {
  groups: readonly SpecGroup[]
}

export function SpecsAccordion({ groups }: SpecsAccordionProps) {
  return (
    <div className="flow flow-md">
      <div className="flow flow-xs">
        <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">Tech specs</p>
        <h2 className="text-section">Every detail accounted for.</h2>
        <p className="text-body text-foreground/80">
          Clean, scannable details so you know what is included before you book.
        </p>
      </div>
      <div className="rounded-[28px] border border-border/70 bg-surface px-6 py-2 sm:px-8">
        <Accordion type="multiple" className="divide-y divide-border/60">
          {groups.map((group) => (
            <AccordionItem key={group.title} value={group.title} className="border-none">
              <AccordionTrigger className="text-sm uppercase tracking-[0.24em] text-foreground hover:no-underline">
                {group.title}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <ul className="grid gap-2 pb-4 sm:grid-cols-2">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
