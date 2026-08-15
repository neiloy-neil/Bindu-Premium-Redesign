import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import ProductAnalyticsClient from "./ProductAnalyticsClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function ProductAnalyticsPage() {
  const session = await requireAdmin()
  if (!session) redirect("/login")
  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <PageHeader title="Product Analytics" description="Revenue, units sold and conversion rates per product." />
      <ProductAnalyticsClient />
    </div>
  )
}
