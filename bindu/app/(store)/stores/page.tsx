import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Clock, ArrowRight, Search, Map } from "lucide-react"

export const metadata = {
  title: "Store Locator | Bindu Premium",
  description: "Find Bindu Premium flagship stores and authorized retailers across Bangladesh.",
}

const stores = [
  {
    name: "Bindu Flagship Banani",
    slug: "banani",
    address: "House 12, Road 11, Block F, Banani, Dhaka 1213",
    phone: "+880 1700 000001",
    hours: "10:00 AM - 10:00 PM",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2940&auto=format&fit=crop",
    type: "Flagship"
  },
  {
    name: "Bindu Flagship Dhanmondi",
    slug: "dhanmondi",
    address: "Road 27 (Old), Dhanmondi, Dhaka 1209",
    phone: "+880 1700 000002",
    hours: "10:00 AM - 10:00 PM",
    image: "https://images.unsplash.com/photo-1606830733568-19e3df29a7df?q=80&w=2940&auto=format&fit=crop",
    type: "Flagship"
  },
  {
    name: "Bindu Studio Gulshan",
    slug: "gulshan",
    address: "Gulshan Avenue, Gulshan 2, Dhaka 1212",
    phone: "+880 1700 000003",
    hours: "11:00 AM - 9:00 PM",
    image: "https://images.unsplash.com/photo-1503341338985-c0477be52513?q=80&w=2940&auto=format&fit=crop",
    type: "Studio"
  }
]

export default function StoreLocatorPage() {
  return (
    <div className="bg-bindu-light-grey min-h-screen pb-32">
      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
          Our Locations
        </h1>
        <p className="text-bindu-text-muted text-lg tracking-widest uppercase text-xs font-bold">
          Experience Bindu Premium In Person
        </p>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12 bg-white p-6 border border-bindu-border-grey">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-bindu-text-muted w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by city or neighborhood..." 
              className="w-full bg-bindu-light-grey border-none h-12 pl-12 pr-4 focus:ring-0 outline-none text-bindu-navy"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select className="w-full md:w-auto bg-bindu-light-grey border-none h-12 px-4 focus:ring-0 outline-none text-bindu-navy font-bold uppercase tracking-widest text-xs">
              <option>All Cities</option>
              <option>Dhaka</option>
              <option>Chattogram</option>
              <option>Sylhet</option>
            </select>
            <button className="bg-bindu-navy text-white h-12 px-6 text-xs font-bold uppercase tracking-widest flex items-center gap-2 flex-shrink-0 hover:bg-bindu-orange transition-colors">
              <Map className="w-4 h-4" /> Map View
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Store List */}
          <div className="lg:col-span-1 space-y-6">
            {stores.map(store => (
              <div key={store.slug} className="bg-white border border-bindu-border-grey p-6 hover:border-bindu-navy transition-colors group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-bindu-orange transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-bindu-orange mb-1 block">
                      {store.type}
                    </span>
                    <h3 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight">
                      {store.name}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 mb-6 text-sm text-bindu-text-muted">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-bindu-navy mt-0.5 flex-shrink-0" />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-bindu-navy flex-shrink-0" />
                    <span>{store.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-bindu-navy flex-shrink-0" />
                    <span>{store.hours}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-bindu-border-grey">
                  <Link href={`/stores/${store.slug}`} className="flex-1 text-xs font-bold uppercase tracking-widest text-bindu-navy hover:text-bindu-orange transition-colors flex items-center justify-between">
                    Store Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="lg:col-span-2 relative h-[600px] bg-bindu-border-grey overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2948&auto=format&fit=crop"
              alt="Map Placeholder"
              fill
              className="object-cover grayscale mix-blend-multiply opacity-50"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <MapPin className="w-12 h-12 text-bindu-navy mb-4 animate-bounce" />
              <div className="bg-white px-6 py-3 border border-bindu-border-grey shadow-bindu">
                <p className="text-xs font-bold uppercase tracking-widest text-bindu-navy">Interactive Map Integration Pending</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
