import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import BlogAdminClient from "./BlogAdminClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function BlogAdminPage() {
  const session = await requireAdmin()
  if (!session) redirect("/login")
  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
  ])
  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <PageHeader
        title="Blog Posts"
        description="Create and manage editorial content. Published posts appear on /blog."
      />
      <BlogAdminClient data={JSON.parse(JSON.stringify(posts))} categories={JSON.parse(JSON.stringify(categories))} />
    </div>
  )
}
