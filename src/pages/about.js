import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function About() {
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
        {`# About Law Firm

Welcome to Law Firm, where expert legal counsel meets compassionate client care. Our team specializes in criminal defense and personal injury, dedicated to providing aggressive advocacy and personalized service to each client we serve.

## Our Story

Founded over a decade ago, Law Firm began with a commitment to justice and a passion for defending the rights of individuals. From a modest start, we have grown into a respected institution known for our tenacity in the courtroom and our unwavering dedication to our clients. Our journey has been driven by the conviction that everyone deserves expert legal representation, no matter the challenge.

## Meet Our Attorneys

### Jane Doe: Senior Partner

Jane Doe brings over 20 years of legal experience, specializing in complex criminal defense cases. A graduate of Harvard Law School, Jane is renowned for her strategic thinking and unyielding pursuit of justice. Her insightful counsel and compelling advocacy have earned her numerous accolades and a reputation for excellence.

![image of a professional attorney in business attire reviewing legal documents at an elegant office desk](/images/about-image-0-1746667072844.webp)

### John Smith: Partner

John Smith, a formidable force in personal injury law, is committed to securing fair compensation for clients affected by negligence. With a keen eye for detail and a steadfast ethical compass, John has successfully represented thousands of clients, ensuring their voices are heard and their rights protected.

![image of a confident lawyer in discussions at a conference table](/images/about-image-1-1746667086626.webp)

## Our Values

At Law Firm, we adhere to a set of core values that guide our practice:

- **Integrity**: We maintain the highest ethical standards in all our dealings.
- **Client-First Approach**: We prioritize our clients' needs and tailor our strategies to best serve them.
- **Excellence in Advocacy**: We commit to delivering top-tier legal representation, constantly honing our skills and knowledge.

## Our Commitment to the Community

Law Firm believes in giving back to the community that has supported us throughout the years. Our attorneys actively participate in local outreach programs, pro bono work, and educational initiatives aimed at empowering and educating the public about their legal rights.

![image of diverse group of lawyers participating in a community legal outreach event](/images/about-image-2-1746667101169.webp)

## Contact Us

Ready to discuss your case with our team? Contact us today to schedule a consultation and let us help you navigate the legal landscape with confidence.

- **Phone**: (555) 123-4567
- **Email**: contact@lawfirm.com
- **Office Address**: 123 Justice Avenue, Suite 401, Cityville

At Law Firm, we are not just your attorneys; we are your dedicated partners in achieving justice.`}
      </ReactMarkdown>
    </div>
  );
}