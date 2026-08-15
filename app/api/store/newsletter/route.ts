import { NextRequest, NextResponse } from "next/server"
import { mailchimpSubscribe } from "@/lib/mailchimp"
import { rateLimit } from "@/lib/rateLimit"

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, "newsletter")
  if (limited) return limited

  const { email } = await req.json()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 })
  }

  await mailchimpSubscribe(email, undefined, ["newsletter"])

  return NextResponse.json({ ok: true })
}
