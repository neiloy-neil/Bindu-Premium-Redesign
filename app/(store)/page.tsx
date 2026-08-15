import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import PremiumProductCard from "@/components/premium/ProductCard";
import { serialize } from "@/lib/utils";

export const revalidate = 60;

export default async function PremiumHomepage() {
  const [categories, newArrivals, featuredProducts] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, take: 5, orderBy: { sortOrder: 'asc' } }).catch(() => []),
    prisma.product.findMany({ where: { isActive: true }, include: { category: true, images: true, variants: true }, take: 4, orderBy: { createdAt: 'desc' } }).catch(() => []),
    prisma.product.findMany({ where: { isActive: true, isFeatured: true }, include: { category: true, images: true, variants: true }, take: 4, orderBy: { createdAt: 'desc' } }).catch(() => []),
  ]);

  return (
    <div className="w-full bg-bindu-white">
      {/* ── SECTION 1: EDITORIAL HERO ─────────────────────────────────────────── */}
      <section className="relative h-[85vh] min-h-[600px] w-full bg-bindu-light-grey overflow-hidden group">
        <Image
          src="/hero_banner.jpg"
          alt="Premium Campaign Hero"
          fill
          priority
          className="object-cover object-center group-hover:scale-105 transition-transform duration-[20s] ease-linear"
        />
        <div className="absolute inset-0 bg-bindu-navy/20"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 mt-12">
          <h1 className="font-heading text-6xl md:text-8xl lg:text-[120px] font-bold text-bindu-white tracking-tighter uppercase leading-[0.85] mb-6 drop-shadow-sm">
            STYLE,<br/>WITHIN.
          </h1>
          <p className="text-bindu-white font-medium text-xs md:text-sm uppercase tracking-widest max-w-md mb-8 drop-shadow-sm">
            The New Standard of Bangladeshi Premium Menswear.
          </p>
          <Link
            href="/shop"
            className="bg-bindu-white text-bindu-navy text-xs font-bold uppercase tracking-widest px-10 py-4 hover:bg-bindu-navy hover:text-bindu-white transition-colors shadow-lg"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* ── SECTION 2: BRAND STATEMENT ────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-bindu-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="font-heading text-2xl md:text-4xl text-bindu-navy leading-snug font-medium">
            &quot;We don&apos;t just make clothes; we craft confidence. Export quality fabrics, precise fits, and uncompromising attention to detail—designed for the modern man.&quot;
          </p>
          <div className="w-12 h-px bg-bindu-orange mx-auto mt-10"></div>
        </div>
      </section>

      {/* ── SECTION 3: NEW ARRIVALS (Curated) ──────────────────────────────── */}
      <section className="py-20 bg-bindu-light-grey">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
             <div>
               <h2 className="font-heading text-3xl md:text-5xl font-bold text-bindu-navy uppercase tracking-tight">New Arrivals</h2>
               <p className="text-xs uppercase tracking-widest text-bindu-text-muted mt-3">The Latest Drops.</p>
             </div>
             <Link href="/shop" className="hidden md:inline-block border-b border-bindu-navy text-bindu-navy text-xs font-bold uppercase tracking-widest pb-1 hover:text-bindu-orange hover:border-bindu-orange transition-colors">
               View All
             </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8">
            {serialize(newArrivals).map((product: any) => (
              <PremiumProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
             <Link href="/shop" className="inline-block border-b border-bindu-navy text-bindu-navy text-xs font-bold uppercase tracking-widest pb-1">
               View All
             </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: CATEGORY EDITORIAL BLOCKS ───────────────────────────────────── */}
      <section className="py-2 bg-bindu-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
          
          {/* Block 1 */}
          <Link href="/shop?category=panjabi" className="relative h-[60vh] md:h-[80vh] w-full bg-bindu-light-grey group overflow-hidden">
             <Image
                src="/category_panjabi.jpg"
                alt="Panjabi Collection"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[15s] ease-out group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-bindu-navy/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
             <div className="absolute bottom-10 left-10 text-bindu-white">
                <h3 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight mb-2">The Heritage<br/>Edit.</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest border-b border-white pb-1">Shop Panjabi</span>
             </div>
          </Link>

          {/* Block 2 */}
          <Link href="/shop?category=polo" className="relative h-[60vh] md:h-[80vh] w-full bg-bindu-light-grey group overflow-hidden">
             <Image
                src="/category_polo.jpg"
                alt="Polo Collection"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[15s] ease-out group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-bindu-navy/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
             <div className="absolute bottom-10 left-10 text-bindu-white">
                <h3 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight mb-2">Everyday<br/>Excellence.</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest border-b border-white pb-1">Shop Polos</span>
             </div>
          </Link>

        </div>
      </section>

      {/* ── SECTION 5: QUALITY STORY ──────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-bindu-navy text-bindu-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
             <div className="w-full lg:w-1/2">
                <div className="relative aspect-[3/4] w-full max-w-md mx-auto">
                   <Image
                      src="/category_accessories.jpg"
                      alt="Export Quality Details"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                   />
                </div>
             </div>
             <div className="w-full lg:w-1/2 space-y-8">
                <span className="text-[10px] font-bold text-bindu-orange uppercase tracking-widest">Uncompromising Quality</span>
                <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight leading-[0.9]">
                   Crafted Without Compromise.
                </h2>
                <p className="text-bindu-border-grey/80 text-sm md:text-base max-w-lg leading-relaxed">
                   We obsess over every stitch. From sourcing the finest combed organic cotton to engineering the perfect drape, our garments undergo rigorous quality control to ensure they look pristine and feel extraordinary.
                </p>
                <div className="pt-4">
                   <Link href="/quality" className="border border-bindu-white text-bindu-white text-[10px] font-bold uppercase tracking-widest px-8 py-4 hover:bg-bindu-white hover:text-bindu-navy transition-colors">
                      Discover Our Process
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </section>
      
    </div>
  )
}
