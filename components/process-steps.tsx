"use client"

import { useRef, type CSSProperties } from "react"
import { motion, useScroll, useSpring } from "motion/react"

import { useMotionOk } from "@/components/motion/use-motion-ok"
import { CtaLink } from "@/components/ui/cta-link"

type ProcessStepsProps = {
  steps: readonly { title: string; description: string }[]
}

/** Inquiry-to-dock route: a canary line draws through the four steps as the section scrolls by. */
export function ProcessSteps({ steps }: ProcessStepsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const ok = useMotionOk()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] })
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  const scale = ok ? progress : 1

  return (
    <div className="flow gap-16 sm:gap-24">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
        <div className="flow flow-md">
          <p data-reveal="fade" className="eyebrow">
            How it works
          </p>
          <h2 data-reveal="up" className="text-section max-w-[14ch]">
            Four steps. <span className="italic-accent">One seamless stay.</span>
          </h2>
        </div>
        <div data-reveal="up" className="flow flow-lg">
          <p className="text-lede">
            We keep the path from first inquiry to dock arrival clear, personal, and easy to act on.
          </p>
          <div>
            <CtaLink href="/book" eventName="cta_click" eventPayload={{ location: "home_process", target: "/book" }}>
              Start with your dates
            </CtaLink>
          </div>
        </div>
      </div>

      <div ref={ref} className="relative pl-14 md:pl-0 md:pt-16">
        <div aria-hidden="true" className="absolute bottom-2 left-[19px] top-2 w-px bg-ink/15 md:bottom-auto md:left-0 md:right-0 md:top-[19px] md:h-px md:w-auto">
          <motion.div
            className="absolute inset-0 origin-top bg-canary-deep md:hidden"
            style={{ scaleY: scale }}
          />
          <motion.div
            className="absolute inset-0 hidden origin-left bg-canary-deep md:block"
            style={{ scaleX: scale }}
          />
        </div>
        <ol data-reveal="stagger" className="grid gap-10 md:grid-cols-4 md:gap-8" style={{ "--stagger-step": "120ms" } as CSSProperties}>
        {steps.map((step, index) => (
          <li key={step.title} className="relative flow flow-sm md:pr-6" style={{ "--stagger-index": index } as CSSProperties}>
            <span
              aria-hidden="true"
              className="absolute -left-14 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 bg-sand font-display text-lg text-foreground md:-top-16 md:left-0"
            >
              {index + 1}
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-lagoon">{`Step ${index + 1}`}</p>
            <h3 className="text-title">{step.title}</h3>
            <p className="text-body max-w-xs">{step.description}</p>
          </li>
        ))}
        </ol>
      </div>
    </div>
  )
}
