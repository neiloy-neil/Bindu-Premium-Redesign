import prisma from "@/lib/prisma"
import { PageClient } from "./PageClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function PagesAdminPage() {
  const pages = await prisma.page.findMany({ orderBy: { slug: "asc" } })

  const formatted = pages.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    content: p.content,
    isPublished: p.isPublished,
    updatedAt: p.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-4">
      <PageHeader
        title="Content Pages"
        description="Edit FAQ, Returns, Size Guide, Contact and other info pages without touching code."
      />
      <PageClient data={formatted} />
    </div>
  )
}
