import Link from "next/link"
import { cn } from "@/lib/utils"

export type FilterTab = {
  label: string
  value: string
  href: string
  count?: number
}

export function FilterTabs({
  tabs,
  activeValue,
}: {
  tabs: FilterTab[]
  activeValue: string
}) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
      {tabs.map((tab) => {
        const isActive = tab.value === activeValue
        return (
          <Link
            key={tab.value}
            href={tab.href}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "rounded-full text-xs px-1.5 min-w-[20px] text-center tabular-nums font-medium",
                  isActive
                    ? "bg-background/20 text-background"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {tab.count}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
