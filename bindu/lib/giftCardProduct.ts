import prisma from "@/lib/prisma"

/**
 * Returns (or seeds) the virtual gift card product variant for a given amount.
 * Custom amounts each get their own variant row; repeated amounts reuse the same row.
 */
export async function findOrCreateGiftCardVariant(
  amount: number
): Promise<{ productId: string; variantId: string }> {
  const sku = `GIFT-CARD-${Math.round(amount)}`

  const existing = await prisma.productVariant.findUnique({ where: { sku } })
  if (existing) return { productId: existing.productId, variantId: existing.id }

  // Find or create a hidden "Gift Cards" category
  let category = await prisma.category.findFirst({ where: { slug: "gift-cards" } })
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: "Gift Cards",
        slug: "gift-cards",
        description: "Digital gift cards",
        isActive: false,
        sortOrder: 999,
      },
    })
  }

  // Find or create the parent "Gift Card" product (hidden from storefront)
  let product = await prisma.product.findUnique({ where: { slug: "gift-card" } })
  if (!product) {
    product = await prisma.product.create({
      data: {
        name: "Gift Card",
        slug: "gift-card",
        description: "An Bindu Premium digital gift card.",
        price: 500,
        categoryId: category.id,
        isActive: false,
        isDigital: true,
      },
    })
  }

  const variant = await prisma.productVariant.create({
    data: {
      productId: product.id,
      sku,
      size: `৳${amount.toLocaleString()}`,
      color: "Digital",
      stock: 9999,
      price: amount,
    },
  })

  return { productId: product.id, variantId: variant.id }
}
