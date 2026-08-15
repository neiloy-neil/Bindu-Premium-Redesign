"use client"

import { useCompareStore } from "@/store/useCompareStore"
import Link from "next/link"
import Image from "next/image"
import { X, BarChart2 } from "lucide-react"

export function CompareBar() {
  const { items, removeItem, clearAll } = useCompareStore()

  if (items.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0D0D0D] border-t border-bindu-cyan/20 z-50 px-4 py-3 shadow-[0_-4px_24px_rgba(0,229,255,0.06)]">
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <BarChart2 className="w-4 h-4 text-bindu-cyan" />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">
            Compare <span className="text-bindu-cyan">{items.length}</span>/4
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 overflow-x-auto py-0.5">
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-2 border border-white/10 bg-white/[0.03] px-2.5 py-1.5 shrink-0 group/chip hover:border-bindu-cyan/30 transition-colors"
            >
              {item.image && (
                <div className="relative w-6 h-6 overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill sizes="24px" className="object-cover" />
                </div>
              )}
              <span className="text-xs font-medium text-white/70 max-w-[90px] truncate">{item.name}</span>
              <button
                onClick={() => removeItem(item.id)}
                className="text-white/20 hover:text-bindu-cyan transition-colors"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {/* Empty slots */}
          {Array.from({ length: 4 - items.length }).map((_, i) => (
            <div key={i} className="flex items-center justify-center w-[80px] h-9 border border-dashed border-white/10 text-white/20">
              <span className="text-[10px] font-mono">+ add</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={clearAll}
            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/30 border border-white/10 hover:border-red-400/40 hover:text-red-400 transition-colors"
          >
            Clear
          </button>
          <Link
            href="/compare"
            className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest bg-bindu-cyan text-bindu-black hover:bg-white transition-colors"
          >
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  )
}
