import Link from "next/link"
import { ChevronRight } from "lucide-react"

type Crumb = { label: string; href: string }

export default function PageHeader({
  breadcrumbs = [],
  title,
  description,
  actions,
}: {
  breadcrumbs?: Crumb[]
  title?: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6">
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground mb-2">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              <Link href={crumb.href} className="hover:text-foreground transition-colors truncate max-w-[200px]">
                {crumb.label}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            </span>
          ))}
        </nav>
      )}
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4">
          {title && (
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              {description && <p className="text-muted-foreground text-sm mt-1">{description}</p>}
            </div>
          )}
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
    </div>
  )
}
