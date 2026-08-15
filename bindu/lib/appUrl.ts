/**
 * The canonical public URL of this app.
 * Set NEXT_PUBLIC_SITE_URL in your Vercel environment variables.
 */
export const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_ENV === "production"
    ? "https://bindupremiumbd.com"
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
