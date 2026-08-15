"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Search, ShoppingBag, Check, Package, Truck, Home, Ban } from "lucide-react"
import { toast } from "sonner"

const STATUS_STEPS = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"] as const

const STATUS_META: Record<string, { label: string; icon: any }> = {
  PENDING: { label: "Order Placed", icon: ShoppingBag },
  CONFIRMED: { label: "Confirmed", icon: Check },
  PACKED: { label: "Packed", icon: Package },
  SHIPPED: { label: "Shipped", icon: Truck },
  DELIVERED: { label: "Delivered", icon: Home },
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") || "")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [searched, setSearched] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch("/api/store/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, phone }),
      })
      const data = await res.json()
      if (!res.ok) {
        setOrder(null)
        toast.error(data.error || "Order not found")
      } else {
        setOrder(data)
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const currentIdx = order ? STATUS_STEPS.indexOf(order.status) : -1

  return (
    <div className="bg-bindu-light-grey min-h-screen animate-in fade-in duration-500">

      {/* Header */}
      <div className="border-b border-bindu-border-grey py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-bindu-orange mb-4">Delivery</p>
          <h1 className="font-heading font-black text-bindu-navy uppercase leading-none tracking-tight mb-5" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
            Track Order
          </h1>
          <p className="text-bindu-text-muted text-sm">Enter your order number and phone number to check delivery status.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl py-16 md:py-20">

        <form onSubmit={handleSubmit} className="bg-bindu-white border border-bindu-border-grey p-6 md:p-8 space-y-5 mb-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Order Number</label>
              <input
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="ORD-2026-0001"
                className="w-full bg-bindu-light-grey border border-bindu-border-grey focus:border-bindu-orange px-4 py-3 text-sm text-bindu-navy outline-none transition-all placeholder:text-bindu-text-muted"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Phone Number</label>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-bindu-light-grey border border-bindu-border-grey focus:border-bindu-orange px-4 py-3 text-sm text-bindu-navy outline-none transition-all placeholder:text-bindu-text-muted"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-bindu-navy text-bindu-white font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-bindu-orange transition-all duration-300 text-xs disabled:opacity-50"
          >
            <Search className="w-4 h-4" /> {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {searched && !loading && !order && (
          <div className="text-center py-12 text-bindu-text-muted text-sm">
            No order found with that order number and phone number. Double check and try again.
          </div>
        )}

        {order && (
          <div className="space-y-px animate-in fade-in duration-300">

            {/* Status */}
            <div className="bg-bindu-white border border-bindu-border-grey p-6 md:p-8">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-bindu-text-muted mb-1">Order</p>
                  <p className="font-mono font-bold text-lg text-bindu-navy">{order.orderNumber}</p>
                </div>
                <p className="text-sm text-bindu-text-muted">{new Date(order.createdAt).toLocaleDateString("en-BD")}</p>
              </div>

              {order.status === "CANCELLED" || order.status === "RETURNED" ? (
                <div className="flex items-center gap-3 text-bindu-error">
                  <Ban className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-wide text-sm">Order {order.status === "CANCELLED" ? "Cancelled" : "Returned"}</span>
                </div>
              ) : (
                <div className="flex items-start justify-between relative">
                  <div className="absolute top-5 left-0 right-0 h-px bg-bindu-border-grey" />
                  {STATUS_STEPS.map((step) => {
                    const isDone = currentIdx >= STATUS_STEPS.indexOf(step)
                    const Icon = STATUS_META[step].icon
                    return (
                      <div key={step} className="relative flex flex-col items-center gap-2 flex-1 z-10">
                        <div
                          className={`w-10 h-10 flex items-center justify-center border-2 transition-colors ${
                            isDone ? "bg-bindu-navy border-bindu-navy text-bindu-white" : "bg-bindu-white border-bindu-border-grey text-bindu-text-muted"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <p className={`text-[9px] font-bold uppercase tracking-widest text-center ${isDone ? "text-bindu-navy" : "text-bindu-text-muted"}`}>
                          {STATUS_META[step].label}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}

              {order.delivery?.trackingCode && (
                <div className="mt-8 pt-6 border-t border-bindu-border-grey text-sm">
                  <span className="text-bindu-text-muted">Courier: </span>
                  <span className="font-medium text-bindu-navy">{order.delivery.courier}</span>
                  <span className="text-bindu-text-muted"> · Tracking: </span>
                  <span className="font-mono text-bindu-navy">{order.delivery.trackingCode}</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="bg-bindu-white border border-bindu-border-grey p-6 md:p-8">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-bindu-text-muted border-l-2 border-bindu-orange pl-3 mb-6">
                Items
              </p>
              <div className="space-y-5">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className="relative h-16 w-12 bg-bindu-light-grey border border-bindu-border-grey shrink-0 overflow-hidden">
                      {item.image && <Image src={item.image} alt={item.productName} fill sizes="48px" className="object-cover" />}
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-bindu-navy">{item.productName}</p>
                      <p className="text-bindu-text-muted text-xs mt-0.5">{item.size} / {item.color} · Qty {item.quantity}</p>
                    </div>
                    <span className="font-mono text-sm text-bindu-navy">৳{(Number(item.price) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-bindu-border-grey flex justify-between font-bold text-bindu-navy">
                <span className="uppercase tracking-wide text-sm">Total</span>
                <span className="font-mono">৳{Number(order.total).toLocaleString()}</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
