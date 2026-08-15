import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import MembershipsClient from "./MembershipsClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function MembershipsPage() {
  const session = await requireAdmin()
  if (!session) redirect("/login")
  const plans = await prisma.membershipPlan.findMany({
    include: { _count: { select: { subscriptions: true } } },
    orderBy: { sortOrder: "asc" },
  })
  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <PageHeader title="Membership Plans" description="Create tiered membership plans with exclusive discounts and perks." />
      <MembershipsClient data={JSON.parse(JSON.stringify(plans))} />
    </div>
  )
}
