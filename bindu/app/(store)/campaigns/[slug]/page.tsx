import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/premium/Button"

export const metadata = {
  title: "Campaign | Bindu Premium",
  description: "Explore the campaign details.",
}

const DUMMY_CAMPAIGN = {
  title: "Summer Essentials 2026",
  slug: "summer-essentials-2026",
  heroImage: "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=2000&auto=format&fit=crop",
  story: "The Dhaka summer is unrelenting. It demands clothing that breathes, moves, and endures. Our Summer 2026 collection is engineered specifically for this environment. We've introduced new ultra-lightweight cotton blends and relaxed silhouettes that prioritize airflow without sacrificing the structured, premium aesthetic Bindu is known for.",
  products: [
    { name: "Lightweight Linen Blend Polo", price: 1450, slug: "lightweight-linen-polo", image: "https://images.unsplash.com/photo-1596704017366-2679c65600c3?q=80&w=2940&auto=format&fit=crop" },
    { name: "Breeze Cotton T-Shirt", price: 950, slug: "breeze-cotton-tshirt", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2940&auto=format&fit=crop" },
    { name: "Summer Chino Short", price: 1250, slug: "summer-chino-short", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2872&auto=format&fit=crop" }
  ],
  offer: {
    title: "Summer Wardrobe Bundle",
    description: "Build your summer rotation. Buy any 3 items from the summer collection and receive 15% off your entire order.",
    coupon: "SUMMER26",
    cta: "Shop The Collection"
  },
  faq: [
    { question: "Are these items pre-shrunk?", answer: "Yes, all our summer cottons undergo a proprietary pre-shrinking process." },
    { question: "How long is the bundle offer valid?", answer: "The bundle offer runs through August 31st, 2026." }
  ]
}

export default async function CampaignSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  if (!slug) notFound()

  // In a real app, fetch from CMS based on slug
  const campaign = DUMMY_CAMPAIGN

  return (
    <div className="bg-bindu-white pb-32">
      
      {/* Back Link */}
      <div className="absolute top-24 left-4 md:left-8 z-20">
        <Link href="/campaigns" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-bindu-orange transition-colors drop-shadow-md">
          <ArrowLeft className="w-4 h-4" /> All Campaigns
        </Link>
      </div>

      {/* Hero */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center mb-24">
        <div className="absolute inset-0 z-0">
          <Image
            src={campaign.heroImage}
            alt={campaign.title}
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white uppercase tracking-tight mb-6">
            {campaign.title}
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-4 mb-24 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-orange mb-6 block">The Story</span>
        <p className="text-bindu-text-muted text-lg md:text-xl leading-relaxed">
          {campaign.story}
        </p>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 mb-32">
        <h2 className="text-3xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-12 text-center">
          Featured Pieces
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {campaign.products.map(product => (
            <Link key={product.slug} href={`/shop/${product.slug}`} className="group block">
              <div className="relative aspect-[4/5] bg-bindu-light-grey mb-6 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="font-bold text-bindu-navy uppercase tracking-wider group-hover:text-bindu-orange transition-colors text-center">
                {product.name}
              </h3>
              <p className="text-bindu-text-muted text-center mt-2">
                ৳{product.price}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Offer Block */}
      {campaign.offer && (
        <section className="max-w-5xl mx-auto px-4 mb-32">
          <div className="bg-bindu-navy text-white p-12 md:p-24 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-orange mb-6 block">Exclusive Offer</span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tight mb-6">
              {campaign.offer.title}
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              {campaign.offer.description}
            </p>
            <div className="inline-block bg-white/10 px-8 py-4 mb-12">
              <span className="text-sm uppercase tracking-widest text-white/70 mr-4">Use Code</span>
              <span className="font-mono text-2xl font-bold tracking-widest text-bindu-orange">{campaign.offer.coupon}</span>
            </div>
            <div>
              <Link href="/shop">
                <Button className="bg-bindu-orange hover:bg-bindu-orange/90 text-white h-14 px-12 text-sm uppercase tracking-widest font-bold">
                  {campaign.offer.cta}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {campaign.faq && (
        <section className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-12 text-center border-b border-bindu-border-grey pb-4">
            Campaign FAQ
          </h2>
          <div className="space-y-8">
            {campaign.faq.map((item, i) => (
              <div key={i}>
                <h4 className="font-bold text-bindu-navy mb-2">{item.question}</h4>
                <p className="text-bindu-text-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
