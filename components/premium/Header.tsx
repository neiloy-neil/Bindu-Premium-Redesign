"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Search, Menu, X, ChevronDown, User } from "lucide-react"
import { useState, useEffect } from "react"
import { useCartStore } from "@/store/useCartStore"
import PremiumCartDrawer from "@/components/premium/CartDrawer"
import SearchModal from "@/components/store/SearchModal"

type NavCategory = { id: string; name: string; slug: string }
type NavFlashSale = { name: string; discountType: string; discountValue: number; endsAt: string }

function useCountdown(endsAt: string) {
  const [label, setLabel] = useState("")
  useEffect(() => {
    const tick = () => {
      const diff = new Date(endsAt).getTime() - Date.now()
      if (diff <= 0) { setLabel(""); return }
      const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000)
      const pad = (n: number) => String(n).padStart(2, "0")
      setLabel(`${pad(h)}:${pad(m)}:${pad(s)}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endsAt])
  return label
}

export default function PremiumHeader({
  freeShippingThreshold = null,
  storeName = "Bindu Premium",
  storeTagline = "Wear The Arc",
  categories = [],
  activeFlashSale = null,
}: {
  freeShippingThreshold?: number | null
  storeName?: string
  storeTagline?: string
  categories?: NavCategory[]
  activeFlashSale?: NavFlashSale | null
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const itemCount = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0))
  const flashCountdown = useCountdown(activeFlashSale?.endsAt || "")

  const navCategories = categories.filter((c) => c.slug !== "sale").slice(0, 6)

  return (
    <>
      {/* Premium Announcement Bar */}
      <div className="bg-bindu-navy text-bindu-white text-center py-2 px-4 text-[10px] md:text-xs font-semibold tracking-widest uppercase flex justify-center items-center gap-4">
        {activeFlashSale && flashCountdown ? (
          <span>{activeFlashSale.name} LIVE — Ends in {flashCountdown}</span>
        ) : (
          <span>STYLE, WITHIN. PREMIUM MENSWEAR.</span>
        )}
        {freeShippingThreshold && (
          <span className="text-bindu-border-grey hidden md:inline">FREE SHIPPING ABOVE ৳{freeShippingThreshold.toLocaleString()}</span>
        )}
      </div>

      <header className="sticky top-0 z-50 w-full bg-bindu-white border-b border-bindu-border-grey transition-all duration-300">
        <div className="container mx-auto px-4 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          
          {/* Logo Left */}
          <Link href="/" className="flex items-center shrink-0 group">
            <Image 
              src="/Bindu-premium-logo-in-White-BG.png" 
              alt="Bindu Premium Logo" 
              width={140} 
              height={40} 
              className="object-contain w-28 md:w-36 group-hover:opacity-80 transition-opacity"
              priority
            />
          </Link>

          {/* Desktop Nav Center */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            <Link href="/new-arrivals" className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${pathname === "/new-arrivals" ? "text-bindu-navy" : "text-bindu-text-muted hover:text-bindu-navy"}`}>New</Link>
            
            {/* PANJABI MEGA MENU */}
            <div className="relative group h-full flex items-center">
              <Link href="/panjabi" className={`text-[11px] font-bold uppercase tracking-widest py-6 transition-colors ${pathname.startsWith("/panjabi") ? "text-bindu-navy" : "text-bindu-text-muted group-hover:text-bindu-navy"}`}>Panjabi</Link>
              <div className="absolute top-full left-1/2 -translate-x-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 w-[400px]">
                <div className="bg-bindu-white border border-bindu-border-grey p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-[10px] font-bold text-bindu-navy uppercase tracking-widest mb-4 border-b border-bindu-border-grey pb-2">Shop</h4>
                    <ul className="space-y-3">
                      <li><Link href="/panjabi" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">All Panjabi</Link></li>
                      <li><Link href="/shop?category=panjabi&sort=new" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">New Arrivals</Link></li>
                      <li><Link href="/shop?category=panjabi&sort=best-selling" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">Best Sellers</Link></li>
                      <li><Link href="/shop?category=panjabi&sale=true" className="text-xs text-bindu-text-muted hover:text-bindu-orange transition-colors">Sale</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-bindu-navy uppercase tracking-widest mb-4 border-b border-bindu-border-grey pb-2">Collection</h4>
                    <ul className="space-y-3">
                      <li><Link href="/collections/eid" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">Eid</Link></li>
                      <li><Link href="/shop?category=panjabi" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">Premium</Link></li>
                      <li><Link href="/collections" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">Seasonal</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* POLO MEGA MENU */}
            <div className="relative group h-full flex items-center">
              <Link href="/polo" className={`text-[11px] font-bold uppercase tracking-widest py-6 transition-colors ${pathname.startsWith("/polo") ? "text-bindu-navy" : "text-bindu-text-muted group-hover:text-bindu-navy"}`}>Polo</Link>
              <div className="absolute top-full left-1/2 -translate-x-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 w-[200px]">
                <div className="bg-bindu-white border border-bindu-border-grey p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
                  <h4 className="text-[10px] font-bold text-bindu-navy uppercase tracking-widest mb-4 border-b border-bindu-border-grey pb-2">Shop</h4>
                  <ul className="space-y-3">
                    <li><Link href="/polo" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">All Polo</Link></li>
                    <li><Link href="/shop?category=polo&sort=new" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">New Arrivals</Link></li>
                    <li><Link href="/shop?category=polo&sort=best-selling" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">Best Sellers</Link></li>
                    <li><Link href="/shop?category=polo&sale=true" className="text-xs text-bindu-text-muted hover:text-bindu-orange transition-colors">Sale</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* T-SHIRTS MEGA MENU */}
            <div className="relative group h-full flex items-center">
              <Link href="/t-shirts" className={`text-[11px] font-bold uppercase tracking-widest py-6 transition-colors ${pathname.startsWith("/t-shirts") ? "text-bindu-navy" : "text-bindu-text-muted group-hover:text-bindu-navy"}`}>T-Shirts</Link>
              <div className="absolute top-full left-1/2 -translate-x-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 w-[200px]">
                <div className="bg-bindu-white border border-bindu-border-grey p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
                  <h4 className="text-[10px] font-bold text-bindu-navy uppercase tracking-widest mb-4 border-b border-bindu-border-grey pb-2">Shop</h4>
                  <ul className="space-y-3">
                    <li><Link href="/t-shirts" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">All T-Shirts</Link></li>
                    <li><Link href="/t-shirts" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">Basic</Link></li>
                    <li><Link href="/t-shirts" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">Premium</Link></li>
                    <li><Link href="/t-shirts" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">Graphic</Link></li>
                    <li><Link href="/t-shirts" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">Oversized</Link></li>
                    <li><Link href="/shop?category=t-shirts&sort=new" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">New Arrivals</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SHIRTS MEGA MENU */}
            <div className="relative group h-full flex items-center">
              <Link href="/shirts" className={`text-[11px] font-bold uppercase tracking-widest py-6 transition-colors ${pathname.startsWith("/shirts") ? "text-bindu-navy" : "text-bindu-text-muted group-hover:text-bindu-navy"}`}>Shirts</Link>
              <div className="absolute top-full left-1/2 -translate-x-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 w-[200px]">
                <div className="bg-bindu-white border border-bindu-border-grey p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
                  <h4 className="text-[10px] font-bold text-bindu-navy uppercase tracking-widest mb-4 border-b border-bindu-border-grey pb-2">Shop</h4>
                  <ul className="space-y-3">
                    <li><Link href="/shirts" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">All Shirts</Link></li>
                    <li><Link href="/shirts/formal" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">Formal</Link></li>
                    <li><Link href="/shirts/casual" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">Casual</Link></li>
                    <li><Link href="/shirts/full-sleeve" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">Full Sleeve</Link></li>
                    <li><Link href="/shirts/half-sleeve" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">Half Sleeve</Link></li>
                    <li><Link href="/shop?category=shirts&sort=new" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">New Arrivals</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <Link href="/accessories" className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${pathname === "/accessories" ? "text-bindu-navy" : "text-bindu-text-muted hover:text-bindu-navy"}`}>Accessories</Link>

            {/* COLLECTIONS MEGA MENU */}
            <div className="relative group h-full flex items-center">
              <Link href="/collections" className={`text-[11px] font-bold uppercase tracking-widest py-6 transition-colors ${pathname.startsWith("/collections") ? "text-bindu-navy" : "text-bindu-text-muted group-hover:text-bindu-navy"}`}>Collections</Link>
              <div className="absolute top-full left-1/2 -translate-x-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 w-[200px]">
                <div className="bg-bindu-white border border-bindu-border-grey p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
                  <ul className="space-y-3">
                    <li><Link href="/new-arrivals" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">New Arrivals</Link></li>
                    <li><Link href="/best-sellers" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">Best Sellers</Link></li>
                    <li><Link href="/collections/eid" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">Eid</Link></li>
                    <li><Link href="/collections/essentials" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">Essentials</Link></li>
                    <li><Link href="/campaigns" className="text-xs text-bindu-text-muted hover:text-bindu-navy transition-colors">Campaigns</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <Link href="/sale" className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${pathname === "/sale" ? "text-bindu-orange" : "text-bindu-text-muted hover:text-bindu-orange"}`}>Sale</Link>
          </nav>

          {/* Action Icons Right */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <button onClick={() => setSearchOpen(true)} className="text-bindu-navy hover:text-bindu-orange transition-colors hidden md:flex items-center gap-2" aria-label="Search">
              <Search className="w-5 h-5" strokeWidth={2} />
              <span className="text-[11px] font-bold uppercase tracking-widest hidden lg:inline-block mt-0.5">Search</span>
            </button>
            
            <Link href="/login" className="hidden md:flex text-bindu-navy hover:text-bindu-orange transition-colors items-center gap-2" aria-label="Account">
              <User className="w-5 h-5" strokeWidth={2} />
              <span className="text-[11px] font-bold uppercase tracking-widest hidden lg:inline-block mt-0.5">Account</span>
            </Link>

            {/* Mobile Search */}
            <button onClick={() => setSearchOpen(true)} className="md:hidden text-bindu-navy" aria-label="Search">
              <Search className="w-5 h-5" strokeWidth={2} />
            </button>

            <PremiumCartDrawer itemCount={itemCount} freeShippingThreshold={freeShippingThreshold ?? undefined} />

            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-bindu-navy ml-2" aria-label="Menu">
              <Menu className="w-6 h-6" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}

      {/* Premium Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex flex-col bg-bindu-white animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-4 h-16 border-b border-bindu-border-grey">
            <Image 
              src="/Bindu-premium-logo-in-White-BG.png" 
              alt="Bindu Premium Logo" 
              width={120} 
              height={32} 
              className="object-contain w-24"
            />
            <button onClick={() => setMobileOpen(false)} className="text-bindu-navy">
              <X className="w-6 h-6" strokeWidth={2} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-10 flex flex-col gap-8">
            <Link href="/new-arrivals" onClick={() => setMobileOpen(false)} className="text-lg font-heading font-medium text-bindu-navy">
              New
            </Link>
            <div className="flex flex-col gap-6">
              <button onClick={() => setShopOpen(!shopOpen)} className="flex items-center justify-between text-lg font-heading font-medium text-bindu-navy">
                Shop Categories <ChevronDown className={`w-5 h-5 transition-transform ${shopOpen ? "rotate-180" : ""}`} />
              </button>
              {shopOpen && (
                <div className="flex flex-col gap-4 pl-4 border-l border-bindu-border-grey">
                  <Link href="/panjabi" onClick={() => setMobileOpen(false)} className="text-sm font-bold uppercase tracking-widest text-bindu-text-muted hover:text-bindu-navy">Panjabi</Link>
                  <Link href="/polo" onClick={() => setMobileOpen(false)} className="text-sm font-bold uppercase tracking-widest text-bindu-text-muted hover:text-bindu-navy">Polo</Link>
                  <Link href="/t-shirts" onClick={() => setMobileOpen(false)} className="text-sm font-bold uppercase tracking-widest text-bindu-text-muted hover:text-bindu-navy">T-Shirts</Link>
                  <Link href="/shirts" onClick={() => setMobileOpen(false)} className="text-sm font-bold uppercase tracking-widest text-bindu-text-muted hover:text-bindu-navy">Shirts</Link>
                  <Link href="/accessories" onClick={() => setMobileOpen(false)} className="text-sm font-bold uppercase tracking-widest text-bindu-text-muted hover:text-bindu-navy">Accessories</Link>
                </div>
              )}
            </div>
            <Link href="/collections" onClick={() => setMobileOpen(false)} className="text-lg font-heading font-medium text-bindu-navy">
              Collections
            </Link>
            <Link href="/sale" onClick={() => setMobileOpen(false)} className="text-lg font-heading font-medium text-bindu-orange">
              Sale
            </Link>
            <Link href="/membership" onClick={() => setMobileOpen(false)} className="text-lg font-heading font-medium text-bindu-navy">
              Membership
            </Link>
            <Link href="/stores" onClick={() => setMobileOpen(false)} className="text-lg font-heading font-medium text-bindu-navy">
              Stores
            </Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="text-lg font-heading font-medium text-bindu-navy">
              About
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="text-lg font-heading font-medium text-bindu-navy">
              Contact
            </Link>
            <Link href="/login" onClick={() => setMobileOpen(false)} className="text-lg font-heading font-medium text-bindu-navy">
              Account
            </Link>
          </nav>

          <div className="p-6 bg-bindu-light-grey">
            <p className="text-[10px] font-bold text-bindu-text-muted uppercase tracking-widest">{storeTagline}</p>
          </div>
        </div>
      )}
    </>
  )
}
