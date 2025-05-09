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
        {`# Welcome to Sevens Legal, APC: Your Criminal Defense Experts

![A polished courtroom interior with sunlight casting a halo over a gavel and scales of justice placed prominently on a wooden desk](/images/homepage-image-0-1746709579282.webp)

At Sevens Legal, APC, we understand that facing criminal charges can be one of the most daunting experiences of your life. With over 40 years of combined experience in Criminal Defense, our expert team is here to provide you with unparalleled legal representation and peace of mind. Led by Samantha Greene, a renowned criminal law specialist, we are committed to defending your rights and crafting a strategic approach tailored to your unique situation.

## Comprehensive Legal Services

Our firm specializes in:

- **Criminal Defense:** Protect your future with strategic defenses against any criminal charge.
- **DUI:** Safeguard your driving privileges and seek a reduction or dismissal of charges.
- **Domestic Violence:** Navigate sensitive cases with discretion and thorough defense strategies.
- **Drug Charges:** Challenge charges with in-depth understanding of drug-related laws.
- **Robbery:** Construct solid defenses aimed at reducing or eliminating severe penalties.
- **White Collar Crimes:** Defend against intricate financial crimes with a focus on preserving your reputation.
- **Theft:** Employ detailed investigative tactics to mitigate charges and consequences.
- **Assault and Battery:** Employ aggressive defenses for charges stemming from physical altercations.

## Why Choose Sevens Legal?

- **Expertise You Can Trust:** With over four decades of combined experience, our legal team has a proven track record of success in defending a wide array of criminal charges.
- **Specialized Knowledge:** Samantha Greene, our criminal law specialist, brings unmatched legal acumen and a personalized approach to each case.
- **Dedication to Clients:** We are committed to open communication, tenacious representation, and exceptional client service.

## Your Defense Starts Here

![A professional lawyer standing confidently, shaking hands with a relieved client in a modern law office setting](/images/homepage-image-1-1746709596274.webp)

Don't leave your future to chance. Contact Sevens Legal, APC today for a confidential consultation to discuss your case and explore your legal options. Our seasoned attorneys are ready to fight for you every step of the way.

### Schedule Your Free Consultation Now

Call us at **(619) 297-2800** or complete our [contact form](#) to begin the process of securing your defense with Sevens Legal, APC. Let us provide you with the expertise and dedication you deserve.`}
      </ReactMarkdown>
    </div>
  );
}