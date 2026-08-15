import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { rateLimit } from "@/lib/rateLimit"

const REFEREE_CREDIT = 100   // store credit (৳) given to the new customer
const REFERRER_POINTS = 500  // loyalty points given to the person who shared

export async function POST(req: Request) {
  const limited = await rateLimit(req, "referral")
  if (limited) return limited
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, reason: "unauthenticated" }, { status: 401 })
    }
    const refereeId = (session.user as any).id

    const { referralCode, orderId } = await req.json()
    if (!referralCode || !orderId) return NextResponse.json({ ok: false, reason: "missing_fields" })

    // Look up referrer by their referral code
    const referrer = await prisma.user.findUnique({
      where: { referralCode },
      select: { id: true },
    })
    if (!referrer) return NextResponse.json({ ok: false, reason: "invalid_code" })
    if (referrer.id === refereeId) return NextResponse.json({ ok: false, reason: "self_referral" })

    // Verify the order belongs to the authenticated user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, userId: true, subtotal: true },
    })
    if (!order || order.userId !== refereeId) {
      return NextResponse.json({ ok: false, reason: "order_not_found" })
    }

    // Idempotency: only one referral reward per order
    const alreadyClaimed = await prisma.referralLog.findFirst({
      where: { orderId },
    })
    if (alreadyClaimed) return NextResponse.json({ ok: false, reason: "already_claimed" })

    // Only first qualifying order counts (CONFIRMED / PACKED / SHIPPED / DELIVERED)
    const prevOrders = await prisma.order.count({
      where: {
        userId: refereeId,
        id: { not: orderId },
        status: { in: ["CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"] },
      },
    })
    if (prevOrders > 0) return NextResponse.json({ ok: false, reason: "not_first_order" })

    // Atomic transaction: credit referee, award referrer points, log
    await prisma.$transaction([
      // Referee gets store credit
      prisma.storeCredit.upsert({
        where: { userId: refereeId },
        create: { userId: refereeId, balance: REFEREE_CREDIT },
        update: { balance: { increment: REFEREE_CREDIT } },
      }),
      prisma.storeCreditTransaction.create({
        data: { userId: refereeId, amount: REFEREE_CREDIT, type: "CREDIT", reason: `Referral welcome bonus — order:${orderId}` },
      }),
      // Referrer gets loyalty points
      prisma.loyaltyPoint.create({
        data: { userId: referrer.id, points: REFERRER_POINTS, type: "EARNED", description: `Referral reward`, orderId },
      }),
      // Log the referral
      prisma.referralLog.create({
        data: { referrerId: referrer.id, refereeId, orderId, creditAmount: REFEREE_CREDIT, pointsAmount: REFERRER_POINTS },
      }),
      // Tag the referee so we know who referred them
      prisma.user.update({
        where: { id: refereeId },
        data: { referredByCode: referralCode },
      }),
    ])

    return NextResponse.json({ ok: true, creditAwarded: REFEREE_CREDIT, pointsAwarded: REFERRER_POINTS })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
