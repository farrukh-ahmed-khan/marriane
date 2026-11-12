import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a production build run next to `npm run dev` (NEXT_DIST_DIR=.next-build npm run build).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Keep the same URLs as the WordPress site (/county-tags/baker-county/).
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Old WordPress archive URLs that just pointed back to listings.
      { source: "/capers", destination: "/capers-categories/", permanent: true },
      { source: "/county-categories", destination: "/capers-categories/", permanent: true },
    ];
  },
};

export default nextConfig;
