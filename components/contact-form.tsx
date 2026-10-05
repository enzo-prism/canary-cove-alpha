"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"

import { ArrowRight, CalendarDays, Mail, MapPin, MessageSquare, RotateCcw, Waves } from "lucide-react"

import { trackFormSubmitAttempt, trackFormSubmitError, trackFormSubmitSuccess, trackLeadConversion } from "@/lib/analytics"
import { isBlank, isValidEmail } from "@/lib/booking-validation"
import { appendFormspreeOpsMetadata } from "@/lib/formspree-ops"
import { LEAD_FORM_CONFIG } from "@/lib/lead-forms"
import {
  ChipOption,
  FieldLabel,
  focusStepError,
  focusStepHeading,
  keepCardInView,
  FormStepIndicator,
  StepError,
  StepHeading,
  StepPanel,
  WizardNav,
  wizardFieldClass,
  wizardTextareaClass,
  type WizardDirection,
  type WizardStepMeta,
} from "@/components/form-wizard"
import { SuccessMark } from "@/components/book/success-mark"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import styles from "@/components/book/wizard.module.css"

const FORM_ENDPOINT = "/api/forms"
const FORM_KEY = "contact"
const MAX_MESSAGE_LENGTH = 3000

const STEPS: WizardStepMeta[] = [
  { id: "message", label: "Inquiry", icon: MessageSquare },
  { id: "reply", label: "Details", icon: Mail },
]

const TOPIC_OPTIONS = [
  {
    value: "dates-pricing",
    label: "Dates & pricing",
    icon: CalendarDays,
    prompt: "My travel window is… We're a group of…",
  },
  {
    value: "getting-here",
    label: "Getting here",
    icon: MapPin,
    prompt: "We're traveling from… and wondering about…",
  },
  {
    value: "experiences",
    label: "Experiences",
    icon: Waves,
    prompt: "We're most excited about…",
  },
  {
    value: "something-else",
    label: "Something else",
    icon: MessageSquare,
    prompt: "Tell us about your dates, questions, or plans…",
  },
] as const

const TOPIC_LABELS: Record<string, string> = Object.fromEntries(TOPIC_OPTIONS.map((option) => [option.value, option.label]))

const DEFAULT_PROMPT = "Tell us about your dates, questions, or plans…"

