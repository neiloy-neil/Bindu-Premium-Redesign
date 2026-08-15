"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react"
import { useWishlistStore } from "@/store/useWishlistStore"
import { useSession } from "@/hooks/useSession"
import { toast } from "sonner"

export default function WishlistPage() {
  const { items, removeItem, loadFromDB } = useWishlistStore()
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) loadFromDB()
  }, [session?.user?.id])

  if (items.length === 0) {
    return (
      <div className="bg-bindu-light-grey min-h-[70vh] flex items-center justify-center px-4 animate-in fade-in duration-500">
        <div className="text-center">
          <div className="w-20 h-20 border border-bindu-border-grey flex items-center justify-center mx-auto mb-8 bg-white">
            <Heart className="w-8 h-8 text-bindu-text-muted/30" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-3">Wishlist Empty</h1>
          <p className="text-bindu-text-muted text-sm mb-10">Save items you love and come back to them anytime.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-bindu-navy text-white font-bold uppercase tracking-widest text-xs hover:bg-bindu-orange transition-colors shadow-sm"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bindu-light-grey min-h-screen animate-in fade-in duration-500">

      {/* Header */}
      <div className="border-b border-bindu-border-grey bg-white py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-bindu-orange mb-4">Your List</p>
          <h1 className="font-heading font-black text-bindu-navy uppercase leading-none tracking-tight mb-2" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}>
            Wishlist
          </h1>
          <p className="text-bindu-text-muted text-sm">{items.length} item{items.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {items.map((item) => (
            <div key={item.id} className="group relative flex flex-col h-full">
              <div className="relative aspect-[3/4] bg-bindu-white overflow-hidden border border-bindu-border-grey mb-4">
                <Link href={`/shop/${item.slug}`}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-all duration-700"
                  />
                </Link>
                <button
                  onClick={() => {
                    removeItem(item.id)
                    toast.success("Removed from wishlist")
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur border border-bindu-border-grey hover:border-bindu-red text-bindu-text-muted hover:text-bindu-red transition-colors shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-col flex-1 px-1">
                {item.category && (
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-bindu-text-muted mb-1">{item.category}</p>
                )}
                <Link href={`/shop/${item.slug}`} className="font-heading font-medium text-bindu-navy text-sm md:text-base leading-tight hover:text-bindu-orange transition-colors">
                  {item.name}
                </Link>
                <div className="flex items-center gap-2 mt-1 mb-3">
                  <span className="font-mono font-medium text-sm text-bindu-navy">৳{item.price.toLocaleString()}</span>
                  {item.comparePrice && item.comparePrice > item.price && (
                    <span className="font-mono text-xs text-bindu-text-muted line-through">
                      ৳{item.comparePrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <Link
                  href={`/shop/${item.slug}`}
                  className="mt-auto w-full py-3 bg-white text-bindu-navy border border-bindu-border-grey text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-bindu-navy hover:text-white transition-colors shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
