import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function Homepage() {
  return (
    <div className="container mx-auto p-4">
      <ReactMarkdown
        components={{
          // Use p to unwrap images from paragraphs
          p: ({ node, children }) => {
            // Check if the paragraph contains only an image
            const hasOnlyImage = node.children.length === 1 && 
              node.children[0].type === 'element' && 
              node.children[0].tagName === 'img';
              
            // If it's just an image, don't wrap in <p>
            if (hasOnlyImage) {
              return <>{children}</>;
            }
            
            // Regular paragraph
            return <p>{children}</p>;
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
        {`# Welcome to [Firm Name] - Your Trusted Legal Partner

At [Firm Name], we understand that facing legal challenges can be daunting. Whether you're dealing with a criminal charge or seeking justice for a personal injury, our dedicated team is here to provide the expert guidance and support you need. With over [X] years of experience, we pride ourselves on delivering personalized legal solutions that achieve the best outcomes for our clients.

![a diverse group of professionally dressed lawyers sitting around a conference table discussing case files in a modern law office](/images/homepage-image-0-1746661100843.webp)

## Our Practice Areas

### Criminal Defense
Our attorneys are well-versed in all aspects of criminal law and are committed to protecting your rights. We handle a wide range of cases, including DUI, drug offenses, and white-collar crimes. Let us stand by your side and fight for your freedom.

### Personal Injury
If you've been injured due to someone else's negligence, you deserve compensation. Our experienced personal injury lawyers focus on cases such as auto accidents, medical malpractice, and slip-and-fall injuries. We work tirelessly to ensure you receive the justice and compensation you're entitled to.

## Why Choose [Firm Name]?

- **Proven Track Record:** With a history of successful verdicts and settlements, we consistently achieve favorable outcomes for our clients.
- **Personalized Attention:** We treat each case uniquely, providing tailored strategies to meet your specific legal needs.
- **Compassionate Representation:** Our attorneys are dedicated advocates who prioritize your well-being and strive to build a strong attorney-client relationship.
- **Free Consultation:** We'll evaluate your case at no cost and provide clear guidance on your legal options.

## Take the First Step Toward Justice

Don't face your legal challenges alone. Contact [Firm Name] today to schedule your free consultation with one of our skilled attorneys. Let us put our experience to work for you.

**Call us at [Phone Number] or fill out our online contact form [here](link to contact form).**

![a welcoming meeting between a lawyer and a client, shaking hands across a desk in a bright, professional office](/images/homepage-image-1-1746661115269.webp)

Your journey to justice starts with a conversation. Reach out to [Firm Name] and take confidence in knowing you have a formidable ally by your side.`}
      </ReactMarkdown>
    </div>
  );
}