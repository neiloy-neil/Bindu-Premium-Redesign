import prisma from "./prisma"

const REFEREE_CREDIT = 100
const REFERRER_POINTS = 500

export async function processReferral(refereeId: string, referralCode: string, orderId: string): Promise<void> {
  const code = referralCode.trim().toUpperCase()
  if (!code || !orderId || !refereeId) return

  const referrer = await prisma.user.findUnique({
    where: { referralCode: code },
    select: { id: true },
  })
  if (!referrer || referrer.id === refereeId) return

  // Idempotency — only one reward per order
  const alreadyClaimed = await prisma.referralLog.findFirst({ where: { orderId } })
  if (alreadyClaimed) return

  // Only first qualifying order earns the referral bonus
  const prevOrders = await prisma.order.count({
    where: {
      userId: refereeId,
      id: { not: orderId },
      status: { in: ["CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"] },
    },
  })
  if (prevOrders > 0) return

  await prisma.$transaction([
    prisma.storeCredit.upsert({
      where: { userId: refereeId },
      create: { userId: refereeId, balance: REFEREE_CREDIT },
      update: { balance: { increment: REFEREE_CREDIT } },
    }),
    prisma.storeCreditTransaction.create({
      data: { userId: refereeId, amount: REFEREE_CREDIT, type: "CREDIT", reason: `Referral welcome bonus — order:${orderId}` },
    }),
    prisma.loyaltyPoint.create({
      data: { userId: referrer.id, points: REFERRER_POINTS, type: "EARNED", description: `Referral reward`, orderId },
    }),
    prisma.referralLog.create({
      data: { referrerId: referrer.id, refereeId, orderId, creditAmount: REFEREE_CREDIT, pointsAmount: REFERRER_POINTS },
    }),
    prisma.user.update({
      where: { id: refereeId },
      data: { referredByCode: code },
    }),
  ])
}
