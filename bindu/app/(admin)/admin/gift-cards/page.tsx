import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import GiftCardsClient from "./GiftCardsClient"
import PageHeader from "@/components/admin/PageHeader"
import { FilterTabs } from "@/components/admin/FilterTabs"

export default async function GiftCardsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const session = await requireAdmin()
  if (!session) redirect("/login")

  const params = await searchParams
  const status = params.status || ""

  const where: any =
    status === "active" ? { isActive: true } : status === "inactive" ? { isActive: false } : {}

  const [cards, allCount, activeCount, inactiveCount] = await Promise.all([
    prisma.giftCard.findMany({ where, orderBy: { createdAt: "desc" } }),
    prisma.giftCard.count({}).catch(() => 0),
    prisma.giftCard.count({ where: { isActive: true } }).catch(() => 0),
    prisma.giftCard.count({ where: { isActive: false } }).catch(() => 0),
  ])

  const tabs = [
    { label: "All", value: "", href: "/admin/gift-cards", count: allCount },
    { label: "Active", value: "active", href: "/admin/gift-cards?status=active", count: activeCount },
    { label: "Inactive", value: "inactive", href: "/admin/gift-cards?status=inactive", count: inactiveCount },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Gift Cards"
        description="Issue and manage gift cards. Recipients receive an email with their redemption code."
      />
      <FilterTabs tabs={tabs} activeValue={status} />
      <GiftCardsClient data={JSON.parse(JSON.stringify(cards))} />
    </div>
  )
}
