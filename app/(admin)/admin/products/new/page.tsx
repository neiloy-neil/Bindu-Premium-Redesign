import ProductForm from "@/components/admin/ProductForm"
import prisma from "@/lib/prisma"
import PageHeader from "@/components/admin/PageHeader"

export default async function NewProductPage() {
  const categories = await prisma.category.findMany().catch(() => [])

  return (
    <div className="mx-auto max-w-5xl w-full">
      <PageHeader breadcrumbs={[{ label: "Products", href: "/admin/products" }]} />
      <ProductForm categories={categories} />
    </div>
  )
}
