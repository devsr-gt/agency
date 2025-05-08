import type { NextConfig } from "next";

/**
 * Next.js Configuration with SEO optimizations
 * - Implements trailing slash consistency (SEO Guidelines Tip #31)
 * - Sets up proper redirects for URL normalization
 */
const nextConfig: NextConfig = {
  // Configure trailing slashes - we choose to NOT have them for cleaner URLs
  // SEO Guidelines Tip #31: Pick whether you want trailing slashes or not and redirect between them
  trailingSlash: false,
  
  // Redirect any URLs with trailing slashes to non-trailing slash versions
  async redirects() {
    return [
      {
        source: '/:path*/',
        destination: '/:path*',
        permanent: true, // 301 redirect for better SEO
      },
    ];
  },
  
  // Ensure image optimization works correctly
  images: {
    domains: ['sevenslegal.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
