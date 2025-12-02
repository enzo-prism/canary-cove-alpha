import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

const steps = [
  {
    title: "Clear customs & immigration",
    detail:
      "Use the Belize digital forms at https://ideclare.gov.bz/Belize_Digital_Forms/. On the form, list BELIZE as the destination country and SAN PEDRO as where you are staying.",
  },
  {
    title: "Hop on a commuter flight",
    detail:
      "After baggage claim, head to Maya Island Air or Tropic Air. Our staff books this for you. It’s a 15-minute flight to Ambergris Caye, landing in San Pedro.",
  },
  {
    title: "Meet our team in San Pedro",
    detail:
      "Our staff meets you at the San Pedro airport. The boat dock is a 10-minute walk or a 5-minute taxi ride away.",
  },
  {
    title: "Boat to Canary Cove",
    detail:
      "Board our boat for a 15-minute ride about 6 miles north to the compound. Your bags come with you; we handle the rest.",
  },
]

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">How to get here</h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              A simple, guided journey: customs, a short hop to San Pedro, and a quick boat ride to Canary Cove.
            </p>
          </div>
          <div className="space-y-4 rounded-2xl border border-border/70 bg-white/90 p-6 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
            <ol className="space-y-4 text-sm text-foreground">
              {steps.map((step, index) => (
                <li key={step.title} className="space-y-2 rounded-xl bg-white/80 p-4">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {index + 1}
                    </span>
                    {step.title}
                  </div>
                  <p className="text-base text-foreground">{step.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
