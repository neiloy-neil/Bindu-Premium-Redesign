"use client";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Share2 } from "lucide-react";

type Branding = {
  storeName: string
  storeTagline: string
  storeDescription: string
  supportEmail: string
  supportPhone: string
  socialFacebook: string
  socialInstagram: string
  socialTiktok: string
}

type FooterCategory = { id: string; name: string; slug: string }

export default function Footer({
  branding,
  categories = [],
}: {
  branding?: Partial<Branding>
  categories?: FooterCategory[]
}) {
  const storeName = branding?.storeName || "Bindu Premium"
  const storeDescription =
    branding?.storeDescription ||
    "Inspired by global sportswear design, crafted for maximum comfort and style in Bangladesh. Your top destination for export quality polos & jerseys."
  const supportEmail = branding?.supportEmail || "support@bindupremium.com"
  const supportPhone = branding?.supportPhone || "+880 172 555 6272"
  const socialFacebook = branding?.socialFacebook || "https://facebook.com/bindufashionbd"

  return (
    <footer className="bg-bindu-navy text-bindu-white pt-16 pb-8 border-t border-bindu-border-grey/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-5">
            <Image 
              src="/Bindu-premium-logo-in-White-BG.png" 
              alt="Bindu Premium Logo" 
              width={160} 
              height={45} 
              className="object-contain bg-white p-1 rounded-sm mb-2"
            />
            <p className="text-bindu-border-grey/80 text-sm leading-relaxed max-w-xs">
              {storeDescription}
            </p>
            {socialFacebook && (
              <div className="pt-2">
                <a href={socialFacebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 border border-white/20 rounded hover:bg-bindu-orange hover:border-bindu-orange hover:text-white transition-colors" aria-label="Facebook">
                  <span className="font-bold text-sm">FB</span>
                </a>
              </div>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-5">
            <h3 className="font-heading font-bold text-lg tracking-wide uppercase">Quick Links</h3>
            <ul className="space-y-3 text-sm text-bindu-border-grey/80">
              <li><Link href="/" className="hover:text-bindu-orange transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-bindu-orange transition-colors">All Collections</Link></li>
              <li><Link href="/shop?sale=true" className="hover:text-bindu-orange transition-colors">Flash Sale</Link></li>
              <li><Link href="/size-guide" className="hover:text-bindu-orange transition-colors">Size Guide</Link></li>
              <li><Link href="/#reviews" className="hover:text-bindu-orange transition-colors">Customer Reviews</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-5">
            <h3 className="font-heading font-bold text-lg tracking-wide uppercase">Contact Us</h3>
            <ul className="space-y-4 text-sm text-bindu-border-grey/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-bindu-orange" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-bindu-orange" />
                <span>{supportEmail}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-bindu-orange" />
                <span>{supportPhone}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-5">
            <h3 className="font-heading font-bold text-lg tracking-wide uppercase">Newsletter</h3>
            <p className="text-bindu-border-grey/80 text-sm leading-relaxed max-w-xs">
              Subscribe to receive premium discount updates & campaign arrivals!
            </p>
            <form className="flex mt-4 relative" onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}>
              <input 
                type="email" 
                placeholder="Your Email Address" 
                className="w-full bg-white/10 text-white border border-white/20 rounded-l px-4 py-3 outline-none focus:border-bindu-orange transition-colors text-sm"
                required
              />
              <button type="submit" className="bg-bindu-orange text-white font-bold px-6 rounded-r hover:bg-[#e05d00] transition-colors uppercase tracking-widest text-sm shadow-md">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-bindu-border-grey/60">
            &copy; {new Date().getFullYear()} {storeName}. All Rights Reserved.
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">COD Delivery BD:</span>
            <span className="bg-[#E11D48] text-white text-[10px] font-bold px-2 py-1 rounded">bKash</span>
            <span className="bg-[#EA580C] text-white text-[10px] font-bold px-2 py-1 rounded">Nagad</span>
            <span className="bg-bindu-navy border border-white/20 text-white text-[10px] font-bold px-2 py-1 rounded">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
