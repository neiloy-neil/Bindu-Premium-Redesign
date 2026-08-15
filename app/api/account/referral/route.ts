import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { generateReferralCode } from "@/lib/loyalty"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const userId = (session.user as any).id

    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true },
    })

    // Generate code lazily if the user doesn't have one yet
    if (!user?.referralCode) {
      let code = generateReferralCode(userId)
      // Retry once on collision (extremely unlikely)
      const existing = await prisma.user.findUnique({ where: { referralCode: code } })
      if (existing) code = generateReferralCode(userId + Date.now())
      user = await prisma.user.update({
        where: { id: userId },
        data: { referralCode: code },
        select: { referralCode: true },
      })
    }

    const [referralCount, logs] = await Promise.all([
      prisma.referralLog.count({ where: { referrerId: userId } }),
      prisma.referralLog.findMany({
        where: { referrerId: userId },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, creditAmount: true, pointsAmount: true, createdAt: true },
      }),
    ])

    return NextResponse.json({
      referralCode: user.referralCode,
      referralCount,
      logs,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
