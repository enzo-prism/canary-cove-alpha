import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="/luxury-tropical-beachfront-villa-sunset-ocean-view.jpg" alt="Canary Cove beachfront" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-serif mb-6 tracking-tight text-balance">
          Your Private Paradise Awaits
        </h1>
        <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
          Experience unparalleled luxury at Canary Cove, where pristine beaches meet world-class hospitality
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg">
            <Link href="/stay">Explore Accommodations</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-lg bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
          >
            <Link href="/contact">Book Your Stay</Link>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
