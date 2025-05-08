import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function Contact() {
  return (
    <div className="container mx-auto p-4">
      <ReactMarkdown
        components={{
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

## Get the Legal Support You Need

At Law Firm, we understand the stress and uncertainty that legal challenges can bring. Whether you're facing criminal charges or dealing with a personal injury, our dedicated team is here to provide the expert guidance and representation you need. Reach out to us today to discuss your case and take the first step toward securing your future.

## Contact Information

### Phone
- **Main Office:** (555) 123-4567
- **24/7 Hotline:** (555) 987-6543

### Email
- **General Inquiries:** contact@lawfirm.com
- **Existing Clients:** support@lawfirm.com

### Office Locations
- **Downtown Office:**  
  123 Legal Street, Suite 100  
  Metropolis, ST 54321  
  [Directions](https://maps.example.com/downtown)

- **Uptown Office:**  
  678 Justice Avenue  
  Metropolis, ST 54322  
  [Directions](https://maps.example.com/uptown)

## Office Hours
- **Monday to Friday:** 9 AM - 6 PM
- **Saturday:** By appointment only
- **Sunday:** Closed

## Contact Form
Please fill out the form below, and a member of our team will get back to you promptly.

![a detailed image of a professional law office contact form layout](/images/contact-image-0-1746664072861.webp)



Ready to take the next step? Contact us today to schedule your consultation and begin your journey towards resolution and justice.`}
      </ReactMarkdown>
    </div>
  );
}