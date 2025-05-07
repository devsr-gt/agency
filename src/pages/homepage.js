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
        {`Certainly! Based on my role as a content writer for Sevens Legal, here's how I would approach the processing and crafting of the homepage content:

### Content Strategy and Development:

**1. Header:**
   - **Logo Description:** Write an alternative text for the logo that reads "Sevens Legal - Premier Criminal Defense Attorneys" for accessibility.
   - **Navigation Menu:** Ensure menu items are descriptive yet succinct, like "Home," "About Us," "Practice Areas," "Our Team," "Testimonials," and "Contact Us."

**2. Hero Section:**
   - **Main Headline:** "Your Trusted Advocates in Criminal Defense"
   - **Subheadline:** "Experienced Legal Expertise Committed to Protecting Your Rights"
   - **CTA Text:** "Get a Free Consultation" - encourage immediate action.

**3. Introduction Section:**
   - **Content:** Develop an introductory paragraph: 
     "At Sevens Legal, we pride ourselves on being your premier criminal defense experts. Led by Samantha Greene, a Certified Criminal Law Specialist, our team leverages over 40 years of combined experience to provide formidable defense strategies. Our commitment is to safeguard your rights and pursue the best possible outcomes."

**4. Key Practice Areas:**
   - **Criminal Defense:** "Comprehensive representation across all criminal charges."
   - **DUI:** "Strategic defenses crafted by experts in DUI law."
   - **Drug Offenses:** "Effective legal tactics to mitigate drug-related charges."
   - **Domestic Violence:** "Supportive and aggressive defense strategies for domestic cases."

**5. Unique Selling Propositions:**
   - Highlight benefits such as:
     "Certified Expertise: Trust your case with a Certified Criminal Law Specialist."
     "Decades of Success: Over 40 years of combined litigation excellence."
     "Prosecutorial Insight: Leverage our team's unique perspective from former prosecutors."
     "Results-Driven: Focused on reducing or dismissing your charges completely."

**6. Client Testimonials:**
   - Collect and feature genuine client testimonials, ensuring they highlight successful case outcomes and positive client experiences.
   - Example Testimonial: "Thanks to Sevens Legal, I received a fair trial and the best outcome possible. Their professionalism and dedication were evident every step of the way."

**7. Attorney Profiles:**
   - Write compelling bios for key attorneys:
     "Meet Samantha Greene, our lead attorney and a Certified Criminal Law Specialist with a track record of defending complex criminal cases with unparalleled dedication."

**8. Blog/News Section:**
   - Write previews for recent articles, ensuring relevancy to current legal trends, and highlight successful cases to attract and engage readers.

**9. Call-to-Action Message:**
   - "Don’t face your legal challenges alone. Contact us for a confidential consultation, and let us build your defense."

**10. Footer Content:**
    - Ensure contact details, social media links, and vital legal pages are included, highlighting the firm's accessibility and client-focus.
    - Example: "Contact Us at [phone number], find us at [address], or follow us on [social media platforms]."

**11. SEO Implementation:**
   - Integrate primary and secondary SEO keywords naturally throughout the body of text.
   - **Title Tag:** "Sevens Legal: Expert Criminal Defense Attorneys in Southern California"
   - **Meta Description:** "Certified Criminal Law Specialists providing expert defense for drug, DUI, and domestic violence cases in San Diego. Free, confidential consultations available."

By developing this well-structured and SEO-optimized content strategy, the homepage will effectively capture and engage the target audience while providing comprehensive information on the firm’s capabilities and successes.`}
      </ReactMarkdown>
    </div>
  );
}