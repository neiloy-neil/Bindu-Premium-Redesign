import prisma from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Episodes | Bindu Premium",
  description: "Every episode is a limited drop. Original designs, zero bootlegs. Browse all Bindu Premium editorial collections.",
}

export const revalidate = 60

export default async function EpisodesPage() {
  const episodes = await prisma.episode.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    include: {
      products: {
        include: {
          product: {
            include: {
              images: { take: 1, orderBy: { sortOrder: "asc" } },
              variants: { select: { stock: true } },
            },
          },
        },
        orderBy: { sortOrder: "asc" },
        take: 3,
      },
    },
  }).catch(() => [])

  return (
    <div className="bg-[#0A0A0A] min-h-screen animate-in fade-in duration-500">

      {/* Header */}
      <div className="border-b border-white/10 py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-bindu-cyan mb-4">
            エピソード — Limited Runs
          </p>
          <h1
            className="font-heading font-black text-white uppercase leading-none tracking-tight mb-5"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
          >
            Episodes
          </h1>
          <p className="text-white/40 text-sm max-w-md leading-relaxed">
            Each episode is a chapter. Original art, limited units, built in Dhaka.
            Once the run closes, it's gone.
          </p>
        </div>
      </div>

      {/* Episodes list */}
      <div className="container mx-auto px-4 max-w-5xl py-16 md:py-20">
        {episodes.length === 0 ? (
          <div className="py-20 text-center border border-white/10 bg-white/[0.02]">
            <p className="font-mono text-[10px] tracking-widest uppercase text-white/20 mb-3">
              First episode dropping soon
            </p>
            <Link
              href="/drops"
              className="inline-block mt-4 px-6 py-3 border border-white/15 text-white/50 font-bold tracking-widest text-xs uppercase hover:border-bindu-cyan hover:text-bindu-cyan transition-colors"
            >
              See Upcoming Drops →
            </Link>
          </div>
        ) : (
          <div className="space-y-0">
            {episodes.map((ep, idx) => {
              const totalPieces = ep.products.length
              const previewImages = ep.products
                .slice(0, 3)
                .map((ep) => ep.product.images[0]?.url)
                .filter(Boolean)
              const isSoldOut = ep.products.every((ep) =>
                ep.product.variants.every((v) => v.stock === 0)
              )

              return (
                <Link
                  key={ep.id}
                  href={`/episode/${ep.slug}`}
                  className="group flex flex-col md:flex-row gap-0 border-b border-white/10 hover:border-bindu-cyan/30 transition-colors py-10 md:py-0"
                >
                  {/* Episode number */}
                  <div className="md:w-28 md:py-10 shrink-0 flex md:flex-col justify-between md:justify-start md:items-start items-center gap-4 md:gap-2 pr-0 md:pr-8 border-r-0 md:border-r md:border-white/5 md:group-hover:border-bindu-cyan/20 transition-colors">
                    <span
                      className="font-heading font-black text-white/10 group-hover:text-bindu-cyan/20 transition-colors leading-none"
                      style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                    >
                      {ep.number.padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/20 group-hover:text-bindu-cyan/50 transition-colors">
                      Ep.{ep.number}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 md:px-10 md:py-10 flex flex-col justify-center gap-3">
                    {isSoldOut && (
                      <span className="font-mono text-[9px] tracking-widest uppercase text-white/25 self-start border border-white/10 px-2 py-1">
                        Sold Out
                      </span>
                    )}
                    <h2 className="font-heading font-black text-white uppercase leading-tight tracking-tighter group-hover:text-bindu-cyan transition-colors" style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)" }}>
                      {ep.name}
                    </h2>
                    {ep.tagline && (
                      <p className="text-white/35 text-sm leading-relaxed max-w-md">
                        {ep.tagline}
                      </p>
                    )}
                    <p className="font-mono text-[10px] tracking-widest uppercase text-white/20">
                      {totalPieces} piece{totalPieces !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Preview images */}
                  {previewImages.length > 0 && (
                    <div className="md:py-6 shrink-0 flex gap-2 md:items-center">
                      {previewImages.map((url, i) => (
                        <div
                          key={i}
                          className="w-16 h-20 md:w-20 md:h-24 relative overflow-hidden border border-white/5 group-hover:border-white/20 transition-colors"
                          style={{ opacity: 1 - i * 0.2 }}
                        >
                          <Image
                            src={url as string}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                      <div className="w-16 h-20 md:w-20 md:h-24 border border-white/5 group-hover:border-bindu-cyan/30 flex items-center justify-center transition-colors">
                        <span className="font-mono text-[10px] tracking-widest text-white/20 group-hover:text-bindu-cyan transition-colors">→</span>
                      </div>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
