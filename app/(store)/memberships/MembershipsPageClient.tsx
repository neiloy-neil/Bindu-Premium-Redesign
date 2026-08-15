"use client"

import { useState } from "react"
import { Check, Zap, Truck, Tag, Star, Clock, ChevronDown, Crown } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Plan = {
  id: string; name: string; description: string | null; price: number
  billingCycle: string; discountPct: number; freeShipping: boolean
  exclusiveAccess: boolean; benefits: string[]
}

type ActiveSub = { planId: string; plan: Plan; expiresAt: string | null } | null

const PERKS = [
  { icon: Tag, title: "Member Discounts", body: "Exclusive percentage off on every order — stacks with sales." },
  { icon: Truck, title: "Free Shipping", body: "Zero courier fees on every order, regardless of cart size." },
  { icon: Zap, title: "Early Drop Access", body: "Shop new collections 24 hours before the public release." },
  { icon: Star, title: "Priority Support", body: "Skip the queue — member queries answered within 4 hours." },
  { icon: Crown, title: "Club Rewards", body: "Earn bonus loyalty points on every purchase as a member." },
  { icon: Clock, title: "Extended Returns", body: "14-day return window instead of the standard 7 days." },
]

const FAQ = [
  { q: "How does membership billing work?", a: "Monthly plans renew every 30 days. Yearly plans are billed once and cover 12 months. Lifetime plans are a one-time payment with no recurring charges." },
  { q: "Can I cancel anytime?", a: "Yes. You can cancel your monthly or yearly plan from your account page at any time. Your membership benefits remain active until the current billing period ends." },
  { q: "When do discounts apply?", a: "Member discounts apply automatically at checkout as long as you're signed in. No coupon code needed." },
  { q: "Can I upgrade my plan?", a: "Yes. Upgrade anytime from your account. The price difference is prorated for the remaining days in your billing cycle." },
  { q: "Do benefits apply to sale items?", a: "Discount stacking depends on the plan. Free shipping and early access always apply. Check plan details for sale compatibility." },
  { q: "I'm not a member — how do I join?", a: "Choose any plan below and click Subscribe. You'll need an Bindu Premium account — create one for free if you don't have one yet." },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/10">
      <button onClick={() => setOpen(!open)} className="w-full flex items-start justify-between gap-4 py-4 text-left group">
        <span className={`text-sm font-bold uppercase tracking-wide transition-colors ${open ? "text-bindu-cyan" : "text-white group-hover:text-bindu-cyan"}`}>{q}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 mt-0.5 transition-transform text-white/30 ${open ? "rotate-180 text-bindu-cyan" : ""}`} />
      </button>
      {open && <p className="pb-4 text-sm text-white/50 leading-relaxed">{a}</p>}
    </div>
  )
}

export default function MembershipsPageClient({ plans, activeSub }: { plans: Plan[]; activeSub: ActiveSub }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const cycleLabel = (c: string) => ({ MONTHLY: "/month", YEARLY: "/year", LIFETIME: " one-time" }[c] || "")

  async function handleSubscribe(planId: string) {
    setLoading(planId)
    const res = await fetch("/api/store/memberships/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    })
    setLoading(null)
    if (res.status === 401) { router.push("/login"); return }
    if (!res.ok) { toast.error("Failed to subscribe"); return }
    toast.success("Membership activated!")
    router.refresh()
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen animate-in fade-in duration-500">

      {/* Hero */}
      <div className="border-b border-white/10 py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center">
          <span className="font-heading font-black text-white/[0.025] leading-none" style={{ fontSize: "clamp(10rem, 30vw, 22rem)" }}>AX</span>
        </div>
        <div className="container mx-auto px-4 max-w-5xl relative">
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-bindu-cyan mb-4">Bindu Premium Club</p>
          <h1 className="font-heading font-black text-white uppercase leading-none tracking-tight mb-6" style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)" }}>
            Become a<br />Member.
          </h1>
          <p className="text-white/40 text-sm max-w-lg leading-relaxed">
            Join the Bindu Premium Club for exclusive discounts, free shipping, early drop access, and more — every order, every month.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-16 md:py-24 space-y-20">

        {/* Active membership banner */}
        {activeSub && (
          <div className="p-6 bg-[#111] border border-bindu-cyan/30 flex items-start gap-4">
            <div className="w-10 h-10 bg-bindu-cyan/10 border border-bindu-cyan/30 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5 text-bindu-cyan" />
            </div>
            <div>
              <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-bindu-cyan mb-1">Active Membership</p>
              <p className="font-heading font-bold text-white text-lg uppercase tracking-tight">{activeSub.plan.name}</p>
              {activeSub.expiresAt && (
                <p className="text-sm text-white/40 mt-1">Renews on {new Date(activeSub.expiresAt).toLocaleDateString("en-BD", { day: "numeric", month: "long", year: "numeric" })}</p>
              )}
            </div>
          </div>
        )}

        {/* Perks grid */}
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 border-l-2 border-bindu-cyan pl-3 mb-10">What You Get</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {PERKS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-[#111] p-6 group hover:bg-[#151515] transition-colors">
                <div className="w-10 h-10 border border-bindu-cyan/20 bg-bindu-cyan/5 flex items-center justify-center mb-4 group-hover:border-bindu-cyan/40 transition-colors">
                  <Icon className="w-5 h-5 text-bindu-cyan" />
                </div>
                <h3 className="font-heading font-bold text-white uppercase tracking-tight text-sm mb-2">{title}</h3>
                <p className="text-white/45 text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Plan grid */}
        {plans.length > 0 ? (
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 border-l-2 border-bindu-cyan pl-3 mb-10">Choose a Plan</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
              {plans.map((plan, idx) => {
                const isCurrent = activeSub?.planId === plan.id
                const isPopular = idx === 1 && plans.length === 3
                return (
                  <div
                    key={plan.id}
                    className={`bg-[#111] p-8 flex flex-col relative ${isCurrent ? "border border-bindu-cyan/40" : isPopular ? "border border-white/20" : "border border-transparent"}`}
                  >
                    {isPopular && !isCurrent && (
                      <div className="absolute -top-px left-1/2 -translate-x-1/2">
                        <span className="font-mono text-[9px] tracking-[0.25em] uppercase bg-bindu-cyan text-bindu-black px-3 py-1 font-bold">Most Popular</span>
                      </div>
                    )}
                    {isCurrent && (
                      <div className="absolute top-4 right-4">
                        <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-bindu-cyan border border-bindu-cyan/30 px-2 py-1">Active</span>
                      </div>
                    )}

                    <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/30 mb-3">Plan</p>
                    <h2 className="font-heading font-black text-white text-2xl uppercase tracking-tight leading-none mb-2">{plan.name}</h2>
                    {plan.description && (
                      <p className="text-sm text-white/40 mb-6 leading-relaxed">{plan.description}</p>
                    )}

                    <div className="mb-8">
                      <span className="font-mono font-bold text-4xl text-white">৳{plan.price.toLocaleString()}</span>
                      <span className="text-white/30 text-sm ml-1">{cycleLabel(plan.billingCycle)}</span>
                    </div>

                    <ul className="space-y-3 flex-1 mb-8">
                      {plan.discountPct > 0 && (
                        <li className="flex items-start gap-3 text-sm text-white/60">
                          <Check className="w-4 h-4 text-bindu-cyan mt-0.5 shrink-0" />
                          {plan.discountPct}% off all products
                        </li>
                      )}
                      {plan.freeShipping && (
                        <li className="flex items-start gap-3 text-sm text-white/60">
                          <Check className="w-4 h-4 text-bindu-cyan mt-0.5 shrink-0" />
                          Free shipping on every order
                        </li>
                      )}
                      {plan.exclusiveAccess && (
                        <li className="flex items-start gap-3 text-sm text-white/60">
                          <Check className="w-4 h-4 text-bindu-cyan mt-0.5 shrink-0" />
                          Early access to new drops
                        </li>
                      )}
                      {plan.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                          <Check className="w-4 h-4 text-bindu-cyan mt-0.5 shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>

                    <button
                      disabled={isCurrent || loading === plan.id}
                      onClick={() => handleSubscribe(plan.id)}
                      className={`w-full py-4 font-bold uppercase tracking-widest text-xs transition-all duration-300 disabled:opacity-50 ${
                        isCurrent
                          ? "border border-white/20 text-white/40 cursor-not-allowed"
                          : isPopular
                          ? "bg-bindu-cyan text-bindu-black hover:bg-white hover:shadow-lg hover:shadow-bindu-cyan/20"
                          : "border border-bindu-cyan text-bindu-cyan hover:bg-bindu-cyan hover:text-bindu-black"
                      }`}
                    >
                      {loading === plan.id ? "Processing…" : isCurrent ? "Current Plan" : "Subscribe"}
                    </button>
                  </div>
                )
              })}
            </div>
            <p className="text-center text-xs text-white/25 mt-6">
              Need an account first?{" "}
              <Link href="/register" className="text-bindu-cyan hover:underline underline-offset-4">Create one for free →</Link>
            </p>
          </div>
        ) : (
          /* Empty state when no plans configured yet */
          <div className="border border-white/10 bg-[#111] p-10 md:p-16 text-center">
            <div className="w-16 h-16 bg-bindu-cyan/10 border border-bindu-cyan/20 flex items-center justify-center mx-auto mb-6">
              <Crown className="w-7 h-7 text-bindu-cyan" />
            </div>
            <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-bindu-cyan mb-3">Coming Soon</p>
            <h2 className="font-heading font-black text-white uppercase text-3xl tracking-tight leading-none mb-4">Club Memberships<br />Launching Soon</h2>
            <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed mb-8">
              We're putting the finishing touches on our membership tiers. Sign up to be notified the moment they go live — and get a founding-member discount.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="clip-hex px-8 py-4 bg-bindu-cyan text-bindu-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
              >
                Create Account
              </Link>
              <Link
                href="/shop"
                className="px-8 py-4 border border-white/15 text-white/50 font-bold uppercase tracking-widest text-xs hover:border-bindu-cyan hover:text-bindu-cyan transition-colors"
              >
                Shop the Drop
              </Link>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 border-l-2 border-bindu-cyan pl-3 mb-8">FAQ</p>
          <div className="space-y-0">
            {FAQ.map(item => <FAQItem key={item.q} q={item.q} a={item.a} />)}
          </div>
          <div className="mt-8 text-center">
            <p className="text-white/30 text-sm">
              Still have questions?{" "}
              <Link href="/contact" className="text-bindu-cyan hover:underline underline-offset-4">Contact us →</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
