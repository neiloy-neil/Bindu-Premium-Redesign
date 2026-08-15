import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const categories = await prisma.blogCategory.findMany({ orderBy: { name: "asc" } })
  return NextResponse.json(categories)
}

export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 })
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  try {
    const category = await prisma.blogCategory.create({ data: { name: name.trim(), slug } })
    return NextResponse.json(category)
  } catch {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 })
  }
}

export async function DELETE(req: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await req.json()
  await prisma.blogCategory.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
