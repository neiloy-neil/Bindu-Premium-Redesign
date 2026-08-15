import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/adminAuth"

export async function GET(req: Request) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const categoryId = searchParams.get("categoryId") || ""

    const products = await prisma.product.findMany({
      where: {
        name: { contains: search, mode: "insensitive" },
        ...(categoryId ? { categoryId } : {}),
      },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(products)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function autoSku() {
  return `VAR-${crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`
}

export async function POST(req: Request) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    const body = await req.json()
    const { name, slug, description, price, comparePrice, categoryId, tags, isActive, isFeatured, images, variants, releaseAt } = body

    // Resolve SKUs — auto-generate blanks, check explicit ones for uniqueness
    const resolvedSkus: string[] = []
    for (const v of variants) {
      const typed = v.sku?.trim()
      const sku = typed || autoSku()
      if (typed) {
        const conflict = await prisma.productVariant.findUnique({ where: { sku: typed } })
        if (conflict) {
          return NextResponse.json({ error: `SKU "${typed}" is already in use by another variant. Please choose a unique SKU.` }, { status: 400 })
        }
      }
      resolvedSkus.push(sku)
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        comparePrice,
        categoryId,
        tags,
        isActive,
        isFeatured,
        releaseAt: releaseAt ? new Date(releaseAt) : null,
        images: {
          create: images.map((img: any, i: number) => ({ url: img.url, alt: img.alt || "", sortOrder: i }))
        },
        variants: {
          create: variants.map((v: any, i: number) => ({
            size: v.size,
            color: v.color,
            colorHex: v.colorHex,
            sku: resolvedSkus[i],
            stock: v.stock,
            price: v.price || null,
            comparePrice: v.comparePrice || null,
          }))
        }
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
