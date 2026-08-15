import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import OrderBumpsClient from "./OrderBumpsClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function OrderBumpsPage() {
  const session = await requireAdmin()
  if (!session) redirect("/login")

  const [bumps, products] = await Promise.all([
    prisma.orderBump.findMany({
      include: { product: { select: { id: true, name: true, price: true, images: { take: 1 } } } },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ])

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <PageHeader
        title="Order Bumps"
        description="Offer add-on products at checkout with a compelling one-click headline."
      />
      <OrderBumpsClient data={JSON.parse(JSON.stringify(bumps))} products={JSON.parse(JSON.stringify(products))} />
    </div>
  )
}
