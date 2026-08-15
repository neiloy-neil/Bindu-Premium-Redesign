"use client"
import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"

export default function ProductCard({
  product,
  flashSalePrice,
  flashSaleLabel,
  avgRating,
  reviewCount,
}: {
  product: any
  flashSalePrice?: number
  flashSaleLabel?: string
  avgRating?: number | null
  reviewCount?: number | null
}) {
  const images = product.images || []
  const thumbnail = images[0]?.url || "/placeholder.svg"
  
  const displayPrice = flashSalePrice ?? Number(product.price)
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null
  const hasSale = !!comparePrice || !!flashSalePrice

  const sizes = Array.from(new Set(product.variants?.map((v: any) => v.size) || ["S", "M", "L", "XL"]))
  
  const totalStock = product.variants ? product.variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) : null
  const isOutOfStock = totalStock === 0
  
  return (
    <div className="bg-bindu-white border border-bindu-border-grey rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 relative group flex flex-col h-full">
      {isOutOfStock ? (
        <div className="absolute top-3 left-3 bg-bindu-text-muted text-white text-xs font-black px-2 py-1 rounded z-10">
          SOLD OUT
        </div>
      ) : hasSale ? (
        <div className="absolute top-3 left-3 bg-bindu-red text-white text-xs font-black px-2 py-1 rounded z-10">
          SALE
        </div>
      ) : null}
      <div className="absolute top-3 right-3 bg-bindu-navy/80 text-white text-[10px] font-bold px-2 py-1 rounded z-10 uppercase tracking-wider backdrop-blur">
        {product.category?.name || "POLO"}
      </div>
      
      <div className="relative aspect-square overflow-hidden bg-bindu-light-grey">
        <Link href={`/shop/${product.slug}`}>
           <Image
             src={thumbnail}
             alt={product.name}
             fill
             sizes="(max-width: 768px) 50vw, 25vw"
             className="object-cover group-hover:scale-105 transition-transform duration-500"
           />
        </Link>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2">
           <div className="flex text-bindu-orange">
             {[1,2,3,4,5].map(n => (
               <Star key={n} className={`w-3.5 h-3.5 ${n <= Math.round(avgRating || 5) ? "fill-current" : "text-bindu-border-grey"}`} />
             ))}
           </div>
           <span className="text-xs text-bindu-text-muted">({reviewCount || 0})</span>
        </div>
        
        <Link href={`/shop/${product.slug}`} className="font-heading font-bold text-bindu-navy text-sm md:text-base leading-tight mb-3 line-clamp-2 hover:text-bindu-orange transition-colors">
          {product.name}
        </Link>
        
        <div className="mt-auto">
          <div className="mb-3">
            <select defaultValue="" className="w-full text-sm font-bold bg-bindu-light-grey border border-bindu-border-grey rounded py-2 px-3 text-bindu-text-dark outline-none focus:border-bindu-navy transition-colors appearance-none cursor-pointer">
              <option value="" disabled>Select Size</option>
              {sizes.map((size: any) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between mb-4">
             <div className="flex flex-col">
                <span className="font-mono font-black text-xl text-bindu-red">৳{displayPrice.toLocaleString()}</span>
                {hasSale && (
                  <span className="font-mono text-xs text-bindu-text-muted line-through">৳{comparePrice?.toLocaleString()}</span>
                )}
             </div>
          </div>
          
          <button 
            disabled={isOutOfStock}
            className={`w-full font-bold py-3 rounded text-sm transition-colors uppercase tracking-wide
              ${isOutOfStock ? "bg-bindu-light-grey text-bindu-text-muted cursor-not-allowed border border-bindu-border-grey" : "bg-bindu-navy text-white hover:bg-bindu-orange"}`}
          >
            {isOutOfStock ? "Sold Out" : "Add to Bag"}
          </button>
        </div>
      </div>
    </div>
  )
}
