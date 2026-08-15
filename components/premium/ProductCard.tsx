"use client"
import { useState, MouseEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { useWishlistStore } from "@/store/useWishlistStore"
import { useCartStore } from "@/store/useCartStore"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function PremiumProductCard({
  product,
  flashSalePrice,
  flashSaleLabel,
}: {
  product: any
  flashSalePrice?: number
  flashSaleLabel?: string
}) {
  const router = useRouter()
  const { toggleItem, isWishlisted } = useWishlistStore()
  const { addItem, openCart } = useCartStore()
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>("")
  
  const images = product.images || []
  const thumbnail = images[0]?.url || "/placeholder.svg"
  const hoverImage = images[1]?.url || thumbnail
  
  const displayPrice = flashSalePrice ?? Number(product.price)
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null
  const hasSale = !!comparePrice || !!flashSalePrice

  const isNew = product.isNew || false
  const isBestseller = product.isBestseller || false

  const wishlisted = isWishlisted(product.id)

  const handleWishlist = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      comparePrice,
      image: thumbnail,
      category: product.category?.name
    })
  }

  const sizes = Array.from(new Set(product.variants?.map((v: any) => v.size).filter(Boolean) || []))

  const handleQuickAdd = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (sizes.length === 0) {
      addItem({
        id: product.id,
        variantId: product.id,
        productId: product.id,
        productSlug: product.slug,
        name: product.name,
        price: displayPrice,
        image: thumbnail,
        quantity: 1,
        size: "",
        color: "",
      })
      openCart()
    } else {
      setIsQuickAddOpen(true)
    }
  }

  const handleConfirmAdd = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!selectedSize) return
    const variant = product.variants?.find((v: any) => v.size === selectedSize)
    const vId = variant ? variant.id : product.id;
    addItem({
      id: vId,
      variantId: vId,
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      price: displayPrice,
      image: thumbnail,
      size: selectedSize,
      color: variant?.color || "",
      quantity: 1,
    })
    setIsQuickAddOpen(false)
    openCart()
    setSelectedSize("")
  }

  return (
    <div className="group flex flex-col relative h-full">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-bindu-light-grey mb-4">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {hasSale && (
             <span className="bg-bindu-red text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-sm">
               Sale
             </span>
          )}
          {isNew && (
             <span className="bg-bindu-navy text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-sm">
               New
             </span>
          )}
          {isBestseller && (
             <span className="bg-bindu-text-dark text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-sm">
               Bestseller
             </span>
          )}
        </div>

        <Link href={`/shop/${product.slug}`} className="block w-full h-full">
           <Image
             src={thumbnail}
             alt={product.name}
             fill
             sizes="(max-width: 768px) 50vw, 33vw"
             className="object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0"
           />
           <Image
             src={hoverImage}
             alt={product.name}
             fill
             sizes="(max-width: 768px) 50vw, 33vw"
             className="object-cover absolute inset-0 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
           />
        </Link>

        {/* Hover Actions (Desktop) */}
        <div className="absolute bottom-4 left-0 right-0 px-4 opacity-0 translate-y-4 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 hidden md:flex gap-2">
           <button onClick={handleQuickAdd} className="flex-1 bg-white/90 backdrop-blur text-bindu-navy font-bold text-xs uppercase tracking-widest py-3 hover:bg-bindu-navy hover:text-white transition-colors flex items-center justify-center gap-2 shadow-sm">
             <ShoppingBag className="w-4 h-4" /> Quick Add
           </button>
           <button onClick={handleWishlist} className={`w-12 bg-white/90 backdrop-blur flex items-center justify-center transition-colors shadow-sm ${wishlisted ? 'text-bindu-red' : 'text-bindu-navy hover:bg-bindu-red hover:text-white'}`}>
             <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
           </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="flex flex-col flex-1 px-1">
        <div className="flex justify-between items-start mb-1">
          <Link href={`/shop/${product.slug}`} className="font-heading font-medium text-bindu-navy text-sm md:text-base leading-tight hover:text-bindu-orange transition-colors">
            {product.name}
          </Link>
          {/* Mobile Wishlist icon */}
          <button onClick={handleWishlist} className={`md:hidden transition-colors ml-2 shrink-0 ${wishlisted ? 'text-bindu-red' : 'text-bindu-text-muted hover:text-bindu-red'}`}>
             <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 mt-1 mb-2">
           <span className="font-mono font-medium text-bindu-navy text-sm">৳{displayPrice.toLocaleString()}</span>
           {hasSale && (
             <span className="font-mono text-xs text-bindu-text-muted line-through">৳{comparePrice?.toLocaleString()}</span>
           )}
        </div>

        {/* Color Swatches */}
        {product.variants && (
           <div className="flex items-center gap-1.5 mt-auto pt-2">
              {Array.from(new Set(product.variants.map((v: any) => v.colorHex).filter(Boolean))).map((hex: any, idx) => (
                 <div key={idx} className="w-3.5 h-3.5 rounded-full border border-bindu-border-grey cursor-pointer hover:border-bindu-navy transition-colors" style={{ backgroundColor: hex }}></div>
              ))}
           </div>
        )}
      </div>

      {/* Quick Add Modal */}
      <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
        <DialogContent className="sm:max-w-md bg-bindu-white border-bindu-border-grey p-6 rounded-none">
          <DialogHeader>
            <DialogTitle className="font-heading font-bold uppercase tracking-tight text-xl mb-4">
              Select Size
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-20 relative bg-bindu-light-grey overflow-hidden shrink-0 border border-bindu-border-grey">
                <Image src={thumbnail} alt={product.name} fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-heading font-medium text-bindu-navy">{product.name}</h4>
                <p className="font-mono text-bindu-navy font-bold mt-1">৳{displayPrice.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-bindu-navy uppercase tracking-widest">Size</span>
                <Link href="/size-guide" className="text-xs text-bindu-text-muted hover:text-bindu-navy underline underline-offset-4">
                  Size Guide
                </Link>
              </div>
              <div className="flex gap-3">
                {sizes.map((s) => (
                  <button
                    key={s as string}
                    onClick={() => setSelectedSize(s as string)}
                    className={`w-12 h-12 flex items-center justify-center font-mono text-sm border transition-colors ${
                      selectedSize === s
                        ? "border-bindu-navy bg-bindu-navy text-bindu-white"
                        : "border-bindu-border-grey text-bindu-navy hover:border-bindu-navy"
                    }`}
                  >
                    {s as string}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirmAdd}
              disabled={!selectedSize}
              className="w-full bg-bindu-orange hover:bg-bindu-orange/90 text-bindu-white font-bold py-4 uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              Add to Cart
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
