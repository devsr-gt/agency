import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';

// This gets called at build time on the server
export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'content', 'services-overview.md');
  let content = '';
  
  try {
    content = fs.readFileSync(filePath, 'utf8');
    
    // Extract frontmatter if present
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);
    if (match) {
      content = content.replace(frontmatterRegex, '');
    }
  } catch (error) {
    console.error('Error loading content file:', error);
    content = '# Services content not available';
  }
  
  return {
    props: { content }
  };
}

export default function ServicesOverview({ content }) {
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
        {content}
      </ReactMarkdown>
    </div>
  );
}