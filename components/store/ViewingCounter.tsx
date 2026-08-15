"use client"
import { useEffect, useState } from "react"
import { Eye } from "lucide-react"

function seededRandom(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  const x = Math.sin(Math.abs(h) + 1) * 10000
  return x - Math.floor(x)
}

export default function ViewingCounter({ productId }: { productId: string }) {
  const base = Math.floor(seededRandom(productId) * 9) + 4 // 4–12
  const [count, setCount] = useState(base)

  useEffect(() => {
    const tick = () => {
      setCount(prev => {
        const delta = Math.random() < 0.5 ? 1 : -1
        return Math.max(2, Math.min(18, prev + delta))
      })
    }
    const id = setInterval(tick, 7000 + Math.random() * 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center gap-1.5 text-[11px] font-bold text-bindu-cyan animate-pulse">
      <Eye className="w-3.5 h-3.5" />
      <span>{count} people viewing right now</span>
    </div>
  )
}
