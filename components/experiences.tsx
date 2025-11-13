import { Button } from "@/components/ui/button"
import Link from "next/link"

const experiences = [
  {
    title: "Diving & Snorkeling",
    image: "/scuba-diving-coral-reef-tropical-fish.jpg",
    description: "Explore vibrant coral reefs and marine life",
  },
  {
    title: "Private Chef",
    image: "/fine-dining-gourmet-chef-plating-food.jpg",
    description: "Indulge in personalized culinary experiences",
  },
  {
    title: "Island Excursions",
    image: "/tropical-island-beach-boat-trip.jpg",
    description: "Discover hidden beaches and secret coves",
  },
]

export function Experiences() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-balance">Unforgettable Experiences</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create memories that last a lifetime with our curated activities
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {experiences.map((experience, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4 aspect-[4/3]">
                <img
                  src={experience.image || "/placeholder.svg"}
                  alt={experience.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{experience.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{experience.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/experiences">View All Experiences</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
