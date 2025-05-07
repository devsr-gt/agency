import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function About() {
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
        {`As the content writer for Sevens Legal's about page, my responsibility is to create engaging and informative text that effectively communicates the firm's mission, history, and qualifications. Here's how I would proceed with developing this content:

### About Page Content Development:

**1. Page Introduction:**
- **Introductory Text:**
  "Welcome to Sevens Legal, your trusted partner in navigating the complexities of criminal defense. With a strong commitment to justice and client advocacy, our team, led by renowned Certified Criminal Law Specialist Samantha Greene, provides unmatched legal expertise to guide you through your legal challenges. Learn more about our journey, values, and team."

**2. Firm History:**
- **Section Title:** Our Journey
- **Content:**
  "Sevens Legal was founded on the principle of providing exceptional defense to those in need of legal assistance. Established in [year], we have grown from a small practice into a leading legal firm recognized for our dedication and success in criminal law. Our history is marked by significant milestones, including celebrated case victories and industry recognitions that highlight our pursuit of excellence."

**3. Mission and Values:**
- **Section Title:** Our Mission and Core Values
- **Content:**
  "At Sevens Legal, our mission is to provide diligent and personalized legal representation while maintaining the highest standards of integrity, compassion, and innovation. We are committed to delivering justice and ensuring that every client receives the support and strategies tailored to their specific needs, reflecting our core values of integrity, commitment, and client-centered service."

**4. Our Team:**
- **Section Title:** Meet Our Attorneys
- **Content:**
  - **Samantha Greene:** "Samantha Greene leads our firm with unparalleled expertise as a Certified Criminal Law Specialist. Her insights and dedication to justice drive our success in complex cases."
  - **[Attorney 2's Name]:** "Bringing a wealth of experience in [specialty], [Attorney's Name] excels in crafting strategic legal defenses tailored to each client's circumstances."
  - **[Attorney 3's Name]:** "Known for [unique attributes], [Attorney's Name] combines a deep understanding of [area of law] with a commitment to achieving the best possible outcomes for clients."
  - **Team Philosophy:** "Our team of skilled attorneys shares a collective dedication to providing thorough and empathetic representation, ensuring that every case is approached with the utmost care and precision."

**5. Testimonials and Success Stories:**
- **Section Title:** Client Experiences
- **Content:**
  - **Testimonial 1:** "\"Sevens Legal changed my perspective on legal representation. Their compassion and expertise led to a result I never thought possible.\" — A.S."
  - **Testimonial 2:** "\"In the toughest times, I felt supported and understood thanks to Sevens Legal's commitment.\" — R.L."
  - **Case Successes:** "With a proven track record of securing favorable outcomes, from acquittals to favorable settlements, our client success stories underscore our legal prowess."

**6. Community Involvement:**
- **Section Title:** Our Commitment to Community
- **Content:**
  "Beyond the courtroom, Sevens Legal is dedicated to making a positive impact in our community. We actively participate in local initiatives, offering our expertise in pro bono work and community services. Our involvement in programs such as [specific program/initiative] reflects our commitment to giving back and supporting the communities we serve."

**7. Conclusion:**
- **Conclusion Statement:**
  "Sevens Legal stands at the forefront of legal excellence, guided by our mission to provide comprehensive defense with integrity and dedication. We invite you to contact us and discover how our experienced team can support you through life's legal challenges with confidence and competence."

**SEO Considerations:**
- Use keywords naturally: “Criminal Defense Attorneys,” “San Diego Legal Experts,” “Samantha Greene Certified Criminal Law Specialist.”
- Include specific legal terms relevant to each attorney's expertise to boost search visibility.

This content strategy ensures that the about page effectively communicates Sevens Legal’s story, values, and expertise, establishing a strong connection with potential clients and reinforcing the firm’s credibility and dedication to justice.`}
      </ReactMarkdown>
    </div>
  );
}