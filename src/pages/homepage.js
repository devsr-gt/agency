import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function Homepage() {
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
        {`Certainly! Here’s an SEO strategy including a report on keyword research for a criminal defense and personal injury law firm, aimed to attract organic search traffic and convert visitors into clients.

### Keyword Research for Criminal Defense Law

**Primary Keywords:**
1. "criminal defense lawyer [Your City]"
2. "criminal attorney [Your City]"
3. "DUI lawyer [Your City]"
4. "domestic violence attorney [Your City]"

**Long-Tail Keywords:**
1. "how to find a good criminal lawyer"
2. "best criminal defense attorney in [Your City]"
3. "what to expect from a DUI case"
4. "steps to take after being arrested for domestic violence"
5. "understanding criminal charges and defense strategies"

### Keyword Research for Personal Injury Law

**Primary Keywords:**
1. "personal injury lawyer [Your City]"
2. "accident lawyer near me"
3. "car accident attorney [Your City]"
4. "slip and fall lawyer [Your City]"

**Long-Tail Keywords:**
1. "what to do after a car accident injury"
2. "how to file a personal injury claim"
3. "best personal injury attorney in [Your City]"
4. "how long does a personal injury lawsuit take"

### Metadata Suggestions

**For Home Page:**
- **Title Tag:** Top Criminal Defense & Personal Injury Lawyers in [City] | [Firm Name]
- **Meta Description:** Need a trusted lawyer? [Firm Name] specializes in criminal defense and personal injury cases in [City]. Contact us for a free consultation.

**For Criminal Defense Practice Page:**
- **Title Tag:** Experienced Criminal Defense Lawyers in [City] | [Firm Name]
- **Meta Description:** Charged with a crime? Our skilled defense attorneys in [City] can help. Schedule a consultation to discuss your defense strategy.

**For Personal Injury Practice Page:**
- **Title Tag:** Compassionate Personal Injury Attorneys in [City] | [Firm Name]
- **Meta Description:** Hurt in an accident? Our [City]-based personal injury lawyers fight for maximum compensation. Contact [Firm Name] today.

**For Blog Post Topic on Criminal Defense:**
- **Title Tag:** What to Expect When Facing Criminal Charges in [City]
- **Meta Description:** Learn the steps involved in a criminal case and how a defense lawyer in [City] can assist you. Read more for our expert insights.

**For Blog Post Topic on Personal Injury:**
- **Title Tag:** Steps to Take After a Personal Injury Accident
- **Meta Description:** Discover immediate actions to protect your rights and health after a personal injury accident. Get tips from our [City] law firm.

### Next Steps

- **Content Team:** Use these keywords to draft blog topics and service page content.
- **Design & Development:** Ensure page design aligns with user experience best practices to enhance engagement.
- **SEO Implementation:** Incorporate keywords into site metadata and on-page elements, including headers and body text.
- **Analytics Setup:** Monitor keyword performance and user engagement to continuously refine the strategy.

Feel free to ask for further insights or guidance on implementing this strategy!`}
      </ReactMarkdown>
    </div>
  );
}