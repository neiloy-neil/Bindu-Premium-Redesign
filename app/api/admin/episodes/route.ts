import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/adminAuth"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error
  const episodes = await prisma.episode.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { products: true } } } })
  return NextResponse.json(episodes)
}

export async function POST(req: Request) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    const { name, slug, number, tagline, story, heroImage, heroVideo, artistNote, artistName, isPublished, sortOrder, products } = await req.json()

    const episode = await prisma.episode.create({
      data: {
        name, slug, number,
        tagline: tagline || null,
        story: story || null,
        heroImage: heroImage || null,
        heroVideo: heroVideo || null,
        artistNote: artistNote || null,
        artistName: artistName || null,
        isPublished: !!isPublished,
        sortOrder: Number(sortOrder) || 0,
        products: {
          create: (products || []).map((p: any) => ({
            productId: p.productId,
            sortOrder: p.sortOrder,
            editorialNote: p.editorialNote || null,
          })),
        },
      },
    })
    return NextResponse.json(episode, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
