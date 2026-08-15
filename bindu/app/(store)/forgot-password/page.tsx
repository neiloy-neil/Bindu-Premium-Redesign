"use client"

import Link from "next/link"
import { ArrowLeft, Mail, ArrowRight } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const supabase = createClient()
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
    } catch { /* swallow — we always show success to prevent enumeration */ }
    setSubmitted(true)
  }

  return (
    <div className="bg-[#0A0A0A] min-h-[80vh] flex items-center justify-center px-4 animate-in fade-in duration-500">
      <div className="w-full max-w-md space-y-8">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>

        <div>
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-bindu-cyan mb-4">Account</p>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Reset Password</h1>
          <p className="text-sm text-white/50">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 bg-[#111] border border-white/10 text-center space-y-4">
            <div className="w-16 h-16 bg-bindu-cyan/10 border border-bindu-cyan/20 flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-bindu-cyan" />
            </div>
            <h2 className="font-heading font-bold text-xl text-white">Check your inbox</h2>
            <p className="text-sm text-white/50">
              If <span className="font-medium text-white">{email}</span> is registered, you'll receive a reset link within a few minutes.
            </p>
            <Link
              href="/login"
              className="inline-block mt-4 text-sm font-bold text-bindu-cyan hover:text-white transition-colors underline underline-offset-4"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 focus:border-bindu-cyan px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/25"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-bindu-cyan text-bindu-black font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:shadow-lg hover:shadow-bindu-cyan/20 transition-all duration-300 text-xs"
            >
              Send Reset Link <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
