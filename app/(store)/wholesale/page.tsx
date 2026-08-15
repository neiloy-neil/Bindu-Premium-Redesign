import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/premium/Button"
import { CheckCircle2 } from "lucide-react"

export const metadata = {
  title: "Wholesale & B2B | Bindu Premium",
  description: "Partner with Bindu Premium. Elevate your retail offering with our premium menswear collections.",
}

const benefits = [
  "Access to premium, uncompromised menswear.",
  "Competitive wholesale pricing tiers.",
  "Dedicated B2B account management.",
  "Early access to upcoming seasonal collections.",
  "High-resolution marketing and lifestyle assets provided.",
  "Reliable domestic shipping and logistics support."
]

export default function WholesalePage() {
  return (
    <div className="bg-bindu-white pb-32">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2940&auto=format&fit=crop"
            alt="Bindu Wholesale Partner"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-orange mb-6 block">B2B Partnerships</span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white uppercase tracking-tight mb-6">
            Elevate Your Retail
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Partner with Bindu Premium to bring uncompromised, modern menswear to your clientele.
          </p>
          <Link href="/wholesale/inquiry">
            <Button className="bg-bindu-orange hover:bg-bindu-orange/90 text-white h-14 px-12 text-sm uppercase tracking-widest font-bold">
              Become a Partner
            </Button>
          </Link>
        </div>
      </section>

      {/* Intro & Benefits */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div>
            <h2 className="text-3xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-6">
              The Standard
            </h2>
            <p className="text-bindu-text-muted text-lg leading-relaxed mb-8">
              Bindu Premium is committed to redefining menswear in Bangladesh. We are looking to partner with select retailers, boutiques, and corporate clients who share our dedication to quality, aesthetic restraint, and exceptional customer experience.
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-bindu-orange flex-shrink-0" />
                  <span className="text-bindu-navy font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/5] w-full bg-bindu-light-grey">
            <Image
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2940&auto=format&fit=crop"
              alt="Bindu Quality"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>

        </div>
      </section>

      {/* MOQ and Requirements */}
      <section className="py-24 px-4 bg-bindu-navy text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tight mb-8">
            Partnership Requirements
          </h2>
          <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-16 max-w-2xl mx-auto">
            To maintain our brand integrity and ensure mutual success, we have established minimum ordering thresholds for our B2B partners.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-white/20 p-8">
              <div className="text-bindu-orange font-bold text-4xl mb-4">50</div>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-2">Pieces</h3>
              <p className="text-white/60 text-sm">Minimum order quantity (MOQ) per style/color.</p>
            </div>
            <div className="border border-white/20 p-8">
              <div className="text-bindu-orange font-bold text-4xl mb-4">৳1L</div>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-2">Initial Order</h3>
              <p className="text-white/60 text-sm">Minimum opening order value for new accounts.</p>
            </div>
            <div className="border border-white/20 p-8">
              <div className="text-bindu-orange font-bold text-4xl mb-4">BIN</div>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-2">Verified</h3>
              <p className="text-white/60 text-sm">Valid Trade License and Business Identification Number required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-4 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-6">
          Ready to Start?
        </h2>
        <p className="text-bindu-text-muted mb-10">
          Submit an inquiry with your business details and our B2B team will reach out within 48 hours to discuss potential partnership opportunities.
        </p>
        <Link href="/wholesale/inquiry">
          <Button className="bg-bindu-navy hover:bg-bindu-orange text-white h-14 px-12 text-sm uppercase tracking-widest font-bold transition-colors">
            Submit Wholesale Inquiry
          </Button>
        </Link>
      </section>

    </div>
  )
}
