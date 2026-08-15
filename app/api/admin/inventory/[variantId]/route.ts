import { NextResponse, after } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/adminAuth"
import { sendLowStockAlert, sendBackInStockAlert, sendWishlistRestockAlert } from "@/lib/email"

const LOW_STOCK_THRESHOLD = 5

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ variantId: string }> }
) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    const { variantId } = await params
    const body = await request.json()
    const { stock } = body

    if (typeof stock !== "number" || stock < 0) {
      return NextResponse.json({ error: "Invalid stock value" }, { status: 400 })
    }

    const prevVariant = await prisma.productVariant.findUnique({ where: { id: variantId }, select: { stock: true } })
    const wasOutOfStock = prevVariant ? prevVariant.stock === 0 : false

    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock },
      include: { product: { include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } } },
    })

    // Low stock alert to admin
    if (stock <= LOW_STOCK_THRESHOLD) {
      after(() => sendLowStockAlert([{
        productName: variant.product.name,
        size: variant.size,
        color: variant.color,
        stock,
        sku: variant.sku ?? null,
      }]).catch(() => {}))
    }

    // Back-in-stock: notify waiting customers when stock goes from 0 → positive
    if (stock > 0 && wasOutOfStock) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bindupremiumbd.com"
      const productUrl = `${siteUrl}/shop/${variant.product.slug}`
      const variantLabel = `${variant.size} / ${variant.color}`
      const imageUrl = variant.product.images[0]?.url ?? null

      // Explicit stock-alert subscribers
      const alerts = await prisma.stockAlert.findMany({
        where: { variantId, notified: false },
        select: { id: true, email: true },
      })
      if (alerts.length > 0) {
        await Promise.all(
          alerts.map(a =>
            sendBackInStockAlert({ to: a.email, productName: variant.product.name, variantLabel, productUrl }).catch(() => {})
          )
        )
        await prisma.stockAlert.updateMany({
          where: { id: { in: alerts.map(a => a.id) } },
          data: { notified: true },
        })
      }

      // Wishlist users for this product
      after(async () => {
        const wishlistItems = await prisma.wishlistItem.findMany({
          where: { productId: variant.productId, userId: { not: null } },
          include: { user: { select: { email: true, name: true } } },
        }).catch(() => [])
        for (const item of wishlistItems) {
          if (!item.user?.email) continue
          await sendWishlistRestockAlert({
            to: item.user.email,
            customerName: item.user.name || "there",
            productName: variant.product.name,
            productSlug: variant.product.slug,
            imageUrl,
            variantLabel,
          }).catch(() => {})
        }
      })
    }

    return NextResponse.json({ variant })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
