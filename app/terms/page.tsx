import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { LegalDocument, type LegalSection } from "@/components/legal/legal-document"
import { PageStructuredData } from "@/components/structured-data"
import { PAGE_METADATA } from "@/lib/seo"

export const metadata = PAGE_METADATA.terms

const SECTIONS: LegalSection[] = [
  {
    id: "informational-content",
    title: "Informational content",
    body: (
      <p>
        Rates, inclusions, and property details are provided for planning purposes and may change. Final availability,
        policies, and trip specifics are confirmed directly with the Canary Cove team.
      </p>
    ),
  },
  {
    id: "inquiry-submissions",
    title: "Inquiry submissions",
    body: (
      <p>
        Submitting a booking request, contact form, or email signup does not create a reservation. Your stay is only
        confirmed once the Canary Cove team approves the request and shares the next steps.
      </p>
    ),
  },
  {
    id: "third-party-tools",
    title: "Third-party tools",
    body: (
      <p>
        This site links to or embeds third-party services such as Formspree, Facebook, and Cloudinary. Canary Cove is
        not responsible for outages, policy changes, or content hosted by those external services.
      </p>
    ),
  },
  {
    id: "updates",
    title: "Updates",
    body: (
      <p>
        Canary Cove may update this website and these terms at any time to reflect changes in operations, guest
        experience, or supporting services.
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <>
      <Header />
      <main tabIndex={-1} id="main-content" className="min-h-screen outline-none">
      <PageStructuredData path="/terms" />
      <LegalDocument
        eyebrow="Legal · Terms"
        title="Terms of Use"
        intro="This website is intended to help guests explore the property, review rates, and contact the Canary Cove team for availability and planning."
        sections={SECTIONS}
        sibling={{ href: "/privacy", label: "Read the privacy policy" }}
      />
    </main>
      <Footer />
    </>
  )
}
