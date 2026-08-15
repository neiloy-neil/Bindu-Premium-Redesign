"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useCartStore } from "@/store/useCartStore"
import { useRouter } from "next/navigation"
import {
  Loader2, Tag, Gift, MessageSquare, ChevronDown, ChevronUp,
  Check, ShieldCheck, Star, Wallet, Calendar, Edit2,
} from "lucide-react"
import { trackInitiateCheckout, trackAddPaymentInfo } from "@/lib/analytics"
import { BD_GEO } from "@/lib/bd-geo"

type CheckoutField = {
  id: string
  label: string
  placeholder: string | null
  type: string
  options: string[]
  isRequired: boolean
  step: number
  sortOrder: number
}
type ShippingZone = { districts: string; charge: number; freeShippingAbove: number | null }

function resolveZoneRate(
  district: string,
  zones: ShippingZone[],
  fallback: number,
): { rate: number; freeAbove: number | null } {
  if (!district) return { rate: fallback, freeAbove: null }
  const matched = zones.find(z =>
    z.districts.split(",").map(d => d.trim().toLowerCase()).includes(district.trim().toLowerCase()),
  )
  return matched ? { rate: matched.charge, freeAbove: matched.freeShippingAbove } : { rate: fallback, freeAbove: null }
}

function AccordionStep({
  num, title, summary, children, activeStep, completedSteps, onOpen,
}: {
  num: number
  title: string
  summary?: string
  children: React.ReactNode
  activeStep: number
  completedSteps: Set<number>
  onOpen: (n: number) => void
}) {
  const isActive = activeStep === num
  const isDone = completedSteps.has(num)
  const isLocked = !isDone && num > activeStep

  return (
    <div className={`bg-bindu-white overflow-hidden border transition-all duration-200 ${isActive ? "border-bindu-orange" : "border-bindu-border-grey"}`}>
      <button
        type="button"
        onClick={() => !isLocked && onOpen(num)}
        disabled={isLocked}
        className={`w-full flex items-center gap-4 px-5 py-4 text-left ${!isLocked && !isActive ? "hover:bg-bindu-light-grey cursor-pointer" : "cursor-default"}`}
      >
        <div className={`w-8 h-8 flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
          isDone ? "bg-bindu-navy text-bindu-white" : isActive ? "bg-bindu-navy text-bindu-white" : "bg-bindu-light-grey text-bindu-text-muted"
        }`}>
          {isDone && !isActive ? <Check className="w-4 h-4" /> : num}
        </div>
        <div className="flex-1 min-w-0">
          <span className={`font-bold text-sm leading-tight block uppercase tracking-widest ${isLocked ? "text-bindu-border-grey" : "text-bindu-navy"}`}>{title}</span>
          {isDone && !isActive && summary && (
            <span className="text-xs text-bindu-text-muted truncate block mt-0.5 normal-case tracking-normal">{summary}</span>
          )}
        </div>
        {isDone && !isActive && (
          <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-bindu-orange uppercase tracking-widest">
            <Edit2 className="w-3 h-3" /> Edit
          </span>
        )}
      </button>
      {isActive && (
        <div className="border-t border-bindu-border-grey px-5 pt-5 pb-6 space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}

export default function CheckoutForm({
  freeShippingThreshold = null,
  shippingChargeAmount = 60,
  shippingZones = [],
  enabledPaymentMethods = ["COD", "BKASH", "NAGAD"],
  taxEnabled = false,
  taxRate = 0,
  taxLabel = "VAT",
  giftWrapEnabled = false,
  giftWrapCharge = 50,
  checkoutFields = [],
  loyaltyBalance = 0,
  loyaltyMaxDiscount = 0,
  storeCreditBalance = 0,
  userId,
  userEmail = "",
}: {
  freeShippingThreshold?: number | null
  shippingChargeAmount?: number
  shippingZones?: ShippingZone[]
  enabledPaymentMethods?: string[]
  taxEnabled?: boolean
  taxRate?: number
  taxLabel?: string
  giftWrapEnabled?: boolean
  giftWrapCharge?: number
  checkoutFields?: CheckoutField[]
  loyaltyBalance?: number
  loyaltyMaxDiscount?: number
  storeCreditBalance?: number
  userId?: string
  userEmail?: string
}) {
  const { items, clearCart, appliedCoupon: storeCoupon, setAppliedCoupon: setStoreCoupon } = useCartStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [stockIssues, setStockIssues] = useState<string[]>([])

  useEffect(() => {
    if (!items.length) return
    import("@/app/(store)/checkout/actions").then(m => {
      m.validateCartStock(items.map(i => ({ variantId: i.variantId, quantity: i.quantity, name: i.name, size: i.size })))
       .then(setStockIssues)
       .catch(() => {})
    })
  }, [items])

  // ── Accordion state ──
  const [activeStep, setActiveStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  // ── Address ──
  const [address, setAddress] = useState({
    name: "", phone: "", division: "", district: "", area: "", fullAddress: "",
  })
  const [guestEmail, setGuestEmail] = useState(userEmail)
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  // ── Account creation ──
  const [createAccount, setCreateAccount] = useState(false)
  const [accountPassword, setAccountPassword] = useState("")

  // ── Payment ──
  const [paymentMethod, setPaymentMethod] = useState(
    enabledPaymentMethods.includes("COD") ? "COD" : enabledPaymentMethods[0] || "COD",
  )
  const [depositInfo, setDepositInfo] = useState<{ required: boolean; amount: number } | null>(null)

  // ── Extras ──
  const [orderNote, setOrderNote] = useState("")
  const [giftWrap, setGiftWrap] = useState(false)
  const [giftMessage, setGiftMessage] = useState("")
  const [redeemPoints, setRedeemPoints] = useState(false)
  const [pointsToRedeem, setPointsToRedeem] = useState(0)
  const [redeemCredit, setRedeemCredit] = useState(false)
  const [creditToRedeem, setCreditToRedeem] = useState(0)
  const [customFields, setCustomFields] = useState<Record<string, string>>({})
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{
    couponId: string; couponCode: string; discount: number; message: string; freeShipping?: boolean
  } | null>(null)
  const [couponError, setCouponError] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)
  const [showCoupon, setShowCoupon] = useState(false)
  const [showExtras, setShowExtras] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState("")
  const [referralCode, setReferralCode] = useState("")

  // ── Pre-populate coupon from cart store (carried over from cart page) ──
  useEffect(() => {
    if (storeCoupon) {
      setAppliedCoupon(storeCoupon)
      setCouponCode(storeCoupon.couponCode)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Load saved addresses for logged-in users ──
  useEffect(() => {
    if (!userId) return
    fetch("/api/user/addresses")
      .then(r => r.json())
      .then(d => {
        const addrs = d.addresses || []
        if (!addrs.length) return
        setSavedAddresses(addrs)
        const def = addrs.find((a: any) => a.isDefault) || addrs[0]
        setSelectedAddressId(def.id)
        setAddress({ name: def.fullName, phone: def.phone, division: def.division, district: def.district, area: def.area, fullAddress: def.address })
      })
      .catch(() => {})
  }, [userId])

  // ── Deposit check silently when phone is complete ──
  useEffect(() => {
    if (address.phone.replace(/\D/g, "").length < 11) return
    const t = setTimeout(async () => {
      try {
        const res = await fetch("/api/store/deposit-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: address.phone, total }),
        })
        if (res.ok) setDepositInfo(await res.json())
      } catch { /* non-critical */ }
    }, 800)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address.phone])

  // ── Pricing ──
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
  const { rate: zoneRate, freeAbove: zoneFreeAbove } = resolveZoneRate(address.district, shippingZones, shippingChargeAmount)
  const effectiveFreeThreshold: number | null = zoneFreeAbove ?? freeShippingThreshold
  const shippingCharge = (effectiveFreeThreshold !== null && subtotal >= effectiveFreeThreshold) || appliedCoupon?.freeShipping ? 0 : zoneRate
  const taxAmount = taxEnabled ? Math.round((subtotal * taxRate) / 100) : 0
  const giftWrapAmount = giftWrap ? giftWrapCharge : 0
  const loyaltyDiscount = redeemPoints ? Math.min(pointsToRedeem, loyaltyMaxDiscount) : 0
  const creditDiscount = redeemCredit ? Math.min(creditToRedeem, storeCreditBalance) : 0
  const couponDiscount = appliedCoupon?.discount ?? 0
  const total = Math.max(0, subtotal + shippingCharge + taxAmount + giftWrapAmount - loyaltyDiscount - creditDiscount - couponDiscount)

  const minDeliveryDate = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0] })()
  const maxDeliveryDate = (() => { const d = new Date(); d.setDate(d.getDate() + 8); return d.toISOString().split("T")[0] })()

  // ── Accordion helpers ──
  const step1Valid = !!(
    address.name && address.phone && address.district && address.area && address.fullAddress &&
    (!createAccount || accountPassword.length >= 8)
  )

  const step1Summary = step1Valid
    ? `${address.name} · ${address.phone} · ${address.area}, ${address.district}`
    : ""

  const step2Labels: Record<string, string> = {
    COD: "Cash on Delivery", BKASH: "bKash", NAGAD: "Nagad", SSLCOMMERZ: "Card / Online Banking", UDDOKTAPAY: "UddoktaPay",
  }

  const openStep = (n: number) => {
    if (n < activeStep || completedSteps.has(n)) setActiveStep(n)
  }

  const continueStep1 = () => {
    if (!step1Valid) return
    setCompletedSteps(prev => new Set([...prev, 1]))
    setActiveStep(2)
  }

  const continueStep2 = () => {
    setCompletedSteps(prev => new Set([...prev, 2]))
    setActiveStep(3)
  }

  // ── Coupon ──
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    setCouponError("")
    try {
      const res = await fetch("/api/store/apply-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, items }),
      })
      const data = await res.json()
      if (!res.ok) { setCouponError(data.error); setAppliedCoupon(null); setStoreCoupon(null) }
      else { setAppliedCoupon(data); setStoreCoupon(data) }
    } catch { setCouponError("Failed to apply coupon") }
    finally { setCouponLoading(false) }
  }

  // ── Place order ──
  const handlePlaceOrder = async () => {
    setLoading(true)
    trackInitiateCheckout({ value: total, items: items.map(i => ({ productId: i.productId, variantSku: i.variantId, name: i.name, price: i.price, quantity: i.quantity })) })
    trackAddPaymentInfo(total)
    try {
      const orderRes = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items, address, paymentMethod, subtotal, shippingCharge, total,
          note: orderNote || null, giftWrap, giftMessage: giftWrap ? giftMessage : null,
          giftWrapCharge: giftWrapAmount, isGuest: !userId, guestEmail: guestEmail || null,
          userId: userId || null,
          loyaltyPointsRedeemed: redeemPoints ? Math.min(pointsToRedeem * 100, loyaltyBalance) : 0,
          loyaltyDiscount, storeCreditRedeemed: redeemCredit ? creditDiscount : 0,
          customFields: Object.keys(customFields).length > 0 ? customFields : null,
          couponId: appliedCoupon?.couponId || null, couponDiscount, deliveryDate: deliveryDate || null,
          referralCode: referralCode.trim() || null,
          createAccount: !userId && createAccount, accountPassword: !userId && createAccount ? accountPassword : undefined,
        }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error)

      if (paymentMethod === "COD" && orderData.depositAmount > 0) {
        const r = await fetch("/api/payments/bkash/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: orderData.orderId, type: "deposit" }) })
        const d = await r.json(); if (!r.ok) throw new Error(d.error)
        clearCart(); window.location.href = d.bkashURL
      } else if (paymentMethod === "BKASH") {
        const r = await fetch("/api/payments/bkash/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: orderData.orderId }) })
        const d = await r.json(); if (!r.ok) throw new Error(d.error)
        clearCart(); window.location.href = d.bkashURL
      } else if (paymentMethod === "NAGAD") {
        const r = await fetch("/api/payments/nagad/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: orderData.orderId }) })
        const d = await r.json(); if (!r.ok) throw new Error(d.error)
        clearCart(); window.location.href = d.nagadURL
      } else if (paymentMethod === "SSLCOMMERZ") {
        const r = await fetch("/api/payments/sslcommerz/init", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: orderData.orderId }) })
        const d = await r.json(); if (!r.ok) throw new Error(d.error)
        clearCart(); window.location.href = d.GatewayPageURL
      } else if (paymentMethod === "UDDOKTAPAY") {
        const r = await fetch("/api/payments/uddoktapay/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: orderData.orderId }) })
        const d = await r.json(); if (!r.ok) throw new Error(d.error)
        clearCart(); window.location.href = d.payment_url
      } else {
        clearCart()
        const params = new URLSearchParams({ placed: "1" })
        if (orderData.accountCreated) params.set("account_created", "1")
        router.push(`/order/${orderData.orderId}?${params.toString()}`)
      }
    } catch (error: any) {
      alert("Failed to place order: " + error.message)
      setLoading(false)
    }
  }

  // ── Empty cart ──
  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-bindu-white border border-bindu-border-grey">
        <h2 className="text-2xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">Your cart is empty</h2>
        <button
          onClick={() => router.push("/shop")}
          className="rounded-none shadow-md px-8 py-4 bg-bindu-navy text-bindu-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  const inputCls = "w-full bg-bindu-light-grey border border-bindu-border-grey focus:border-bindu-orange px-4 py-3 text-sm text-bindu-navy outline-none transition-all placeholder:text-bindu-border-grey"
  const selectCls = `${inputCls} [&>option]:bg-bindu-white [&>option]:text-bindu-navy`

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">

      {/* ── LEFT: Accordion ── */}
      <div className="w-full lg:w-[58%] space-y-px">

        {/* STEP 1 — Delivery */}
        <AccordionStep num={1} title="Delivery Details" summary={step1Summary} activeStep={activeStep} completedSteps={completedSteps} onOpen={openStep}>
          {savedAddresses.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-4 border-b border-bindu-border-grey">
              <span className="text-xs text-bindu-text-muted self-center font-medium uppercase tracking-widest">Saved:</span>
              {savedAddresses.map((a: any) => (
                <button key={a.id} type="button"
                  onClick={() => {
                    setSelectedAddressId(a.id)
                    setAddress({ name: a.fullName, phone: a.phone, division: a.division, district: a.district, area: a.area, fullAddress: a.address })
                  }}
                  className={`text-[11px] px-3 py-1.5 border transition-all ${selectedAddressId === a.id ? "border-bindu-orange bg-bindu-orange/10 text-bindu-orange font-bold" : "border-bindu-border-grey text-bindu-text-muted hover:border-bindu-orange"}`}
                >
                  {a.label || "Address"}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Email (for order updates)</label>
            <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} className={inputCls} placeholder="you@example.com" />
          </div>

          {!userId && (
            <div className={`border transition-all ${createAccount ? "border-bindu-orange bg-bindu-orange/10" : "border-dashed border-bindu-border-grey"}`}>
              <label className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createAccount}
                  onChange={e => { setCreateAccount(e.target.checked); setAccountPassword("") }}
                  className="w-4 h-4 accent-bindu-orange shrink-0"
                />
                <div>
                  <p className="text-sm font-bold text-bindu-navy">Save this order to an account</p>
                  <p className="text-xs text-bindu-text-muted">Track orders, reorder faster, earn loyalty points</p>
                </div>
              </label>
              {createAccount && (
                <div className="border-t border-bindu-orange/20 px-4 pb-4 pt-3 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Create Password</label>
                  <input
                    type="password"
                    value={accountPassword}
                    onChange={e => setAccountPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className={inputCls}
                  />
                  {accountPassword.length > 0 && accountPassword.length < 8 && (
                    <p className="text-xs text-bindu-error">Password must be at least 8 characters</p>
                  )}
                  <p className="text-xs text-bindu-text-muted">
                    Your account will use <strong className="text-bindu-navy">{guestEmail || "the email above"}</strong>. You can sign in after your order is placed.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Full Name *</label>
              <input required value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} className={inputCls} placeholder="Your full name" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Phone *</label>
              <input required value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} className={inputCls} placeholder="01XXXXXXXXX" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Division *</label>
              <select required value={address.division} onChange={e => setAddress({ ...address, division: e.target.value, district: "", area: "" })} className={selectCls}>
                <option value="">Select Division</option>
                {BD_GEO.map(div => <option key={div.name} value={div.name}>{div.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">District *</label>
              <select required value={address.district} onChange={e => setAddress({ ...address, district: e.target.value, area: "" })} className={selectCls} disabled={!address.division}>
                <option value="">Select District</option>
                {(BD_GEO.find(d => d.name === address.division)?.districts ?? []).map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Upazila / Thana *</label>
              <select required value={address.area} onChange={e => setAddress({ ...address, area: e.target.value })} className={selectCls} disabled={!address.district}>
                <option value="">Select Upazila / Thana</option>
                {(BD_GEO.find(d => d.name === address.division)?.districts.find(d => d.name === address.district)?.upazilas ?? []).map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Full Address *</label>
              <textarea required rows={2} value={address.fullAddress} onChange={e => setAddress({ ...address, fullAddress: e.target.value })} className={`${inputCls} resize-none`} placeholder="House/Flat no., Road, Area..." />
            </div>
          </div>

          {address.district && (
            <p className="text-xs bg-bindu-light-grey border border-bindu-border-grey px-3 py-2 text-bindu-text-muted">
              {shippingCharge === 0 && effectiveFreeThreshold !== null
                ? <span className="text-bindu-orange">Free shipping to your area!</span>
                : `Delivery to ${address.district}: ৳${shippingCharge}`}
            </p>
          )}

          <button type="button" onClick={continueStep1} disabled={!step1Valid}
            className="rounded-none shadow-md w-full py-4 bg-bindu-navy text-bindu-white font-black uppercase tracking-widest text-xs hover:opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Continue to Payment →
          </button>
        </AccordionStep>

        {/* STEP 2 — Payment */}
        <AccordionStep num={2} title="Payment Method" summary={step2Labels[paymentMethod]} activeStep={activeStep} completedSteps={completedSteps} onOpen={openStep}>
          <div className="space-y-2">
            {enabledPaymentMethods.includes("COD") && (
              <label className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${paymentMethod === "COD" ? "border-bindu-orange bg-bindu-orange/5" : "border-bindu-border-grey hover:border-bindu-orange"}`}>
                <input type="radio" name="pay" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="w-4 h-4 mt-0.5 accent-bindu-orange" />
                <div>
                  <span className="font-bold text-sm text-bindu-navy block">Cash on Delivery</span>
                  <span className="text-xs text-bindu-text-muted">Pay in cash when your order arrives</span>
                  {paymentMethod === "COD" && depositInfo?.required && (
                    <p className="text-xs text-bindu-orange font-medium mt-1.5">
                      ৳{depositInfo.amount} advance via bKash required. Remaining ৳{(total - depositInfo.amount).toLocaleString()} on delivery.
                    </p>
                  )}
                </div>
              </label>
            )}
            {enabledPaymentMethods.includes("BKASH") && (
              <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${paymentMethod === "BKASH" ? "border-bindu-orange bg-bindu-orange/5" : "border-bindu-border-grey hover:border-bindu-orange"}`}>
                <input type="radio" name="pay" value="BKASH" checked={paymentMethod === "BKASH"} onChange={() => setPaymentMethod("BKASH")} className="w-4 h-4 accent-bindu-orange" />
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-bindu-navy">bKash</span>
                  <span className="text-[10px] bg-pink-900/40 text-pink-400 border border-pink-500/30 px-2 py-0.5 font-bold uppercase tracking-widest">Fast</span>
                </div>
              </label>
            )}
            {enabledPaymentMethods.includes("NAGAD") && (
              <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${paymentMethod === "NAGAD" ? "border-bindu-orange bg-bindu-orange/5" : "border-bindu-border-grey hover:border-bindu-orange"}`}>
                <input type="radio" name="pay" value="NAGAD" checked={paymentMethod === "NAGAD"} onChange={() => setPaymentMethod("NAGAD")} className="w-4 h-4 accent-bindu-orange" />
                <span className="font-bold text-sm text-bindu-navy">Nagad</span>
              </label>
            )}
            {enabledPaymentMethods.includes("SSLCOMMERZ") && (
              <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${paymentMethod === "SSLCOMMERZ" ? "border-bindu-orange bg-bindu-orange/5" : "border-bindu-border-grey hover:border-bindu-orange"}`}>
                <input type="radio" name="pay" value="SSLCOMMERZ" checked={paymentMethod === "SSLCOMMERZ"} onChange={() => setPaymentMethod("SSLCOMMERZ")} className="w-4 h-4 accent-bindu-orange" />
                <div>
                  <span className="font-bold text-sm text-bindu-navy block">Card / Online Banking</span>
                  <span className="text-xs text-bindu-text-muted">Visa, Mastercard, DBBL via SSLCommerz</span>
                </div>
              </label>
            )}
            {enabledPaymentMethods.includes("UDDOKTAPAY") && (
              <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${paymentMethod === "UDDOKTAPAY" ? "border-bindu-orange bg-bindu-orange/5" : "border-bindu-border-grey hover:border-bindu-orange"}`}>
                <input type="radio" name="pay" value="UDDOKTAPAY" checked={paymentMethod === "UDDOKTAPAY"} onChange={() => setPaymentMethod("UDDOKTAPAY")} className="w-4 h-4 accent-bindu-orange" />
                <div>
                  <span className="font-bold text-sm text-bindu-navy block">UddoktaPay</span>
                  <span className="text-xs text-bindu-text-muted">bKash, Nagad, Rocket, Upay &amp; more</span>
                </div>
              </label>
            )}
          </div>

          <button type="button" onClick={continueStep2}
            className="rounded-none shadow-md w-full py-4 bg-bindu-navy text-bindu-white font-black uppercase tracking-widest text-xs hover:opacity-90 transition-colors">
            Review Order →
          </button>
        </AccordionStep>

        {/* STEP 3 — Review & Place Order */}
        <AccordionStep num={3} title="Review & Place Order" activeStep={activeStep} completedSteps={completedSteps} onOpen={openStep}>

          {/* Items */}
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.variantId} className="flex gap-3 items-center">
                <div className="relative h-14 w-12 bg-bindu-light-grey overflow-hidden shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-bindu-navy line-clamp-1">{item.name}</p>
                  <p className="text-[11px] text-bindu-text-muted">{item.size} / {item.color} · Qty {item.quantity}</p>
                </div>
                <span className="font-mono font-bold text-sm text-bindu-navy shrink-0">৳{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div className="border-t border-bindu-border-grey pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-bindu-text-muted">
              <span>Subtotal</span><span className="font-mono">৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-bindu-text-muted">
              <span>Shipping</span>
              <span className="font-mono">{shippingCharge === 0 ? <span className="text-bindu-orange">Free</span> : `৳${shippingCharge}`}</span>
            </div>
            {taxEnabled && taxAmount > 0 && (
              <div className="flex justify-between text-bindu-text-muted"><span>{taxLabel} ({taxRate}%)</span><span className="font-mono">৳{taxAmount.toLocaleString()}</span></div>
            )}
            {giftWrap && (
              <div className="flex justify-between text-bindu-text-muted"><span>Gift Wrap</span><span className="font-mono">৳{giftWrapCharge}</span></div>
            )}
            {loyaltyDiscount > 0 && (
              <div className="flex justify-between text-bindu-orange"><span>Loyalty Points</span><span className="font-mono">−৳{loyaltyDiscount.toLocaleString()}</span></div>
            )}
            {creditDiscount > 0 && (
              <div className="flex justify-between text-bindu-orange"><span>Store Credit</span><span className="font-mono">−৳{creditDiscount.toLocaleString()}</span></div>
            )}
            {couponDiscount > 0 && (
              <div className="flex justify-between text-bindu-orange"><span>Coupon ({appliedCoupon?.couponCode})</span><span className="font-mono">−৳{couponDiscount.toLocaleString()}</span></div>
            )}
            <div className="flex justify-between font-bold border-t border-bindu-border-grey pt-3">
              <span className="text-bindu-navy uppercase tracking-widest text-xs">Total</span>
              <span className="font-mono text-2xl text-bindu-navy">৳{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Promo code */}
          <div>
            {!appliedCoupon ? (
              <>
                <button type="button" onClick={() => setShowCoupon(!showCoupon)}
                  className="text-xs font-bold text-bindu-orange flex items-center gap-1.5 hover:text-bindu-navy transition-colors">
                  <Tag className="w-3.5 h-3.5" /> Have a promo code?
                </button>
                {showCoupon && (
                  <div className="flex gap-2 mt-2">
                    <input type="text" value={couponCode} onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError("") }} placeholder="Enter code" className={`${inputCls} flex-1`} onKeyDown={e => e.key === "Enter" && handleApplyCoupon()} />
                    <button type="button" onClick={handleApplyCoupon} disabled={couponLoading || !couponCode.trim()}
                      className="px-5 py-3 bg-bindu-navy text-bindu-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-colors disabled:opacity-50">
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-xs text-bindu-error mt-1">{couponError}</p>}
              </>
            ) : (
              <div className="flex items-center justify-between bg-bindu-orange/10 border border-bindu-orange/30 px-4 py-3">
                <div>
                  <p className="font-bold text-sm text-bindu-orange">{appliedCoupon.couponCode}</p>
                  <p className="text-xs text-bindu-text-muted">{appliedCoupon.message}</p>
                </div>
                <button type="button" onClick={() => { setAppliedCoupon(null); setCouponCode(""); setStoreCoupon(null) }}
                  className="text-xs font-bold text-bindu-error hover:text-red-400 uppercase transition-colors">Remove</button>
              </div>
            )}
          </div>

          {/* More options */}
          <div>
            <button type="button" onClick={() => setShowExtras(!showExtras)}
              className="text-xs font-medium text-bindu-text-muted flex items-center gap-1.5 hover:text-bindu-navy transition-colors">
              {showExtras ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {showExtras ? "Hide" : "More options"} — note, date, gift wrap, loyalty
            </button>

            {showExtras && (
              <div className="mt-4 space-y-4 border-t border-bindu-border-grey pt-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" /> Order Note
                  </label>
                  <textarea rows={2} value={orderNote} onChange={e => setOrderNote(e.target.value)} placeholder="Special instructions..." className={`${inputCls} resize-none`} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Preferred Delivery Date
                  </label>
                  <input type="date" value={deliveryDate} min={minDeliveryDate} max={maxDeliveryDate} onChange={e => setDeliveryDate(e.target.value)} className={inputCls} />
                </div>

                {userId && loyaltyBalance > 0 && (
                  <div className="border border-bindu-border-grey overflow-hidden">
                    <label className="flex items-center gap-3 p-3 cursor-pointer">
                      <input type="checkbox" checked={redeemPoints} onChange={e => { setRedeemPoints(e.target.checked); if (!e.target.checked) setPointsToRedeem(0) }} className="w-4 h-4 accent-bindu-orange" />
                      <Star className="w-4 h-4 text-bindu-orange shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold text-sm text-bindu-navy">Loyalty Points ({loyaltyBalance.toLocaleString()} pts · max ৳{loyaltyMaxDiscount})</p>
                      </div>
                    </label>
                    {redeemPoints && (
                      <div className="border-t border-bindu-border-grey p-3">
                        <input type="number" min={1} max={loyaltyMaxDiscount} value={pointsToRedeem} onChange={e => setPointsToRedeem(Math.min(Number(e.target.value), loyaltyMaxDiscount))} className={inputCls} placeholder={`Max ৳${loyaltyMaxDiscount}`} />
                      </div>
                    )}
                  </div>
                )}

                {userId && storeCreditBalance > 0 && (
                  <div className="border border-bindu-border-grey overflow-hidden">
                    <label className="flex items-center gap-3 p-3 cursor-pointer">
                      <input type="checkbox" checked={redeemCredit} onChange={e => { setRedeemCredit(e.target.checked); if (!e.target.checked) setCreditToRedeem(0) }} className="w-4 h-4 accent-bindu-orange" />
                      <Wallet className="w-4 h-4 text-bindu-orange shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold text-sm text-bindu-navy">Store Credit (৳{storeCreditBalance.toLocaleString()} available)</p>
                      </div>
                    </label>
                    {redeemCredit && (
                      <div className="border-t border-bindu-border-grey p-3">
                        <input type="number" min={1} max={storeCreditBalance} value={creditToRedeem} onChange={e => setCreditToRedeem(Math.min(Number(e.target.value), storeCreditBalance))} className={inputCls} placeholder={`Max ৳${storeCreditBalance}`} />
                      </div>
                    )}
                  </div>
                )}

                {giftWrapEnabled && (
                  <div className="border border-bindu-border-grey overflow-hidden">
                    <label className="flex items-center gap-3 p-3 cursor-pointer">
                      <input type="checkbox" checked={giftWrap} onChange={e => setGiftWrap(e.target.checked)} className="w-4 h-4 accent-bindu-orange" />
                      <Gift className="w-4 h-4 text-bindu-orange shrink-0" />
                      <p className="font-bold text-sm text-bindu-navy flex-1">Gift Wrapping (+৳{giftWrapCharge})</p>
                    </label>
                    {giftWrap && (
                      <div className="border-t border-bindu-border-grey p-3">
                        <textarea rows={2} maxLength={160} value={giftMessage} onChange={e => setGiftMessage(e.target.value)} placeholder="Gift message..." className={`${inputCls} resize-none`} />
                      </div>
                    )}
                  </div>
                )}

                {checkoutFields.map(field => (
                  <div key={field.id} className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">{field.label}{field.isRequired ? " *" : ""}</label>
                    {field.type === "SELECT" ? (
                      <select required={field.isRequired} value={customFields[field.id] || ""} onChange={e => setCustomFields({ ...customFields, [field.id]: e.target.value })} className={selectCls}>
                        <option value="">Select…</option>
                        {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : field.type === "TEXTAREA" ? (
                      <textarea required={field.isRequired} rows={2} value={customFields[field.id] || ""} onChange={e => setCustomFields({ ...customFields, [field.id]: e.target.value })} placeholder={field.placeholder || ""} className={`${inputCls} resize-none`} />
                    ) : (
                      <input type={field.type === "DATE" ? "date" : field.type === "NUMBER" ? "number" : "text"} required={field.isRequired} value={customFields[field.id] || ""} onChange={e => setCustomFields({ ...customFields, [field.id]: e.target.value })} placeholder={field.placeholder || ""} className={inputCls} />
                    )}
                  </div>
                ))}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Referral Code (optional)</label>
                  <input type="text" value={referralCode} onChange={e => setReferralCode(e.target.value)} placeholder="Friend's referral code" className={inputCls} />
                </div>
              </div>
            )}
          </div>

          {/* Stock Issues */}
          {stockIssues.length > 0 && (
            <div className="bg-bindu-red/10 border border-bindu-red/20 p-4 text-bindu-red space-y-2 mb-4">
              <p className="font-bold text-sm">Please update your cart to continue:</p>
              <ul className="list-disc pl-5 text-xs">
                {stockIssues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
              <button 
                type="button"
                onClick={() => router.push("/cart")} 
                className="mt-2 text-xs font-bold underline hover:text-bindu-navy"
              >
                Return to Cart
              </button>
            </div>
          )}

          {/* Place order CTA */}
          <button onClick={handlePlaceOrder} disabled={loading || stockIssues.length > 0}
            className="rounded-none shadow-md w-full py-5 bg-bindu-navy text-bindu-white font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:opacity-90 transition-colors text-xs disabled:opacity-60 disabled:cursor-not-allowed">
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing securely...</>
              : "Confirm & Place Order →"
            }
          </button>

          <p className="text-[11px] text-center text-bindu-text-muted flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure checkout · SSL encrypted
          </p>
        </AccordionStep>
      </div>

      {/* ── RIGHT: Sticky order summary ── */}
      <div className="w-full lg:w-[42%] lg:sticky lg:top-24">
        <div className="bg-bindu-white border border-bindu-border-grey p-5 space-y-4">
          <h3 className="font-heading font-bold text-sm text-bindu-navy uppercase tracking-widest">Order Summary</h3>

          <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
            {items.map(item => (
              <div key={item.variantId} className="flex gap-3">
                <div className="relative h-14 w-12 bg-bindu-light-grey overflow-hidden shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-xs font-medium text-bindu-navy line-clamp-1">{item.name}</p>
                  <p className="text-[11px] text-bindu-text-muted">{item.size} / {item.color} · Qty {item.quantity}</p>
                  <p className="font-mono font-bold text-sm text-bindu-navy mt-0.5">৳{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-bindu-border-grey pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-bindu-text-muted">
              <span>Subtotal</span><span className="font-mono">৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-bindu-text-muted">
              <span>Shipping</span>
              <span className="font-mono">{shippingCharge === 0 ? <span className="text-bindu-orange font-medium">Free</span> : `৳${shippingCharge}`}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-bindu-orange"><span>Coupon</span><span className="font-mono">−৳{couponDiscount.toLocaleString()}</span></div>
            )}
            {(loyaltyDiscount + creditDiscount) > 0 && (
              <div className="flex justify-between text-bindu-orange"><span>Discounts</span><span className="font-mono">−৳{(loyaltyDiscount + creditDiscount).toLocaleString()}</span></div>
            )}
            <div className="flex justify-between font-bold border-t border-bindu-border-grey pt-3">
              <span className="text-bindu-navy uppercase tracking-widest text-xs">Total</span>
              <span className="font-mono text-xl text-bindu-navy">৳{total.toLocaleString()}</span>
            </div>
          </div>

          {effectiveFreeThreshold !== null && subtotal < effectiveFreeThreshold && (
            <p className="text-xs text-center text-bindu-text-muted bg-bindu-light-grey border border-bindu-border-grey py-2 px-3">
              Add ৳{(effectiveFreeThreshold - subtotal).toLocaleString()} more for free shipping
            </p>
          )}
        </div>
      </div>

    </div>
  )
}

