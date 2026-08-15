import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import CheckoutFieldsClient from "./CheckoutFieldsClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function CheckoutFieldsPage() {
  const session = await requireAdmin()
  if (!session) redirect("/login")
  const fields = await prisma.checkoutField.findMany({ orderBy: [{ step: "asc" }, { sortOrder: "asc" }] })
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <PageHeader
        title="Checkout Field Editor"
        description="Add custom fields (gift message, special instructions, etc.) to the checkout flow."
      />
      <CheckoutFieldsClient data={JSON.parse(JSON.stringify(fields))} />
    </div>
  )
}
