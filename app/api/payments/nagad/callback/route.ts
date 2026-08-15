import { NextResponse, after } from "next/server"
import prisma from "@/lib/prisma"
import { verifyPayment } from "@/lib/nagad"
import { awardPoints } from "@/lib/loyalty"
import { processReferral } from "@/lib/referral"
import { activateGiftCardOrder } from "@/lib/activateGiftCardOrder"
import { APP_URL } from "@/lib/appUrl"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentRefId = searchParams.get("payment_ref_id")
    const status = searchParams.get("status")
    const orderId = searchParams.get("orderId") // Note: we passed orderId in callbackURL

    const appUrl = APP_URL

    if (!paymentRefId || !orderId) {
      return NextResponse.redirect(`${appUrl}/order/unknown?payment=failed`)
    }

    if (status !== "Success") {
      return NextResponse.redirect(`${appUrl}/order/${orderId}?payment=failed`)
    }

    // Verify the payment
    const nagadData = await verifyPayment(paymentRefId)

    if (nagadData.status !== "Success") {
      return NextResponse.redirect(`${appUrl}/order/${orderId}?payment=failed`)
    }

    // Success! Update DB.
    const trxID = nagadData.issuerPaymentRefNo || paymentRefId
    
    await prisma.payment.update({
      where: { orderId: orderId },
      data: {
        status: "PAID",
        transactionId: trxID,
        paidAt: new Date(),
        gatewayResponse: nagadData,
      }
    })

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
      },
      select: { userId: true, total: true, customFields: true },
    })

    await prisma.orderStatusLog.create({
      data: {
        orderId: orderId,
        status: "CONFIRMED",
        note: `Payment successful via Nagad. TrxID: ${trxID}`,
      }
    })

    if (order.userId) {
      try {
        await awardPoints(order.userId, orderId, Number(order.total))
      } catch (err) {
        console.error("Failed to award loyalty points:", err)
      }
      const referralCode = (order.customFields as any)?._referralCode as string | undefined
      if (referralCode) {
        processReferral(order.userId, referralCode, orderId).catch(() => {})
      }
    }

    after(() => activateGiftCardOrder(orderId).catch(console.error))

    return NextResponse.redirect(`${appUrl}/order/${orderId}?payment=success`)
  } catch (error: any) {
    console.error("Nagad callback error", error)
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get("orderId") || "unknown"
    const appUrl = APP_URL
    return NextResponse.redirect(`${appUrl}/order/${orderId}?payment=failed`)
  }
}
