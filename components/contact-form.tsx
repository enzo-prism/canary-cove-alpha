"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"

import { CalendarDays, Check, Mail, MapPin, MessageSquare, Waves } from "lucide-react"

import { trackFormSubmitAttempt, trackFormSubmitError, trackFormSubmitSuccess, trackLeadConversion } from "@/lib/analytics"
import { isBlank, isValidEmail } from "@/lib/booking-validation"
import { appendFormspreeOpsMetadata } from "@/lib/formspree-ops"
import { LEAD_FORM_CONFIG } from "@/lib/lead-forms"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChipOption,
  FieldLabel,
  focusStepError,
  FormStepIndicator,
  StepError,
  StepHeading,
  StepPanel,
  WizardNav,
  type WizardStepMeta,
} from "@/components/form-wizard"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const FORM_ENDPOINT = "/api/forms"
const FORM_KEY = "contact"
const MAX_MESSAGE_LENGTH = 3000

const STEPS: WizardStepMeta[] = [
  { id: "message", label: "Message", icon: MessageSquare },
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
  const [visitedCount, setVisitedCount] = useState(1)
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [stepError, setStepError] = useState<string | null>(null)
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set())
  const [sentSummary, setSentSummary] = useState({ topic: "", email: "" })
  const headingRefs = useRef<Array<HTMLHeadingElement | null>>([])
  const successHeadingRef = useRef<HTMLHeadingElement | null>(null)

  useEffect(() => {
    if (status === "success") {
      successHeadingRef.current?.focus({ preventScroll: true })
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
    requestAnimationFrame(() => headingRefs.current[index]?.focus({ preventScroll: true }))
  }

  const goToStep = (index: number) => {
    const clamped = Math.max(0, Math.min(index, STEPS.length - 1))
    setStepError(null)
    setInvalidFields(new Set())
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
        failStep("Please tell us what's on your mind before continuing.", ["message"])
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

  const fieldClassName = "min-h-12 rounded-2xl border-border/80 bg-background/80 px-4"

  return (
    <Card className="form-shell h-fit rounded-[32px]" data-testid="contact-form-card">
      <CardContent className="space-y-6 p-6 sm:p-7">
        {status === "success" ? (
          <div className="flow flow-sm" data-testid="contact-success">
            <p className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-6 w-6" aria-hidden />
            </p>
            <h2 className="text-section text-balance outline-none" tabIndex={-1} ref={successHeadingRef}>
              Thanks for reaching out.
            </h2>
            <p className="text-body text-foreground/80">
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
            <Button type="button" variant="outline" className="w-fit" onClick={() => setStatus("idle")}>
              Send another message
            </Button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <div className="flow flow-sm">
                <h2 className="text-section text-balance">Ask about dates, logistics, or the stay itself.</h2>
                <p className="text-body max-w-xl text-foreground/80">
                  Two short steps — your question first, then where to reply.
                </p>
              </div>
              <FormStepIndicator
                steps={STEPS}
                currentIndex={stepIndex}
                visitedCount={visitedCount}
                onSelectStep={(index) => {
                  if (index < visitedCount) goToStep(index)
                }}
              />
            </div>

            <StepError id="contact-step-error" message={stepError} />

            <StepPanel stepId="contact-step-message" active={stepIndex === 0} labelledBy="contact-message-heading">
              <StepHeading
                id="contact-message-heading"
                ref={(node) => {
                  headingRefs.current[0] = node
                }}
                title="What can we help with?"
                helper="Pick a topic to focus your note — it routes your question to the right person."
              />
              <fieldset>
                <legend className="text-[15px] font-semibold text-foreground">
                  Topic <span className="font-normal text-muted-foreground">(optional)</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-2.5">
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
                <FieldLabel htmlFor="message" required>Message</FieldLabel>
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
                  className="min-h-[150px] rounded-3xl border-border/80 bg-background/80 px-4 py-3"
                  aria-required
                  aria-invalid={invalidFields.has("message") ? true : undefined}
                  aria-describedby="message-helper message-counter"
                />
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p id="message-helper" className="form-helper">
                    Helpful context: travel dates, group size, or the pace you have in mind.
                  </p>
                  <p id="message-counter" className="form-helper tabular-nums" aria-live="polite">
                    {message.length} of {MAX_MESSAGE_LENGTH} max characters
                  </p>
                </div>
              </div>
              <WizardNav onNext={handleNext} showBack={false} nextLabel="Continue" nextTestId="contact-next" />
            </StepPanel>

            <StepPanel stepId="contact-step-reply" active={stepIndex === 1} labelledBy="contact-reply-heading">
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
                    className={fieldClassName}
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
                    className={fieldClassName}
                    aria-required
                    aria-invalid={invalidFields.has("email") ? true : undefined}
                    aria-describedby={invalidFields.has("email") ? "contact-step-error" : undefined}
                  />
                </div>
              </div>
              {topic && TOPIC_LABELS[topic] ? (
                <p className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm text-muted-foreground">
                  About: <span className="font-medium text-foreground">{TOPIC_LABELS[topic]}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => goToStep(0)}
                    aria-label="Edit message"
                    className="h-auto px-2 py-0.5 text-primary"
                  >
                    Edit
                  </Button>
                </p>
              ) : null}
              {status === "error" ? (
                <p className="form-error" role="alert" aria-live="polite" data-testid="contact-error">
                  Something went wrong. Please try again or email us directly.
                </p>
              ) : null}
              <p className="form-helper max-w-md">
                If you&apos;re already ready to book, the booking page will get you to a quote faster.
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
          </form>
        )}
      </CardContent>
    </Card>
  )
}
