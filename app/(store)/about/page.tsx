import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/premium/Button"

export const metadata = {
  title: "About Us | Bindu Premium",
  description: "Learn about Bindu Premium, Bangladesh's modern fashion brand. Discover our philosophy, our connection to the culture, and our vision for the future of menswear.",
}

export default function AboutPage() {
  return (
    <div className="bg-bindu-white">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2940&auto=format&fit=crop"
            alt="Bindu Premium About Hero"
            fill
            className="object-cover brightness-[0.6]"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white uppercase tracking-tight mb-6">
            Defining the Modern Wardrobe
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto">
            Bindu Premium is a Bangladeshi fashion brand built on the belief that everyday essentials should be crafted without compromise.
          </p>
        </div>
      </section>

      {/* Brand Introduction */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-orange mb-4 block">Our Philosophy</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-8">
            Minimal. Confident. Essential.
          </h2>
          <div className="text-bindu-text-muted space-y-6 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            <p>
              We founded Bindu with a singular focus: to elevate the standard of menswear in Bangladesh. We noticed a gap between fast fashion and inaccessible luxury—a space where quality, fit, and timeless design should intersect seamlessly.
            </p>
            <p>
              Every garment we produce is an exercise in restraint. We strip away the unnecessary, focusing entirely on superior fabrics, meticulous construction, and fits that flatter the modern gentleman. We don't chase fleeting trends; we design enduring staples.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Storytelling - Full Width Break */}
      <section className="w-full h-[50vh] min-h-[400px] relative">
        <Image
          src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2940&auto=format&fit=crop"
          alt="Bindu Premium Craftsmanship"
          fill
          className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
        />
      </section>

      {/* Bangladesh Connection & Future Vision */}
      <section className="py-24 px-4 bg-bindu-light-grey">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative aspect-[4/5] w-full max-w-md mx-auto md:max-w-none">
               <Image
                src="https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=2787&auto=format&fit=crop"
                alt="Bindu Design Studio"
                fill
                className="object-cover rounded-none"
              />
            </div>
            <div className="order-1 md:order-2 space-y-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-orange mb-4 block">The Bangladesh Connection</span>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
                  Rooted in Dhaka
                </h3>
                <p className="text-bindu-text-muted leading-relaxed">
                  Bangladesh has long been the manufacturing powerhouse for the world's leading brands. At Bindu, we leverage this incredible local expertise to build a brand for our own people. We work directly with top-tier local artisans and facilities to ensure world-class quality remains accessible right here at home.
                </p>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-orange mb-4 block">Our Vision</span>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
                  The Future of Retail
                </h3>
                <p className="text-bindu-text-muted leading-relaxed">
                  We are building a digital flagship that bridges the gap between online convenience and premium physical retail. Our vision is to continually set the benchmark for customer experience, product excellence, and brand integrity in Bangladesh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-4 text-center bg-bindu-navy text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tight mb-8">
            Experience the Collection
          </h2>
          <p className="text-white/70 mb-10 text-lg">
            Discover the pieces that define the Bindu Premium wardrobe.
          </p>
          <Link href="/shop">
            <Button variant="default" className="bg-bindu-orange hover:bg-bindu-orange/90 text-white h-14 px-12 text-sm uppercase tracking-widest font-bold">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
