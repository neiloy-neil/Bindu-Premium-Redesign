import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/adminAuth"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  })
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Find a unique slug
  let slug = `${product.slug}-copy`
  let attempt = 0
  while (await prisma.product.findUnique({ where: { slug } })) {
    attempt++
    slug = `${product.slug}-copy-${attempt}`
  }

  // Generate unique SKU for each variant
  const timestamp = Date.now().toString(36).toUpperCase()

  const newProduct = await prisma.product.create({
    data: {
      name: `Copy of ${product.name}`,
      slug,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice,
      categoryId: product.categoryId,
      brandId: product.brandId,
      tags: product.tags,
      isActive: false,
      isFeatured: false,
      isDigital: product.isDigital,
      downloadLimit: product.downloadLimit,
      downloadExpireHours: product.downloadExpireHours,
      minQty: product.minQty,
      maxQty: product.maxQty,
      stepQty: product.stepQty,
      weight: product.weight,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      ogImage: product.ogImage,
      releaseAt: null,
      variants: {
        create: product.variants.map((v, i) => ({
          size: v.size,
          color: v.color,
          colorHex: v.colorHex,
          sku: `${v.sku}-${timestamp}${i > 0 ? i : ""}`,
          stock: 0,
          price: v.price,
          comparePrice: v.comparePrice,
          costPrice: v.costPrice,
          minQty: v.minQty,
          maxQty: v.maxQty,
        })),
      },
      images: {
        create: product.images.map(img => ({
          url: img.url,
          alt: img.alt,
          sortOrder: img.sortOrder,
          videoUrl: img.videoUrl,
          isVideo: img.isVideo,
        })),
      },
    },
  })

  return NextResponse.json({ id: newProduct.id })
}
