type ProcessStepsProps = {
  steps: readonly { title: string; description: string }[]
}

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <div className="flow flow-md">
      <div className="flow flow-xs">
        <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">How it works</p>
        <h2 className="text-section">Four steps. One seamless stay.</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-[24px] border border-border/70 bg-surface p-6 flow flow-xs">
            <p className="text-[11px] uppercase tracking-[0.36em] text-muted-foreground">{`Step ${index + 1}`}</p>
            <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
