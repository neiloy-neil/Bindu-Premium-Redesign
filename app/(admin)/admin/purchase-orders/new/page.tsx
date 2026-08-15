import prisma from "@/lib/prisma"
import NewPurchaseOrderForm from "@/components/admin/NewPurchaseOrderForm"
import PageHeader from "@/components/admin/PageHeader"

export default async function NewPurchaseOrderPage() {
  const suppliers = await prisma.supplier.findMany({ orderBy: { name: "asc" } })

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Purchase Orders", href: "/admin/purchase-orders" }]}
        title="New Purchase Order"
        description="Record inventory you're buying from a supplier."
      />
      <NewPurchaseOrderForm suppliers={suppliers.map((s) => ({ id: s.id, name: s.name }))} />
    </div>
  )
}
