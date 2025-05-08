'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Breadcrumb navigation component
 * Displays breadcrumb navigation and creates proper structure for schema.org markup
 * 
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of breadcrumb items with name, path
 * @returns {JSX.Element} - Breadcrumb navigation
 */
export default function BreadcrumbNav({ items = [] }) {
  // Skip rendering if no items
  if (!items || items.length === 0) return null;

  return (
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
  );
}
