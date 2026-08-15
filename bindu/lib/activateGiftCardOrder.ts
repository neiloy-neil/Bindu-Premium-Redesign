import prisma from "@/lib/prisma"
import { sendGiftCardEmail } from "@/lib/email"

/**
 * After a gift card order is confirmed as paid, activate the gift card and send the email.
 * Safe to call on every order — no-ops if the order has no gift card metadata.
 */
export async function activateGiftCardOrder(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { customFields: true },
  })

  const meta = (order?.customFields as any)?._giftCard
  if (!meta?.giftCardId) return

  const gc = await prisma.giftCard.update({
    where: { id: meta.giftCardId },
    data: { isActive: true },
  }).catch(() => null)

  if (!gc) return

  await sendGiftCardEmail({
    to: meta.recipientEmail,
    recipientName: meta.recipientName || (meta.recipientEmail as string).split("@")[0],
    senderName: meta.senderName || "A friend",
    code: gc.code,
    amount: Number(gc.amount),
    message: meta.message ?? null,
  }).catch(err => console.error("[gift-card] email failed:", err))
}
