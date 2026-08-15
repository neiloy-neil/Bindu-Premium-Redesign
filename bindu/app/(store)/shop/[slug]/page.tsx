import prisma from "@/lib/prisma"
import { serialize } from "@/lib/utils"
import { notFound } from "next/navigation"
import { cache } from "react"
import { unstable_cache } from "next/cache"
import ProductGallery from "@/components/store/ProductGallery"
import VariantSelector from "@/components/store/VariantSelector"
import PremiumProductCard from "@/components/premium/ProductCard"
import ReviewSection from "@/components/store/ReviewSection"
import FlashSaleCountdown from "@/components/store/FlashSaleCountdown"
import SocialProof from "@/components/store/SocialProof"
import ProductAddons from "@/components/store/ProductAddons"
import ReviewMediaGallery from "@/components/store/ReviewMediaGallery"
import ProductQA from "@/components/store/ProductQA"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Truck, RefreshCw, ShieldCheck } from "lucide-react"
import type { Metadata } from "next"
import { getActiveFlashSale, applyFlashSaleDiscount } from "@/lib/flashSale"
import Link from "next/link"
import { RecentlyViewedTracker } from "@/components/store/RecentlyViewedTracker"
import { RecentlyViewed } from "@/components/store/RecentlyViewed"
import FrequentlyBoughtTogether from "@/components/store/FrequentlyBoughtTogether"
import ViewContentTracker from "@/components/store/ViewContentTracker"
import DeliveryEstimate from "@/components/store/DeliveryEstimate"
import ViewingCounter from "@/components/store/ViewingCounter"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bindupremiumbd.com"

// Cross-request cache (Next.js Data Cache, 60s TTL)
const _fetchProduct = unstable_cache(
  async (slug: string) =>
    prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: { orderBy: { sku: "asc" } },
        brand: true,
        addons: { orderBy: { sortOrder: "asc" } },
      },
    }).catch(() => null),
  ["product-detail"],
  { revalidate: 60 }
)

// Request-level deduplication — metadata + page share one DB call per request
const getProductBySlug = cache(_fetchProduct)

