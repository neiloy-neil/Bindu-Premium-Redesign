import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { serialize } from "@/lib/utils"
import type { Metadata } from "next"
import EpisodeAddToCart from "@/components/store/EpisodeAddToCart"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bindupremiumbd.com"

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const episode = await prisma.episode.findUnique({ where: { slug, isPublished: true } })
  if (!episode) return { title: "Not Found" }
  return {
    title: `${episode.name} | Bindu Premium`,
    description: episode.tagline || `Episode ${episode.number} — ${episode.name}. Limited drop from Bindu Premium.`,
    openGraph: {
      title: episode.name,
      description: episode.tagline || "",
      images: episode.heroImage ? [{ url: episode.heroImage }] : [],
    },
  }
}

export default async function EpisodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const episode = await prisma.episode.findUnique({
    where: { slug, isPublished: true },
    include: {
      products: {
        orderBy: { sortOrder: "asc" },
        include: {
          product: {
            include: {
              images: { orderBy: { sortOrder: "asc" } },
              variants: { orderBy: { sku: "asc" } },
              category: true,
            },
          },
        },
      },
    },
  })

  if (!episode) notFound()

  const items = episode.products.map((ep) => ({
    ...ep,
    product: serialize(ep.product),
  }))

  return (
    <article className="bg-[#0A0A0A] min-h-screen">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-end">
        {episode.heroVideo ? (
          <video
            src={episode.heroVideo}
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        ) : episode.heroImage ? (
          <Image
            src={episode.heroImage}
            alt={episode.name}
            fill sizes="100vw"
            className="object-cover opacity-55"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[#111]" />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/50 via-transparent to-transparent" />

        {/* Watermark */}
        <div
          className="absolute top-0 right-0 font-heading font-black text-white/[0.035] leading-none select-none pointer-events-none tracking-tighter"
          style={{ fontSize: "clamp(8rem, 22vw, 22rem)" }}
          aria-hidden
        >
          {episode.number}
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 md:px-14 pb-16 w-full max-w-5xl">
          <p className="font-mono text-[10px] tracking-[0.45em] uppercase text-bindu-cyan mb-4">
            第{episode.number.padStart(2, "0")}話 · Episode {episode.number}
          </p>
          <h1
            className="font-heading font-black text-white uppercase leading-[0.88] tracking-tighter mb-6"
            style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}
          >
            {episode.name}
          </h1>
          {episode.tagline && (
            <p className="text-white/50 text-sm max-w-sm leading-relaxed mb-8">{episode.tagline}</p>
          )}
          <div className="flex items-center gap-6">
            <a
              href="#products"
              className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-bindu-cyan transition-colors"
            >
              <span className="w-px h-8 bg-white/20" />
              Shop the Episode
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 opacity-30">
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white rotate-90 origin-center translate-y-4">Scroll</span>
          <div className="w-px h-12 bg-white/40" />
        </div>
      </section>

      {/* ── STORY ─────────────────────────────────────────────────────── */}
      {episode.story && (
        <section className="py-24 md:py-32 border-t border-white/5">
          <div className="container mx-auto px-6 md:px-14 max-w-3xl">
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/25 border-l-2 border-bindu-cyan pl-3 mb-12">
              The Story
            </p>
            <div
              className="font-heading font-bold text-white/80 leading-relaxed space-y-6"
              style={{ fontSize: "clamp(1.05rem, 2.2vw, 1.3rem)" }}
            >
              {episode.story.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PRODUCTS (alternating editorial layout) ───────────────────── */}
      {items.length > 0 && (
        <section id="products" className="border-t border-white/5">
          {items.map((item, i) => {
            const p = item.product
            const image = p.images?.[0]?.url
            const isEven = i % 2 === 0
            const totalStock = p.variants?.reduce((s: number, v: any) => s + v.stock, 0) ?? 0
            const isSoldOut = totalStock === 0

            return (
              <div
                key={p.id}
                className="flex flex-col md:flex-row min-h-[80vh] border-b border-white/5"
                style={{ flexDirection: isEven ? "row" : "row-reverse" }}
              >
                {/* Image half */}
                <div className="w-full md:w-1/2 relative min-h-[60vw] md:min-h-0 overflow-hidden">
                  {image ? (
                    <Image
                      src={image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#111]" />
                  )}
                  {/* Subtle gradient toward the text side */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: isEven
                        ? "linear-gradient(to right, transparent 60%, #0A0A0A)"
                        : "linear-gradient(to left, transparent 60%, #0A0A0A)",
                    }}
                  />
                  {/* Product index */}
                  <div className="absolute top-6 left-6 font-mono text-[9px] tracking-[0.3em] uppercase text-white/20">
                    {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  </div>
                  {isSoldOut && (
                    <div className="absolute bottom-6 left-6 bg-[#0A0A0A]/80 border border-white/10 px-3 py-1.5">
                      <span className="font-mono text-[9px] tracking-widest uppercase text-white/40">Sold Out</span>
                    </div>
                  )}
                </div>

                {/* Text half */}
                <div className={`w-full md:w-1/2 flex flex-col justify-center px-8 md:px-14 lg:px-20 py-16 md:py-24 ${isEven ? "" : ""}`}>
                  {p.category && (
                    <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-bindu-cyan mb-4">
                      {p.category.name}
                    </p>
                  )}
                  <h2
                    className="font-heading font-black text-white uppercase leading-[0.9] tracking-tighter mb-4"
                    style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)" }}
                  >
                    {p.name}
                  </h2>

                  {item.editorialNote && (
                    <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-xs">
                      {item.editorialNote}
                    </p>
                  )}

                  <div className="flex items-baseline gap-4 mb-8">
                    <span className="font-mono text-2xl font-bold text-white">
                      ৳{Number(p.price).toLocaleString()}
                    </span>
                    {p.comparePrice && Number(p.comparePrice) > Number(p.price) && (
                      <span className="font-mono text-base text-white/30 line-through">
                        ৳{Number(p.comparePrice).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 max-w-xs">
                    {isSoldOut ? (
                      <Link
                        href={`/shop/${p.slug}`}
                        className="w-full py-4 text-xs font-black uppercase tracking-widest border border-white/10 text-white/30 flex items-center justify-center"
                      >
                        Sold Out — View Product
                      </Link>
                    ) : p.releaseAt && new Date(p.releaseAt) > new Date() ? (
                      <Link
                        href={`/shop/${p.slug}`}
                        className="w-full py-4 text-xs font-black uppercase tracking-widest border border-bindu-cyan/30 text-bindu-cyan/70 flex items-center justify-center hover:border-bindu-cyan hover:text-bindu-cyan transition-colors"
                      >
                        Coming Soon — See Drop →
                      </Link>
                    ) : (
                      <EpisodeAddToCart product={p} releaseAt={p.releaseAt ? String(p.releaseAt) : null} />
                    )}
                    <Link
                      href={`/shop/${p.slug}`}
                      className="text-[11px] font-bold uppercase tracking-widest text-white/25 hover:text-bindu-cyan transition-colors text-center border-b border-transparent hover:border-bindu-cyan/40 pb-0.5 self-center"
                    >
                      Full Details →
                    </Link>
                  </div>

                  {/* Stock indicator */}
                  {!isSoldOut && totalStock <= 10 && (
                    <p className="text-[10px] font-black uppercase tracking-widest text-bindu-error mt-6 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-bindu-error animate-pulse" />
                      Only {totalStock} left
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </section>
      )}

      {/* ── ARTIST NOTE ───────────────────────────────────────────────── */}
      {episode.artistNote && (
        <section className="py-24 md:py-32 bg-[#0D0D0D] border-t border-white/5 relative overflow-hidden">
          {/* Large decorative quote mark */}
          <div
            className="absolute top-0 left-0 font-heading font-black text-white/[0.025] leading-none select-none pointer-events-none"
            style={{ fontSize: "clamp(12rem, 30vw, 28rem)", lineHeight: 0.8 }}
            aria-hidden
          >
            "
          </div>

          <div className="container mx-auto px-6 md:px-14 max-w-3xl relative z-10">
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/25 border-l-2 border-white/15 pl-3 mb-12">
              From the Artist
            </p>
            <blockquote
              className="font-heading font-bold text-white/70 leading-tight tracking-tight mb-10"
              style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.5rem)" }}
            >
              "{episode.artistNote}"
            </blockquote>
            {episode.artistName && (
              <div className="flex items-center gap-4">
                <div className="w-8 h-px bg-bindu-cyan/40" />
                <cite className="not-italic font-mono text-[10px] tracking-[0.3em] uppercase text-bindu-cyan">
                  {episode.artistName}
                </cite>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── EPISODE CTA FOOTER ────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-14 max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/25 mb-3">
              第{episode.number.padStart(2, "0")}話 · {episode.products.length} pieces
            </p>
            <h3
              className="font-heading font-black text-white uppercase leading-none tracking-tighter"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              {episode.name}
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="#products"
              className="clip-hex px-8 py-4 bg-bindu-cyan text-bindu-black font-black text-xs uppercase tracking-widest hover:bg-white transition-colors"
            >
              Shop Episode {episode.number} ↑
            </a>
            <Link
              href="/episode"
              className="clip-hex px-8 py-4 border border-white/15 text-white/50 font-bold text-xs uppercase tracking-widest hover:border-white/40 hover:text-white transition-colors"
            >
              All Episodes
            </Link>
          </div>
        </div>
      </section>

    </article>
  )
}
