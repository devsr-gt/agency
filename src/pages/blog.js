import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function Blog() {
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
        {`# Law Firm Blog

## Navigating the Complexities of Criminal Defense

Understanding your rights and options when facing criminal charges is critical. At [Law Firm Name], we are dedicated to protecting your future with strategic and informed defense strategies. In this article, we explore the key components of a strong criminal defense case and offer insights into the criminal justice process.

![professional lawyer in law library reviewing legal documents](/images/blog-image-0-1746661021542.webp)

## The Crucial Steps Following a Personal Injury

After suffering a personal injury, securing fair compensation is essential to cover medical expenses and support your recovery journey. Our experienced attorneys effectively advocate for our clients' rights, ensuring that they receive the justice they deserve. Join us as we discuss the essential steps to take after a personal injury incident and how our legal team can assist you every step of the way.

![personal injury victim consulting with a lawyer in office with legal books](/images/blog-image-1-1746661034953.webp)

## Understanding Your Rights: What To Do When Arrested

Being arrested can be a confusing and intimidating experience. Knowing your rights and how to exercise them is paramount. Our blog offers a comprehensive guide on what to do—and what not to do—when arrested, equipping you with the knowledge to navigate this challenging situation effectively.

![person consulting lawyer in police station with handcuffs visible on table](/images/blog-image-2-1746661047247.webp)

## The Role of Evidence in Building a Successful Case

Evidence is at the heart of every legal case, whether criminal or civil. Our firm excels at gathering and leveraging compelling evidence to support our clients' cases. Read on to learn how evidence can impact your case and the methodologies we use to ensure the best possible outcome.

![lawyer looking at evidence on desk with photos and documents under a lamp](/images/blog-image-3-1746661069847.webp)

## Contact Us

For personalized legal assistance and dedicated representation, reach out to us today. Whether you’re facing criminal charges or seeking compensation for a personal injury, [Law Firm Name] is here to provide the expert guidance you need. Contact us by phone at [Phone Number] or email us at [Email Address].

---

Stay informed with our latest updates and legal insights by visiting our blog regularly. For tailored advice regarding your specific situation, schedule a consultation with our legal team. We are committed to providing the highest level of service and expertise to achieve the best outcomes for our clients.`}
      </ReactMarkdown>
    </div>
  );
}