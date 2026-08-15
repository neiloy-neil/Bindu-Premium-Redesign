"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Gift, ChevronRight, ArrowLeft } from "lucide-react"

const PRESET_AMOUNTS = [500, 1000, 2000, 5000]
const MIN_AMOUNT = 100
const MAX_AMOUNT = 50000

type PaymentMethod = "SSLCOMMERZ" | "UDDOKTAPAY"

const PAYMENT_METHODS: { id: PaymentMethod; label: string; color: string }[] = [
  { id: "UDDOKTAPAY",  label: "Online Payment",    color: "#6C3FD4" },
  { id: "SSLCOMMERZ",  label: "Card / Net Banking", color: "#0B8B3E" },
]

export default function GiftCardsPage() {
  const router = useRouter()
  const [step, setStep] = useState<"form" | "payment">("form")

  // Form fields
  const [amount, setAmount]               = useState(1000)
  const [isCustom, setIsCustom]           = useState(false)
  const [customInput, setCustomInput]     = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [recipientName, setRecipientName]   = useState("")
  const [senderName, setSenderName]         = useState("")
  const [senderEmail, setSenderEmail]       = useState("")
  const [message, setMessage]               = useState("")

  const [loading, setLoading] = useState<PaymentMethod | null>(null)

  const effectiveAmount = isCustom ? Number(customInput) : amount

  async function proceedToPayment(e: React.FormEvent) {
    e.preventDefault()
    if (isCustom) {
      const n = Number(customInput)
      if (!customInput || isNaN(n) || n < MIN_AMOUNT || n > MAX_AMOUNT) {
        toast.error(`Enter an amount between ৳${MIN_AMOUNT.toLocaleString()} and ৳${MAX_AMOUNT.toLocaleString()}`)
        return
      }
    }
    setStep("payment")
  }

  async function handlePay(paymentMethod: PaymentMethod) {
    setLoading(paymentMethod)
    try {
      // 1 — Create the gift card + order
      const gcRes = await fetch("/api/store/gift-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: effectiveAmount, recipientEmail, recipientName, senderName, senderEmail, message, paymentMethod }),
      })
      const gcData = await gcRes.json()
      if (!gcRes.ok) throw new Error(gcData.error || "Could not create gift card")
      const { orderId } = gcData

      // 2 — Init payment gateway
      if (paymentMethod === "UDDOKTAPAY") {
        const res = await fetch("/api/payments/uddoktapay/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Payment init failed")
        router.push(data.payment_url)
      } else {
        const res = await fetch("/api/payments/sslcommerz/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Payment init failed")
        router.push(data.GatewayPageURL)
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-bindu-light-grey pb-32">
      {/* Hero */}
      <div className="bg-bindu-white border-b border-bindu-border-grey text-bindu-navy py-20 px-4 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-bindu-orange px-4 py-1.5 rounded-none mb-6">
            <Gift className="w-4 h-4 text-bindu-orange" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-bindu-orange">Gift Cards</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
            Give the gift of <span className="text-bindu-orange">style.</span>
          </h1>
          <p className="text-bindu-text-muted mt-4 text-sm leading-relaxed max-w-sm mx-auto">
            Let them choose what they love. Gift cards are delivered by email and never expire.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-16">

        {/* ── Step 1: Form ── */}
        {step === "form" && (
          <form onSubmit={proceedToPayment} className="space-y-8">

            {/* Amount */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted block mb-4">
                Gift card value
              </label>
              <div className="grid grid-cols-5 gap-3">
                {PRESET_AMOUNTS.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => { setAmount(a); setIsCustom(false); setCustomInput("") }}
                    className={`py-4 text-center font-mono font-bold text-sm border transition-all ${
                      !isCustom && amount === a
                        ? "border-bindu-navy bg-bindu-navy text-white"
                        : "border-bindu-border-grey bg-white text-bindu-navy hover:border-bindu-navy"
                    }`}
                  >
                    ৳{a.toLocaleString()}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => { setIsCustom(true); setCustomInput("") }}
                  className={`py-4 text-center font-bold text-sm border transition-all ${
                    isCustom
                      ? "border-bindu-navy bg-bindu-navy text-white"
                      : "border-bindu-border-grey bg-white text-bindu-navy hover:border-bindu-navy"
                  }`}
                >
                  Custom
                </button>
              </div>

              {isCustom && (
                <div className="mt-3 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bindu-text-muted font-mono text-sm">৳</span>
                  <input
                    type="number"
                    min={MIN_AMOUNT}
                    max={MAX_AMOUNT}
                    step={50}
                    placeholder={`${MIN_AMOUNT}–${MAX_AMOUNT.toLocaleString()}`}
                    value={customInput}
                    onChange={e => setCustomInput(e.target.value)}
                    className="w-full border border-bindu-navy px-4 py-3 pl-8 text-sm font-mono focus:outline-none bg-white"
                    autoFocus
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-bindu-text-muted">
                    min ৳{MIN_AMOUNT.toLocaleString()} · max ৳{MAX_AMOUNT.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Recipient */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Recipient</p>
              <input
                type="email"
                required
                placeholder="Recipient email *"
                value={recipientEmail}
                onChange={e => setRecipientEmail(e.target.value)}
                className="w-full border border-bindu-border-grey px-4 py-3 text-sm focus:outline-none focus:border-bindu-orange bg-white placeholder:text-bindu-text-muted/50"
              />
              <input
                type="text"
                placeholder="Recipient name (optional)"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                className="w-full border border-bindu-border-grey px-4 py-3 text-sm focus:outline-none focus:border-bindu-orange bg-white placeholder:text-bindu-text-muted/50"
              />
            </div>

            {/* Sender */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">From</p>
              <input
                type="text"
                placeholder="Your name (optional)"
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
                className="w-full border border-bindu-border-grey px-4 py-3 text-sm focus:outline-none focus:border-bindu-orange bg-white placeholder:text-bindu-text-muted/50"
              />
              <input
                type="email"
                placeholder="Your email — for the order receipt (optional)"
                value={senderEmail}
                onChange={e => setSenderEmail(e.target.value)}
                className="w-full border border-bindu-border-grey px-4 py-3 text-sm focus:outline-none focus:border-bindu-orange bg-white placeholder:text-bindu-text-muted/50"
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted block mb-3">
                Personal message (optional)
              </label>
              <textarea
                placeholder="Write a personal message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                maxLength={500}
                className="w-full border border-bindu-border-grey px-4 py-3 text-sm focus:outline-none focus:border-bindu-orange bg-white placeholder:text-bindu-text-muted/50 resize-none"
              />
              <p className="text-xs text-bindu-text-muted mt-1 text-right">{message.length}/500</p>
            </div>

            <button
              type="submit"
              disabled={!recipientEmail}
              className="w-full py-4 bg-bindu-navy text-white font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-bindu-orange transition-all duration-300 disabled:opacity-50 rounded-none"
            >
              Choose payment <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ── Step 2: Payment ── */}
        {step === "payment" && (
          <div className="space-y-8">
            <button
              onClick={() => setStep("form")}
              className="flex items-center gap-2 text-sm text-bindu-text-muted hover:text-bindu-navy transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Edit details
            </button>

            {/* Summary */}
            <div className="border border-bindu-border-grey bg-white p-6 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Order summary</p>
              <div className="flex justify-between text-sm">
                <span className="text-bindu-text-muted">Gift card</span>
                <span className="font-mono font-bold">৳{effectiveAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-bindu-text-muted">Delivery</span>
                <span className="text-green-600 font-medium">Free (email)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-bindu-text-muted">Recipient</span>
                <span className="truncate max-w-[220px] font-medium">{recipientEmail}</span>
              </div>
              <div className="border-t border-bindu-border-grey pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="font-mono">৳{effectiveAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment methods */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Pay with</p>
              {PAYMENT_METHODS.map(method => (
                <button
                  key={method.id}
                  onClick={() => handlePay(method.id)}
                  disabled={loading !== null}
                  className="w-full flex items-center justify-between px-5 py-4 border border-bindu-border-grey bg-white hover:border-bindu-navy transition-colors disabled:opacity-60 group"
                >
                  <span className="font-semibold text-sm">{method.label}</span>
                  <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${loading === method.id ? "text-bindu-text-muted" : "text-bindu-navy group-hover:text-bindu-orange"}`}>
                    {loading === method.id ? "Redirecting…" : `Pay ৳${effectiveAmount.toLocaleString()} →`}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-xs text-bindu-text-muted text-center">
              The gift card code is sent to <strong>{recipientEmail}</strong> immediately after payment.
              Gift cards never expire.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
