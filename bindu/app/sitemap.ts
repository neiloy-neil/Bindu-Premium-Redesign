import { MetadataRoute } from "next"
import prisma from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bindupremiumbd.com"

  const [products, categories, blogPosts, episodes, brands, collections, bundles, pages, drops] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true, createdAt: true } }).catch(() => []),
    prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.episode.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.brand.findMany({ where: { isActive: true }, select: { slug: true, createdAt: true } }).catch(() => []),
    prisma.smartCollection.findMany({ where: { isActive: true }, select: { slug: true, createdAt: true } }).catch(() => []),
    prisma.bundle.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.page.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.product.findMany({ where: { releaseAt: { not: null } }, select: { slug: true, updatedAt: true } }).catch(() => []),
  ])

  // Static pages with stable lastModified dates (not new Date() which changes every crawl)
  const SITE_LAUNCH = new Date("2026-08-01")

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl,                          lastModified: SITE_LAUNCH, changeFrequency: "daily",   priority: 1.0 },
    { url: `${siteUrl}/shop`,                lastModified: SITE_LAUNCH, changeFrequency: "daily",   priority: 0.9 },
    { url: `${siteUrl}/drops`,               lastModified: SITE_LAUNCH, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${siteUrl}/blog`,                lastModified: SITE_LAUNCH, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${siteUrl}/memberships`,         lastModified: SITE_LAUNCH, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/episode`,             lastModified: SITE_LAUNCH, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${siteUrl}/about`,               lastModified: SITE_LAUNCH, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`,             lastModified: SITE_LAUNCH, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/faq`,                 lastModified: SITE_LAUNCH, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/size-guide`,          lastModified: SITE_LAUNCH, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/returns`,             lastModified: SITE_LAUNCH, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/warranty`,            lastModified: SITE_LAUNCH, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/track`,               lastModified: SITE_LAUNCH, changeFrequency: "monthly", priority: 0.3 },
  ]

  const categoryPages: MetadataRoute.Sitemap = (categories as any[]).map((c) => ({
    url: `${siteUrl}/category/${c.slug}`,
    lastModified: c.createdAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}/shop/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  const bundlePages: MetadataRoute.Sitemap = bundles.map((b) => ({
    url: `${siteUrl}/shop/bundle/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const collectionPages: MetadataRoute.Sitemap = (collections as any[]).map((c) => ({
    url: `${siteUrl}/collections/${c.slug}`,
    lastModified: c.createdAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const episodePages: MetadataRoute.Sitemap = (episodes as any[]).map((e) => ({
    url: `${siteUrl}/episode/${e.slug}`,
    lastModified: e.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const brandPages: MetadataRoute.Sitemap = (brands as any[]).map((b) => ({
    url: `${siteUrl}/brands/${b.slug}`,
    lastModified: b.createdAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((b) => ({
    url: `${siteUrl}/blog/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const contentPages: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `${siteUrl}/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  const dropPages: MetadataRoute.Sitemap = drops.map((d) => ({
    url: `${siteUrl}/drops/${d.slug}`,
    lastModified: d.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }))

  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
    ...bundlePages,
    ...dropPages,
    ...collectionPages,
    ...episodePages,
    ...brandPages,
    ...blogPages,
    ...contentPages,
  ]
}
