'use client';

import React from 'react';
import FAQ from './FAQ';

/**
 * Client component for the HomePage FAQ section
 * Implements FAQ schema.org markup (Tip #93)
 */
export default function HomePageFAQ() {
  // FAQ data for the homepage
  const faqData = [
    {
      question: "How much does an initial consultation cost?",
      answer: "At Sevens Legal, we offer free initial consultations to discuss your case and legal options. This allows you to understand your situation and potential defense strategies without any financial commitment."
    },
    {
      question: "What types of criminal cases do you handle?",
      answer: "Our experienced attorneys handle a wide range of criminal cases including DUI defense, domestic violence charges, drug offenses, white-collar crimes, theft crimes, violent crimes, and federal criminal defense. We have over 40 years of combined experience defending clients in San Diego and surrounding areas."
    },
    {
      question: "How quickly can you begin working on my case?",
      answer: "We understand that time is critical in criminal defense cases. Our team can begin working on your case immediately after you retain our services. In emergency situations, we can often arrange same-day consultations and representation."
    },
    {
      question: "Will my case go to trial?",
      answer: "While many criminal cases are resolved through plea negotiations or dismissals before trial, we prepare every case as if it will go to trial. This thorough preparation often leads to better outcomes whether your case is settled or proceeds to court. Our attorneys are skilled litigators with extensive trial experience if your case does require a court hearing."
    },
    {
      question: "What sets Sevens Legal apart from other criminal defense firms?",
      answer: "Sevens Legal combines extensive legal experience with personalized attention. Unlike larger firms where clients may feel like just another case number, we provide dedicated representation and maintain open communication throughout your case. Our attorneys have a proven track record of successful outcomes and are respected within the San Diego legal community."
    }
  ];

  return <FAQ faqs={faqData} />;
}
