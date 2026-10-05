"use client"

import type { CSSProperties, ReactNode } from "react"

import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { Plus } from "lucide-react"

import { Container } from "@/components/layout/container"
import { SplitText } from "@/components/motion/split-text"

const LEDGER = [
  { figure: "50%", label: "Deposit", detail: "Secures your dates" },
  { figure: "45", label: "Business days", detail: "Before arrival, the balance is due" },
  { figure: "60", label: "Business days", detail: "Written notice for a refund less a 10% fee" },
] as const

const CANCELLATION_TERMS = [
  "Cancellations must be made in writing. If a guest cancellation is made more than 60 business days before the scheduled guest arrival date, a full (100%) refund less a 10% administrative fee will be given.",
  "If a guest cancellation is made less than 60 business days before the scheduled guest arrival date but more than 45 business days before the scheduled guest arrival date 50% of the total amount deposited will be refunded.",
  "If a guest cancellation is made less than 45 business days before the scheduled guest arrival date, NO refund of any deposit will be given and the full deposit will be forfeited (includes early check-outs or no-shows).",
  "Note: no refunds of deposits will be given for cancellations of reservations for the dates of December 16th-January 7th once your reservation has been confirmed.",
  "Business days are considered any day of the week Monday to Friday.",
  "We strongly recommend full coverage travel insurance in the event of delays / cancellations, weather, health, family, personal issues, etc.",
] as const

function PolicyItem({
  id,
  value,
  index,
  title,
  children,
}: {
  id: string
  value: string
  index: string
  title: string
  children: ReactNode
}) {
  return (
    <AccordionPrimitive.Item
      id={id}
      value={value}
      className="scroll-mt-[calc(var(--site-header-height)+24px)] border-t border-border/80 last:border-b"
    >
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger className="focus-ring group/acc flex min-h-11 flex-1 items-center gap-4 rounded-lg py-6 text-left sm:gap-5 sm:py-7">
          <span aria-hidden="true" className="font-display text-lg leading-none text-lagoon tabular-nums">{index}</span>
          <span className="flex-1 font-display text-[1.75rem] leading-[1.1] text-foreground sm:text-[2.125rem]">{title}</span>
          <span
            aria-hidden
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 transition-[background-color,color,border-color] duration-500 ease-[var(--ease-out-expo)] group-hover/acc:border-ink group-data-[state=open]/acc:bg-ink group-data-[state=open]/acc:text-sand-light"
          >
            <Plus className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-data-[state=open]/acc:rotate-45" />
          </span>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="pb-8 sm:pl-[2.6rem]">{children}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

/**
 * Payment and cancellation terms. Both items start open so the full text is
 * visible (and `#payment-terms` / `#cancellation-policy` deep links land on
 * readable content).
 */
export function BookingPolicies() {
  return (
    <section aria-label="Payment and policies" className="py-20 sm:py-28">
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-[calc(var(--site-header-height)+40px)] lg:self-start">
            <div className="flow flow-lg">
              <p data-reveal="fade" className="eyebrow">
                Payment &amp; policies
              </p>
              <SplitText as="h2" text="Clear terms before you *arrive.*" className="text-section max-w-[14ch] text-balance" />
              <p data-reveal="up" className="text-body max-w-md">
                The essentials are simple: a 50% deposit secures the stay, the balance is due 45 business days before
                arrival, and written cancellations follow the timeline below.
              </p>
            </div>
            <div data-reveal="stagger" className="mt-10 grid grid-cols-3 gap-4 border-t border-border/80 pt-8 sm:gap-8">
              {LEDGER.map((row, index) => (
                <div key={row.detail} className="min-w-0 space-y-2" style={{ "--stagger-index": index } as CSSProperties}>
                  <p className="font-display text-[2.5rem] leading-none text-foreground tabular-nums sm:text-[3.25rem]">{row.figure}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/80 sm:text-[11px]">{row.label}</p>
                  <p className="text-[13px] leading-5 text-muted-foreground">{row.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <AccordionPrimitive.Root type="multiple" defaultValue={["payment", "cancellation"]}>
            <PolicyItem id="payment-terms" value="payment" index="01" title="Payment Terms">
              <p className="text-body max-w-xl">
                50% down secures the reservation. The remaining balance is due 45 business days prior to arrival or your
                special event. Any incidental amounts accrued during the stay are charged upon departure.
              </p>
            </PolicyItem>
            <PolicyItem id="cancellation-policy" value="cancellation" index="02" title="Cancellation Policy">
              <ol className="ml-1.5 max-w-xl space-y-5 border-l border-border/80 pl-6">
                {CANCELLATION_TERMS.map((term) => (
                  <li key={term} className="relative text-[15px] leading-7 text-muted-foreground">
                    <span
                      aria-hidden
                      className="absolute -left-[1.79rem] top-[0.62rem] h-2 w-2 rounded-full border border-ink/40 bg-background"
                    />
                    {term}
                  </li>
                ))}
              </ol>
            </PolicyItem>
          </AccordionPrimitive.Root>
        </div>
      </Container>
    </section>
  )
}
