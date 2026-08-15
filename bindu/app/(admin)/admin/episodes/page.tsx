import prisma from "@/lib/prisma"
import Link from "next/link"
import { PlusCircle, Eye, EyeOff } from "lucide-react"
import EpisodeTogglePublish from "./EpisodeTogglePublish"
import PageHeader from "@/components/admin/PageHeader"

export const dynamic = "force-dynamic"

export default async function EpisodesAdminPage() {
  const episodes = await prisma.episode.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  })

  return (
    <div className="space-y-4">
      <PageHeader
        title="Episodes"
        description="Editorial collections — each episode tells the story of a drop."
        actions={
          <Link
            href="/admin/episodes/new"
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            New Episode
          </Link>
        }
      />

      {episodes.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <p className="text-muted-foreground text-sm">No episodes yet.</p>
          <Link href="/admin/episodes/new" className="mt-3 inline-block text-sm font-medium underline">
            Create the first episode →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">#</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Slug</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Products</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {episodes.map((ep) => (
                <tr key={ep.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{ep.number}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{ep.name}</div>
                    {ep.tagline && <div className="text-xs text-muted-foreground truncate max-w-xs">{ep.tagline}</div>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">/episode/{ep.slug}</td>
                  <td className="px-4 py-3 text-center">{ep._count.products}</td>
                  <td className="px-4 py-3">
                    <EpisodeTogglePublish id={ep.id} isPublished={ep.isPublished} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/episodes/${ep.id}`}
                        className="text-xs font-medium text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <a
                        href={`/episode/${ep.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Preview ↗
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
