import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function Contact() {
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
        {`As an image creator for Sevens Legal's contact page, here's how I would proceed with creating and incorporating relevant images to enhance the page's effectiveness:

### Image Creation for Contact Page:

1. **Page Introduction:**
   - **Concept:** Develop a welcoming header image that conveys approachability and professionalism. Use imagery that reflects a welcoming office environment or the firm's logo prominently displayed.
   - **Image Path:** ![Welcome Header Image](public/images/contact_header.jpg)

2. **Contact Information Icons:**
   - **Concept:** Create simple, recognizable icons for each method of contact to provide visual cues:
     - **Phone Icon:** Representing direct phone contact.
     - **Email Icon:** Symbolizing email communication.
     - **Map Pin Icon:** For the office's physical address.
   - **Image Paths:**
     - ![Phone Icon](public/images/phone_icon.png)
     - ![Email Icon](public/images/email_icon.png)
     - ![Map Pin Icon](public/images/address_icon.png)

3. **Contact Form Accent:**
   - **Concept:** Design an unobtrusive visual accent that frames or highlights the contact form, drawing attention to where users need to input their details.
   - **Image Path:** Not applicable for standalone; consider border enhancements or shaded backgrounds.

4. **Map and Directions:**
   - **Concept:** Display an embedded Google Map for easy navigation, along with a stylized graphic or photo of the firm's building to aid in visual orientation.
   - **Image Path:** ![Office Front Image](public/images/office_front.jpg)

5. **Call-to-Action Graphic:**
   - **Concept:** A compelling visual that strengthens the call-to-action, encouraging interaction. This could include an engaging graphic like an arrow pointing towards the contact form or a representation of a supportive legal environment.
   - **Image Path:** ![CTA Graphic](public/images/cta_graphic.jpg)

6. **Additional Resources:**
   - **Concept:** Icons for linking to additional resources such as an FAQ page and social media profiles to facilitate easy access and interaction.
   - **Image Paths:**
     - ![FAQ Icon](public/images/faq_icon.png)
     - ![Social Media Icons](public/images/social_media_icons.png)

### Image Strategy:

- Maintain consistency with Sevens Legal’s branding, using a cohesive color scheme and style that aligns with the firm's identity.
- Ensure all images are optimized for web performance, ensuring fast load times to provide a smooth user experience.
- Each visual should not only enhance the aesthetic appeal of the page but also serve a functional purpose, guiding users effectively toward contacting the firm.

Through these thoughtful visual elements, the contact page will not only look inviting but also facilitate easier and more intuitive user interaction, ultimately leading to higher engagement and conversions.`}
      </ReactMarkdown>
    </div>
  );
}