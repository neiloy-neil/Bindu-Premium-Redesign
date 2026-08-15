"use client"

import { useCartStore } from "@/store/useCartStore"
import { Trash2, Minus, Plus, ShoppingBag, ShieldCheck, ArrowRight, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function CartPage() {
  const { items, removeItem, updateQuantity, appliedCoupon: storeCoupon, setAppliedCoupon } = useCartStore()
  const [coupon, setCoupon] = useState("")
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [appliedCode, setAppliedCode] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)

  // Hydrate coupon UI from persisted store on mount
  useEffect(() => {
    if (storeCoupon) {
      setCoupon(storeCoupon.couponCode)
      setAppliedCode(storeCoupon.couponCode)
      setCouponDiscount(storeCoupon.discount)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [useLoyalty, setUseLoyalty] = useState(false)
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number | null>(null)
  const [autoDiscount, setAutoDiscount] = useState<{ name: string; savingAmount: number; discountPct: number } | null>(null)

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.free_shipping_above) setFreeShippingThreshold(Number(d.free_shipping_above))
      })
      .catch(() => {})
  }, [])

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  // Re-check auto discounts whenever cart changes
  useEffect(() => {
    if (!items.length) { setAutoDiscount(null); return }
    fetch("/api/store/auto-discount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({
          variantId: i.variantId, productId: i.productId, quantity: i.quantity, price: i.price,
        })),
        subtotal,
      }),
    })
      .then((r) => r.json())
      .then((d) => setAutoDiscount(d.discount || null))
      .catch(() => {})
  }, [items.length, subtotal])

  const loyaltyPoints = 0 // Fetched at checkout when user is authenticated
  const loyaltyValue = useLoyalty ? Math.min(loyaltyPoints * 0.1, subtotal * 0.2) : 0
  const autoDiscountAmount = autoDiscount?.savingAmount || 0
  const finalTotal = subtotal - loyaltyValue - couponDiscount - autoDiscountAmount

  const remainingForFreeShipping = freeShippingThreshold ? Math.max(0, freeShippingThreshold - subtotal) : 0
  const freeShippingProgress = freeShippingThreshold ? Math.min(100, (subtotal / freeShippingThreshold) * 100) : 0

  async function handleApplyCoupon() {
    if (!coupon.trim()) return
    setCouponLoading(true)
    try {
      const res = await fetch("/api/store/apply-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon.trim(), items: items.map(i => ({ variantId: i.variantId, productId: i.productId, price: i.price, quantity: i.quantity })) }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Invalid coupon")
        setCouponDiscount(0)
        setAppliedCode("")
        setAppliedCoupon(null)
      } else {
        setCouponDiscount(data.discount)
        setAppliedCode(data.couponCode)
        setAppliedCoupon(data)
        toast.success(`Coupon applied! You save ৳${data.discount.toLocaleString()}`)
      }
    } catch {
      toast.error("Failed to apply coupon")
    } finally {
      setCouponLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-bindu-light-grey min-h-screen">
      <div className="container mx-auto px-4 py-24 md:py-32 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-bindu-white border border-bindu-border-grey flex items-center justify-center text-bindu-text-muted mb-8">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-bindu-navy mb-4">Your Bag is Empty</h1>
        <p className="text-bindu-text-muted max-w-md mb-8">
          Looks like you haven't added anything to your bag yet. Let's get you started with our latest arrivals.
        </p>
        <Link href="/shop">
          <button className="px-8 py-4 bg-bindu-navy text-bindu-white font-bold uppercase tracking-widest hover:bg-bindu-orange transition-all duration-300">
            Shop New Arrivals
          </button>
        </Link>
      </div>
      </div>
    )
  }

  return (
    <div className="bg-bindu-light-grey min-h-screen animate-in fade-in duration-500">
    <div className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-bindu-navy mb-2">Your Bag</h1>
      <p className="text-sm text-bindu-text-muted mb-8 uppercase tracking-widest font-medium">{items.length} Items</p>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* Cart Items */}
        <div className="lg:w-2/3 space-y-8">
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-6 border-b border-bindu-border-grey pb-8">
              <Link href={`/shop/${item.productSlug}`} className="relative w-32 md:w-40 aspect-[3/4] shrink-0 bg-bindu-white border border-bindu-border-grey overflow-hidden block">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill sizes="160px" className="object-cover" />
              </Link>
              
              <div className="flex-1 flex flex-col justify-between py-2">
                <div className="flex flex-col md:flex-row md:justify-between gap-2">
                  <div>
                    <h3 className="font-heading font-bold text-lg md:text-xl text-bindu-navy line-clamp-2 hover:text-bindu-orange transition-colors">
                      <Link href={`/shop/${item.productSlug}`}>{item.name}</Link>
                    </h3>
                    <p className="text-sm text-bindu-text-muted mt-2">Color: {item.color}</p>
                    <p className="text-sm text-bindu-text-muted mt-1">Size: {item.size}</p>
                  </div>
                  <p className="font-mono font-bold text-lg text-bindu-navy">৳{(item.price * item.quantity).toLocaleString()}</p>
                </div>
                
                <div className="flex items-end justify-between mt-6">
                  <div className="flex items-center border border-bindu-border-grey bg-bindu-white overflow-hidden">
                    <button
                      className="px-4 py-2 text-bindu-text-muted hover:bg-bindu-light-grey hover:text-bindu-navy transition-colors"
                      onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-bindu-navy">{item.quantity}</span>
                    <button
                      className="px-4 py-2 text-bindu-text-muted hover:bg-bindu-light-grey hover:text-bindu-navy transition-colors"
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.variantId)} 
                    className="text-sm text-bindu-text-muted underline underline-offset-4 hover:text-bindu-error transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-bindu-white border border-bindu-border-grey p-6 md:p-8 sticky top-24">
            <h2 className="text-2xl font-heading font-bold text-bindu-navy mb-6">Order Summary</h2>

            {freeShippingThreshold !== null && (
              <div className="mb-6 p-4 bg-bindu-light-grey border border-bindu-border-grey">
                {remainingForFreeShipping > 0 ? (
                  <p className="text-xs text-bindu-text-muted mb-2 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-bindu-orange" />
                    Add <span className="font-bold text-bindu-navy">৳{remainingForFreeShipping.toLocaleString()}</span> more for free shipping
                  </p>
                ) : (
                  <p className="text-xs text-bindu-success font-bold mb-2 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" /> You've unlocked free shipping!
                  </p>
                )}
                <div className="h-1.5 w-full bg-bindu-border-grey overflow-hidden">
                  <div
                    className="h-full bg-bindu-orange transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 border border-bindu-border-grey bg-bindu-white p-1">
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
                  className="bg-bindu-navy text-bindu-white text-xs font-bold uppercase tracking-widest px-4 py-3 hover:bg-bindu-orange transition-colors disabled:opacity-50"
                >
                  {couponLoading ? "..." : appliedCode ? "Applied" : "Apply"}
                </button>
              </div>

              <div className="flex items-center justify-between border border-bindu-border-grey bg-bindu-white p-4">
                <div>
                  <p className="text-sm font-bold text-bindu-navy">Use Bindu Premium Club Points</p>
                  <p className="text-xs text-bindu-text-muted mt-1">Available: {loyaltyPoints} (৳{(loyaltyPoints * 0.1).toLocaleString()})</p>
                </div>
                <Switch checked={useLoyalty} onCheckedChange={setUseLoyalty} />
              </div>
            </div>

            <div className="space-y-4 text-sm mb-6 border-b border-bindu-border-grey pb-6">
              <div className="flex justify-between">
                <span className="text-bindu-text-muted">Subtotal</span>
                <span className="font-mono text-bindu-navy">৳{subtotal.toLocaleString()}</span>
              </div>
              {autoDiscount && autoDiscountAmount > 0 && (
                <div className="flex justify-between text-bindu-success font-medium">
                  <span className="flex items-center gap-1">
                    <span className="text-xs">🎉</span> {autoDiscount.name}
                  </span>
                  <span className="font-mono">-৳{autoDiscountAmount.toLocaleString()}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-bindu-success font-medium">
                  <span>Coupon ({appliedCode})</span>
                  <span className="font-mono">-৳{couponDiscount.toLocaleString()}</span>
                </div>
              )}
              {useLoyalty && (
                <div className="flex justify-between text-bindu-success font-medium">
                  <span>Loyalty Discount</span>
                  <span className="font-mono">-৳{loyaltyValue.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-bindu-text-muted">Shipping</span>
                <span className="font-mono text-bindu-navy">{subtotal >= (freeShippingThreshold || 0) ? "Free" : "Calculated at checkout"}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-bindu-navy">Total</span>
              <span className="font-mono text-2xl font-bold text-bindu-navy">৳{finalTotal.toLocaleString()}</span>
            </div>

            <Link href="/checkout" className="block w-full">
              <button className="w-full py-4 bg-bindu-navy text-bindu-white font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-bindu-orange transition-all duration-300">
                Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <div className="mt-6 pt-6 border-t border-bindu-border-grey flex items-center justify-center gap-2 text-xs text-bindu-text-muted">
              <ShieldCheck className="w-4 h-4" /> Secure SSL Encrypted Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
