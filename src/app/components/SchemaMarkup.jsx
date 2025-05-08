'use client';

import { useEffect, useState } from 'react';

/**
 * SchemaMarkup component
 * Client-side component to add schema.org JSON-LD markup to pages
 * Used to hydrate schema data on the client side
 * 
 * @param {Object} props - Component props
 * @param {Object|Object[]} props.schema - Schema object or array of schema objects to render
 * @returns {JSX.Element} - Script tag with schema data
 */
export default function SchemaMarkup({ schema }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render on client-side to avoid hydration mismatch
  if (!isClient) {
    return null;
  }

  // If schema is an array, wrap each schema object in its own script tag
  if (Array.isArray(schema)) {
    return (
      <>
        {schema.map((schemaObj, index) => (
          <script
            key={`schema-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schemaObj)
            }}
          />
        ))}
      </>
    );
  }

  // If schema is a single object, render a single script tag
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}
