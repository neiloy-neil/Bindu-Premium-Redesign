"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingBag, Minus, Plus, Trash2, Tag, ChevronRight, Zap, X } from "lucide-react"
import { useCartStore } from "@/store/useCartStore"
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "./Button"

export default function PremiumCartDrawer({ itemCount: propItemCount, freeShippingThreshold }: { itemCount?: number, freeShippingThreshold?: number }) {
  const { items, removeItem, updateQuantity, addItem, isOpen, closeCart, openCart, appliedCoupon: storeCoupon, setAppliedCoupon } = useCartStore()
  const { items: recentlyViewed } = useRecentlyViewed()
  const recentItems = recentlyViewed.filter(p => !items.some(ci => ci.productId === p.id))
  
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const itemCount = propItemCount ?? items.reduce((acc, item) => acc + item.quantity, 0)
  
  const couponDiscount = storeCoupon?.discount ?? 0
  const finalTotal = subtotal - couponDiscount

  return (
    <Sheet open={isOpen} onOpenChange={(open) => open ? openCart() : closeCart()}>
      <SheetTrigger className="relative text-bindu-navy hover:text-bindu-orange transition-colors flex items-center gap-2">
        <ShoppingBag className="w-5 h-5" />
        <span className="text-sm font-medium hidden md:inline-block">Bag</span>
        {itemCount > 0 && (
          <span className="absolute -top-1.5 -right-2 bg-bindu-orange text-bindu-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </SheetTrigger>
      
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0 border-l border-bindu-border-grey bg-bindu-white rounded-none">
        <SheetHeader className="p-6 border-b border-bindu-border-grey flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="font-heading font-medium text-2xl text-bindu-navy">Shopping Bag</SheetTitle>
          <span className="text-xs uppercase tracking-widest text-bindu-text-muted font-bold">{items.length} items</span>
        </SheetHeader>
        
        {freeShippingThreshold != null && items.length > 0 && (
            <div className="bg-bindu-light-grey px-6 py-3 border-b border-bindu-border-grey">
              <p className="text-xs text-bindu-navy font-medium mb-2 text-center">
                {subtotal >= freeShippingThreshold ? "You have unlocked free shipping!" : `Add ৳${(freeShippingThreshold - subtotal).toLocaleString()} more for free shipping`}
              </p>
              <div className="w-full h-1 bg-bindu-border-grey overflow-hidden">
                <div
                  className="h-full bg-bindu-navy transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-16 h-16 flex items-center justify-center text-bindu-border-grey">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <p className="font-heading text-xl text-bindu-navy mb-2">Your bag is empty.</p>
                <p className="text-sm text-bindu-text-muted max-w-[250px] mx-auto">Discover our latest arrivals and elevate your wardrobe.</p>
              </div>
              <Button onClick={() => closeCart()} variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4 group">
                  <Link href={`/shop/${item.productSlug}`} className="relative h-[120px] w-[90px] shrink-0 bg-bindu-light-grey block">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill sizes="90px" className="object-cover" />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link href={`/shop/${item.productSlug}`} className="font-medium text-sm text-bindu-navy line-clamp-2 hover:text-bindu-orange transition-colors">
                          {item.name}
                        </Link>
                        <button onClick={() => removeItem(item.variantId)} className="text-bindu-text-muted hover:text-bindu-red transition-colors opacity-0 group-hover:opacity-100 md:opacity-100">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-bindu-text-muted mt-1 uppercase tracking-wider">{item.size} / {item.color}</p>
                    </div>
                    
                    <div className="flex justify-between items-end mt-2">
                      <div className="flex items-center border border-bindu-border-grey">
                        <button 
                          className="px-3 py-1.5 text-bindu-text-dark hover:bg-bindu-light-grey transition-colors"
                          onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-medium text-bindu-navy">{item.quantity}</span>
                        <button 
                          className="px-3 py-1.5 text-bindu-text-dark hover:bg-bindu-light-grey transition-colors"
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
          <div className="border-t border-bindu-border-grey bg-bindu-white p-6 space-y-6 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-10 relative">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-bindu-text-muted">
                <span>Subtotal</span>
                <span className="font-mono text-bindu-navy">৳{subtotal.toLocaleString()}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-bindu-orange">
                  <span>Discount</span>
                  <span className="font-mono">-৳{couponDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-3 border-t border-bindu-border-grey text-bindu-navy">
                <span>Total</span>
                <span className="font-mono">৳{finalTotal.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-bindu-text-muted uppercase tracking-wider text-right">Shipping & taxes calculated at checkout</p>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/checkout" onClick={() => closeCart()} className="block">
                <Button className="w-full h-14 text-sm" variant="default">
                  Secure Checkout
                </Button>
              </Link>
              <Link href="/cart" onClick={() => closeCart()} className="block">
                 <Button className="w-full h-12 text-xs" variant="outline">
                   View Full Bag
                 </Button>
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
