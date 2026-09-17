import { useMemo } from "react"

type HighlightProps = {
  text: string
  tokens: string[]
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export function Highlight({ text, tokens }: HighlightProps) {
  const parts = useMemo(() => {
    const terms = tokens.map((token) => token.trim()).filter((token) => token.length >= 2)
    if (terms.length === 0) return [text]
    const pattern = new RegExp(`(?<!\\w)(${terms.map(escapeRegExp).join("|")})(?!\\w)`, "gi")
    return text.split(pattern)
  }, [text, tokens])

  if (parts.length <= 1) return <>{text}</>

  const lowered = new Set(tokens.map((token) => token.trim().toLowerCase()).filter((token) => token.length >= 2))
  return (
    <>
      {parts.map((part, index) =>
        part && lowered.has(part.toLowerCase()) ? (
          <mark
            key={`${part}-${index}`}
            className="bg-transparent font-semibold text-foreground underline decoration-primary/40 underline-offset-2"
          >
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </>
  )
}
