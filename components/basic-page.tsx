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
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl xl:max-w-7xl">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
        </div>
      </section>
      <PhotoCarousel />
      <Footer />
    </main>
  )
}
