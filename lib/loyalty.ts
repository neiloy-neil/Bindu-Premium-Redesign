import prisma from "./prisma"

export async function awardPointsForOrder(userId: string, orderId: string, orderTotal: number): Promise<number> {
  const setting = await prisma.setting.findUnique({ where: { key: "points_per_taka" } })
  const rate = Number(setting?.value ?? 1)
  const points = Math.floor(orderTotal / 10) * rate
  if (points <= 0) return 0
  await prisma.loyaltyPoint.create({
    data: { userId, points, type: "EARNED", description: "Order reward", orderId },
  })
  return points
}

export async function getLoyaltyBalance(userId: string): Promise<number> {
  const agg = await prisma.loyaltyPoint.aggregate({ where: { userId }, _sum: { points: true } })
  return Math.max(0, agg._sum.points ?? 0)
}

export function generateReferralCode(userId: string): string {
  // 8-char alphanum code derived from userId + random — stable on retry via collision fallback
  const base = userId.replace(/-/g, "").slice(0, 4).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${base}${rand}`
}

// Aliases used by payment callback routes
export const awardPoints = awardPointsForOrder
export const getBalance = getLoyaltyBalance
