import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/adminAuth"
import nodemailer from "nodemailer"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const { error, session } = await requireAdmin()
  if (error) return error

  const keys = ["smtp_host", "smtp_port", "smtp_secure", "smtp_user", "smtp_pass", "smtp_from_name", "smtp_from_email", "store_name"]
  const rows = await prisma.setting.findMany({ where: { key: { in: keys } } })
  const s = Object.fromEntries(rows.map((r) => [r.key, r.value]))

  if (!s.smtp_host || !s.smtp_user || !s.smtp_pass) {
    return NextResponse.json({ error: "SMTP not configured — fill in Host, User and Password first." }, { status: 400 })
  }

  const body = await req.json().catch(() => ({}))
  const to = body.to || session!.user.email

  try {
    const transport = nodemailer.createTransport({
      host: s.smtp_host,
      port: Number(s.smtp_port || 587),
      secure: s.smtp_secure === "true",
      auth: { user: s.smtp_user, pass: s.smtp_pass },
    })

    await transport.verify()

    const from = `"${s.smtp_from_name || s.store_name || "Bindu Premium"}" <${s.smtp_from_email || s.smtp_user}>`

    const storeName = s.smtp_from_name || s.store_name || "BINDU PREMIUM"
    await transport.sendMail({
      from,
      to,
      subject: `${storeName} — SMTP test`,
      html: `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="color-scheme" content="dark"><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#0A0A0A;color:#E0E0E0}.wrap{max-width:560px;margin:0 auto;background:#111111;border:1px solid #222222}.hdr{background:#000;padding:28px 32px;text-align:center;border-bottom:1px solid #1E1E1E}.hdr-eyebrow{font-size:9px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:#00E5FF;margin-bottom:8px}.hdr-name{color:#fff;font-size:18px;font-weight:800;letter-spacing:0.25em;text-transform:uppercase}.body{padding:36px 32px}.lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#444;margin-bottom:6px}.mono{font-family:'Courier New',monospace;letter-spacing:0.08em;color:#00E5FF}.ftr{padding:20px 32px;text-align:center;font-size:11px;color:#444;border-top:1px solid #1E1E1E;background:#0A0A0A}</style></head><body bgcolor="#0A0A0A" style="padding:24px 0"><div class="wrap"><div class="hdr"><div class="hdr-eyebrow">System</div><div class="hdr-name">${storeName}</div></div><div class="body"><p class="lbl" style="color:#00E5FF;margin-bottom:10px">SMTP verified</p><h1 style="font-size:22px;font-weight:800;color:#fff;margin-bottom:12px">Email delivery is working.</h1><p style="color:#888;line-height:1.7">Your SMTP configuration is correctly set up and this test message was delivered successfully.</p><div style="background:#0A0A0A;border:1px solid #1E1E1E;padding:20px 24px;margin:24px 0"><div class="lbl" style="margin-bottom:8px">SMTP details</div><p style="color:#666;font-size:13px">Host &nbsp;<span class="mono">${s.smtp_host}:${s.smtp_port || 587}</span></p><p style="color:#666;font-size:13px;margin-top:4px">Sent to &nbsp;<span class="mono" style="color:#AAAAAA">${to}</span></p></div></div><div class="ftr">&copy; ${new Date().getFullYear()} ${storeName.toUpperCase()}</div></div></body></html>`,
    })

    return NextResponse.json({ ok: true, message: `Test email sent to ${to}` })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