// Cache reviews, flash sale, and related products per product (60s TTL)
const getCachedProductPageData = unstable_cache(
  async (productId: string, categoryId: string) => {
    const [reviewAgg, flashSale, attrConfig, reviews, qas, relatedProducts] = await Promise.all([
      prisma.review.aggregate({
        where: { productId, isApproved: true },
        _avg: { rating: true },
        _count: { rating: true },
      }).catch(() => ({ _avg: { rating: 0 }, _count: { rating: 0 } })),
      getActiveFlashSale(productId, categoryId).catch(() => null),
      prisma.categoryAttributeConfig.findUnique({ where: { categoryId } }).catch(() => null),
      prisma.review.findMany({
        where: { productId, isApproved: true },
        include: { media: true, user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      }).catch(() => []),
      prisma.reviewQA.findMany({
        where: { productId },
        orderBy: { createdAt: "desc" },
      }).catch(() => []),
      prisma.product.findMany({
        where: { categoryId, id: { not: productId }, isActive: true },
        take: 4,
        include: { category: true, images: true, variants: true },
      }).catch(() => []),
    ])
    return { reviewAgg, flashSale, attrConfig, reviews, qas, relatedProducts }
  },
  ["product-page-data"],
  { revalidate: 60 }
)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) return { title: "Product Not Found" }

  const image = (product as any).ogImage || product.images[0]?.url
  const title = (product as any).metaTitle || `${product.name} | Bindu Premium Bangladesh`
  const description = (product as any).metaDescription || product.description?.slice(0, 160) || `Shop ${product.name} at Bindu Premium. Premium graphic tees, fast delivery across Bangladesh.`

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/shop/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/shop/${slug}`,
      images: image ? [{ url: image, width: 800, height: 1000, alt: product.name }] : [],
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const [{ reviewAgg, flashSale, attrConfig, reviews, qas, relatedProducts }, episodeMembership] =
    await Promise.all([
      getCachedProductPageData(product.id, product.categoryId),
      prisma.episodeProduct.findFirst({
        where: { productId: product.id },
        include: { episode: { select: { name: true, slug: true, number: true, isPublished: true } } },
      }).catch(() => null),
    ])

  const salePrice = flashSale ? applyFlashSaleDiscount(Number(product.price), flashSale) : null
  const displayPrice = salePrice ?? Number(product.price)

  // Compute true price range from variant prices (fall back to product price)
  const variantPrices = product.variants.map((v) => Number(v.price ?? product.price))
  const minVariantPrice = variantPrices.length ? Math.min(...variantPrices) : Number(product.price)
  const maxVariantPrice = variantPrices.length ? Math.max(...variantPrices) : Number(product.price)

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || "",
    image: product.images.map((i) => i.url),
    sku: product.variants[0]?.sku || product.id,
    brand: { "@type": "Brand", name: product.brand?.name || "Bindu Premium" },
    ...(reviewAgg._count.rating > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (reviewAgg._avg.rating || 0).toFixed(1),
        reviewCount: reviewAgg._count.rating,
        bestRating: 5,
        worstRating: 1,
      },
      review: reviews.slice(0, 5).map((r) => ({
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
        author: { "@type": "Person", name: r.user?.name || "Verified Buyer" },
        reviewBody: r.comment || "",
        datePublished: r.createdAt.toISOString().split("T")[0],
      })),
    }),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BDT",
      lowPrice: minVariantPrice,
      highPrice: maxVariantPrice,
      offerCount: product.variants.length,
      availability: product.variants.some((v) => v.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Bindu Premium" },
      url: `${SITE_URL}/shop/${product.slug}`,
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
      ...(product.category ? [{ "@type": "ListItem", position: 3, name: product.category.name, item: `${SITE_URL}/category/${product.category.slug}` }] : []),
      { "@type": "ListItem", position: product.category ? 4 : 3, name: product.name, item: `${SITE_URL}/shop/${product.slug}` },
    ],
  }

  return (
    <div className="bg-bindu-light-grey animate-in fade-in duration-500">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Breadcrumb */}
      <div className="bg-bindu-white border-b border-bindu-border-grey">
        <div className="container mx-auto px-4 lg:px-8 py-3 text-[11px] uppercase tracking-widest text-bindu-text-muted flex items-center gap-2">
          <a href="/" className="hover:text-bindu-orange transition-colors">Home</a>
          <span>/</span>
          <a href="/shop" className="hover:text-bindu-orange transition-colors">Shop</a>
          {product.category && (
            <>
              <span>/</span>
              <a href={`/category/${product.category.slug}`} className="hover:text-bindu-orange transition-colors">{product.category.name}</a>
            </>
          )}
          <span>/</span>
          <span className="text-bindu-text-dark font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

          {/* Image Gallery */}
          <div className="w-full lg:w-3/5">
            <ProductGallery images={serialize(product.images)} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-2/5 flex flex-col lg:sticky lg:top-20 lg:h-max">

            {/* Category / Brand tags */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {product.category && (
                <a href={`/category/${product.category.slug}`} className="text-[10px] tracking-widest uppercase font-bold text-bindu-orange bg-bindu-orange/10 px-3 py-1.5 rounded hover:bg-bindu-orange/20 transition-colors">
                  {product.category.name}
                </a>
              )}
              {product.brand && (
                <Link href={`/brands/${product.brand.slug}`} className="text-[10px] tracking-widest uppercase font-bold text-bindu-text-muted border border-bindu-border-grey px-3 py-1.5 rounded hover:border-bindu-navy hover:text-bindu-navy transition-colors">
                  {product.brand.name}
                </Link>
              )}
              {episodeMembership?.episode?.isPublished && (
                <Link
                  href={`/episode/${episodeMembership.episode.slug}`}
                  className="text-[10px] tracking-widest uppercase font-bold text-bindu-text-muted border border-bindu-border-grey px-3 py-1.5 rounded hover:border-bindu-orange hover:text-bindu-orange transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-bindu-orange" />
                  Ep.{episodeMembership.episode.number} — {episodeMembership.episode.name}
                </Link>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-heading font-black text-bindu-navy mb-2 leading-tight tracking-tight">{product.name}</h1>
            <ViewingCounter productId={product.id} />

            {/* Rating */}
            {reviewAgg._count.rating > 0 && (
              <div className="flex items-center gap-2 mt-2 mb-4 text-sm text-bindu-text-muted">
                <div className="flex text-bindu-orange">
                  {[1,2,3,4,5].map(n => (
                    <svg key={n} className={`w-4 h-4 ${n <= Math.round(reviewAgg._avg.rating || 0) ? "fill-current" : "fill-none stroke-current"}`} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  ))}
                </div>
                <span className="font-bold text-bindu-navy">{(reviewAgg._avg.rating || 0).toFixed(1)}</span>
                <span>({reviewAgg._count.rating} review{reviewAgg._count.rating === 1 ? "" : "s"})</span>
              </div>
            )}

            {/* Flash sale banner */}
            {flashSale && (
              <div className="mt-2 mb-4">
                <FlashSaleCountdown
                  saleName={flashSale.name}
                  discountLabel={flashSale.discountType === "PERCENTAGE"
                    ? `${flashSale.discountValue}% off`
                    : `৳${flashSale.discountValue} off`}
                  endsAt={new Date(flashSale.endsAt).toISOString()}
                />
              </div>
            )}

            {/* Social proof */}
            <SocialProof productId={product.id} />

            {/* Variant selectors + add to cart */}
            <div className="bg-bindu-white rounded-2xl border border-bindu-border-grey p-6 mt-4">
              <VariantSelector
                product={serialize(product)}
                attr1Label={attrConfig?.attr1Label || "Size"}
                attr2Label={attrConfig?.attr2Label || "Color"}
                categoryId={product.categoryId}
                basePrice={Number(product.price)}
                comparePrice={product.comparePrice ? Number(product.comparePrice) : null}
                flashSale={flashSale ? serialize(flashSale) : null}
                releaseAt={product.releaseAt ? new Date(product.releaseAt).toISOString() : null}
              />
            </div>

            {/* Product Add-ons */}
            {product.addons.length > 0 && (
              <div className="mt-4">
                <ProductAddons addons={serialize(product.addons)} productId={product.id} />
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-6 text-center">
              {[
                { icon: Truck, label: "Fast Delivery" },
                { icon: RefreshCw, label: "7-Day Returns" },
                { icon: ShieldCheck, label: "Secure Pay" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 bg-bindu-white rounded-xl border border-bindu-border-grey p-3">
                  <Icon className="w-5 h-5 text-bindu-orange" strokeWidth={2} />
                  <span className="text-[10px] font-bold uppercase tracking-wide text-bindu-text-muted">{label}</span>
                </div>
              ))}
            </div>

            {/* Accordion info */}
            <div className="mt-8 bg-bindu-white rounded-2xl border border-bindu-border-grey overflow-hidden">
              <Accordion defaultValue={["details"]} className="w-full">

                <AccordionItem value="details" className="border-bindu-border-grey">
                  <AccordionTrigger className="px-6 text-sm font-bold uppercase tracking-wider text-bindu-navy hover:text-bindu-orange hover:no-underline">Details</AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="prose prose-sm max-w-none text-bindu-text-muted" dangerouslySetInnerHTML={{ __html: product.description || "No description provided." }} />
                    {product.tags && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {product.tags.split(',').map((tag: string) => (
                          <span key={tag.trim()} className="px-3 py-1 bg-bindu-light-grey text-xs text-bindu-text-muted border border-bindu-border-grey rounded-full">{tag.trim()}</span>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="delivery" className="border-bindu-border-grey">
                  <AccordionTrigger className="px-6 text-sm font-bold uppercase tracking-wider text-bindu-navy hover:text-bindu-orange hover:no-underline">Delivery & Returns</AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 space-y-4 text-sm text-bindu-text-muted">
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-bindu-orange shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-bindu-navy">Standard Delivery</p>
                        <p>Free on orders above ৳1000.</p>
                        <DeliveryEstimate />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <RefreshCw className="w-5 h-5 text-bindu-orange shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-bindu-navy">Hassle-Free Returns</p>
                        <p>Return any unworn item within 7 days of delivery.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-bindu-orange shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-bindu-navy">Secure Checkout</p>
                        <p>We accept bKash, Nagad, and Cash on Delivery.</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="reviews" className="border-bindu-border-grey">
                  <AccordionTrigger className="px-6 text-sm font-bold uppercase tracking-wider text-bindu-navy hover:text-bindu-orange hover:no-underline">
                    Reviews {reviewAgg._count.rating > 0 && `(${reviewAgg._count.rating})`}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <ReviewMediaGallery reviews={serialize(reviews)} />
                    <ReviewSection productId={product.id} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="qa" className="border-bindu-border-grey">
                  <AccordionTrigger className="px-6 text-sm font-bold uppercase tracking-wider text-bindu-navy hover:text-bindu-orange hover:no-underline">
                    Questions & Answers {qas.length > 0 && `(${qas.length})`}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <ProductQA productId={product.id} qas={serialize(qas)} />
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </div>

          </div>
        </div>

        {/* Frequently Bought Together */}
        <FrequentlyBoughtTogether productId={product.id} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 md:mt-28">
            <div className="text-center mb-10">
              <span className="text-bindu-orange font-bold tracking-widest text-xs uppercase block mb-2">You May Also Like</span>
              <h2 className="text-2xl md:text-3xl font-heading font-black text-bindu-navy">Complete The Look</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {serialize(relatedProducts).map((p: any) => <PremiumProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        <RecentlyViewed currentProductId={product.id} />
      </div>

      <ViewContentTracker product={{
        id: product.id,
        name: product.name,
        price: displayPrice,
        category: product.category?.name,
        sku: product.variants[0]?.sku,
      }} />
      <RecentlyViewedTracker product={{
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0]?.url || "",
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
      }} />
    </div>
  )
}
