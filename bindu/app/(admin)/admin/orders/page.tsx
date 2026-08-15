import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"
import OrdersFilters from "./OrdersFilters"
import OrdersBulkClient from "./OrdersBulkClient"
import AdminPagination from "@/components/admin/AdminPagination"
import { getCustomerRiskBatch } from "@/lib/customerRisk"
import { Download } from "lucide-react"
import PageHeader from "@/components/admin/PageHeader"
import { FilterTabs } from "@/components/admin/FilterTabs"

const PAGE_SIZE = 20

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; paymentMethod?: string; page?: string }>
}) {
  const params = await searchParams
  const search = params.search || ""
  const status = params.status || ""
  const paymentMethod = params.paymentMethod || ""
  const page = Math.max(1, parseInt(params.page || "1"))
  const skip = (page - 1) * PAGE_SIZE

  const where: any = {
    ...(search
      ? {
          OR: [
            { orderNumber: { contains: search, mode: "insensitive" } },
            { shippingName: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
    ...(paymentMethod ? { paymentMethod } : {}),
  }

  const [orders, total, allCount, pendingCount, confirmedCount, shippedCount, deliveredCount, cancelledCount] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }).catch(() => []),
    prisma.order.count({ where }).catch(() => 0),
    prisma.order.count({}).catch(() => 0),
    prisma.order.count({ where: { status: "PENDING" } }).catch(() => 0),
    prisma.order.count({ where: { status: "CONFIRMED" } }).catch(() => 0),
    prisma.order.count({ where: { status: "SHIPPED" } }).catch(() => 0),
    prisma.order.count({ where: { status: "DELIVERED" } }).catch(() => 0),
    prisma.order.count({ where: { status: "CANCELLED" } }).catch(() => 0),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const riskMap = await getCustomerRiskBatch(orders.map((o: any) => o.shippingPhone)).catch(() => new Map())
  const riskByPhone = Object.fromEntries(riskMap)

  const tabs = [
    { label: "All", value: "", href: "/admin/orders", count: allCount },
    { label: "Pending", value: "PENDING", href: "/admin/orders?status=PENDING", count: pendingCount },
    { label: "Confirmed", value: "CONFIRMED", href: "/admin/orders?status=CONFIRMED", count: confirmedCount },
    { label: "Shipped", value: "SHIPPED", href: "/admin/orders?status=SHIPPED", count: shippedCount },
    { label: "Delivered", value: "DELIVERED", href: "/admin/orders?status=DELIVERED", count: deliveredCount },
    { label: "Cancelled", value: "CANCELLED", href: "/admin/orders?status=CANCELLED", count: cancelledCount },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Orders"
        description={`${total.toLocaleString()} order${total !== 1 ? "s" : ""}${status ? ` · ${status.charAt(0) + status.slice(1).toLowerCase()}` : ""}`}
        actions={
          <a href={`/api/admin/orders/export${status ? `?status=${status}` : ""}`}>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </a>
        }
      />

      <FilterTabs tabs={tabs} activeValue={status} />

      <Card>
        <CardContent className="p-0">
          <OrdersFilters
            currentSearch={search}
            currentStatus={status}
            currentPayment={paymentMethod}
          />
          <OrdersBulkClient orders={orders as any} riskByPhone={riskByPhone} />
          <AdminPagination page={page} totalPages={totalPages} basePath="/admin/orders" />
        </CardContent>
      </Card>
    </div>
  )
}
