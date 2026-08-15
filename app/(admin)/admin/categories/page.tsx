import prisma from "@/lib/prisma"
import { CategoryClient } from "./CategoryClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { attributeConfig: true, _count: { select: { products: true } } },
  })

  const formatted = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    isActive: c.isActive,
    sortOrder: c.sortOrder,
    productCount: c._count.products,
    image: c.image || "",
    description: c.description || "",
    attr1Label: c.attributeConfig?.attr1Label || "Size",
    attr2Label: c.attributeConfig?.attr2Label || "Color",
    attr1Hint: c.attributeConfig?.attr1Hint || "",
    attr2Hint: c.attributeConfig?.attr2Hint || "",
  }))

  return (
    <div className="space-y-4">
      <PageHeader
        title="Categories"
        description="Configure each category's variant attribute labels so they make sense for any product type — clothes, gadgets, shoes, etc."
      />
      <CategoryClient data={formatted} />
    </div>
  )
}
