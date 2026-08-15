import { NextResponse, after } from "next/server"
import prisma from "@/lib/prisma"
import { verifyPayment, getUddoktaPayConfig } from "@/lib/uddoktapay"
import { awardPoints } from "@/lib/loyalty"
import { processReferral } from "@/lib/referral"
import { activateGiftCardOrder } from "@/lib/activateGiftCardOrder"
import { APP_URL } from "@/lib/appUrl"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const invoice_id = searchParams.get("invoice_id")
  const orderId = searchParams.get("orderId")
  const appUrl = APP_URL

  if (!invoice_id || !orderId) {
    return NextResponse.redirect(`${appUrl}/order/unknown?payment=failed`)
  }

  try {
    const config = await getUddoktaPayConfig()
    const result = await verifyPayment(invoice_id, config)

    if (result.status !== "COMPLETED") {
      return NextResponse.redirect(`${appUrl}/order/${orderId}?payment=failed`)
    }

    await prisma.payment.update({
      where: { orderId },
      data: {
        status: "PAID",
        transactionId: result.transaction_id,
        paidAt: new Date(),
        gatewayResponse: result as any,
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
        note: `Payment successful via UddoktaPay. TrxID: ${result.transaction_id} (${result.payment_method})`,
      },
    })

    if (order.userId) {
      awardPoints(order.userId, orderId, Number(order.total)).catch(console.error)
      const referralCode = (order.customFields as any)?._referralCode as string | undefined
      if (referralCode) processReferral(order.userId, referralCode, orderId).catch(() => {})
    }

    after(() => activateGiftCardOrder(orderId).catch(console.error))

    return NextResponse.redirect(`${appUrl}/order/${orderId}?payment=success`)
  } catch (error: any) {
    console.error("UddoktaPay callback error", error)
    return NextResponse.redirect(`${appUrl}/order/${orderId}?payment=failed`)
  }
}
