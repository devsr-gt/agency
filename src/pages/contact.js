import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function Contact() {
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
        {`# Contact Us

At Law Firm, we are dedicated to providing expert legal representation to our clients. Whether you're facing criminal charges or dealing with a personal injury case, our experienced attorneys are here to help you navigate the complexities of the legal system. Reach out to us today for a confidential consultation and let us be your trusted advocates.

## Get in Touch

We understand that contacting a lawyer can be a daunting step. Our team is committed to making the process as seamless and comfortable as possible. Please fill out the contact form, or reach us via phone or email.

### Contact Form
- **Name**
- **Email**
- **Phone Number**
- **Message**

[Submit Button]

### Our Office Locations

**Main Office**  
1234 Justice Street  
Suite 200  
Anytown, ST 12345  
Phone: (555) 123-4567  
Email: contact@lawfirm.com

**Downtown Office**  
5678 Liberty Avenue  
Floor 3  
City Central, ST 67890  
Phone: (555) 987-6543  
Email: downtown@lawfirm.com

![modern law office interior with a reception area, comfortable seating, and a welcoming atmosphere](/images/contact-image-0-1746667160046.webp)

## Frequently Asked Questions

**1. What can I expect during my initial consultation?**  
During your initial consultation, our attorneys will discuss the details of your case, answer any questions you may have, and provide an overview of how we can assist you moving forward. This meeting is confidential and there is no obligation to retain our services.

**2. What should I bring to the consultation?**  
Please bring any relevant documents related to your case, such as police reports, medical records, or correspondence. Having these documents on hand will help us better understand your situation and provide the most accurate advice.

**3. How long does the consultation usually last?**  
Initial consultations typically last between 30 minutes to an hour, depending on the complexity of your case. Our goal is to ensure you leave with a clear understanding of your legal options.

For immediate assistance or to schedule a consultation, please call us at (555) 123-4567 or email us at contact@lawfirm.com. We look forward to serving you and achieving the best possible outcome for your case.`}
      </ReactMarkdown>
    </div>
  );
}