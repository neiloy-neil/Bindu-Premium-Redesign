import prisma from "@/lib/prisma"
import EpisodeForm from "../EpisodeForm"
import PageHeader from "@/components/admin/PageHeader"

export default async function NewEpisodePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  })
  return (
    <div className="mx-auto max-w-4xl w-full">
      <PageHeader breadcrumbs={[{ label: "Episodes", href: "/admin/episodes" }]} />
      <EpisodeForm initialData={null} allProducts={products} />
    </div>
  )
}
