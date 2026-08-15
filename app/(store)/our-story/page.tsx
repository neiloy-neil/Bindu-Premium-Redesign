import Image from "next/image"

export const metadata = {
  title: "Our Story | Bindu Premium",
  description: "The journey of Bindu Premium. From our founding to our future vision for menswear in Bangladesh.",
}

const milestones = [
  {
    year: "2023",
    title: "The Genesis",
    description: "Bindu Premium was conceived from a desire to create uncompromising menswear. We spent the first year sourcing the finest fabrics and partnering with world-class manufacturing facilities in Dhaka.",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2940&auto=format&fit=crop"
  },
  {
    year: "2024",
    title: "Collection 01",
    description: "We launched our inaugural collection focusing on the perfect Polo and everyday T-shirt. The response validated our belief: Bangladesh was ready for a truly premium domestic brand.",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=2070&auto=format&fit=crop"
  },
  {
    year: "2025",
    title: "The Digital Flagship",
    description: "We rebuilt our entire digital experience to match the quality of our garments. We expanded into Panjabis and accessories, cementing our position as a complete lifestyle brand.",
    image: "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2940&auto=format&fit=crop"
  }
]

export default function OurStoryPage() {
  return (
    <div className="bg-bindu-white pb-32">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-orange mb-6 block">Our Story</span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-bindu-navy uppercase tracking-tight max-w-4xl mx-auto leading-tight">
          A Commitment to Excellence
        </h1>
      </section>

      {/* Intro Image */}
      <section className="w-full h-[60vh] min-h-[500px] relative mb-24">
        <Image
          src="https://images.unsplash.com/photo-1503341338985-c0477be52513?q=80&w=2940&auto=format&fit=crop"
          alt="Bindu Premium Story"
          fill
          className="object-cover"
          priority
        />
      </section>

      {/* Editorial Text */}
      <section className="px-4 mb-32">
        <div className="max-w-3xl mx-auto text-bindu-text-muted space-y-6 text-lg md:text-xl leading-relaxed text-center">
          <p>
            The story of Bindu Premium is not just about clothing; it's about redefining standards. For too long, the narrative in local fashion has been driven by cost-cutting and volume. We chose a different path.
          </p>
          <p>
            We believe that every detail matters—from the tension of the thread to the drape of the fabric. Our journey is a continuous pursuit of perfection, building a brand that stands shoulder-to-shoulder with global leaders, right here in Bangladesh.
          </p>
        </div>
      </section>

      {/* Timeline Milestones */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="space-y-32">
          {milestones.map((milestone, index) => (
            <div key={milestone.year} className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              
              {/* Image Side */}
              <div className={`w-full md:w-1/2 relative aspect-[4/3] ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
                <Image
                  src={milestone.image}
                  alt={milestone.title}
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Text Side */}
              <div className={`w-full md:w-1/2 ${index % 2 !== 0 ? 'md:order-1' : ''}`}>
                <div className="text-6xl md:text-8xl font-heading font-bold text-bindu-light-grey mb-4">
                  {milestone.year}
                </div>
                <h2 className="text-2xl md:text-4xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-6">
                  {milestone.title}
                </h2>
                <p className="text-bindu-text-muted leading-relaxed text-lg">
                  {milestone.description}
                </p>
              </div>

            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
