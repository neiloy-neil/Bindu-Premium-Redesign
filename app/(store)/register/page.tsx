"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { trackCompleteRegistration } from "@/lib/analytics"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, phone } },
      })

      if (error) {
        toast.error(error.message || "Registration failed")
        return
      }
      if (!data.user) {
        toast.error("Registration failed")
        return
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: data.user.id, name, email, phone }),
      })
      if (!res.ok) {
        const d = await res.json()
        toast.error(d.error || "Failed to set up account")
        return
      }

      if (data.session) {
        trackCompleteRegistration()
        toast.success("Welcome to Bindu Premium!")
        router.push("/account")
        router.refresh()
      } else {
        toast.success("Account created! Check your email to confirm, then sign in.")
        router.push("/login")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row-reverse animate-in fade-in duration-500 bg-bindu-light-grey">

      {/* Form Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24 bg-bindu-white border-l border-bindu-border-grey shadow-sm">
        <div className="w-full max-w-md space-y-8">

          <div>
            <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-bindu-orange mb-4">New Account</p>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-bindu-navy mb-2">Create Account</h1>
            <p className="text-sm text-bindu-text-muted">Join Bindu Premium Club to start earning rewards.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-bindu-light-grey border border-bindu-border-grey focus:border-bindu-orange px-4 py-3 text-sm text-bindu-navy outline-none transition-all placeholder:text-bindu-text-muted"
              />
            </div>

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
              <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-bindu-light-grey border border-bindu-border-grey focus:border-bindu-orange px-4 py-3 text-sm text-bindu-navy outline-none transition-all placeholder:text-bindu-text-muted"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-bindu-light-grey border border-bindu-border-grey focus:border-bindu-orange px-4 py-3 text-sm text-bindu-navy outline-none transition-all placeholder:text-bindu-text-muted"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-bindu-navy text-bindu-white font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-bindu-orange transition-all duration-300 text-xs disabled:opacity-50"
            >
              {loading ? "Creating Account..." : <> Create Account <ArrowRight className="w-4 h-4" /> </>}
            </button>
          </form>

          <p className="text-center text-sm text-bindu-text-muted pt-4 border-t border-bindu-border-grey">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-bindu-navy hover:text-bindu-orange transition-colors">
              Sign in
            </Link>
          </p>

        </div>
      </div>

      {/* Brand Panel */}
      <div className="hidden md:flex w-1/2 bg-bindu-light-grey relative overflow-hidden flex-col justify-between p-12">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-heading font-black text-bindu-navy/[0.035] leading-none tracking-tighter" style={{ fontSize: 'clamp(8rem, 18vw, 15rem)' }}>
            BINDU
          </span>
        </div>
        {/* Orange vertical accent */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-bindu-orange/40 to-transparent" />

        {/* Top badge */}
        <div className="relative">
          <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-bindu-orange border border-bindu-orange/25 px-3 py-1.5">
            PREMIUM EDITORIAL
          </span>
        </div>

        {/* Bottom copy */}
        <div className="relative">
          <div className="w-8 h-[2px] bg-bindu-orange mb-6" />
          <h2 className="font-heading font-black text-bindu-navy uppercase leading-none mb-5" style={{ fontSize: 'clamp(2rem, 3.5vw, 3.2rem)' }}>
            Join The<br />Premium<br />Club.
          </h2>
          <p className="text-sm text-bindu-text-muted max-w-xs leading-relaxed">
            Create an account and get exclusive access to new collections — plus rewards every time you shop.
          </p>
        </div>
      </div>

    </div>
  )
}
