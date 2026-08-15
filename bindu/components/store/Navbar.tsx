"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingBag, Menu, X, ChevronDown, User } from "lucide-react"
import { useState, useEffect } from "react"
import { useCartStore } from "@/store/useCartStore"
import CartDrawer from "@/components/store/CartDrawer"
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

export default function Navbar({
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
      {/* Announcement Bar */}
      <div className="bg-bindu-navy text-bindu-white text-center py-2.5 px-4 text-[11px] md:text-xs font-semibold tracking-wider uppercase flex justify-center items-center gap-2 border-b border-white/10">
        {activeFlashSale && flashCountdown ? (
          <>
            <span>🔥 {activeFlashSale.name} LIVE! Ends in {flashCountdown}. Cash on Delivery Bangladesh.</span>
          </>
        ) : (
          <>
            <span>🔥 PREMIUM QUALITY EXPORT MENSWEAR. CASH ON DELIVERY BANGLADESH.</span>
          </>
        )}
        {freeShippingThreshold && (
          <span className="text-bindu-orange hidden md:inline">FREE shipping on orders over ৳{freeShippingThreshold}!</span>
        )}
      </div>

      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-bindu-border-grey shadow-sm">
        <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Left */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="bg-bindu-navy rounded flex items-center justify-center p-1.5 shadow-sm">
              <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8H20C23.5 8 26 10 26 13C26 15 24.5 16.5 22.5 17C25 17.5 27 19.5 27 23C27 26.5 24 29 20 29H12V8ZM17 12V16.5H19.5C21 16.5 22 15.5 22 14.25C22 13 21 12 19.5 12H17ZM17 20.5V25H20.5C22 25 23 24 23 22.75C23 21.5 22 20.5 20.5 20.5H17Z" fill="white" stroke="white" strokeWidth="1.5"/>
              </svg>
            </div>
            <span className="font-heading text-xl font-extrabold tracking-widest text-bindu-navy">
              BINDU<span className="text-bindu-orange">PREMIUM</span>
            </span>
          </Link>

          {/* Desktop Nav Center */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            <Link href="/" className={`text-[13px] font-semibold uppercase transition-colors ${pathname === "/" ? "text-bindu-orange" : "text-bindu-text-dark hover:text-bindu-orange"}`}>
              Home
            </Link>
            
            <div className="relative group">
              <button className={`flex items-center gap-1 text-[13px] font-semibold uppercase py-2 transition-colors ${pathname.startsWith("/shop") ? "text-bindu-orange" : "text-bindu-text-dark hover:text-bindu-orange"}`}>
                Shop <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                <div className="bg-white border border-bindu-border-grey shadow-bindu rounded-md min-w-[200px] py-2 flex flex-col">
                  {navCategories.map((cat) => (
                    <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-bindu-text-dark hover:text-bindu-orange hover:bg-bindu-light-grey transition-colors">
                      {cat.name}
                    </Link>
                  ))}
                  <div className="border-t border-bindu-border-grey my-1"></div>
                  <Link href="/shop" className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-bindu-text-muted hover:text-bindu-orange hover:bg-bindu-light-grey transition-colors">
                    All Products →
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/shop?category=graphic-tees" className={`text-[13px] font-semibold uppercase transition-colors ${pathname.includes("graphic-tees") ? "text-bindu-orange" : "text-bindu-text-dark hover:text-bindu-orange"}`}>
              Graphic Tees
            </Link>
            <Link href="/shop?category=hoodies" className={`text-[13px] font-semibold uppercase transition-colors ${pathname.includes("hoodies") ? "text-bindu-orange" : "text-bindu-text-dark hover:text-bindu-orange"}`}>
              Hoodies
            </Link>
            <Link href="/size-guide" className={`text-[13px] font-semibold uppercase transition-colors ${pathname === "/size-guide" ? "text-bindu-orange" : "text-bindu-text-dark hover:text-bindu-orange"}`}>
              Size Guide
            </Link>
            <Link href="/contact" className={`text-[13px] font-semibold uppercase transition-colors ${pathname === "/contact" ? "text-bindu-orange" : "text-bindu-text-dark hover:text-bindu-orange"}`}>
              Contact
            </Link>
          </nav>

          {/* Action Icons Right */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <button onClick={() => setSearchOpen(true)} className="p-2 text-bindu-navy hover:text-bindu-orange transition-colors" aria-label="Search">
              <Search className="w-[22px] h-[22px] md:w-6 md:h-6" strokeWidth={2.5} />
            </button>
            
            <Link href="/login" className="hidden md:flex p-2 text-bindu-navy hover:text-bindu-orange transition-colors" aria-label="Account">
              <User className="w-6 h-6" strokeWidth={2.5} />
            </Link>

            <CartDrawer itemCount={itemCount} freeShippingThreshold={freeShippingThreshold ?? undefined} />

            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-bindu-navy" aria-label="Menu">
              <Menu className="w-7 h-7" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex justify-end">
          <div className="absolute inset-0 bg-bindu-navy/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-[300px] h-full bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="flex items-center justify-between px-6 py-5 border-b border-bindu-border-grey">
              <span className="font-heading text-lg font-extrabold tracking-widest text-bindu-navy">
                BINDU<span className="text-bindu-orange">PREMIUM</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="text-bindu-text-muted hover:text-bindu-navy">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
              <Link href="/" onClick={() => setMobileOpen(false)} className="text-[15px] font-bold uppercase tracking-wide text-bindu-navy">
                Home
              </Link>
              
              <div className="flex flex-col gap-4">
                <button onClick={() => setShopOpen(!shopOpen)} className="flex items-center justify-between text-[15px] font-bold uppercase tracking-wide text-bindu-navy">
                  Shop <ChevronDown className={`w-4 h-4 transition-transform ${shopOpen ? "rotate-180" : ""}`} />
                </button>
                {shopOpen && (
                  <div className="flex flex-col gap-3 pl-4 border-l-2 border-bindu-orange/20 ml-1">
                    {navCategories.map(cat => (
                      <Link key={cat.id} href={`/shop?category=${cat.slug}`} onClick={() => setMobileOpen(false)} className="text-sm font-semibold uppercase text-bindu-text-muted">
                        {cat.name}
                      </Link>
                    ))}
                    <Link href="/shop" onClick={() => setMobileOpen(false)} className="text-sm font-semibold uppercase text-bindu-orange mt-2">
                      All Products →
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/shop?category=graphic-tees" onClick={() => setMobileOpen(false)} className="text-[15px] font-bold uppercase tracking-wide text-bindu-navy">
                Graphic Tees
              </Link>
              <Link href="/shop?category=hoodies" onClick={() => setMobileOpen(false)} className="text-[15px] font-bold uppercase tracking-wide text-bindu-navy">
                Hoodies
              </Link>
              <Link href="/size-guide" onClick={() => setMobileOpen(false)} className="text-[15px] font-bold uppercase tracking-wide text-bindu-navy">
                Size Guide
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="text-[15px] font-bold uppercase tracking-wide text-bindu-navy">
                Contact
              </Link>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="text-[15px] font-bold uppercase tracking-wide text-bindu-navy">
                Account
              </Link>
            </nav>

            <div className="p-6 bg-bindu-light-grey border-t border-bindu-border-grey mt-auto">
              <p className="text-xs font-semibold text-bindu-text-muted uppercase tracking-widest mb-1">{storeTagline}</p>
              <p className="text-[10px] text-bindu-text-muted">Made in Bangladesh</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
