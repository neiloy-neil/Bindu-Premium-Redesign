"use client"

import { useState } from "react"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setState("loading")
    const res = await fetch("/api/store/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    if (res.ok) {
      setState("success")
      setEmail("")
    } else {
      setState("error")
    }
  }

  if (state === "success") {
    return (
      <p className="text-sm text-bindu-cyan font-bold uppercase tracking-widest py-2">
        You&apos;re in — check your inbox.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        required
        disabled={state === "loading"}
        className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-bindu-cyan disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full bg-bindu-cyan text-bindu-black py-2.5 text-xs font-black uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-60"
      >
        {state === "loading" ? "Subscribing…" : "Subscribe →"}
      </button>
      {state === "error" && (
        <p className="text-xs text-bindu-error">Something went wrong — try again.</p>
      )}
    </form>
  )
}
