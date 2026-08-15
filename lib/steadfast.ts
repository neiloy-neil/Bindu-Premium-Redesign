import prisma from "@/lib/prisma"

const BASE_URL = "https://portal.packzy.com/api/v1"

export async function getSteadfastConfig() {
  const rows = await prisma.setting.findMany({
    where: { key: { in: ["steadfast_api_key", "steadfast_secret_key", "steadfast_webhook_token"] } },
  })
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  return {
    apiKey: map["steadfast_api_key"] || process.env.STEADFAST_API_KEY || "",
    secretKey: map["steadfast_secret_key"] || process.env.STEADFAST_SECRET_KEY || "",
    webhookToken: map["steadfast_webhook_token"] || process.env.STEADFAST_WEBHOOK_TOKEN || "",
  }
}

type SteadfastConfig = { apiKey: string; secretKey: string }

function sfHeaders(c: SteadfastConfig) {
  return { "Api-Key": c.apiKey, "Secret-Key": c.secretKey, "Content-Type": "application/json" }
}

export interface SteadfastConsignment {
  consignment_id: number
  invoice: string
  tracking_code: string
  recipient_name: string
  recipient_phone: string
  recipient_address: string
  cod_amount: number
  status: string
}

export async function createConsignment(
  params: {
    invoice: string
    recipient_name: string
    recipient_phone: string
    recipient_address: string
    cod_amount: number
    note?: string
    item_description?: string
  },
  config: SteadfastConfig
): Promise<SteadfastConsignment> {
  const res = await fetch(`${BASE_URL}/create_order`, {
    method: "POST",
    headers: sfHeaders(config),
    body: JSON.stringify(params),
  })
  const data = await res.json()
  if (!res.ok || data.status !== 200) {
    throw new Error(data.message || `Steadfast error (${res.status})`)
  }
  return data.consignment as SteadfastConsignment
}

export async function checkStatusByConsignmentId(id: string | number, config: SteadfastConfig): Promise<string> {
  const res = await fetch(`${BASE_URL}/status_by_cid/${id}`, {
    headers: sfHeaders(config),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Steadfast status check failed")
  return data.delivery_status as string
}

// Map Steadfast delivery status strings → our DeliveryStatus enum
export function mapSteadfastStatus(sfStatus: string): "PENDING" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" | "FAILED" | "RETURNED" {
  switch (sfStatus) {
    case "delivered":
    case "partial_delivered":
    case "delivered_approval_pending":
    case "partial_delivered_approval_pending":
      return "DELIVERED"
    case "cancelled":
    case "cancelled_approval_pending":
      return "RETURNED"
    case "hold":
      return "IN_TRANSIT"
    case "unknown":
    case "unknown_approval_pending":
      return "FAILED"
    default:
      return "PENDING" // pending, in_review
  }
}
