import prisma from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { DropCountdown } from "@/components/store/DropCountdown"
import { DropNotifyButton } from "@/components/store/DropNotifyButton"
import type { Metadata } from "next"

export const revalidate = 60

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bindupremiumbd.com"

async function getDrop(slug: string) {
  return prisma.product.findFirst({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      brand: true,
      variants: { select: { size: true, color: true, stock: true } },
      episodes: {
        include: { episode: { select: { slug: true, name: true, number: true, isPublished: true } } },
        take: 1,
      },
    },
  }).catch(() => null)
}

async function getNotifyCount(productId: string): Promise<number> {
  try {
    return await (prisma as any).dropNotify.count({ where: { productId } })
  } catch {
    return 0
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const drop = await getDrop(slug)
  if (!drop || !drop.releaseAt) return { title: "Drop Not Found" }

  const image = drop.images[0]?.url
  const title = `${drop.name} — Dropping ${new Date(drop.releaseAt!).toLocaleDateString("en-BD", { month: "long", day: "numeric" })} | Bindu Premium`
  const notifyCount = await getNotifyCount(drop.id)
  const description = drop.description?.slice(0, 160) || `Limited drop from Bindu Premium. ${notifyCount} people on the list.`

  return {
    title,
    description,
    openGraph: { title, description, images: image ? [image] : [] },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
  }
}

export default async function DropHypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const drop = await getDrop(slug)
  if (!drop || !drop.releaseAt) notFound()

  const now = new Date()
  const releaseAt = new Date(drop.releaseAt)
  const isLive = releaseAt <= now
  const notifyCount = await getNotifyCount(drop.id)
  const heroImage = drop.images[0]?.url
  const galleryImages = drop.images.slice(1, 4)
  const totalStock = drop.variants.reduce((s, v) => s + v.stock, 0)
  const sizes = [...new Set(drop.variants.map((v) => v.size))].filter(Boolean)
  const episode = drop.episodes[0]?.episode

  return (
    <div className="bg-[#0A0A0A] min-h-screen">

      {/* ── HERO ── */}
      <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">

        {/* Background image */}
        {heroImage && (
          <>
            <div className="absolute inset-0">
              <Image
                src={heroImage}
                alt={drop.name}
                fill
                sizes="100vw"
                className="object-cover opacity-40"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]/20" />
          </>
        )}

        {/* Live pill */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
          {isLive ? (
            <div className="flex items-center gap-2 border border-bindu-cyan/40 bg-bindu-cyan/10 px-4 py-2 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-bindu-cyan animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-bindu-cyan font-bold">Now Live</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 border border-white/20 bg-black/40 px-4 py-2 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-bindu-cyan animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/60 font-bold">Drop Incoming</span>
            </div>
          )}
        </div>

        {/* Hero content */}
        <div className="relative z-10 container mx-auto px-4 max-w-4xl pb-12 md:pb-20 pt-32">

          {/* Category + episode */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            {drop.category && (
              <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-bindu-cyan">
                {drop.category.name}
              </span>
            )}
            {episode?.isPublished && (
              <>
                <span className="text-white/20">·</span>
                <Link
                  href={`/episode/${episode.slug}`}
                  className="font-mono text-[9px] tracking-[0.35em] uppercase text-white/40 hover:text-bindu-cyan transition-colors border-b border-white/20 pb-0.5"
                >
                  Ep.{episode.number} — {episode.name}
                </Link>
              </>
            )}
          </div>

          {/* Name */}
          <h1
            className="font-heading font-black text-white uppercase leading-none tracking-tight mb-6"
            style={{ fontSize: "clamp(3rem, 10vw, 7rem)" }}
          >
            {drop.name}
          </h1>

          {/* Countdown or live CTA */}
          {isLive ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <Link href={`/shop/${drop.slug}`}>
                <button className="px-8 py-4 bg-bindu-cyan text-bindu-black font-black uppercase tracking-widest hover:bg-white transition-colors text-sm">
                  Shop Now →
                </button>
              </Link>
              <p className="text-white/40 text-xs font-mono">
                {totalStock > 0 ? `${totalStock} units remaining` : "Sold out"}
              </p>
            </div>
          ) : (
            <div className="mb-8">
              <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/30 mb-3">Opens in</p>
              <DropCountdown releaseAt={releaseAt.toISOString()} large />
            </div>
          )}

          {/* Notify row */}
          {!isLive && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <DropNotifyButton productId={drop.id} initialCount={notifyCount} />
              {notifyCount > 0 && (
                <p className="text-white/30 text-xs font-mono">
                  {notifyCount.toLocaleString()} {notifyCount === 1 ? "person" : "people"} on the list
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── STORY ── */}
      {drop.description && (
        <section className="border-t border-white/10">
          <div className="container mx-auto px-4 max-w-4xl py-16 md:py-24 grid md:grid-cols-[1fr_2fr] gap-12">
            <div>
              <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-bindu-cyan border-l-2 border-bindu-cyan pl-3">
                The Story
              </p>
            </div>
            <div>
              <p className="text-white/60 leading-relaxed text-base md:text-lg">
                {drop.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── GALLERY ── */}
      {galleryImages.length > 0 && (
        <section className="border-t border-white/10">
          <div className="container mx-auto px-4 max-w-4xl py-12 md:py-16">
            <div className={`grid gap-px ${galleryImages.length === 1 ? "grid-cols-1" : galleryImages.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
              {galleryImages.map((img, i) => (
                <div key={i} className="relative aspect-[3/4] overflow-hidden">
                  <Image src={img.url} alt={`${drop.name} ${i + 2}`} fill sizes="33vw" className="object-cover opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DROP DETAILS ── */}
      <section className="border-t border-white/10">
        <div className="container mx-auto px-4 max-w-4xl py-12 md:py-16">
          <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-white/30 border-l-2 border-white/20 pl-3 mb-10">
            Drop Details
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px border border-white/10">
            <div className="p-6 border-r border-white/10">
              <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mb-2">Price</p>
              <p className="font-heading font-black text-white text-xl">৳{Number(drop.price).toLocaleString()}</p>
            </div>
            <div className="p-6 border-r border-white/10">
              <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mb-2">Units</p>
              <p className="font-heading font-black text-white text-xl">
                {totalStock > 0 ? totalStock.toLocaleString() : "TBA"}
              </p>
            </div>
            <div className="p-6 border-r border-white/10">
              <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mb-2">Sizes</p>
              <p className="font-heading font-black text-white text-xl">{sizes.join(" · ") || "TBA"}</p>
            </div>
            <div className="p-6">
              <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mb-2">
                {isLive ? "Dropped" : "Drops"}
              </p>
              <p className="font-heading font-black text-white text-base leading-tight">
                {releaseAt.toLocaleDateString("en-BD", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HYPE CTA (pre-launch) ── */}
      {!isLive && (
        <section className="border-t border-white/10 bg-[#0D0D0D]">
          <div className="container mx-auto px-4 max-w-4xl py-16 md:py-20 text-center">
            <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-bindu-cyan mb-4">
              {notifyCount > 0 ? `${notifyCount.toLocaleString()} people are waiting` : "Be first to know"}
            </p>
            <h2 className="font-heading font-black text-white uppercase leading-none tracking-tight mb-8" style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}>
              Get Notified<br />When It Drops
            </h2>
            <div className="flex justify-center">
              <DropNotifyButton productId={drop.id} initialCount={notifyCount} large />
            </div>
            <p className="mt-6 text-white/20 text-xs font-mono">One email only. No spam. Just the drop.</p>
          </div>
        </section>
      )}

      {/* ── FOOTER NAV ── */}
      <section className="border-t border-white/10">
        <div className="container mx-auto px-4 max-w-4xl py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/drops" className="font-mono text-[10px] tracking-widest uppercase text-white/30 hover:text-bindu-cyan transition-colors">
            ← All Drops
          </Link>
          {isLive && (
            <Link href={`/shop/${drop.slug}`} className="font-mono text-[10px] tracking-widest uppercase text-bindu-cyan hover:text-white transition-colors">
              Shop This Drop →
            </Link>
          )}
        </div>
      </section>

    </div>
  )
}
