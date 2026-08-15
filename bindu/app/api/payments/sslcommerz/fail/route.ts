import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bindupremiumbd.com"
  return NextResponse.redirect(`${siteUrl}/checkout?ssl=fail`, 303)
}
