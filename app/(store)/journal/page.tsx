import { ArticleCard } from "@/components/premium/ArticleCard"

export const metadata = {
  title: "Journal | Bindu Premium",
  description: "Editorial insights, style guides, and brand news from Bindu Premium.",
}

const articles = [
  {
    title: "The Architecture of the Perfect Polo",
    slug: "architecture-perfect-polo",
    excerpt: "We dissect the engineering behind our Signature Pique Polo, from the structured collar to the drape of the hem.",
    date: "Aug 15, 2026",
    category: "Design",
    image: "https://images.unsplash.com/photo-1596704017366-2679c65600c3?q=80&w=2940&auto=format&fit=crop",
    featured: true
  },
  {
    title: "Sourcing Premium Cotton",
    slug: "sourcing-premium-cotton",
    excerpt: "Why fabric is the foundation of everything we build, and how we select the perfect weight for our staples.",
    date: "Aug 02, 2026",
    category: "Process",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2872&auto=format&fit=crop"
  },
  {
    title: "Building Collection 01",
    slug: "building-collection-01",
    excerpt: "A behind-the-scenes look at the development of our inaugural drop.",
    date: "Jul 18, 2026",
    category: "Behind the Scenes",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2940&auto=format&fit=crop"
  },
  {
    title: "The Essential Fall Layers",
    slug: "essential-fall-layers",
    excerpt: "Transitional styling for the unpredictable weather of the changing seasons.",
    date: "Jun 24, 2026",
    category: "Style",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2940&auto=format&fit=crop"
  }
]

export default function JournalPage() {
  const featuredArticle = articles.find(a => a.featured)
  const gridArticles = articles.filter(a => !a.featured)

  return (
    <div className="bg-bindu-white pb-32">
      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
          The Journal
        </h1>
        <p className="text-bindu-text-muted text-lg tracking-widest uppercase text-xs font-bold">
          Style, Process, and Perspective
        </p>
      </section>

      {/* Featured Article */}
      <section className="px-4 max-w-7xl mx-auto mb-16">
        {featuredArticle && <ArticleCard {...featuredArticle} />}
      </section>

      {/* Article Grid */}
      <section className="px-4 max-w-7xl mx-auto">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-navy mb-8 border-b border-bindu-border-grey pb-4">
          Latest Stories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridArticles.map(article => (
            <ArticleCard key={article.slug} {...article} />
          ))}
        </div>
      </section>
    </div>
  )
}
