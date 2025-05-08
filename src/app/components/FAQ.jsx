'use client';

import React from 'react';

/**
 * FAQ Component for displaying FAQs with schema.org markup
 * Implements best practices from SEO-GUIDELINES.md (Tip #93)
 * 
 * @param {Object} props - Component props
 * @param {Array} props.faqs - Array of FAQ objects with question and answer properties
 * @returns {JSX.Element} - FAQ section with schema markup
 */
export default function FAQ({ faqs }) {
  // Create schema.org FAQ markup
  const faqSchema = {
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

  return (
    <section className="faq-section my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      
      <div className="faq-container">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
              <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
              <div 
                className="text-gray-600 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
