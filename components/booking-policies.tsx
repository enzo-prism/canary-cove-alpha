"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function BookingPolicies() {
  return (
    <section className="space-y-8">
      <div className="max-w-2xl space-y-3">
        <p className="form-kicker">Payment &amp; policies</p>
        <h2 className="text-section">Clear terms before you arrive.</h2>
        <p className="text-body">
          A 50% deposit secures the stay, the balance is due 45 business days before arrival, and written cancellations
          follow the timeline below. Nothing here is charged by sending the request above.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-surface px-5 py-5">
          <p className="form-kicker">Deposit</p>
          <p className="mt-3 text-sm font-semibold text-foreground">50% due to confirm</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-surface px-5 py-5">
          <p className="form-kicker">Final balance</p>
          <p className="mt-3 text-sm font-semibold text-foreground">45 business days before arrival</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-surface px-5 py-5">
          <p className="form-kicker">Recommended</p>
          <p className="mt-3 text-sm font-semibold text-foreground">Comprehensive travel insurance</p>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["payment", "cancellation"]} className="space-y-2">
        <AccordionItem id="payment-terms" value="payment" className="scroll-mt-[calc(var(--site-header-height)+1.5rem)] border-border/60">
          <AccordionTrigger className="text-base font-semibold text-foreground">Payment Terms</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            50% down secures the reservation. The remaining balance is due 45 business days prior to arrival or your
            special event. Any incidental amounts accrued during the stay are charged upon departure.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          id="cancellation-policy"
          value="cancellation"
          className="scroll-mt-[calc(var(--site-header-height)+1.5rem)] border-border/60"
        >
          <AccordionTrigger className="text-base font-semibold text-foreground">Cancellation Policy</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            <ul className="space-y-2 pl-4">
              <li className="list-disc">
                Cancellations must be made in writing. If a guest cancellation is made more than 60 business days
                before the scheduled guest arrival date, a full (100%) refund less a 10% administrative fee will be
                given.
              </li>
              <li className="list-disc">
                If a guest cancellation is made less than 60 business days before the scheduled guest arrival date
                but more than 45 business days before the scheduled guest arrival date 50% of the total amount
                deposited will be refunded.
              </li>
              <li className="list-disc">
                If a guest cancellation is made less than 45 business days before the scheduled guest arrival date,
                NO refund of any deposit will be given and the full deposit will be forfeited (includes early
                check-outs or no-shows).
              </li>
              <li className="list-disc">
                Note: no refunds of deposits will be given for cancellations of reservations for the dates of
                December 16th-January 7th once your reservation has been confirmed.
              </li>
              <li className="list-disc">Business days are considered any day of the week Monday to Friday.</li>
              <li className="list-disc">
                We strongly recommend full coverage travel insurance in the event of delays / cancellations, weather,
                health, family, personal issues, etc.
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}
