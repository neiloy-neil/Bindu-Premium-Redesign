"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { useCartStore } from "@/store/useCartStore"
import { trackAddToCart } from "@/lib/analytics"
import NotifyMeForm from "@/components/store/NotifyMeForm"
import { DropCountdown } from "@/components/store/DropCountdown"

export default function VariantSelector({
  product,
  attr1Label = "Size",
  attr2Label = "Color",
  categoryId,
  basePrice,
  comparePrice,
  flashSale,
  releaseAt,
}: {
  product: any
  attr1Label?: string
  attr2Label?: string
  categoryId?: string
  basePrice: number
  comparePrice?: number | null
  flashSale?: any | null
  releaseAt?: string | null
}) {
  const variants = product.variants || []
  const { addItem, openCart } = useCartStore()
  const router = useRouter()

  // Drop lock: re-check every second so page unlocks automatically at release time
  const [isLocked, setIsLocked] = useState(() =>
    !!releaseAt && new Date(releaseAt).getTime() > Date.now()
  )
  useEffect(() => {
    if (!releaseAt) return
    const id = setInterval(() => {
      setIsLocked(new Date(releaseAt).getTime() > Date.now())
    }, 1000)
    return () => clearInterval(id)
  }, [releaseAt])

  const rawSizes = Array.from(new Set(variants.map((v: any) => v.size))) as string[]
  // Sort by leading number so "1pcs < 2pcs Combo < 4pcs Combo" etc.
  const sizes = rawSizes.sort((a: string, b: string) => {
    const numA = parseInt(a) || 0
    const numB = parseInt(b) || 0
    return numA !== numB ? numA - numB : a.localeCompare(b)
  })
  const rawColors = Array.from(new Set(variants.map((v: any) => v.color))) as string[]
  // Hide color selector when the only option is a placeholder value like "Default"
  const colors = rawColors.length === 1 && /^default$/i.test(rawColors[0]) ? [] : rawColors

  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] || null)
  // Use rawColors[0] so the variant lookup still matches even when the color UI is hidden
  const [selectedColor, setSelectedColor] = useState<string | null>(rawColors[0] || null)

  const activeVariant = useMemo(() => {
    return variants.find((v: any) => v.size === selectedSize && v.color === selectedColor)
  }, [selectedSize, selectedColor, variants])

  const stock = activeVariant?.stock || 0
  const isOutOfStock = stock === 0

  // Compute price that updates with variant selection
  const variantBasePrice = activeVariant ? Number(activeVariant.price ?? basePrice) : basePrice
  const currentPrice = useMemo(() => {
    const vp = activeVariant ? Number(activeVariant.price ?? basePrice) : basePrice
    if (!flashSale) return vp
    if (flashSale.discountType === "PERCENTAGE") return Math.round(vp * (1 - Number(flashSale.discountValue) / 100))
    return Math.max(0, vp - Number(flashSale.discountValue))
  }, [activeVariant, basePrice, flashSale])

  const strikePrice = useMemo(() => {
    if (flashSale) return variantBasePrice
    // Variant-level compare price takes priority over product-level
    if (activeVariant?.comparePrice) return Number(activeVariant.comparePrice)
    // Show product-level comparePrice whenever no variant-specific comparePrice exists
    if (comparePrice) return comparePrice
    return null
  }, [activeVariant, comparePrice, flashSale, variantBasePrice])

  const addToCart = () => {
    if (!activeVariant) return toast.error("Please select a variant.")
    if (isOutOfStock) return toast.error("This item is currently out of stock.")

    const price = activeVariant.price ?? product.price
    const image = product.images?.[0]?.url || ""

    addItem({
      id: activeVariant.id,
      variantId: activeVariant.id,
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      price: Number(price),
      size: selectedSize!,
      color: selectedColor!,
      image,
      quantity: 1,
    })

    trackAddToCart({
      productId: product.id,
      variantSku: activeVariant.sku,
      name: product.name,
      price: Number(price),
      quantity: 1,
      size: selectedSize!,
      color: selectedColor!,
      category: product.category?.name,
    })

    toast.success(`Added to cart!`, {
      description: `${product.name} — ${selectedSize} / ${selectedColor}`,
    })
    openCart()
  }

  const handleBuyNow = () => {
    if (!activeVariant) return toast.error("Please select a variant.")
    if (isOutOfStock) return toast.error("This item is currently out of stock.")
    addToCart()
    router.push("/checkout")
  }

  return (
    <div className="space-y-8">
      {/* Dynamic price — updates on variant change */}
      <div className="flex items-center gap-4">
        <span className="font-mono text-2xl font-bold text-bindu-navy">৳{currentPrice.toLocaleString()}</span>
        {strikePrice && strikePrice !== currentPrice && (
          <span className="font-mono text-lg text-bindu-text-muted line-through">
            ৳{Math.round(strikePrice).toLocaleString()}
          </span>
        )}
        {flashSale && (
          <span className="bg-bindu-red text-white px-2 py-1 text-xs font-bold rounded uppercase tracking-widest">
            {flashSale.discountType === "PERCENTAGE" ? `${flashSale.discountValue}% off` : `৳${flashSale.discountValue} off`}
          </span>
        )}
        {!flashSale && strikePrice && strikePrice > currentPrice && (
          <span className="bg-bindu-red/10 text-bindu-red px-2 py-1 text-xs font-bold rounded uppercase tracking-widest">
            {Math.round(((strikePrice - currentPrice) / strikePrice) * 100)}% off
          </span>
        )}
      </div>

      {/* Colors / Attribute 2 */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-bindu-navy">{attr2Label}</h3>
            <span className="text-xs text-bindu-text-muted">{selectedColor}</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {colors.map(color => {
              const hasStock = variants.some((v: any) => v.color === color && v.stock > 0)
              const variant = variants.find((v: any) => v.color === color)
              const isActive = selectedColor === color

              const hexMap: Record<string, string> = {
                'Black': '#000000', 'White': '#FFFFFF', 'Navy': '#1e3a8a', 'Olive': '#4d7c0f', 'Beige': '#f5f5dc'
              }
              const colorHex = variant?.colorHex || hexMap[color] || '#cccccc'

              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  disabled={!hasStock}
                  title={color}
                  className={`relative w-11 h-11 rounded-full border transition-all duration-300 flex items-center justify-center
                    ${isActive ? 'scale-110 shadow-sm' : 'border-transparent hover:scale-110 hover:shadow-sm'}
                    ${!hasStock ? 'opacity-30 cursor-not-allowed' : ''}`}
                  style={{ backgroundColor: colorHex, border: isActive ? '2px solid #0f172a' : colorHex === '#FFFFFF' ? '1px solid #e5e7eb' : 'none' }}
                >
                  {!hasStock && (
                    <div className="absolute inset-0 w-full h-full border-t border-bindu-red transform rotate-45 pointer-events-none" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Sizes / Attribute 1 */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-bindu-navy">{attr1Label}</h3>
            <Link href="/size-guide" target="_blank" className="text-xs text-bindu-text-muted underline underline-offset-4 hover:text-bindu-orange">Size Guide</Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {sizes.map(size => {
              const specificVariant = variants.find((v: any) => v.size === size && v.color === selectedColor)
              const hasStock = specificVariant && specificVariant.stock > 0
              const isActive = selectedSize === size

              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!hasStock}
                  className={`relative flex flex-col items-center justify-center border transition-all duration-300 h-14
                    ${isActive ? 'border-bindu-navy bg-bindu-navy text-white' : 'border-bindu-border-grey bg-bindu-light-grey text-bindu-navy hover:border-bindu-navy/50'}
                    ${!hasStock ? 'opacity-40 cursor-not-allowed bg-bindu-light-grey' : ''}`}
                >
                  <span className="text-xs font-medium">{size}</span>
                  {hasStock && specificVariant.stock <= 5 && (
                    <span className={`text-[10px] mt-0.5 ${isActive ? 'text-white/70' : 'text-bindu-red'}`}>
                      {specificVariant.stock} left
                    </span>
                  )}
                  {hasStock && specificVariant.stock > 5 && isActive && (
                    <span className="text-[10px] mt-0.5 text-white/70">
                      In stock
                    </span>
                  )}
                  {!hasStock && (
                    <div className="absolute inset-0 w-full h-full border-t border-bindu-border-grey transform rotate-12 pointer-events-none" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Action */}
      <div className="pt-4 space-y-3 sticky bottom-0 left-0 right-0 z-40 bg-bindu-white md:static md:bg-transparent p-4 -mx-4 md:p-0 md:mx-0 border-t border-bindu-border-grey md:border-t-0">
        {isLocked && releaseAt ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 py-3 px-4 bg-bindu-light-grey border border-bindu-border-grey">
              <span className="w-2 h-2 rounded-full bg-bindu-orange animate-pulse shrink-0" />
              <p className="text-xs font-bold uppercase tracking-widest text-bindu-orange">Drop Incoming</p>
            </div>
            <DropCountdown releaseAt={releaseAt} />
            <button
              disabled
              className="w-full py-4 text-sm font-bold uppercase tracking-widest bg-bindu-light-grey text-bindu-text-muted border border-bindu-border-grey cursor-not-allowed"
            >
              Locked Until Drop
            </button>
            <p className="text-xs text-bindu-text-muted text-center">
              This product unlocks automatically when the countdown hits zero.
            </p>
          </div>
        ) : !isOutOfStock ? (
          <>
            <button
              onClick={handleBuyNow}
              disabled={!activeVariant}
              className="clip-hex w-full py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 bg-bindu-orange text-white hover:bg-bindu-navy disabled:opacity-50"
            >
              Buy Now
            </button>
            <button
              onClick={addToCart}
              disabled={!activeVariant}
              className="clip-hex w-full py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 bg-bindu-navy text-white hover:bg-bindu-orange"
            >
              Add to Cart
            </button>
            {/* COD & delivery reassurance */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 text-xs text-bindu-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Cash on Delivery
              </span>
              <span>·</span>
              <span>Delivered in 3–5 days</span>
              <span>·</span>
              <span>Simple Returns</span>
            </div>
          </>
        ) : (
          <NotifyMeForm variantId={activeVariant?.id || ""} />
        )}

        {stock > 0 && stock <= 5 && (
          <p className="text-xs font-medium text-bindu-red flex items-center justify-center gap-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-bindu-red block" />
            Only {stock} left in stock — order soon!
          </p>
        )}
      </div>
    </div>
  )
}
