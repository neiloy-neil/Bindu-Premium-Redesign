"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

type CouponRule = {
  id: string
  ruleType: string
  buyQty: number | null
  getQty: number | null
  categoryId: string | null
  minItems: number | null
  maxDiscount: number | null
  isStackable: boolean
  usagePerUser: number | null
}

type Coupon = {
  id: string
  code: string
  type: string
  value: number
  minOrderAmount: number | null
  maxUses: number | null
  usedCount: number
  isActive: boolean
  expiresAt: string | null
  createdAt: string
  rule: CouponRule | null
}

type Category = { id: string; name: string }

const RULE_TYPES = [
  { value: "PERCENTAGE", label: "Percentage (%)" },
  { value: "FLAT", label: "Flat Amount (৳)" },
  { value: "BOGO", label: "BOGO — Buy X Get Y Free" },
  { value: "FREE_SHIPPING", label: "Free Shipping" },
  { value: "CATEGORY", label: "Category-Specific Discount" },
  { value: "MIN_ITEMS", label: "Minimum Items Required" },
]

function ruleTypeLabel(coupon: Coupon): string {
  if (!coupon.rule) return coupon.type === "PERCENTAGE" ? "% Disc" : "Flat Disc"
  switch (coupon.rule.ruleType) {
    case "BOGO": return "BOGO"
    case "FREE_SHIPPING": return "Free Ship"
    case "CATEGORY_RESTRICT": return "Category"
    case "MIN_ITEMS": return "Min Items"
    default: return coupon.type === "PERCENTAGE" ? "% Disc" : "Flat Disc"
  }
}

const emptyForm = {
  code: "",
  mode: "PERCENTAGE",
  discountType: "PERCENTAGE",
  value: "",
  minOrder: "",
  maxUses: "",
  expiresAt: "",
  buyQty: "2",
  getQty: "1",
  categoryId: "",
  minItems: "2",
  maxDiscount: "",
  usagePerUser: "",
  isStackable: true,
}

