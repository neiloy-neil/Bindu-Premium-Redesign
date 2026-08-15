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

      {/* Brand Statement moved down to section 6 as per prompt */}

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

      {/* ── SECTION 4: FEATURED COLLECTION (The Eid Edit) ────────────────────────── */}
      <section className="py-24 md:py-32 bg-bindu-navy text-bindu-white relative overflow-hidden group">
        <Image
          src="/collection_eid.jpg"
          alt="The Eid Edit"
          fill
          sizes="100vw"
          className="object-cover object-top opacity-50 group-hover:scale-105 transition-transform duration-[20s] ease-linear"
        />
        <div className="absolute inset-0 bg-bindu-navy/40"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
           <h2 className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-tight mb-4 drop-shadow-md">THE EID EDIT</h2>
           <p className="text-bindu-white/90 text-sm md:text-base max-w-md mx-auto mb-10 drop-shadow-sm">A modern expression of Bangladeshi tradition.</p>
           <Link href="/collections/eid" className="inline-block bg-bindu-white text-bindu-navy text-xs font-bold uppercase tracking-widest px-10 py-4 hover:bg-bindu-orange hover:text-bindu-white transition-colors shadow-lg">
             Explore Collection
           </Link>
        </div>
      </section>

      {/* ── SECTION 5: BEST SELLERS ────────────────────────────────────────── */}
      <section className="py-20 bg-bindu-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
             <div>
               <h2 className="font-heading text-3xl md:text-5xl font-bold text-bindu-navy uppercase tracking-tight">Best Sellers</h2>
             </div>
             <Link href="/best-sellers" className="hidden md:inline-block border-b border-bindu-navy text-bindu-navy text-xs font-bold uppercase tracking-widest pb-1 hover:text-bindu-orange hover:border-bindu-orange transition-colors">
               Shop Best Sellers
             </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8">
            {serialize(featuredProducts).map((product: any) => (
              <PremiumProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
             <Link href="/best-sellers" className="inline-block border-b border-bindu-navy text-bindu-navy text-xs font-bold uppercase tracking-widest pb-1">
               Shop Best Sellers
             </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: BRAND STORY (Dark Section) ─────────────────────────── */}
      <section className="py-32 md:py-48 bg-bindu-navy text-bindu-white text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-heading text-3xl md:text-5xl font-bold leading-snug tracking-tight mb-8">
            &quot;WE BELIEVE MEN&apos;S STYLE SHOULD FEEL EFFORTLESS.&quot;
          </h2>
          <p className="text-bindu-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Bindu Premium represents the convergence of Bangladeshi heritage and contemporary menswear. We don&apos;t just make clothes; we craft confidence. Export quality fabrics, precise fits, and uncompromising attention to detail—designed for the modern man.
          </p>
          <div className="w-12 h-px bg-bindu-orange mx-auto mt-12"></div>
        </div>
      </section>

      {/* ── SECTION 7: QUALITY / FABRIC STORY ─────────────────────────────── */}
      <section className="py-24 bg-bindu-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 relative aspect-[4/3] w-full bg-bindu-light-grey overflow-hidden group">
               <Image
                 src="/fabric-macro.jpg"
                 alt="Fabric Macro Detail"
                 fill
                 sizes="(max-width: 1024px) 100vw, 66vw"
                 className="object-cover group-hover:scale-105 transition-transform duration-[15s]"
               />
             </div>
             <div className="flex flex-col justify-center space-y-8 lg:px-8">
                <span className="text-[10px] font-bold text-bindu-orange uppercase tracking-widest">Uncompromising Quality</span>
                <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight leading-[0.9] text-bindu-navy">
                   Crafted Without Compromise.
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-bindu-navy mb-2">Fabric</h3>
                    <p className="text-bindu-text-muted text-sm leading-relaxed">Sourcing only the finest combed organic cotton and premium blends for maximum breathability and drape.</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-bindu-navy mb-2">Detail</h3>
                    <p className="text-bindu-text-muted text-sm leading-relaxed">Rigorous stitching, reinforced collars, and carefully selected buttons ensure longevity.</p>
                  </div>
                </div>
                <div className="pt-4">
                   <Link href="/quality" className="inline-block border border-bindu-navy text-bindu-navy text-[10px] font-bold uppercase tracking-widest px-8 py-4 hover:bg-bindu-navy hover:text-bindu-white transition-colors">
                      Discover Our Process
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: LOOKBOOK ────────────────────────────────────────────── */}
      <section className="py-24 bg-bindu-light-grey">
        <div className="container mx-auto px-4 lg:px-8 text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-bindu-navy uppercase tracking-tight mb-4">THE BINDU EDIT</h2>
          <Link href="/lookbook" className="inline-block border-b border-bindu-navy text-bindu-navy text-xs font-bold uppercase tracking-widest pb-1 hover:text-bindu-orange hover:border-bindu-orange transition-colors">
            View Lookbook
          </Link>
        </div>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden group bg-bindu-white">
              <Image src="/lookbook-1.jpg" alt="Lookbook 1" fill className="object-cover group-hover:scale-105 transition-transform duration-[15s]" />
              <div className="absolute inset-0 bg-bindu-navy/10 group-hover:bg-transparent transition-colors"></div>
              <Link href="/shop" className="absolute bottom-6 left-6 bg-white/90 backdrop-blur text-bindu-navy text-[10px] font-bold uppercase tracking-widest px-6 py-3 hover:bg-bindu-navy hover:text-bindu-white transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">Shop The Look</Link>
            </div>
            <div className="relative aspect-[3/4] overflow-hidden group bg-bindu-white hidden md:block">
              <Image src="/lookbook-2.jpg" alt="Lookbook 2" fill className="object-cover group-hover:scale-105 transition-transform duration-[15s]" />
              <div className="absolute inset-0 bg-bindu-navy/10 group-hover:bg-transparent transition-colors"></div>
              <Link href="/shop" className="absolute bottom-6 left-6 bg-white/90 backdrop-blur text-bindu-navy text-[10px] font-bold uppercase tracking-widest px-6 py-3 hover:bg-bindu-navy hover:text-bindu-white transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">Shop The Look</Link>
            </div>
            <div className="relative aspect-[3/4] overflow-hidden group bg-bindu-white hidden lg:block">
              <Image src="/lookbook-3.jpg" alt="Lookbook 3" fill className="object-cover group-hover:scale-105 transition-transform duration-[15s]" />
              <div className="absolute inset-0 bg-bindu-navy/10 group-hover:bg-transparent transition-colors"></div>
              <Link href="/shop" className="absolute bottom-6 left-6 bg-white/90 backdrop-blur text-bindu-navy text-[10px] font-bold uppercase tracking-widest px-6 py-3 hover:bg-bindu-navy hover:text-bindu-white transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">Shop The Look</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 9: MEMBERSHIP ─────────────────────────────────────────── */}
      <section className="py-24 bg-bindu-navy text-bindu-white relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[150%] bg-gradient-to-l from-white/5 to-transparent skew-x-12 hidden lg:block"></div>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="w-full lg:w-1/2 space-y-8 relative z-10">
              <h2 className="font-heading text-5xl md:text-6xl font-bold uppercase tracking-tight leading-[0.9]">
                WELCOME TO BINDU.
              </h2>
              <p className="text-bindu-white/80 text-sm md:text-base max-w-md leading-relaxed">
                Unlock exclusive privileges. Spend ৳6,000+ to qualify for Bindu Membership and enjoy up to 10% discount on future purchases, early access to collections, and private offers.
              </p>
              <Link href="/membership" className="inline-block bg-bindu-white text-bindu-navy text-[10px] font-bold uppercase tracking-widest px-10 py-4 hover:bg-bindu-orange hover:text-bindu-white transition-colors">
                Discover Membership
              </Link>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative z-10">
              <div className="relative w-full max-w-sm aspect-[1.586/1] rounded-xl bg-gradient-to-br from-gray-800 to-black p-1 shadow-2xl overflow-hidden border border-gray-700">
                 <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                 <div className="h-full w-full bg-gradient-to-br from-gray-900 to-black rounded-lg p-6 flex flex-col justify-between relative z-10">
                    <div className="flex justify-between items-start">
                       <span className="font-heading text-lg font-bold uppercase tracking-[0.2em] text-white/90">Bindu</span>
                       <span className="text-[10px] text-white/50 uppercase tracking-widest">Premium</span>
                    </div>
                    <div className="flex justify-between items-end">
                       <span className="font-mono text-sm text-white/60 tracking-widest">**** **** **** 8923</span>
                       <span className="text-xs text-white/80 uppercase tracking-wider">Member</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 10: STORES ─────────────────────────────────────────────── */}
      <section className="py-24 bg-bindu-white">
        <div className="container mx-auto px-4 lg:px-8">
           <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-1/2 relative aspect-video bg-bindu-light-grey overflow-hidden group">
                 <Image src="/store-dhaka.jpg" alt="Bindu Store" fill className="object-cover group-hover:scale-105 transition-transform duration-[20s]" />
              </div>
              <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 lg:px-12 space-y-6">
                 <h2 className="font-heading text-4xl md:text-5xl font-bold text-bindu-navy uppercase tracking-tight">VISIT BINDU</h2>
                 <p className="text-bindu-text-muted text-sm md:text-base leading-relaxed max-w-md">
                   Experience our collections in person. Find your nearest store for personalized styling and exclusive in-store releases.
                 </p>
                 <div className="pt-4">
                   <Link href="/stores" className="inline-block border-b border-bindu-navy text-bindu-navy text-xs font-bold uppercase tracking-widest pb-1 hover:text-bindu-orange hover:border-bindu-orange transition-colors">
                     Explore Stores
                   </Link>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* ── SECTION 11: JOURNAL ────────────────────────────────────────────── */}
      <section className="py-24 bg-bindu-light-grey">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-bindu-navy uppercase tracking-tight mb-4">THE JOURNAL</h2>
            <Link href="/journal" className="inline-block border-b border-bindu-navy text-bindu-navy text-xs font-bold uppercase tracking-widest pb-1 hover:text-bindu-orange hover:border-bindu-orange transition-colors">
              Read All Articles
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "The Modern Panjabi", category: "Men's Style", date: "Aug 12, 2026", img: "/journal-1.jpg" },
              { title: "Crafting the Perfect Polo", category: "Fabric", date: "Jul 28, 2026", img: "/journal-2.jpg" },
              { title: "Dhaka: A Style Evolution", category: "Culture", date: "Jul 15, 2026", img: "/journal-3.jpg" },
            ].map((article, i) => (
              <Link href="/journal" key={i} className="group block">
                <div className="relative aspect-[4/3] mb-6 overflow-hidden bg-bindu-white">
                  <Image src={article.img} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-[15s]" />
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-bindu-text-muted mb-3">
                  <span>{article.category}</span>
                  <span className="w-1 h-1 rounded-full bg-bindu-border-grey"></span>
                  <span>{article.date}</span>
                </div>
                <h3 className="font-heading text-xl md:text-2xl font-medium text-bindu-navy group-hover:text-bindu-orange transition-colors">
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 12: NEWSLETTER ─────────────────────────────────────────── */}
      <section className="py-24 bg-bindu-white border-t border-bindu-border-grey">
        <div className="container mx-auto px-4 max-w-2xl text-center">
           <h2 className="font-heading text-3xl md:text-4xl font-bold text-bindu-navy uppercase tracking-tight mb-6">STAY IN THE LOOP.</h2>
           <p className="text-bindu-text-muted text-sm md:text-base mb-8">
             New collections. Stories. Private offers.
           </p>
           <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
             <input 
               type="email" 
               placeholder="Enter your email" 
               className="flex-1 border-b border-bindu-border-grey focus:border-bindu-navy outline-none px-0 py-3 text-sm bg-transparent placeholder:text-bindu-text-muted/60 transition-colors"
               required
             />
             <button type="submit" className="bg-bindu-navy text-bindu-white text-[10px] font-bold uppercase tracking-widest px-8 py-3 hover:bg-bindu-orange transition-colors whitespace-nowrap">
               Subscribe
             </button>
           </form>
        </div>
      </section>
      
    </div>
  )
}
