import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/adminAuth"
import { getSteadfastConfig, checkStatusByConsignmentId, mapSteadfastStatus } from "@/lib/steadfast"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const { orderId } = await params
    const delivery = await prisma.delivery.findUnique({ where: { orderId } })

    if (!delivery) return NextResponse.json({ error: "Delivery not found" }, { status: 404 })

    if (delivery.courier === "STEADFAST" && delivery.consignmentId) {
      const config = await getSteadfastConfig()
      const sfStatus = await checkStatusByConsignmentId(delivery.consignmentId, config)
      const newStatus = mapSteadfastStatus(sfStatus)

      const updated = await prisma.delivery.update({
        where: { id: delivery.id },
        data: { status: newStatus },
      })

      // Sync order status on final states
      if (newStatus === "DELIVERED") {
        await prisma.order.update({ where: { id: orderId }, data: { status: "DELIVERED" } })
      } else if (newStatus === "RETURNED") {
        await prisma.order.update({ where: { id: orderId }, data: { status: "CANCELLED" } })
      }

      return NextResponse.json({ delivery: updated, steadfastStatus: sfStatus })
    }

    return NextResponse.json({ delivery, note: "Non-Steadfast courier — no auto-refresh available" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
