import Image from "next/image"

export const metadata = {
  title: "Our Quality | Bindu Premium",
  description: "Explore the uncompromising standards behind every Bindu Premium garment. From fabric sourcing to finishing touches.",
}

const qualityPillars = [
  {
    title: "Fabric",
    description: "The foundation of every piece. We source premium 100% combed cotton, long-staple pima, and specialized technical blends. Our fabrics are chosen for their hand-feel, durability, and how they age over time.",
    image: "https://images.unsplash.com/photo-1596704017366-2679c65600c3?q=80&w=2940&auto=format&fit=crop"
  },
  {
    title: "Construction",
    description: "Built to last. We utilize reinforced shoulder seams, high-density stitching, and structured collars that retain their shape wash after wash. Every seam serves a structural purpose.",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2872&auto=format&fit=crop"
  },
  {
    title: "Fit",
    description: "Tailored for the modern silhouette. Our patterns are engineered through countless iterations to ensure they drape correctly across the shoulders while maintaining a clean, structured line down the body.",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2940&auto=format&fit=crop"
  },
  {
    title: "Finishing",
    description: "The difference is in the details. From color-matched thread and premium dyed-to-match buttons to pre-shrinking processes that guarantee true-to-size fits right out of the box.",
    image: "https://images.unsplash.com/photo-1606830733568-19e3df29a7df?q=80&w=2940&auto=format&fit=crop"
  }
]

export default function QualityPage() {
  return (
    <div className="bg-bindu-white pb-32">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-orange mb-6 block">Our Quality</span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-bindu-navy uppercase tracking-tight max-w-5xl mx-auto leading-tight">
          Uncompromising Standards
        </h1>
        <p className="mt-8 max-w-2xl mx-auto text-bindu-text-muted text-lg md:text-xl leading-relaxed">
          At Bindu Premium, we believe true luxury isn't about logos—it's about the tangible quality of the garment. Here is how we build our clothing.
        </p>
      </section>

      {/* Philosophy Section */}
      <section className="w-full h-[70vh] min-h-[600px] relative mb-32 group overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2940&auto=format&fit=crop"
          alt="Bindu Premium Quality Philosophy"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-center max-w-3xl border border-white/30 p-8 md:p-16 backdrop-blur-sm bg-black/20">
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-white uppercase tracking-tight mb-6">
              The Bindu Guarantee
            </h2>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed">
              We stand behind every stitch. Our quality control process ensures that no piece leaves the facility unless it meets our exacting standards. We are obsessed with the details so you don't have to be.
            </p>
          </div>
        </div>
      </section>

      {/* Quality Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {qualityPillars.map((pillar, index) => (
            <div key={pillar.title} className="group">
              <div className="relative aspect-[4/5] w-full mb-8 overflow-hidden bg-bindu-light-grey">
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="flex gap-4">
                <div className="text-sm font-bold text-bindu-orange mt-1">0{index + 1}</div>
                <div>
                  <h3 className="text-2xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-bindu-text-muted leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
