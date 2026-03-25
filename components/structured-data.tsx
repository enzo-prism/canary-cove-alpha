import { buildPageJsonLd, buildSiteJsonLd } from "@/lib/structured-data"

type JsonLdProps = {
  data: Record<string, unknown>
}

function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}

export function SiteStructuredData() {
  return <JsonLd data={buildSiteJsonLd()} />
}

export function PageStructuredData({ path }: { path: string }) {
  const data = buildPageJsonLd(path)

  if (!data) {
    return null
  }

  return <JsonLd data={data} />
}
