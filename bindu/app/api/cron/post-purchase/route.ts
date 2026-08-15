import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { sendStyleFollowUp, sendReviewRequest } from "@/lib/email"

// Vercel Cron: runs daily at 10:00 UTC
// Wave 1: review request ~2 days after DELIVERED
// Wave 2: style follow-up ~4 days after DELIVERED

export async function GET(req: Request) {
  const secret = req.headers.get("x-cron-secret") || new URL(req.url).searchParams.get("secret")
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()
  const twoDaysAgo  = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
  const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const orderInclude = {
    user: { select: { email: true, name: true } },
    items: {
      include: {
        product: { include: { images: { orderBy: { sortOrder: "asc" as const }, take: 1 } } },
        variant: { select: { size: true, color: true } },
      },
    },
  }

  // ── Wave 1: Review request (2–3 days post-delivery) ──────────────────
  const reviewLogs = await prisma.orderStatusLog.findMany({
    where: {
      status: "DELIVERED",
      createdAt: { gte: threeDaysAgo, lte: twoDaysAgo },
      order: {
        status: "DELIVERED",
        statusLogs: { none: { note: "REVIEW_REQUEST_SENT" } },
      },
    },
    include: { order: { include: orderInclude } },
    distinct: ["orderId"],
  })

  // ── Wave 2: Style follow-up (4–7 days post-delivery) ─────────────────
  const styleLogs = await prisma.orderStatusLog.findMany({
    where: {
      status: "DELIVERED",
      createdAt: { gte: sevenDaysAgo, lte: fourDaysAgo },
      order: {
        status: "DELIVERED",
        statusLogs: { none: { note: "STYLE_FOLLOWUP_SENT" } },
      },
    },
    include: { order: { include: orderInclude } },
    distinct: ["orderId"],
  })

  let reviewSent = 0, styleSent = 0, failed = 0

  // Send review requests
  for (const log of reviewLogs) {
    const order = log.order
    const toEmail = order.user?.email || order.guestEmail
    if (!toEmail) continue
    const customerName = order.user?.name || order.shippingName || "Customer"
    const items = order.items.map((item) => ({
      productName: item.product.name,
      productSlug: item.product.slug,
      imageUrl: item.product.images[0]?.url ?? null,
    }))
    try {
      await sendReviewRequest({ to: toEmail, customerName, orderNumber: order.orderNumber, items })
      await prisma.orderStatusLog.create({
        data: { orderId: order.id, status: "DELIVERED", note: "REVIEW_REQUEST_SENT" },
      })
      reviewSent++
    } catch (err) {
      console.error(`[post-purchase cron] review request failed for ${order.orderNumber}:`, err)
      failed++
    }
  }

  // Send style follow-ups
  for (const log of styleLogs) {
    const order = log.order
    const toEmail = order.user?.email || order.guestEmail
    if (!toEmail) continue
    const customerName = order.user?.name || order.shippingName || "Customer"
    const items = order.items.map((item) => ({
      productName: item.product.name,
      size: item.variant.size,
      color: item.variant.color,
      productSlug: item.product.slug,
      imageUrl: item.product.images[0]?.url ?? null,
    }))
    try {
      await sendStyleFollowUp({ to: toEmail, customerName, orderNumber: order.orderNumber, orderId: order.id, items })
      await prisma.orderStatusLog.create({
        data: { orderId: order.id, status: "DELIVERED", note: "STYLE_FOLLOWUP_SENT" },
      })
      styleSent++
    } catch (err) {
      console.error(`[post-purchase cron] style follow-up failed for ${order.orderNumber}:`, err)
      failed++
    }
  }

  return NextResponse.json({
    reviewSent,
    styleSent,
    failed,
    checked: reviewLogs.length + styleLogs.length,
  })
}
