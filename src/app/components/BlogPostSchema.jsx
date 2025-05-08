'use client';

import React from 'react';
import Script from 'next/script';

/**
 * BlogPost Schema component for adding article structured data
 * Implements best practices from SEO-GUIDELINES.md
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Blog post title
 * @param {string} props.description - Blog post description/excerpt
 * @param {string} props.slug - Blog post URL slug
 * @param {string} props.image - Featured image URL
 * @param {string} props.publishDate - ISO date string of publish date
 * @param {string} props.modifiedDate - ISO date string of last modified date
 * @param {string} props.authorName - Author's name
 * @param {string} props.authorUrl - Author's profile URL
 * @returns {JSX.Element} - Script with blog post schema markup
 */
export default function BlogPostSchema({
  title,
  description,
  slug,
  image,
  publishDate,
  modifiedDate = new Date().toISOString(),
  authorName = 'Sevens Legal Team',
  authorUrl = 'https://sevenslegal.com/about'
}) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://sevenslegal.com/blog/${slug}#article`,
    "headline": title,
    "description": description,
    "image": image || "https://sevenslegal.com/images/default-blog-image.jpg",
    "datePublished": publishDate,
    "dateModified": modifiedDate,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": authorUrl
    },
    "publisher": {
      "@id": "https://sevenslegal.com/#organization"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://sevenslegal.com/blog/${slug}`
    }
  };

  return (
    <Script
      id="blog-post-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(articleSchema)
      }}
    />
  );
}
