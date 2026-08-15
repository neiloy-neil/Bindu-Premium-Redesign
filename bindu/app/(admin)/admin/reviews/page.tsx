import { requireAdmin } from "@/lib/adminAuth"
import { redirect } from "next/navigation"
import ReviewsClient from "./ReviewsClient"
import prisma from "@/lib/prisma"
import PageHeader from "@/components/admin/PageHeader"
import { FilterTabs } from "@/components/admin/FilterTabs"

export const dynamic = "force-dynamic"

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { session } = await requireAdmin()
  if (!session) redirect("/login")

  const params = await searchParams
  const status = params.status || "pending"

  const where =
    status === "pending"
      ? { isApproved: false }
      : status === "approved"
      ? { isApproved: true }
      : {}

  const [reviews, allCount, pendingCount, approvedCount] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true, slug: true } },
        media: true,
      },
    }),
    prisma.review.count({}).catch(() => 0),
    prisma.review.count({ where: { isApproved: false } }).catch(() => 0),
    prisma.review.count({ where: { isApproved: true } }).catch(() => 0),
  ])

  const tabs = [
    { label: "All", value: "all", href: "/admin/reviews?status=all", count: allCount },
    { label: "Pending", value: "pending", href: "/admin/reviews?status=pending", count: pendingCount },
    { label: "Approved", value: "approved", href: "/admin/reviews?status=approved", count: approvedCount },
  ]

  const serialized = reviews.map(r => ({ ...r, createdAt: r.createdAt.toISOString() }))

  return (
    <div className="space-y-4">
      <PageHeader
        title="Reviews"
        description="Moderate customer product reviews."
      />
      <FilterTabs tabs={tabs} activeValue={status} />
      <ReviewsClient initialReviews={serialized} />
    </div>
  )
}
