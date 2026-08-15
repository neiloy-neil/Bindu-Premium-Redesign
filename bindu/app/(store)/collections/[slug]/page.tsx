import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { serialize } from "@/lib/utils"
import ProductCard from "@/components/store/ProductCard"

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const collection = await prisma.smartCollection.findUnique({ where: { slug, isActive: true } }).catch(() => null)
  if (!collection) notFound()

  const rules = collection.rules as any[]
  const allProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: { images: { take: 1 }, category: true, variants: true, ProductTags: true },
  }).catch(() => [])

  const applyRule = (product: any, rule: any): boolean => {
    const { field, operator, value } = rule
    let fieldValue: any
    if (field === "price") fieldValue = Number(product.price)
    else if (field === "tag") fieldValue = product.ProductTags?.map((t: any) => t.name) || []
    else if (field === "category") fieldValue = product.category?.slug || ""
    else return false
    if (operator === "less_than") return Number(fieldValue) < Number(value)
    if (operator === "greater_than") return Number(fieldValue) > Number(value)
    if (operator === "equals") return Array.isArray(fieldValue) ? fieldValue.includes(value) : String(fieldValue) === String(value)
    if (operator === "contains") return Array.isArray(fieldValue) ? fieldValue.some((v: string) => v.includes(value)) : String(fieldValue).includes(value)
    return false
  }

  const matched = allProducts.filter(p => {
    if (!rules?.length) return true
    if (collection.ruleMatch === "any") return rules.some(r => applyRule(p, r))
    return rules.every(r => applyRule(p, r))
  })

  return (
    <div className="bg-bindu-light-grey min-h-screen animate-in fade-in duration-500">

      {/* Header */}
      <div className="border-b border-bindu-border-grey py-16 md:py-20 bg-bindu-white">
        <div className="container mx-auto px-4 max-w-5xl">
          {collection.image && (
            <div className="w-full h-48 overflow-hidden border border-bindu-border-grey mb-8">
              <img src={collection.image} alt={collection.name} className="w-full h-full object-cover" />
            </div>
          )}
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-bindu-orange mb-4">Collection</p>
          <h1 className="font-heading font-black text-bindu-navy uppercase leading-none tracking-tight mb-3" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
            {collection.name}
          </h1>
          {collection.description && (
            <p className="text-bindu-text-muted text-sm max-w-lg leading-relaxed">{collection.description}</p>
          )}
          <p className="font-mono text-[10px] text-bindu-text-muted tracking-widest uppercase mt-4">{matched.length} products</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {serialize(matched).map((p: any) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  )
}
