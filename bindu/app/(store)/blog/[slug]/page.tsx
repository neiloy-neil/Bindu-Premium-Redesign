import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import ProductCard from "@/components/store/ProductCard"
import { serialize } from "@/lib/utils"
import type { Metadata } from "next"
import { ChevronLeft, ChevronRight } from "lucide-react"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bindupremium.com"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug, isPublished: true } }).catch(() => null)
  if (!post) return { title: "Not Found" }
  return {
    title: post.title,
    description: post.excerpt || "",
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      images: post.coverImage ? [post.coverImage] : [],
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug, isPublished: true },
    include: {
      category: true,
      products: { include: { product: { include: { images: true, variants: true, category: true } } } },
    },
  }).catch(() => null)

  if (!post) notFound()

  // Fetch adjacent posts for prev/next navigation
  const [prevPost, nextPost] = await Promise.all([
    prisma.blogPost.findFirst({
      where: { isPublished: true, publishedAt: { lt: post.publishedAt ?? new Date() } },
      orderBy: { publishedAt: "desc" },
      select: { slug: true, title: true },
    }).catch(() => null),
    prisma.blogPost.findFirst({
      where: { isPublished: true, publishedAt: { gt: post.publishedAt ?? new Date() } },
      orderBy: { publishedAt: "asc" },
      select: { slug: true, title: true },
    }).catch(() => null),
  ])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || "",
    author: { "@type": "Person", name: post.authorName },
    datePublished: post.publishedAt?.toISOString(),
    image: post.coverImage || undefined,
    url: `${SITE_URL}/blog/${slug}`,
  }

  const tags = post.tags ? post.tags.split(",").map(t => t.trim()).filter(Boolean) : []

  return (
    <div className="bg-[#0A0A0A] min-h-screen animate-in fade-in duration-500">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {post.coverImage && (
        <div className="relative w-full aspect-[21/9] overflow-hidden">
          <Image src={post.coverImage} alt={post.title} fill sizes="100vw" className="object-cover opacity-80" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0A]" />
        </div>
      )}

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-white/30">
          <Link href="/blog" className="hover:text-bindu-cyan transition-colors">Journal</Link>
          <span>/</span>
          {post.category && (
            <>
              <span className="text-bindu-cyan">{post.category.name}</span>
              <span>/</span>
            </>
          )}
          <span className="text-white/20 truncate max-w-[200px]">{post.title}</span>
        </div>

        <h1 className="font-heading font-black text-white uppercase leading-none tracking-tight mb-6" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-white/30 font-mono pb-8 border-b border-white/10 mb-10">
          <span>By <span className="text-white/60 font-bold">{post.authorName}</span></span>
          {post.publishedAt && (
            <span>{new Date(post.publishedAt).toLocaleDateString("en-BD", { year: "numeric", month: "long", day: "numeric" })}</span>
          )}
          {tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {tags.map(t => (
                <Link
                  key={t}
                  href={`/blog?tag=${encodeURIComponent(t)}`}
                  className="px-2 py-0.5 bg-white/5 border border-white/10 hover:border-bindu-cyan/50 hover:text-bindu-cyan transition-colors text-[10px] uppercase tracking-wide"
                >
                  {t}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none text-white/70 prose-headings:text-white prose-headings:font-heading prose-headings:uppercase prose-a:text-bindu-cyan prose-strong:text-white prose-code:text-bindu-cyan prose-blockquote:border-bindu-cyan prose-blockquote:text-white/50"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Featured Products */}
        {post.products.length > 0 && (
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-bindu-cyan mb-6">Featured in this story</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {serialize(post.products.map(bp => bp.product)).map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {/* Prev / Next navigation */}
        {(prevPost || nextPost) && (
          <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
            {prevPost ? (
              <Link href={`/blog/${prevPost.slug}`} className="group flex flex-col gap-2 p-4 border border-white/10 hover:border-bindu-cyan/30 transition-colors">
                <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-white/25">
                  <ChevronLeft className="w-3 h-3" /> Previous
                </span>
                <span className="text-xs text-white/60 font-bold uppercase tracking-wide leading-tight group-hover:text-white transition-colors line-clamp-2">{prevPost.title}</span>
              </Link>
            ) : <div />}

            {nextPost ? (
              <Link href={`/blog/${nextPost.slug}`} className="group flex flex-col gap-2 p-4 border border-white/10 hover:border-bindu-cyan/30 transition-colors text-right ml-auto w-full">
                <span className="flex items-center justify-end gap-1 font-mono text-[9px] uppercase tracking-widest text-white/25">
                  Next <ChevronRight className="w-3 h-3" />
                </span>
                <span className="text-xs text-white/60 font-bold uppercase tracking-wide leading-tight group-hover:text-white transition-colors line-clamp-2">{nextPost.title}</span>
              </Link>
            ) : <div />}
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link href="/blog" className="inline-block font-mono text-[10px] tracking-widest uppercase text-white/30 hover:text-bindu-cyan transition-colors border-b border-white/15 pb-1">
            ← All Posts
          </Link>
        </div>
      </div>
    </div>
  )
}
