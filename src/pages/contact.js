import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function Contact() {
  return (
    <div className="container mx-auto p-4">
      <ReactMarkdown
        components={{
          // Fix for hydration error: p > div is invalid HTML
          p: ({ node, children }) => {
            // Check if children contains an img element
            const hasImageChild = node?.children?.some(
              child => child.type === 'element' && child.tagName === 'img'
            );
            
            // If there's an image child, we return a div instead of p to avoid nesting issues
            return hasImageChild ? <div>{children}</div> : <p>{children}</p>;
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
        {`# Contact Us

## We're Here to Help

At Law Firm, we understand that navigating the legal system can be overwhelming. Whether you're facing a criminal charge or dealing with a personal injury case, our dedicated team is here to provide the support and expertise you need. Don't wait to take the next step in securing your future—reach out to us today.

## Get in Touch

### Contact Form
Please fill out the form below to get in touch with our legal experts. We will respond to your inquiry as quickly as possible.

**[Contact Form Placeholder]**

- **Name**
- **Email Address**
- **Phone Number**
- **Message**

### Office Locations

#### Main Office
123 Justice Lane  
Anytown, State, ZIP Code  
Phone: (123) 456-7890  
Email: contact@lawfirm.com

#### Downtown Branch
456 Legal Blvd  
Big City, State, ZIP Code  
Phone: (987) 654-3210  
Email: support@lawfirm.com

![image of an office building with modern architecture, a welcoming front entrance, and clear signage](/images/contact-image-0-1746663347013.webp)

## Frequently Asked Questions

### What can I expect during my initial consultation?

Our initial consultation is designed to provide you with a comprehensive understanding of your legal situation. During this meeting, we will discuss your case details, explore your legal options, and outline a strategic approach tailored to your needs. This is also an opportunity for you to ask questions and learn more about how we can assist you.

### Is there a fee for the initial consultation?

We offer a complimentary initial consultation for all potential clients. Our goal is to understand your situation thoroughly and determine how we can best support you without any financial obligation upfront.

---

For more information or to schedule an appointment, please contact us via phone or email. We look forward to working with you to achieve the best possible outcome in your case.`}
      </ReactMarkdown>
    </div>
  );
}