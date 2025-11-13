import { Home, Waves, UtensilsCrossed } from "lucide-react"

const features = [
  {
    icon: Home,
    title: "Luxury Accommodations",
    description: "Choose from elegantly appointed suites or our exclusive private villa",
    href: "/stay",
  },
  {
    icon: Waves,
    title: "Water Adventures",
    description: "Explore crystal-clear waters with diving, fishing, and power-boating",
    href: "/experiences",
  },
  {
    icon: UtensilsCrossed,
    title: "Exceptional Dining",
    description: "Savor gourmet cuisine prepared by our private chefs",
    href: "/dining",
  },
]

export function Features() {
  return (
    <section className="py-24 bg-sand">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-balance">Discover Canary Cove</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Where every moment is crafted for your comfort and enjoyment
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <a
                key={index}
                href={feature.href}
                className="group p-8 rounded-lg bg-background hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-6 inline-block">
                  <div className="w-16 h-16 rounded-full bg-accent-coral/10 flex items-center justify-center group-hover:bg-accent-coral/20 transition-colors">
                    <Icon className="w-8 h-8 text-accent-coral" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
