import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import Analytics from "@/components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import prisma from "@/lib/prisma";
import NextTopLoader from "nextjs-toploader";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-heading" });
const poppins = Poppins({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-mono" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bindupremium.com"

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
}

export async function generateMetadata(): Promise<Metadata> {
  let siteTitle = "Bindu Premium | The New Standard"
  let siteDescription = "A Bangladeshi premium fashion brand. Export quality fabrics, precise fits, and uncompromising attention to detail."
  let storeName = "Bindu Premium"

  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: ["meta_title", "meta_description", "store_name"] } },
    })
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))
    if (map["meta_title"]) siteTitle = map["meta_title"]
    if (map["meta_description"]) siteDescription = map["meta_description"]
    if (map["store_name"]) storeName = map["store_name"]
  } catch { /* DB unavailable — use defaults */ }

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteTitle,
      template: `%s | ${storeName}`,
    },
    description: siteDescription,
    keywords: ["premium clothing BD", "polos Bangladesh", "fashion brand Dhaka", "Bindu Premium", "buy premium t-shirt online BD"],
    authors: [{ name: storeName }],
    creator: storeName,
    openGraph: {
      type: "website",
      locale: "en_BD",
      url: SITE_URL,
      siteName: storeName,
      title: siteTitle,
      description: siteDescription,
      images: [{ url: "/api/og", width: 1200, height: 630, alt: `${storeName} — Premium Look. Better Fits.` }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      images: ["/api/og"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable, montserrat.variable, poppins.variable)}>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KQH2N6TS');`,
        }}
      />
      <body className="antialiased text-bindu-text-dark bg-bindu-light-grey selection:bg-bindu-orange/30">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KQH2N6TS"
            height="0" width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <NextTopLoader color="#FF6A00" height={3} showSpinner={false} shadow="0 0 10px #FF6A00,0 0 5px #FF6A00" />
        <Analytics />
        <VercelAnalytics />
        <SpeedInsights />
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
