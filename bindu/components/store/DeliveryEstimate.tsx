"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"

const ESTIMATES: Record<string, string> = {
  "Dhaka":       "1–2 working days",
  "Chattogram":  "2–3 working days",
  "Rajshahi":    "2–3 working days",
  "Khulna":      "2–3 working days",
  "Sylhet":      "2–3 working days",
  "Mymensingh":  "2–3 working days",
  "Barishal":    "3–4 working days",
  "Rangpur":     "3–4 working days",
}

export default function DeliveryEstimate() {
  const [division, setDivision] = useState("")
  const estimate = division ? ESTIMATES[division] : null

  return (
    <div className="flex flex-wrap items-center gap-3 mt-3">
      <div className="flex items-center gap-1.5 text-bindu-text-muted">
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        <span className="text-xs">Estimate for:</span>
      </div>
      <select
        value={division}
        onChange={e => setDivision(e.target.value)}
        className="text-xs border border-bindu-border rounded px-2.5 py-1.5 bg-white text-bindu-text focus:border-bindu-cyan outline-none cursor-pointer"
      >
        <option value="">Your division</option>
        {Object.keys(ESTIMATES).map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      {estimate && (
        <span className="text-xs font-semibold text-bindu-cyan">
          {estimate}
        </span>
      )}
    </div>
  )
}
