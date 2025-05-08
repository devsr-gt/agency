import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function Blog() {
  return (
    <div className="container mx-auto p-4">
      <ReactMarkdown
        components={{
          // Fix for hydration error: p > div is invalid HTML
          p: ({ node, children }) => {
            // Check if children contains an img element
            const hasImageChild = node?.children?.some(
              child => child.type === 'element' && child.tagName === 'img'
            );
            
            // If there's an image child, we return a div instead of p to avoid nesting issues
            return hasImageChild ? <div>{children}</div> : <p>{children}</p>;
          },
          img: ({ src, alt }) => (
            <div className="my-4">
              <Image 
                src={src} 
                alt={alt || ''} 
                width={600} 
                height={400} 
                className="rounded-lg shadow-lg" 
              />
            </div>
          )
        }}
      >
        {`# Law Firm Blog

## Welcome to Our Legal Insights Blog

At Law Firm, our dedication to excellence in criminal defense and personal injury law empowers us to provide top-tier legal services. Our blog is crafted to offer valuable insights, updates on legal trends, and guidance on navigating the complexities of the legal system. Whether you're a potential client seeking information or a professional interested in legal developments, our blog is designed to meet your needs. 

## Latest Blog Posts

### Understanding Your Rights During a Criminal Investigation

Navigating the complexities of a criminal investigation can be daunting. Knowing your rights and understanding how to exercise them is crucial. In this post, we explore the rights you have during an investigation, including the right to remain silent and the right to legal representation. 

Read more to empower yourself with essential knowledge that can protect your future. 

![image of a lawyer advising a client with law books and papers on a wooden desk](/images/blog-image-0-1746663301824.webp)

### Tips for Securing a Fair Personal Injury Settlement

Securing a fair settlement after a personal injury can significantly impact your recovery and future well-being. Our experts share strategic tips for maximizing your compensation, from gathering evidence to negotiating assertively with insurance companies. 

Explore our insights to enhance your settlement negotiations effectively.

![image of an attorney and client examining legal documents in a modern office](/images/blog-image-1-1746663317344.webp)

### The Impact of New Legislation on Criminal Defense

Stay informed about the latest legal legislation and its implications for criminal defense. Our analysis covers recent changes in laws that may affect defense strategies and client rights. Understanding these shifts is vital for both clients and practitioners alike. 

Dive deep into our detailed legislative analysis.

![image showing a group of lawyers in a meeting, with legislative documents and a whiteboard](/images/blog-image-2-1746663333526.webp)

## Get Expert Legal Advice Today

In need of expert legal consultation? Our team of seasoned attorneys is here to support you with personalized advice and representation. Contact us today to schedule a consultation:

**Phone:** (555) 123-4567  
**Email:** contact@lawfirm.com  
**Visit Us:** 123 Justice Lane, Cityville

Join our newsletter to stay updated with the latest legal insights and firm news straight to your inbox!

---

We invite you to browse our blog and connect with us for unparalleled legal services tailored to your needs.`}
      </ReactMarkdown>
    </div>
  );
}