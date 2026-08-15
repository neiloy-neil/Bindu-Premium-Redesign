import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import BrandsClient from "./BrandsClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function BrandsPage() {
  const session = await requireAdmin()
  if (!session) redirect("/login")
  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  })
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <PageHeader title="Brands" description="Manage product brands. Assign a brand to products for brand landing pages and filtering." />
      <BrandsClient data={JSON.parse(JSON.stringify(brands))} />
    </div>
  )
}
