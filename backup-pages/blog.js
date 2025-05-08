import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function Blog() {
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
        {`# Sevens Legal, APC Blog: Insights into Criminal Defense

Welcome to the Sevens Legal, APC blog, your go-to resource for valuable information and insights into the world of criminal defense. Our team of dedicated attorneys, led by criminal law specialist Samantha Greene, has over 40 years of combined experience. We provide expert guidance and representation in cases involving DUIs, domestic violence, drug charges, robbery, white-collar crimes, theft, assault, and battery.

## Navigating Criminal Defense: What You Need to Know

When facing criminal charges, understanding the legal landscape is crucial. Our blog offers you the knowledge and tools needed to make informed decisions about your case.

### DUI Defense Strategies

Driving under the influence charges can drastically affect your life. Our attorneys delve into effective defense strategies that challenge DUI evidence and help you navigate legal complexities.

![courtroom scene with DUI case in progress, highlighting attorneys discussing evidence](/images/blog-image-0-1746709482001.webp)

### Understanding Domestic Violence Charges

Accusations of domestic violence carry severe penalties. Learn about your rights, possible defenses, and the legal process involved in these sensitive cases.

![professional setting with lawyers and clients in a meeting discussing domestic violence case](/images/blog-image-1-1746709498700.webp)

### Drug Charges and Your Defense

Drug charges range from simple possession to trafficking. Discover the latest legal defenses and strategies to minimize or dismiss charges against you.

![detailed depiction of lawyers reviewing documents related to a drug charge case in an office setting](/images/blog-image-2-1746709515145.webp)

## Expertise in White Collar Crime Defense

White-collar crimes, such as fraud and embezzlement, require specialized knowledge. Our blog explores the complexities of these cases and how our experienced attorneys can protect your rights.

![legal team in a conference room strategizing defense for a white-collar crime case](/images/blog-image-3-1746709531770.webp)

## How We Can Help

At Sevens Legal, APC, we pride ourselves on our ability to provide tailored legal solutions to our clients. If you or a loved one is facing criminal charges, our team is prepared to defend your rights and pursue the most favorable outcome.

### Contact Us Today

Stay informed with our expert insights and let us guide you through your legal challenges. Reach out to us for a consultation at:

**Phone:** (619) 297-2800  
**Email:** info@sevenslegal.com  
**Address:** 3555 Fourth Ave., San Diego, CA 92103

Follow our blog for regular updates on current legal trends and tips!

![street-level view of Sevens Legal, APC office building](/images/blog-image-4-1746709547375.webp)`}
      </ReactMarkdown>
    </div>
  );
}