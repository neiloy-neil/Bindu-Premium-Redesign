import PremiumHeader from "@/components/premium/Header";
import PremiumFooter from "@/components/premium/Footer";
import PageTransitionOverlay from "@/components/store/PageTransitionOverlay";
import WishlistSync from "@/components/store/WishlistSync"
import AbandonedCartTracker from "@/components/store/AbandonedCartTracker";
import PixelPageView from "@/components/store/PixelPageView";
import { CompareBar } from "@/components/store/CompareBar";
import { Suspense } from "react";
import prisma from "@/lib/prisma";

const SETTING_KEYS = [
  "free_shipping_above",
  "store_name",
  "store_tagline",
  "store_description",
  "support_email",
  "support_phone",
  "social_facebook",
  "social_instagram",
  "social_tiktok",
]

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const now = new Date()
  const [settings, categories, sitewideSale] = await Promise.all([
    prisma.setting.findMany({ where: { key: { in: SETTING_KEYS } } }).catch(() => []),
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true },
    }).catch(() => []),
    prisma.flashSale.findFirst({
      where: { scope: "SITEWIDE", isActive: true, startsAt: { lte: now }, endsAt: { gte: now } },
      orderBy: { createdAt: "desc" },
    }).catch(() => null),
  ])

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]))
  const freeShippingThreshold = settingsMap.free_shipping_above ? parseInt(settingsMap.free_shipping_above, 10) : null

  const branding = {
    storeName: "Bindu Premium",
    storeTagline: "Wear The Arc",
    storeDescription:
      settingsMap.store_description ||
      "Bangladesh's premier premium fashion brand. Export quality menswear crafted for comfort, confidence, and style.",
    supportEmail: settingsMap.support_email || "support@bindupremium.com.bd",
    supportPhone: settingsMap.support_phone || "+880 1700 000000",
    socialFacebook: settingsMap.social_facebook || "https://www.facebook.com/bindupremium.bd/",
    socialInstagram: settingsMap.social_instagram || "https://www.instagram.com/bindu_wearbd",
    socialTiktok: settingsMap.social_tiktok || "",
  }

  return (
    <div className="min-h-screen flex flex-col bg-bindu-light-grey text-bindu-text-dark">
      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #F8F9FA; }
        ::-webkit-scrollbar-thumb { background: #071B3B; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #FF6A00; }
        * { scrollbar-width: thin; scrollbar-color: #071B3B #F8F9FA; }
      `}</style>
      <PageTransitionOverlay />
      <PremiumHeader
        freeShippingThreshold={freeShippingThreshold}
        storeName={branding.storeName}
        storeTagline={branding.storeTagline}
        categories={categories}
        activeFlashSale={sitewideSale ? {
          name: sitewideSale.name,
          discountType: sitewideSale.discountType,
          discountValue: Number(sitewideSale.discountValue),
          endsAt: sitewideSale.endsAt.toISOString(),
        } : null}
      />
      <WishlistSync />
      <AbandonedCartTracker />
      <Suspense fallback={null}><PixelPageView /></Suspense>
      <main className="flex-1">
        {children}
      </main>
      <PremiumFooter branding={branding} categories={categories} />
      <CompareBar />
    </div>
  );
}
