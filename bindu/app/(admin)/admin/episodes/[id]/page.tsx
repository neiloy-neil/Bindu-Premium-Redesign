import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { serialize } from "@/lib/utils"
import EpisodeForm from "../EpisodeForm"
import PageHeader from "@/components/admin/PageHeader"

export default async function EditEpisodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [episode, products] = await Promise.all([
    id === "new"
      ? null
      : prisma.episode.findUnique({
          where: { id },
          include: { products: { orderBy: { sortOrder: "asc" }, include: { product: { select: { id: true, name: true, slug: true } } } } },
        }),
    prisma.product.findMany({ where: { isActive: true }, select: { id: true, name: true, slug: true }, orderBy: { name: "asc" } }),
  ])

  if (id !== "new" && !episode) notFound()

  return (
    <div className="mx-auto max-w-4xl w-full">
      <PageHeader breadcrumbs={[{ label: "Episodes", href: "/admin/episodes" }]} />
      <EpisodeForm initialData={episode ? serialize(episode) : null} allProducts={products} />
    </div>
  )
}
