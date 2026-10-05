import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { LegalDocument, type LegalSection } from "@/components/legal/legal-document"
import { PageStructuredData } from "@/components/structured-data"
import { PAGE_METADATA } from "@/lib/seo"

export const metadata = PAGE_METADATA.privacy

const SECTIONS: LegalSection[] = [
  {
    id: "what-we-collect",
    title: "What we collect",
    body: (
      <p>
        When you submit a booking request, contact form, or email signup, we may collect your name, email address, phone
        number, travel dates, group details, and message content.
      </p>
    ),
  },
  {
    id: "how-it-is-used",
    title: "How it is used",
    body: (
      <p>
        We use your information to respond to inquiries, confirm availability, coordinate stays, and share the limited
        updates you request. We do not sell your personal information.
      </p>
    ),
  },
  {
    id: "third-party-services",
    title: "Third-party services",
    body: (
      <p>
        Canary Cove uses Formspree to receive submitted forms, Cloudinary to serve media, and Google Analytics plus Vercel Analytics to understand site usage. Those providers
        may process information according to their own policies.
      </p>
    ),
  },
  {
    id: "retention-and-updates",
    title: "Retention & updates",
    body: (
      <p>
        We keep inquiry details only as long as needed to support guest communication and planning. To request an update
        or deletion of your submitted information, contact the Canary Cove team directly.
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main tabIndex={-1} id="main-content" className="min-h-screen outline-none">
      <PageStructuredData path="/privacy" />
      <LegalDocument
        eyebrow="Legal · Privacy"
        title="Privacy Policy"
        intro="Canary Cove only requests the details needed to respond to booking inquiries, guest questions, and availability requests."
        sections={SECTIONS}
        sibling={{ href: "/terms", label: "Read the terms of use" }}
      />
    </main>
      <Footer />
    </>
  )
}
