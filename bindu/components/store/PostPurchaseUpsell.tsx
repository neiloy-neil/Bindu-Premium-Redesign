"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useCartStore } from "@/store/useCartStore"
import { toast } from "sonner"
import { Zap } from "lucide-react"

type Bump = {
  id: string
  headline: string
  description: string | null
  discountPct: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: { url: string }[]
    variants: { id: string; size: string; color: string; stock: number }[]
  }
}

export default function PostPurchaseUpsell({ orderTotal }: { orderTotal: number }) {
  const [bump, setBump] = useState<Bump | null>(null)
  const [added, setAdded] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const { addItem } = useCartStore()

  useEffect(() => {
    fetch("/api/store/order-bumps")
      .then(r => r.json())
      .then(d => {
        const eligible = (d.bumps || []).find((b: any) =>
          !b.triggerMinTotal || orderTotal >= Number(b.triggerMinTotal)
        )
        if (eligible) setBump(eligible)
      })
      .catch(() => {})
  }, [orderTotal])

  if (!bump || dismissed) return null

  const discountedPrice = Math.round(Number(bump.product.price) * (1 - bump.discountPct / 100))
  const defaultVariant = bump.product.variants.find(v => v.stock > 0) || bump.product.variants[0]

  const handleAdd = () => {
    if (!defaultVariant) return
    addItem({
      id: defaultVariant.id,
      variantId: defaultVariant.id,
      productId: bump.product.id,
      productSlug: bump.product.slug,
      name: bump.product.name,
      size: defaultVariant.size,
      color: defaultVariant.color,
      price: discountedPrice,
      image: bump.product.images[0]?.url || "",
      quantity: 1,
    })
    setAdded(true)
    toast.success("Added to your next order!")
  }

  return (
    <div className="mt-12 border-2 border-bindu-cyan/40 rounded-2xl overflow-hidden bg-bindu-cyan/5">
      <div className="bg-bindu-cyan/10 px-6 py-3 flex items-center gap-2">
        <Zap className="w-4 h-4 text-bindu-cyan fill-bindu-cyan" />
        <span className="text-xs font-bold uppercase tracking-widest text-bindu-black">Exclusive one-time offer</span>
      </div>
      <div className="p-6 flex gap-6 items-center">
        <div className="relative h-24 w-20 shrink-0 rounded-lg overflow-hidden bg-bindu-muted">
          <Image src={bump.product.images[0]?.url || "/placeholder.svg"} alt={bump.product.name} fill sizes="80px" className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base">{bump.headline}</p>
          {bump.description && <p className="text-sm text-bindu-text-muted mt-1">{bump.description}</p>}
          <div className="flex items-center gap-3 mt-2">
            <span className="font-mono font-bold text-lg text-bindu-cyan">৳{discountedPrice.toLocaleString()}</span>
            {bump.discountPct > 0 && (
              <>
                <span className="font-mono text-sm text-bindu-text-muted line-through">৳{Number(bump.product.price).toLocaleString()}</span>
                <span className="text-xs font-bold text-bindu-success bg-bindu-success/10 px-2 py-0.5 rounded">-{bump.discountPct}%</span>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          {added ? (
            <span className="px-4 py-2 text-sm font-bold text-bindu-success border border-bindu-success rounded-full">✓ Added!</span>
          ) : (
            <button onClick={handleAdd} className="px-4 py-2 bg-bindu-black text-white text-sm font-bold rounded-full hover:bg-bindu-cyan transition-colors whitespace-nowrap">
              Yes, add it!
            </button>
          )}
          <button onClick={() => setDismissed(true)} className="text-xs text-bindu-text-muted hover:text-bindu-black transition-colors text-center">
            No thanks
          </button>
        </div>
      </div>
    </div>
  )
}
