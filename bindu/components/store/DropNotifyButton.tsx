"use client"

import { useState } from "react"
import { Bell, BellRing, Loader2 } from "lucide-react"

export function DropNotifyButton({ productId, initialCount, large }: { productId: string; initialCount: number; large?: boolean }) {
  const [state, setState] = useState<"idle" | "open" | "loading" | "done">("idle")
  const [email, setEmail] = useState("")
  const [count, setCount] = useState(initialCount)
  const [error, setError] = useState("")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setState("loading")
    try {
      const res = await fetch(`/api/drops/${productId}/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Something went wrong")
        setState("open")
        return
      }
      setCount(data.count)
      setState("done")
    } catch {
      setError("Network error, please try again")
      setState("open")
    }
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-2 text-bindu-cyan">
        <BellRing className="w-4 h-4" />
        <span className="font-mono text-[10px] tracking-widest uppercase">You&apos;re on the list</span>
        {count > 1 && (
          <span className="font-mono text-[10px] text-white/30">· {count} signed up</span>
        )}
      </div>
    )
  }

  if (state === "open" || state === "loading") {
    return (
      <form onSubmit={submit} className={`flex flex-col gap-2 ${large ? "w-full max-w-md" : "flex-row items-center"}`} onClick={(e) => e.preventDefault()}>
        <div className={`flex items-center gap-2 ${large ? "w-full" : ""}`} onClick={(e) => e.stopPropagation()}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            autoFocus
            className={`bg-white/5 border border-white/20 focus:border-bindu-cyan text-white placeholder-white/30 outline-none transition-colors font-mono ${large ? "flex-1 h-12 px-4 text-sm" : "h-8 w-44 px-3 text-xs"}`}
          />
          <button
            type="submit"
            disabled={state === "loading"}
            onClick={(e) => { e.stopPropagation(); submit(e as any) }}
            className={`bg-bindu-cyan text-[#0A0A0A] font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-60 whitespace-nowrap ${large ? "h-12 px-6 text-sm" : "h-8 px-3 text-xs"}`}
          >
            {state === "loading" ? <Loader2 className={`animate-spin ${large ? "w-4 h-4" : "w-3.5 h-3.5"}`} /> : "Notify Me"}
          </button>
          {!large && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setState("idle") }}
              className="text-white/30 hover:text-white/60 transition-colors"
              aria-label="Cancel"
            >
              ✕
            </button>
          )}
        </div>
        {error && <p className="text-[10px] text-red-400 font-mono">{error}</p>}
      </form>
    )
  }

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setState("open") }}
      className={`relative z-20 flex items-center gap-2 font-mono uppercase tracking-widest transition-colors ${
        large
          ? "text-sm text-white border border-white/20 hover:border-bindu-cyan hover:text-bindu-cyan px-6 py-3"
          : "text-[10px] text-white/40 hover:text-bindu-cyan border border-white/10 hover:border-bindu-cyan/40 px-3 py-1.5"
      }`}
    >
      <Bell className={large ? "w-4 h-4" : "w-3 h-3"} />
      Notify Me
      {count > 0 && <span className={large ? "text-white/40" : "ml-1 text-white/20"}>· {count}</span>}
    </button>
  )
}
