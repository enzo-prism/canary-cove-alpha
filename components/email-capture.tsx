import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function EmailCapture() {
  return (
    <div className="rounded-[28px] border border-border/70 bg-surface p-6 sm:p-10">
      <div className="flow flow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">Updates</p>
        <h2 className="text-section">Be first to hear about open dates.</h2>
        <p className="text-body text-foreground/80">
          A single email when new availability or seasonal offers open up.
        </p>
      </div>
      <form className="mt-6 flex flex-col gap-4 sm:flex-row">
        <Input
          type="email"
          name="email"
          placeholder="Email address"
          className="h-11 flex-1 rounded-full border-border bg-transparent px-4 text-sm"
        />
        <Button type="submit" size="lg" className="h-11 px-6">
          Join the list
        </Button>
      </form>
      <p className="mt-3 text-xs uppercase tracking-[0.28em] text-muted-foreground">
        No noise. Only availability and new experiences.
      </p>
    </div>
  )
}
