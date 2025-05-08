'use client';

import React from 'react';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';
import BreadcrumbNav from './BreadcrumbNav';
import { generateArticleSchema } from '../../utils/schemaMarkup';

/**
 * BlogPostLayout component
 * Provides consistent structure and SEO implementation for blog posts
 * 
 * @param {Object} props - Component props
 * @param {Object} props.post - Blog post data
 * @param {ReactNode} props.children - Child components
 * @returns {JSX.Element} - Blog post with schema markup
 */
export default function BlogPostLayout({ post, children }) {
  if (!post) return null;
  
  const {
    title,
    slug,
    description,
    publishDate,
    modifiedDate,
    author = 'Sevens Legal Team',
    featuredImage,
    categories = []
  } = post;
  
  // Generate article schema
  const articleSchema = generateArticleSchema({
    title,
    description,
    slug,
    image: featuredImage,
    publishDate,
    modifiedDate,
    author
  });
  
  // Generate breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: title, path: `/blog/${slug}` }
  ];
  
  return (
    <div className="blog-post-container max-w-4xl mx-auto px-4 py-8">
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema)
        }}
      />
      
      {/* Breadcrumb navigation */}
      <BreadcrumbNav items={breadcrumbItems} />
      
      <article className="blog-post">
        {/* Post header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          
          {/* Author and date info */}
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
            <span className="mr-4">By {author}</span>
            <time dateTime={publishDate}>
              {new Date(publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {modifiedDate && modifiedDate !== publishDate && (
              <span className="ml-4">
                (Updated: {new Date(modifiedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })})
              </span>
            )}
          </div>
          
          {/* Categories */}
          {categories.length > 0 && (
            <div className="mb-6">
              {categories.map(category => (
                <Link 
                  key={category} 
                  href={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="mr-2 inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm"
                >
                  {category}
                </Link>
              ))}
            </div>
          )}
          
          {/* Featured image with alt text */}
          {featuredImage && (
            <div className="featured-image mb-8">
              <Image
                src={featuredImage}
                alt={`${title} - Featured image`}
                width={1200}
                height={630}
                className="rounded-lg shadow-md w-full h-auto"
                priority={true}
              />
            </div>
          )}
        </header>
        
        {/* Post content */}
        <div className="blog-content prose prose-lg dark:prose-invert max-w-none">
          {children}
        </div>
        
        {/* Call to action */}
        <div className="call-to-action mt-12 p-6 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <h3 className="text-xl font-bold mb-3">Need Legal Assistance?</h3>
          <p className="mb-4">Contact Sevens Legal for expert criminal defense representation.</p>
          <Link 
            href="/contact" 
            className="inline-block bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Schedule a Free Consultation
          </Link>
        </div>
      </article>
    </div>
  );
}