export function ContactForm() {
  const [topic, setTopic] = useState("")
  const [message, setMessage] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState<WizardDirection>(null)
  const [visitedCount, setVisitedCount] = useState(1)
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [stepError, setStepError] = useState<string | null>(null)
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set())
  const [sentSummary, setSentSummary] = useState({ topic: "", email: "" })
  const headingRefs = useRef<Array<HTMLHeadingElement | null>>([])
  const cardRef = useRef<HTMLDivElement | null>(null)
  const successHeadingRef = useRef<HTMLHeadingElement | null>(null)

  useEffect(() => {
    if (status === "success") {
      successHeadingRef.current?.focus({ preventScroll: true })
      keepCardInView(cardRef.current)
    }
  }, [status])

  const activePrompt = TOPIC_OPTIONS.find((option) => option.value === topic)?.prompt ?? DEFAULT_PROMPT

  const clearFieldError = (field: string) => {
    if (invalidFields.has(field)) {
      setInvalidFields((current) => {
        const next = new Set(current)
        next.delete(field)
        return next
      })
    }
    setStepError(null)
  }

  const focusHeading = (index: number) => {
    requestAnimationFrame(() => focusStepHeading(headingRefs.current[index] ?? null, cardRef.current))
  }

  const goToStep = (index: number) => {
    const clamped = Math.max(0, Math.min(index, STEPS.length - 1))
    setStepError(null)
    setInvalidFields(new Set())
    if (clamped !== stepIndex) setDirection(clamped > stepIndex ? "forward" : "back")
    setStepIndex(clamped)
    setVisitedCount((current) => Math.max(current, clamped + 1))
    focusHeading(clamped)
  }

  const failStep = (errorMessage: string, fields: string[]) => {
    setStepError(errorMessage)
    setInvalidFields(new Set(fields))
    focusStepError("contact-step-error")
  }

  const validateStep = (index: number): boolean => {
    if (index === 0) {
      if (isBlank(message)) {
        failStep("Please add a short nature of inquiry before continuing.", ["message"])
        return false
      }
      return true
    }

    if (isBlank(name)) {
      failStep("Please enter your name so we know who we're replying to.", ["name"])
      return false
    }
    if (isBlank(email) || !isValidEmail(email)) {
      failStep("Please enter a valid email address so we can reply.", ["email"])
      return false
    }
    return true
  }

  const handleNext = () => {
    if (!validateStep(stepIndex)) return
    goToStep(stepIndex + 1)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "sending") return

    for (let index = 0; index < STEPS.length; index += 1) {
      if (!validateStep(index)) {
        // failStep already moved focus to the error; don't steal it back to the heading.
        setStepIndex(index)
        setVisitedCount((current) => Math.max(current, index + 1))
        return
      }
    }

    setStepError(null)
    setInvalidFields(new Set())
    trackFormSubmitAttempt(FORM_KEY)
    setStatus("sending")

    const formData = new FormData()
    if (topic !== "") formData.set("topic", topic)
    formData.set("message", message)
    formData.set("name", name)
    formData.set("email", email)
    appendFormspreeOpsMetadata(formData, FORM_KEY)

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        setSentSummary({ topic, email })
        setTopic("")
        setMessage("")
        setName("")
        setEmail("")
        setStepIndex(0)
        setDirection(null)
        setVisitedCount(1)
        setStepError(null)
        setInvalidFields(new Set())
        setStatus("success")
        trackFormSubmitSuccess(FORM_KEY)
        trackLeadConversion(FORM_KEY, LEAD_FORM_CONFIG[FORM_KEY].surface, { sendVercel: false })
        return
      }

      setStatus("error")
      trackFormSubmitError(FORM_KEY, "response")
    } catch (error) {
      setStatus("error")
      trackFormSubmitError(FORM_KEY, "network")
    }
  }

  return (
    <div
      ref={cardRef}
      className="relative h-fit overflow-hidden rounded-[28px] border border-border/70 bg-surface shadow-[var(--shadow-soft)]"
      data-testid="contact-form-card"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-canary-deep/70 to-transparent"
      />
      <div className="p-5 sm:p-8 lg:p-10">
        {status === "success" ? (
          <div className={cn(styles.popIn, "flex flex-col gap-6 py-2")} data-testid="contact-success">
            <SuccessMark />
            <div className="space-y-3">
              <h2
                className="font-display text-[2.5rem] leading-[1.02] tracking-[-0.015em] text-balance text-foreground outline-none sm:text-[3.25rem]"
                tabIndex={-1}
                ref={successHeadingRef}
              >
                Thanks for reaching out.
              </h2>
              <p className="max-w-md text-[15px] leading-7 text-muted-foreground">
                Your note is in. We respond within one business day
                {sentSummary.email ? (
                  <>
                    {" "}at <span className="font-medium text-foreground">{sentSummary.email}</span>
                  </>
                ) : null}
                {sentSummary.topic && TOPIC_LABELS[sentSummary.topic] ? (
                  <>
                    {" "}about <span className="font-medium text-foreground">{TOPIC_LABELS[sentSummary.topic]}</span>
                  </>
                ) : null}
                .
              </p>
            </div>
            <div className="flex flex-col gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center">
              <a
                href="/book"
                className="focus-ring group/next inline-flex h-14 items-center justify-between gap-4 rounded-full bg-ink pl-7 pr-2 text-[15px] font-medium text-sand-light transition-colors duration-500 hover:bg-lagoon"
              >
                Start a booking request
                <span
                  aria-hidden
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-canary text-ink"
                >
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/next:translate-x-0.5" />
                </span>
              </a>
              <button
                type="button"
                className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-medium text-foreground/75 transition-colors hover:text-foreground"
                onClick={() => setStatus("idle")}
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                Send another message
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-3">
              <p className="eyebrow eyebrow-plain">Write to us</p>
              <h2 className="font-display text-[2.25rem] leading-[1.02] tracking-[-0.015em] text-balance text-foreground sm:text-[2.75rem]">
                Ask about dates, logistics, or the <span className="italic-accent">stay</span> itself.
              </h2>
            </div>
            <FormStepIndicator
              className="mt-7"
              steps={STEPS}
              currentIndex={stepIndex}
              visitedCount={visitedCount}
              hint="Under a minute"
              onSelectStep={(index) => {
                if (index < visitedCount) goToStep(index)
              }}
            />

            <div className="mt-8 space-y-6">
              <StepError id="contact-step-error" message={stepError} />

              <StepPanel stepId="contact-step-message" active={stepIndex === 0} labelledBy="contact-message-heading" direction={direction}>
                <StepHeading
                  id="contact-message-heading"
                  ref={(node) => {
                    headingRefs.current[0] = node
                  }}
                  title="What’s on your mind?"
                  helper="A line or two on why you're reaching out. Topic chips are optional and help us route your note."
                />
                <fieldset>
                  <legend className="text-[15px] font-medium text-foreground">
                    Topic <span className="font-normal text-muted-foreground">(optional)</span>
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {TOPIC_OPTIONS.map((option) => (
                      <ChipOption
                        key={option.value}
                        id={`topic-${option.value}`}
                        name="topic"
                        value={option.value}
                        checked={topic === option.value}
                        onChange={setTopic}
                        icon={option.icon}
                        label={option.label}
                      />
                    ))}
                  </div>
                </fieldset>
                <div className="space-y-2">
                  <FieldLabel htmlFor="message" required>Nature of inquiry</FieldLabel>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    maxLength={MAX_MESSAGE_LENGTH}
                    value={message}
                    onChange={(event) => {
                      setMessage(event.target.value)
                      clearFieldError("message")
                    }}
                    autoComplete="off"
                    placeholder={activePrompt}
                    className={wizardTextareaClass}
                    aria-required
                    aria-invalid={invalidFields.has("message") ? true : undefined}
                    aria-describedby="message-helper message-counter"
                  />
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <p id="message-helper" className="form-helper">
                      Tell us the reason for this note — dates, a question, or the stay you have in mind.
                    </p>
                    <p id="message-counter" className="form-helper shrink-0 tabular-nums" aria-live="polite">
                      {message.length} of {MAX_MESSAGE_LENGTH} max characters
                    </p>
                  </div>
                </div>
                <WizardNav
                  onNext={handleNext}
                  showBack={false}
                  nextLabel="Continue"
                  nextTestId="contact-next"
                  note="We read every note directly, never a bot."
                />
              </StepPanel>

              <StepPanel stepId="contact-step-reply" active={stepIndex === 1} labelledBy="contact-reply-heading" direction={direction}>
                <StepHeading
                  id="contact-reply-heading"
                  ref={(node) => {
                    headingRefs.current[1] = node
                  }}
                  title="Where should we reply?"
                  helper="We read every note directly and respond within one business day."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="name" required>Name</FieldLabel>
                    <Input
                      id="name"
                      name="name"
                      autoComplete="name"
                      placeholder="Alex Martin…"
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value)
                        clearFieldError("name")
                      }}
                      className={wizardFieldClass}
                      aria-required
                      aria-invalid={invalidFields.has("name") ? true : undefined}
                      aria-describedby={invalidFields.has("name") ? "contact-step-error" : undefined}
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="email" required>Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      spellCheck={false}
                      inputMode="email"
                      placeholder="alex@example.com…"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value)
                        clearFieldError("email")
                      }}
                      className={wizardFieldClass}
                      aria-required
                      aria-invalid={invalidFields.has("email") ? true : undefined}
                      aria-describedby={invalidFields.has("email") ? "contact-step-error" : undefined}
                    />
                  </div>
                </div>
                <div className="rounded-[20px] bg-sand-deep/60 px-4 py-3.5 sm:px-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Your note{topic && TOPIC_LABELS[topic] ? ` · ${TOPIC_LABELS[topic]}` : ""}
                      </p>
                      <p className="line-clamp-2 text-sm leading-6 text-foreground/85">{message}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => goToStep(0)}
                      aria-label="Edit message"
                      className="focus-ring min-h-11 shrink-0 rounded-full px-3 text-[13px] font-medium text-lagoon transition-colors hover:bg-white/70"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                {status === "error" ? (
                  <p
                    className={cn(styles.nudge, "rounded-2xl border border-destructive/25 bg-destructive/[0.06] px-4 py-3 text-sm text-destructive")}
                    role="alert"
                    aria-live="polite"
                    data-testid="contact-error"
                  >
                    Something went wrong. Please try again or email us directly.
                  </p>
                ) : null}
                <p className="flex items-center gap-2 text-xs leading-5 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span>
                    Ready to book?{" "}
                    <a href="/book" className="link-underline font-medium text-lagoon">
                      The booking request
                    </a>{" "}
                    gets you to a quote faster.
                  </span>
                </p>
                <WizardNav
                  onBack={() => goToStep(0)}
                  onNext={handleNext}
                  showBack
                  nextLabel="Send message"
                  isSubmit
                  loading={status === "sending"}
                  submitTestId="contact-submit"
                />
              </StepPanel>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
