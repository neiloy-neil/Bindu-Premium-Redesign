"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Minus, Plus, Trash2, Tag, ChevronRight, Zap } from "lucide-react"
import { useCartStore } from "@/store/useCartStore"
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

type CartBump = {
  id: string
  headline: string
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

export default function CartDrawer({ itemCount: propItemCount, freeShippingThreshold }: { itemCount?: number, freeShippingThreshold?: number }) {
  const { items, removeItem, updateQuantity, addItem, isOpen, closeCart, openCart, appliedCoupon: storeCoupon, setAppliedCoupon } = useCartStore()
  const { items: recentlyViewed } = useRecentlyViewed()
  const recentItems = recentlyViewed.filter(p => !items.some(ci => ci.productId === p.id))
  const [bump, setBump] = useState<CartBump | null>(null)
  const [bumpAdded, setBumpAdded] = useState(false)
  const [coupon, setCoupon] = useState(storeCoupon?.couponCode ?? "")
  const [couponDiscount, setCouponDiscount] = useState(storeCoupon?.discount ?? 0)
  const [appliedCode, setAppliedCode] = useState(storeCoupon?.couponCode ?? "")
  const [couponLoading, setCouponLoading] = useState(false)

  useEffect(() => {
    if (!isOpen || bump) return
    fetch("/api/store/order-bumps")
      .then(r => r.json())
      .then(d => { if (d.bumps?.length) setBump(d.bumps[0]) })
      .catch(() => {})
  }, [isOpen])
  const [useLoyalty, setUseLoyalty] = useState(false)

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const itemCount = propItemCount ?? items.reduce((acc, item) => acc + item.quantity, 0)
  const loyaltyPoints = 0 // Fetched at checkout when user is authenticated
  const loyaltyValue = useLoyalty ? Math.min(loyaltyPoints * 0.1, subtotal * 0.2) : 0
  const finalTotal = subtotal - loyaltyValue - couponDiscount

  async function handleApplyCoupon() {
    if (!coupon.trim()) return
    setCouponLoading(true)
    try {
      const res = await fetch("/api/store/apply-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: coupon.trim(),
          items: items.map(i => ({ variantId: i.variantId, productId: i.productId, price: i.price, quantity: i.quantity })),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Invalid coupon")
        setCouponDiscount(0)
        setAppliedCode("")
        setAppliedCoupon(null)
      } else {
        setCouponDiscount(data.discount || 0)
        setAppliedCode(data.couponCode)
        setAppliedCoupon(data)
        toast.success(`Coupon applied! You save ৳${(data.discount || 0).toLocaleString()}`)
      }
    } catch {
      toast.error("Failed to apply coupon")
    } finally {
      setCouponLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => open ? openCart() : closeCart()}>
      <SheetTrigger render={
        <Button variant="ghost" size="icon-sm" aria-label="Open Cart" className="relative text-bindu-navy hover:text-bindu-orange">
          <ShoppingBag className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-bindu-orange text-bindu-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      } />
      
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0 border-l border-bindu-border-grey bg-bindu-white">
        <SheetHeader className="p-6 border-b border-bindu-border-grey">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-heading text-2xl">Your Bag</SheetTitle>
            <span className="text-xs uppercase tracking-widest text-bindu-text-muted font-bold">{items.length} items</span>
          </div>
          {/* Free Shipping Progress — only shown when free shipping is enabled */}
          {freeShippingThreshold != null && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-bindu-text-muted">
                {subtotal >= freeShippingThreshold ? "You've unlocked free shipping!" : `Add ৳${freeShippingThreshold - subtotal} more for free shipping`}
              </p>
              <div className="w-full h-1 bg-bindu-light-grey rounded-full overflow-hidden">
                <div
                  className="h-full bg-bindu-orange transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-bindu-light-grey flex items-center justify-center text-bindu-border-grey border border-bindu-border-grey">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-heading text-xl text-bindu-navy">Your bag is empty.</p>
              <p className="text-sm text-bindu-text-muted">Looks like you haven't added anything yet.</p>
              <button
                onClick={() => closeCart()}
                className="mt-4 border-b border-bindu-navy font-medium uppercase tracking-widest text-xs pb-1 text-bindu-navy hover:text-bindu-orange hover:border-bindu-orange transition-colors"
              >
                Continue Shopping
              </button>
              {recentItems.length > 0 && (
                <div className="mt-8 w-full text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted mb-4">Recently Viewed</p>
                  <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                    {recentItems.slice(0, 5).map(p => (
                      <Link key={p.id} href={`/shop/${p.slug}`} onClick={() => closeCart()} className="shrink-0 w-24 group">
                        <div className="relative aspect-[3/4] w-full bg-bindu-light-grey overflow-hidden rounded-sm mb-1.5 border border-bindu-border-grey">
                          {p.image && <Image src={p.image} alt={p.name} fill sizes="96px" className="object-cover group-hover:scale-105 transition-transform duration-500" />}
                        </div>
                        <p className="text-[10px] font-medium text-bindu-navy line-clamp-2 leading-snug">{p.name}</p>
                        <p className="text-[10px] font-mono mt-0.5 text-bindu-text-muted">৳{p.price.toLocaleString()}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {recentItems.length > 0 && (
                <div className="pb-4 border-b border-bindu-border-grey">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted mb-3">Recently Viewed</p>
                  <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
                    {recentItems.slice(0, 5).map(p => (
                      <Link key={p.id} href={`/shop/${p.slug}`} onClick={() => closeCart()} className="shrink-0 w-24 group">
                        <div className="relative aspect-[3/4] w-full bg-bindu-light-grey overflow-hidden rounded-sm mb-1.5 border border-bindu-border-grey">
                          {p.image && <Image src={p.image} alt={p.name} fill sizes="96px" className="object-cover group-hover:scale-105 transition-transform duration-500" />}
                        </div>
                        <p className="text-[10px] font-medium text-bindu-navy line-clamp-2 leading-snug">{p.name}</p>
                        <p className="text-[10px] font-mono mt-0.5 text-bindu-text-muted">৳{p.price.toLocaleString()}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4">
                  <Link href={`/shop/${item.productSlug}`} className="relative h-32 w-24 shrink-0 overflow-hidden bg-bindu-light-grey border border-bindu-border-grey rounded-sm block">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill sizes="96px" className="object-cover" />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link href={`/shop/${item.productSlug}`} className="font-medium text-sm text-bindu-navy line-clamp-2 hover:text-bindu-orange transition-colors">
                          {item.name}
                        </Link>
                        <button onClick={() => removeItem(item.variantId)} className="text-bindu-text-muted hover:text-bindu-error transition-colors mt-0.5">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-bindu-text-muted mt-1 uppercase tracking-wider">{item.size} / {item.color}</p>
                    </div>
                    
                    <div className="flex justify-between items-end mt-2">
                      <div className="flex items-center border border-bindu-border-grey rounded-full overflow-hidden bg-bindu-white">
                        <button 
                          className="px-3 py-1.5 text-bindu-text-muted hover:bg-bindu-light-grey hover:text-bindu-navy transition-colors"
                          onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium text-bindu-navy">{item.quantity}</span>
                        <button 
                          className="px-3 py-1.5 text-bindu-text-muted hover:bg-bindu-light-grey hover:text-bindu-navy transition-colors"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-mono font-medium text-bindu-navy">৳{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-bindu-border-grey bg-bindu-light-grey p-6 space-y-6">
            
            {/* Promo & Loyalty */}
            <div className="space-y-3">
              <div className="flex items-center border border-bindu-border-grey rounded-lg bg-bindu-white overflow-hidden p-1 shadow-sm">
                <Tag className="w-4 h-4 text-bindu-text-muted ml-2" />
                <input
                  type="text"
                  placeholder="Promo Code"
                  value={coupon}
                  onChange={(e) => { setCoupon(e.target.value); if (appliedCode) { setCouponDiscount(0); setAppliedCode(""); setAppliedCoupon(null) } }}
                  className="flex-1 bg-transparent px-3 text-sm text-bindu-navy focus:outline-none placeholder:text-bindu-text-muted"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !coupon.trim()}
                  className="bg-bindu-navy text-bindu-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-md hover:bg-bindu-orange transition-colors disabled:opacity-50"
                >
                  {couponLoading ? "..." : appliedCode ? "Applied" : "Apply"}
                </button>
              </div>
              
              <div className="flex items-center justify-between border border-bindu-border-grey rounded-lg bg-bindu-white p-3 shadow-sm">
                <div>
                  <p className="text-sm font-bold text-bindu-navy flex items-center gap-1">BINDU PREMIUM <span className="text-bindu-orange">Club</span></p>
                  <p className="text-xs text-bindu-text-muted">Use {loyaltyPoints} points for ৳{loyaltyValue.toLocaleString()} off</p>
                </div>
                <Switch checked={useLoyalty} onCheckedChange={setUseLoyalty} />
              </div>
            </div>
            
            {/* Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-bindu-text-muted">
                <span>Subtotal</span>
                <span className="font-mono">৳{subtotal.toLocaleString()}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-bindu-success">
                  <span>Coupon ({appliedCode})</span>
                  <span className="font-mono">-৳{couponDiscount.toLocaleString()}</span>
                </div>
              )}
              {useLoyalty && (
                <div className="flex justify-between text-bindu-success">
                  <span>Loyalty Points</span>
                  <span className="font-mono">-৳{loyaltyValue.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-bindu-border-grey text-bindu-navy">
                <span>Total</span>
                <span className="font-mono">৳{finalTotal.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Cart upsell */}
            {bump && !bumpAdded && items.length > 0 && (() => {
              const discountedPrice = Math.round(Number(bump.product.price) * (1 - bump.discountPct / 100))
              const variant = bump.product.variants.find(v => v.stock > 0) || bump.product.variants[0]
              if (!variant) return null
              return (
                <div className="border border-bindu-orange/30 rounded-xl overflow-hidden bg-bindu-orange/5">
                  <div className="bg-bindu-orange/10 px-3 py-1.5 flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-bindu-orange fill-bindu-orange" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-bindu-navy">Add to your order</span>
                  </div>
                  <div className="p-3 flex gap-3 items-center">
                    <div className="relative h-14 w-11 shrink-0 rounded overflow-hidden bg-bindu-light-grey border border-bindu-border-grey">
                      <Image src={bump.product.images[0]?.url || "/placeholder.svg"} alt={bump.product.name} fill sizes="44px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold line-clamp-1 text-bindu-navy">{bump.headline}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-sm font-bold text-bindu-orange">৳{discountedPrice.toLocaleString()}</span>
                        {bump.discountPct > 0 && <span className="font-mono text-xs text-bindu-text-muted line-through">৳{Number(bump.product.price).toLocaleString()}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        addItem({ id: variant.id, variantId: variant.id, productId: bump.product.id, productSlug: bump.product.slug, name: bump.product.name, size: variant.size, color: variant.color, price: discountedPrice, image: bump.product.images[0]?.url || "", quantity: 1 })
                        setBumpAdded(true)
                        toast.success("Added!")
                      }}
                      className="shrink-0 px-3 py-1.5 bg-bindu-navy text-bindu-white text-[11px] font-bold rounded-full hover:bg-bindu-orange transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              )
            })()}

            <div className="space-y-3">
              <Link href="/checkout" onClick={() => closeCart()} className="block">
                <button className="w-full py-4 bg-bindu-navy text-bindu-white font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-bindu-orange hover:shadow-lg hover:shadow-bindu-orange/20 transition-all duration-300 rounded-lg">
                  Secure Checkout <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/cart" onClick={() => closeCart()} className="block text-center text-xs text-bindu-text-muted hover:text-bindu-orange underline underline-offset-4 transition-colors">
                View Full Cart (Apply Coupons)
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
