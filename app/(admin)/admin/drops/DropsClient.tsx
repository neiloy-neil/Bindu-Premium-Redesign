"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Calendar, ExternalLink, X, Check, Pencil, Bell, Package } from "lucide-react"

type Drop = {
  id: string
  name: string
  slug: string
  releaseAt: string
  coverImage: string | null
  totalStock: number
  price: number
  category: string | null
  notifyCount: number
  isUpcoming: boolean
}

function toLocalDatetimeString(isoStr: string): string {
  const d = new Date(isoStr)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function getDaysLeft(isoStr: string): number {
  return Math.ceil((new Date(isoStr).getTime() - Date.now()) / 86400000)
}

function DropRow({ drop }: { drop: Drop }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [dateValue, setDateValue] = useState(toLocalDatetimeString(drop.releaseAt))
  const [isPending, startTransition] = useTransition()

  const save = () => {
    if (!dateValue) return
    startTransition(async () => {
      const res = await fetch(`/api/admin/products/${drop.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ releaseAt: new Date(dateValue).toISOString() }),
      })
      if (res.ok) {
        toast.success("Drop date updated")
        setEditing(false)
        router.refresh()
      } else {
        toast.error("Failed to update")
      }
    })
  }

  const clear = () => {
    startTransition(async () => {
      const res = await fetch(`/api/admin/products/${drop.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ releaseAt: null }),
      })
      if (res.ok) {
        toast.success("Drop date cleared")
        router.refresh()
      } else {
        toast.error("Failed to clear")
      }
    })
  }

  const releaseDate = new Date(drop.releaseAt)
  const daysLeft = drop.isUpcoming ? getDaysLeft(drop.releaseAt) : null

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      {/* Thumbnail + name */}
      <td className="py-3 pl-4 pr-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 overflow-hidden rounded border border-slate-200 bg-slate-100">
            {drop.coverImage ? (
              <img src={drop.coverImage} alt={drop.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Package className="w-4 h-4" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 leading-tight">{drop.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {drop.category && <span>{drop.category} · </span>}
              ৳{drop.price.toLocaleString()}
            </p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="py-3 px-3 whitespace-nowrap">
        {drop.isUpcoming ? (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Upcoming
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-1">
            Released
          </span>
        )}
      </td>

      {/* Stock */}
      <td className="py-3 px-3 whitespace-nowrap">
        <span className="text-sm font-medium text-slate-700 tabular-nums">{drop.totalStock}</span>
        <span className="text-xs text-slate-400 ml-1">units</span>
      </td>

      {/* Notify signups */}
      <td className="py-3 px-3 whitespace-nowrap">
        {drop.notifyCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-200 rounded-full px-2.5 py-1">
            <Bell className="w-3 h-3" />
            {drop.notifyCount}
          </span>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        )}
      </td>

      {/* Release date / inline editor */}
      <td className="py-3 px-3">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type="datetime-local"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              autoFocus
            />
            <button
              onClick={save}
              disabled={isPending}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-green-300 text-green-600 hover:bg-green-50 transition-colors disabled:opacity-40"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setEditing(false); setDateValue(toLocalDatetimeString(drop.releaseAt)) }}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <div>
              <p className="text-sm text-slate-700 tabular-nums">
                {releaseDate.toLocaleDateString("en-BD", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
              <p className="text-xs text-slate-400 tabular-nums">
                {releaseDate.toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" })}
                {daysLeft !== null && daysLeft > 0 && (
                  <span className="ml-2 font-semibold text-amber-600">({daysLeft}d left)</span>
                )}
              </p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="opacity-0 group-hover:opacity-100 h-6 w-6 flex items-center justify-center rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            >
              <Pencil className="w-3 h-3" />
            </button>
          </div>
        )}
      </td>

      {/* Actions */}
      <td className="py-3 pl-3 pr-4">
        <div className="flex items-center gap-2 justify-end">
          {drop.isUpcoming && (
            <button
              onClick={clear}
              disabled={isPending}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40 px-2 py-1 rounded hover:bg-red-50"
            >
              Clear
            </button>
          )}
          <Link
            href={`/admin/products/${drop.id}`}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-amber-600 transition-colors px-2 py-1 rounded border border-slate-200 hover:border-amber-300 hover:bg-amber-50"
          >
            Edit <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </td>
    </tr>
  )
}

function DropsTable({ drops }: { drops: Drop[] }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="text-left py-2.5 pl-4 pr-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Product</th>
            <th className="text-left py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
            <th className="text-left py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Stock</th>
            <th className="text-left py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Notified</th>
            <th className="text-left py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Release Date</th>
            <th className="text-right py-2.5 pl-3 pr-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {drops.map((drop) => <DropRow key={drop.id} drop={drop} />)}
        </tbody>
      </table>
    </div>
  )
}

export default function DropsClient({ upcoming, past }: { upcoming: Drop[]; past: Drop[] }) {
  return (
    <div className="space-y-8">
      {/* Upcoming */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
            Upcoming ({upcoming.length})
          </h2>
        </div>
        {upcoming.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 border-dashed py-12 text-center">
            <Calendar className="mx-auto w-8 h-8 text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">No upcoming drops scheduled.</p>
            <p className="text-xs text-slate-400 mt-1">Set a future release date on any product to schedule a drop.</p>
          </div>
        ) : (
          <DropsTable drops={upcoming} />
        )}
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Past Drops ({past.length})
            </h2>
          </div>
          <div className="opacity-70">
            <DropsTable drops={past} />
          </div>
        </section>
      )}
    </div>
  )
}
