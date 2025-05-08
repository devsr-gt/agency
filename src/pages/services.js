import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function Services() {
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
        {`# Comprehensive Criminal Defense Services

At Sevens Legal, APC, we understand the gravity of facing criminal charges and are committed to providing expert legal representation tailored to your unique circumstances. With over 40 years of combined experience in criminal defense and led by criminal law specialist Samantha Greene, our team is prepared to fight for your rights across various legal arenas.

## DUI Defense

Navigating a DUI charge can be daunting, but with Sevens Legal, APC by your side, you receive aggressive representation aimed at minimizing the repercussions. Our proven track record in challenging blood alcohol tests and field sobriety results sets us apart. We work diligently to explore every legal avenue to protect your driving privileges and reduce potential penalties.

![realistic courtroom scene with a lawyer and client in focus](/images/services-image-0-1746709609589.webp)

## Domestic Violence Cases

Accusations of domestic violence can have significant personal and legal consequences. Our firm offers compassionate yet assertive defense strategies aimed at contesting protective orders and reducing charges. We understand the sensitive nature of these cases and strive to restore your reputation and safeguard your future.

![a lawyer sitting at a desk with a client discussing a case in a confidential setting](/images/services-image-1-1746709622533.webp)

## Drug Charges

Whether facing possession, distribution, or trafficking charges, Sevens Legal, APC provides a formidable defense for clients caught in drug-related legal matters. Our deep understanding of California’s drug laws enables us to negotiate effectively and, when possible, seek alternatives such as rehabilitation over incarceration.

![detailed view of legal documents related to drug charges on a lawyer's desk](/images/services-image-2-1746709638172.webp)

## Robbery and Theft Defense

Being charged with robbery or theft can impact your life significantly. Sevens Legal, APC has handled numerous cases with successful results, focusing on exhaustive case investigation and innovative defense tactics. We are dedicated to protecting your rights and achieving outcome-driven solutions.

![symbolic image of justice scales representing theft and robbery cases](/images/services-image-3-1746709650827.webp)

## White Collar Crimes

Complex financial and business-related crimes require knowledgeable and discreet handling. Our experts offer comprehensive defense for charges such as fraud, embezzlement, and money laundering. Sevens Legal, APC's strategic approach includes meticulous scrutiny of evidence to dismantle the prosecution’s case.

![legal team analyzing financial documents for a white-collar crime case](/images/services-image-4-1746709664264.webp)

## Assault and Battery

Defending clients against assault and battery charges demands not only legal expertise but also a robust approach to discussing intent and self-defense. With our experience, we construct compelling defenses to protect your rights and pursue the most favorable outcomes.

![an attorney confidently discussing a defense strategy with a client](/images/services-image-5-1746709682633.webp)

## Why Choose Sevens Legal, APC?

- Over 40 Years of Combined Criminal Defense Experience
- Specialized Knowledge in Criminal Law
- Proactive Defense Strategies and Customized Legal Solutions
- Proven Track Record of Successful Case Outcomes

## Contact Us

If you or someone you know is facing criminal charges, contact Sevens Legal, APC for a confidential consultation to discuss your case. Trust our experience and dedication to guide you through the complexities of the legal system. 

**Phone:** [Your Contact Number]  
**Email:** [Your Contact Email]  
**Visit Us:** [Firm Address]

Secure your legal future with confidence—reach out to Sevens Legal, APC today.`}
      </ReactMarkdown>
    </div>
  );
}