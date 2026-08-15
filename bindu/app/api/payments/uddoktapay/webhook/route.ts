import { NextResponse, after } from "next/server"
import prisma from "@/lib/prisma"
import { getUddoktaPayConfig } from "@/lib/uddoktapay"
import { activateGiftCardOrder } from "@/lib/activateGiftCardOrder"
import { awardPoints } from "@/lib/loyalty"
import { processReferral } from "@/lib/referral"

export async function POST(req: Request) {
  try {
    const config = await getUddoktaPayConfig()
    const apiKey = req.headers.get("RT-UDDOKTAPAY-API-KEY")
    if (!apiKey || apiKey !== config.apiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { status, transaction_id, invoice_id, metadata, payment_method } = body

    if (status !== "COMPLETED") {
      return NextResponse.json({ received: true })
    }

    const orderId: string | undefined = metadata?.orderId
    if (!orderId) return NextResponse.json({ error: "No orderId in metadata" }, { status: 400 })

    // Idempotency — skip if already paid
    const existing = await prisma.payment.findUnique({ where: { orderId }, select: { status: true } })
    if (existing?.status === "PAID") return NextResponse.json({ received: true })

    await prisma.payment.update({
      where: { orderId },
      data: {
        status: "PAID",
        transactionId: transaction_id,
        paidAt: new Date(),
        gatewayResponse: body,
      },
    })

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "PAID", status: "CONFIRMED" },
      select: { userId: true, total: true, customFields: true },
    })

    await prisma.orderStatusLog.create({
      data: {
        orderId,
        status: "CONFIRMED",
        note: `IPN: Payment confirmed via UddoktaPay. TrxID: ${transaction_id} (${payment_method})`,
      },
    })

    if (order.userId) {
      awardPoints(order.userId, orderId, Number(order.total)).catch(console.error)
      const referralCode = (order.customFields as any)?._referralCode as string | undefined
      if (referralCode) processReferral(order.userId, referralCode, orderId).catch(() => {})
    }

    after(() => activateGiftCardOrder(orderId).catch(console.error))

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("UddoktaPay webhook error", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
