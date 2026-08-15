import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import AffiliatesClient from "./AffiliatesClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function AffiliatesPage() {
  const session = await requireAdmin()
  if (!session) redirect("/login")
  const affiliates = await prisma.affiliate.findMany({
    include: { _count: { select: { clicks: true, conversions: true } } },
    orderBy: { createdAt: "desc" },
  })
  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <PageHeader title="Affiliates & Referrals" description="Manage affiliates. Share links like bindupremiumbd.com?ref=CODE" />
      <AffiliatesClient data={JSON.parse(JSON.stringify(affiliates))} />
    </div>
  )
}
