import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPin, Phone, Clock, ArrowLeft, Navigation } from "lucide-react"

export const metadata = {
  title: "Store Details | Bindu Premium",
  description: "Details, hours, and directions for our flagship stores.",
}

const DUMMY_STORE = {
  name: "Bindu Flagship Banani",
  slug: "banani",
  address: "House 12, Road 11, Block F, Banani, Dhaka 1213",
  phone: "+880 1700 000001",
  hours: [
    { days: "Saturday - Thursday", time: "10:00 AM - 10:00 PM" },
    { days: "Friday", time: "2:00 PM - 10:00 PM" }
  ],
  image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2940&auto=format&fit=crop",
  type: "Flagship",
  services: [
    "Personal Styling",
    "In-Store Alterations",
    "Click & Collect",
    "Gift Wrapping"
  ],
  description: "Located in the heart of Banani's premium retail district, our flagship store offers the complete Bindu Premium experience. Featuring our full range of menswear, a dedicated fitting lounge, and complimentary styling services."
}

export default async function StoreDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  if (!slug) notFound()

  // In a real app, fetch from CMS/DB based on slug
  const store = DUMMY_STORE

  return (
    <div className="bg-bindu-white min-h-screen pb-32">
      
      {/* Back Link */}
      <div className="absolute top-24 left-4 md:left-8 z-20">
        <Link href="/stores" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-bindu-orange transition-colors drop-shadow-md">
          <ArrowLeft className="w-4 h-4" /> All Stores
        </Link>
      </div>

      {/* Hero Image */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-end mb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src={store.image}
            alt={store.name}
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
        </div>
        <div className="relative z-10 w-full bg-gradient-to-t from-black/80 to-transparent p-8 md:p-16">
          <div className="max-w-7xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-orange mb-4 block">
              {store.type}
            </span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white uppercase tracking-tight">
              {store.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Main Info */}
          <div className="w-full lg:w-2/3 space-y-16">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-bindu-orange mb-6 border-b border-bindu-border-grey pb-4">
                About The Store
              </h2>
              <p className="text-bindu-text-muted text-lg leading-relaxed">
                {store.description}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-bindu-orange mb-6 border-b border-bindu-border-grey pb-4">
                Services Available
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {store.services.map((service, index) => (
                  <li key={index} className="flex items-center gap-3 text-bindu-navy font-medium">
                    <span className="w-1.5 h-1.5 bg-bindu-orange rounded-full"></span>
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-bindu-light-grey border border-bindu-border-grey p-8 space-y-8 sticky top-24">
              
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-text-muted mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-bindu-orange" /> Address
                </h3>
                <p className="text-bindu-navy font-medium leading-relaxed">
                  {store.address}
                </p>
                <button className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-bindu-navy hover:text-bindu-orange transition-colors">
                  <Navigation className="w-4 h-4" /> Get Directions
                </button>
              </div>

              <div className="h-px bg-bindu-border-grey" />

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-text-muted mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-bindu-orange" /> Opening Hours
                </h3>
                <div className="space-y-2">
                  {store.hours.map((h, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-bindu-text-muted">{h.days}</span>
                      <span className="font-medium text-bindu-navy">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-bindu-border-grey" />

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-text-muted mb-4 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-bindu-orange" /> Contact
                </h3>
                <p className="text-bindu-navy font-medium">
                  {store.phone}
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
