import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Check, X, ShoppingBag, Gift, Package, Truck, Home, Ban, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getBalance } from "@/lib/loyalty"
import OrderMessages from "@/components/store/OrderMessages"
import PurchaseTracker from "@/components/store/PurchaseTracker"
import PostPurchaseUpsell from "@/components/store/PostPurchaseUpsell"

const STATUS_STEPS = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"] as const

const STATUS_META: Record<string, { label: string; icon: any }> = {
  PENDING: { label: "Order Placed", icon: ShoppingBag },
  CONFIRMED: { label: "Confirmed", icon: Check },
  PACKED: { label: "Packed", icon: Package },
  SHIPPED: { label: "Shipped", icon: Truck },
  DELIVERED: { label: "Delivered", icon: Home },
}

export default async function OrderConfirmationPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ payment?: string; account_created?: string }>
}) {
  const { id } = await params
  const { payment, account_created } = await searchParams
  const accountJustCreated = account_created === "1"

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { orderBy: { sortOrder: 'asc' }, take: 1 }
            }
          }
        }
      },
      payment: true,
      delivery: true,
      statusLogs: { orderBy: { createdAt: "asc" } },
      coupon: { select: { code: true } },
    }
  })

  if (!order) {
    redirect("/shop")
  }

  const isGiftCardOrder = order.orderNumber.startsWith("GC-")
  const gcMeta = isGiftCardOrder ? (order.customFields as any)?._giftCard as {
    giftCardId?: string; recipientEmail?: string; recipientName?: string; senderName?: string; message?: string
  } | undefined : undefined

  // Fetch the gift card record (code + status) for gift card orders
  let giftCard: { code: string; isActive: boolean; balance: number } | null = null
  if (isGiftCardOrder && gcMeta?.giftCardId) {
    const rawGC = await prisma.giftCard.findUnique({
      where: { id: gcMeta.giftCardId },
      select: { code: true, isActive: true, balance: true },
    })
    if (rawGC) giftCard = { ...rawGC, balance: Number(rawGC.balance) }
  }

  let pointsEarned = 0
  let currentBalance = 0
  if (order.userId) {
    const pointsEntry = await prisma.loyaltyPoint.findFirst({
      where: { orderId: id, type: "EARNED" }
    })
    pointsEarned = pointsEntry?.points || 0
    currentBalance = await getBalance(order.userId)
  }

  // ── Gift card confirmation ────────────────────────────────────────────────
  if (isGiftCardOrder) {
    const recipientEmail = gcMeta?.recipientEmail || order.guestEmail || ""
    const recipientName  = gcMeta?.recipientName  || ""
    const senderName     = gcMeta?.senderName     || ""
    const personalMsg    = gcMeta?.message        || ""
    const gcAmount       = Number(order.total)

    return (
      <div className="bg-bindu-light-grey min-h-screen animate-in fade-in duration-500">
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-2xl">

          {/* Hero */}
          <div className="text-center mb-12">
            {payment === "failed" ? (
              <>
                <div className="w-24 h-24 mx-auto bg-bindu-error/10 border border-bindu-error/20 text-bindu-error flex items-center justify-center mb-6">
                  <X className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">Payment Failed</h1>
                <p className="text-bindu-text-muted max-w-md mx-auto mb-8 text-sm">We couldn&apos;t process your payment. Please try again.</p>
                <Link href="/gift-cards" className="inline-flex px-8 py-4 bg-bindu-navy text-bindu-white font-bold uppercase tracking-widest text-xs hover:bg-bindu-orange transition-colors">
                  Try Again
                </Link>
              </>
            ) : (
              <>
                <div className="w-24 h-24 mx-auto bg-bindu-success/10 border border-bindu-success/20 text-bindu-success flex items-center justify-center mb-6 animate-bounce">
                  <Check className="w-12 h-12" strokeWidth={3} />
                </div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-3">Gift Card Sent!</h1>
                <p className="text-bindu-text-muted max-w-sm mx-auto text-sm">
                  {giftCard?.isActive
                    ? <>The gift card has been delivered to <span className="text-bindu-navy font-medium">{recipientEmail}</span>.</>
                    : <>Payment confirmed. The gift card will be emailed to <span className="text-bindu-navy font-medium">{recipientEmail}</span> shortly.</>
                  }
                </p>
                <div className="inline-flex items-center gap-3 bg-bindu-white border border-bindu-border-grey px-6 py-3 mt-6 shadow-sm">
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-bindu-text-muted">Order #</span>
                  <span className="font-mono font-bold text-lg text-bindu-navy">{order.orderNumber}</span>
                </div>
              </>
            )}
          </div>

          {payment !== "failed" && (
            <>
              {/* Gift card visual */}
              <div className="relative mx-auto w-full max-w-md aspect-[1.586/1] bg-bindu-white border border-bindu-border-grey overflow-hidden mb-8 shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(0,0,0,0.03)_0%,transparent_60%)]" />
                <div className="absolute bottom-0 right-0 w-48 h-48 border border-bindu-border-grey rounded-full translate-x-16 translate-y-16" />
                <div className="absolute bottom-0 right-0 w-32 h-32 border border-bindu-border-grey rounded-full translate-x-8 translate-y-8" />
                <div className="relative h-full flex flex-col justify-between p-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-heading text-[15px] tracking-[0.14em] uppercase text-bindu-navy leading-none">BINDU</span>
                      <span className="font-heading text-[15px] tracking-[0.14em] uppercase text-bindu-orange leading-none">PREMIUM</span>
                      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-bindu-text-muted mt-1">Gift Card</p>
                    </div>
                    <Gift className="w-6 h-6 text-bindu-orange/60" />
                  </div>

                  {giftCard?.isActive && (
                    <div className="text-center">
                      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-bindu-text-muted mb-1">Card Code</p>
                      <p className="font-mono font-bold text-bindu-navy tracking-[0.15em] text-sm">{giftCard.code}</p>
                    </div>
                  )}

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-bindu-text-muted mb-0.5">
                        {recipientName ? `For ${recipientName}` : "Gift Card"}
                      </p>
                      {giftCard?.isActive ? (
                        <p className="text-[10px] text-bindu-text-muted font-mono">Never expires</p>
                      ) : (
                        <p className="text-[10px] text-bindu-text-muted">Sending to {recipientEmail}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-bindu-text-muted mb-0.5">Value</p>
                      <p className="font-mono font-bold text-2xl text-bindu-navy">৳{gcAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery note */}
              <div className="flex items-start gap-4 bg-bindu-white border border-bindu-border-grey p-5 mb-6">
                <div className="w-9 h-9 bg-bindu-light-grey border border-bindu-border-grey flex items-center justify-center shrink-0 mt-0.5 rounded">
                  <Mail className="w-4 h-4 text-bindu-navy" />
                </div>
                <div>
                  <p className="text-sm font-bold text-bindu-navy mb-1">Delivered by email</p>
                  <p className="text-xs text-bindu-text-muted leading-relaxed">
                    The gift card code is sent to <span className="text-bindu-navy">{recipientEmail}</span> immediately after payment confirmation. It never expires and can be used on any Bindu Premium order.
                  </p>
                </div>
              </div>

              {/* Personal message */}
              {personalMsg && (
                <div className="bg-bindu-white border border-bindu-border-grey p-5 mb-6">
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-bindu-text-muted mb-3">Personal Message</p>
                  <p className="text-sm text-bindu-navy italic leading-relaxed">&ldquo;{personalMsg}&rdquo;</p>
                  {senderName && <p className="text-xs text-bindu-text-muted mt-2 text-right">— {senderName}</p>}
                </div>
              )}

              {/* Payment details */}
              <div className="bg-bindu-white border border-bindu-border-grey p-5 mb-6 space-y-3 text-sm">
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-bindu-text-muted border-l-2 border-bindu-orange pl-3">Payment</p>
                <div className="flex justify-between pb-3 border-b border-bindu-border-grey">
                  <span className="text-bindu-text-muted">Method</span>
                  <span className="font-bold text-bindu-navy">{order.paymentMethod === "UDDOKTAPAY" ? "Online Payment" : order.paymentMethod}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-bindu-border-grey">
                  <span className="text-bindu-text-muted">Status</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                    order.paymentStatus === "PAID" ? "bg-bindu-success/10 text-bindu-success" : "bg-bindu-light-grey text-bindu-text-muted"
                  }`}>{order.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bindu-text-muted">Total paid</span>
                  <span className="font-mono font-bold text-bindu-navy">৳{gcAmount.toLocaleString()}</span>
                </div>
                {order.payment?.transactionId && (
                  <div className="flex justify-between border-t border-bindu-border-grey pt-3">
                    <span className="text-bindu-text-muted">Transaction ID</span>
                    <span className="font-mono text-bindu-navy text-xs">{order.payment.transactionId}</span>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="text-center flex items-center justify-center gap-8 pt-4 border-t border-bindu-border-grey">
            <Link href="/gift-cards" className="text-xs font-bold uppercase tracking-widest border-b border-bindu-border-grey pb-1 text-bindu-text-muted hover:text-bindu-orange hover:border-bindu-orange transition-colors">
              Send Another Gift Card
            </Link>
            <Link href="/shop" className="text-xs font-bold uppercase tracking-widest border-b border-bindu-border-grey pb-1 text-bindu-text-muted hover:text-bindu-orange hover:border-bindu-orange transition-colors">
              Continue Shopping →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Regular order confirmation ────────────────────────────────────────────
  return (
  return (
    <div className="bg-bindu-light-grey min-h-screen animate-in fade-in duration-500">
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">

        {/* Account created banner */}
        {accountJustCreated && (
          <div className="mb-10 border border-bindu-border-grey bg-bindu-white px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
            <div className="flex-1">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-bindu-orange mb-1">Account Created</p>
              <p className="text-bindu-navy font-bold text-sm">Your Bindu Premium account is ready.</p>
              <p className="text-bindu-text-muted text-xs mt-1">Sign in at any time with the email and password you set at checkout. This order is already saved to your account.</p>
            </div>
            <Link
              href="/login"
              className="shrink-0 px-6 py-3 bg-bindu-navy text-bindu-white font-bold uppercase tracking-widest text-xs hover:bg-bindu-orange transition-colors"
            >
              Sign In →
            </Link>
          </div>
        )}

        {/* Hero status */}
        <div className="text-center mb-16">
          {payment === "failed" ? (
            <>
              <div className="w-24 h-24 mx-auto bg-bindu-error/10 border border-bindu-error/20 text-bindu-error flex items-center justify-center mb-6">
                <X className="w-12 h-12" />
              </div>
              <h1 className="text-4xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">Payment Failed</h1>
              <p className="text-bindu-text-muted max-w-md mx-auto mb-8 text-sm">We couldn't process your payment. Please try again with a different payment method.</p>
              <Link href="/checkout" className="clip-hex inline-flex px-8 py-4 bg-bindu-navy text-bindu-white font-bold uppercase tracking-widest text-xs hover:bg-bindu-orange transition-colors">
                Retry Payment
              </Link>
            </>
          ) : (
            <>
              <div className="w-24 h-24 mx-auto bg-bindu-success/10 border border-bindu-success/20 text-bindu-success flex items-center justify-center mb-6 animate-bounce">
                <Check className="w-12 h-12" strokeWidth={3} />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">Order Confirmed</h1>
              <p className="text-bindu-text-muted max-w-md mx-auto mb-6 text-sm">Thank you for shopping with Bindu Premium. Your order is being processed.</p>
              <div className="inline-flex items-center gap-3 bg-bindu-white border border-bindu-border-grey px-6 py-3 shadow-sm">
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-bindu-text-muted">Order #</span>
                <span className="font-mono font-bold text-lg text-bindu-navy">{order.orderNumber}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-px bg-bindu-border-grey">

          {/* Left column */}
          <div className="w-full lg:w-3/5 space-y-px bg-bindu-border-grey">

            {/* Status Timeline */}
            {order.status === "CANCELLED" || order.status === "RETURNED" ? (
              <section className="bg-bindu-white p-6 md:p-8">
                <div className="flex items-center gap-3 text-bindu-error">
                  <Ban className="w-5 h-5" />
                  <h2 className="text-lg font-heading font-bold uppercase tracking-wide">
                    Order {order.status === "CANCELLED" ? "Cancelled" : "Returned"}
                  </h2>
                </div>
              </section>
            ) : (
              <section className="bg-bindu-white p-6 md:p-8">
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-bindu-text-muted border-l-2 border-bindu-navy pl-3 mb-8">Order Status</p>
                <div className="flex items-start justify-between relative">
                  <div className="absolute top-5 left-0 right-0 h-px bg-bindu-border-grey" />
                  {STATUS_STEPS.map((step, idx) => {
                    const currentIdx = STATUS_STEPS.indexOf(order.status as any)
                    const isDone = currentIdx >= idx
                    const log = order.statusLogs.find((l) => l.status === step)
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
                        {log && (
                          <p className="text-[9px] text-bindu-text-muted text-center">
                            {new Date(log.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short" })}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Items */}
            <section className="bg-bindu-white p-6 md:p-8">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-bindu-text-muted border-l-2 border-bindu-navy pl-3 mb-6 flex items-center gap-3">
                Items Ordered
              </p>
              <div className="space-y-5 mb-8 max-h-[400px] overflow-y-auto pr-1">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-16 bg-bindu-light-grey border border-bindu-border-grey shrink-0 overflow-hidden">
                      <Image src={item.product.images[0]?.url || "/placeholder.svg"} alt={item.productName} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex-1 text-sm flex flex-col justify-center">
                      <h4 className="font-medium text-bindu-navy line-clamp-1">{item.productName}</h4>
                      <p className="text-bindu-text-muted text-xs mt-0.5">{item.size} / {item.color}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-bindu-text-muted">Qty: {item.quantity}</span>
                        <span className="font-mono font-bold text-bindu-navy">৳{(Number(item.price) * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-bindu-border-grey pt-6 space-y-3 text-sm">
                <div className="flex justify-between text-bindu-text-muted">
                  <span>Subtotal</span>
                  <span className="font-mono">৳{Number(order.subtotal).toLocaleString()}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-bindu-success">
                    <span>{(order as any).coupon?.code ? `Discount (${(order as any).coupon.code})` : "Discount"}</span>
                    <span className="font-mono">- ৳{Number(order.discount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-bindu-text-muted">
                  <span>Shipping</span>
                  <span className="font-mono">৳{Number(order.shippingCharge).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-bindu-border-grey font-bold text-bindu-navy items-center">
                  <span className="uppercase tracking-wide text-sm">Total Paid</span>
                  <span className="font-mono text-2xl">৳{Number(order.total).toLocaleString()}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="w-full lg:w-2/5 space-y-px bg-bindu-border-grey">

            {/* Payment */}
            <section className="bg-bindu-white p-6 md:p-8">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-bindu-text-muted border-l-2 border-bindu-orange pl-3 mb-6 flex items-center gap-3">
                Payment
              </p>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between pb-3 border-b border-bindu-border-grey">
                  <span className="text-bindu-text-muted">Method</span>
                  <span className="font-bold text-bindu-navy">
                    {order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod === "UDDOKTAPAY" ? "Online Payment" : order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-bindu-border-grey">
                  <span className="text-bindu-text-muted">Status</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                    order.paymentStatus === 'PAID' ? 'bg-bindu-success/10 text-bindu-success' : 'bg-bindu-light-grey text-bindu-text-muted'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
                {order.payment?.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-bindu-text-muted">Transaction ID</span>
                    <span className="font-mono text-bindu-navy">{order.payment.transactionId}</span>
                  </div>
                )}
                {order.depositPaid && (
                  <div className="mt-3 p-4 bg-bindu-orange/10 border border-bindu-orange/20 text-xs space-y-1.5">
                    <div className="flex justify-between font-medium text-bindu-navy">
                      <span>Advance paid (bKash)</span>
                      <span className="font-mono">৳{Number(order.depositAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-bindu-text-muted">
                      <span>Due on delivery</span>
                      <span className="font-mono">৳{(Number(order.total) - Number(order.depositAmount)).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Delivery */}
            <section className="bg-bindu-white p-6 md:p-8">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-bindu-text-muted border-l-2 border-bindu-orange pl-3 mb-6 flex items-center gap-3">
                Delivery
              </p>
              <div className="text-sm space-y-1.5 text-bindu-navy bg-bindu-light-grey border border-bindu-border-grey p-4">
                <p className="font-bold text-bindu-navy">{order.shippingName}</p>
                <p>{order.shippingPhone}</p>
                <p>{order.shippingAddress}</p>
                <p>{order.shippingArea}, {order.shippingDistrict}</p>
                <p>{order.shippingDivision}</p>
              </div>
              <div className="mt-4 p-4 border border-bindu-border-grey text-sm flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-bindu-orange mt-1.5 shrink-0" />
                <div>
                  <p className="font-bold text-bindu-navy text-xs uppercase tracking-wide">Estimated Delivery</p>
                  <p className="text-bindu-text-muted text-xs mt-1">3-5 business days. You will receive tracking details via SMS.</p>
                </div>
              </div>
            </section>

            {/* Loyalty Points */}
            {order.userId && pointsEarned > 0 && (
              <section className="bg-bindu-white border border-bindu-orange/20 p-6 md:p-8 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-bindu-orange/10 blur-2xl pointer-events-none" />
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-bindu-orange border-l-2 border-bindu-orange pl-3 mb-4">Bindu Premium Club</p>
                <p className="text-bindu-text-muted text-sm mb-4">
                  You earned <span className="text-bindu-orange font-bold">{pointsEarned} points</span> from this order!
                </p>
                <div className="bg-bindu-light-grey border border-bindu-border-grey p-3 inline-block">
                  <p className="text-[9px] uppercase tracking-widest text-bindu-text-muted mb-1">Current Balance</p>
                  <p className="font-mono font-bold text-lg text-bindu-navy">{currentBalance} pts</p>
                </div>
              </section>
            )}

            {/* Order Messages */}
            <OrderMessages orderId={order.id} />
          </div>
        </div>

        {payment !== "failed" && (
          <PurchaseTracker order={{
            id: order.id,
            orderNumber: order.orderNumber,
            total: Number(order.total),
            items: order.items.map((i: any) => ({
              productId: i.productId,
              name: i.productName,
              price: Number(i.price),
              quantity: i.quantity,
            })),
          }} />
        )}

        {payment !== "failed" && (
          <PostPurchaseUpsell orderTotal={Number(order.total)} />
        )}

        <div className="mt-16 text-center border-t border-bindu-border-grey pt-12 flex items-center justify-center gap-8">
          <Link href={`/order/${order.id}/invoice`} className="inline-block text-xs font-bold uppercase tracking-widest border-b border-bindu-border-grey pb-1 text-bindu-text-muted hover:text-bindu-orange hover:border-bindu-orange transition-colors">
            Download Invoice
          </Link>
          <Link href="/shop" className="inline-block text-xs font-bold uppercase tracking-widest border-b border-bindu-border-grey pb-1 text-bindu-text-muted hover:text-bindu-orange hover:border-bindu-orange transition-colors">
            Continue Shopping →
          </Link>
        </div>
      </div>
    </div>
  )
}
