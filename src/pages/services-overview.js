import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function ServicesOverview() {
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
        {`Certainly! As the content writer, here's how I would process and develop the content for Sevens Legal's services page based on the planned strategy:

### Services Page Content Development:

**Page Introduction:**
- **Introductory Text:**
  "Welcome to Sevens Legal, where we are dedicated to providing superior legal defense in a comprehensive range of criminal law matters. Our team, led by a Certified Criminal Law Specialist, offers client-focused service and tailored defense strategies. Explore our services below to see how we can assist you."



**2. DUI Defense:**
- **Title:** Expert DUI Representation
- **Description:**
  "Navigating DUI charges requires nuanced expertise and strategic planning. Our seasoned attorneys employ a meticulous approach to challenge evidence, negotiate reductions, and strive for dismissals, ensuring minimal impact on your life."
- **Key Points:**
  - "Aggressive contestation of evidence."
  - "Experience in negotiating charge reductions."
- **Visual Aid Suggestion**: A DUI defense strategy infographic illustrating processes like evidence gathering and court procedures.

---

**3. Drug Offenses:**
- **Title:** Drug-Related Defense
- **Description:**
  "Facing drug-related charges can be daunting, but with Sevens Legal, you have a dedicated ally. We focus on defending against charges ranging from possession to trafficking, offering a deep understanding of both state and federal laws to protect your future."
- **Key Points:**
  - "Comprehensive knowledge of state and federal drug laws."
  - "Experience in rehabilitation advocacy and plea bargaining."
- **Testimonial Snippet:**
  "\"With Sevens Legal, I never felt alone. They understood the nuances of my case and worked tirelessly for a favorable outcome.\" — N.K."

---

**4. Domestic Violence:**
- **Title:** Domestic Violence Defense
- **Description:**
  "Our attorneys handle domestic violence cases with sensitivity and skill, focusing on protecting your rights and seeking fair outcomes. We provide expert guidance through the complexities, including restraining orders and family law issues, with discretion and care."
- **Key Points:**
  - "Skilled negotiation in restraining order cases."
  - "Comprehensive knowledge of family law intersections."
- **Visual Aid Suggestion**: A flowchart illustrating the steps in domestic violence cases and associated defense strategies.

---

**Additional Areas of Practice:**
- **Title Example:** White Collar Crimes
- **Description:** 
  "Our firm expands its expertise to include white-collar crime defense, offering tactical representation for complex cases such as fraud and embezzlement."

---

**Call-to-Action Section:**
- **CTA Text:**
  "Facing legal challenges? Contact Sevens Legal for a confidential consultation and let our experienced team guide you with exceptional legal advocacy tailored to your needs."

---

**SEO Considerations:**
- Ensure the natural integration of targeted keywords like "DUI Lawyer San Diego," "Drug Crime Defense California," and "Domestic Violence Attorney Southern California" within the content.
- Crafting engaging and keyword-rich meta titles and descriptions for each section to improve search engine visibility and attract potential clients seeking professional criminal defense representation.`}
      </ReactMarkdown>
    </div>
  );
}