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

At Sevens Legal, we understand the stress and uncertainty that come with facing criminal charges. Our dedicated team is here to provide the legal expertise you need. With over 40 years of combined experience, we stand ready to defend your rights and guide you through every step of the legal process. Contact us today to get started on your defense.

## Get in Touch

We encourage you to reach out for a personalized consultation. Please use the contact form below, or reach us via phone or email. Our attorneys are here to assist you and provide the guidance you need.

### Contact Form

[Contact Form Placeholder]

### Office Locations

- **Downtown Office**
  - Address: 123 Main Street, Suite 200, Anytown, CA 90210
  - Phone: (123) 456-7890
  - Email: info@sevenslegal.com

- **Uptown Office**
  - Address: 456 Elm Street, Suite 300, Othertown, CA 90300
  - Phone: (987) 654-3210
  - Email: contact@sevenslegal.com

### Phone and Email

- General Inquiries: (123) 456-7890
- Email Us: info@sevenslegal.com

![image of a diverse legal team in a professional office environment engaged in a planning session](/images/contact-image-0-1746659601111.webp)

## FAQ: Initial Consultation

**What can I expect during my initial consultation?**

The initial consultation is an opportunity to discuss your case and understand your legal options. Our experienced attorneys will review the details of your situation, answer any questions you may have, and outline potential defense strategies.

**How should I prepare for the consultation?**

Please bring any relevant documents, such as police reports or court notices, and be ready to discuss the details of your case. This information will help us provide you with the most accurate advice.

**Is the initial consultation free?**

Yes, we offer a complimentary initial consultation to assess your case and determine how we can best assist you. 

Reach out today and let Sevens Legal put our expertise to work for you. Call us or use the form above to schedule your consultation. We look forward to advocating for you.`}
      </ReactMarkdown>
    </div>
  );
}