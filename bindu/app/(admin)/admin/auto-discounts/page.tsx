import prisma from "@/lib/prisma"
import { AutoDiscountClient } from "./AutoDiscountClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function AutoDiscountsPage() {
  const discounts = await prisma.autoDiscount.findMany({ orderBy: { createdAt: "desc" } })

  const formatted = discounts.map((d) => ({
    id: d.id,
    name: d.name,
    ruleType: d.ruleType as string,
    thresholdQty: d.thresholdQty,
    thresholdAmt: d.thresholdAmt ? Number(d.thresholdAmt) : null,
    discountPct: Number(d.discountPct),
    isActive: d.isActive,
    endsAt: d.endsAt?.toISOString() || null,
  }))

  return (
    <div className="flex-1 space-y-4">
      <PageHeader
        title="Automatic Discounts"
        description="Applied at checkout without a coupon code. Buy 2 get 10% off, spend ৳2000 get 15% off, etc."
      />
      <AutoDiscountClient data={formatted} />
    </div>
  )
}
