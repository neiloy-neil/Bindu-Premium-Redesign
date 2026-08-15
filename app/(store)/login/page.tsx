"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

type Mode = "password" | "magic"

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>("password")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const supabase = createClient()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (signInError || !data.session) {
      setError("Invalid email or password.")
    } else {
      router.refresh()
      const role = (data.user.app_metadata as { role?: string } | undefined)?.role
      router.push(role === "ADMIN" || role === "STAFF" ? "/admin" : "/account")
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const supabase = createClient()
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    })

    setLoading(false)

    if (otpError) {
      setError(otpError.message || "Failed to send link. Try again.")
    } else {
      setMagicSent(true)
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row animate-in fade-in duration-500 bg-bindu-light-grey">

      {/* Form Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24 bg-bindu-white border-r border-bindu-border-grey shadow-sm">
        <div className="w-full max-w-md space-y-8">

          <div>
            <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-bindu-orange mb-4">Your Account</p>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-bindu-navy mb-2">Welcome Back</h1>
            <p className="text-sm text-bindu-text-muted">Enter your details to access your Bindu Premium account.</p>
          </div>

          {/* Mode toggle */}
          <div className="flex border border-bindu-border-grey">
            <button
              type="button"
              onClick={() => { setMode("password"); setError(""); setMagicSent(false) }}
              className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                mode === "password" ? "bg-bindu-navy text-bindu-white" : "text-bindu-text-muted hover:text-bindu-navy"
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => { setMode("magic"); setError(""); setMagicSent(false) }}
              className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                mode === "magic" ? "bg-bindu-navy text-bindu-white" : "text-bindu-text-muted hover:text-bindu-navy"
              }`}
            >
              Magic Link
            </button>
          </div>

          {/* Password form */}
          {mode === "password" && (
            <form className="space-y-5" onSubmit={handlePassword}>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-bindu-light-grey border border-bindu-border-grey focus:border-bindu-orange px-4 py-3 text-sm text-bindu-navy outline-none transition-all placeholder:text-bindu-text-muted"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Password</label>
                  <Link href="/forgot-password" className="text-xs text-bindu-text-muted hover:text-bindu-orange underline underline-offset-4 transition-colors">Forgot?</Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-bindu-light-grey border border-bindu-border-grey focus:border-bindu-orange px-4 py-3 text-sm text-bindu-navy outline-none transition-all"
                />
              </div>

              {error && <p className="text-xs text-bindu-error font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 bg-bindu-navy text-bindu-white font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-bindu-orange transition-all duration-300 text-xs disabled:opacity-50"
              >
                {loading ? "Signing In..." : <> Sign In <ArrowRight className="w-4 h-4" /> </>}
              </button>
            </form>
          )}

          {/* Magic link form */}
          {mode === "magic" && !magicSent && (
            <form className="space-y-5" onSubmit={handleMagicLink}>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-bindu-light-grey border border-bindu-border-grey focus:border-bindu-orange px-4 py-3 text-sm text-bindu-navy outline-none transition-all placeholder:text-bindu-text-muted"
                />
              </div>
              <p className="text-xs text-bindu-text-muted">We'll send a one-click sign-in link to your email. No password needed.</p>

              {error && <p className="text-xs text-bindu-error font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-bindu-navy text-bindu-white font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-bindu-orange transition-all duration-300 text-xs disabled:opacity-50"
              >
                {loading ? "Sending..." : <> Send Magic Link <ArrowRight className="w-4 h-4" /> </>}
              </button>
            </form>
          )}

          {/* Magic link sent state */}
          {mode === "magic" && magicSent && (
            <div className="space-y-5">
              <div className="bg-bindu-orange/5 border border-bindu-orange/20 px-6 py-8 text-center">
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-bindu-orange mb-3">Check your inbox</p>
                <p className="text-bindu-navy font-bold mb-2">Link sent to</p>
                <p className="text-bindu-text-muted text-sm mb-6 font-mono">{email}</p>
                <p className="text-bindu-text-muted text-xs leading-relaxed">Click the link in the email to sign in instantly. The link expires in 10 minutes.</p>
              </div>
              <button
                type="button"
                onClick={() => setMagicSent(false)}
                className="w-full py-3 border border-bindu-border-grey text-bindu-text-muted text-xs font-bold uppercase tracking-widest hover:border-bindu-navy hover:text-bindu-navy transition-colors"
              >
                Use a different email
              </button>
            </div>
          )}

          <p className="text-center text-sm text-bindu-text-muted pt-4 border-t border-bindu-border-grey">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-bindu-navy hover:text-bindu-orange transition-colors">
              Sign up
            </Link>
          </p>

        </div>
      </div>

      {/* Brand Panel */}
      <div className="hidden md:flex w-1/2 bg-bindu-light-grey relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-heading font-black text-bindu-navy/[0.035] leading-none tracking-tighter" style={{ fontSize: 'clamp(8rem, 18vw, 15rem)' }}>
            BINDU
          </span>
        </div>
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-bindu-orange/40 to-transparent" />

        <div className="relative">
          <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-bindu-orange border border-bindu-orange/25 px-3 py-1.5">
            PREMIUM EDITORIAL
          </span>
        </div>

        <div className="relative">
          <div className="w-8 h-[2px] bg-bindu-orange mb-6" />
          <h2 className="font-heading font-black text-bindu-navy uppercase leading-none mb-5" style={{ fontSize: 'clamp(2rem, 3.5vw, 3.2rem)' }}>
            Elevate<br />Your<br />Wardrobe.
          </h2>
          <p className="text-sm text-bindu-text-muted max-w-xs leading-relaxed">
            Premium fashion crafted for modern elegance. Sign in to access your curated collection.
          </p>
        </div>
      </div>

    </div>
  )
}
