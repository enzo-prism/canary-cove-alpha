"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PhotoCarousel } from "@/components/photo-carousel"

type BasicPageProps = {
  title: string
}

export function BasicPage({ title }: BasicPageProps) {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
        </div>
      </section>
      <PhotoCarousel />
      <Footer />
    </main>
  )
}
