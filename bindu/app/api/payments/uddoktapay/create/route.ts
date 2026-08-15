import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createCharge, getUddoktaPayConfig } from "@/lib/uddoktapay"
import { APP_URL } from "@/lib/appUrl"

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json()
    if (!orderId) return NextResponse.json({ error: "orderId is required" }, { status: 400 })

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: { select: { email: true } } },
    })
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
    if (order.paymentStatus !== "UNPAID") {
      return NextResponse.json({ error: "Order is already paid or processing" }, { status: 400 })
    }

    const appUrl = APP_URL
    const amount = Number(order.total)
    const email = order.guestEmail || order.user?.email || "noreply@bindupremium.com"
    const config = await getUddoktaPayConfig()

    const charge = await createCharge(
      {
        full_name: order.shippingName,
        email,
        amount,
        metadata: { orderId },
        redirect_url: `${appUrl}/api/payments/uddoktapay/callback?orderId=${orderId}`,
        cancel_url: `${appUrl}/order/${orderId}?payment=cancelled`,
        webhook_url: `${appUrl}/api/payments/uddoktapay/webhook`,
      },
      config
    )

    await prisma.payment.upsert({
      where: { orderId },
      create: { orderId, method: "UDDOKTAPAY", status: "UNPAID", amount },
      update: { amount, status: "UNPAID" },
    })

    return NextResponse.json({ payment_url: charge.payment_url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
