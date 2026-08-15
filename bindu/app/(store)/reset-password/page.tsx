"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase's recovery link sets a session automatically via the URL hash.
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true)
    })
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      toast.error(error.message || "Failed to reset password")
    } else {
      setDone(true)
      setTimeout(() => router.push("/account"), 2000)
    }
  }

  return (
    <div className="bg-[#0A0A0A] min-h-[80vh] flex items-center justify-center px-4 animate-in fade-in duration-500">
      <div className="w-full max-w-md space-y-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-bindu-cyan mb-4">Account</p>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Set New Password</h1>
          <p className="text-sm text-white/50">Choose a new password for your Bindu Premium account.</p>
        </div>

        {done ? (
          <div className="p-8 bg-[#111] border border-white/10 text-center space-y-4">
            <div className="w-16 h-16 bg-bindu-success/10 border border-bindu-success/20 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-bindu-success" />
            </div>
            <h2 className="font-heading font-bold text-xl text-white">Password Updated</h2>
            <p className="text-sm text-white/50">Redirecting you to your account...</p>
          </div>
        ) : !ready ? (
          <div className="p-8 bg-[#111] border border-white/10 text-center space-y-2">
            <p className="text-sm text-white/50">
              This link is invalid or has expired.{" "}
              <Link href="/forgot-password" className="font-bold text-white hover:text-bindu-cyan transition-colors">
                Request a new one
              </Link>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-white/5 border border-white/10 focus:border-bindu-cyan px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/25"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Confirm Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-bindu-cyan px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/25"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-bindu-cyan text-bindu-black font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:shadow-lg hover:shadow-bindu-cyan/20 transition-all duration-300 text-xs disabled:opacity-50"
            >
              {loading ? "Updating..." : <> Update Password <ArrowRight className="w-4 h-4" /> </>}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
