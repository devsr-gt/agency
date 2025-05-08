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
        {`# Our Legal Services

At Law Firm, we are dedicated to providing expert legal representation in criminal defense and personal injury. Our seasoned attorneys are committed to safeguarding your rights, securing the best possible outcome, and ensuring justice is served. Explore our core practice areas below to learn how we can assist you.

## Criminal Defense

Navigating the complexities of the criminal justice system can be overwhelming. Our experienced criminal defense team offers comprehensive legal support to clients facing a wide range of charges, from misdemeanors to serious felonies. 

### How We Help:
- Conduct thorough investigations to build a robust defense
- Negotiate effectively with prosecutors for reduced charges or dismissals
- Provide relentless advocacy in court for acquittals or favorable verdicts

### What Sets Us Apart:
- Decades of combined experience in criminal law
- A proven track record of successful case outcomes, including high-profile acquittals
- Personalized defense strategies tailored to each client's unique circumstances

### Case Experience:
Our defense team recently secured an acquittal for a client wrongfully accused of embezzlement, demonstrating our commitment to rigorous defense and justice.

![image of experienced lawyer in a courtroom setting, confidently presenting arguments before a judge](/images/services-image-0-1746667248206.webp)

## Personal Injury

If you have suffered injuries due to someone else's negligence, our personal injury attorneys are prepared to fight for the compensation you deserve. We handle all aspects of personal injury cases to ensure your recovery is both comprehensive and just.

### How We Help:
- Aggressively pursue maximum compensation for medical expenses, lost wages, and emotional distress
- Engage in expert negotiations with insurance companies on your behalf
- Provide compassionate guidance and support throughout the recovery process

### What Sets Us Apart:
- Extensive experience in managing complex injury cases, from auto accidents to medical malpractice
- A client-centered approach that prioritizes personal attention and tailored solutions
- A history of securing substantial settlements and verdicts for our clients

### Case Experience:
Recently, our firm achieved a multi-million dollar settlement for a client injured in a commercial trucking accident, exemplifying our commitment to exceptional results.

![image of a personal injury lawyer consulting with a client, highlighting professionalism and empathy](/images/services-image-1-1746667264927.webp)

## Contact Us

Choose Law Firm for expert legal guidance and vigorous representation. Contact us today for a free consultation and let us help you achieve the justice you deserve.

**Phone:** (555) 123-4567  
**Email:** contact@lawfirm.com  
**Location:** 123 Justice Blvd, Suite 200, Anytown, USA

![image of a modern law firm building with professional signage and welcoming entrance](/images/services-image-2-1746667278315.webp)`}
      </ReactMarkdown>
    </div>
  );
}