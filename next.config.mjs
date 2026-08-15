/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/shop',
        has: [
          {
            type: 'query',
            key: 'category',
            value: '(?<slug>.*)',
          },
        ],
        permanent: true,
        destination: '/category/:slug',
      },
    ]
  },
  async rewrites() {
    return [
      { source: '/new-arrivals', destination: '/shop?sort=new' },
      { source: '/best-sellers', destination: '/shop?sort=best-selling' },
      { source: '/sale', destination: '/shop?sale=true' },
      { source: '/panjabi', destination: '/category/panjabi' },
      { source: '/polo', destination: '/category/polo' },
      { source: '/t-shirts', destination: '/category/t-shirts' },
      { source: '/shirts', destination: '/category/shirts' },
      { source: '/shirts/formal', destination: '/category/shirts-formal' },
      { source: '/shirts/casual', destination: '/category/shirts-casual' },
      { source: '/shirts/full-sleeve', destination: '/category/shirts-full-sleeve' },
      { source: '/shirts/half-sleeve', destination: '/category/shirts-half-sleeve' },
      { source: '/accessories', destination: '/category/accessories' },
      { source: '/product/:slug', destination: '/shop/:slug' },
      { source: '/search', destination: '/shop' },
    ]
  },
  images: {
    remotePatterns: [
      // Supabase Storage (any project)
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Unsplash (used in homepage featured banner)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Generic https fallback for user-supplied image URLs
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
