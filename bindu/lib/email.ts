import nodemailer from "nodemailer"
import prisma from "@/lib/prisma"

// ---------------------------------------------------------------------------
// Transport factory — reads SMTP config from Setting table at call time.
// Falls back to Resend SMTP relay if no custom SMTP configured.
// ---------------------------------------------------------------------------

async function getSmtpConfig() {
  const keys = ["smtp_host", "smtp_port", "smtp_secure", "smtp_user", "smtp_pass", "smtp_from_name", "smtp_from_email"]
  const rows = await prisma.setting.findMany({ where: { key: { in: keys } } })
  const s = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  return s
}

async function createTransport() {
  const s = await getSmtpConfig()

  // DB settings take priority; fall back to env vars
  const host  = s.smtp_host  || process.env.SMTP_HOST  || ""
  const user  = s.smtp_user  || process.env.SMTP_USER  || ""
  const pass  = s.smtp_pass  || process.env.SMTP_PASS  || ""
  const port  = Number(s.smtp_port  || process.env.SMTP_PORT  || 587)
  const secure = (s.smtp_secure || process.env.SMTP_SECURE || "false") === "true"

  if (host && user && pass) {
    return nodemailer.createTransport({ host, port, secure, auth: { user, pass } })
  }

  console.warn("[email] No SMTP configured. Set smtp_host/smtp_user/smtp_pass in Admin → Settings or via SMTP_HOST/SMTP_USER/SMTP_PASS env vars.")
  return nodemailer.createTransport({ jsonTransport: true })
}

async function getSenderAddress() {
  const rows = await prisma.setting.findMany({
    where: { key: { in: ["smtp_from_name", "smtp_from_email", "smtp_user", "store_name", "support_email"] } },
  })
  const s = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  const name  = s.smtp_from_name  || s.store_name   || process.env.FROM_NAME  || "Bindu Premium"
  // Fallback order: explicit from-email → SMTP login (same account → avoids sender-mismatch rejection) → env var
  const email = s.smtp_from_email || s.smtp_user || process.env.FROM_EMAIL || process.env.SMTP_USER || "noreply@bindupremiumbd.com"
  return `${name} <${email}>`
}

async function sendMail(to: string, subject: string, html: string) {
  const transport = await createTransport()
  const from = await getSenderAddress()
  try {
    await transport.sendMail({ from, to, subject, html })
    console.log(`[email] sent "${subject}" → ${to} (from: ${from})`)
  } catch (err: any) {
    console.error(`[email] FAILED "${subject}" → ${to} | from: ${from} | error: ${err?.message}`)
    throw err
  }
}

// ---------------------------------------------------------------------------
// Store metadata (name / logo / url) for email templates
// ---------------------------------------------------------------------------

async function getStoreMeta() {
  const settings = await prisma.setting.findMany({
    where: { key: { in: ["store_name", "store_logo", "support_email", "store_url"] } },
  })
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))
  return {
    name: map.store_name || "Bindu Premium",
    logo: map.store_logo || "",
    email: map.support_email || process.env.FROM_EMAIL || "noreply@bindupremium.com.bd",
    url: map.store_url || process.env.NEXT_PUBLIC_SITE_URL || "https://www.bindupremiumbd.com",
  }
}

// ---------------------------------------------------------------------------
// Base HTML template — BINDU PREMIUM dark brand
// ---------------------------------------------------------------------------

