"use server"

import prisma from "@/lib/prisma"

export async function validateCartStock(items: { variantId: string, quantity: number, name: string, size: string }[]) {
  const variantIds = items.map(i => i.variantId)
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    select: { id: true, stock: true }
  })
  
  const variantMap = Object.fromEntries(variants.map(v => [v.id, v.stock]))
  
  const issues = []
  for (const item of items) {
    const stock = variantMap[item.variantId]
    if (stock === undefined) {
      issues.push(`"${item.name}" is no longer available.`)
    } else if (stock < item.quantity) {
      if (stock === 0) issues.push(`"${item.name}" (${item.size}) is out of stock.`)
      else issues.push(`Only ${stock} unit(s) of "${item.name}" (${item.size}) left.`)
    }
  }
  
  return issues
}
