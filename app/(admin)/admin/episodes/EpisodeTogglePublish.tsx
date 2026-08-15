"use client"
import { useState } from "react"
import { toast } from "sonner"

export default function EpisodeTogglePublish({ id, isPublished }: { id: string; isPublished: boolean }) {
  const [published, setPublished] = useState(isPublished)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    const res = await fetch(`/api/admin/episodes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !published }),
    })
    if (res.ok) {
      setPublished(!published)
      toast.success(published ? "Episode unpublished" : "Episode published")
    } else {
      toast.error("Failed to update")
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
        published ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${published ? "bg-green-500" : "bg-slate-400"}`} />
      {published ? "Published" : "Draft"}
    </button>
  )
}
