import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function About() {
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
        {`# About Us

## Our Story

Established with the mission to champion justice and provide unparalleled legal solutions, our firm has been a beacon of advocacy for individuals facing criminal charges and seeking personal injury restitution. For over two decades, we have dedicated ourselves to defending the rights of our clients with integrity and tenacity. Our story is one of growth, commitment, and a steadfast determination to make a difference in the lives of those we represent.

![professional law firm office, elegant and modern interiors](/images/about-image-0-1746660958152.webp)

## Meet Our Attorneys

### John A. Fitzgerald, Esq.

With a career spanning over 25 years, John A. Fitzgerald has established himself as a formidable force in criminal defense. Known for his sharp analytical skills and persuasive courtroom presence, John is dedicated to ensuring justice is served. His track record of successful defenses has earned him recognition as one of the top criminal defense attorneys.

![John A. Fitzgerald, seasoned attorney with confident demeanor in a legal setting](/images/about-image-1-1746660973930.webp)

### Emma R. Johnson, Esq.

Specializing in personal injury law, Emma R. Johnson combines compassion with a zealous advocacy to achieve the best outcomes for her clients. Her approach is both empathetic and strategic, navigating the complexities of personal injury cases with expertise and precision.

![Emma R. Johnson, compassionate attorney with warm approach, in a legal discussion](/images/about-image-2-1746660988066.webp)

## Our Values and Approach

At the heart of our practice are core values that guide our actions: integrity, dedication, and excellence. We believe in a personalized approach, taking the time to understand the unique circumstances of each case. Our attorneys work collaboratively to develop effective strategies tailored to the specific needs of our clients, ensuring they receive the best possible representation.

## Commitment to Community

We are proud to be active members of the community, regularly volunteering our time and resources to local initiatives. From pro bono legal clinics to sponsoring community events, our commitment goes beyond the courtroom. We believe in giving back and making a positive impact, supporting programs that promote access to justice and opportunities for all.

![community event with law firm volunteers engaging with local residents](/images/about-image-3-1746661006289.webp)

## Connect With Us

Whether you are facing criminal charges or seek compensation for a personal injury, we are here to support and fight for you. Contact us today to schedule a consultation with one of our experienced attorneys. Let us be your advocates in the pursuit of justice.

[Contact Us](yourwebsiteurl/contact) | [Call Us: 123-456-7890](tel:1234567890) | [Email: info@yourlawfirm.com](mailto:info@yourlawfirm.com)`}
      </ReactMarkdown>
    </div>
  );
}