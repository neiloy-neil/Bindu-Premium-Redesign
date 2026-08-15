import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  // Serverless: 1 connection per invocation prevents exhausting Supabase's pool.
  // For sustained load, switch DATABASE_URL to the transaction-mode pooler (port 6543).
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 1 })
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
