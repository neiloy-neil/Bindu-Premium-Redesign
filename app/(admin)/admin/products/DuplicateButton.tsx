"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function DuplicateButton({ productId }: { productId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDuplicate() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${productId}/duplicate`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to duplicate")
      toast.success("Product duplicated — it's been saved as inactive.")
      router.push(`/admin/products/${data.id}`)
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
      setLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="icon" disabled={loading} onClick={handleDuplicate} title="Duplicate product">
      <Copy className={`h-4 w-4 ${loading ? "animate-pulse" : ""}`} />
    </Button>
  )
}
