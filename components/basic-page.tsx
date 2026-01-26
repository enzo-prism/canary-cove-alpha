"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PhotoCarousel } from "@/components/photo-carousel"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"

type BasicPageProps = {
  title: string
}

export function BasicPage({ title }: BasicPageProps) {
  return (
    <main className="min-h-screen">
      <Header />
      <Section padding="tight">
        <Container>
          <h1 className="text-display">{title}</h1>
        </Container>
      </Section>
      <PhotoCarousel />
      <Footer />
    </main>
  )
}
