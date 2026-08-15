import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import ReturnsClient from "./ReturnsClient"
import PageHeader from "@/components/admin/PageHeader"
import { FilterTabs } from "@/components/admin/FilterTabs"

export default async function ReturnsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const session = await requireAdmin()
  if (!session) redirect("/login")

  const params = await searchParams
  const status = params.status || ""

  const where: any = status ? { status } : {}

  const [returns, allCount, pendingCount, approvedCount, rejectedCount] = await Promise.all([
    prisma.returnRequest.findMany({
      where,
      include: {
        order: { select: { orderNumber: true, shippingName: true, shippingPhone: true } },
        items: { include: { orderItem: { select: { productName: true, size: true, color: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.returnRequest.count({}).catch(() => 0),
    prisma.returnRequest.count({ where: { status: "PENDING" } }).catch(() => 0),
    prisma.returnRequest.count({ where: { status: "APPROVED" } }).catch(() => 0),
    prisma.returnRequest.count({ where: { status: "REJECTED" } }).catch(() => 0),
  ])

  const tabs = [
    { label: "All", value: "", href: "/admin/returns", count: allCount },
    { label: "Pending", value: "PENDING", href: "/admin/returns?status=PENDING", count: pendingCount },
    { label: "Approved", value: "APPROVED", href: "/admin/returns?status=APPROVED", count: approvedCount },
    { label: "Rejected", value: "REJECTED", href: "/admin/returns?status=REJECTED", count: rejectedCount },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Returns & RMA"
        description="Review and approve customer return requests."
      />
      <FilterTabs tabs={tabs} activeValue={status} />
      <ReturnsClient data={JSON.parse(JSON.stringify(returns))} />
    </div>
  )
}
