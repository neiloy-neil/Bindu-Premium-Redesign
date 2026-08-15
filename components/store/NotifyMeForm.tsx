"use client"

import { useState } from "react"
import { Bell } from "lucide-react"

export default function NotifyMeForm({ variantId }: { variantId: string }) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus("loading")
    try {
      const res = await fetch("/api/store/stock-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, variantId }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus("success")
        setMessage("We'll notify you when this is back in stock.")
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to subscribe")
      }
    } catch {
      setStatus("error")
      setMessage("Something went wrong")
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-start gap-3 p-4 bg-bindu-success/10 border border-bindu-success/20 text-sm text-bindu-success font-medium">
        <Bell className="w-4 h-4 shrink-0 mt-0.5" />
        <span>{message}</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 py-3 px-4 bg-bindu-error/10 border border-bindu-error/20">
        <span className="w-2 h-2 rounded-full bg-bindu-error shrink-0" />
        <p className="text-xs font-bold uppercase tracking-widest text-bindu-error">Sold Out — This Size</p>
      </div>
      <p className="text-sm text-white/50 flex items-center gap-2">
        <Bell className="w-4 h-4 text-bindu-cyan shrink-0" />
        Drop your email and we'll hit you when it's back.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 bg-white/5 border border-white/10 focus:border-bindu-cyan px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/25"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-5 py-3 bg-bindu-cyan text-bindu-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Notify Me"}
        </button>
      </form>
      {status === "error" && <p className="text-xs text-bindu-error font-medium">{message}</p>}
    </div>
  )
}
