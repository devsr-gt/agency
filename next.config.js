/**
 * Next.js Configuration with SEO optimizations
 * - Implements trailing slash consistency (SEO Guidelines Tip #31)
 * - Sets up proper redirects for URL normalization
 * - Implements rewrites for blog posts to create flat URLs
 */
const nextConfig = {
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
      }
    ];
  },

  // Rewrites to achieve flat URLs while maintaining folder organization
  // This configuration allows:
  // - Blog posts to be stored in /blog/:slug folders for organization
  // - URLs to appear as /:slug for better SEO and user experience
  // - Maintains a clean separation between content and URLs
  async rewrites() {
    return [
      // Rewrite blog post URLs to maintain flat structure
      {
        source: '/:slug',
        destination: '/blog/:slug',
        // Don't apply this rewrite to known routes like /about, /services, etc.
        // This will work for blog posts that have unique slugs
      }
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

module.exports = nextConfig;
