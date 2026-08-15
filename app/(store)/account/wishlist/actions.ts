"use server"

import prisma from "@/lib/prisma"

export async function getWishlistProducts(productIds: string[]) {
  if (!productIds.length) return []
  
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      comparePrice: true,
      category: { select: { name: true } },
      images: { take: 1, orderBy: { sortOrder: 'asc' }, select: { url: true } },
      variants: { select: { stock: true, size: true } }
    }
  })
  
  return products.map(p => ({
    ...p,
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
  }))
}