export function CouponClient({ data, categories }: { data: Coupon[]; categories: Category[] }) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  function set(key: string, val: string | boolean) {
    setForm(f => ({ ...f, [key]: val }))
  }

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setIsDialogOpen(true)
  }

  const openEdit = (coupon: Coupon) => {
    setEditingId(coupon.id)
    let mode = coupon.type
    if (coupon.rule?.ruleType === "BOGO") mode = "BOGO"
    else if (coupon.rule?.ruleType === "FREE_SHIPPING") mode = "FREE_SHIPPING"
    else if (coupon.rule?.ruleType === "CATEGORY_RESTRICT") mode = "CATEGORY"
    else if (coupon.rule?.ruleType === "MIN_ITEMS") mode = "MIN_ITEMS"

    setForm({
      code: coupon.code,
      mode,
      discountType: coupon.type,
      value: String(coupon.value),
      minOrder: coupon.minOrderAmount ? String(coupon.minOrderAmount) : "",
      maxUses: coupon.maxUses ? String(coupon.maxUses) : "",
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "",
      buyQty: String(coupon.rule?.buyQty ?? 2),
      getQty: String(coupon.rule?.getQty ?? 1),
      categoryId: coupon.rule?.categoryId ?? "",
      minItems: String(coupon.rule?.minItems ?? 2),
      maxDiscount: coupon.rule?.maxDiscount ? String(coupon.rule.maxDiscount) : "",
      usagePerUser: coupon.rule?.usagePerUser ? String(coupon.rule.usagePerUser) : "",
      isStackable: coupon.rule?.isStackable ?? true,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { mode, discountType, value, minOrder, maxUses, expiresAt,
        buyQty, getQty, categoryId, minItems, maxDiscount, usagePerUser, isStackable } = form

      const needsRule = ["BOGO", "FREE_SHIPPING", "CATEGORY", "MIN_ITEMS"].includes(mode)
      const hasAdvanced = maxDiscount || usagePerUser || !isStackable

      let couponType = "PERCENTAGE"
      let couponValue = 0
      if (mode === "BOGO" || mode === "FREE_SHIPPING") {
        couponType = "FLAT"; couponValue = 0
      } else if (mode === "CATEGORY" || mode === "MIN_ITEMS") {
        couponType = discountType; couponValue = parseFloat(value || "0")
      } else {
        couponType = mode; couponValue = parseFloat(value || "0")
      }

      if (editingId) {
        const res = await fetch(`/api/admin/coupons/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            value: couponValue,
            minOrderAmount: minOrder ? parseFloat(minOrder) : null,
            maxUses: maxUses ? parseInt(maxUses) : null,
            expiresAt: expiresAt || null,
            isActive: true,
          }),
        })
        if (!res.ok) { toast.error((await res.json()).error || "Failed to update"); setSaving(false); return }

        // Upsert rule if needed
        if (needsRule || hasAdvanced) {
          await upsertRule(editingId, mode, { buyQty, getQty, categoryId, minItems, maxDiscount, usagePerUser, isStackable })
        }
        toast.success("Coupon updated")
      } else {
        const res = await fetch("/api/admin/coupons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: form.code.toUpperCase().trim(),
            type: couponType,
            value: couponValue,
            minOrderAmount: minOrder ? parseFloat(minOrder) : null,
            maxUses: maxUses ? parseInt(maxUses) : null,
            expiresAt: expiresAt || null,
          }),
        })
        const created = await res.json()
        if (!res.ok) { toast.error(created.error || "Failed to create"); setSaving(false); return }

        if ((needsRule || hasAdvanced) && created.coupon?.id) {
          await upsertRule(created.coupon.id, mode, { buyQty, getQty, categoryId, minItems, maxDiscount, usagePerUser, isStackable })
        }
        toast.success("Coupon created")
      }

      setIsDialogOpen(false)
      resetForm()
      router.refresh()
    } catch {
      toast.error("Error saving coupon")
    } finally {
      setSaving(false)
    }
  }

  async function upsertRule(couponId: string, mode: string, opts: any) {
    let ruleType = mode
    if (mode === "CATEGORY") ruleType = "CATEGORY_RESTRICT"
    if (mode === "PERCENTAGE" || mode === "FLAT") ruleType = mode

    await fetch("/api/admin/coupon-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        couponId,
        ruleType,
        buyQty: mode === "BOGO" ? parseInt(opts.buyQty) : null,
        getQty: mode === "BOGO" ? parseInt(opts.getQty) : null,
        categoryId: mode === "CATEGORY" ? (opts.categoryId || null) : null,
        minItems: mode === "MIN_ITEMS" ? parseInt(opts.minItems) : null,
        maxDiscount: opts.maxDiscount ? parseFloat(opts.maxDiscount) : null,
        usagePerUser: opts.usagePerUser ? parseInt(opts.usagePerUser) : null,
        isStackable: opts.isStackable,
      }),
    })
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const res = await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentStatus }),
    })
    if (res.ok) { toast.success(`Coupon ${currentStatus ? "disabled" : "enabled"}`); router.refresh() }
    else toast.error("Failed to update coupon")
  }

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" })
    if (res.ok) { toast.success("Coupon deleted"); router.refresh() }
    else toast.error("Failed to delete coupon")
  }

  const mode = form.mode
  const showDiscountValue = mode !== "BOGO" && mode !== "FREE_SHIPPING"
  const showDiscountType = mode === "CATEGORY" || mode === "MIN_ITEMS"

  return (
    <div className="space-y-4">
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm() }}>
        <DialogTrigger render={<Button onClick={openCreate}>Create Coupon</Button>} />
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Coupon" : "Create New Coupon"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">

            {/* Code */}
            <div>
              <label className="text-sm font-medium">Code *</label>
              <Input required value={form.code} onChange={e => set("code", e.target.value.toUpperCase())} placeholder="e.g. SUMMER50" disabled={!!editingId} className={editingId ? "opacity-60" : ""} />
            </div>

            {/* Mode / Type */}
            {!editingId && (
              <div>
                <label className="text-sm font-medium">Discount Type *</label>
                <Select value={mode} onValueChange={v => set("mode", v || mode)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {RULE_TYPES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Discount subtype (for category / min_items) */}
            {showDiscountType && (
              <div>
                <label className="text-sm font-medium">Discount Applied As</label>
                <Select value={form.discountType} onValueChange={v => set("discountType", v || form.discountType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                    <SelectItem value="FLAT">Flat Amount (৳)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* BOGO fields */}
            {mode === "BOGO" && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-lg border">
                <div>
                  <label className="text-xs font-medium">Buy Qty (X)</label>
                  <Input type="number" min="1" value={form.buyQty} onChange={e => set("buyQty", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium">Get Qty Free (Y)</label>
                  <Input type="number" min="1" value={form.getQty} onChange={e => set("getQty", e.target.value)} />
                </div>
                <p className="col-span-2 text-xs text-neutral-500">Cheapest item(s) in cart become free per qualifying group.</p>
              </div>
            )}

            {/* Category picker */}
            {mode === "CATEGORY" && (
              <div>
                <label className="text-sm font-medium">Category *</label>
                <Select value={form.categoryId} onValueChange={v => set("categoryId", v || "")}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Min items */}
            {mode === "MIN_ITEMS" && (
              <div>
                <label className="text-sm font-medium">Minimum Items in Cart *</label>
                <Input type="number" min="1" value={form.minItems} onChange={e => set("minItems", e.target.value)} />
              </div>
            )}

            {/* Discount value */}
            {showDiscountValue && (
              <div>
                <label className="text-sm font-medium">
                  {mode === "PERCENTAGE" || form.discountType === "PERCENTAGE" ? "Discount (%)" : "Discount Amount (৳)"}
                </label>
                <Input required={mode !== "FREE_SHIPPING"} type="number" min="0" step="0.01" value={form.value} onChange={e => set("value", e.target.value)} />
              </div>
            )}

            {/* Common fields */}
            <div>
              <label className="text-sm font-medium">Min Order Amount (optional)</label>
              <Input type="number" min="0" value={form.minOrder} onChange={e => set("minOrder", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Max Total Uses (optional)</label>
              <Input type="number" min="1" value={form.maxUses} onChange={e => set("maxUses", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Expires At (optional)</label>
              <Input type="date" value={form.expiresAt} onChange={e => set("expiresAt", e.target.value)} />
            </div>

            {/* Advanced */}
            <details className="border rounded-lg">
              <summary className="px-4 py-3 text-sm font-medium cursor-pointer select-none">Advanced Settings</summary>
              <div className="px-4 pb-4 pt-2 space-y-3">
                <div>
                  <label className="text-sm font-medium">Per-Customer Use Limit (optional)</label>
                  <Input type="number" min="1" value={form.usagePerUser} onChange={e => set("usagePerUser", e.target.value)} placeholder="e.g. 1" />
                </div>
                {(mode === "PERCENTAGE" || form.discountType === "PERCENTAGE") && (
                  <div>
                    <label className="text-sm font-medium">Max Discount Cap (৳, optional)</label>
                    <Input type="number" min="0" value={form.maxDiscount} onChange={e => set("maxDiscount", e.target.value)} placeholder="e.g. 500" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="stackable" checked={!!form.isStackable} onChange={e => set("isStackable", e.target.checked)} className="w-4 h-4" />
                  <label htmlFor="stackable" className="text-sm cursor-pointer">Stackable with bulk / auto discounts</label>
                </div>
              </div>
            </details>

            <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving..." : "Save Coupon"}</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border bg-white dark:bg-neutral-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Min Order</TableHead>
              <TableHead>Uses</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="h-24 text-center">No coupons found.</TableCell></TableRow>
            ) : (
              data.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-bold font-mono">{coupon.code}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{ruleTypeLabel(coupon)}</Badge>
                  </TableCell>
                  <TableCell>
                    {coupon.rule?.ruleType === "BOGO"
                      ? `Buy ${coupon.rule.buyQty} Get ${coupon.rule.getQty}`
                      : coupon.rule?.ruleType === "FREE_SHIPPING"
                      ? "Free Ship"
                      : coupon.type === "PERCENTAGE"
                      ? `${coupon.value}%`
                      : `৳${coupon.value}`}
                  </TableCell>
                  <TableCell>{coupon.minOrderAmount ? `৳${coupon.minOrderAmount}` : "—"}</TableCell>
                  <TableCell>{coupon.usedCount} / {coupon.maxUses || "∞"}</TableCell>
                  <TableCell>{coupon.expiresAt ? format(new Date(coupon.expiresAt), "MMM d, yyyy") : "Never"}</TableCell>
                  <TableCell>
                    <Badge variant={coupon.isActive ? "default" : "secondary"}>{coupon.isActive ? "Active" : "Inactive"}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(coupon)}>Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => handleToggle(coupon.id, coupon.isActive)}>
                      {coupon.isActive ? "Disable" : "Enable"}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(coupon.id, coupon.code)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
