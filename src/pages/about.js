import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function About() {
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
        {`# About Us: Law Firm

Welcome to Law Firm, where we are dedicated to providing exceptional legal representation with a personal touch. Specializing in criminal defense and personal injury, our mission is to protect your rights and guide you through challenging times with steadfast support and unmatched expertise.

## Our Story

Since our inception, Law Firm has been committed to advocating for justice and upholding the highest standards of legal practice. Founded by a group of passionate attorneys, we began with a singular vision: to offer personalized, comprehensive legal services that genuinely make a difference in our clients’ lives. Over the years, we have grown to become a trusted name in the legal community, known for our tireless dedication and successful outcomes.

## Our Values

At the core of Law Firm lies a set of principles that guide our every action:

- **Integrity:** We adhere to the highest ethical standards, ensuring transparency and honesty in all our dealings.
- **Client-Centric Approach:** Our clients are our top priority. We listen attentively, communicate clearly, and develop strategies tailored to each unique situation.
- **Excellence:** We are committed to continuous learning and improvement, staying at the forefront of legal developments to offer superior advocacy.
- **Compassion:** Understanding the emotional strain that legal issues can bring, we approach every case with empathy and care.

## Meet Our Attorneys

### John Doe, Founding Partner

John Doe is a seasoned criminal defense attorney with over 20 years of experience. Known for his strategic acumen and unwavering commitment to his clients, John has successfully defended countless high-profile cases. His expertise in crafting compelling defense strategies makes him a formidable advocate.

![image of a professional, mature attorney in a suit in a law library setting](/images/about-image-0-1746663272769.webp)

### Jane Smith, Partner

Jane Smith specializes in personal injury law, tirelessly fighting for the rights of those who have suffered due to another's negligence. Her compassionate approach and keen negotiation skills have secured significant settlements for her clients, earning her a reputation as a dedicated and effective attorney.

![image of a professional attorney with legal books and certificates in the background](/images/about-image-1-1746663286598.webp)

## Community Involvement

At Law Firm, we believe in giving back to the community that supports us. We are actively engaged in various local initiatives and charitable endeavors. Our team volunteers their time and expertise to provide pro bono services, legal education workshops, and support to non-profit organizations. We are proud to contribute to the betterment of our community and to help shape a fairer, more just society.

## Contact Us

Ready to discuss your legal needs? Contact us today for a consultation. Let Law Firm be your trusted partner in the pursuit of justice.

**Phone:** (555) 123-4567  
**Email:** contact@lawfirm.com  
**Address:** 123 Main Street, Suite 100, Hometown, USA

Together, let's navigate your legal challenges with confidence and peace of mind.`}
      </ReactMarkdown>
    </div>
  );
}