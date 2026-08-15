import { NextResponse, after } from "next/server"
import prisma from "@/lib/prisma"
import { getCustomerRisk } from "@/lib/customerRisk"
import { getBestAutoDiscount } from "@/lib/autoDiscount"
import { resolveShippingCharge } from "@/lib/shippingZone"
import { logAudit } from "@/lib/auditLog"
import { refreshCustomerSegments } from "@/lib/customerSegments"
import { cookies } from "next/headers"
import { sendOrderConfirmation, sendAdminNewOrder, sendWelcomeEmail } from "@/lib/email"
import { createAdminClient } from "@/lib/supabase"
import { mailchimpAddTags } from "@/lib/mailchimp"
import { klaviyoOrderPlaced } from "@/lib/klaviyo"
import { sendSms, smsTemplates } from "@/lib/sms"
import { runWorkflows } from "@/lib/workflowEngine"
import { auth } from "@/lib/auth"
import { getActiveFlashSaleBatch, applyFlashSaleDiscount } from "@/lib/flashSale"
import { rateLimit } from "@/lib/rateLimit"
import { sendCAPIEvent } from "@/lib/capi"
import { awardPointsForOrder } from "@/lib/loyalty"
import { processReferral } from "@/lib/referral"

export async function POST(req: Request) {
  const limited = await rateLimit(req, "checkout")
  if (limited) return limited
  try {
    const body = await req.json()
    const { items, address, paymentMethod, subtotal, shippingCharge, total, userId,
      note, giftWrap, giftMessage, giftWrapCharge, isGuest, guestEmail,
      loyaltyPointsRedeemed, loyaltyDiscount, storeCreditRedeemed, customFields,
      couponId, couponDiscount: clientCouponDiscount, deliveryDate,
      giftCardCode, giftCardDiscount: clientGiftCardDiscount,
      referralCode, createAccount, accountPassword } = body

    if (!items?.length || !address || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // #5 IDOR guard: if a userId is claimed, verify it matches the authenticated session
    const session = await auth()
    if (userId && session?.user?.id && userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    // If no session, treat as guest regardless of what the client sent
    let verifiedUserId: string | null = session?.user?.id || null

    // Guest account creation at checkout
    if (!verifiedUserId && createAccount && accountPassword && guestEmail) {
      try {
        const adminClient = createAdminClient()
        const { data: newUserData, error: createError } = await adminClient.auth.admin.createUser({
          email: guestEmail,
          password: accountPassword,
          email_confirm: true,
          user_metadata: { name: address?.name || "" },
          app_metadata: { role: "CUSTOMER" },
        })
        if (createError) {
          const msg = createError.message?.toLowerCase() || ""
          if (msg.includes("already") || msg.includes("exists") || createError.status === 422) {
            return NextResponse.json({ error: "An account with this email already exists. Please sign in first." }, { status: 409 })
          }
          // Other errors: proceed as guest rather than blocking the order
        } else if (newUserData?.user) {
          await prisma.user.create({
            data: { id: newUserData.user.id, name: address?.name || "", email: guestEmail, role: "CUSTOMER" },
          })
          verifiedUserId = newUserData.user.id
          sendWelcomeEmail({ to: guestEmail, name: address?.name || "" }).catch(() => {})
        }
      } catch {
        // Non-fatal: proceed as guest if account creation throws
      }
    }

    // Determine if a COD deposit is required: either store-wide policy, or
    // this phone number has a poor delivery track record on our own orders.
    let depositAmount = 0
    if (paymentMethod === "COD") {
      const [depositSetting, amountSetting, risk] = await Promise.all([
        prisma.setting.findUnique({ where: { key: "cod_deposit_enabled" } }),
        prisma.setting.findUnique({ where: { key: "cod_deposit_amount" } }),
        getCustomerRisk(address.phone),
      ])
      const globallyEnabled = depositSetting?.value === "true"
      const isHighRisk = risk.riskLevel === "HIGH"
      if (globallyEnabled || isHighRisk) {
        depositAmount = Math.min(Number(amountSetting?.value || 100), total)
      }
    }

    // Re-validate prices and stock from DB — never trust client-sent prices
    const variantIds = items.map((i: any) => i.variantId)
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: { select: { price: true, isActive: true, id: true, categoryId: true, releaseAt: true } } },
    })

    const variantMap = Object.fromEntries(variants.map((v) => [v.id, v]))

    const now = new Date()
    for (const item of items) {
      const variant = variantMap[item.variantId]
      if (!variant || !variant.product.isActive) {
        return NextResponse.json({ error: `Product "${item.name}" is no longer available` }, { status: 400 })
      }
      if (variant.product.releaseAt && new Date(variant.product.releaseAt) > now) {
        return NextResponse.json({ error: `"${item.name}" has not been released yet` }, { status: 400 })
      }
      if (variant.stock < item.quantity) {
        return NextResponse.json({
          error: `Only ${variant.stock} unit(s) of "${item.name}" (${item.size}) left in stock`,
        }, { status: 400 })
      }
    }

    // #1 Flash sale: resolve active sales for all products server-side
    const flashSaleMap = await getActiveFlashSaleBatch(
      variants.map(v => ({ id: v.product.id, categoryId: v.product.categoryId || "" }))
    ).catch(() => new Map())
    // Build variantId → effective price map (variant price overrides product base price)
    const effectivePriceMap = Object.fromEntries(
      variants.map(v => [
        v.id,
        applyFlashSaleDiscount(Number(v.price ?? v.product.price), flashSaleMap.get(v.product.id) ?? null),
      ])
    )

    // Compute server-side totals from DB prices (with flash sale applied)
    const serverSubtotal = items.reduce((sum: number, item: any) => {
      return sum + effectivePriceMap[item.variantId] * item.quantity
    }, 0)

    const [taxEnabledSetting, taxRateSetting] = await Promise.all([
      prisma.setting.findUnique({ where: { key: "tax_enabled" } }),
      prisma.setting.findUnique({ where: { key: "tax_rate" } }),
    ])

    const serverShippingCharge = await resolveShippingCharge(address.district, serverSubtotal)
    const taxEnabled = taxEnabledSetting?.value === "true"
    const taxRate = Number(taxRateSetting?.value || 0)
    const serverTaxAmount = taxEnabled ? Math.round((serverSubtotal * taxRate) / 100) : 0

    // Gift wrap — validate charge from DB setting
    const giftWrapSetting = giftWrap ? await prisma.setting.findUnique({ where: { key: "gift_wrap_charge" } }) : null
    const serverGiftWrapCharge = giftWrap ? Number(giftWrapSetting?.value || giftWrapCharge || 50) : 0

    // Validate coupon server-side
    let serverCouponDiscount = 0
    let couponGrantsFreeShipping = false
    let validatedCouponId: string | null = null
    if (couponId) {
      const coupon = await prisma.coupon.findUnique({
        where: { id: couponId },
        include: { rule: true },
      })
      const valid = coupon && coupon.isActive &&
        !(coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) &&
        !(coupon.maxUses && coupon.usedCount >= coupon.maxUses)

      // Per-user usage limit check
      let userLimitOk = true
      if (valid && verifiedUserId && coupon!.rule?.usagePerUser) {
        const userUses = await prisma.order.count({ where: { couponId: coupon!.id, userId: verifiedUserId } })
        if (userUses >= coupon!.rule.usagePerUser) userLimitOk = false
      }

      if (valid && userLimitOk) {
        const rule = coupon!.rule

        // MIN_ITEMS check
        if (rule?.ruleType === "MIN_ITEMS" && rule.minItems) {
          const totalQty = items.reduce((s: number, i: any) => s + (i.quantity || 1), 0)
          if (totalQty < rule.minItems) {
            return NextResponse.json({ error: `Coupon requires at least ${rule.minItems} items` }, { status: 400 })
          }
        }

        // CATEGORY_RESTRICT: compute eligible subtotal
        let eligibleSubtotal = serverSubtotal
        if (rule?.ruleType === "CATEGORY_RESTRICT" && rule.categoryId) {
          eligibleSubtotal = items.reduce((s: number, item: any) => {
            const v = variantMap[item.variantId]
            if (v?.product?.categoryId === rule.categoryId) return s + effectivePriceMap[item.variantId] * item.quantity
            return s
          }, 0)
          if (eligibleSubtotal === 0) {
            return NextResponse.json({ error: "Coupon only applies to specific categories not in your order" }, { status: 400 })
          }
        }

        if (rule?.ruleType === "FREE_SHIPPING") {
          couponGrantsFreeShipping = true
        } else if (rule?.ruleType === "BOGO") {
          const buyQty = rule.buyQty ?? 1
          const getQty = rule.getQty ?? 1
          const units: number[] = []
          for (const item of items) {
            for (let i = 0; i < (item.quantity || 1); i++) {
              units.push(Number(variantMap[item.variantId].product.price))
            }
          }
          units.sort((a: number, b: number) => a - b)
          const freeGroups = Math.floor(units.length / (buyQty + getQty))
          const freeCount = freeGroups * getQty
          serverCouponDiscount = units.slice(0, freeCount).reduce((s: number, p: number) => s + p, 0)
        } else if (coupon!.type === "PERCENTAGE") {
          const base = rule?.ruleType === "CATEGORY_RESTRICT" ? eligibleSubtotal : serverSubtotal
          serverCouponDiscount = Math.round((base * Number(coupon!.value)) / 100)
          if (rule?.maxDiscount) serverCouponDiscount = Math.min(serverCouponDiscount, Number(rule.maxDiscount))
        } else if (coupon!.type === "FLAT") {
          const base = rule?.ruleType === "CATEGORY_RESTRICT" ? eligibleSubtotal : serverSubtotal
          serverCouponDiscount = Math.min(Number(coupon!.value), base)
        }
        validatedCouponId = coupon!.id
      }
    }

    // FREE_SHIPPING coupon zeroes the shipping charge
    const effectiveShippingCharge = couponGrantsFreeShipping ? 0 : serverShippingCharge

    // Auto discount (bulk/tiered) — server-side validation, never trust client
    const cartItems = items.map((item: any) => ({
      variantId: item.variantId,
      productId: item.productId,
      quantity: item.quantity,
      price: effectivePriceMap[item.variantId],
    }))
    const autoDiscount = await getBestAutoDiscount(cartItems, serverSubtotal).catch(() => null)
    let autoDiscountAmount = autoDiscount?.savingAmount || 0
    // Non-stackable coupon zeroes out auto/bulk discounts
    if (validatedCouponId && serverCouponDiscount > 0) {
      const appliedCoupon = await prisma.coupon.findUnique({ where: { id: validatedCouponId }, include: { rule: true } })
      if (appliedCoupon?.rule && !appliedCoupon.rule.isStackable) {
        autoDiscountAmount = 0
      }
    }

    // Validate loyalty points redemption (use verifiedUserId — #5 IDOR fix)
    let serverLoyaltyDiscount = 0
    if (verifiedUserId && loyaltyPointsRedeemed > 0) {
      const loyaltyAgg = await prisma.loyaltyPoint.aggregate({ where: { userId: verifiedUserId }, _sum: { points: true } })
      const balance = Math.max(0, loyaltyAgg._sum.points ?? 0) // #18 floor at 0
      const redemptionRate = Number((await prisma.setting.findUnique({ where: { key: "points_redemption_rate" } }))?.value || 100)
      const maxDiscount = Math.floor(balance / redemptionRate)
      serverLoyaltyDiscount = Math.min(loyaltyDiscount || 0, maxDiscount)
    }

    // Validate store credit redemption (use verifiedUserId — #5 IDOR fix)
    let serverCreditDiscount = 0
    if (verifiedUserId && storeCreditRedeemed > 0) {
      const credit = await prisma.storeCredit.findUnique({ where: { userId: verifiedUserId } })
      serverCreditDiscount = Math.min(storeCreditRedeemed, Math.max(0, Number(credit?.balance ?? 0)))
    }

    // Validate gift card
    let serverGiftCardDiscount = 0
    let validatedGiftCard: any = null
    if (giftCardCode) {
      validatedGiftCard = await prisma.giftCard.findUnique({ where: { code: giftCardCode } })
      if (validatedGiftCard && validatedGiftCard.isActive && Number(validatedGiftCard.balance) > 0 &&
          (!validatedGiftCard.expiresAt || new Date(validatedGiftCard.expiresAt) > new Date())) {
        // Cap to card balance and to the pre-gift-card total (can't redeem more than the order costs)
        const preTotalBeforeGiftCard = Math.max(0, serverSubtotal + (couponGrantsFreeShipping ? 0 : serverShippingCharge) + serverTaxAmount + serverGiftWrapCharge - autoDiscountAmount - serverLoyaltyDiscount - serverCreditDiscount - serverCouponDiscount)
        serverGiftCardDiscount = Math.min(Number(validatedGiftCard.balance), preTotalBeforeGiftCard)
      }
    }

    const serverTotal = Math.max(0, serverSubtotal + effectiveShippingCharge + serverTaxAmount + serverGiftWrapCharge - autoDiscountAmount - serverLoyaltyDiscount - serverCreditDiscount - serverCouponDiscount - serverGiftCardDiscount)

    const order = await prisma.$transaction(async (tx) => {
      // Re-check stock inside transaction to prevent race conditions
      for (const item of items) {
        const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } })
        if (!variant || variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for item: ${item.name} (${item.size})`)
        }
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      const orderCount = await tx.order.count()
      // Append a short random suffix to prevent duplicate order numbers under concurrent load
      const suffix = Math.random().toString(36).slice(2, 5).toUpperCase()
      const orderNumber = `ORD-${new Date().getFullYear()}-${String(orderCount + 1).padStart(4, "0")}-${suffix}`

      // Atomically increment coupon usedCount inside the transaction.
      // updateMany with the maxUses guard ensures concurrent orders can't both pass.
      if (validatedCouponId) {
        const couponForUpdate = await tx.coupon.findUnique({ where: { id: validatedCouponId }, select: { maxUses: true } })
        const affected = await tx.coupon.updateMany({
          where: {
            id: validatedCouponId,
            ...(couponForUpdate?.maxUses != null ? { usedCount: { lt: couponForUpdate.maxUses } } : {}),
          },
          data: { usedCount: { increment: 1 } },
        })
        if (affected.count === 0 && couponForUpdate?.maxUses != null) {
          throw new Error("Coupon usage limit reached — please try without the coupon")
        }
      }

      // #3 Deduct loyalty points inside transaction to prevent double-spend
      if (verifiedUserId && serverLoyaltyDiscount > 0) {
        const redemptionRate = Number((await prisma.setting.findUnique({ where: { key: "points_redemption_rate" } }))?.value || 100)
        const pointsUsed = serverLoyaltyDiscount * redemptionRate
        // Re-verify balance inside transaction (atomic check)
        const loyaltyAgg = await tx.loyaltyPoint.aggregate({ where: { userId: verifiedUserId }, _sum: { points: true } })
        const currentBalance = Math.max(0, loyaltyAgg._sum.points ?? 0)
        if (currentBalance < loyaltyPointsRedeemed) {
          throw new Error("Insufficient loyalty points")
        }
        await tx.loyaltyPoint.create({
          data: { userId: verifiedUserId, points: -pointsUsed, type: "REDEEMED", description: `Redeemed at checkout`, orderId: undefined },
        })
      }

      // #3 Deduct store credit inside transaction to prevent double-spend
      if (verifiedUserId && serverCreditDiscount > 0) {
        const credit = await tx.storeCredit.findUnique({ where: { userId: verifiedUserId } })
        if (!credit || Number(credit.balance) < serverCreditDiscount) {
          throw new Error("Insufficient store credit")
        }
        await tx.storeCredit.update({ where: { userId: verifiedUserId }, data: { balance: { decrement: serverCreditDiscount } } })
        await tx.storeCreditTransaction.create({
          data: { userId: verifiedUserId, storeCreditId: credit.id, amount: serverCreditDiscount, type: "DEBIT", reason: `Applied at checkout` },
        })
      }

      // #4 Deduct gift card inside transaction to prevent double-spend
      if (validatedGiftCard && serverGiftCardDiscount > 0) {
        const card = await tx.giftCard.findUnique({ where: { id: validatedGiftCard.id } })
        if (!card || Number(card.balance) < serverGiftCardDiscount) {
          throw new Error("Insufficient gift card balance")
        }
        await tx.giftCard.update({ where: { id: card.id }, data: { balance: { decrement: serverGiftCardDiscount } } })
        await tx.giftCardTransaction.create({
          data: { giftCardId: card.id, amount: serverGiftCardDiscount, type: "REDEEM" },
        })
      }

      return tx.order.create({
        data: {
          orderNumber,
          userId: verifiedUserId,
          isGuest: !verifiedUserId,
          guestEmail: !verifiedUserId ? (guestEmail || null) : null,
          status: "PENDING",
          paymentStatus: "UNPAID",
          paymentMethod,
          depositAmount,
          total: serverTotal,
          subtotal: serverSubtotal,
          shippingCharge: effectiveShippingCharge,
          discount: Math.max(0, autoDiscountAmount + serverCouponDiscount),
          couponId: validatedCouponId || null,
          deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
          note: note || null,
          giftWrap: giftWrap || false,
          giftMessage: giftWrap ? (giftMessage || null) : null,
          giftWrapCharge: serverGiftWrapCharge,
          customFields: referralCode?.trim()
            ? { ...(customFields || {}), _referralCode: referralCode.trim().toUpperCase() }
            : (customFields || undefined),
          shippingName: address.name,
          shippingPhone: address.phone,
          shippingAddress: address.fullAddress,
          shippingArea: address.area,
          shippingDistrict: address.district,
          shippingDivision: address.division,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              productName: item.name,
              variantId: item.variantId,
              quantity: item.quantity,
              price: effectivePriceMap[item.variantId],
              size: item.size || "Default",
              color: item.color || "Default",
            })),
          },
        },
      })
    })

    await logAudit({ action: "order.created", entityType: "Order", entityId: order.id, after: { orderNumber: order.orderNumber, total: serverTotal, paymentMethod } })

    // Award loyalty points for this order (fire-and-forget, only for logged-in users)
    if (verifiedUserId && serverSubtotal > 0) {
      awardPointsForOrder(verifiedUserId, order.id, serverSubtotal).catch(() => {})
    }

    // Process referral reward for COD orders server-side (gateway payments handle this in their callbacks)
    if (verifiedUserId && referralCode?.trim() && paymentMethod === "COD") {
      processReferral(verifiedUserId, referralCode.trim(), order.id).catch(() => {})
    }

    // Refresh customer segments after new order (fire-and-forget)
    if (verifiedUserId) {
      refreshCustomerSegments(verifiedUserId).catch(() => {})
    }

    // Record affiliate conversion if referral cookie present
    const cookieStore = await cookies()
    const refCode = cookieStore.get("drip_ref")?.value
    if (refCode) {
      try {
        const affiliate = await prisma.affiliate.findUnique({ where: { code: refCode, isActive: true } })
        if (affiliate) {
          const commission = affiliate.commissionType === "PERCENTAGE"
            ? Math.round((serverTotal * Number(affiliate.commissionValue)) / 100)
            : Number(affiliate.commissionValue)
          await prisma.$transaction([
            prisma.affiliateConversion.create({
              data: { affiliateId: affiliate.id, orderId: order.id, orderTotal: serverTotal, commission },
            }),
            prisma.affiliate.update({
              where: { id: affiliate.id },
              data: { totalEarned: { increment: commission } },
            }),
          ])
        }
      } catch {
        // non-critical
      }
    }

    // Send order confirmation email (fire-and-forget)
    // Prefer the email typed at checkout; fall back to the account email from DB
    const dbEmail = verifiedUserId ? (await prisma.user.findUnique({ where: { id: verifiedUserId }, select: { email: true } }))?.email : null
    const toEmail = guestEmail || dbEmail

    // Meta CAPI — Purchase (server-side, fire-and-forget)
    // event_id matches what the browser Pixel sends so Meta deduplicates the two signals
    // cookieStore already populated above (affiliate block)
    void sendCAPIEvent({
      event_name: "Purchase",
      event_time: Math.floor(Date.now() / 1000),
      event_id: order.id,
      event_source_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.bindupremiumbd.com"}/checkout`,
      user_data: {
        email: toEmail || undefined,
        phone: address.phone || undefined,
        external_id: verifiedUserId || undefined,
        city: address.district || address.area || undefined,
        state: address.division || undefined,
        country: "bd",
        client_ip_address: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
        client_user_agent: req.headers.get("user-agent") || "",
        fbp: cookieStore.get("_fbp")?.value,
        fbc: cookieStore.get("_fbc")?.value,
      },
      custom_data: {
        currency: "BDT",
        value: serverTotal,
        content_type: "product",
        content_ids: items.map((i: any) => variantMap[i.variantId]?.sku || i.variantId),
        contents: items.map((i: any) => ({
          id: variantMap[i.variantId]?.sku || i.variantId,
          quantity: i.quantity,
          item_price: effectivePriceMap[i.variantId],
        })),
        num_items: items.reduce((s: number, i: any) => s + i.quantity, 0),
        order_id: order.orderNumber,
      },
    }).catch(() => {})
    after(async () => {
      if (toEmail) {
        await sendOrderConfirmation({
          to: toEmail,
          orderId: order.id,
          orderNumber: order.orderNumber,
          customerName: address.name,
          items: items.map((item: any) => ({
            productName: item.name,
            size: item.size || "Default",
            color: item.color || "Default",
            quantity: item.quantity,
            price: effectivePriceMap[item.variantId],
          })),
          subtotal: serverSubtotal,
          shippingCharge: effectiveShippingCharge,
          discount: autoDiscountAmount + serverCouponDiscount + serverLoyaltyDiscount + serverCreditDiscount + serverGiftCardDiscount,
          giftWrapCharge: serverGiftWrapCharge,
          total: serverTotal,
          paymentMethod,
          shippingName: address.name,
          shippingPhone: address.phone,
          shippingAddress: address.fullAddress,
          shippingArea: address.area,
          shippingDistrict: address.district,
          shippingDivision: address.division,
          note: note || null,
          giftWrap: giftWrap || false,
          giftMessage: giftMessage || null,
        }).catch(() => {})
      }

      await sendAdminNewOrder({
        orderNumber: order.orderNumber,
        customerName: address.name,
        customerEmail: isGuest ? (guestEmail || "") : (toEmail || ""),
        customerPhone: address.phone,
        items: items.map((item: any) => ({
          productName: item.name,
          size: item.size || "Default",
          color: item.color || "Default",
          quantity: item.quantity,
          price: Number(variantMap[item.variantId].product.price),
        })),
        subtotal: serverSubtotal,
        shippingCharge: serverShippingCharge,
        discount: autoDiscountAmount + serverCouponDiscount,
        total: serverTotal,
        paymentMethod,
        shippingAddress: address.fullAddress,
        shippingArea: address.area,
        shippingDistrict: address.district,
        shippingDivision: address.division,
      }).catch(() => {})
    })

    // Wire Klaviyo + Mailchimp (fire-and-forget)
    if (toEmail) {
      klaviyoOrderPlaced(toEmail, {
        orderNumber: order.orderNumber,
        total: serverTotal,
        items: items.map((item: any) => ({
          productName: item.name,
          quantity: item.quantity,
          price: Number(variantMap[item.variantId].product.price),
        })),
      }).catch(() => {})
      if (!isGuest) {
        mailchimpAddTags(toEmail, ["has_ordered"]).catch(() => {})
      }
    }

    // SMS order confirmed (fire-and-forget)
    if (address.phone) {
      sendSms(address.phone, smsTemplates.orderConfirmed(order.orderNumber, serverTotal), "order_confirmed").catch(() => {})
    }

    // Funnel: checkout_complete (fire-and-forget)
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/store/funnel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "checkout_complete", orderId: order.id, value: serverTotal, sessionId: "server" }),
    }).catch(() => {})

    // Workflow engine: ORDER_PLACED trigger (fire-and-forget)
    runWorkflows("ORDER_PLACED", {
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: serverTotal,
      paymentMethod,
      userId: userId || null,
    }).catch(() => {})

    // Mark abandoned cart as recovered (fire-and-forget)
    const recoveryEmail = toEmail || guestEmail
    if (recoveryEmail) {
      prisma.abandonedCart.updateMany({
        where: { email: recoveryEmail, isRecovered: false },
        data: { isRecovered: true, recoveredAt: new Date(), orderId: order.id },
      }).catch(() => {})
    }

    const accountCreated = !!(createAccount && verifiedUserId && !session?.user?.id)
    return NextResponse.json({ orderId: order.id, depositAmount, accountCreated })
  } catch (error: any) {
    console.error("Checkout error", error)
    const isStockError = error.message?.includes("stock") || error.message?.includes("available")
    return NextResponse.json({ error: error.message }, { status: isStockError ? 400 : 500 })
  }
}
