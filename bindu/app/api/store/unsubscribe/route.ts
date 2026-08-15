import { NextResponse } from "next/server"
import { mailchimpUnsubscribe } from "@/lib/mailchimp"

export async function GET(req: Request) {
  const email = new URL(req.url).searchParams.get("email")?.toLowerCase().trim()
  if (!email || !email.includes("@")) {
    return NextResponse.redirect(new URL("/unsubscribed?error=1", req.url))
  }

  try {
    await mailchimpUnsubscribe(email)
  } catch {
    // Best-effort; still redirect to confirmation
  }

  return NextResponse.redirect(new URL(`/unsubscribed?email=${encodeURIComponent(email)}`, req.url))
}

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 })
  }

  try {
    await mailchimpUnsubscribe(email.toLowerCase().trim())
  } catch {
    // Best-effort
  }

  return NextResponse.json({ success: true })
}
