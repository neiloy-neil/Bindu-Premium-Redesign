import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export async function renderContentPage(slug: string, fallbackTitle: string) {
  const page = await prisma.page.findUnique({ where: { slug } })

  if (!page || !page.isPublished) {
    return { title: fallbackTitle, content: null }
  }

  return { title: page.title, content: page.content }
}

export default function ContentPage({ title, content }: { title: string; content: string | null }) {
  return (
    <div className="bg-[#0A0A0A] min-h-screen animate-in fade-in duration-500">
      <div className="border-b border-white/10 py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-heading font-black text-white uppercase leading-none tracking-tight" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>{title}</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-3xl py-16 md:py-20">
        {content ? (
          <div
            className="prose prose-invert prose-sm md:prose-base max-w-none prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-tight prose-a:text-bindu-cyan prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-white/40">This page hasn't been set up yet. Check back soon.</p>
        )}
      </div>
    </div>
  )
}
