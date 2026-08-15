import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSteadfastConfig, mapSteadfastStatus } from "@/lib/steadfast"

export async function POST(req: Request) {
  try {
    const config = await getSteadfastConfig()

    // Validate bearer token if configured
    if (config.webhookToken) {
      const auth = req.headers.get("Authorization") || ""
      const token = auth.replace(/^Bearer\s+/i, "")
      if (token !== config.webhookToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const body = await req.json()
    const { notification_type, consignment_id, invoice, status } = body

    if (!notification_type || !consignment_id) {
      return NextResponse.json({ status: "error", message: "Missing required fields" }, { status: 400 })
    }

    if (notification_type === "delivery_status" && status) {
      // Find delivery by consignmentId or order by orderNumber (invoice)
      const delivery = await prisma.delivery.findFirst({
        where: {
          OR: [
            { consignmentId: String(consignment_id) },
            { order: { orderNumber: invoice } },
          ],
        },
        select: { id: true, orderId: true, status: true },
      })

      if (delivery) {
        const newStatus = mapSteadfastStatus(status.toLowerCase())

        if (newStatus !== delivery.status) {
          await prisma.delivery.update({
            where: { id: delivery.id },
            data: { status: newStatus },
          })

          let orderStatus: string | null = null
          if (newStatus === "DELIVERED") orderStatus = "DELIVERED"
          else if (newStatus === "RETURNED") orderStatus = "CANCELLED"

          if (orderStatus) {
            await prisma.order.update({
              where: { id: delivery.orderId },
              data: { status: orderStatus as any },
            })
            await prisma.orderStatusLog.create({
              data: {
                orderId: delivery.orderId,
                status: orderStatus as any,
                note: `Steadfast webhook: ${status} (consignment ${consignment_id})`,
              },
            })
          }
        }
      }
    }

    return NextResponse.json({ status: "success", message: "Webhook received successfully." })
  } catch (error: any) {
    console.error("Steadfast webhook error", error)
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 })
  }
}
