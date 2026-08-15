import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const rows = await prisma.product.findMany({
  where: { releaseAt: { not: null } },
  select: { slug: true, releaseAt: true, isActive: true, name: true }
})
console.log(JSON.stringify(rows, null, 2))
await prisma.$disconnect()
