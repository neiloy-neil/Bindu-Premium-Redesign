import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import PriceRulesClient from "./PriceRulesClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function PriceRulesPage() {
  const session = await requireAdmin()
  if (!session) redirect("/login")
  const rules = await prisma.priceRule.findMany({
    include: { product: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  })
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <PageHeader
        title="Dynamic Pricing Rules"
        description="Tag-based and quantity-tier discounts applied automatically at checkout."
      />
      <PriceRulesClient data={JSON.parse(JSON.stringify(rules))} />
    </div>
  )
}
