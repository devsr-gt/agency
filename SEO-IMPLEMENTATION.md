# SEO Implementation Guidelines for Sevens Legal Website

This document outlines how to implement SEO best practices from SEO-GUIDELINES.md when creating new pages or content for the Sevens Legal website.

## Table of Contents
1. [Meta Tag Structure](#meta-tag-structure)
2. [Schema.org Markup](#schema-markup)
3. [Heading Structure](#heading-structure)
4. [Canonical URLs](#canonical-urls)
5. [Image Optimization](#image-optimization)
6. [Internal Linking](#internal-linking)
7. [Content Creation Guidelines](#content-creation-guidelines)
8. [Mobile Optimization](#mobile-optimization)

## Meta Tag Structure

### Page Title
- Put keywords before brand name: "Service Name | Sevens Legal" (Tip #23)
- Keep titles under 60 characters
- Ensure each page has a unique title

### Meta Description
- Include target keywords but write naturally for humans
- Keep descriptions between 120-160 characters
- Highlight unique value propositions

### Canonical URLs
- Every page should have a self-referential canonical tag (Tip #36)
- Use the standard format: `<link rel="canonical" href="https://sevenslegal.com/page-path" />`

### Implementation Methods
1. **App Router Pages**: Use the metadata export with our utility function:
```js
import { generateMetadata } from '../utils/metadata';

export const metadata = generateMetadata({
  title: "Service Name",
  description: "Description with keyword",
  path: "/service-path",
  keywords: ["keyword1", "keyword2"],
  image: "/path/to/image.jpg"
});
```

2. **Pages Router**: Use the SEO component:
```jsx
import SEO from '../components/SEO';

<SEO 
  title="Service Name"
  description="Description with keyword"
  keywords="keyword1, keyword2"
  canonicalPath="/service-path"
  openGraph={{
    image: "/path/to/image.jpg"
  }}
/>
```

## Schema Markup

Every page should implement schema.org JSON-LD markup for improved search appearance. We've created utility functions to generate appropriate schemas:

```jsx
import { generateWebPageSchema, generateServicesSchema } from '../utils/schemaMarkup';
import SchemaMarkup from '../components/SchemaMarkup';

// Inside your component:
const pageSchema = generateWebPageSchema(
  "Page Title",
  "Page description",
  "https://sevenslegal.com/path",
  "https://sevenslegal.com/image.jpg"
);

return (
  <>
    <SchemaMarkup schema={pageSchema} />
    {/* Page content */}
  </>
);
```

### Schema Types to Use
- **Organization**: Already in layout.tsx for the entire site
- **WebPage**: For every page
- **Article**: For blog posts
- **Service**: For service pages
- **FAQPage**: For FAQ sections
- **LocalBusiness**: For contact/location pages

## Heading Structure

- Each page should have exactly one H1 tag (Tip #73)
- Maintain proper heading hierarchy (H1 → H2 → H3)
- Include keywords in headings, especially H1 and H2
- Use heading tags for structure, not for styling

## Canonical URLs

- We've configured the site to NOT use trailing slashes (Tip #31)
- All pages should have canonical URLs to prevent duplicate content issues
- For pages with pagination, use proper prev/next link tags

## Image Optimization

- Always use descriptive file names (e.g., "san-diego-criminal-defense-attorney.jpg")
- Add alt text to all images with keywords where relevant
- Use Next.js Image component for automatic optimization
- Consider adding structural data for important images

```jsx
<Image 
  src={imageSrc}
  alt="San Diego Criminal Defense Attorney in courtroom"
  width={600}
  height={400}
  priority={isPriority} // Set true for above-the-fold images
/>
```

## Internal Linking

- Use descriptive anchor texts for internal links (Tip #8)
- Ensure important pages are linked from high-level pages
- Create a logical site structure with no orphaned pages
- Link to related content where appropriate

## Content Creation Guidelines

- Focus on quality over quantity (Tip #1, #15)
- Create in-depth, expert content targeting specific user needs
- Include relevant keywords naturally throughout content
- Structure content with proper headings, short paragraphs, and bullet points
- Answer common questions your potential clients might have
- Consider including FAQ sections with schema markup (Tip #93)

## Mobile Optimization

- All pages must be mobile-friendly (Tip #3)
- Test loading speed on mobile devices
- Ensure tap targets are properly sized
- Verify content is readable without zooming

## Additional SEO Considerations

- Avoid pop-ups that cover content (Tip #27)
- If A/B testing, use canonical tags (Tip #29)
- Monitor Google Search Console for issues
- Keep content updated regularly where appropriate
- Implement proper 301 redirects for any URL changes

---

By following these guidelines, all new pages and content will be optimized according to SEO best practices. For questions or clarification, refer to the full SEO-GUIDELINES.md document or consult with the SEO team.
