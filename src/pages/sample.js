import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function Sample() {
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
        {`

# Harris & Associates Law Firm

## Committed to Justice, Dedicated to Results

![Professional legal team of diverse attorneys standing in a modern office with law books and city skyline view](/images/sample-image-0-1746625839332.webp)

At Harris & Associates, we understand that facing legal challenges can be overwhelming. Whether you're dealing with criminal charges or recovering from a personal injury, our experienced team of attorneys is here to provide expert guidance and aggressive representation.

## Our Practice Areas

### Criminal Defense

Our criminal defense attorneys have decades of combined experience defending clients against charges ranging from misdemeanors to serious felonies:

- DUI/DWI Defense
- Drug Offenses
- White Collar Crimes
- Violent Crime Defense
- Federal Criminal Defense

![Professional attorney in business attire consulting with worried client in a law office with legal documents on the desk](/images/sample-image-1-1746625857020.webp)

### Personal Injury

When you've been injured due to someone else's negligence, you deserve compensation. Our personal injury team fights for the maximum recovery in cases involving:

- Car Accidents
- Truck Accidents
- Slip and Fall Injuries
- Medical Malpractice
- Workplace Injuries

![Compassionate female attorney talking with injured client with arm in cast in a warm, welcoming office environment](/images/sample-image-2-1746625871456.webp)

## Why Choose Harris & Associates?

- **Proven Track Record**: Our attorneys have secured millions in settlements and favorable verdicts.
- **Personalized Attention**: We limit our caseload to ensure your case receives the attention it deserves.
- **24/7 Availability**: Legal emergencies don't follow business hours. Neither do we.
- **No Fee Unless We Win**: For personal injury cases, you pay nothing unless we secure compensation for you.

## Contact Us Today

Don't face the legal system alone. Schedule your free consultation today and let our experienced legal team fight for your rights.

![Modern, professional law office building with "Harris & Associates Law Firm" sign visible, well-landscaped entrance during daytime](/images/sample-image-3-1746625888353.webp)`}
      </ReactMarkdown>
    </div>
  );
}