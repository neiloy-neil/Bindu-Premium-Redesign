import prisma from "@/lib/prisma"

export interface UddoktaPayConfig {
  baseUrl: string
  apiKey: string
}

export async function getUddoktaPayConfig(): Promise<UddoktaPayConfig> {
  const rows = await prisma.setting.findMany({
    where: { key: { in: ["uddoktapay_base_url", "uddoktapay_api_key"] } },
  })
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  return {
    baseUrl: (map["uddoktapay_base_url"] || process.env.UDDOKTAPAY_BASE_URL || "").replace(/\/$/, ""),
    apiKey: map["uddoktapay_api_key"] || process.env.UDDOKTAPAY_API_KEY || "",
  }
}

function makeHeaders(apiKey: string) {
  return {
    "RT-UDDOKTAPAY-API-KEY": apiKey,
    "Content-Type": "application/json",
    Accept: "application/json",
  }
}

export interface UddoktaPayChargeResponse {
  status: boolean
  payment_url: string
  invoice_id?: string
}

export interface UddoktaPayVerifyResponse {
  full_name: string
  email: string
  amount: string
  fee: string
  charged_amount: string
  invoice_id: string
  metadata: Record<string, string>
  payment_method: string
  sender_number: string
  transaction_id: string
  date: string
  status: "COMPLETED" | "PENDING" | "ERROR"
}

export async function createCharge(
  params: {
    full_name: string
    email: string
    amount: number
    metadata: Record<string, string>
    redirect_url: string
    cancel_url: string
    webhook_url?: string
  },
  config: UddoktaPayConfig
): Promise<UddoktaPayChargeResponse> {
  const res = await fetch(`${config.baseUrl}/checkout-v2`, {
    method: "POST",
    headers: makeHeaders(config.apiKey),
    body: JSON.stringify({ ...params, amount: params.amount.toFixed(2) }),
  })
  const data = await res.json()
  if (!res.ok || !data.status) {
    throw new Error(data.message || "UddoktaPay charge creation failed")
  }
  return data
}

export async function verifyPayment(
  invoice_id: string,
  config: UddoktaPayConfig
): Promise<UddoktaPayVerifyResponse> {
  const res = await fetch(`${config.baseUrl}/verify-payment`, {
    method: "POST",
    headers: makeHeaders(config.apiKey),
    body: JSON.stringify({ invoice_id }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || "UddoktaPay verification failed")
  }
  return data
}
