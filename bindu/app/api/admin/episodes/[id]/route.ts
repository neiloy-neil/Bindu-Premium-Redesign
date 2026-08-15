import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/adminAuth"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    const { id } = await params
    const { name, slug, number, tagline, story, heroImage, heroVideo, artistNote, artistName, isPublished, sortOrder, products } = await req.json()

    await prisma.episode.update({
      where: { id },
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
      },
    })

    // Re-sync episode products
    await prisma.episodeProduct.deleteMany({ where: { episodeId: id } })
    if ((products || []).length > 0) {
      await prisma.episodeProduct.createMany({
        data: (products as any[]).map((p) => ({
          episodeId: id,
          productId: p.productId,
          sortOrder: p.sortOrder,
          editorialNote: p.editorialNote || null,
        })),
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    const { id } = await params
    const body = await req.json()
    const episode = await prisma.episode.update({ where: { id }, data: body })
    return NextResponse.json(episode)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    const { id } = await params
    await prisma.episode.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