function baseTemplate(store: { name: string; logo: string; url: string }, content: string, recipientEmail?: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
*{box-sizing:border-box;margin:0;padding:0}
body,#body-table{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#0A0A0A !important;color:#E0E0E0;font-size:15px;line-height:1.65;-webkit-text-size-adjust:100%}
.wrap{max-width:600px;margin:0 auto;background:#111111;border:1px solid #222222}
.header{background:#000000;padding:32px;text-align:center;border-bottom:1px solid #1E1E1E}
.header-eyebrow{font-size:9px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:#00E5FF;margin-bottom:10px}
.header-name{color:#FFFFFF;font-size:20px;font-weight:800;letter-spacing:0.25em;text-transform:uppercase}
.body{padding:36px 32px;background:#111111}
.footer{padding:24px 32px;text-align:center;font-size:11px;color:#444444;border-top:1px solid #1E1E1E;background:#0A0A0A;letter-spacing:0.05em}
.footer a{color:#444444;text-decoration:none}
.footer a:hover{color:#00E5FF}
.btn{display:inline-block;background:#00E5FF;color:#000000 !important;padding:13px 32px;text-decoration:none;font-weight:700;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;margin:24px 0 8px}
.btn:hover{background:#00CCDD}
.divider{border:none;border-top:1px solid #1E1E1E;margin:28px 0}
.muted{color:#666666;font-size:13px}
.label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#444444;margin-bottom:5px}
.value{font-size:15px;font-weight:600;color:#E0E0E0}
.grid-2{display:table;width:100%;margin:20px 0}
.grid-2-cell{display:table-cell;width:50%;vertical-align:top;padding-right:16px}
.grid-2-cell:last-child{padding-right:0}
.item-row{display:table;width:100%;padding:13px 0;border-bottom:1px solid #1A1A1A}
.item-row:last-child{border-bottom:none}
.item-left{display:table-cell;vertical-align:top}
.item-right{display:table-cell;vertical-align:top;text-align:right;white-space:nowrap;padding-left:16px;font-weight:600;color:#E0E0E0}
.total-row{display:table;width:100%;padding:5px 0;font-size:13px;color:#666666}
.total-row-label{display:table-cell}
.total-row-value{display:table-cell;text-align:right}
.total-final{display:table;width:100%;padding:14px 0;font-size:16px;font-weight:700;border-top:1px solid #00E5FF;margin-top:10px;color:#FFFFFF}
.total-final-label{display:table-cell;color:#FFFFFF}
.total-final-value{display:table-cell;text-align:right;color:#00E5FF}
.tag{display:inline-block;background:#1A1A1A;border:1px solid #2A2A2A;color:#AAAAAA;padding:3px 10px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase}
.tag-green{background:#0A1F0A;border-color:#1A4D1A;color:#4ADE80}
.tag-red{background:#1F0A0A;border-color:#4D1A1A;color:#F87171}
.tag-gold{background:#1A180A;border-color:#4D440A;color:#FACC15}
.tag-cyan{background:#001A1F;border-color:#004455;color:#00E5FF}
.alert{background:#0F0F0F;border:1px solid #222222;border-left:3px solid #00E5FF;padding:16px 20px;margin:20px 0;font-size:14px;color:#AAAAAA}
.mono{font-family:'Courier New',Courier,monospace;letter-spacing:0.08em}
.section-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#444444;margin:24px 0 14px;padding-bottom:8px;border-bottom:1px solid #1A1A1A}
.highlight-box{background:#0A0A0A;border:1px solid #1E1E1E;padding:28px;text-align:center;margin:24px 0}
</style>
</head>
<body bgcolor="#0A0A0A" style="background:#0A0A0A !important;margin:0;padding:24px 0" id="body-table">
<div class="wrap">

<div class="header">
  ${store.logo ? `<img src="${store.logo}" alt="${store.name}" style="height:32px;margin-bottom:14px;display:block;margin-left:auto;margin-right:auto;filter:brightness(0) invert(1)">` : `<div class="header-eyebrow">EST. 2024</div>`}
  <div class="header-name">${store.name}</div>
</div>

<div class="body">${content}</div>

<div class="footer">
  <p style="margin-bottom:6px">&copy; ${new Date().getFullYear()} ${store.name.toUpperCase()} &nbsp;&mdash;&nbsp; <a href="${store.url}">${store.url}</a></p>
  <p>Questions? Reply to this email or reach out to our support team.</p>
  ${recipientEmail
    ? `<p style="margin-top:10px"><a href="${store.url}/api/store/unsubscribe?email=${encodeURIComponent(recipientEmail)}">Unsubscribe</a> from marketing emails.</p>`
    : `<p style="margin-top:10px"><a href="${store.url}/unsubscribed">Unsubscribe</a> from marketing emails.</p>`
  }
</div>

</div>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// Email send functions
// ---------------------------------------------------------------------------

type OrderEmailData = {
  to: string
  orderId: string
  orderNumber: string
  customerName: string
  items: { productName: string; size: string; color: string; quantity: number; price: number }[]
  subtotal: number
  shippingCharge: number
  discount: number
  giftWrapCharge: number
  total: number
  paymentMethod: string
  shippingName: string
  shippingPhone: string
  shippingAddress: string
  shippingArea: string
  shippingDistrict: string
  shippingDivision: string
  note?: string | null
  giftWrap?: boolean
  giftMessage?: string | null
}

// Generic email sender — used for campaigns and other custom emails
export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const transport = await createTransport()
  const store = await getStoreMeta()
  await transport.sendMail({
    from: `"${store.name}" <${store.email}>`,
    to,
    subject,
    html,
  })
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  const store = await getStoreMeta()
  const itemRows = data.items.map((i) => `
    <div class="item-row">
      <div class="item-left">
        <div style="font-weight:600;color:#E0E0E0">${i.productName}</div>
        <div class="muted" style="margin-top:3px">${i.size} / ${i.color} &nbsp;&times;${i.quantity}</div>
      </div>
      <div class="item-right">৳${(i.price * i.quantity).toLocaleString()}</div>
    </div>`).join("")

  const content = `
    <p class="label" style="color:#00E5FF;margin-bottom:8px">Order confirmed</p>
    <h1 style="font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;margin-bottom:10px">Your order is in.</h1>
    <p class="muted">Hi ${data.customerName} — we've received your order and it's being processed. You'll hear from us when it ships.</p>
    <hr class="divider">
    <div class="grid-2">
      <div class="grid-2-cell"><div class="label">Order number</div><div class="value mono">${data.orderNumber}</div></div>
      <div class="grid-2-cell"><div class="label">Payment</div><div class="value">${data.paymentMethod}</div></div>
    </div>
    <div class="section-label">Items ordered</div>
    ${itemRows}
    <div style="margin-top:20px">
      <div class="total-row"><div class="total-row-label">Subtotal</div><div class="total-row-value">৳${data.subtotal.toLocaleString()}</div></div>
      ${data.shippingCharge > 0 ? `<div class="total-row"><div class="total-row-label">Shipping</div><div class="total-row-value">৳${data.shippingCharge.toLocaleString()}</div></div>` : `<div class="total-row"><div class="total-row-label">Shipping</div><div class="total-row-value"><span class="tag tag-green">Free</span></div></div>`}
      ${data.discount > 0 ? `<div class="total-row"><div class="total-row-label">Discount</div><div class="total-row-value" style="color:#4ADE80">−৳${data.discount.toLocaleString()}</div></div>` : ""}
      ${data.giftWrapCharge > 0 ? `<div class="total-row"><div class="total-row-label">Gift wrap</div><div class="total-row-value">৳${data.giftWrapCharge.toLocaleString()}</div></div>` : ""}
      <div class="total-final"><div class="total-final-label">Total</div><div class="total-final-value">৳${data.total.toLocaleString()}</div></div>
    </div>
    <hr class="divider">
    <div class="section-label">Shipping to</div>
    <p style="font-weight:600;color:#E0E0E0">${data.shippingName}</p>
    <p class="muted" style="margin-top:4px">${data.shippingPhone}</p>
    <p class="muted">${data.shippingAddress}, ${data.shippingArea}</p>
    <p class="muted">${data.shippingDistrict}, ${data.shippingDivision}</p>
    ${data.note ? `<div class="alert" style="margin-top:20px"><strong style="color:#E0E0E0">Your note:</strong> ${data.note}</div>` : ""}
    ${data.giftWrap ? `<div class="alert" style="margin-top:16px"><strong style="color:#E0E0E0">Gift wrapped</strong>${data.giftMessage ? ` &mdash; &ldquo;${data.giftMessage}&rdquo;` : ""}</div>` : ""}
    <a href="${store.url}/order/${data.orderId}" class="btn">Track your order</a>
    <hr class="divider">
    <div class="section-label">What happens next</div>
    <div style="display:table;width:100%;margin-bottom:8px">
      <div style="display:table-cell;width:24px;vertical-align:top;padding-top:2px"><span style="display:inline-block;width:20px;height:20px;background:#00E5FF;color:#000;text-align:center;line-height:20px;font-size:10px;font-weight:700">1</span></div>
      <div style="display:table-cell;vertical-align:top;padding-left:12px"><p style="font-weight:600;color:#E0E0E0;margin-bottom:2px">We pack your order</p><p class="muted" style="font-size:13px">Quality-checked and sealed within 24 hrs.</p></div>
    </div>
    <div style="display:table;width:100%;margin-bottom:8px">
      <div style="display:table-cell;width:24px;vertical-align:top;padding-top:2px"><span style="display:inline-block;width:20px;height:20px;background:#00E5FF;color:#000;text-align:center;line-height:20px;font-size:10px;font-weight:700">2</span></div>
      <div style="display:table-cell;vertical-align:top;padding-left:12px"><p style="font-weight:600;color:#E0E0E0;margin-bottom:2px">Dispatch confirmation</p><p class="muted" style="font-size:13px">You'll get a tracking number the moment it ships.</p></div>
    </div>
    <div style="display:table;width:100%">
      <div style="display:table-cell;width:24px;vertical-align:top;padding-top:2px"><span style="display:inline-block;width:20px;height:20px;background:#1A1A1A;border:1px solid #333;color:#00E5FF;text-align:center;line-height:18px;font-size:10px;font-weight:700">3</span></div>
      <div style="display:table-cell;vertical-align:top;padding-left:12px"><p style="font-weight:600;color:#E0E0E0;margin-bottom:2px">Delivery in 1–3 days</p><p class="muted" style="font-size:13px">Delivered to your door. Wear the arc.</p></div>
    </div>`

  await sendMail(data.to, `Order confirmed — ${data.orderNumber}`, baseTemplate(store, content))
}

export async function sendShippingDispatched(data: {
  to: string
  customerName: string
  orderNumber: string
  courierName: string
  trackingNumber: string
  trackingUrl?: string
}) {
  const store = await getStoreMeta()
  const content = `
    <p class="label" style="color:#00E5FF;margin-bottom:8px">Shipped</p>
    <h1 style="font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;margin-bottom:10px">Your order is on the way.</h1>
    <p class="muted">Hi ${data.customerName} — <span class="mono">${data.orderNumber}</span> has been dispatched and is heading to you.</p>
    <hr class="divider">
    <div class="grid-2">
      <div class="grid-2-cell"><div class="label">Courier</div><div class="value">${data.courierName}</div></div>
      <div class="grid-2-cell"><div class="label">Tracking number</div><div class="value mono">${data.trackingNumber}</div></div>
    </div>
    ${data.trackingUrl ? `<a href="${data.trackingUrl}" class="btn">Track shipment</a>` : `<a href="${store.url}/account/orders" class="btn">View order</a>`}
    <p class="muted" style="margin-top:8px">Delivery typically takes 1–3 business days after dispatch.</p>
    <hr class="divider">
    <p style="font-size:13px;color:#555555;text-align:center">When it arrives, tag us — <a href="https://www.instagram.com/bindu_wearbd" style="color:#00E5FF;text-decoration:none">@bindu_wearbd</a> — and we'll feature your fit.</p>`

  await sendMail(data.to, `Dispatched — ${data.orderNumber} is on the way!`, baseTemplate(store, content))
}

export async function sendOrderStatusUpdate(data: {
  to: string
  customerName: string
  orderNumber: string
  status: string
  note?: string | null
}) {
  const store = await getStoreMeta()
  const statusLabel: Record<string, string> = {
    CONFIRMED: "Order confirmed",
    PROCESSING: "Being processed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    RETURNED: "Return processed",
  }
  const label = statusLabel[data.status] || data.status
  const isNegative = data.status === "CANCELLED"
  const content = `
    <p class="label" style="color:#00E5FF;margin-bottom:8px">Order update</p>
    <h1 style="font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;margin-bottom:10px">Status change on ${data.orderNumber}</h1>
    <p class="muted">Hi ${data.customerName} — here's the latest on your order.</p>
    <hr class="divider">
    <div style="margin:24px 0">
      <div class="label" style="margin-bottom:10px">New status</div>
      <span class="tag ${isNegative ? "tag-red" : "tag-green"}" style="font-size:13px;padding:7px 18px">${label}</span>
    </div>
    ${data.note ? `<div class="alert">${data.note}</div>` : ""}
    <a href="${store.url}/account/orders" class="btn">View order</a>`

  await sendMail(data.to, `${label} — ${data.orderNumber}`, baseTemplate(store, content))
}

export async function sendReturnUpdate(data: {
  to: string
  customerName: string
  orderNumber: string
  status: string
  refundAmount?: number
  adminNote?: string | null
}) {
  const store = await getStoreMeta()
  const isApproved = data.status === "APPROVED" || data.status === "REFUNDED"
  const isRejected = data.status === "REJECTED"
  const label = { APPROVED: "Return approved", REJECTED: "Return rejected", REFUNDED: "Refund processed", RECEIVED: "Return received" }[data.status] || data.status

  const content = `
    <p class="label" style="color:#00E5FF;margin-bottom:8px">Return update</p>
    <h1 style="font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;margin-bottom:10px">Your return has been updated.</h1>
    <p class="muted">Hi ${data.customerName} — here's an update on your return request for <span class="mono">${data.orderNumber}</span>.</p>
    <hr class="divider">
    <div style="margin:24px 0">
      <div class="label" style="margin-bottom:10px">Status</div>
      <span class="tag ${isApproved ? "tag-green" : isRejected ? "tag-red" : "tag-gold"}" style="font-size:13px;padding:7px 18px">${label}</span>
    </div>
    ${data.refundAmount && data.refundAmount > 0 ? `<div style="margin-bottom:16px"><div class="label">Refund amount</div><div class="value" style="color:#4ADE80;font-size:20px;margin-top:4px">৳${data.refundAmount.toLocaleString()}</div></div>` : ""}
    ${data.adminNote ? `<div class="alert">${data.adminNote}</div>` : ""}
    <a href="${store.url}/account/orders" class="btn">View order</a>`

  await sendMail(data.to, `${label} — ${data.orderNumber}`, baseTemplate(store, content))
}

export async function sendGiftCardEmail(data: {
  to: string
  recipientName: string
  senderName: string
  code: string
  amount: number
  message?: string | null
  expiresAt?: Date | null
}) {
  const store = await getStoreMeta()
  const content = `
    <p class="label" style="color:#00E5FF;margin-bottom:8px">Gift card</p>
    <h1 style="font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;margin-bottom:10px">You've received a gift card.</h1>
    <p class="muted"><strong style="color:#E0E0E0">${data.senderName}</strong> sent you a ${store.name} gift card.</p>
    ${data.message ? `<div class="alert" style="margin:24px 0;font-style:italic;color:#AAAAAA">&ldquo;${data.message}&rdquo;</div>` : "<hr class='divider'>"}
    <div class="highlight-box">
      <div class="label" style="text-align:center;margin-bottom:6px">Gift card value</div>
      <div style="font-size:44px;font-weight:800;color:#00E5FF;letter-spacing:-0.02em;margin-bottom:20px">৳${data.amount.toLocaleString()}</div>
      <div class="label" style="text-align:center;margin-bottom:8px">Redemption code</div>
      <div style="font-size:22px;font-weight:700;font-family:'Courier New',Courier,monospace;letter-spacing:0.2em;color:#FFFFFF;background:#000000;border:1px dashed #333333;padding:14px 28px;display:inline-block">${data.code}</div>
    </div>
    ${data.expiresAt ? `<p class="muted" style="text-align:center;margin-top:4px">Valid until ${new Date(data.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>` : ""}
    <a href="${store.url}" class="btn" style="display:block;text-align:center">Start shopping</a>`

  await sendMail(data.to, `${data.senderName} sent you a ৳${data.amount.toLocaleString()} ${store.name} gift card`, baseTemplate(store, content))
}

export async function sendAdminNewOrder(data: {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: { productName: string; size: string; color: string; quantity: number; price: number }[]
  subtotal: number
  shippingCharge: number
  discount: number
  total: number
  paymentMethod: string
  shippingAddress: string
  shippingArea: string
  shippingDistrict: string
  shippingDivision: string
}) {
  const store = await getStoreMeta()
  const rows = await prisma.setting.findMany({ where: { key: { in: ["admin_notification_email", "support_email"] } } })
  const s = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  const adminEmail = s.admin_notification_email || s.support_email
  if (!adminEmail) return

  const itemRows = data.items.map((i) => `
    <div class="item-row">
      <div class="item-left">
        <div style="font-weight:600;color:#E0E0E0">${i.productName}</div>
        <div class="muted" style="margin-top:3px">${i.size} / ${i.color} &nbsp;&times;${i.quantity}</div>
      </div>
      <div class="item-right">৳${(i.price * i.quantity).toLocaleString()}</div>
    </div>`).join("")

  const content = `
    <p class="label" style="color:#00E5FF;margin-bottom:8px">New order</p>
    <h1 style="font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;margin-bottom:10px">Order just landed.</h1>
    <p class="muted">A new order has been placed in your store.</p>
    <hr class="divider">
    <div class="grid-2">
      <div class="grid-2-cell"><div class="label">Order number</div><div class="value mono">${data.orderNumber}</div></div>
      <div class="grid-2-cell"><div class="label">Payment</div><div class="value">${data.paymentMethod}</div></div>
    </div>
    <div class="grid-2">
      <div class="grid-2-cell"><div class="label">Customer</div><div class="value">${data.customerName}</div></div>
      <div class="grid-2-cell"><div class="label">Phone</div><div class="value">${data.customerPhone}</div></div>
    </div>
    ${data.customerEmail ? `<p class="muted" style="margin-top:-8px;margin-bottom:12px">${data.customerEmail}</p>` : ""}
    <div class="section-label">Items ordered</div>
    ${itemRows}
    <div style="margin-top:20px">
      <div class="total-row"><div class="total-row-label">Subtotal</div><div class="total-row-value">৳${data.subtotal.toLocaleString()}</div></div>
      ${data.shippingCharge > 0 ? `<div class="total-row"><div class="total-row-label">Shipping</div><div class="total-row-value">৳${data.shippingCharge.toLocaleString()}</div></div>` : `<div class="total-row"><div class="total-row-label">Shipping</div><div class="total-row-value" style="color:#4ADE80">Free</div></div>`}
      ${data.discount > 0 ? `<div class="total-row"><div class="total-row-label">Discount</div><div class="total-row-value" style="color:#4ADE80">−৳${data.discount.toLocaleString()}</div></div>` : ""}
      <div class="total-final"><div class="total-final-label">Total</div><div class="total-final-value">৳${data.total.toLocaleString()}</div></div>
    </div>
    <hr class="divider">
    <div class="section-label">Ship to</div>
    <p class="muted">${data.shippingAddress}, ${data.shippingArea}, ${data.shippingDistrict}, ${data.shippingDivision}</p>
    <a href="${store.url}/admin/orders" class="btn">View in admin</a>`

  await sendMail(adminEmail, `New order — ${data.orderNumber} (৳${data.total.toLocaleString()})`, baseTemplate(store, content))
}

export async function sendWelcomeEmail(data: { to: string; name: string }) {
  const store = await getStoreMeta()
  const content = `
    <p class="label" style="color:#00E5FF;margin-bottom:8px">Welcome</p>
    <h1 style="font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;margin-bottom:10px">You're in.</h1>
    <p class="muted">Hi ${data.name} — your ${store.name} account is live and ready to go.</p>
    <hr class="divider">
    <p style="color:#AAAAAA;line-height:1.8">Explore the latest drops, save your favourites, and track every order &mdash; all from one place. Wear the arc.</p>
    <a href="${store.url}/shop" class="btn">Start shopping</a>`

  await sendMail(data.to, `Welcome to ${store.name}`, baseTemplate(store, content))
}

export async function sendStoreCreditIssued(data: {
  to: string
  customerName: string
  amount: number
  reason: string
  balance: number
}) {
  const store = await getStoreMeta()
  const content = `
    <p class="label" style="color:#00E5FF;margin-bottom:8px">Store credit</p>
    <h1 style="font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;margin-bottom:10px">Credit added to your account.</h1>
    <p class="muted">Hi ${data.customerName} — you've received store credit.</p>
    <hr class="divider">
    <div class="grid-2">
      <div class="grid-2-cell"><div class="label">Amount added</div><div style="font-size:22px;font-weight:800;color:#4ADE80;margin-top:6px">+৳${data.amount.toLocaleString()}</div></div>
      <div class="grid-2-cell"><div class="label">New balance</div><div style="font-size:22px;font-weight:800;color:#E0E0E0;margin-top:6px">৳${data.balance.toLocaleString()}</div></div>
    </div>
    ${data.reason ? `<div class="alert" style="margin-top:0">Reason: ${data.reason}</div>` : ""}
    <a href="${store.url}/shop" class="btn">Use your credit</a>`

  await sendMail(data.to, `৳${data.amount.toLocaleString()} store credit added to your account`, baseTemplate(store, content))
}

export async function sendAbandonedCartEmail({
  to, customerName, items, subtotal, sequence, couponCode,
}: {
  to: string
  customerName?: string | null
  items: { name: string; size?: string; color?: string; quantity: number; price: number }[]
  subtotal: number
  sequence: 1 | 2 | 3
  couponCode?: string | null
}) {
  const store = await getStoreMeta()
  const greeting = customerName ? `Hi ${customerName.split(" ")[0]},` : "Hey there,"
  const headlines: Record<number, string> = {
    1: "You left something behind",
    2: "Your cart is still waiting",
    3: "Last chance — your cart expires soon",
  }
  const sublines: Record<number, string> = {
    1: "You started shopping but didn't finish. Your items are still saved.",
    2: "Just a reminder — your bag is packed and ready. Complete your order before it sells out.",
    3: "This is your final reminder. Items in your cart may sell out soon.",
  }
  const itemRows = items.slice(0, 3).map(i =>
    `<div class="item-row"><div class="item-left"><div style="font-weight:600;color:#E0E0E0">${i.name}</div><div class="muted" style="margin-top:3px">${[i.size, i.color].filter(Boolean).join(" / ")} &times;${i.quantity}</div></div><div class="item-right">৳${(i.price * i.quantity).toLocaleString()}</div></div>`
  ).join("")
  const couponBlock = couponCode
    ? `<div class="alert"><strong style="color:#E0E0E0">Use code <span class="mono" style="color:#00E5FF">${couponCode}</span> for an extra discount</strong> when you complete your order.</div>`
    : ""
  const content = `
    <p class="label" style="color:#00E5FF;margin-bottom:8px">Your cart</p>
    <h1 style="font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;margin-bottom:10px">${headlines[sequence]}</h1>
    <p class="muted">${greeting} ${sublines[sequence]}</p>
    <hr class="divider">
    ${itemRows}
    <div style="margin-top:20px" class="total-final"><div class="total-final-label">Subtotal</div><div class="total-final-value">৳${subtotal.toLocaleString()}</div></div>
    ${couponBlock}
    <a href="${store.url}/cart" class="btn">Complete your purchase</a>`
  const subjects: Record<number, string> = {
    1: `You left something in your cart`,
    2: `Your cart is still waiting for you`,
    3: `Last chance — complete your order`,
  }
  await sendMail(to, subjects[sequence], baseTemplate(store, content))
}

export async function sendBackInStockAlert({ to, productName, variantLabel, productUrl }: { to: string; productName: string; variantLabel: string; productUrl: string }) {
  const store = await getStoreMeta()
  const content = `
    <p class="label" style="color:#00E5FF;margin-bottom:8px">Back in stock</p>
    <h1 style="font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;margin-bottom:10px">It's back.</h1>
    <p class="muted">You asked us to notify you when <strong style="color:#E0E0E0">${productName}</strong> (${variantLabel}) was back. It's available now &mdash; grab it before it sells out again.</p>
    <hr class="divider">
    <a href="${productUrl}" class="btn">Shop now</a>`
  await sendMail(to, `${productName} is back in stock!`, baseTemplate(store, content))
}

export async function sendDropNotifyConfirmation(data: {
  to: string
  productName: string
  productSlug: string
  releaseAt: Date
}) {
  const store = await getStoreMeta()
  const releaseDate = data.releaseAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
  const releaseTime = data.releaseAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Dhaka" })
  const productUrl = `${store.url}/shop/${data.productSlug}`
  const content = `
    <p class="label" style="color:#00E5FF;margin-bottom:8px">Drop notification</p>
    <h1 style="font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;margin-bottom:10px">You're on the list.</h1>
    <p class="muted">We'll email you the moment <strong style="color:#E0E0E0">${data.productName}</strong> drops. You won't miss it.</p>
    <hr class="divider">
    <div class="highlight-box">
      <div class="label" style="text-align:center;margin-bottom:6px">Scheduled drop</div>
      <div style="font-size:20px;font-weight:800;color:#FFFFFF;margin-bottom:4px">${data.productName}</div>
      <div style="font-size:14px;color:#00E5FF;font-weight:600;letter-spacing:0.05em">${releaseDate} &nbsp;·&nbsp; ${releaseTime} BST</div>
    </div>
    <p class="muted" style="text-align:center;font-size:12px;margin-top:-8px">Limited units. No restock after sellout.</p>
    <a href="${productUrl}" class="btn" style="display:block;text-align:center">Preview the drop →</a>`

  await sendMail(data.to, `You're in — ${data.productName} drops ${releaseDate}`, baseTemplate(store, content))
}

export async function sendStyleFollowUp(data: {
  to: string
  customerName: string
  orderNumber: string
  orderId: string
  items: { productName: string; size: string; color: string; productSlug?: string | null; imageUrl?: string | null }[]
}) {
  const store = await getStoreMeta()
  const firstName = data.customerName.split(" ")[0]

  const itemHighlight = data.items[0]
  const imageBlock = itemHighlight?.imageUrl
    ? `<div style="text-align:center;margin:24px 0"><img src="${itemHighlight.imageUrl}" alt="${itemHighlight.productName}" style="max-width:280px;width:100%;display:inline-block;border:1px solid #1E1E1E"></div>`
    : ""

  const styleLines = [
    "Keep it minimal — let the piece do the talking. One statement item, clean neutrals around it.",
    "Layer it. A dropped-shoulder fit works under an unbuttoned overshirt or jacket.",
    "Roll the sleeves once. It changes the silhouette — sharper, more intentional.",
    "Monochrome stacking: wear it with the same tonal family. All black, all grey, all muted olive.",
    "Contrast with texture — pair with cargo or ripstop to break the look.",
  ]

  const tipItems = styleLines.map(tip =>
    `<div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid #1A1A1A;font-size:14px;color:#AAAAAA;line-height:1.6">
      <span style="color:#00E5FF;font-weight:700;flex-shrink:0">—</span>
      <span>${tip}</span>
    </div>`
  ).join("")

  const reviewUrl = itemHighlight?.productSlug
    ? `${store.url}/shop/${itemHighlight.productSlug}#reviews`
    : `${store.url}/account/orders`

  const content = `
    <p class="label" style="color:#00E5FF;margin-bottom:8px">Your order · ${data.orderNumber}</p>
    <h1 style="font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;margin-bottom:10px">How are you styling it?</h1>
    <p class="muted">Hi ${firstName} — your order arrived a few days ago. We hope it fits the way it should.</p>
    <hr class="divider">
    ${imageBlock}
    <div class="section-label">Five ways to wear it</div>
    ${tipItems}
    <hr class="divider">
    <div class="highlight-box">
      <div style="font-size:13px;color:#666666;margin-bottom:10px;letter-spacing:0.05em;text-transform:uppercase;font-weight:700">Share your fit</div>
      <p style="color:#AAAAAA;font-size:14px;line-height:1.7;margin-bottom:14px">Tag us on Instagram and we&apos;ll feature your look on our page. Every drop has a story. Make it yours.</p>
      <a href="https://www.instagram.com/bindu_wearbd" style="display:inline-block;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#00E5FF;border:1px solid #00E5FF;padding:10px 24px;text-decoration:none">@bindu_wearbd →</a>
    </div>
    <div style="margin-top:24px;text-align:center">
      <p class="muted" style="margin-bottom:12px;font-size:13px">Happy with your purchase? Leave a quick review — it takes 30 seconds and means a lot.</p>
      <a href="${reviewUrl}" class="btn">Leave a review</a>
    </div>`

  await sendMail(data.to, `How are you styling it? — ${data.items[0]?.productName || "your Bindu order"}`, baseTemplate(store, content, data.to))
}

export async function sendReviewRequest(data: {
  to: string
  customerName: string
  orderNumber: string
  items: { productName: string; productSlug: string; imageUrl?: string | null }[]
}) {
  const store = await getStoreMeta()
  const firstName = data.customerName.split(" ")[0]
  const firstItem = data.items[0]

  const itemLinks = data.items.slice(0, 3).map(item =>
    `<div style="padding:10px 0;border-bottom:1px solid #1A1A1A">
      <a href="${store.url}/shop/${item.productSlug}#reviews" style="color:#E0E0E0;text-decoration:none;font-weight:600;font-size:14px">${item.productName}</a>
      &nbsp;<a href="${store.url}/shop/${item.productSlug}#reviews" style="color:#00E5FF;font-size:12px;font-family:'Courier New',monospace;letter-spacing:0.05em">Rate it →</a>
    </div>`
  ).join("")

  const content = `
    <p class="label" style="color:#00E5FF;margin-bottom:8px">Quick favour</p>
    <h1 style="font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;margin-bottom:10px">How did we do?</h1>
    <p class="muted">Hi ${firstName} — your order <span class="mono">${data.orderNumber}</span> arrived a couple of days ago. A quick review helps other buyers and it means a lot to us.</p>
    <hr class="divider">
    <div class="section-label">Your items</div>
    ${itemLinks}
    <div class="highlight-box" style="margin-top:28px;text-align:center">
      <p style="color:#666666;font-size:13px;margin-bottom:14px">Takes 30 seconds. Honest feedback only — good or bad.</p>
      <a href="${store.url}/shop/${firstItem?.productSlug ?? ""}#reviews" class="btn" style="display:inline-block">Leave a review</a>
    </div>
    <p class="muted" style="text-align:center;margin-top:16px;font-size:12px">Or <a href="${store.url}/account/orders" style="color:#555555">view your order</a> anytime.</p>`

  await sendMail(data.to, `How was your order? — ${data.orderNumber}`, baseTemplate(store, content, data.to))
}

export async function sendWishlistRestockAlert(data: {
  to: string
  customerName: string
  productName: string
  productSlug: string
  imageUrl?: string | null
  variantLabel: string
}) {
  const store = await getStoreMeta()
  const productUrl = `${store.url}/shop/${data.productSlug}`
  const firstName = data.customerName.split(" ")[0]
  const imageBlock = data.imageUrl
    ? `<div style="text-align:center;margin:20px 0"><img src="${data.imageUrl}" alt="${data.productName}" style="max-width:200px;width:100%;display:inline-block;border:1px solid #1E1E1E"></div>`
    : ""

  const content = `
    <p class="label" style="color:#00E5FF;margin-bottom:8px">Wishlist alert</p>
    <h1 style="font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;margin-bottom:10px">Back in stock.</h1>
    <p class="muted">Hi ${firstName} — something on your wishlist just came back.</p>
    <hr class="divider">
    ${imageBlock}
    <div style="margin:20px 0">
      <div class="label">Product</div>
      <div class="value" style="margin-top:4px">${data.productName}</div>
      <div class="muted" style="margin-top:4px;font-size:13px">${data.variantLabel}</div>
    </div>
    <div class="alert">Limited stock — it may not last. Get it before it sells out again.</div>
    <a href="${productUrl}" class="btn">Shop now →</a>
    <p class="muted" style="margin-top:12px;font-size:12px">You're receiving this because you wishlisted this item.</p>`

  await sendMail(data.to, `${data.productName} is back in stock!`, baseTemplate(store, content, data.to))
}

export async function sendWishlistSaleAlert(data: {
  to: string
  customerName: string
  productName: string
  productSlug: string
  originalPrice: number
  salePrice: number
  imageUrl?: string | null
}) {
  const store = await getStoreMeta()
  const productUrl = `${store.url}/shop/${data.productSlug}`
  const firstName = data.customerName.split(" ")[0]
  const savings = data.originalPrice - data.salePrice
  const pct = Math.round((savings / data.originalPrice) * 100)
  const imageBlock = data.imageUrl
    ? `<div style="text-align:center;margin:20px 0"><img src="${data.imageUrl}" alt="${data.productName}" style="max-width:200px;width:100%;display:inline-block;border:1px solid #1E1E1E"></div>`
    : ""

  const content = `
    <p class="label" style="color:#00E5FF;margin-bottom:8px">Wishlist alert</p>
    <h1 style="font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;margin-bottom:10px">Price drop on your wishlist.</h1>
    <p class="muted">Hi ${firstName} — an item you saved just went on sale.</p>
    <hr class="divider">
    ${imageBlock}
    <div style="margin:20px 0">
      <div class="label">Product</div>
      <div class="value" style="margin-top:4px">${data.productName}</div>
    </div>
    <div class="grid-2" style="margin:0">
      <div class="grid-2-cell">
        <div class="label">Was</div>
        <div style="font-size:18px;font-weight:700;color:#555555;text-decoration:line-through;margin-top:4px">৳${data.originalPrice.toLocaleString()}</div>
      </div>
      <div class="grid-2-cell">
        <div class="label">Now</div>
        <div style="font-size:22px;font-weight:800;color:#4ADE80;margin-top:4px">৳${data.salePrice.toLocaleString()} <span style="font-size:13px;color:#4ADE80;font-weight:600">(${pct}% off)</span></div>
      </div>
    </div>
    <a href="${productUrl}" class="btn">Get it now →</a>
    <p class="muted" style="margin-top:12px;font-size:12px">You're receiving this because you wishlisted this item. Sale prices may change.</p>`

  await sendMail(data.to, `${pct}% off — ${data.productName} just dropped in price`, baseTemplate(store, content, data.to))
}

export async function sendLowStockAlert(variants: { productName: string; size: string; color: string; stock: number; sku?: string | null }[]) {
  const store = await getStoreMeta()
  // Use dedicated admin notification email if configured, fall back to support email
  const settingRows = await prisma.setting.findMany({ where: { key: { in: ["admin_notification_email"] } } })
  const settingMap = Object.fromEntries(settingRows.map(r => [r.key, r.value]))
  const adminEmail = settingMap.admin_notification_email || store.email
  const rows = variants.map(v =>
    `<tr><td style="padding:10px 8px;border-bottom:1px solid #1A1A1A;color:#E0E0E0">${v.productName}</td><td style="padding:10px 8px;border-bottom:1px solid #1A1A1A;color:#AAAAAA">${v.size} / ${v.color}</td><td style="padding:10px 8px;border-bottom:1px solid #1A1A1A;font-family:'Courier New',monospace;color:#666666;font-size:12px">${v.sku || "—"}</td><td style="padding:10px 8px;border-bottom:1px solid #1A1A1A;font-weight:700;color:${v.stock === 0 ? "#F87171" : "#FACC15"}">${v.stock === 0 ? "OUT OF STOCK" : `${v.stock} left`}</td></tr>`
  ).join("")
  const content = `
    <p class="label" style="color:#F87171;margin-bottom:8px">Low stock alert</p>
    <h1 style="font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;margin-bottom:10px">${variants.length} variant${variants.length !== 1 ? "s" : ""} need restocking.</h1>
    <p class="muted">Review and restock these items to avoid running out.</p>
    <hr class="divider">
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead><tr style="background:#0A0A0A">
        <th style="padding:10px 8px;text-align:left;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#444444;font-weight:700">Product</th>
        <th style="padding:10px 8px;text-align:left;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#444444;font-weight:700">Variant</th>
        <th style="padding:10px 8px;text-align:left;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#444444;font-weight:700">SKU</th>
        <th style="padding:10px 8px;text-align:left;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#444444;font-weight:700">Stock</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <a href="${store.url}/admin/inventory" class="btn">View inventory</a>`
  await sendMail(adminEmail, `[${store.name}] Low stock alert — ${variants.length} variant${variants.length !== 1 ? "s" : ""}`, baseTemplate(store, content))
}

