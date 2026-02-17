/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    /**
     * Disable fetch caching in development so Sanity content
     * changes are always reflected without needing to clear caches.
     * In production, Next.js default caching + webhook revalidation applies.
     */
    ...(process.env.NODE_ENV === "development" && {
      serverComponentsHmrCache: false,
    }),
  },
};

export default nextConfig;
