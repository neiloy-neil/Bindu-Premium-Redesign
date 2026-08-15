import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import LocationsClient from "./LocationsClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function LocationsPage() {
  const session = await requireAdmin()
  if (!session) redirect("/login")
  const locations = await prisma.location.findMany({
    include: { _count: { select: { stock: true } } },
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
  })
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <PageHeader
        title="Inventory Locations"
        description="Manage multiple warehouse or store locations with per-location stock."
      />
      <LocationsClient data={JSON.parse(JSON.stringify(locations))} />
    </div>
  )
}
