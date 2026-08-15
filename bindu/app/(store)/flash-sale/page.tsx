"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/premium/Button"
import { CountdownTimer } from "@/components/premium/CountdownTimer"

const flashSaleProducts = [
  { name: "Signature Pique Polo - Black", originalPrice: 1250, salePrice: 950, slug: "signature-pique-polo-black", image: "https://images.unsplash.com/photo-1596704017366-2679c65600c3?q=80&w=2940&auto=format&fit=crop" },
  { name: "Heavyweight T-Shirt - White", originalPrice: 850, salePrice: 650, slug: "heavyweight-t-shirt-white", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2940&auto=format&fit=crop" },
  { name: "Minimalist Panjabi - Navy", originalPrice: 2450, salePrice: 1850, slug: "minimalist-panjabi-navy", image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop" },
  { name: "Premium Chinos - Sand", originalPrice: 1850, salePrice: 1450, slug: "premium-chinos-sand", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2872&auto=format&fit=crop" }
]

export default function FlashSalePage() {
  // Set target date 3 days from now for demo purposes
  const targetDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
  
  // Note: Expiration handling would ideally happen server-side or via a wrapper component
  // that redirects to /offers if the current date > targetDate.

  return (
    <div className="bg-bindu-light-grey min-h-screen pb-32">
      {/* Temporary Creative Concept Hero ("Raag Korla?") */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        
        {/* Grungy/Editorial Background specifically for this campaign */}
        <div className="absolute inset-0 z-0 opacity-10 mix-blend-multiply">
          <Image
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2940&auto=format&fit=crop"
            alt="Flash Sale Texture"
            fill
            className="object-cover grayscale contrast-150"
            priority
          />
        </div>
        
        {/* Dynamic Graphic Elements */}
        <div className="absolute top-1/4 left-0 w-full h-[2px] bg-bindu-orange/20 rotate-[-5deg] z-10" />
        <div className="absolute bottom-1/4 left-0 w-full h-[2px] bg-bindu-orange/20 rotate-[3deg] z-10" />

        <div className="relative z-20 text-center px-4 mt-20 w-full">
          <div className="inline-block border-2 border-bindu-orange text-bindu-orange px-6 py-2 text-sm font-bold uppercase tracking-[0.3em] mb-12 bg-bindu-white">
            48 Hour Flash Sale
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-heading font-black text-bindu-navy uppercase tracking-tighter leading-none mb-6 drop-shadow-sm">
            Raag <span className="text-bindu-orange italic">Korla?</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-bindu-text-muted font-medium max-w-2xl mx-auto mb-16 uppercase tracking-widest">
            Don't be mad you missed it. Up to 40% Off Select Premium Essentials.
          </p>

          <div className="bg-white border border-bindu-border-grey p-8 md:p-12 max-w-4xl mx-auto rounded-none shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-bindu-orange mb-8">Offer Ends In</h3>
            <CountdownTimer targetDate={targetDate} />
          </div>
        </div>
      </section>

      {/* Sale Product Grid */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-16 border-b border-bindu-border-grey pb-6">
          <h2 className="text-3xl font-heading font-bold text-bindu-navy uppercase tracking-tight">
            Flash Sale Pieces
          </h2>
          <span className="text-bindu-orange font-bold text-sm uppercase tracking-widest">Limited Stock</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {flashSaleProducts.map((product) => (
            <Link key={product.slug} href={`/shop/${product.slug}`} className="group block bg-white border border-bindu-border-grey hover:border-bindu-navy transition-colors">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-bindu-orange text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">
                  Sale
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-bindu-navy uppercase tracking-wider mb-2 line-clamp-1">{product.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-bindu-orange font-bold">৳{product.salePrice}</span>
                  <span className="text-bindu-text-muted line-through text-sm">৳{product.originalPrice}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <Link href="/shop">
            <Button className="bg-bindu-orange hover:bg-white hover:text-bindu-navy text-white h-14 px-12 text-sm uppercase tracking-widest font-bold transition-colors">
              View All Sale Items
            </Button>
          </Link>
        </div>
      </section>

      {/* Terms */}
      <section className="py-16 px-4 border-t border-bindu-border-grey bg-bindu-white">
        <div className="max-w-4xl mx-auto text-center">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-text-muted mb-4">Terms & Conditions</h4>
          <p className="text-bindu-text-muted text-sm leading-relaxed max-w-2xl mx-auto">
            Flash sale pricing is valid only during the stated promotional period. All sales are final; returns or exchanges are not permitted on flash sale items. Bindu Premium reserves the right to modify or cancel the promotion at any time. Offer cannot be combined with other discounts or loyalty rewards.
          </p>
        </div>
      </section>

    </div>
  )
}
