import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ affiliate: null })

  const affiliate = await prisma.affiliate.findFirst({
    where: { userId: session.user.id },
    include: { _count: { select: { clicks: true, conversions: true } } },
  }).catch(() => null)

  if (!affiliate) return NextResponse.json({ affiliate: null })
  return NextResponse.json({ affiliate: JSON.parse(JSON.stringify(affiliate)) })
}

// Self-enrollment: any logged-in customer can generate their referral code
export async function POST() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const existing = await prisma.affiliate.findFirst({
    where: { userId: session.user.id },
    include: { _count: { select: { clicks: true, conversions: true } } },
  })
  if (existing) return NextResponse.json({ affiliate: JSON.parse(JSON.stringify(existing)) })

  // Generate a readable code: first 6 chars of email prefix + 4 random uppercase chars
  const email = session.user.email || session.user.id
  const prefix = email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 6)
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  let code = `${prefix}${suffix}`

  // Retry once if code collides (extremely unlikely)
  const collision = await prisma.affiliate.findFirst({ where: { code } })
  if (collision) code = `${prefix}${Math.random().toString(36).slice(2, 6).toUpperCase()}`

  const affiliate = await prisma.affiliate.create({
    data: {
      userId: session.user.id,
      name: session.user.name || email,
      email: session.user.email || `${session.user.id}@bindupremium.com.bd`,
      code,
      commissionType: "FLAT",
      commissionValue: 100,
      isActive: true,
    },
    include: { _count: { select: { clicks: true, conversions: true } } },
  })

  return NextResponse.json({ affiliate: JSON.parse(JSON.stringify(affiliate)) })
}
