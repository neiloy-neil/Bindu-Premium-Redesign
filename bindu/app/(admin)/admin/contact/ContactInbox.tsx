"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Mail, MailOpen, Check } from "lucide-react"

type Message = {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  isRead: boolean
  isReplied: boolean
  createdAt: string | Date
}

export default function ContactInbox({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages)
  const [selected, setSelected] = useState<Message | null>(null)

  const unread = messages.filter((m) => !m.isRead).length

  async function markRead(id: string) {
    await fetch(`/api/admin/contact/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isRead: true }) })
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)))
    setSelected((s) => (s?.id === id ? { ...s, isRead: true } : s))
  }

  async function markReplied(id: string) {
    await fetch(`/api/admin/contact/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isReplied: true, isRead: true }) })
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isReplied: true, isRead: true } : m)))
    setSelected((s) => (s?.id === id ? { ...s, isReplied: true, isRead: true } : s))
    toast.success("Marked as replied")
  }

  function openMessage(msg: Message) {
    setSelected(msg)
    if (!msg.isRead) markRead(msg.id)
  }

  return (
    <div className="bg-white border rounded-lg overflow-hidden flex" style={{ minHeight: 500 }}>
      {/* List */}
      <div className="w-80 border-r flex flex-col shrink-0">
        <div className="px-4 py-3 border-b bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Messages</span>
          {unread > 0 && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unread} new</span>
          )}
        </div>
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">No messages yet</div>
        ) : (
          <ul className="flex-1 overflow-y-auto divide-y">
            {messages.map((msg) => (
              <li
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${selected?.id === msg.id ? "bg-blue-50 border-l-2 border-blue-500" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {!msg.isRead ? <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" /> : <MailOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                    <span className={`text-sm truncate ${!msg.isRead ? "font-semibold" : "text-muted-foreground"}`}>{msg.name}</span>
                  </div>
                  {msg.isReplied && <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.subject || msg.message.substring(0, 50)}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{new Date(msg.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Detail pane */}
      {selected ? (
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold">{selected.subject || "(No subject)"}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                From <a href={`mailto:${selected.email}`} className="text-blue-600 hover:underline">{selected.name} &lt;{selected.email}&gt;</a>
                {" · "}
                {new Date(selected.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "Your message")}`}
                className="px-3 py-1.5 rounded border text-xs font-medium hover:bg-slate-50 transition-colors"
              >
                Reply via Email ↗
              </a>
              {!selected.isReplied && (
                <button
                  onClick={() => markReplied(selected.id)}
                  className="px-3 py-1.5 rounded bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors"
                >
                  Mark Replied
                </button>
              )}
              {selected.isReplied && (
                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <Check className="w-3.5 h-3.5" /> Replied
                </span>
              )}
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-5 text-sm leading-relaxed whitespace-pre-wrap">
            {selected.message}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Select a message to read it
        </div>
      )}
    </div>
  )
}
