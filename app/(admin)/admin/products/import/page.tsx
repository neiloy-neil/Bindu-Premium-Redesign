import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import ProductImportClient from "./ProductImportClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function ProductImportPage() {
  const session = await requireAdmin()
  if (!session) redirect("/login")
  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        breadcrumbs={[{ label: "Products", href: "/admin/products" }]}
        title="Import Products"
        description="Upload a CSV file to bulk-create products and variants. Run a dry-run first to check for errors."
      />
      <ProductImportClient />
    </div>
  )
}
