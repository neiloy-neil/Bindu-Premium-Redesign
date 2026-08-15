import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/adminAuth"
import { getSteadfastConfig, createConsignment } from "@/lib/steadfast"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        orderNumber: true,
        shippingName: true,
        shippingPhone: true,
        shippingAddress: true,
        shippingArea: true,
        shippingDistrict: true,
        total: true,
        paymentStatus: true,
        note: true,
        delivery: true,
      },
    })
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })

    const config = await getSteadfastConfig()
    if (!config.apiKey || !config.secretKey) {
      return NextResponse.json({ error: "Steadfast credentials not configured. Add them in Admin → Settings." }, { status: 400 })
    }

    const address = [order.shippingAddress, order.shippingArea, order.shippingDistrict]
      .filter(Boolean)
      .join(", ")

    // COD orders pass the full amount; prepaid orders pass 0
    const cod_amount = order.paymentStatus === "PAID" ? 0 : Number(order.total)

    const consignment = await createConsignment(
      {
        invoice: order.orderNumber,
        recipient_name: order.shippingName,
        recipient_phone: order.shippingPhone,
        recipient_address: address,
        cod_amount,
        note: order.note || undefined,
      },
      config
    )

    const delivery = await prisma.delivery.upsert({
      where: { orderId: id },
      create: {
        orderId: id,
        courier: "STEADFAST",
        consignmentId: String(consignment.consignment_id),
        trackingCode: consignment.tracking_code,
        status: "PENDING",
      },
      update: {
        courier: "STEADFAST",
        consignmentId: String(consignment.consignment_id),
        trackingCode: consignment.tracking_code,
        status: "PENDING",
      },
    })

    await prisma.order.update({
      where: { id },
      data: { status: "SHIPPED" },
    })

    await prisma.orderStatusLog.create({
      data: {
        orderId: id,
        status: "SHIPPED",
        note: `Sent to Steadfast. Consignment: ${consignment.consignment_id}, Tracking: ${consignment.tracking_code}`,
      },
    })

    return NextResponse.json({ delivery, consignment })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
