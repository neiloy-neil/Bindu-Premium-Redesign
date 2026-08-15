import Image from "next/image"
import Link from "next/link"

export const metadata = {
  title: "Style Guide | Bindu Premium",
  description: "Editorial styling guides for the modern Bangladeshi gentleman. From everyday wear to festive Eid looks.",
}

const styleGuides = [
  {
    title: "The Everyday Uniform",
    description: "Mastering the art of casual elevation. Pair our heavyweight tees with tailored trousers for a look that transitions effortlessly from the studio to the street.",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=2000&auto=format&fit=crop",
    products: [
      { name: "Heavyweight T-Shirt - Black", price: 850, slug: "heavyweight-t-shirt-black" },
      { name: "Premium Chinos - Sand", price: 1850, slug: "premium-chinos-sand" }
    ]
  },
  {
    title: "Smart Casual Office",
    description: "Redefining workplace attire. Our Signature Pique Polos provide the structure of a shirt with the comfort of a tee.",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=2070&auto=format&fit=crop",
    products: [
      { name: "Signature Pique Polo - Navy", price: 1250, slug: "signature-pique-polo-navy" }
    ]
  },
  {
    title: "Festive Elegance",
    description: "Honoring tradition with contemporary execution. Our Panjabis are crafted from breathable cotton blends, featuring minimal embroidery for a sophisticated festive look.",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop",
    products: [
      { name: "Minimalist Panjabi - White", price: 2450, slug: "minimalist-panjabi-white" }
    ]
  }
]

export default function StyleGuidePage() {
  return (
    <div className="bg-bindu-white pb-32">
      {/* Header */}
      <section className="pt-32 pb-24 px-4 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-orange mb-6 block">How to Wear</span>
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-6">
          The Style Guide
        </h1>
        <p className="text-bindu-text-muted text-lg max-w-2xl mx-auto">
          Curated looks for every occasion. Discover how to build a versatile, timeless wardrobe with Bindu Premium essentials.
        </p>
      </section>

      {/* Guides */}
      <section className="max-w-6xl mx-auto px-4 space-y-32">
        {styleGuides.map((guide, index) => (
          <div key={guide.title} className="flex flex-col md:flex-row gap-12 lg:gap-24 items-center">
            
            {/* Image */}
            <div className={`w-full md:w-1/2 relative aspect-[4/5] ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
              <Image
                src={guide.image}
                alt={guide.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className={`w-full md:w-1/2 ${index % 2 !== 0 ? 'md:order-1' : ''}`}>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-text-muted mb-4 block">Look {index + 1}</span>
              <h2 className="text-3xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-6">
                {guide.title}
              </h2>
              <p className="text-bindu-text-muted leading-relaxed text-lg mb-12">
                {guide.description}
              </p>

              {/* Shop the look */}
              <div className="border-t border-bindu-border-grey pt-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-navy mb-6">Featured Pieces</h3>
                <div className="space-y-4">
                  {guide.products.map(product => (
                    <div key={product.slug} className="flex items-center justify-between group">
                      <Link href={`/shop/${product.slug}`} className="flex-1">
                        <span className="font-medium text-bindu-navy group-hover:text-bindu-orange transition-colors">
                          {product.name}
                        </span>
                      </Link>
                      <span className="text-bindu-text-muted text-sm">৳{product.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ))}
      </section>
    </div>
  )
}
