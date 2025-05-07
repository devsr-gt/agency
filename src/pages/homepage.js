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
        {`# Premier Legal Defense and Advocacy

## Your Trusted Partner in Criminal Defense and Personal Injury

At [Law Firm Name], we are committed to providing exceptional legal representation tailored to your unique needs. As specialists in both criminal defense and personal injury law, we bring a wealth of expertise and an unwavering dedication to securing the best possible outcome for each client.

![experienced attorneys in a modern law office reviewing case files, with shelves of legal books and awards in the background](/images/homepage-image-0-1746657311743.webp)

## Comprehensive Legal Services

### Criminal Defense

Our criminal defense team is renowned for its strategic approach and relentless pursuit of justice. We handle a wide spectrum of cases, from misdemeanor charges to serious felonies, ensuring that your rights are vigorously protected every step of the way.

### Personal Injury

When an accident disrupts your life, our personal injury lawyers are here to offer support and tactical legal strategies. We work tirelessly to secure compensation for medical expenses, lost wages, and emotional distress, so you can focus on recovery.

## Why Choose Us?

- **Proven Track Record**: Our firm has a distinguished history of successful case outcomes, supported by decades of collective experience.
- **Personalized Attention**: We understand that no two cases are alike. Our personalized approach ensures tailored solutions that address your specific situation.
- **Compassionate Advocacy**: Navigating legal challenges can be overwhelming. Our empathetic team is here to guide you with transparency and honesty.

![attorney consulting with a client in a warmly lit office, with diplomas on the wall and comfortable seating arrangements](/images/homepage-image-1-1746657326830.webp)

## Take the First Step Toward Justice

Don't face your legal challenges alone. Whether you're confronted with a complex legal battle or seeking rightful compensation, we are here to help.

### Contact Us Today

Reach out to us for a confidential consultation and start your journey towards resolution. Call us at **[Your Phone Number]** or fill out our [contact form](#) to get started.

![handshake between a client and an attorney, symbolizing agreement and trust, with both parties smiling](/images/homepage-image-2-1746657343287.webp)

Together, we can protect your rights and pursue the justice you deserve. Experience the difference that a dedicated legal team can make. Let us be your advocate.`}
      </ReactMarkdown>
    </div>
  );
}