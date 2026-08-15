// Google Merchant Center + Facebook Catalog feed — one URL works for both.
// Submit https://www.bindupremiumbd.com/api/feed/products.xml to:
//   • Google Merchant Center → Products → Feeds → File upload (or scheduled fetch)
//   • Facebook Business Manager → Catalog → Data Sources → Data Feed

import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { unstable_cache } from "next/cache"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bindupremiumbd.com"

function stripHtml(html: string | null | undefined): string {
  return (html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 5000)
}

function esc(s: string | null | undefined): string {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

const getCatalog = unstable_cache(
  async () => {
    const [products, settings] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 10 },
          variants: true,
          brand: true,
          category: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 5000,
      }),
      prisma.setting.findMany({ where: { key: "store_name" } }),
    ])
    return {
      products: JSON.parse(JSON.stringify(products)),
      storeName: settings[0]?.value || "Bindu Premium",
    }
  },
  ["product-catalog-feed"],
  { revalidate: 3600 }
)

export async function GET() {
  const { products, storeName } = await getCatalog()

  const items: string[] = []

  for (const product of products) {
    const mainImage = product.images[0]?.url
    if (!mainImage) continue // image is required by both platforms

    const extraImages = product.images
      .slice(1)
      .map((i: any) => `      <g:additional_image_link>${esc(i.url)}</g:additional_image_link>`)
      .join("\n")

    const description = esc(stripHtml(product.description)) || esc(product.name)
    const link = `${SITE_URL}/shop/${product.slug}`
    const brand = esc(product.brand?.name || storeName)
    const productType = esc(product.category?.name || "")

    for (const v of product.variants) {
      const price = Number(v.price ?? product.price)
      const comparePrice = v.comparePrice ?? product.comparePrice
      const onSale = comparePrice && Number(comparePrice) > price
      const inStock = v.stock > 0

      const size = v.size && v.size !== "Default" && v.size !== "-" ? v.size : ""
      const color = v.color && v.color !== "Default" && v.color !== "-" ? v.color : ""
      const variantSuffix = [size, color].filter(Boolean).join(" / ")
      const title = esc(variantSuffix ? `${product.name} — ${variantSuffix}` : product.name)

      // Google & Facebook both want g:price = original price, g:sale_price = discounted price
      const displayPrice = onSale ? `${Number(comparePrice).toFixed(2)} BDT` : `${price.toFixed(2)} BDT`
      const salePrice = onSale ? `${price.toFixed(2)} BDT` : null

      items.push(`    <item>
      <g:id>${esc(v.sku)}</g:id>
      <g:item_group_id>${esc(product.id)}</g:item_group_id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${esc(link)}</g:link>
      <g:image_link>${esc(mainImage)}</g:image_link>
${extraImages ? extraImages + "\n" : ""}      <g:price>${displayPrice}</g:price>
${salePrice ? `      <g:sale_price>${salePrice}</g:sale_price>\n` : ""}      <g:availability>${inStock ? "in stock" : "out of stock"}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>${brand}</g:brand>
      <g:mpn>${esc(v.sku)}</g:mpn>
${productType ? `      <g:product_type>${productType}</g:product_type>\n` : ""}${size ? `      <g:size>${esc(size)}</g:size>\n` : ""}${color ? `      <g:color>${esc(color)}</g:color>\n` : ""}    </item>`)
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${esc(storeName)}</title>
    <link>${SITE_URL}</link>
    <description>${esc(storeName)} — product catalog</description>
${items.join("\n")}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
