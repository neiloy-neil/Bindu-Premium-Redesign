"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const MIN_SHOW_MS = 1400

export default function PageTransitionOverlay() {
  const pathname = usePathname()
  const [phase, setPhase] = useState<"visible" | "fading" | "hidden">("visible")

  useEffect(() => {
    setPhase("visible")
    const t1 = setTimeout(() => setPhase("fading"), MIN_SHOW_MS)
    const t2 = setTimeout(() => setPhase("hidden"), MIN_SHOW_MS + 450)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [pathname])

  if (phase === "hidden") return null

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#FAFAFA",
      opacity: phase === "fading" ? 0 : 1,
      transition: "opacity 0.45s ease",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: "2rem",
      pointerEvents: phase === "fading" ? "none" : "auto",
    }}>
      <style>{`
        @keyframes pulse-bindu {
          0%   { transform: scale(0.9); opacity: 0.7; }
          50%  { transform: scale(1.1); opacity: 1; box-shadow: 0 0 20px rgba(226, 74, 0, 0.4); }
          100% { transform: scale(0.9); opacity: 0.7; }
        }
        @keyframes fade-text {
          0%   { opacity: 0.3; }
          50%  { opacity: 0.8; }
          100% { opacity: 0.3; }
        }
      `}</style>

      {/* Pulsating Bindu (Dot) */}
      <div style={{
        width: '40px',
        height: '40px',
        background: '#E24A00', // Premium Orange
        borderRadius: '50%',
        animation: 'pulse-bindu 1.5s ease-in-out infinite',
      }} />

      <div style={{
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: '0.3em',
        color: '#0A1128',
        textTransform: 'uppercase',
        animation: 'fade-text 1.5s ease-in-out infinite',
      }}>
        Bindu Premium
      </div>
    </div>
  )
}
