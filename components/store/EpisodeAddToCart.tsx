"use client"

import { useState } from "react"
import { useCartStore } from "@/store/useCartStore"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function EpisodeAddToCart({ product, releaseAt }: { product: any; releaseAt: string | null }) {
  const variants = product.variants || []
  const addItem = useCartStore((s) => s.addItem)
  const router = useRouter()

  const rawSizes = Array.from(new Set(variants.map((v: any) => v.size))) as string[]
  const sizes = rawSizes.sort((a, b) => {
    const nA = parseInt(a) || 0, nB = parseInt(b) || 0
    return nA !== nB ? nA - nB : a.localeCompare(b)
  })

  const [selected, setSelected] = useState<string | null>(sizes[0] || null)

  const variant = variants.find((v: any) => v.size === selected)
  const inStock = variant && variant.stock > 0
  const isReleased = !releaseAt || new Date(releaseAt) <= new Date()

  const add = () => {
    if (!isReleased) return toast.error("This product hasn't been released yet.")
    if (!variant || !inStock) return toast.error("Select an in-stock size.")
    addItem({
      id: variant.id,
      variantId: variant.id,
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      price: Number(variant.price ?? product.price),
      size: selected!,
      color: variant.color || "Default",
      image: product.images?.[0]?.url || "",
      quantity: 1,
    })
    toast.success(`Added to cart — ${product.name} / ${selected}`)
  }

  const buyNow = () => { add(); router.push("/checkout") }

  return (
    <div className="space-y-3">
      {/* Size picker */}
      {sizes.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const v = variants.find((v: any) => v.size === size)
            const ok = v && v.stock > 0
            return (
              <button
                key={size}
                onClick={() => setSelected(size)}
                disabled={!ok}
                className={`px-3 py-2 text-xs font-bold uppercase tracking-widest border transition-colors
                  ${selected === size ? "border-bindu-cyan bg-bindu-cyan text-bindu-black" : "border-white/15 text-white hover:border-white/40"}
                  ${!ok ? "opacity-30 cursor-not-allowed" : ""}`}
              >
                {size}
              </button>
            )
          })}
        </div>
      )}

      <button
        onClick={buyNow}
        disabled={!inStock || !isReleased}
        className="w-full py-4 text-xs font-black uppercase tracking-widest bg-bindu-cyan text-bindu-black hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Get This Piece →
      </button>
      <button
        onClick={add}
        disabled={!inStock || !isReleased}
        className="w-full py-3 text-xs font-bold uppercase tracking-widest border border-white/15 text-white hover:border-white/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Add to Cart
      </button>
    </div>
  )
}
