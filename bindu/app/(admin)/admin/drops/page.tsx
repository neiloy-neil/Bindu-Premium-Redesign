import prisma from "@/lib/prisma"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import DropsClient from "./DropsClient"
import PageHeader from "@/components/admin/PageHeader"

export const dynamic = "force-dynamic"

export default async function AdminDropsPage() {
  const now = new Date()

  const [upcoming, past, totalNotifies] = await Promise.all([
    prisma.product.findMany({
      where: { releaseAt: { gt: now } },
      orderBy: { releaseAt: "asc" },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        variants: true,
        category: { select: { name: true } },
        _count: { select: { dropNotifies: true } },
      },
    }).catch(() => []),
    prisma.product.findMany({
      where: { releaseAt: { lte: now, not: null } },
      orderBy: { releaseAt: "desc" },
      take: 20,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        variants: true,
        category: { select: { name: true } },
        _count: { select: { dropNotifies: true } },
      },
    }).catch(() => []),
    prisma.dropNotify.count().catch(() => 0),
  ])

  const shape = (products: typeof upcoming, isUpcoming: boolean) =>
    products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      releaseAt: p.releaseAt!.toISOString(),
      coverImage: p.images[0]?.url ?? null,
      totalStock: p.variants.reduce((s, v) => s + v.stock, 0),
      price: Number(p.price),
      category: p.category?.name ?? null,
      notifyCount: p._count.dropNotifies,
      isUpcoming,
    }))

  const upcomingTotalStock = upcoming.reduce(
    (s, p) => s + p.variants.reduce((vs, v) => vs + v.stock, 0), 0
  )

  return (
    <div className="space-y-4">
      <PageHeader
        title="Drops"
        description="Manage scheduled release dates for limited drops."
        actions={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-amber-500 text-slate-900 rounded-md hover:bg-amber-400 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> New Product
          </Link>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Upcoming Drops", value: upcoming.length },
          { label: "Units Scheduled", value: upcomingTotalStock.toLocaleString() },
          { label: "Notify Signups", value: totalNotifies.toLocaleString() },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-slate-200 px-5 py-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      <DropsClient
        upcoming={shape(upcoming, true)}
        past={shape(past, false)}
      />
    </div>
  )
}
