import ShopPage, { generateMetadata as shopGenerateMetadata } from "../../shop/page"
import type { Metadata } from "next"
import Image from "next/image"

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<any>
}): Promise<Metadata> {
  const { slug } = await params
  const sp = await searchParams
  // Call the shop's generateMetadata but force the category slug
  const metadata = await shopGenerateMetadata({ searchParams: Promise.resolve({ ...sp, category: slug }) })
  
  // Update the canonical URL for the clean path
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bindupremiumbd.com"
  if (metadata.alternates) {
    metadata.alternates.canonical = `${siteUrl}/category/${slug}`
  }
  
  return metadata
}

function CategoryHero({ slug }: { slug: string }) {
  if (slug === 'panjabi') {
    return (
      <div className="w-full bg-bindu-navy text-bindu-white py-24 md:py-32 px-4 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-heading font-bold uppercase tracking-tight mb-6">Tradition, Refined.</h1>
          <p className="text-[10px] md:text-xs uppercase tracking-widest text-bindu-border-grey max-w-xl mx-auto leading-relaxed">
            Premium fabric. Impeccable fit. Rooted in Bangladesh.
          </p>
        </div>
      </div>
    )
  }
  if (slug === 'polo') {
    return (
      <div className="w-full bg-bindu-light-grey text-bindu-navy py-24 md:py-32 px-4 text-center border-b border-bindu-border-grey">
        <h1 className="text-5xl md:text-7xl font-heading font-bold uppercase tracking-tight mb-6">The Everyday Polo.</h1>
        <p className="text-[10px] md:text-xs uppercase tracking-widest text-bindu-text-muted max-w-xl mx-auto leading-relaxed">
          Engineered for Comfort. 190-200 GSM • 80% Cotton • Premium Fit.
        </p>
      </div>
    )
  }
  if (slug === 'shirts' || slug.startsWith('shirts-')) {
    return (
      <div className="w-full bg-bindu-navy text-bindu-white py-24 md:py-32 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-heading font-bold uppercase tracking-tight mb-6">Smart. Refined. Versatile.</h1>
        <p className="text-[10px] md:text-xs uppercase tracking-widest text-bindu-border-grey max-w-xl mx-auto leading-relaxed">
          Office to Weekend Essentials. Masterfully Constructed.
        </p>
      </div>
    )
  }
  if (slug === 't-shirts') {
    return (
      <div className="w-full bg-bindu-light-grey text-bindu-navy py-24 md:py-32 px-4 text-center border-b border-bindu-border-grey">
        <h1 className="text-5xl md:text-7xl font-heading font-bold uppercase tracking-tight mb-6">Premium Comfort.</h1>
        <p className="text-[10px] md:text-xs uppercase tracking-widest text-bindu-text-muted max-w-xl mx-auto leading-relaxed">
          The Foundation of Every Wardrobe. Soft, Durable, Timeless.
        </p>
      </div>
    )
  }
  return null;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<any>
}) {
  const { slug } = await params
  const sp = await searchParams
  
  return (
    <div className="flex flex-col min-h-screen bg-bindu-white w-full">
      <CategoryHero slug={slug} />
      {/* Render the shop page but force the category parameter */}
      <ShopPage searchParams={Promise.resolve({ ...sp, category: slug })} />
    </div>
  )
}
