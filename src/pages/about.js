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
        {`# About Us

Welcome to Law Firm, where our dedication to justice and client advocacy is the foundation of our practice. Specializing in criminal defense and personal injury, we are committed to providing exceptional legal services with integrity, compassion, and a fierce pursuit of justice.

## Our History

Established in [Year], Law Firm has built a reputation for success and excellence in legal representation. From our early beginnings in [City] to becoming one of the leading law firms in [Region], we have remained steadfast in our mission to protect clients' rights and secure favorable outcomes. Our journey is marked by landmark victories and a growing team of passionate legal professionals.

![image of a modern law firm's office set in a historic building with legal books and awards](/images/about-image-0-1746657195643.webp)

## Meet Our Attorneys

### [Attorney Name], Founder & Senior Partner

With over [Number] years of experience, [Attorney Name] is a seasoned litigator known for their strategic acumen and unwavering dedication to clients. They have successfully defended high-stakes cases, earning respect from peers and trust from clients.

![professional portrait of a senior attorney in a law office setting](/images/about-image-1-1746657221139.webp)

### [Attorney Name], Partner

An expert in personal injury law, [Attorney Name] has a proven track record of securing substantial compensations for clients who have suffered due to negligence. Their empathetic approach and tenacious advocacy make them a formidable ally in any legal battle.

![dynamic portrait of a personal injury attorney reviewing case files](/images/about-image-2-1746657234351.webp)

## Our Values and Approach

At Law Firm, we believe in:

- **Integrity**: Upholding the highest ethical standards in every case we handle.
- **Client-Centric Advocacy**: Prioritizing our clients' needs and ensuring their voices are heard.
- **Aggressive Representation**: Vigorously defending clients' rights with strategic and innovative legal approaches.
- **Community Engagement**: Giving back through community involvement and pro bono services.

## Community Involvement

We are proud to be active members of our community, contributing to local causes and initiatives. Our attorneys frequently participate in legal education workshops, mentorship programs, and charitable events, reinforcing our commitment to making a positive impact beyond the courtroom.

![image of attorneys participating in a community legal education workshop](/images/about-image-3-1746657249096.webp)

## Contact Us

Ready to discuss your case with our expert attorneys? Contact Law Firm today and let us help you navigate the complexities of the legal system with confidence and clarity.

- **Phone**: [Phone Number]
- **Email**: [Email Address]
- **Visit Us**: [Address]

We look forward to serving you with unmatched dedication and exceptional legal expertise.`}
      </ReactMarkdown>
    </div>
  );
}