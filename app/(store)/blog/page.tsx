import prisma from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Journal | Bindu Premium", description: "Stories, drops, and culture from BINDU PREMIUM." }

const PER_PAGE = 9

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string; tag?: string }> }) {
  const { page: pageParam, tag } = await searchParams
  const page = Math.max(1, parseInt(pageParam || "1", 10))
  const skip = (page - 1) * PER_PAGE

  const where = {
    isPublished: true,
    ...(tag ? { tags: { contains: tag } } : {}),
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      skip,
      take: PER_PAGE,
    }).catch(() => []),
    prisma.blogPost.count({ where }).catch(() => 0),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  return (
    <div className="bg-[#0A0A0A] min-h-screen animate-in fade-in duration-500">

      {/* Header */}
      <div className="border-b border-white/10 py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-bindu-cyan mb-4">Journal</p>
          <h1 className="font-heading font-black text-white uppercase leading-none tracking-tight mb-5" style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}>
            Stories &amp;<br />Culture.
          </h1>
          <p className="text-white/40 text-sm max-w-md leading-relaxed">
            Drops, design notes, and the world behind the arc.
          </p>
          {tag && (
            <div className="mt-6 flex items-center gap-3">
              <span className="font-mono text-[10px] tracking-widest uppercase text-white/30">Filtered by tag:</span>
              <span className="px-3 py-1 bg-bindu-cyan/10 border border-bindu-cyan/30 text-bindu-cyan font-mono text-[10px] uppercase tracking-widest">{tag}</span>
              <Link href="/blog" className="text-[10px] font-mono uppercase tracking-widest text-white/30 hover:text-white transition-colors underline">Clear</Link>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-16 md:py-20">
        {posts.length === 0 && (
          <div className="py-16 text-center border border-white/10">
            <p className="font-mono text-[10px] tracking-widest uppercase text-white/20 mb-2">{tag ? `No posts tagged "${tag}"` : "No posts yet"}</p>
            <p className="text-white/30 text-sm">Check back soon.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {posts.map(post => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group bg-[#0A0A0A]">
              <article className="bg-[#111] border border-white/5 hover:border-white/20 transition-all duration-300 h-full flex flex-col">
                {post.coverImage && (
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  {post.category && (
                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-bindu-cyan mb-3">{post.category.name}</span>
                  )}
                  <h2 className="font-heading font-bold text-white text-base uppercase tracking-tight leading-tight mb-2 group-hover:text-bindu-cyan transition-colors flex-1">{post.title}</h2>
                  {post.excerpt && <p className="text-xs text-white/40 line-clamp-2 leading-relaxed mb-4">{post.excerpt}</p>}
                  <div className="flex items-center justify-between text-[10px] text-white/25 font-mono uppercase tracking-wide border-t border-white/10 pt-4 mt-auto">
                    <span>{post.authorName}</span>
                    <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" }) : ""}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {page > 1 && (
              <Link
                href={`/blog?page=${page - 1}${tag ? `&tag=${tag}` : ""}`}
                className="px-5 py-2.5 border border-white/15 text-white/50 text-xs font-bold uppercase tracking-widest hover:border-bindu-cyan hover:text-bindu-cyan transition-colors"
              >
                ← Prev
              </Link>
            )}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <Link
                  key={n}
                  href={`/blog?page=${n}${tag ? `&tag=${tag}` : ""}`}
                  className={`w-9 h-9 flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                    n === page
                      ? "bg-bindu-cyan text-bindu-black"
                      : "border border-white/15 text-white/40 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {n}
                </Link>
              ))}
            </div>
            {page < totalPages && (
              <Link
                href={`/blog?page=${page + 1}${tag ? `&tag=${tag}` : ""}`}
                className="px-5 py-2.5 border border-white/15 text-white/50 text-xs font-bold uppercase tracking-widest hover:border-bindu-cyan hover:text-bindu-cyan transition-colors"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
