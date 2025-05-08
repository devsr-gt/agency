import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function Services() {
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
        {`# Our Legal Services

Welcome to Law Firm, where your legal needs are our priority. Specializing in both criminal defense and personal injury, our experienced attorneys are dedicated to providing exceptional service and winning results. Explore our primary practice areas below to learn how we can assist you.

## Criminal Defense

When facing criminal charges, you need an aggressive and knowledgeable defense team by your side. At Law Firm, we understand the stakes involved and are committed to protecting your rights and freedom.

### How We Help
Our attorneys are seasoned in handling a diverse range of criminal cases, from misdemeanors to complex felonies. We rigorously investigate each case, challenge the evidence, and craft a strategic defense tailored to your unique situation.

### What Sets Us Apart
With a track record of success in securing dismissals, reduced charges, and favorable verdicts, our firm is recognized for its relentless advocacy and attention to detail. We bring a deep understanding of the legal landscape to every case, ensuring that you receive the best possible defense.

### Case Experience
- Successfully defended a client in a high-profile white-collar crime, leading to an acquittal
- Achieved a significant reduction in charges for a client facing DUI allegations
- Obtained a dismissal of charges for a client accused of assault

![attorney speaking with client across a desk, legal documents spread out](/images/services-image-0-1746663375584.webp)

## Personal Injury

Injuries can have devastating impacts on your life. At Law Firm, we fight passionately to secure the compensation you deserve for your suffering, medical expenses, and lost wages.

### How We Help
From car accidents to medical malpractice, our attorneys are adept at navigating the complexities of personal injury law. We collaborate with medical experts, gather comprehensive evidence, and advocate vigorously on your behalf throughout the entire legal process.

### What Sets Us Apart
Our firm stands out for its compassionate approach and proven results. We prioritize client welfare, ensuring that you receive personalized attention and guidance every step of the way. Your recovery is our ultimate goal.

### Case Experience
- Secured a $1.5 million settlement for a client injured in a construction accident
- Negotiated a $750,000 settlement for a victim of medical negligence
- Recovered $500,000 for a client involved in a severe motor vehicle collision

![handshake between lawyer and client with legal documents and scales of justice](/images/services-image-1-1746663391798.webp)

## Contact Us

Ready to discuss your case? Contact Law Firm today to schedule a free consultation. Our dedicated team is here to provide support and start building your case for success.

- Phone: (555) 123-4567
- Email: contact@lawfirm.com
- Address: 123 Justice Avenue, Suite 100, Legal City, State 12345

Don't wait. Your path to justice starts now with Law Firm by your side.`}
      </ReactMarkdown>
    </div>
  );
}