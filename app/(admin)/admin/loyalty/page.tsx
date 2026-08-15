import prisma from "@/lib/prisma"
import { LoyaltyClient } from "./LoyaltyClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function LoyaltyPage() {
  const users = await prisma.user.findMany({
    include: {
      loyaltyPoints: true,
    },
  })

  const customers = users
    .map((user) => {
      let earned = 0
      let redeemed = 0
      user.loyaltyPoints.forEach((lp) => {
        if (lp.points > 0) earned += lp.points
        else redeemed += Math.abs(lp.points)
      })

      return {
        id: user.id,
        name: user.name || "N/A",
        email: user.email,
        currentBalance: earned - redeemed,
        totalEarned: earned,
        totalRedeemed: redeemed,
      }
    })
    .sort((a, b) => b.currentBalance - a.currentBalance)

  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: ["points_per_taka", "points_redemption_rate"],
      },
    },
  })

  const settingsMap = settings.reduce((acc, s) => {
    acc[s.key] = s.value
    return acc
  }, {} as Record<string, string>)

  return (
    <div className="flex-1 space-y-4">
      <PageHeader title="Loyalty Program" />
      <LoyaltyClient
        customers={customers} 
        initialSettings={{
          pointsPerTaka: settingsMap["points_per_taka"] || "1",
          pointsRedemptionRate: settingsMap["points_redemption_rate"] || "10",
        }}
      />
    </div>
  )
}
