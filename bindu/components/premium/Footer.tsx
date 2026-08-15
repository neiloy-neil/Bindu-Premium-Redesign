"use client";
import Link from "next/link";
import Image from "next/image";

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

export default function PremiumFooter({
  branding,
  categories = [],
}: {
  branding?: Partial<Branding>
  categories?: FooterCategory[]
}) {
  const storeName = branding?.storeName || "Bindu Premium"
  const supportEmail = branding?.supportEmail || "support@bindupremium.com"
  const socialFacebook = branding?.socialFacebook || "https://facebook.com/bindufashionbd"
  const socialInstagram = branding?.socialInstagram || "https://instagram.com/bindu_wearbd"

  return (
    <footer className="bg-bindu-navy text-bindu-white border-t border-bindu-navy">
      <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Column 1: Brand / Newsletter */}
          <div className="space-y-8 lg:col-span-2">
            <div>
               <Image 
                 src="/Bindu-premium-logo-in-White-BG.png" 
                 alt="Bindu Premium Logo" 
                 width={160} 
                 height={45} 
                 className="object-contain mb-4 bg-white p-1 rounded-sm"
               />
               <p className="text-[11px] uppercase tracking-widest text-bindu-border-grey/80">Style, Within. Premium Menswear.</p>
            </div>
            
            <div className="max-w-md space-y-4">
              <p className="text-sm text-bindu-border-grey/70 leading-relaxed">
                Subscribe to our newsletter for exclusive access to new drops, private sales, and editorial campaigns.
              </p>
              <form className="flex border-b border-bindu-border-grey/30 focus-within:border-bindu-white transition-colors" onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}>
                <input 
                  type="email" 
                  placeholder="EMAIL ADDRESS" 
                  className="w-full bg-transparent text-bindu-white py-3 outline-none text-xs uppercase tracking-widest placeholder:text-bindu-border-grey/40"
                  required
                />
                <button type="submit" className="text-[10px] font-bold text-bindu-white uppercase tracking-widest py-3 px-4 hover:text-bindu-orange transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="space-y-6">
            <h3 className="font-heading font-bold text-[11px] tracking-widest text-bindu-border-grey uppercase">Shop</h3>
            <ul className="space-y-4 text-xs font-medium tracking-wide">
              <li><Link href="/shop" className="hover:text-bindu-orange transition-colors text-bindu-white">All Collections</Link></li>
              {categories.slice(0, 4).map(cat => (
                 <li key={cat.id}><Link href={`/shop?category=${cat.slug}`} className="hover:text-bindu-orange transition-colors text-bindu-white">{cat.name}</Link></li>
              ))}
              <li><Link href="/lookbook" className="hover:text-bindu-orange transition-colors text-bindu-white">Lookbook</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Social */}
          <div className="space-y-6">
            <h3 className="font-heading font-bold text-[11px] tracking-widest text-bindu-border-grey uppercase">Client Care</h3>
            <ul className="space-y-4 text-xs font-medium tracking-wide">
              <li><Link href="/contact" className="hover:text-bindu-orange transition-colors text-bindu-white">Contact Us</Link></li>
              <li><Link href="/shipping-returns" className="hover:text-bindu-orange transition-colors text-bindu-white">Shipping & Returns</Link></li>
              <li><Link href="/size-guide" className="hover:text-bindu-orange transition-colors text-bindu-white">Size Guide</Link></li>
              <li><Link href="/faq" className="hover:text-bindu-orange transition-colors text-bindu-white">FAQ</Link></li>
            </ul>
            
            <div className="pt-4 flex gap-4">
              {socialInstagram && (
                <a href={socialInstagram} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest hover:text-bindu-orange transition-colors" aria-label="Instagram">
                  Instagram
                </a>
              )}
              {socialFacebook && (
                <a href={socialFacebook} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest hover:text-bindu-orange transition-colors" aria-label="Facebook">
                  Facebook
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[10px] uppercase tracking-widest text-bindu-border-grey/60 font-medium">
            &copy; {new Date().getFullYear()} {storeName}. All Rights Reserved.
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-[10px] uppercase tracking-widest text-bindu-border-grey/60 hover:text-bindu-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[10px] uppercase tracking-widest text-bindu-border-grey/60 hover:text-bindu-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
