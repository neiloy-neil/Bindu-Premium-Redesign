import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [pendingOrders, lowStock, pendingReturns] = await Promise.all([
    prisma.order.count({ where: { status: { in: ["PENDING", "CONFIRMED"] } } }),
    prisma.productVariant.count({ where: { stock: { lte: 5, gt: 0 } } }),
    prisma.returnRequest.count({ where: { status: "PENDING" } }),
  ])

  return NextResponse.json({ pendingOrders, lowStock, pendingReturns })
}
