import { generateBreadcrumbSchema } from '../../utils/schemaMarkup';

/**
 * BreadcrumbSchema component
 * Server component that adds schema.org JSON-LD markup for breadcrumbs
 * 
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of breadcrumb items with name and path
 * @returns {JSX.Element} - Script element with schema markup
 */
export default function BreadcrumbSchema({ items }) {
  if (!items || items.length === 0) return null;
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://sevenslegal.com${item.path}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema)
      }}
    />
  );
}
