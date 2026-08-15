"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useSession, signOut } from "@/hooks/useSession"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Package, MapPin, Gift, LogOut, Wallet, Link2, RotateCcw, X, Copy, Check, TrendingUp, Minus, Heart } from "lucide-react"
import { toast } from "sonner"
import AddressList from "@/components/store/account/AddressList"

const RETURN_REASONS: { value: string; label: string }[] = [
  { value: "WRONG_SIZE", label: "Wrong size" },
  { value: "DEFECTIVE", label: "Defective / damaged" },
  { value: "WRONG_ITEM", label: "Wrong item received" },
  { value: "CHANGED_MIND", label: "Changed my mind" },
  { value: "QUALITY_ISSUE", label: "Quality issue" },
  { value: "OTHER", label: "Other" },
]

const RETURN_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-red-100 text-red-800",
  RECEIVED: "bg-purple-100 text-purple-800",
  REFUNDED: "bg-green-100 text-green-800",
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("orders")
  const [orders, setOrders] = useState<any[]>([])
  const [loyaltyBalance, setLoyaltyBalance] = useState(0)
  const [loyaltyHistory, setLoyaltyHistory] = useState<any[]>([])
  const [storeCreditBalance, setStoreCreditBalance] = useState(0)
  const [affiliate, setAffiliate] = useState<any>(null)
  const [enrolling, setEnrolling] = useState(false)
  const [referral, setReferral] = useState<{ referralCode: string; referralCount: number; logs: any[] } | null>(null)
  const [referralLoading, setReferralLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [myReturns, setMyReturns] = useState<any[]>([])
  const [returnsLoading, setReturnsLoading] = useState(false)
  // Return request modal state
  const [returnOrder, setReturnOrder] = useState<any>(null)
  const [returnSelections, setReturnSelections] = useState<Record<string, number>>({})
  const [returnReason, setReturnReason] = useState("WRONG_SIZE")
  const [returnNote, setReturnNote] = useState("")
  const [submittingReturn, setSubmittingReturn] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/account")
    }
  }, [status, router])

  // Fetch orders
  useEffect(() => {
    if (status !== "authenticated") return
    fetch("/api/account/orders")
      .then(r => r.json())
      .then(d => { setOrders(d.orders || []); setOrdersLoading(false) })
      .catch(() => setOrdersLoading(false))
  }, [status])

  // Fetch loyalty balance + history, store credit, affiliate
  useEffect(() => {
    if (status !== "authenticated") return
    fetch("/api/account/loyalty").then(r => r.json()).then(d => {
      setLoyaltyBalance(d.balance || 0)
      setLoyaltyHistory(d.history || [])
    }).catch(() => {})
    fetch("/api/account/store-credit").then(r => r.json()).then(d => setStoreCreditBalance(d.balance || 0)).catch(() => {})
    fetch("/api/account/affiliate").then(r => r.json()).then(d => setAffiliate(d.affiliate || null)).catch(() => {})
  }, [status])

  // Fetch referral data when tab opens
  useEffect(() => {
    if (activeTab !== "affiliate" || status !== "authenticated" || referral) return
    setReferralLoading(true)
    fetch("/api/account/referral").then(r => r.json()).then(d => {
      setReferral({ referralCode: d.referralCode, referralCount: d.referralCount, logs: d.logs || [] })
    }).catch(() => {}).finally(() => setReferralLoading(false))
  }, [activeTab, status, referral])

  // Fetch returns when tab is opened
  useEffect(() => {
    if (activeTab !== "returns" || status !== "authenticated") return
    setReturnsLoading(true)
    fetch("/api/account/returns")
      .then(r => r.json())
      .then(d => { setMyReturns(d.returns || []); setReturnsLoading(false) })
      .catch(() => setReturnsLoading(false))
  }, [activeTab, status])

  function openReturnModal(order: any) {
    setReturnOrder(order)
    setReturnSelections({})
    setReturnReason("WRONG_SIZE")
    setReturnNote("")
  }

  function toggleReturnItem(itemId: string, maxQty: number) {
    setReturnSelections(prev =>
      prev[itemId] ? (({ [itemId]: _, ...rest }) => rest)(prev) : { ...prev, [itemId]: maxQty }
    )
  }

  async function submitReturn() {
    if (!returnOrder) return
    const selectedItems = Object.entries(returnSelections).map(([orderItemId, quantity]) => ({ orderItemId, quantity }))
    if (!selectedItems.length) { toast.error("Select at least one item to return"); return }
    setSubmittingReturn(true)
    try {
      const res = await fetch("/api/store/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: returnOrder.id, items: selectedItems, reason: returnReason, note: returnNote || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to submit")
      toast.success("Return request submitted! We'll review it shortly.")
      setReturnOrder(null)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSubmittingReturn(false)
    }
  }

  async function handleEnroll() {
    setEnrolling(true)
    try {
      const res = await fetch("/api/account/affiliate", { method: "POST" })
      const data = await res.json()
      if (data.affiliate) setAffiliate(data.affiliate)
      else toast.error("Could not generate referral link. Try again.")
    } catch {
      toast.error("Something went wrong.")
    } finally {
      setEnrolling(false)
    }
  }

  function copyReferralLink() {
    if (!referral?.referralCode) return
    const link = `${window.location.origin}?ref=${referral.referralCode}`
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  async function handleSignOut() {
    await signOut({ callbackUrl: "/" })
  }

  async function handleSaveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value?.trim()
    if (!name) return
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        toast.success("Profile updated successfully")
      } else {
        const d = await res.json()
        toast.error(d.error || "Failed to update profile")
      }
    } catch {
      toast.error("Error updating profile")
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-bindu-navy border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return null

  const user = session.user
  const firstName = user?.name?.split(" ")[0] || "there"

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-4xl font-heading font-bold text-bindu-navy mb-2">My Account</h1>
        <p className="text-bindu-text-muted">Welcome back, {firstName}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-12">

        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {[
            { key: "orders", label: "My Orders", icon: Package },
            { key: "returns", label: "My Returns", icon: RotateCcw },
            { key: "profile", label: "Profile Details", icon: User },
            { key: "addresses", label: "Saved Addresses", icon: MapPin },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-sm font-medium transition-colors ${
                activeTab === key ? "bg-bindu-navy text-white" : "hover:bg-bindu-light-grey text-bindu-text-muted hover:text-bindu-navy"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
          <Link
            href="/account/wishlist"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-none text-sm font-medium transition-colors hover:bg-bindu-light-grey text-bindu-text-muted hover:text-bindu-navy"
          >
            <Heart className="w-4 h-4" /> My Wishlist
          </Link>
          <button
            onClick={() => setActiveTab("loyalty")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-none text-sm font-medium transition-colors ${
              activeTab === "loyalty" ? "bg-bindu-navy text-white" : "hover:bg-bindu-light-grey text-bindu-text-muted hover:text-bindu-navy"
            }`}
          >
            <div className="flex items-center gap-3"><Gift className="w-4 h-4" /> Bindu Premium Club</div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === "loyalty" ? "bg-white text-bindu-navy" : "bg-bindu-orange text-white"}`}>
              {loyaltyBalance} pt
            </span>
          </button>
          <button
            onClick={() => setActiveTab("credit")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-none text-sm font-medium transition-colors ${
              activeTab === "credit" ? "bg-bindu-navy text-white" : "hover:bg-bindu-light-grey text-bindu-text-muted hover:text-bindu-navy"
            }`}
          >
            <div className="flex items-center gap-3"><Wallet className="w-4 h-4" /> Store Credit</div>
            {storeCreditBalance > 0 && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === "credit" ? "bg-white text-bindu-navy" : "bg-green-100 text-green-800"}`}>
                ৳{storeCreditBalance}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("affiliate")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-sm font-medium transition-colors ${
              activeTab === "affiliate" ? "bg-bindu-navy text-white" : "hover:bg-bindu-light-grey text-bindu-text-muted hover:text-bindu-navy"
            }`}
          >
            <Link2 className="w-4 h-4" /> Referral
          </button>
          <div className="pt-8 mt-8 border-t border-bindu-border-grey">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-none text-sm font-medium text-bindu-error hover:bg-bindu-error/10 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-bold mb-6">Order History</h2>
              {ordersLoading ? (
                <div className="text-bindu-text-muted text-sm">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <Package className="w-12 h-12 mx-auto text-bindu-border-grey" />
                  <p className="text-bindu-text-muted">No orders yet. Time to shop!</p>
                  <button
                    onClick={() => router.push("/shop")}
                    className="mt-2 px-6 py-3 bg-bindu-navy text-white font-bold uppercase tracking-widest hover:bg-bindu-orange transition-colors text-xs"
                  >
                    Browse Shop
                  </button>
                </div>
              ) : (
                orders.map((order: any) => (
                  <div key={order.id} className="border border-bindu-border-grey rounded-none overflow-hidden bg-white">
                    <div className="bg-bindu-light-grey/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-bindu-border-grey text-sm">
                      <div>
                        <p className="text-xs text-bindu-text-muted uppercase tracking-widest font-bold">Order Placed</p>
                        <p className="font-medium mt-0.5">{new Date(order.createdAt).toLocaleDateString("en-BD")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-bindu-text-muted uppercase tracking-widest font-bold">Total</p>
                        <p className="font-medium mt-0.5">৳{Number(order.total).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-bindu-text-muted uppercase tracking-widest font-bold">Status</p>
                        <p className="font-medium text-bindu-orange mt-0.5">{order.status}</p>
                      </div>
                      <div className="flex-1 text-right">
                        <p className="text-xs text-bindu-text-muted uppercase tracking-widest font-bold">Order #</p>
                        <p className="font-mono mt-0.5">{order.orderNumber}</p>
                      </div>
                      {order.status === "DELIVERED" && (
                        <button
                          onClick={() => openReturnModal(order)}
                          className="text-xs text-bindu-text-muted underline underline-offset-2 hover:text-bindu-navy transition-colors"
                        >
                          Request Return
                        </button>
                      )}
                    </div>
                    {order.items?.slice(0, 1).map((item: any) => (
                      <div key={item.id} className="p-6 flex gap-4">
                        <div className="relative w-20 h-24 bg-bindu-light-grey rounded-none shrink-0 overflow-hidden">
                          {item.product?.images?.[0]?.url && (
                            <Image src={item.product.images[0].url} alt={item.productName} fill sizes="80px" className="object-cover" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-bindu-navy">{item.productName}</h4>
                          <p className="text-sm text-bindu-text-muted mt-1">Size: {item.size} | Color: {item.color}</p>
                          <p className="text-sm font-mono mt-1">৳{Number(item.price).toLocaleString()} × {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-bold mb-6">Profile Details</h2>
              <form className="max-w-md space-y-4" onSubmit={handleSaveProfile}>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-bindu-text-muted">Full Name</label>
                  <input name="name" defaultValue={user?.name || ""} className="w-full bg-bindu-light-grey border border-transparent focus:border-bindu-orange focus:bg-white rounded-none px-4 py-3 text-sm outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-bindu-text-muted">Email Address</label>
                  <input defaultValue={user?.email || ""} disabled className="w-full bg-bindu-light-grey border border-transparent rounded-none px-4 py-3 text-sm outline-none opacity-60 cursor-not-allowed" />
                  <p className="text-xs text-bindu-text-muted">Email cannot be changed.</p>
                </div>
                <div className="pt-4">
                  <button type="submit" className="px-6 py-3 bg-bindu-navy text-white font-bold uppercase tracking-widest hover:bg-bindu-orange transition-colors text-xs">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "addresses" && (
            <AddressList />
          )}

          {activeTab === "credit" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-bold">Store Credit</h2>
              <div className="bg-bindu-navy text-white rounded-none p-8 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <p className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-2">Available Balance</p>
                  <h3 className="text-5xl font-mono font-bold text-green-400 mb-2">৳{storeCreditBalance.toLocaleString()}</h3>
                  <p className="text-sm text-gray-300">Automatically applied at checkout when you place your next order.</p>
                </div>
              </div>
              <p className="text-sm text-bindu-text-muted">Store credit never expires and can be used toward any purchase. You'll see the option to apply it in step 3 of checkout.</p>
            </div>
          )}

          {activeTab === "affiliate" && (
            <div className="space-y-8">
              {/* ── Affiliate commission dashboard ── */}
              {affiliate ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-heading font-bold">Affiliate Dashboard</h2>
                    <p className="text-sm text-bindu-text-muted mt-1">Your unique link earns commission on every sale it drives.</p>
                  </div>

                  <div className="border border-bindu-border-grey bg-white p-6 space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Your affiliate link</p>
                    <div className="flex gap-2 items-stretch">
                      <div className="flex-1 bg-bindu-light-grey px-4 py-3 font-mono text-sm text-bindu-navy truncate select-all">
                        {typeof window !== "undefined" ? `${window.location.origin}?ref=${affiliate.code}` : `…?ref=${affiliate.code}`}
                      </div>
                      <button
                        onClick={() => {
                          const link = `${window.location.origin}?ref=${affiliate.code}`
                          navigator.clipboard.writeText(link).then(() => toast.success("Link copied!"))
                        }}
                        className="px-4 bg-bindu-navy text-white hover:bg-bindu-orange transition-colors text-xs font-bold uppercase tracking-widest"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="border border-bindu-border-grey bg-white p-5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted mb-2">Clicks</p>
                      <p className="text-3xl font-mono font-bold text-bindu-navy">{affiliate._count?.clicks ?? 0}</p>
                    </div>
                    <div className="border border-bindu-border-grey bg-white p-5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted mb-2">Sales</p>
                      <p className="text-3xl font-mono font-bold text-bindu-navy">{affiliate._count?.conversions ?? 0}</p>
                    </div>
                    <div className="border border-bindu-border-grey bg-white p-5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted mb-2">Earned</p>
                      <p className="text-3xl font-mono font-bold text-bindu-orange">৳{Number(affiliate.totalEarned || 0).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="border-t border-bindu-border-grey pt-6">
                    <p className="text-sm text-bindu-text-muted">
                      Commission: <span className="font-semibold text-bindu-navy">
                        {affiliate.commissionType === "PERCENTAGE" ? `${affiliate.commissionValue}%` : `৳${affiliate.commissionValue}`} per sale
                      </span>
                      {" "}· Payouts are processed monthly.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border border-bindu-border-grey bg-white p-8 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-bindu-light-grey mb-2">
                    <TrendingUp className="w-7 h-7 text-bindu-text-muted" />
                  </div>
                  <h3 className="text-xl font-heading font-bold">Become an Affiliate</h3>
                  <p className="text-sm text-bindu-text-muted max-w-sm mx-auto">
                    Get a unique tracking link and earn commission on every sale you drive.
                    Payouts are processed monthly.
                  </p>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="mt-2 px-8 py-3 bg-bindu-navy text-white font-bold uppercase tracking-widest text-xs hover:bg-bindu-orange transition-colors disabled:opacity-50"
                  >
                    {enrolling ? "Setting up…" : "Get my affiliate link"}
                  </button>
                </div>
              )}

              <div className="border-t border-bindu-border-grey pt-8">
              <h2 className="text-2xl font-heading font-bold">Refer &amp; Earn</h2>

              {/* Hero banner */}
              <div className="bg-bindu-navy text-white p-8 md:p-10 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-56 h-56 bg-bindu-orange/15 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-lg">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-bindu-orange mb-3">Referral Program</p>
                  <h3 className="text-3xl font-heading font-bold text-white mb-3 leading-tight">Share your code.<br />Both of you win.</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Your friend gets <span className="text-white font-semibold">৳100 store credit</span> off their first order.
                    You earn <span className="text-bindu-orange font-semibold">500 loyalty points</span> (worth ৳5) when they check out.
                  </p>
                </div>
              </div>

              {/* Referral link */}
              {referralLoading ? (
                <div className="py-8 text-center text-bindu-text-muted text-sm">Generating your code…</div>
              ) : referral?.referralCode ? (
                <>
                  <div className="border border-bindu-border-grey bg-white p-6 space-y-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted mb-3">Your referral code</p>
                      <div className="flex gap-2 items-stretch">
                        <div className="flex-1 bg-bindu-light-grey px-4 py-3 font-mono font-bold text-lg text-bindu-navy tracking-widest select-all">
                          {referral.referralCode}
                        </div>
                        <button
                          onClick={copyReferralLink}
                          className={`px-5 flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-colors ${copied ? "bg-green-500 text-white" : "bg-bindu-navy text-white hover:bg-bindu-orange"}`}
                        >
                          {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                        </button>
                      </div>
                      <p className="text-[11px] text-bindu-text-muted mt-2">
                        Sharing link: <span className="font-mono">{typeof window !== "undefined" ? `${window.location.origin}?ref=${referral.referralCode}` : `…?ref=${referral.referralCode}`}</span>
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-bindu-border-grey bg-white p-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted mb-2">Friends Referred</p>
                      <p className="text-4xl font-mono font-bold text-bindu-navy">{referral.referralCount}</p>
                    </div>
                    <div className="border border-bindu-border-grey bg-white p-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted mb-2">Points Earned</p>
                      <p className="text-4xl font-mono font-bold text-bindu-orange">
                        {referral.logs.reduce((sum: number, log: any) => sum + (log.pointsAmount || 0), 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Recent referral log */}
                  {referral.logs.length > 0 && (
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-widest text-bindu-text-muted mb-3">Recent Referrals</h3>
                      <div className="border border-bindu-border-grey divide-y divide-bindu-border-grey">
                        {referral.logs.map((log: any) => (
                          <div key={log.id} className="flex items-center justify-between px-5 py-4 bg-white">
                            <div>
                              <p className="text-sm font-medium">Friend joined &amp; ordered</p>
                              <p className="text-[11px] text-bindu-text-muted mt-0.5">
                                {new Date(log.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}
                              </p>
                            </div>
                            <span className="font-mono font-bold text-sm text-bindu-orange">+{log.pointsAmount} pts</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-bindu-text-muted text-sm">Could not load referral info. Try refreshing.</div>
              )}
              </div>{/* end referral section */}
            </div>
          )}

          {activeTab === "returns" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-bold">My Returns</h2>
              {returnsLoading ? (
                <div className="text-bindu-text-muted text-sm">Loading...</div>
              ) : myReturns.length === 0 ? (
                <div className="text-center py-16 space-y-3 bg-bindu-light-grey/30 rounded-none border border-bindu-border-grey">
                  <RotateCcw className="w-10 h-10 mx-auto text-bindu-border-grey" />
                  <p className="text-bindu-text-muted text-sm">No return requests yet.</p>
                  <p className="text-xs text-bindu-text-muted">You can request a return from a delivered order in the Orders tab.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myReturns.map((r: any) => (
                    <div key={r.id} className="border border-bindu-border-grey rounded-none overflow-hidden bg-white">
                      <div className="bg-bindu-light-grey/30 px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-bindu-border-grey text-sm">
                        <div>
                          <p className="text-xs text-bindu-text-muted uppercase tracking-widest font-bold">Order #</p>
                          <p className="font-mono mt-0.5">{r.order.orderNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-bindu-text-muted uppercase tracking-widest font-bold">Reason</p>
                          <p className="mt-0.5">{RETURN_REASONS.find(x => x.value === r.reason)?.label ?? r.reason}</p>
                        </div>
                        <div>
                          <p className="text-xs text-bindu-text-muted uppercase tracking-widest font-bold">Submitted</p>
                          <p className="mt-0.5">{new Date(r.createdAt).toLocaleDateString("en-BD")}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${RETURN_STATUS_COLORS[r.status] || "bg-gray-100 text-gray-600"}`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="px-6 py-4 space-y-2">
                        {r.items.map((i: any) => (
                          <div key={i.id} className="flex justify-between text-sm">
                            <span>{i.orderItem.productName} — {i.orderItem.size} / {i.orderItem.color}</span>
                            <span className="text-bindu-text-muted">×{i.quantity}</span>
                          </div>
                        ))}
                        {r.adminNote && (
                          <p className="text-xs text-bindu-text-muted mt-2 pt-2 border-t border-bindu-border-grey">
                            <span className="font-bold">Store note:</span> {r.adminNote}
                          </p>
                        )}
                        {r.status === "REFUNDED" && r.refundAmount && (
                          <p className="text-sm font-bold text-green-700 mt-2">
                            ৳{Number(r.refundAmount).toLocaleString()} store credit issued to your account.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "loyalty" && (
            <div className="space-y-8">
              <h2 className="text-2xl font-heading font-bold">Bindu Premium Club</h2>

              {/* Balance card */}
              <div className="bg-bindu-navy text-white rounded-none p-8 md:p-10 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-bindu-orange/20 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                  <div>
                    <p className="text-gray-400 uppercase tracking-widest text-[10px] font-bold mb-2">Available Points</p>
                    <h3 className="text-6xl font-mono font-bold text-bindu-orange leading-none mb-3">{loyaltyBalance.toLocaleString()}</h3>
                    <p className="text-sm text-gray-300 max-w-xs">
                      {loyaltyBalance > 0
                        ? <>Worth <span className="text-white font-bold">৳{Math.floor(loyaltyBalance / 100)}</span> off at checkout.</>
                        : "Earn points on every purchase."}
                    </p>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => router.push("/shop")}
                      className="px-6 py-3 bg-bindu-orange text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
                    >
                      Shop &amp; Earn
                    </button>
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: TrendingUp, title: "Earn", desc: "Get 1 point for every ৳10 spent automatically on every order." },
                  { icon: Gift, title: "Collect", desc: "Points stack with every purchase. No minimum before they're yours." },
                  { icon: Wallet, title: "Redeem", desc: "100 points = ৳1 off. Apply at checkout in the Points step." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="p-5 border border-bindu-border-grey bg-white">
                    <Icon className="w-5 h-5 text-bindu-orange mb-3" />
                    <h4 className="font-bold text-sm mb-1">{title}</h4>
                    <p className="text-xs text-bindu-text-muted leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Transaction history */}
              <div>
                <h3 className="font-bold text-sm uppercase tracking-widest text-bindu-text-muted mb-4">Points History</h3>
                {loyaltyHistory.length === 0 ? (
                  <div className="text-center py-12 border border-bindu-border-grey bg-bindu-light-grey/20">
                    <Gift className="w-8 h-8 mx-auto text-bindu-border-grey mb-3" />
                    <p className="text-bindu-text-muted text-sm">No points activity yet. Place an order to start earning.</p>
                  </div>
                ) : (
                  <div className="border border-bindu-border-grey divide-y divide-bindu-border-grey">
                    {loyaltyHistory.map((entry: any) => {
                      const isPositive = entry.points > 0
                      return (
                        <div key={entry.id} className="flex items-center justify-between px-5 py-4 bg-white">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isPositive ? "bg-bindu-orange/10 text-bindu-orange" : "bg-red-50 text-red-500"}`}>
                              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-bindu-navy">{entry.description || entry.type}</p>
                              <p className="text-[11px] text-bindu-text-muted mt-0.5">
                                {new Date(entry.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}
                              </p>
                            </div>
                          </div>
                          <span className={`font-mono font-bold text-sm ${isPositive ? "text-bindu-orange" : "text-red-500"}`}>
                            {isPositive ? "+" : ""}{entry.points.toLocaleString()} pts
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Return Request Modal */}
      {returnOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setReturnOrder(null)}>
          <div className="bg-white rounded-none w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-bindu-border-grey">
              <h3 className="font-heading font-bold text-lg">Request Return — {returnOrder.orderNumber}</h3>
              <button onClick={() => setReturnOrder(null)} className="text-bindu-text-muted hover:text-bindu-navy transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-bindu-text-muted mb-3">Select items to return</p>
                <div className="space-y-2">
                  {returnOrder.items?.map((item: any) => (
                    <label key={item.id} className={`flex items-center justify-between gap-3 p-3 rounded-none border cursor-pointer transition-colors ${returnSelections[item.id] ? "border-bindu-navy bg-bindu-light-grey/40" : "border-bindu-border-grey hover:border-bindu-navy/40"}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={!!returnSelections[item.id]}
                          onChange={() => toggleReturnItem(item.id, item.quantity)}
                          className="accent-bindu-navy w-4 h-4"
                        />
                        <div>
                          <p className="text-sm font-medium">{item.productName}</p>
                          <p className="text-xs text-bindu-text-muted">{item.size} / {item.color}</p>
                        </div>
                      </div>
                      <span className="text-xs text-bindu-text-muted">×{item.quantity}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-bindu-text-muted block mb-2">Reason</label>
                <select
                  value={returnReason}
                  onChange={e => setReturnReason(e.target.value)}
                  className="w-full bg-bindu-light-grey border border-transparent focus:border-bindu-orange focus:bg-white rounded-none px-4 py-3 text-sm outline-none transition-all"
                >
                  {RETURN_REASONS.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-bindu-text-muted block mb-2">Additional note (optional)</label>
                <textarea
                  value={returnNote}
                  onChange={e => setReturnNote(e.target.value)}
                  rows={3}
                  placeholder="Describe the issue..."
                  className="w-full bg-bindu-light-grey border border-transparent focus:border-bindu-orange focus:bg-white rounded-none px-4 py-3 text-sm outline-none transition-all resize-none"
                />
              </div>
              <button
                onClick={submitReturn}
                disabled={submittingReturn || Object.keys(returnSelections).length === 0}
                className="w-full py-4 bg-bindu-navy text-white font-bold uppercase tracking-widest hover:bg-bindu-orange transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReturn ? "Submitting..." : "Submit Return Request"}
              </button>
              <p className="text-xs text-bindu-text-muted text-center">
                We'll review your request and respond within 2–3 business days.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

