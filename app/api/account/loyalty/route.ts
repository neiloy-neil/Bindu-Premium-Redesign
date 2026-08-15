import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const userId = (session.user as any).id
    const [points, settings] = await Promise.all([
      prisma.loyaltyPoint.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.setting.findMany({
        where: { key: { in: ["points_per_taka", "points_redemption_rate"] } },
      }),
    ])
    const settingMap = Object.fromEntries(settings.map((s) => [s.key, s.value]))
    const balance = Math.max(0, points.reduce((sum, p) => sum + p.points, 0))
    const redemptionRate = Number(settingMap.points_redemption_rate ?? 100)
    return NextResponse.json({
      balance,
      redemptionRate,
      pointsPerTaka: Number(settingMap.points_per_taka ?? 1),
      history: points.map((p) => ({
        id: p.id,
        points: p.points,
        type: p.type,
        description: p.description,
        orderId: p.orderId,
        createdAt: p.createdAt,
      })),
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
