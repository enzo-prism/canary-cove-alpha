import type { DetailedHTMLProps, HTMLAttributes } from "react"

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        "agent-id": string
        "data-testid"?: string
        variant?: "tiny" | "compact" | "expanded"
        dismissible?: "true" | "false"
      }
    }
  }
}
