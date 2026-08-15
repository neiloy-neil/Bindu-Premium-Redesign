import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface ArticleCardProps {
  title: string
  slug: string
  excerpt: string
  date: string
  category: string
  image: string
  featured?: boolean
}

export function ArticleCard({ title, slug, excerpt, date, category, image, featured = false }: ArticleCardProps) {
  if (featured) {
    return (
      <Link href={`/journal/${slug}`} className="group block mb-16">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center">
          <div className="w-full md:w-3/5 relative aspect-video overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
          <div className="w-full md:w-2/5 space-y-6 pr-4">
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em]">
              <span className="text-bindu-orange">{category}</span>
              <span className="text-bindu-border-grey">|</span>
              <span className="text-bindu-text-muted">{date}</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-bindu-navy uppercase tracking-tight group-hover:text-bindu-orange transition-colors duration-300">
              {title}
            </h2>
            <p className="text-bindu-text-muted leading-relaxed text-lg">
              {excerpt}
            </p>
            <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-bindu-navy">
              Read Article
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/journal/${slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden mb-6">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-1000"
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
          <span className="text-bindu-orange">{category}</span>
          <span className="text-bindu-border-grey">|</span>
          <span className="text-bindu-text-muted">{date}</span>
        </div>
        <h3 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight group-hover:text-bindu-orange transition-colors duration-300">
          {title}
        </h3>
        <p className="text-bindu-text-muted line-clamp-2">
          {excerpt}
        </p>
      </div>
    </Link>
  )
}
