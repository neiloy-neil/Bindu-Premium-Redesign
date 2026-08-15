"use client"

import { useState } from "react"
import { Send } from "lucide-react"

const SUBJECTS = [
  "Order / Tracking",
  "Return / Exchange",
  "Size Help",
  "Collab / Partnership",
  "General Question",
]

import { submitContactForm } from "@/app/actions/contact"

export default function ContactForm({ supportEmail }: { supportEmail: string }) {
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await submitContactForm(form)
      if (res.error) throw new Error(res.error)
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="bg-[#111] border border-white/10 p-10 flex flex-col items-start gap-4">
        <div className="w-10 h-10 bg-bindu-cyan/10 border border-bindu-cyan/30 flex items-center justify-center">
          <Send className="w-5 h-5 text-bindu-cyan" />
        </div>
        <div>
          <p className="font-heading font-black text-white text-xl uppercase tracking-wide mb-2">Message Sent</p>
          <p className="text-sm text-white/50 leading-relaxed max-w-sm">
            We've got your message and will reply to <span className="text-white">{form.email}</span> within 24 hours.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Your Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder="Rafiq Ahmed"
            className="w-full bg-white/5 border border-white/10 focus:border-bindu-cyan px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Email Address</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={e => set("email", e.target.value)}
            placeholder="rafiq@email.com"
            className="w-full bg-white/5 border border-white/10 focus:border-bindu-cyan px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Subject</label>
        <select
          value={form.subject}
          onChange={e => set("subject", e.target.value)}
          className="w-full bg-white/5 border border-white/10 focus:border-bindu-cyan px-4 py-3 text-sm text-white outline-none transition-all appearance-none cursor-pointer"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" }}
        >
          {SUBJECTS.map(s => <option key={s} value={s} className="bg-[#111] text-white">{s}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Message</label>
        <textarea
          required
          value={form.message}
          onChange={e => set("message", e.target.value)}
          placeholder="Tell us what's up..."
          rows={6}
          className="w-full bg-white/5 border border-white/10 focus:border-bindu-cyan px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20 resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-xs text-bindu-error font-medium">
          Something went wrong. Email us directly at{" "}
          <a href={`mailto:${supportEmail}`} className="underline underline-offset-4">{supportEmail}</a>
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center gap-2 px-8 py-4 bg-bindu-cyan text-bindu-black text-xs font-black uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : <><Send className="w-3.5 h-3.5" /> Send Message</>}
      </button>
    </form>
  )
}
