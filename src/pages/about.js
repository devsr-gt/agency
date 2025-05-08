import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Head from 'next/head';
import Script from 'next/script';
import { generateWebPageSchema } from '../utils/schemaMarkup';

/**
 * About page with enhanced SEO features
 * Implements best practices from SEO-GUIDELINES.md
 */
export default function About() {
  // Schema.org data for About page (Tip #54, #90)
  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://sevenslegal.com/about#webpage",
    "url": "https://sevenslegal.com/about",
    "name": "About Our Attorneys | Sevens Legal San Diego",
    "description": "Learn about our experienced criminal defense attorneys with over 40 years of combined experience defending clients in San Diego and surrounding areas.",
    "isPartOf": {
      "@id": "https://sevenslegal.com/#website"
    },
    "about": {
      "@id": "https://sevenslegal.com/#organization"
    },
    "primaryImageOfPage": {
      "@type": "ImageObject",
      "url": "https://sevenslegal.com/images/about-image-0-1746709414486.webp"
    },
    "datePublished": "2024-01-01T08:00:00+08:00",
    "dateModified": "2025-05-08T08:00:00+08:00"
  };
  return (
    <>
      {/* SEO Meta Tags (Tip #23, #36) */}
      <Head>
        <title>About Our Attorneys | Sevens Legal San Diego</title>
        <meta name="description" content="Learn about our experienced criminal defense attorneys with over 40 years of combined experience defending clients in San Diego and surrounding areas." />
        <meta name="keywords" content="criminal defense attorneys, san diego lawyers, legal team, experienced attorneys, defense lawyers, legal experience, criminal law specialists" />
        <link rel="canonical" href="https://sevenslegal.com/about" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="About Our Attorneys | Sevens Legal San Diego" />
        <meta property="og:description" content="Learn about our experienced criminal defense attorneys with over 40 years of combined experience defending clients in San Diego and surrounding areas." />
        <meta property="og:url" content="https://sevenslegal.com/about" />
        <meta property="og:image" content="https://sevenslegal.com/images/about-image-0-1746709414486.webp" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Our Attorneys | Sevens Legal San Diego" />
        <meta name="twitter:description" content="Learn about our experienced criminal defense attorneys with over 40 years of combined experience defending clients in San Diego and surrounding areas." />
        <meta name="twitter:image" content="https://sevenslegal.com/images/about-image-0-1746709414486.webp" />
      </Head>
      
      {/* Schema.org JSON-LD markup (Tip #54, #90) */}
      <Script
        id="about-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutPageSchema)
        }}
      />
      
      <div className="container mx-auto p-4">
        <ReactMarkdown
        components={{
          // Use a custom p component for images to avoid invalid nesting
          p: ({ node, children }) => {
            // Check if the paragraph contains only an image
            const hasOnlyImage = 
              node.children.length === 1 && 
              node.children[0].type === 'element' && 
              node.children[0].tagName === 'img';

            // If it's just an image, don't wrap it in a <p> tag
            if (hasOnlyImage) {
              return <>{children}</>;
            }
            // Otherwise, render as normal paragraph
            return <p>{children}</p>;
          },
          // Custom image component using Next.js Image
          img: ({ src, alt }) => (
            <figure className="my-4">
              <Image 
                src={src} 
                alt={alt || ''} 
                width={600} 
                height={400} 
                className="rounded-lg shadow-lg" 
              />
              {alt && <figcaption className="text-center text-sm text-gray-500 mt-2">{alt}</figcaption>}
            </figure>
          )
        }}
      >
        {`# About Sevens Legal, APC

Welcome to Sevens Legal, APC, where we provide expert criminal defense representation with dedication and compassion. With over 40 years of combined experience, our firm is committed to protecting your rights and achieving the best possible outcomes for your case.

## Our Firm History

Sevens Legal, APC was founded with the mission to deliver superior legal defense to individuals facing serious criminal charges. Our firm has grown significantly while maintaining a client-focused approach. We are proud of our track record in successfully defending a wide range of criminal cases, including DUI, domestic violence, drug charges, robbery, and white-collar crimes.

## Meet Our Attorneys

### Samantha Greene - Criminal Law Specialist

With a distinguished reputation as a criminal law specialist, Samantha Greene leads our team with skill and expertise. She is well-known for her strategic approach to criminal defense and her unwavering commitment to her clients. Samantha’s extensive knowledge and compassionate client service have made her a standout leader in the legal community.

![professional image of female attorney in courtroom, confident posture](/images/about-image-0-1746709414486.webp)

### John Doe - Senior Defense Attorney

John Doe brings a wealth of experience and a proven track record to the firm. His meticulous attention to detail and assertive courtroom presence make him an invaluable asset to our legal team. John's expertise spans across various criminal charges, ensuring comprehensive defense strategies for each unique case.

![professional image of male attorney at desk, focus and determination](/images/about-image-1-1746709432112.webp)

### Jane Smith - Associate Attorney

Jane Smith is known for her tenacity and dedication to achieving favorable results for her clients. As an associate attorney, she provides insightful legal counsel and is deeply committed to ongoing legal education to stay ahead in criminal defense strategies.

![attorney interacting with client in office, professional and welcoming atmosphere](/images/about-image-2-1746709446583.webp)

## Our Values and Approach

### Client-Centered Advocacy

At Sevens Legal, APC, we prioritize our clients' needs and concerns. Our attorneys are committed to maintaining open communication, ensuring that each client receives personalized attention and legal guidance tailored to their specific circumstance.

### Integrity and Diligence

Integrity is the cornerstone of our practice. We approach each case with honesty, transparency, and a thorough understanding of the law. Our team works diligently to build strong, defendable cases, employing innovative legal strategies to deliver successful outcomes.

### Community Involvement

Sevens Legal, APC is dedicated to giving back to the community we serve. Our attorneys actively participate in local initiatives to improve legal awareness and provide pro bono services to those in need. We believe in contributing to a just society through both our professional services and community engagement.

![group of attorneys at community event, engaging and informative setting](/images/about-image-3-1746709462828.webp)

---

Whether you are facing criminal charges or seeking guidance for someone who is, trust the seasoned professionals at Sevens Legal, APC to stand by your side. We are here to help you navigate complex legal challenges with confidence.

**Contact us today** to schedule a consultation and discuss your case. 

- **Phone:** (555) 123-4567
- **Email:** info@sevenslegal.com
- **Address:** 123 Legal Drive, San Diego, CA 92101`}
      </ReactMarkdown>
    </div>
  );
}