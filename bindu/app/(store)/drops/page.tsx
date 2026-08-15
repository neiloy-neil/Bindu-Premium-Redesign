import prisma from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"
import { DropCountdown } from "@/components/store/DropCountdown"
import { DropNotifyButton } from "@/components/store/DropNotifyButton"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Upcoming Drops | Bindu Premium",
  description: "Scheduled limited drops from Bindu Premium. Countdown to the next release — limited units, no restock.",
}

export const revalidate = 60

export default async function DropsPage() {
  const now = new Date()

  const [upcoming, past] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, releaseAt: { gt: now } },
      orderBy: { releaseAt: "asc" },
      include: {
        images: { take: 1, orderBy: { sortOrder: "asc" } },
        category: true,
        variants: { select: { stock: true } },
        episodes: { include: { episode: { select: { slug: true, name: true, number: true, isPublished: true } } }, take: 1 },
        _count: { select: { dropNotifies: true } },
      },
    }).catch(() => []),
    prisma.product.findMany({
      where: { isActive: true, releaseAt: { lte: now, not: null } },
      orderBy: { releaseAt: "desc" },
      take: 6,
      include: {
        images: { take: 1, orderBy: { sortOrder: "asc" } },
        category: true,
        variants: { select: { stock: true } },
        episodes: { include: { episode: { select: { slug: true, name: true, number: true, isPublished: true } } }, take: 1 },
      },
    }).catch(() => []),
  ])

  return (
    <div className="bg-[#0A0A0A] min-h-screen animate-in fade-in duration-500">

      {/* Header */}
      <div className="border-b border-white/10 py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-bindu-cyan mb-4">ドロップ — Limited Releases</p>
          <h1 className="font-heading font-black text-white uppercase leading-none tracking-tight mb-5" style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}>
            Drops
          </h1>
          <p className="text-white/40 text-sm max-w-md leading-relaxed">
            Every drop is limited. Every design is original. Once it sells out, this run closes permanently.
          </p>
        </div>
      </div>

      {/* Upcoming drops */}
      <div className="container mx-auto px-4 max-w-5xl py-16 md:py-20">

        {upcoming.length > 0 ? (
          <div className="space-y-1 mb-20">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 border-l-2 border-bindu-cyan pl-3 mb-10">
              Upcoming
            </p>
            <div className="space-y-px">
              {upcoming.map((drop) => {
                const image = drop.images[0]?.url
                const totalStock = drop.variants.reduce((s, v) => s + v.stock, 0)
                return (
                  <div
                    key={drop.id}
                    className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-6 py-8 border-b border-white/10 hover:border-bindu-cyan/30 transition-colors"
                  >
                    {/* Full-card click target — sits below content in z-order */}
                    <Link href={`/drops/${drop.slug}`} className="absolute inset-0 z-0" aria-label={drop.name} />

                    {/* Thumbnail */}
                    <div className="relative z-10 w-full sm:w-24 h-32 sm:h-24 shrink-0 overflow-hidden border border-white/10 group-hover:border-bindu-cyan/40 transition-colors">
                      {image ? (
                        <Image src={image} alt={drop.name} fill sizes="96px" className="object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <div className="w-full h-full bg-[#111] flex items-center justify-center">
                          <span className="font-heading font-black text-white/10 text-2xl">{drop.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-bindu-cyan animate-pulse" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="relative z-10 flex-1 min-w-0">
                      {drop.category && (
                        <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-bindu-cyan mb-1">{drop.category.name}</p>
                      )}
                      <h2 className="font-heading font-black text-white text-xl uppercase tracking-tight leading-tight mb-1 truncate">{drop.name}</h2>
                      <p className="text-white/30 text-xs">
                        {totalStock > 0 ? `${totalStock} units` : "TBA"} · ৳{Number(drop.price).toLocaleString()}
                      </p>
                    </div>

                    {/* Countdown + actions */}
                    <div className="relative z-10 shrink-0 text-right space-y-3">
                      <div>
                        <p className="font-mono text-[9px] tracking-widest uppercase text-white/20 mb-2">Opens in</p>
                        <DropCountdown releaseAt={new Date(drop.releaseAt!).toISOString()} />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {drop.episodes?.[0]?.episode?.isPublished && (
                          <Link
                            href={`/episode/${drop.episodes[0].episode.slug}`}
                            className="relative z-20 inline-block font-mono text-[9px] tracking-widest uppercase text-bindu-cyan hover:text-white transition-colors border-b border-bindu-cyan/30 pb-0.5"
                          >
                            View Editorial →
                          </Link>
                        )}
                        <DropNotifyButton
                          productId={drop.id}
                          initialCount={(drop as any)._count?.dropNotifies ?? 0}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="mb-20 py-16 text-center border border-white/10 bg-white/[0.02]">
            <p className="font-mono text-[10px] tracking-widest uppercase text-white/20 mb-3">No scheduled drops right now</p>
            <p className="text-white/30 text-sm">Follow us on Instagram to be first when a new drop is announced.</p>
            <a
              href="https://www.instagram.com/bindu_wearbd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 px-6 py-3 border border-white/15 text-white/60 font-bold tracking-widest text-xs uppercase hover:border-bindu-cyan hover:text-bindu-cyan transition-colors"
            >
              @bindu_wearbd →
            </a>
          </div>
        )}

        {/* Past drops */}
        {past.length > 0 && (
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 border-l-2 border-white/20 pl-3 mb-10">
              Past Drops
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px">
              {past.map((drop) => {
                const image = drop.images[0]?.url
                const isSoldOut = drop.variants.every((v) => v.stock === 0)
                return (
                  <Link
                    key={drop.id}
                    href={`/shop/${drop.slug}`}
                    className="group relative aspect-square overflow-hidden border border-white/5 hover:border-white/20 transition-colors"
                  >
                    {image ? (
                      <Image src={image} alt={drop.name} fill sizes="33vw" className="object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
                    ) : (
                      <div className="w-full h-full bg-[#111]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-heading font-black text-white text-sm uppercase tracking-tight leading-tight truncate">{drop.name}</h3>
                      <p className="font-mono text-[10px] mt-1 text-white/30">
                        {isSoldOut ? "Sold Out" : "Available"}
                      </p>
                    </div>
                    {isSoldOut && (
                      <div className="absolute top-3 right-3 bg-[#0A0A0A]/80 border border-white/10 px-2 py-1">
                        <span className="font-mono text-[9px] tracking-widest uppercase text-white/40">Closed</span>
                      </div>
                    )}
                    {drop.episodes?.[0]?.episode?.isPublished && (
                      <div className="absolute top-3 left-3 bg-[#0A0A0A]/80 border border-bindu-cyan/30 px-2 py-1">
                        <span className="font-mono text-[9px] tracking-widest uppercase text-bindu-cyan">
                          Ep.{drop.episodes[0].episode.number}
                        </span>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
