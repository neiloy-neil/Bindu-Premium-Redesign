import { NextRequest, NextResponse, after } from "next/server"
import prisma from "@/lib/prisma"
import { awardPoints } from "@/lib/loyalty"
import { processReferral } from "@/lib/referral"
import { activateGiftCardOrder } from "@/lib/activateGiftCardOrder"

const SSL_VALIDATE = process.env.SSL_MODE === "live"
  ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
  : "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const val_id = form.get("val_id") as string
  const tran_id = form.get("tran_id") as string
  const orderId = form.get("value_a") as string
  const status = form.get("status") as string

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bindupremiumbd.com"

  if (status !== "VALID" && status !== "VALIDATED") {
    return NextResponse.redirect(`${siteUrl}/checkout?ssl=fail`, 303)
  }

  // Validate with SSLCommerz
  const validateRes = await fetch(
    `${SSL_VALIDATE}?val_id=${val_id}&store_id=${process.env.SSL_STORE_ID}&store_passwd=${process.env.SSL_STORE_PASSWORD}&format=json`
  )
  const validation = await validateRes.json()

  if (validation.status !== "VALID" && validation.status !== "VALIDATED") {
    return NextResponse.redirect(`${siteUrl}/checkout?ssl=fail`, 303)
  }

  // Mark order paid
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (order) {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "CONFIRMED",
        paymentStatus: "PAID",
        payment: {
          upsert: {
            where: { orderId },
            create: { method: "SSLCOMMERZ", status: "PAID", amount: order.total, transactionId: tran_id },
            update: { status: "PAID", transactionId: tran_id },
          },
        },
      },
    })

    if (order.userId) {
      awardPoints(order.userId, orderId, Number(order.total)).catch(() => {})
      const referralCode = (order.customFields as any)?._referralCode as string | undefined
      if (referralCode) {
        processReferral(order.userId, referralCode, orderId).catch(() => {})
      }
    }

    after(() => activateGiftCardOrder(orderId).catch(console.error))
  }

  return NextResponse.redirect(`${siteUrl}/order/${orderId}?ssl=success`, 303)
}
