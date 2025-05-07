import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function Blog() {
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
        {`# Sevens Legal Blog: Insights and Updates on Criminal Defense Law

## Navigating Criminal Defense: Trust in Over 40 Years of Experience

At Sevens Legal, we possess over 40 years of combined experience representing clients through some of the most challenging times of their lives. Whether you're facing criminal charges, drug offenses, or DUI allegations, we understand the complexities involved and strive to provide exceptional legal defense tailored to your needs.

## Understanding Your Rights: The Importance of Knowledge

Knowledge is power, especially when you're confronted with criminal charges. Empowering yourself with the right information can significantly impact your defense strategy. Our team at Sevens Legal is dedicated to keeping you informed and equipped to make the best decisions for your case.

## Specialized Legal Defense Areas

### Drug Charges

Drug-related offenses can carry severe penalties. With a thorough understanding of California's intricate drug laws, our attorneys work tirelessly to protect your rights and ensure fair treatment in the legal system.

![a detailed image of a classic courtroom setting featuring legal books, a gavel, and a judge's bench](/images/blog-image-0-1746659565186.webp)

### Domestic Violence

Accusations of domestic violence can be devastating. Our team is committed to handling these sensitive cases with compassion and discretion. We endeavor to uncover the truth and defend your rights vigorously.

### DUI Defense

Being charged with a DUI can impact your future in many ways. Our lawyers are well-versed in DUI defenses, from challenging the legitimacy of the traffic stop to scrutinizing the accuracy of breathalyzer tests. Let us help you navigate the complexities of DUI law.

## Client Testimonials: Hear From Those We've Helped

"Sevens Legal turned my life around. Their expertise and dedication to my case were unparalleled. I felt heard and seen throughout the entire process, leading to an outcome I hadn’t dared to hope for." — A Satisfied Client

## Stay Informed: Subscribe to Our Newsletter

Keep up-to-date with the latest legal insights, and get advice directly from our experts by subscribing to our newsletter.

![professional image of a team of lawyers in a modern law office deeply engaged in a discussion around a conference table](/images/blog-image-1-1746659580939.webp)

## Contact Us: We're Here to Help

Facing criminal charges is daunting, but you don't have to go through it alone. Schedule a free consultation with Sevens Legal today. Our team is ready to fight for you.

- Phone: XXX-XXX-XXXX
- Email: info@sevenslegal.com

Your defense starts here. Trust in experience, trust in Sevens Legal.`}
      </ReactMarkdown>
    </div>
  );
}