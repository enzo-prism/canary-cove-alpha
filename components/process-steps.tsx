type ProcessStepsProps = {
  steps: readonly { title: string; description: string }[]
}

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <div className="surface-panel px-6 py-6 sm:px-8 sm:py-8">
      <div className="flow flow-md">
        <div className="flow flow-xs">
          <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">How it works</p>
          <h2 className="text-section">Four steps. One seamless stay.</h2>
          <p className="text-body max-w-2xl">
            We keep the path from first inquiry to dock arrival clear, personal, and easy to act on.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="surface-inset flow flow-xs p-6">
              <p className="text-[11px] uppercase tracking-[0.36em] text-muted-foreground">{`Step ${index + 1}`}</p>
              <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
