import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { PAGE_METADATA } from "@/lib/seo"

export const metadata = PAGE_METADATA.privacy

export default function PrivacyPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Header />
      <Section padding="tight">
        <Container size="narrow" className="flow flow-md">
          <div className="flow flow-xs">
            <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">Privacy policy</p>
            <h1 className="text-display">How your information is handled.</h1>
            <p className="text-body text-foreground/80">
              Canary Cove only requests the details needed to respond to booking inquiries, guest questions, and availability requests.
            </p>
          </div>

          <section className="flow flow-sm">
            <h2 className="text-section">What we collect</h2>
            <p className="text-body text-foreground/80">
              When you submit a booking request, contact form, or email signup, we may collect your name, email address, phone number, travel dates, group details, and message content.
            </p>
          </section>

          <section className="flow flow-sm">
            <h2 className="text-section">How it is used</h2>
            <p className="text-body text-foreground/80">
              We use your information to respond to inquiries, confirm availability, coordinate stays, and share the limited updates you request. We do not sell your personal information.
            </p>
          </section>

          <section className="flow flow-sm">
            <h2 className="text-section">Third-party services</h2>
            <p className="text-body text-foreground/80">
              Canary Cove uses Formspree to receive submitted forms, Bookingmood to display live availability, Cloudinary to serve media, and Google Analytics plus Vercel Analytics to understand site usage. Those providers may process information according to their own policies.
            </p>
          </section>

          <section className="flow flow-sm">
            <h2 className="text-section">Retention & updates</h2>
            <p className="text-body text-foreground/80">
              We keep inquiry details only as long as needed to support guest communication and planning. To request an update or deletion of your submitted information, contact the Canary Cove team directly.
            </p>
          </section>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}
