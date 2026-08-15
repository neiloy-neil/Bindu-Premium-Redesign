"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  Store, CreditCard, Truck, Mail, BarChart2, Users,
  Save, Check, Eye, EyeOff, Copy, ExternalLink, Webhook,
  Globe, Phone, Share2, Tag, Building2, Zap, PackageCheck, ShieldCheck,
} from "lucide-react"

type Staff = { id: string; name: string; email: string; role: string }

const TABS = [
  { id: "general",  label: "General",       icon: Store,    desc: "Store identity & contact" },
  { id: "payments", label: "Payments",       icon: CreditCard, desc: "Gateways & methods" },
  { id: "shipping", label: "Shipping & Tax", icon: Truck,    desc: "Rates, courier & VAT" },
  { id: "email",    label: "Email / SMTP",   icon: Mail,     desc: "Transactional email" },
  { id: "tracking", label: "Tracking & SEO", icon: BarChart2,desc: "Analytics & meta tags" },
  { id: "staff",    label: "Staff",          icon: Users,    desc: "Admins & access" },
]

export function SettingsClient({
  initialSettings,
  initialStaff,
}: {
  initialSettings: Record<string, string>
  initialStaff: Staff[]
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")

  // General
  const [storeName, setStoreName] = useState(initialSettings["store_name"] || "")
  const [storeUrl, setStoreUrl] = useState(initialSettings["store_url"] || "")
  const [storeTagline, setStoreTagline] = useState(initialSettings["store_tagline"] || "")
  const [storeDescription, setStoreDescription] = useState(initialSettings["store_description"] || "")
  const [supportEmail, setSupportEmail] = useState(initialSettings["support_email"] || "")
  const [supportPhone, setSupportPhone] = useState(initialSettings["support_phone"] || "")
  const [socialFacebook, setSocialFacebook] = useState(initialSettings["social_facebook"] || "")
  const [socialInstagram, setSocialInstagram] = useState(initialSettings["social_instagram"] || "")
  const [socialTiktok, setSocialTiktok] = useState(initialSettings["social_tiktok"] || "")
  const [isSaving, setIsSaving] = useState(false)

  // Payments
  const [enabledCOD, setEnabledCOD] = useState(
    !initialSettings["enabled_payment_methods"] || initialSettings["enabled_payment_methods"].includes("COD")
  )
  const [enabledBkash, setEnabledBkash] = useState(
    !initialSettings["enabled_payment_methods"] || initialSettings["enabled_payment_methods"].includes("BKASH")
  )
  const [enabledNagad, setEnabledNagad] = useState(
    !initialSettings["enabled_payment_methods"] || initialSettings["enabled_payment_methods"].includes("NAGAD")
  )
  const [enabledUddoktapay, setEnabledUddoktapay] = useState(
    !!initialSettings["enabled_payment_methods"] && initialSettings["enabled_payment_methods"].includes("UDDOKTAPAY")
  )
  const [bkashNumber, setBkashNumber] = useState(initialSettings["bkash_merchant_number"] || "")
  const [nagadNumber, setNagadNumber] = useState(initialSettings["nagad_merchant_number"] || "")
  const [uddoktapayBaseUrl, setUddoktapayBaseUrl] = useState(initialSettings["uddoktapay_base_url"] || "")
  const [uddoktapayApiKey, setUddoktapayApiKey] = useState(initialSettings["uddoktapay_api_key"] || "")
  const [showUddoktapayKey, setShowUddoktapayKey] = useState(false)
  const [codDepositEnabled, setCodDepositEnabled] = useState(initialSettings["cod_deposit_enabled"] === "true")
  const [codDepositAmount, setCodDepositAmount] = useState(initialSettings["cod_deposit_amount"] || "100")
  const [isPaymentSaving, setIsPaymentSaving] = useState(false)

  // Shipping & Tax
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(initialSettings["free_shipping_above"] || "")
  const [shippingChargeAmount, setShippingChargeAmount] = useState(initialSettings["shipping_charge"] || "60")
  const [taxEnabled, setTaxEnabled] = useState(initialSettings["tax_enabled"] === "true")
  const [taxRate, setTaxRate] = useState(initialSettings["tax_rate"] || "")
  const [taxLabel, setTaxLabel] = useState(initialSettings["tax_label"] || "VAT")
  const [isShippingTaxSaving, setIsShippingTaxSaving] = useState(false)

  // Steadfast
  const [steadfastApiKey, setSteadfastApiKey] = useState(initialSettings["steadfast_api_key"] || "")
  const [steadfastSecretKey, setSteadfastSecretKey] = useState(initialSettings["steadfast_secret_key"] || "")
  const [steadfastWebhookToken, setSteadfastWebhookToken] = useState(initialSettings["steadfast_webhook_token"] || "")
  const [showSteadfastSecret, setShowSteadfastSecret] = useState(false)
  const [isSteadfastSaving, setIsSteadfastSaving] = useState(false)

  // SMTP
  const [smtpHost, setSmtpHost] = useState(initialSettings["smtp_host"] || "")
  const [smtpPort, setSmtpPort] = useState(initialSettings["smtp_port"] || "587")
  const [smtpSecure, setSmtpSecure] = useState(initialSettings["smtp_secure"] === "true")
  const [smtpUser, setSmtpUser] = useState(initialSettings["smtp_user"] || "")
  const [smtpPass, setSmtpPass] = useState(initialSettings["smtp_pass"] || "")
  const [showSmtpPass, setShowSmtpPass] = useState(false)
  const [smtpFromName, setSmtpFromName] = useState(initialSettings["smtp_from_name"] || "")
  const [smtpFromEmail, setSmtpFromEmail] = useState(initialSettings["smtp_from_email"] || "")
  const [adminNotificationEmail, setAdminNotificationEmail] = useState(initialSettings["admin_notification_email"] || "")
  const [testEmailTo, setTestEmailTo] = useState("")
  const [isSmtpSaving, setIsSmtpSaving] = useState(false)
  const [isSendingTest, setIsSendingTest] = useState(false)

  // Tracking
  const [ga4Id, setGa4Id] = useState(initialSettings["ga4_id"] || "")
  const [metaPixelId, setMetaPixelId] = useState(initialSettings["meta_pixel_id"] || "")
  const [clarityId, setClarityId] = useState(initialSettings["clarity_id"] || "")
  const [metaTitle, setMetaTitle] = useState(initialSettings["meta_title"] || "")
  const [metaDescription, setMetaDescription] = useState(initialSettings["meta_description"] || "")
  const [isTrackingSaving, setIsTrackingSaving] = useState(false)

  // Staff
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("STAFF")
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  const patch = async (settings: Record<string, any>) => {
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings }),
    })
    return res.ok
  }

  const handleSaveGeneral = async () => {
    setIsSaving(true)
    try {
      const ok = await patch({
        store_name: storeName, store_url: storeUrl, store_tagline: storeTagline,
        store_description: storeDescription, support_email: supportEmail, support_phone: supportPhone,
        social_facebook: socialFacebook, social_instagram: socialInstagram, social_tiktok: socialTiktok,
      })
      ok ? toast.success("General settings saved") : toast.error("Failed to save")
      if (ok) router.refresh()
    } catch { toast.error("Error saving") } finally { setIsSaving(false) }
  }

  const handleSavePayments = async () => {
    setIsPaymentSaving(true)
    try {
      const ok = await patch({
        enabled_payment_methods: [
          enabledCOD && "COD", enabledBkash && "BKASH",
          enabledNagad && "NAGAD", enabledUddoktapay && "UDDOKTAPAY",
        ].filter(Boolean).join(","),
        bkash_merchant_number: bkashNumber,
        nagad_merchant_number: nagadNumber,
        uddoktapay_base_url: uddoktapayBaseUrl,
        uddoktapay_api_key: uddoktapayApiKey,
        cod_deposit_enabled: codDepositEnabled,
        cod_deposit_amount: codDepositAmount,
      })
      ok ? toast.success("Payment settings saved") : toast.error("Failed to save")
      if (ok) router.refresh()
    } catch { toast.error("Error saving") } finally { setIsPaymentSaving(false) }
  }

  const handleSaveShippingTax = async () => {
    setIsShippingTaxSaving(true)
    try {
      const ok = await patch({
        free_shipping_above: freeShippingThreshold, shipping_charge: shippingChargeAmount,
        tax_enabled: taxEnabled, tax_rate: taxRate, tax_label: taxLabel,
      })
      ok ? toast.success("Shipping & tax settings saved") : toast.error("Failed to save")
      if (ok) router.refresh()
    } catch { toast.error("Error saving") } finally { setIsShippingTaxSaving(false) }
  }

  const handleSaveSteadfast = async () => {
    setIsSteadfastSaving(true)
    try {
      const ok = await patch({
        steadfast_api_key: steadfastApiKey,
        steadfast_secret_key: steadfastSecretKey,
        steadfast_webhook_token: steadfastWebhookToken,
      })
      ok ? toast.success("Steadfast settings saved") : toast.error("Failed to save")
      if (ok) router.refresh()
    } catch { toast.error("Error saving") } finally { setIsSteadfastSaving(false) }
  }

  const handleSaveSmtp = async () => {
    setIsSmtpSaving(true)
    try {
      const ok = await patch({
        smtp_host: smtpHost, smtp_port: smtpPort, smtp_secure: smtpSecure,
        smtp_user: smtpUser, smtp_pass: smtpPass,
        smtp_from_name: smtpFromName, smtp_from_email: smtpFromEmail,
        admin_notification_email: adminNotificationEmail,
      })
      ok ? toast.success("SMTP settings saved") : toast.error("Failed to save")
    } catch { toast.error("Error saving") } finally { setIsSmtpSaving(false) }
  }

  const handleSendTestEmail = async () => {
    if (!testEmailTo) { toast.error("Enter a recipient email"); return }
    setIsSendingTest(true)
    try {
      const res = await fetch("/api/admin/settings/test-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testEmailTo }),
      })
      const d = await res.json()
      res.ok ? toast.success("Test email sent! Check your inbox.") : toast.error(d.error || "Failed to send")
    } catch { toast.error("Error sending") } finally { setIsSendingTest(false) }
  }

  const handleSaveTracking = async () => {
    setIsTrackingSaving(true)
    try {
      const ok = await patch({ ga4_id: ga4Id, meta_pixel_id: metaPixelId, clarity_id: clarityId, meta_title: metaTitle, meta_description: metaDescription })
      ok ? toast.success("Tracking & SEO saved") : toast.error("Failed to save")
      if (ok) router.refresh()
    } catch { toast.error("Error saving") } finally { setIsTrackingSaving(false) }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/admin/settings/staff", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })
      if (res.ok) { toast.success("Staff member added"); setIsInviteOpen(false); setInviteEmail(""); router.refresh() }
      else { const d = await res.json(); toast.error(d.error || "Failed") }
    } catch { toast.error("Error") }
  }

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/settings/staff/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })
      res.ok ? toast.success("Role updated") : toast.error("Failed")
      if (res.ok) router.refresh()
    } catch { toast.error("Error") }
  }

  const handleRemoveStaff = async (id: string, name: string) => {
    if (!confirm(`Remove ${name}? They will become a regular customer.`)) return
    try {
      const res = await fetch(`/api/admin/settings/staff/${id}`, { method: "DELETE" })
      res.ok ? toast.success("Removed") : toast.error("Failed")
      if (res.ok) router.refresh()
    } catch { toast.error("Error") }
  }

  const activeTabData = TABS.find(t => t.id === activeTab)!

  return (
    <div className="flex flex-col min-h-full -m-6 lg:-m-8">

      {/* ── Horizontal tab bar — all screen sizes ────────────── */}
      <div className="bg-slate-900 border-b border-slate-800 flex overflow-x-auto shrink-0">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-shrink-0 flex flex-col items-center gap-1.5 px-5 py-3.5 text-[10px] font-semibold uppercase tracking-widest border-b-2 transition-colors",
                active
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Active tab header */}
        <div className="border-b border-border bg-white px-6 lg:px-8 py-5 flex items-center gap-3 shrink-0">
          {(() => { const Icon = activeTabData.icon; return <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0"><Icon className="h-4 w-4 text-slate-600" /></div> })()}
          <div>
            <h1 className="text-base font-semibold text-slate-900 leading-none">{activeTabData.label}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{activeTabData.desc}</p>
          </div>
        </div>

        {/* Scrollable form area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50">
          <div className="max-w-2xl space-y-6">

            {/* ── General ── */}
            {activeTab === "general" && (
              <>
                <Section title="Store Identity" icon={Store}>
                  <Field label="Store Name">
                    <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                  </Field>
                  <Field label="Store URL" hint="Used in email links — must match your live domain">
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                      <Input value={storeUrl} onChange={(e) => setStoreUrl(e.target.value)} placeholder="https://www.bindupremiumbd.com" className="pl-9" />
                    </div>
                  </Field>
                  <Field label="Tagline">
                    <Input value={storeTagline} onChange={(e) => setStoreTagline(e.target.value)} placeholder="Wear Your Story" />
                  </Field>
                  <Field label="Description">
                    <textarea value={storeDescription} onChange={(e) => setStoreDescription(e.target.value)} rows={3}
                      className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none shadow-sm" />
                  </Field>
                  <Field label="Currency">
                    <Input value="BDT (৳)" disabled className="bg-slate-50 text-muted-foreground" />
                  </Field>
                </Section>

                <Section title="Contact" icon={Phone}>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Support Email">
                      <Input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} placeholder="support@store.com" />
                    </Field>
                    <Field label="Support Phone">
                      <Input value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} placeholder="+880 1XXXXXXXXX" />
                    </Field>
                  </div>
                </Section>

                <Section title="Social Links" icon={Share2}>
                  <Field label="Facebook">
                    <Input value={socialFacebook} onChange={(e) => setSocialFacebook(e.target.value)} placeholder="https://facebook.com/..." />
                  </Field>
                  <Field label="Instagram">
                    <Input value={socialInstagram} onChange={(e) => setSocialInstagram(e.target.value)} placeholder="https://instagram.com/..." />
                  </Field>
                  <Field label="TikTok">
                    <Input value={socialTiktok} onChange={(e) => setSocialTiktok(e.target.value)} placeholder="https://tiktok.com/..." />
                  </Field>
                </Section>

                <SaveBar onClick={handleSaveGeneral} loading={isSaving} />
              </>
            )}

            {/* ── Payments ── */}
            {activeTab === "payments" && (
              <>
                <Section title="Payment Methods" icon={CreditCard} description="Control which gateways appear at checkout.">
                  <GatewayRow
                    label="Cash on Delivery (COD)"
                    description="Customer pays on delivery"
                    color="bg-green-500"
                    checked={enabledCOD} onChange={setEnabledCOD}
                  />
                  <GatewayRow
                    label="bKash"
                    description="Mobile banking via bKash gateway"
                    color="bg-pink-500"
                    checked={enabledBkash} onChange={setEnabledBkash}
                  />
                  {enabledBkash && (
                    <div className="ml-4 pl-4 border-l-2 border-pink-200 pb-1">
                      <Field label="bKash Merchant Number">
                        <Input value={bkashNumber} onChange={(e) => setBkashNumber(e.target.value)} placeholder="01XXXXXXXXX" />
                      </Field>
                    </div>
                  )}
                  <GatewayRow
                    label="Nagad"
                    description="Mobile banking via Nagad gateway"
                    color="bg-orange-500"
                    checked={enabledNagad} onChange={setEnabledNagad}
                  />
                  {enabledNagad && (
                    <div className="ml-4 pl-4 border-l-2 border-orange-200 pb-1">
                      <Field label="Nagad Merchant Number">
                        <Input value={nagadNumber} onChange={(e) => setNagadNumber(e.target.value)} placeholder="01XXXXXXXXX" />
                      </Field>
                    </div>
                  )}
                  <GatewayRow
                    label="UddoktaPay"
                    description="Unified gateway — bKash, Nagad, Rocket, Upay & more"
                    color="bg-violet-500"
                    checked={enabledUddoktapay} onChange={setEnabledUddoktapay}
                  />
                  {enabledUddoktapay && (
                    <div className="ml-4 pl-4 border-l-2 border-violet-200 space-y-4 pb-1">
                      <Field label="Base URL">
                        <Input value={uddoktapayBaseUrl} onChange={(e) => setUddoktapayBaseUrl(e.target.value)} placeholder="https://your-store.paymently.io/api" />
                      </Field>
                      <Field label="API Key">
                        <PasswordInput value={uddoktapayApiKey} onChange={setUddoktapayApiKey} show={showUddoktapayKey} onToggle={() => setShowUddoktapayKey(v => !v)} placeholder="RT-UDDOKTAPAY-API-KEY" />
                      </Field>
                    </div>
                  )}
                </Section>

                <Section title="COD Advance Deposit" icon={ShieldCheck} description="Require a small deposit before confirming COD orders — reduces fake orders and RTO.">
                  <GatewayRow
                    label="Require deposit on all COD orders"
                    description="When off, only flagged high-risk customers are asked"
                    color="bg-slate-400"
                    checked={codDepositEnabled} onChange={setCodDepositEnabled}
                  />
                  <Field label="Deposit Amount (৳)">
                    <Input type="number" min="0" value={codDepositAmount} onChange={(e) => setCodDepositAmount(e.target.value)} placeholder="100" />
                    <p className="text-xs text-muted-foreground mt-1">Recommended ৳100–200. Remainder collected on delivery.</p>
                  </Field>
                </Section>

                <SaveBar onClick={handleSavePayments} loading={isPaymentSaving} />
              </>
            )}

            {/* ── Shipping & Tax ── */}
            {activeTab === "shipping" && (
              <>
                <Section title="Shipping Rates" icon={Truck}>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Flat Shipping Charge (৳)">
                      <Input type="number" min="0" value={shippingChargeAmount} onChange={(e) => setShippingChargeAmount(e.target.value)} />
                    </Field>
                    <Field label="Free Shipping Above (৳)">
                      <Input type="number" min="0" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(e.target.value)} placeholder="Leave blank to disable" />
                    </Field>
                  </div>
                </Section>

                <Section title="VAT / Tax" icon={Tag}>
                  <GatewayRow
                    label="Enable tax at checkout"
                    description="Calculated on subtotal, shown as a separate line"
                    color="bg-blue-500"
                    checked={taxEnabled} onChange={setTaxEnabled}
                  />
                  {taxEnabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Tax Rate (%)">
                        <Input type="number" min="0" max="100" step="0.01" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} placeholder="e.g. 5" />
                      </Field>
                      <Field label="Tax Label">
                        <Input value={taxLabel} onChange={(e) => setTaxLabel(e.target.value)} placeholder="VAT" />
                      </Field>
                    </div>
                  )}
                </Section>

                <SaveBar onClick={handleSaveShippingTax} loading={isShippingTaxSaving} label="Save Shipping & Tax" />

                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground px-2">Courier Integration</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <Section title="Steadfast Courier" icon={PackageCheck} description="Auto-create consignments from admin order view.">
                    <Field label="API Key">
                      <Input value={steadfastApiKey} onChange={(e) => setSteadfastApiKey(e.target.value)} placeholder="Your Steadfast Api-Key" />
                    </Field>
                    <Field label="Secret Key">
                      <PasswordInput value={steadfastSecretKey} onChange={setSteadfastSecretKey} show={showSteadfastSecret} onToggle={() => setShowSteadfastSecret(v => !v)} placeholder="Your Steadfast Secret-Key" />
                    </Field>
                  </Section>

                  <Section title="Steadfast Webhook" icon={Webhook} description="Set this URL in your Steadfast dashboard → Webhook Integration.">
                    <Field label="Callback URL">
                      <CodeBlock value="https://bindupremiumbd.com/api/webhooks/steadfast" />
                    </Field>
                    <Field label="Auth Token (Bearer)">
                      <Input value={steadfastWebhookToken} onChange={(e) => setSteadfastWebhookToken(e.target.value)} placeholder="A secret token you also enter in Steadfast" />
                    </Field>
                  </Section>

                  <SaveBar onClick={handleSaveSteadfast} loading={isSteadfastSaving} label="Save Steadfast Settings" />
                </div>
              </>
            )}

            {/* ── Email / SMTP ── */}
            {activeTab === "email" && (
              <>
                <Section title="SMTP Server" icon={Mail} description="All transactional emails route through this config. Leave blank to use the built-in Resend relay.">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Field label="SMTP Host"><Input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} placeholder="smtp.gmail.com" /></Field>
                    </div>
                    <Field label="Port"><Input type="number" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} placeholder="587" /></Field>
                  </div>
                  <GatewayRow
                    label="Use SSL/TLS (port 465)"
                    description="Disable to use STARTTLS on port 587"
                    color="bg-sky-500"
                    checked={smtpSecure} onChange={setSmtpSecure}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="SMTP Username">
                      <Input value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} placeholder="noreply@store.com" />
                    </Field>
                    <Field label="SMTP Password">
                      <PasswordInput value={smtpPass} onChange={setSmtpPass} show={showSmtpPass} onToggle={() => setShowSmtpPass(v => !v)} placeholder="App password" />
                    </Field>
                  </div>
                </Section>

                <Section title="Sender Details" icon={Building2}>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="From Name"><Input value={smtpFromName} onChange={(e) => setSmtpFromName(e.target.value)} placeholder="Bindu Premium" /></Field>
                    <Field label="From Email"><Input type="email" value={smtpFromEmail} onChange={(e) => setSmtpFromEmail(e.target.value)} placeholder="noreply@store.com" /></Field>
                  </div>
                  <Field label="Admin Notification Email" hint="Receives new-order notifications. Falls back to Support Email if empty.">
                    <Input type="email" value={adminNotificationEmail} onChange={(e) => setAdminNotificationEmail(e.target.value)} placeholder="orders@store.com" />
                  </Field>
                </Section>

                <SaveBar onClick={handleSaveSmtp} loading={isSmtpSaving} label="Save SMTP Settings" />

                <Section title="Test Email" icon={Zap} description="Verify your config by sending a test. Save settings above first.">
                  <div className="flex gap-2">
                    <Input type="email" value={testEmailTo} onChange={(e) => setTestEmailTo(e.target.value)} placeholder="your@email.com" className="flex-1" />
                    <Button variant="outline" onClick={handleSendTestEmail} disabled={isSendingTest} className="shrink-0">
                      {isSendingTest ? "Sending…" : "Send Test →"}
                    </Button>
                  </div>
                </Section>
              </>
            )}

            {/* ── Tracking & SEO ── */}
            {activeTab === "tracking" && (
              <>
                <Section title="Analytics" icon={BarChart2}>
                  <Field label="Google Analytics 4" hint="e.g. G-XXXXXXXXXX">
                    <Input value={ga4Id} onChange={(e) => setGa4Id(e.target.value)} placeholder="G-XXXXXXXXXX" />
                  </Field>
                  <Field label="Meta Pixel ID" hint="e.g. 123456789012345">
                    <Input value={metaPixelId} onChange={(e) => setMetaPixelId(e.target.value)} placeholder="123456789012345" />
                  </Field>
                  <Field label="Microsoft Clarity ID" hint="e.g. abc123xyz">
                    <Input value={clarityId} onChange={(e) => setClarityId(e.target.value)} placeholder="abc123xyz" />
                  </Field>
                </Section>

                <Section title="Default SEO" icon={Globe}>
                  <Field label="Site Title">
                    <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Bindu Premium | Wear Your Story" />
                  </Field>
                  <Field label="Meta Description">
                    <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3}
                      className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none shadow-sm" />
                    <p className={cn("text-xs mt-1", metaDescription.length > 160 ? "text-red-500" : "text-muted-foreground")}>
                      {metaDescription.length}/160 characters
                    </p>
                  </Field>
                </Section>

                <Section title="Product Feeds" icon={ExternalLink} description="Submit to Google Merchant Center and Facebook Catalog Manager to list products for free.">
                  <Field label="Feed URL">
                    <CodeBlock value={(storeUrl || "https://www.bindupremiumbd.com") + "/api/feed/products.xml"} onCopy={() => {
                      navigator.clipboard.writeText((storeUrl || window.location.origin) + "/api/feed/products.xml")
                      toast.success("Feed URL copied")
                    }} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InstructionBox title="Google Merchant Center" steps={["Go to merchants.google.com", "Products → Feeds → Add feed", "Choose Scheduled fetch", "Paste the feed URL"]} />
                    <InstructionBox title="Facebook / Instagram Catalog" steps={["Go to business.facebook.com", "Commerce Manager → Catalog", "Data Sources → Add Data Feed", "Paste the feed URL"]} />
                  </div>
                </Section>

                <SaveBar onClick={handleSaveTracking} loading={isTrackingSaving} label="Save Tracking & SEO" />
              </>
            )}

            {/* ── Staff ── */}
            {activeTab === "staff" && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Team Members</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Manage admin and staff access to this panel.</p>
                  </div>
                  <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                    <DialogTrigger render={<Button size="sm" className="gap-1.5">+ Add Staff</Button>} />
                    <DialogContent>
                      <DialogHeader><DialogTitle>Add a Staff Member</DialogTitle></DialogHeader>
                      <form onSubmit={handleInvite} className="space-y-4 mt-4">
                        <Field label="Email Address">
                          <Input required type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="staff@example.com" />
                        </Field>
                        <Field label="Role">
                          <Select value={inviteRole} onValueChange={(val) => setInviteRole(val || "STAFF")}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="STAFF">Staff — Limited Access</SelectItem>
                              <SelectItem value="ADMIN">Administrator — Full Access</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Button type="submit" className="w-full">Add Staff Member</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="rounded-xl border border-border overflow-hidden bg-white shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="pl-5 font-semibold text-xs uppercase tracking-wide text-slate-500">Member</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-500">Role</TableHead>
                        <TableHead className="text-right pr-5 font-semibold text-xs uppercase tracking-wide text-slate-500">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {initialStaff.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="h-20 text-center text-muted-foreground text-sm">No staff members yet.</TableCell>
                        </TableRow>
                      ) : (
                        initialStaff.map((staff) => (
                          <TableRow key={staff.id} className="hover:bg-slate-50/60">
                            <TableCell className="pl-5">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                                  {(staff.name || staff.email)[0].toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-900">{staff.name}</p>
                                  <p className="text-xs text-muted-foreground">{staff.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select value={staff.role} onValueChange={(val) => handleRoleChange(staff.id, val || "")}>
                                <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="STAFF">Staff</SelectItem>
                                  <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-right pr-5">
                              <Button variant="ghost" size="sm" onClick={() => handleRemoveStaff(staff.id, staff.name)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 text-xs">
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

// ── Helper components ────────────────────────────────────────────────

function Section({ title, icon: Icon, description, children }: {
  title: string; icon: any; description?: string; children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-3">
        <div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
          <Icon className="h-3.5 w-3.5 text-slate-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 leading-none">{title}</p>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-baseline gap-1.5 text-sm font-medium text-slate-700">
        {label}
        {hint && <span className="text-xs text-muted-foreground font-normal">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

function GatewayRow({ label, description, color, checked, onChange }: {
  label: string; description: string; color: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className={cn(
      "flex items-center justify-between rounded-lg border px-4 py-3.5 transition-colors",
      checked ? "border-border bg-white" : "border-border bg-slate-50"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn("h-2 w-2 rounded-full shrink-0", checked ? color : "bg-slate-300")} />
        <div>
          <p className="text-sm font-medium text-slate-800">{label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

function PasswordInput({ value, onChange, show, onToggle, placeholder }: {
  value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; placeholder?: string
}) {
  return (
    <div className="relative">
      <Input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pr-10" />
      <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}

function CodeBlock({ value, onCopy }: { value: string; onCopy?: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <code className="flex-1 truncate rounded-md bg-slate-100 border border-border px-3 py-2 text-xs font-mono text-slate-600">{value}</code>
      {onCopy && (
        <Button size="sm" variant="outline" onClick={onCopy} className="shrink-0 gap-1.5 h-9">
          <Copy className="h-3.5 w-3.5" /> Copy
        </Button>
      )}
    </div>
  )
}

function InstructionBox({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-slate-50 p-4 space-y-2">
      <p className="text-xs font-semibold text-slate-700">{title}</p>
      <ol className="text-xs text-muted-foreground space-y-1.5 list-none">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="shrink-0 h-4 w-4 rounded-full bg-slate-200 text-slate-500 text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  )
}

function SaveBar({ onClick, loading, label = "Save Changes" }: { onClick: () => void; loading: boolean; label?: string }) {
  return (
    <div className="flex items-center justify-end pt-2">
      <Button onClick={onClick} disabled={loading} size="sm" className="gap-2 min-w-[140px]">
        {loading ? (
          <span className="flex items-center gap-2"><span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</span>
        ) : (
          <span className="flex items-center gap-2"><Save className="h-3.5 w-3.5" />{label}</span>
        )}
      </Button>
    </div>
  )
}
