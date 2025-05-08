import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function Homepage() {
  return (
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
        {`# Welcome to Law Firm: Your Trusted Partner in Criminal Defense & Personal Injury

## Expertise You Can Rely On

At Law Firm, we specialize in providing top-tier legal representation in criminal defense and personal injury cases. Our experienced team is committed to delivering exceptional results through personalized strategies tailored to your unique circumstances. We stand by you every step of the way, ensuring that your rights are protected and your voice is heard.

## Our Services

### Criminal Defense
Our attorneys are well-versed in handling a wide range of criminal defense cases, from misdemeanors to serious felonies. We offer vigorous representation to safeguard your future.

### Personal Injury
If you've been injured due to someone else's negligence, our dedicated team will fight to secure the compensation you deserve. We handle cases involving auto accidents, slip and falls, medical malpractice, and more.

## Why Choose Us?

- **Proven Track Record:** We have a history of successful outcomes for our clients, driven by our tenacity and strategic legal approach.
- **Personalized Attention:** Every case is unique, and we provide tailored solutions that best fit your legal needs.
- **Expert Negotiators & Litigators:** Our skilled attorneys are adept at both negotiating settlements and litigating in court, ensuring optimal results.
- **Compassionate Advocacy:** We understand the emotional and financial stress legal issues can bring. Our team is here to support and guide you throughout the process.

## Take the First Step Towards Resolution

Contact us today for a free consultation and let us help you navigate your legal challenges with confidence.

### Get In Touch

Phone: (555) 123-4567  
Email: info@lawfirm.com  
Visit Us: 123 Main Street, Anytown, USA

![image of professional legal team in a modern office setting discussing case strategies with serious expressions and legal documents on the table](/images/homepage-image-0-1746667234394.webp)

Together, we'll fight for your rights and work diligently to achieve the best possible outcome for your case. Join the many satisfied clients who've found justice with our trusted legal team.`}
      </ReactMarkdown>
    </div>
  );
}