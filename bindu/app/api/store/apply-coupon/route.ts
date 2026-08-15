import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { rateLimit } from "@/lib/rateLimit"

export async function POST(req: Request) {
  const limited = await rateLimit(req, "apply-coupon")
  if (limited) return limited
  try {
    const { code, items } = await req.json()
    if (!code) return NextResponse.json({ error: "Coupon code required" }, { status: 400 })

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
      include: { rule: true },
    })

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "Invalid or inactive coupon" }, { status: 400 })
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 })
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 })
    }

    // Per-user usage limit
    const session = await auth()
    if (session?.user?.id && coupon.rule?.usagePerUser) {
      const userUses = await prisma.order.count({
        where: { couponId: coupon.id, userId: session.user.id },
      })
      if (userUses >= coupon.rule.usagePerUser) {
        return NextResponse.json({ error: "You have already used this coupon" }, { status: 400 })
      }
    }

    const subtotal = (items || []).reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
      return NextResponse.json(
        { error: `Minimum order ৳${coupon.minOrderAmount} required for this coupon` },
        { status: 400 }
      )
    }

    const rule = coupon.rule

    // MIN_ITEMS enforcement
    if (rule?.ruleType === "MIN_ITEMS" && rule.minItems) {
      const totalQty = (items || []).reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
      if (totalQty < rule.minItems) {
        return NextResponse.json(
          { error: `This coupon requires at least ${rule.minItems} items in your cart` },
          { status: 400 }
        )
      }
    }

    // CATEGORY_RESTRICT: resolve eligible item subtotal from DB
    let eligibleSubtotal = subtotal
    if (rule?.ruleType === "CATEGORY_RESTRICT" && rule.categoryId) {
      const variantIds = (items || []).map((i: any) => i.variantId).filter(Boolean)
      const variants = variantIds.length > 0
        ? await prisma.productVariant.findMany({
            where: { id: { in: variantIds } },
            select: { id: true, product: { select: { categoryId: true } } },
          })
        : []
      const catMap = Object.fromEntries(variants.map((v) => [v.id, v.product.categoryId]))
      eligibleSubtotal = (items || []).reduce((sum: number, item: any) => {
        if (catMap[item.variantId] === rule.categoryId) return sum + item.price * item.quantity
        return sum
      }, 0)
      if (eligibleSubtotal === 0) {
        return NextResponse.json({ error: "This coupon only applies to specific categories not in your cart" }, { status: 400 })
      }
    }

    let discount = 0
    let message = ""
    let freeShipping = false

    if (rule?.ruleType === "BOGO") {
      const buyQty = rule.buyQty ?? 1
      const getQty = rule.getQty ?? 1
      const units: number[] = []
      for (const item of (items || [])) {
        for (let i = 0; i < (item.quantity || 1); i++) {
          units.push(Number(item.price))
        }
      }
      units.sort((a, b) => a - b)
      const freeGroups = Math.floor(units.length / (buyQty + getQty))
      const freeCount = freeGroups * getQty
      discount = units.slice(0, freeCount).reduce((s, p) => s + p, 0)
      message = freeCount > 0
        ? `BOGO: ${freeCount} item${freeCount > 1 ? "s" : ""} free — saving ৳${discount}`
        : `Add ${buyQty + getQty} items to activate BOGO`
    } else if (rule?.ruleType === "FREE_SHIPPING") {
      freeShipping = true
      message = "Free shipping applied"
    } else if (coupon.type === "PERCENTAGE") {
      discount = Math.round((eligibleSubtotal * Number(coupon.value)) / 100)
      if (rule?.maxDiscount) discount = Math.min(discount, Number(rule.maxDiscount))
      message = `${coupon.value}% off applied`
    } else if (coupon.type === "FLAT") {
      discount = Math.min(Number(coupon.value), eligibleSubtotal)
      message = `৳${coupon.value} discount applied`
    }

    return NextResponse.json({ discount, couponId: coupon.id, couponCode: coupon.code, message, freeShipping })
  } catch {
    return NextResponse.json({ error: "Failed to apply coupon" }, { status: 500 })
  }
}
