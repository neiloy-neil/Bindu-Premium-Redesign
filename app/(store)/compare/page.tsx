"use client"

import { useCompareStore } from "@/store/useCompareStore"
import Image from "next/image"
import Link from "next/link"
import { X, ArrowLeft, GitCompareArrows, ExternalLink } from "lucide-react"

const rows = [
  { label: "Price", key: "price", render: (v: any) => v != null ? <span className="text-bindu-cyan font-mono font-bold">৳{Number(v).toLocaleString()}</span> : <span className="text-white/20">—</span> },
  { label: "Original Price", key: "comparePrice", render: (v: any) => v ? <span className="font-mono line-through text-white/30">৳{Number(v).toLocaleString()}</span> : <span className="text-white/20">—</span> },
  {
    label: "Discount",
    key: "__discount",
    render: (_: any, item: any) => {
      if (!item.comparePrice || !item.price) return <span className="text-white/20">—</span>
      const pct = Math.round((1 - item.price / item.comparePrice) * 100)
      return pct > 0
        ? <span className="px-2 py-0.5 bg-bindu-cyan/10 border border-bindu-cyan/30 text-bindu-cyan font-mono text-xs font-bold">{pct}% OFF</span>
        : <span className="text-white/20">—</span>
    },
  },
  { label: "Category", key: "category", render: (v: any) => v ? <span className="text-white/70 text-xs uppercase tracking-wide">{v}</span> : <span className="text-white/20">—</span> },
  { label: "Brand", key: "brand", render: (v: any) => v ? <span className="text-white/70 text-xs">{v}</span> : <span className="text-white/20">—</span> },
  {
    label: "Tags",
    key: "tags",
    render: (v: any) => v
      ? <div className="flex flex-wrap gap-1 justify-center">{v.split(",").filter(Boolean).map((t: string) => <span key={t} className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/40 text-[10px] uppercase tracking-wide">{t.trim()}</span>)}</div>
      : <span className="text-white/20">—</span>,
  },
]

export default function ComparePage() {
  const { items, removeItem, clearAll } = useCompareStore()

  if (items.length === 0) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen flex flex-col items-center justify-center px-4 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 border border-white/10 flex items-center justify-center mb-8">
          <GitCompareArrows className="w-8 h-8 text-white/20" />
        </div>
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-bindu-cyan mb-3">Compare</p>
        <h1 className="font-heading font-black text-white uppercase leading-none tracking-tight text-4xl mb-4">Nothing to Compare</h1>
        <p className="text-white/40 text-sm max-w-md leading-relaxed mb-8">
          Add up to 4 products to compare side-by-side. Look for the compare toggle on any product card.
        </p>
        <Link
          href="/shop"
          className="clip-hex px-8 py-4 bg-bindu-cyan text-bindu-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen animate-in fade-in duration-500">

      {/* Header */}
      <div className="border-b border-white/10 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-bindu-cyan mb-2">Side by Side</p>
              <h1 className="font-heading font-black text-white uppercase leading-none tracking-tight" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                Compare Products
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={clearAll}
                className="px-5 py-2.5 border border-white/15 text-white/40 text-xs font-bold uppercase tracking-widest hover:border-red-400/50 hover:text-red-400 transition-colors"
              >
                Clear All
              </button>
              <Link
                href="/shop"
                className="px-5 py-2.5 border border-white/15 text-white/50 text-xs font-bold uppercase tracking-widest hover:border-bindu-cyan hover:text-bindu-cyan transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
              </Link>
            </div>
          </div>
          {items.length < 4 && (
            <p className="text-white/30 text-xs mt-4 font-mono">
              {4 - items.length} more slot{4 - items.length !== 1 ? "s" : ""} available — add from product pages
            </p>
          )}
        </div>
      </div>

      {/* Comparison */}
      <div className="container mx-auto px-4 max-w-6xl py-10">
        <div className="overflow-x-auto">
          <div style={{ minWidth: `${Math.max(640, items.length * 220 + 160)}px` }}>

            {/* Product cards */}
            <div className="grid gap-px bg-white/5 mb-px" style={{ gridTemplateColumns: `160px repeat(${items.length}, 1fr)` }}>
              <div className="bg-[#0A0A0A] p-4 flex items-end">
                <p className="font-mono text-[9px] uppercase tracking-widest text-white/20">Product</p>
              </div>
              {items.map(item => (
                <div key={item.id} className="bg-[#111] p-5 relative">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 w-6 h-6 bg-white/5 border border-white/10 flex items-center justify-center hover:border-red-400/50 hover:text-red-400 text-white/30 transition-colors"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="relative aspect-square w-full max-w-[140px] mx-auto bg-white/5 overflow-hidden mb-4">
                    {item.image
                      ? <Image src={item.image} alt={item.name} fill sizes="160px" className="object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-xs text-white/20 font-mono">No image</div>
                    }
                  </div>
                  <h3 className="font-heading font-bold text-white text-sm uppercase tracking-tight leading-tight mb-1 line-clamp-2 text-center">{item.name}</h3>
                </div>
              ))}
            </div>

            {/* Attribute rows */}
            {rows.map((row, ri) => (
              <div
                key={row.label}
                className="grid gap-px bg-white/5 mb-px"
                style={{ gridTemplateColumns: `160px repeat(${items.length}, 1fr)` }}
              >
                <div className={`p-4 flex items-center ${ri % 2 === 0 ? "bg-[#0D0D0D]" : "bg-[#0A0A0A]"}`}>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">{row.label}</p>
                </div>
                {items.map(item => (
                  <div key={item.id} className={`p-4 flex items-center justify-center ${ri % 2 === 0 ? "bg-[#111]" : "bg-[#0F0F0F]"}`}>
                    {row.key === "__discount"
                      ? row.render(null, item)
                      : row.render((item as any)[row.key], item)
                    }
                  </div>
                ))}
              </div>
            ))}

            {/* CTA row */}
            <div
              className="grid gap-px bg-white/5"
              style={{ gridTemplateColumns: `160px repeat(${items.length}, 1fr)` }}
            >
              <div className="bg-[#0A0A0A] p-4" />
              {items.map(item => (
                <div key={item.id} className="bg-[#111] p-4 flex flex-col gap-2 items-center">
                  <Link
                    href={`/shop/${item.slug}`}
                    className="w-full py-3 bg-bindu-cyan text-bindu-black font-bold uppercase tracking-widest text-xs text-center hover:bg-white transition-colors flex items-center justify-center gap-2"
                  >
                    View Product <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
