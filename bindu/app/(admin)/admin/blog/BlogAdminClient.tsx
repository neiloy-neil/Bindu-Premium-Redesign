"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, ExternalLink, Bold, Italic, Heading2, List, Link2, Image as ImageIcon, Quote, Code, Loader2, Tag } from "lucide-react"
import { ImageUploadInput } from "@/components/admin/ImageUploadInput"

type Category = { id: string; name: string; slug: string }
type Post = { id: string; title: string; slug: string; authorName: string; isPublished: boolean; createdAt: string; category: Category | null }

const empty = { title: "", slug: "", excerpt: "", content: "", coverImage: "", authorName: "Admin", tags: "", isPublished: false, categoryId: "" }

function HtmlToolbar({ textareaRef, value, onChange }: { textareaRef: React.RefObject<HTMLTextAreaElement>; value: string; onChange: (v: string) => void }) {
  function wrap(before: string, after: string) {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.slice(start, end) || "text"
    const next = value.slice(0, start) + before + selected + after + value.slice(end)
    onChange(next)
    setTimeout(() => { el.focus(); el.setSelectionRange(start + before.length, start + before.length + selected.length) }, 0)
  }

  function insert(text: string) {
    const el = textareaRef.current
    if (!el) return
    const pos = el.selectionStart
    const next = value.slice(0, pos) + text + value.slice(pos)
    onChange(next)
    setTimeout(() => { el.focus(); el.setSelectionRange(pos + text.length, pos + text.length) }, 0)
  }

  function promptLink() {
    const url = prompt("URL (https://...):")
    if (!url) return
    wrap(`<a href="${url}">`, "</a>")
  }

  function promptImage() {
    const url = prompt("Image URL:")
    if (!url) return
    const alt = prompt("Alt text:") || ""
    insert(`<img src="${url}" alt="${alt}" style="max-width:100%;height:auto;" />\n`)
  }

  const tools = [
    { icon: Bold, label: "Bold", action: () => wrap("<strong>", "</strong>") },
    { icon: Italic, label: "Italic", action: () => wrap("<em>", "</em>") },
    { icon: Heading2, label: "H2", action: () => wrap("<h2>", "</h2>") },
    { icon: Quote, label: "Blockquote", action: () => wrap("<blockquote>", "</blockquote>") },
    { icon: List, label: "List", action: () => wrap("<ul>\n  <li>", "</li>\n</ul>") },
    { icon: Code, label: "Code", action: () => wrap("<code>", "</code>") },
    { icon: Link2, label: "Link", action: promptLink },
    { icon: ImageIcon, label: "Image", action: promptImage },
  ]

  return (
    <div className="flex flex-wrap gap-0 border border-b-0 border-input rounded-t-md bg-muted/40 px-2 py-1">
      {tools.map(({ icon: Icon, label, action }) => (
        <button
          key={label}
          type="button"
          title={label}
          onClick={action}
          className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
      <span className="ml-auto text-[9px] text-muted-foreground self-center font-mono pr-1">HTML</span>
    </div>
  )
}

export default function BlogAdminClient({ data, categories: initialCategories }: { data: Post[]; categories: Category[] }) {
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null!)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [newCatName, setNewCatName] = useState("")
  const [addingCat, setAddingCat] = useState(false)

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  }

  function openNew() { setEditing(null); setForm(empty); setOpen(true) }

  async function openEdit(p: Post) {
    setLoadingEdit(true)
    setEditing(p)
    setOpen(true)
    try {
      const res = await fetch(`/api/admin/blog/${p.id}`)
      const full = await res.json()
      setForm({
        title: full.title,
        slug: full.slug,
        excerpt: full.excerpt || "",
        content: full.content || "",
        coverImage: full.coverImage || "",
        authorName: full.authorName,
        tags: full.tags || "",
        isPublished: full.isPublished,
        categoryId: full.categoryId || "",
      })
    } catch {
      toast.error("Failed to load post data")
      setOpen(false)
    } finally {
      setLoadingEdit(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editing ? `/api/admin/blog/${editing.id}` : "/api/admin/blog"
      const method = editing ? "PUT" : "POST"
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success(editing ? "Post updated" : "Post created")
      setOpen(false)
      router.refresh()
    } catch (e: any) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" })
    toast.success("Deleted")
    router.refresh()
  }

  async function handleAddCategory() {
    if (!newCatName.trim()) return
    setAddingCat(true)
    try {
      const res = await fetch("/api/admin/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName.trim() }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      const cat: Category = await res.json()
      setCategories(prev => [...prev, cat].sort((a, b) => a.name.localeCompare(b.name)))
      setForm(f => ({ ...f, categoryId: cat.id }))
      setNewCatName("")
      toast.success(`Category "${cat.name}" created`)
    } catch (e: any) { toast.error(e.message) }
    finally { setAddingCat(false) }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> New Post</Button>
      </div>

      <Dialog open={open} onOpenChange={(v) => { if (!loadingEdit) setOpen(v) }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Post" : "New Blog Post"}</DialogTitle></DialogHeader>

          {loadingEdit ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading post data…</span>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : autoSlug(e.target.value) })} required />
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated from title" />
              </div>
              <div>
                <label className="text-sm font-medium">Excerpt</label>
                <Input value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Short description shown in listing..." />
              </div>
              <div>
                <label className="text-sm font-medium">Cover Image</label>
                <ImageUploadInput value={form.coverImage} onChange={(url) => setForm({ ...form, coverImage: url })} placeholder="Click or drag to upload cover image" />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium">Category</label>
                <div className="flex gap-2 mt-1">
                  <select
                    value={form.categoryId}
                    onChange={e => setForm({ ...form, categoryId: e.target.value })}
                    className="flex-1 border border-input rounded-md px-3 py-2 text-sm bg-background"
                  >
                    <option value="">— None —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="New category name…"
                    className="text-xs h-8"
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddCategory() } }}
                  />
                  <Button type="button" size="sm" variant="outline" onClick={handleAddCategory} disabled={addingCat || !newCatName.trim()}>
                    <Tag className="w-3.5 h-3.5 mr-1" /> Add
                  </Button>
                </div>
              </div>

              {/* Content with toolbar */}
              <div>
                <label className="text-sm font-medium">Content (HTML) *</label>
                <div className="mt-1">
                  <HtmlToolbar textareaRef={textareaRef} value={form.content} onChange={v => setForm({ ...form, content: v })} />
                  <textarea
                    ref={textareaRef}
                    rows={14}
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    className="w-full border border-input rounded-b-md px-3 py-2 text-sm font-mono resize-y outline-none focus:ring-1 focus:ring-ring"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Author</label>
                  <Input value={form.authorName} onChange={e => setForm({ ...form, authorName: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium">Tags (comma-separated)</label>
                  <Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="tech, reviews, guide" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="pub" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} className="w-4 h-4" />
                <label htmlFor="pub" className="text-sm font-medium">Published</label>
              </div>

              <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving..." : "Save Post"}</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No posts yet</TableCell></TableRow>}
            {data.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.category?.name ?? "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.authorName}</TableCell>
                <TableCell><Badge variant={p.isPublished ? "default" : "secondary"}>{p.isPublished ? "Published" : "Draft"}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-1">
                  {p.isPublished && <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="sm"><ExternalLink className="h-4 w-4" /></Button></a>}
                  <Button variant="ghost" size="sm" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
