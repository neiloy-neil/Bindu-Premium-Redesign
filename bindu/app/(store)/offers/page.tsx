import Link from "next/link"
import { Copy, Clock } from "lucide-react"

export const metadata = {
  title: "Offers & Promotions | Bindu Premium",
  description: "Current offers and promotions at Bindu Premium.",
}

const activeOffers = [
  {
    id: "offer-1",
    title: "Summer Wardrobe Bundle",
    description: "Buy any 3 items from the summer collection and receive 15% off your entire order.",
    code: "SUMMER26",
    expiry: "2026-08-31",
    terms: "Valid on full-priced summer collection items only. Cannot be combined with other offers."
  },
  {
    id: "offer-2",
    title: "Welcome To Bindu",
    description: "Sign up for our newsletter and receive 10% off your first purchase.",
    code: "WELCOME10",
    expiry: "No Expiry",
    terms: "Valid for first-time customers only. One use per account."
  },
  {
    id: "offer-3",
    title: "Free Shipping",
    description: "Enjoy complimentary standard shipping on all orders over ৳5,000.",
    code: "AUTO-APPLIED",
    expiry: "No Expiry",
    terms: "Applies automatically at checkout for qualifying baskets."
  }
]

export default function OffersPage() {
  return (
    <div className="bg-bindu-light-grey min-h-screen pb-32">
      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
          Current Offers
        </h1>
        <p className="text-bindu-text-muted text-lg max-w-2xl mx-auto">
          Elevate your wardrobe with our latest promotions and seasonal bundles.
        </p>
      </section>

      {/* Offers Grid */}
      <section className="max-w-5xl mx-auto px-4">
        {activeOffers.length > 0 ? (
          <div className="grid gap-8">
            {activeOffers.map(offer => (
              <div key={offer.id} className="bg-white border border-bindu-border-grey p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center justify-between group hover:border-bindu-navy transition-colors">
                
                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
                    {offer.title}
                  </h2>
                  <p className="text-bindu-text-muted text-lg mb-6">
                    {offer.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-bindu-text-muted justify-center md:justify-start">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Expires: {offer.expiry}
                    </span>
                  </div>
                  
                  <p className="text-xs text-bindu-text-muted mt-4 mt-8 pt-4 border-t border-bindu-border-grey max-w-xl">
                    * {offer.terms}
                  </p>
                </div>

                {/* Code Block */}
                <div className="w-full md:w-auto bg-bindu-light-grey p-6 border border-dashed border-bindu-border-grey text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-bindu-navy block mb-4">Promo Code</span>
                  <div className="flex items-center justify-center gap-3 bg-white border border-bindu-border-grey px-6 py-3 mb-4">
                    <span className="font-mono font-bold text-lg text-bindu-orange tracking-widest">
                      {offer.code}
                    </span>
                    {offer.code !== "AUTO-APPLIED" && (
                      <button className="text-bindu-text-muted hover:text-bindu-navy transition-colors" title="Copy Code">
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-bindu-navy hover:text-bindu-orange transition-colors">
                    Shop Now
                  </Link>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white border border-bindu-border-grey">
            <h2 className="text-2xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
              No Active Offers
            </h2>
            <p className="text-bindu-text-muted mb-8">
              Check back soon for new promotions and bundles.
            </p>
            <Link href="/shop" className="inline-block bg-bindu-navy text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-bindu-orange transition-colors">
              Continue Shopping
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
