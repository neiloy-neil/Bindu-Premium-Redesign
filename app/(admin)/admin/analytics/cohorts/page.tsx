import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import CohortClient from "./CohortClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function CohortPage() {
  const session = await requireAdmin()
  if (!session) redirect("/login")
  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <PageHeader title="Customer Cohort & LTV" description="Lifetime value, RFM segmentation and purchase frequency for every customer." />
      <CohortClient />
    </div>
  )
}
