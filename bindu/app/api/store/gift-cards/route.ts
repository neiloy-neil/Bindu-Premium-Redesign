import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { findOrCreateGiftCardVariant } from "@/lib/giftCardProduct"

const MIN_AMOUNT = 100
const MAX_AMOUNT = 50000
const VALID_METHODS = ["BKASH", "NAGAD", "SSLCOMMERZ", "UDDOKTAPAY"] as const

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) code += "-"
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function POST(req: Request) {
  const { amount, recipientEmail, recipientName, senderName, senderEmail, message, paymentMethod } =
    await req.json()

  const numAmount = Math.round(Number(amount))
  if (!numAmount || numAmount < MIN_AMOUNT || numAmount > MAX_AMOUNT) {
    return NextResponse.json(
      { error: `Gift card amount must be between ৳${MIN_AMOUNT} and ৳${MAX_AMOUNT.toLocaleString()}.` },
      { status: 400 }
    )
  }
  if (!recipientEmail || !recipientEmail.includes("@")) {
    return NextResponse.json({ error: "A valid recipient email is required." }, { status: 400 })
  }
  if (!VALID_METHODS.includes(paymentMethod)) {
    return NextResponse.json({ error: "Invalid payment method." }, { status: 400 })
  }

  const { productId, variantId } = await findOrCreateGiftCardVariant(numAmount)

  // Generate gift card code (inactive until paid)
  let code = generateCode()
  if (await prisma.giftCard.findUnique({ where: { code } })) code = generateCode()

  const giftCard = await prisma.giftCard.create({
    data: {
      code,
      amount: numAmount,
      balance: numAmount,
      recipientEmail: recipientEmail.toLowerCase().trim(),
      senderName: senderName?.trim() || null,
      senderEmail: senderEmail?.toLowerCase().trim() || null,
      message: message?.trim() || null,
      isActive: false, // activated by activateGiftCardOrder after payment
    },
  })

  const order = await prisma.$transaction(async (tx) => {
    const orderCount = await tx.order.count()
    const suffix = Math.random().toString(36).slice(2, 5).toUpperCase()
    const orderNumber = `GC-${new Date().getFullYear()}-${String(orderCount + 1).padStart(4, "0")}-${suffix}`

    return tx.order.create({
      data: {
        orderNumber,
        paymentMethod,
        subtotal: numAmount,
        shippingCharge: 0,
        total: numAmount,
        isGuest: true,
        guestEmail: senderEmail?.toLowerCase().trim() || null,
        shippingName: senderName?.trim() || "Gift Card Purchaser",
        shippingPhone: "00000000000",
        shippingAddress: "Digital Delivery — no shipping required",
        shippingArea: "N/A",
        shippingDistrict: "Dhaka",
        shippingDivision: "Dhaka",
        customFields: {
          _giftCard: {
            giftCardId: giftCard.id,
            recipientEmail: giftCard.recipientEmail,
            recipientName: recipientName?.trim() || null,
            senderName: giftCard.senderName,
            message: giftCard.message,
          },
        },
        items: {
          create: [
            {
              productId,
              variantId,
              quantity: 1,
              price: numAmount,
              productName: `Gift Card — ৳${numAmount.toLocaleString()}`,
              size: `৳${numAmount.toLocaleString()}`,
              color: "Digital",
            },
          ],
        },
      },
    })
  })

  return NextResponse.json({ orderId: order.id })
}

// Balance check: GET /api/store/gift-cards?code=XXXX-XXXX-XXXX-XXXX
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code")?.toUpperCase().trim()
  if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 })

  const gc = await prisma.giftCard.findUnique({
    where: { code },
    select: { balance: true, isActive: true, expiresAt: true },
  }).catch(() => null)

  if (!gc) return NextResponse.json({ error: "Gift card not found" }, { status: 404 })

  const expired = gc.expiresAt != null && gc.expiresAt < new Date()
  return NextResponse.json({ balance: Number(gc.balance), valid: gc.isActive && !expired })
}
