import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, Share2 } from "lucide-react"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Article | Bindu Premium Journal",
  description: "Editorial article from Bindu Premium.",
}

const DUMMY_ARTICLE = {
  title: "The Architecture of the Perfect Polo",
  date: "August 15, 2026",
  category: "Design",
  readTime: "4 min read",
  image: "https://images.unsplash.com/photo-1596704017366-2679c65600c3?q=80&w=2940&auto=format&fit=crop",
  content: `
    <p>A polo shirt is a deceptively simple garment. It sits at the precise intersection of formal and casual, requiring a delicate balance of structure and drape to execute correctly. For our Signature Pique Polo, we didn't want to just make another basic; we wanted to engineer the perfect hybrid.</p>
    
    <h3>The Fabric Foundation</h3>
    <p>The journey began with the fabric. Traditional polos often use heavy, coarse pique that loses its shape and softness after a few washes. We spent six months sourcing a custom-milled 100% Pima cotton pique. It’s Mercerized to increase strength, reduce shrinkage, and impart a subtle, silk-like luster that elevates the entire garment.</p>
    
    <h3>The Collar: Structured Elegance</h3>
    <p>The most common failure point of a polo is the collar. We engineered a proprietary interlining that provides the rigidity of a dress shirt collar while maintaining the soft hand-feel necessary for everyday comfort. It stands up under a blazer but folds naturally when worn casually.</p>
    
    <h3>The Modern Fit</h3>
    <p>Fit is paramount. We eliminated the boxy, oversized cut of the 90s in favor of a modern, tailored silhouette. Higher armholes for mobility, a tapered waist to reduce billowing, and a hem length calibrated perfectly to be worn tucked or untucked.</p>
    
    <p>This is what we mean by "Wear The Arc". It's not just a tagline; it's a commitment to elevating the essentials through obsessive design.</p>
  `,
  relatedProducts: [
    { name: "Signature Pique Polo - Navy", price: 1250, slug: "signature-pique-polo-navy", image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=2070&auto=format&fit=crop" }
  ]
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  if (!slug) {
    notFound()
  }

  // In a real app, fetch article by slug from CMS here
  const article = DUMMY_ARTICLE

  return (
    <div className="bg-bindu-white pb-32">
      
      {/* Back Link */}
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-8">
        <Link href="/journal" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-bindu-text-muted hover:text-bindu-orange transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Journal
        </Link>
      </div>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 mb-12 text-center">
        <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.2em] mb-6">
          <span className="text-bindu-orange">{article.category}</span>
          <span className="text-bindu-border-grey">|</span>
          <span className="text-bindu-text-muted flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-8">
          {article.title}
        </h1>
        <p className="text-bindu-text-muted text-sm font-bold uppercase tracking-widest">
          Published {article.date}
        </p>
      </header>

      {/* Hero Image */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-16">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4">
        {/* Prose styling for the HTML content */}
        <div 
          className="prose prose-lg prose-neutral max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-bindu-navy prose-p:text-bindu-text-muted prose-p:leading-relaxed prose-a:text-bindu-orange hover:prose-a:text-bindu-navy"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Share & Divider */}
        <div className="mt-16 pt-8 border-t border-bindu-border-grey flex items-center justify-between">
          <div className="text-sm font-bold uppercase tracking-widest text-bindu-navy">Share Article</div>
          <button className="w-10 h-10 rounded-full border border-bindu-border-grey flex items-center justify-center text-bindu-navy hover:border-bindu-navy transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Shop The Story */}
        {article.relatedProducts.length > 0 && (
          <div className="mt-24 p-8 bg-bindu-light-grey">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-navy mb-8 border-b border-bindu-border-grey pb-4">
              Shop The Story
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {article.relatedProducts.map(product => (
                <Link key={product.slug} href={`/shop/${product.slug}`} className="group flex items-center gap-6">
                  <div className="relative w-24 h-32 overflow-hidden bg-white">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-bindu-navy mb-1 group-hover:text-bindu-orange transition-colors">{product.name}</h4>
                    <p className="text-bindu-text-muted text-sm">৳{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
