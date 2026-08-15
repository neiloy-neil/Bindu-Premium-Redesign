"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PlusCircle, Trash2, GripVertical } from "lucide-react"
import { ImageUploadInput } from "@/components/admin/ImageUploadInput"

type Product = { id: string; name: string; slug: string }
type EpisodeProduct = { productId: string; sortOrder: number; editorialNote?: string | null; product: Product }
type InitialData = {
  id: string
  name: string
  slug: string
  number: string
  tagline?: string | null
  story?: string | null
  heroImage?: string | null
  heroVideo?: string | null
  artistNote?: string | null
  artistName?: string | null
  isPublished: boolean
  sortOrder: number
  products: EpisodeProduct[]
} | null

export default function EpisodeForm({ initialData, allProducts }: { initialData: InitialData; allProducts: Product[] }) {
  const router = useRouter()
  const isNew = !initialData

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    number: initialData?.number ?? "",
    tagline: initialData?.tagline ?? "",
    story: initialData?.story ?? "",
    heroImage: initialData?.heroImage ?? "",
    heroVideo: initialData?.heroVideo ?? "",
    artistNote: initialData?.artistNote ?? "",
    artistName: initialData?.artistName ?? "",
    isPublished: initialData?.isPublished ?? false,
    sortOrder: initialData?.sortOrder ?? 0,
  })

  const [attachedProducts, setAttachedProducts] = useState<{ productId: string; editorialNote: string; sortOrder: number }[]>(
    initialData?.products.map((ep) => ({ productId: ep.productId, editorialNote: ep.editorialNote ?? "", sortOrder: ep.sortOrder })) ?? []
  )
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }))

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  }

  function addProduct(productId: string) {
    if (!productId || attachedProducts.some((p) => p.productId === productId)) return
    setAttachedProducts((prev) => [...prev, { productId, editorialNote: "", sortOrder: prev.length }])
  }

  function removeProduct(productId: string) {
    setAttachedProducts((prev) => prev.filter((p) => p.productId !== productId).map((p, i) => ({ ...p, sortOrder: i })))
  }

  function updateNote(productId: string, note: string) {
    setAttachedProducts((prev) => prev.map((p) => (p.productId === productId ? { ...p, editorialNote: note } : p)))
  }

  async function handleSave() {
    if (!form.name || !form.slug || !form.number) {
      toast.error("Name, slug, and number are required")
      return
    }
    setSaving(true)
    const payload = { ...form, products: attachedProducts }
    const url = isNew ? "/api/admin/episodes" : `/api/admin/episodes/${initialData!.id}`
    const method = isNew ? "POST" : "PUT"
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    if (res.ok) {
      toast.success(isNew ? "Episode created" : "Episode saved")
      router.push("/admin/episodes")
      router.refresh()
    } else {
      const err = await res.json()
      toast.error(err.error || "Save failed")
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm("Delete this episode? This cannot be undone.")) return
    setDeleting(true)
    const res = await fetch(`/api/admin/episodes/${initialData!.id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Episode deleted")
      router.push("/admin/episodes")
      router.refresh()
    } else {
      toast.error("Delete failed")
    }
    setDeleting(false)
  }

  const attachedSet = new Set(attachedProducts.map((p) => p.productId))
  const availableToAdd = allProducts.filter((p) => !attachedSet.has(p.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{isNew ? "New Episode" : "Edit Episode"}</h1>
          {!isNew && (
            <a href={`/episode/${initialData!.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
              /episode/{initialData!.slug} ↗
            </a>
          )}
        </div>
        <div className="flex gap-2">
          {!isNew && (
            <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 rounded-md border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors">
              {deleting ? "Deleting…" : "Delete"}
            </button>
          )}
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors">
            {saving ? "Saving…" : isNew ? "Create Episode" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — main fields */}
        <div className="lg:col-span-2 space-y-6">

          {/* Identity */}
          <div className="bg-white border rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-sm">Identity</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Episode Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => { set("name")(e); if (isNew) setForm((f) => ({ ...f, slug: autoSlug(e.target.value) })) }}
                  className="w-full h-9 rounded border px-3 text-sm"
                  placeholder="Collection 01: Ignition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Number *</label>
                <input value={form.number} onChange={set("number")} className="w-full h-9 rounded border px-3 text-sm font-mono" placeholder="01" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Slug * <span className="font-normal">(URL: /episode/slug)</span></label>
              <input value={form.slug} onChange={set("slug")} className="w-full h-9 rounded border px-3 text-sm font-mono" placeholder="01-ignition" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Tagline</label>
              <input value={form.tagline} onChange={set("tagline")} className="w-full h-9 rounded border px-3 text-sm" placeholder="Short one-liner shown on the archive page" />
            </div>
          </div>

          {/* Story */}
          <div className="bg-white border rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-sm">Story</h2>
            <p className="text-xs text-muted-foreground">Use a blank line between paragraphs.</p>
            <textarea
              value={form.story}
              onChange={set("story")}
              rows={8}
              className="w-full rounded border px-3 py-2 text-sm resize-none"
              placeholder="Write the narrative for this episode…"
            />
          </div>

          {/* Artist Note */}
          <div className="bg-white border rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-sm">Artist Note</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Artist Name</label>
                <input value={form.artistName} onChange={set("artistName")} className="w-full h-9 rounded border px-3 text-sm" placeholder="Illustrated by Rafi Hasan" />
              </div>
            </div>
            <textarea
              value={form.artistNote}
              onChange={set("artistNote")}
              rows={4}
              className="w-full rounded border px-3 py-2 text-sm resize-none"
              placeholder="Artist's statement about this episode…"
            />
          </div>

          {/* Products */}
          <div className="bg-white border rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-sm">Products in this Episode</h2>

            {attachedProducts.length > 0 && (
              <div className="divide-y">
                {attachedProducts.map((ap, idx) => {
                  const product = allProducts.find((p) => p.id === ap.productId)
                  return (
                    <div key={ap.productId} className="py-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground w-5">{idx + 1}</span>
                          <span className="text-sm font-medium">{product?.name}</span>
                        </div>
                        <button onClick={() => removeProduct(ap.productId)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        value={ap.editorialNote}
                        onChange={(e) => updateNote(ap.productId, e.target.value)}
                        className="w-full h-8 rounded border px-3 text-xs text-muted-foreground"
                        placeholder="Editorial note shown on the episode page (optional)"
                      />
                    </div>
                  )
                })}
              </div>
            )}

            {availableToAdd.length > 0 && (
              <div className="flex items-center gap-2">
                <select
                  defaultValue=""
                  onChange={(e) => { addProduct(e.target.value); e.target.value = "" }}
                  className="flex-1 h-9 rounded border px-3 text-sm"
                >
                  <option value="" disabled>Add product…</option>
                  {availableToAdd.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Right — media + settings */}
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-sm">Status</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
              />
              <span className="text-sm">Published</span>
            </label>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Sort Order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={set("sortOrder")}
                className="w-full h-9 rounded border px-3 text-sm"
              />
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-sm">Hero Media</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Hero Image</label>
              <ImageUploadInput value={form.heroImage} onChange={(url) => setForm(f => ({ ...f, heroImage: url }))} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Hero Video URL <span className="font-normal">(takes priority over image)</span></label>
              <input value={form.heroVideo} onChange={set("heroVideo")} className="w-full h-9 rounded border px-3 text-sm" placeholder="https://…mp4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
