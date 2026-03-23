import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { PAGE_METADATA } from "@/lib/seo"

export const metadata = PAGE_METADATA.terms

export default function TermsPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Header />
      <Section padding="tight">
        <Container size="narrow" className="flow flow-md">
          <div className="flow flow-xs">
            <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">Terms of use</p>
            <h1 className="text-display">Using the Canary Cove website.</h1>
            <p className="text-body text-foreground/80">
              This website is intended to help guests explore the property, review rates, and contact the Canary Cove team for availability and planning.
            </p>
          </div>

          <section className="flow flow-sm">
            <h2 className="text-section">Informational content</h2>
            <p className="text-body text-foreground/80">
              Rates, inclusions, and property details are provided for planning purposes and may change. Final availability, policies, and trip specifics are confirmed directly with the Canary Cove team.
            </p>
          </section>

          <section className="flow flow-sm">
            <h2 className="text-section">Inquiry submissions</h2>
            <p className="text-body text-foreground/80">
              Submitting a booking request, contact form, or email signup does not create a reservation. Your stay is only confirmed once the Canary Cove team approves the request and shares the next steps.
            </p>
          </section>

          <section className="flow flow-sm">
            <h2 className="text-section">Third-party tools</h2>
            <p className="text-body text-foreground/80">
              This site links to or embeds third-party services such as Bookingmood, Formspree, Facebook, and Cloudinary. Canary Cove is not responsible for outages, policy changes, or content hosted by those external services.
            </p>
          </section>

          <section className="flow flow-sm">
            <h2 className="text-section">Updates</h2>
            <p className="text-body text-foreground/80">
              Canary Cove may update this website and these terms at any time to reflect changes in operations, guest experience, or supporting services.
            </p>
          </section>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}
