import { NextRequest, NextResponse, after } from "next/server"
import prisma from "@/lib/prisma"
import { sendDropNotifyConfirmation } from "@/lib/email"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { email } = await req.json().catch(() => ({}))

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 })
  }

  const product = await prisma.product.findFirst({
    where: { id, releaseAt: { gt: new Date() } },
    select: { id: true, name: true, slug: true, releaseAt: true },
  })
  if (!product) return NextResponse.json({ error: "Drop not found" }, { status: 404 })

  const existing = await prisma.dropNotify.findUnique({
    where: { productId_email: { productId: id, email } },
  })

  await prisma.dropNotify.upsert({
    where: { productId_email: { productId: id, email } },
    update: {},
    create: { productId: id, email },
  })

  const count = await prisma.dropNotify.count({ where: { productId: id } })

  // Only send confirmation on first signup — runs after response via after()
  if (!existing) {
    after(() => sendDropNotifyConfirmation({
      to: email,
      productName: product.name,
      productSlug: product.slug,
      releaseAt: product.releaseAt!,
    }).catch((err) => console.error("[drop-notify] email failed:", err)))
  }

  return NextResponse.json({ success: true, count })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const count = await prisma.dropNotify.count({ where: { productId: id } })
  return NextResponse.json({ count })
}
