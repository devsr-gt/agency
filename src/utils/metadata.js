/**
 * SEO Metadata Utilities
 * Functions to generate optimized metadata for different page types
 * Follows SEO guidelines provided in SEO-GUIDELINES.md
 */

/**
 * Generate metadata for a page
 * @param {Object} options - Metadata options
 * @param {string} options.title - Page title
 * @param {string} options.description - Page description
 * @param {string} options.path - Page path (relative URL, e.g., /about)
 * @param {string[]} options.keywords - Keywords for the page
 * @param {Object} options.openGraph - Open Graph overrides
 * @param {string} options.image - Image for OpenGraph and Twitter cards
 * @returns {Object} Next.js metadata object
 */
export function generateMetadata({
  title,
  description,
  path,
  keywords = [],
  openGraph = {},
  image,
}) {
  const url = `https://sevenslegal.com${path}`;
  
  // Ensure page titles follow SEO best practices (Tip #23)
  // First words are important words, brand name comes after
  const pageTitle = title ? `${title} | Sevens Legal` : 'Expert Criminal Defense | Sevens Legal';
  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords;
  
  return {
    title: pageTitle,
    description,
    keywords: keywordsString,
    alternates: {
      canonical: url,  // Self-referential canonical (Tip #36)
    },
    openGraph: {
      title: openGraph.title || pageTitle,
      description: openGraph.description || description,
      url,
      siteName: 'Sevens Legal',
      locale: 'en_US',
      type: 'website',
      ...(image && {
        images: [{
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        }],
      }),
      ...openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: openGraph.title || pageTitle,
      description: openGraph.description || description,
      creator: '@SevenLegal',
      ...(image && {
        images: [image],
      }),
    },
  };
}

/**
 * Generate schema.org JSON-LD data for articles 
 * @param {Object} article - Article data
 * @returns {Object} Schema.org Article object
 */
export function generateArticleSchema(article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://sevenslegal.com/${article.slug}#article`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://sevenslegal.com/${article.slug}`
    },
    "headline": article.title,
    "description": article.description,
    "image": article.image || "https://sevenslegal.com/images/default-image.jpg",
    "datePublished": article.publishDate,
    "dateModified": article.modifiedDate || article.publishDate,
    "author": {
      "@type": "Person",
      "name": article.author || "Sevens Legal Team",
      "url": "https://sevenslegal.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://sevenslegal.com/#organization",
      "name": "Sevens Legal",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sevenslegal.com/wumpus/logo.svg"
      }
    }
  };
}

/**
 * Generate schema.org JSON-LD data for service pages
 * @param {Object} service - Service data  
 * @returns {Object} Schema.org Service object
 */
export function generateServiceSchema(service) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `https://sevenslegal.com/services/${service.slug}#service`,
    "name": service.title,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "@id": "https://sevenslegal.com/#organization"
    },
    "areaServed": {
      "@type": "City",
      "name": "San Diego" 
    },
    "serviceType": service.type || "Legal Representation"
  };
}

/**
 * Generate FAQ Schema for FAQ sections
 * @param {Array} faqs - Array of FAQ objects with question and answer
 * @returns {Object} Schema.org FAQPage object
 */
export function generateFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}
