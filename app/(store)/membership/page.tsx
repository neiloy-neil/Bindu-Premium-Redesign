import Link from "next/link"
import { ShieldCheck, TrendingUp, Gift, Wallet, ArrowRight, UserPlus } from "lucide-react"
import { Button } from "@/components/premium/Button"
import Image from "next/image"

export const metadata = {
  title: "Bindu Premium Club | Wear The Arc",
  description: "Join the Bindu Premium Club. Earn points on every purchase, unlock exclusive rewards, and experience premium menswear.",
}

export default function MembershipPage() {
  return (
    <div className="bg-bindu-white min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[600px] flex items-center bg-bindu-navy text-bindu-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1594938298598-70f701633594?q=80&w=2960&auto=format&fit=crop"
            alt="Bindu Premium Club Membership"
            fill
            className="object-cover opacity-30 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bindu-navy via-bindu-navy/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-4xl">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-bindu-orange mb-6 block">
            Welcome to the Inner Circle
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold uppercase tracking-tight mb-6">
            Bindu Premium Club
          </h1>
          <p className="text-base md:text-xl text-bindu-text-muted mb-10 max-w-2xl mx-auto font-medium">
            Elevate your wardrobe and get rewarded. Earn points on every purchase, access exclusive drops, and experience the highest standard of premium menswear.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button variant="default" className="w-full sm:w-auto text-sm px-10 h-14">
                Join the Club
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full sm:w-auto text-sm px-10 h-14 text-bindu-white border-bindu-white hover:bg-bindu-white hover:text-bindu-navy">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-bindu-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
              Membership Benefits
            </h2>
            <p className="text-bindu-text-muted max-w-xl mx-auto">
              We believe in rewarding loyalty with real value. No complicated tiers, just straightforward benefits designed for the modern gentleman.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Benefit 1 */}
            <div className="text-center p-8 bg-bindu-light-grey group hover:bg-bindu-navy transition-colors duration-500">
              <div className="w-16 h-16 bg-bindu-white flex items-center justify-center rounded-full mx-auto mb-6 group-hover:bg-bindu-orange transition-colors duration-500">
                <TrendingUp className="w-6 h-6 text-bindu-navy group-hover:text-bindu-white" />
              </div>
              <h3 className="text-xl font-heading font-bold text-bindu-navy mb-3 group-hover:text-bindu-white transition-colors duration-500 uppercase tracking-wide">
                Earn Effortlessly
              </h3>
              <p className="text-sm text-bindu-text-muted group-hover:text-bindu-border-grey transition-colors duration-500 leading-relaxed">
                Receive 1 Premium Point for every ৳10 you spend. Points are added to your account automatically upon delivery.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="text-center p-8 bg-bindu-light-grey group hover:bg-bindu-navy transition-colors duration-500">
              <div className="w-16 h-16 bg-bindu-white flex items-center justify-center rounded-full mx-auto mb-6 group-hover:bg-bindu-orange transition-colors duration-500">
                <Wallet className="w-6 h-6 text-bindu-navy group-hover:text-bindu-white" />
              </div>
              <h3 className="text-xl font-heading font-bold text-bindu-navy mb-3 group-hover:text-bindu-white transition-colors duration-500 uppercase tracking-wide">
                Redeem Instantly
              </h3>
              <p className="text-sm text-bindu-text-muted group-hover:text-bindu-border-grey transition-colors duration-500 leading-relaxed">
                Every 100 points equals ৳1 off your next purchase. Use them directly at checkout—no minimum balance required.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="text-center p-8 bg-bindu-light-grey group hover:bg-bindu-navy transition-colors duration-500">
              <div className="w-16 h-16 bg-bindu-white flex items-center justify-center rounded-full mx-auto mb-6 group-hover:bg-bindu-orange transition-colors duration-500">
                <UserPlus className="w-6 h-6 text-bindu-navy group-hover:text-bindu-white" />
              </div>
              <h3 className="text-xl font-heading font-bold text-bindu-navy mb-3 group-hover:text-bindu-white transition-colors duration-500 uppercase tracking-wide">
                Refer & Earn
              </h3>
              <p className="text-sm text-bindu-text-muted group-hover:text-bindu-border-grey transition-colors duration-500 leading-relaxed">
                Invite friends to experience Bindu. They get ৳100 store credit, and you earn 500 bonus points when they order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Break / Quote */}
      <section className="py-24 bg-bindu-light-grey">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <ShieldCheck className="w-12 h-12 text-bindu-orange mx-auto mb-6" />
          <h2 className="text-2xl md:text-4xl font-heading font-bold text-bindu-navy uppercase tracking-tight leading-tight">
            "More than just clothing. It's a commitment to quality, style, and the pursuit of excellence."
          </h2>
        </div>
      </section>

      {/* How it Works & CTA */}
      <section className="py-24 bg-bindu-white">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <Image 
                src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=2070&auto=format&fit=crop" 
                alt="Premium Menswear Lifestyle" 
                width={800} 
                height={1000} 
                className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            
            <div className="lg:w-1/2 space-y-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-bindu-orange mb-4 block">Getting Started</span>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-6">
                  Simple, Transparent Rewards
                </h2>
                <p className="text-bindu-text-muted text-base">
                  Creating an account takes less than a minute. As a member, you'll immediately begin earning points on every purchase, gaining access to faster checkout and order tracking.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-bindu-navy text-bindu-white flex items-center justify-center shrink-0 font-bold text-xs">1</div>
                  <div>
                    <h4 className="font-bold text-bindu-navy uppercase tracking-widest text-sm mb-1">Create Account</h4>
                    <p className="text-sm text-bindu-text-muted">Sign up with your email. It's free and always will be.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-bindu-navy text-bindu-white flex items-center justify-center shrink-0 font-bold text-xs">2</div>
                  <div>
                    <h4 className="font-bold text-bindu-navy uppercase tracking-widest text-sm mb-1">Shop Premium</h4>
                    <p className="text-sm text-bindu-text-muted">Browse our collections. Points are calculated automatically.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-bindu-navy text-bindu-white flex items-center justify-center shrink-0 font-bold text-xs">3</div>
                  <div>
                    <h4 className="font-bold text-bindu-navy uppercase tracking-widest text-sm mb-1">Enjoy Benefits</h4>
                    <p className="text-sm text-bindu-text-muted">Redeem points at checkout and elevate your style.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-bindu-border-grey">
                <Link href="/login" className="inline-flex items-center gap-2 group">
                  <span className="text-sm font-bold uppercase tracking-widest text-bindu-navy group-hover:text-bindu-orange transition-colors">
                    Create Your Account Now
                  </span>
                  <ArrowRight className="w-4 h-4 text-bindu-navy group-hover:translate-x-1 group-hover:text-bindu-orange transition-all" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
