import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = {
  title: "Campaigns | Bindu Premium",
  description: "Explore current and upcoming campaigns from Bindu Premium.",
}

const campaigns = [
  {
    title: "Summer Essentials 2026",
    slug: "summer-essentials-2026",
    description: "Embrace the heat with our new lightweight, breathable fabrics engineered for the Dhaka summer.",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=2000&auto=format&fit=crop",
    status: "active" as const,
    endDate: "Aug 31, 2026"
  },
  {
    title: "The Eid Collection",
    slug: "eid-collection-2026",
    description: "Modern tradition. Premium Panjabis and tailored essentials for the festive season.",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop",
    status: "archived" as const,
    endDate: "May 15, 2026"
  },
  {
    title: "Fall/Winter Preview",
    slug: "fall-winter-2026",
    description: "Heavyweight staples and structured layers are coming soon.",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2940&auto=format&fit=crop",
    status: "upcoming" as const,
    endDate: "Oct 01, 2026"
  }
]

export default function CampaignsPage() {
  const activeCampaigns = campaigns.filter(c => c.status === "active")
  const upcomingCampaigns = campaigns.filter(c => c.status === "upcoming")
  const archivedCampaigns = campaigns.filter(c => c.status === "archived")

  return (
    <div className="bg-bindu-light-grey min-h-screen pb-32">
      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
          Campaigns
        </h1>
        <p className="text-bindu-text-muted text-lg tracking-widest uppercase text-xs font-bold">
          The Latest from Bindu Premium
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 space-y-24">
        
        {/* Active Campaigns */}
        {activeCampaigns.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-orange mb-8 border-b border-bindu-border-grey pb-4">
              Active Campaigns
            </h2>
            <div className="grid grid-cols-1 gap-12">
              {activeCampaigns.map(campaign => (
                <Link key={campaign.slug} href={`/campaigns/${campaign.slug}`} className="group block relative overflow-hidden bg-white">
                  <div className="relative aspect-video w-full md:aspect-[21/9]">
                    <Image
                      src={campaign.image}
                      alt={campaign.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end">
                      <h3 className="text-3xl md:text-5xl font-heading font-bold text-white uppercase tracking-tight mb-4">
                        {campaign.title}
                      </h3>
                      <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-8">
                        {campaign.description}
                      </p>
                      <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white">
                        Explore Campaign
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Campaigns */}
        {upcomingCampaigns.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-navy mb-8 border-b border-bindu-border-grey pb-4">
              Upcoming Campaigns
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingCampaigns.map(campaign => (
                <div key={campaign.slug} className="group block relative overflow-hidden bg-white opacity-80">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={campaign.image}
                      alt={campaign.title}
                      fill
                      className="object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-center px-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-bindu-orange block mb-2">Coming Soon</span>
                        <h3 className="text-2xl font-heading font-bold text-white uppercase tracking-tight mb-2">
                          {campaign.title}
                        </h3>
                        <p className="text-white/70 text-sm">Arriving {campaign.endDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Archived Campaigns */}
        {archivedCampaigns.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-text-muted mb-8 border-b border-bindu-border-grey pb-4">
              Archived Campaigns
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {archivedCampaigns.map(campaign => (
                <Link key={campaign.slug} href={`/campaigns/${campaign.slug}`} className="group block bg-white border border-bindu-border-grey hover:border-bindu-navy transition-colors">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={campaign.image}
                      alt={campaign.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-2">
                      {campaign.title}
                    </h3>
                    <p className="text-bindu-text-muted text-sm line-clamp-2">
                      {campaign.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </section>
    </div>
  )
}
