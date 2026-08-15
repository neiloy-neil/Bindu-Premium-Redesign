"use client"

import { useEffect, useState } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(releaseAt: string): TimeLeft | null {
  const diff = new Date(releaseAt).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

function Digit({ value, label, large }: { value: number; label: string; large?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div suppressHydrationWarning className="font-heading font-black text-white tabular-nums leading-none" style={{ fontSize: large ? "clamp(3.5rem, 10vw, 6rem)" : "clamp(2rem, 5vw, 3.5rem)" }}>
        {String(value).padStart(2, "0")}
      </div>
      <div className={`font-mono tracking-[0.3em] uppercase text-white/30 mt-1 ${large ? "text-[10px]" : "text-[9px]"}`}>{label}</div>
    </div>
  )
}

function Colon({ large }: { large?: boolean }) {
  return <div className="font-heading font-black text-bindu-cyan/60 leading-none pb-4" style={{ fontSize: large ? "clamp(2.5rem, 6vw, 4rem)" : "clamp(1.5rem, 3vw, 2.5rem)" }}>:</div>
}

export function DropCountdown({ releaseAt, className = "", large }: { releaseAt: string; className?: string; large?: boolean }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTimeLeft(calcTimeLeft(releaseAt))
    const id = setInterval(() => setTimeLeft(calcTimeLeft(releaseAt)), 1000)
    return () => clearInterval(id)
  }, [releaseAt])

  if (!timeLeft) return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="w-2 h-2 rounded-full bg-bindu-cyan animate-pulse" />
      <span className="font-mono text-[11px] tracking-widest uppercase text-bindu-cyan">Drop is live — shop now</span>
    </div>
  )

  return (
    <div className={`flex items-end gap-3 ${className}`}>
      <Digit value={timeLeft.days}    label="Days"    large={large} />
      <Colon large={large} />
      <Digit value={timeLeft.hours}   label="Hrs"     large={large} />
      <Colon large={large} />
      <Digit value={timeLeft.minutes} label="Min"     large={large} />
      <Colon large={large} />
      <Digit value={timeLeft.seconds} label="Sec"     large={large} />
    </div>
  )
}

// Compact single-line variant for ProductCard / shop badges
export function DropBadge({ releaseAt }: { releaseAt: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTimeLeft(calcTimeLeft(releaseAt))
    const id = setInterval(() => setTimeLeft(calcTimeLeft(releaseAt)), 1000)
    return () => clearInterval(id)
  }, [releaseAt])

  if (!timeLeft) return null

  const parts: string[] = []
  if (timeLeft.days > 0)    parts.push(`${timeLeft.days}d`)
  if (timeLeft.hours > 0)   parts.push(`${timeLeft.hours}h`)
  parts.push(`${String(timeLeft.minutes).padStart(2, "0")}m`)
  parts.push(`${String(timeLeft.seconds).padStart(2, "0")}s`)

  return (
    <span className="font-mono text-[10px] tracking-widest text-bindu-cyan">
      {parts.join(" ")}
    </span>
  )
}
