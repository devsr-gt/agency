'use client';

import Head from 'next/head';
import { useRouter } from 'next/navigation';

/**
 * SEO Component
 * Manages meta tags, canonical URLs, and other SEO elements
 * Implements multiple SEO best practices from SEO-GUIDELINES.md
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.keywords - Keywords, comma separated
 * @param {string} props.canonicalPath - Path for canonical URL (optional)
 * @param {Object} props.openGraph - Open Graph data
 * @param {string} props.openGraph.title - OG title
 * @param {string} props.openGraph.description - OG description
 * @param {string} props.openGraph.image - OG image URL
 * @param {string} props.openGraph.type - OG type (default: website)
 * @param {Object} props.twitter - Twitter card data
 * @param {string} props.twitter.card - Twitter card type
 * @param {string} props.twitter.image - Twitter image URL
 * @returns {JSX.Element} - Head component with SEO elements
 */
export default function SEO({
  title,
  description,
  keywords,
  canonicalPath,
  openGraph = {},
  twitter = {}
}) {
  const router = useRouter();
  
  // Default the canonical URL to the current page if not specified
  const canonicalUrl = canonicalPath 
    ? `https://sevenslegal.com${canonicalPath}` 
    : `https://sevenslegal.com${router.asPath || '/'}`;
  
  // Ensure page titles follow SEO best practices (Tip #23)
  // First words are important words, brand name comes after
  const formattedTitle = title ? `${title} | Sevens Legal` : 'Sevens Legal | Expert Criminal Defense';
  
  // Set up Open Graph with defaults
  const og = {
    title: openGraph.title || formattedTitle,
    description: openGraph.description || description,
    type: openGraph.type || 'website',
    image: openGraph.image || 'https://sevenslegal.com/images/default-og-image.jpg',
    url: canonicalUrl,
    site_name: 'Sevens Legal'
  };
  
  // Set up Twitter card with defaults
  const tw = {
    card: twitter.card || 'summary_large_image',
    image: twitter.image || og.image
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Self-referential canonical (Tip #36) */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={og.title} />
      <meta property="og:description" content={og.description} />
      <meta property="og:type" content={og.type} />
      <meta property="og:url" content={og.url} />
      <meta property="og:image" content={og.image} />
      <meta property="og:site_name" content={og.site_name} />
      
      {/* Twitter Tags */}
      <meta name="twitter:card" content={tw.card} />
      <meta name="twitter:title" content={og.title} />
      <meta name="twitter:description" content={og.description} />
      <meta name="twitter:image" content={tw.image} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
}
