/**
 * Schema Markup Utilities
 * Provides functions to generate schema.org JSON-LD markup for SEO
 * Follows guidelines in SEO-GUIDELINES.md (Tip #54, #90, #93)
 */

/**
 * Generates schema markup for the organization
 * @returns {Object} Organization schema
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": "https://sevenslegal.com/#organization",
    "name": "Sevens Legal",
    "url": "https://sevenslegal.com",
    "logo": {
      "@type": "ImageObject",
      "@id": "https://sevenslegal.com/#logo",
      "url": "https://sevenslegal.com/wumpus/logo.svg",
      "width": 180,
      "height": 60
    },
    "description": "Expert legal representation for criminal defense cases with over 40 years of combined experience",
    "telephone": "+1-555-123-4567",  // Replace with actual phone number
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Legal Street",  // Replace with actual address
      "addressLocality": "San Diego",
      "addressRegion": "CA",
      "postalCode": "92101",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://www.facebook.com/SevenLegal", 
      "https://twitter.com/SevenLegal",
      "https://www.linkedin.com/company/seven-legal"
    ],
    "openingHours": "Mo,Tu,We,Th,Fr 09:00-17:00",
    "priceRange": "$$$"
  };
}

/**
 * Generates schema markup for a webpage
 * @param {string} pageName - Name of the page
 * @param {string} pageDesc - Page description
 * @param {string} pageUrl - Full URL of the page
 * @param {string} imageUrl - Primary image URL
 * @returns {Object} WebPage schema
 */
export function generateWebPageSchema(pageName, pageDesc, pageUrl, imageUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    "url": pageUrl,
    "name": pageName,
    "description": pageDesc,
    "isPartOf": {
      "@id": "https://sevenslegal.com/#website"
    },
    "about": {
      "@id": "https://sevenslegal.com/#organization"
    },
    ...(imageUrl && {
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": imageUrl
      }
    }),
    "datePublished": "2024-01-01T08:00:00+08:00",
    "dateModified": new Date().toISOString()
  };
}

/**
 * Generates schema markup for legal services
 * @returns {Object} Service schema
 */
export function generateServicesSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Service",
          "name": "Criminal Defense",
          "url": "https://sevenslegal.com/services#criminal-defense",
          "provider": {
            "@id": "https://sevenslegal.com/#organization"
          },
          "description": "Comprehensive defense strategies for all criminal charges"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Service",
          "name": "DUI Defense",
          "url": "https://sevenslegal.com/services#dui-defense",
          "provider": {
            "@id": "https://sevenslegal.com/#organization"
          },
          "description": "Protecting your future against DUI charges"
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "Service",
          "name": "Domestic Violence",
          "url": "https://sevenslegal.com/services#domestic-violence",
          "provider": {
            "@id": "https://sevenslegal.com/#organization"
          },
          "description": "Sensitive and strategic defense for domestic cases"
        }
      },
      {
        "@type": "ListItem",
        "position": 4,
        "item": {
          "@type": "Service",
          "name": "Drug Charges",
          "url": "https://sevenslegal.com/services#drug-charges",
          "provider": {
            "@id": "https://sevenslegal.com/#organization"
          },
          "description": "Expert representation for all drug-related offenses"
        }
      }
    ]
  };
}

/**
 * Generates FAQ schema for FAQ sections
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

/**
 * Generates schema for an article or blog post
 * @param {Object} article - Article data
 * @returns {Object} Schema.org Article object
 */
export function generateArticleSchema({title, description, slug, image, publishDate, modifiedDate, author}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://sevenslegal.com/${slug || 'blog'}#article`,
    "headline": title,
    "description": description,
    "image": image || "https://sevenslegal.com/images/default-blog-image.jpg",
    "datePublished": publishDate || new Date().toISOString(),
    "dateModified": modifiedDate || new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": author || "Sevens Legal Team",
      "url": "https://sevenslegal.com/about"
    },
    "publisher": {
      "@id": "https://sevenslegal.com/#organization"
    }
  };
}

/**
 * Generates breadcrumb schema for navigation
 * @param {Array} items - Array of breadcrumb items with name and path
 * @returns {Object} Schema.org BreadcrumbList object
 */
export function generateBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://sevenslegal.com${item.path}`
    }))
  };
}
