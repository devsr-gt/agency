'use client';

import React from 'react';
import Script from 'next/script';
import Link from 'next/link';

/**
 * Breadcrumb component with schema.org markup
 * Displays breadcrumb navigation and adds structured data
 * 
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of breadcrumb items with name, path
 * @returns {JSX.Element} - Breadcrumb navigation with schema markup
 */
export default function Breadcrumb({ items }) {
  // Generate schema.org breadcrumb markup
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://sevenslegal.com${item.path}`
    }))
  };

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      
      <nav className="breadcrumbs text-sm py-4 text-gray-600 dark:text-gray-400" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2" aria-hidden="true">
                  /
                </span>
              )}
              {index === items.length - 1 ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link 
                  href={item.path}
                  className="hover:text-blue-700 dark:hover:text-blue-400"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
