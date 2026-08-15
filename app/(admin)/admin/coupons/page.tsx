import prisma from "@/lib/prisma"
import { CouponClient } from "./CouponClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function CouponsPage() {
  const [coupons, categories] = await Promise.all([
    prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      include: { rule: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ])

  const formattedCoupons = coupons.map((c) => ({
    id: c.id,
    code: c.code,
    type: c.type,
    value: Number(c.value),
    minOrderAmount: c.minOrderAmount ? Number(c.minOrderAmount) : null,
    maxUses: c.maxUses,
    usedCount: c.usedCount,
    isActive: c.isActive,
    expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
    createdAt: c.createdAt.toISOString(),
    rule: c.rule ? {
      id: c.rule.id,
      ruleType: c.rule.ruleType,
      buyQty: c.rule.buyQty,
      getQty: c.rule.getQty,
      categoryId: c.rule.categoryId,
      minItems: c.rule.minItems,
      maxDiscount: c.rule.maxDiscount ? Number(c.rule.maxDiscount) : null,
      isStackable: c.rule.isStackable,
      usagePerUser: c.rule.usagePerUser,
    } : null,
  }))

  return (
    <div className="space-y-4">
      <PageHeader title="Coupons" />
      <CouponClient data={formattedCoupons} categories={categories} />
    </div>
  )
}
