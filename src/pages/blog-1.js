import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function BlogOne() {
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
        {`As the image creator for Sevens Legal's first blog post, my focus is on producing visuals that enhance the content, making it more engaging and easier to understand. Here's how I would create and incorporate images for the blog:

### Image Creation for Blog-1 Page:

1. **Title and Headline Image:**
   - **Concept:** Design a feature image that visually represents "Top Strategies for Successfully Navigating a DUI Charge in California." This can include a combination of elements like a road, traffic signs, and legal symbols such as scales or a gavel to convey both transportation and justice.
   - **Image Path:** ![Blog Feature Image](public/images/blog_feature_image.jpg)

2. **Visuals for Main Content:**

   **Section 1: Understanding DUI Charges in California**
   - **Concept:** Create an infographic that outlines the essentials of DUI laws in California. Utilize icons for key penalties like fines, license suspensions, and BAC limits, perhaps within an easy-to-follow flowchart format.
   - **Image Path:** ![DUI Laws Infographic](public/images/dui_laws_infographic.jpg)

   **Section 2: Immediate Steps to Take After a DUI Arrest**
   - **Concept:** Develop a step-by-step visual guide illustrating actions to take directly after a DUI arrest, such as what to say/not say, the importance of contacting a lawyer, and understanding your rights.
   - **Image Path:** ![Immediate Steps Guide](public/images/immediate_steps_guide.jpg)

   **Section 3: Building a Strong Defense**
   - **Concept:** Design an illustration showcasing various defense strategies, including examining police procedures, testing equipment, and identifying rights violations.
   - **Image Path:** ![Defense Strategies Illustration](public/images/defense_strategies_illustration.jpg)

   **Section 4: Potential Outcomes and What They Mean**
   - **Concept:** A flowchart or diagram visually explaining potential DUI outcomes, using visuals to represent outcomes like fines, community service, or alternative sentencing options.
   - **Image Path:** ![Outcomes Diagram](public/images/outcomes_diagram.jpg)

3. **Call-to-Action (CTA) Graphic:**
   - **Concept:** Create an engaging CTA banner that stands out on the page. This could involve a professional lawyer silhouette with a contact number or a call-to-action message that highlights the urgency and readiness to help.
   - **Image Path:** ![CTA Banner](public/images/cta_banner.jpg)

### Image Design Strategy:

- Align all visuals with Sevens Legal’s brand aesthetics, ensuring a cohesive and professional look that reflects the firm’s identity.
- Optimize images for fast load times to maintain a seamless user experience.
- Ensure that each visual not only complements the textual content but also serves an educational role, simplifying complex information for better reader comprehension.

These images are designed to make the blog post more interactive and informative, helping readers grasp the nuances of DUI legal proceedings more easily and engaging them with the content, encouraging them to take action.`}
      </ReactMarkdown>
    </div>
  );
}