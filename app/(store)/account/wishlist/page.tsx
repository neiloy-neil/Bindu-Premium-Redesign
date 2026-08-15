"use client"

import { useWishlistStore } from "@/store/useWishlistStore"
import ProductCard from "@/components/store/ProductCard"
import { Heart } from "lucide-react"
import Link from "next/link"

export default function WishlistPage() {
  const { items } = useWishlistStore()

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-[60vh]">
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-bindu-navy mb-8 flex items-center gap-3">
        <Heart className="w-8 h-8 text-bindu-orange fill-bindu-orange" />
        My Wishlist
      </h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-bindu-light-grey rounded-none border border-bindu-border-grey">
          <Heart className="w-16 h-16 text-bindu-text-muted mb-4" />
          <h2 className="text-2xl font-heading font-bold text-bindu-navy mb-2">Your wishlist is empty</h2>
          <p className="text-bindu-text-muted mb-6 max-w-md">
            Save items you love to your wishlist. Review them anytime and easily add them to your cart.
          </p>
          <Link href="/shop" className="bg-bindu-navy text-white px-8 py-3 uppercase tracking-widest font-bold text-sm hover:bg-bindu-orange transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              product={{
                id: item.id,
                name: item.name,
                slug: item.slug,
                price: item.price,
                comparePrice: item.comparePrice,
                category: { name: item.category },
                images: [{ url: item.image }]
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
