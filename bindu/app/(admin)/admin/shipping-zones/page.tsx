import prisma from "@/lib/prisma"
import ShippingZoneClient from "./ShippingZoneClient"
import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import PageHeader from "@/components/admin/PageHeader"

export default async function ShippingZonesPage() {
  const session = await requireAdmin()
  if (!session) redirect("/login")
  const zones = await prisma.shippingZone.findMany({ orderBy: { sortOrder: "asc" } })
  const data = JSON.parse(JSON.stringify(zones))
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <PageHeader
        title="Shipping Zones"
        description="Set delivery charges per zone. Zone is matched by the customer's district at checkout."
      />
      <ShippingZoneClient data={data} />
    </div>
  )
}
