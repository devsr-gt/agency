const { OpenAI } = require('openai');
const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
require('dotenv').config();

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Agent activities log
let agentActivities = [];
let contentStatus = [];

// Load existing activities and content status if available
try {
  const activitiesPath = path.join('public', 'api', 'agent-activities', 'data.json');
  const contentStatusPath = path.join('public', 'api', 'content', 'data.json');
  
  if (fs.existsSync(activitiesPath)) {
    const data = fs.readFileSync(activitiesPath, 'utf8');
    const parsedData = JSON.parse(data);
    // Make sure we have an array
    if (Array.isArray(parsedData)) {
      agentActivities = parsedData;
    } else {
      console.log('Agent activities data is not an array, initializing empty array');
      agentActivities = [];
    }
  }
  
  if (fs.existsSync(contentStatusPath)) {
    const data = fs.readFileSync(contentStatusPath, 'utf8');
    const parsedData = JSON.parse(data);
    // Make sure we have an array
    if (Array.isArray(parsedData)) {
      contentStatus = parsedData;
    } else {
      console.log('Content status data is not an array, initializing empty array');
      contentStatus = [];
    }
  }
  
  console.log(`Loaded ${agentActivities.length} existing activities and ${contentStatus.length} content items`);
} catch (error) {
  console.error('Error loading existing data:', error.message);
  // Ensure we reset to empty arrays if there was an error
  agentActivities = [];
  contentStatus = [];
}

// Log agent activity
async function logActivity(agent, action, details) {
  const activity = {
    agent,
    action,
    details,
    timestamp: new Date().toISOString()
  };
  
  agentActivities.push(activity);
  
  // Save activities to a file that can be accessed by the admin dashboard
  try {
    await fsPromises.mkdir(path.join('public', 'api', 'agent-activities'), { recursive: true });
    await fsPromises.writeFile(
      path.join('public', 'api', 'agent-activities', 'data.json'), 
      JSON.stringify(agentActivities, null, 2)
    );
    console.log(`Activity logged: ${agent} - ${action}`);
  } catch (error) {
    console.error(`Failed to save agent activity: ${error.message}`);
  }
  
  // Also save to data directory for API access
  try {
    await fsPromises.mkdir(path.join('data'), { recursive: true });
    await fsPromises.writeFile(
      path.join('data', 'agent-activities.json'), 
      JSON.stringify(agentActivities, null, 2)
    );
  } catch (error) {
    console.error(`Failed to save agent activity to data dir: ${error.message}`);
  }
}

// Update content status
async function updateContentStatus(id, title, status, author) {
  // Find if content already exists
  const existingIndex = contentStatus.findIndex(item => item.id === id);
  
  if (existingIndex >= 0) {
    contentStatus[existingIndex] = {
      ...contentStatus[existingIndex],
      status,
      lastUpdated: new Date().toISOString()
    };
  } else {
    contentStatus.push({
      id,
      title,
      status,
      lastUpdated: new Date().toISOString(),
      author
    });
  }
  
  // Save content status to a file that can be accessed by the admin dashboard
  try {
    await fsPromises.mkdir(path.join('public', 'api', 'content'), { recursive: true });
    await fsPromises.writeFile(
      path.join('public', 'api', 'content', 'data.json'), 
      JSON.stringify(contentStatus, null, 2)
    );
    console.log(`Content status updated: ${id} - ${status}`);
  } catch (error) {
    console.error(`Failed to save content status: ${error.message}`);
  }
}

// Agent Setup
async function createAssistant(name, instructions) {
  const assistant = await openai.beta.assistants.create({
    name,
    instructions,
    model: 'gpt-4o',
  });
  
  await logActivity(name, 'Created', `Assistant created with ID: ${assistant.id}`);
  console.log(`Created assistant: ${name} with ID: ${assistant.id}`);
  return assistant;
}

// Enhanced setup agents with client info
async function setupAgents(clientData = {}) {
  console.log('Setting up AI content generator...');
  const agents = {};
  
  // Format client practice areas for use in prompts
  const practiceAreas = clientData.practiceAreas || 'criminal defense and personal injury';
  const businessName = clientData.businessName || 'Law Firm';
  const tone = clientData.tone || 'professional';
  const uniquePoints = clientData.uniqueSellingPoints || '';
  const targetAudience = clientData.targetAudience || '';

  // We're simplifying to just use one primary content writer agent with comprehensive instructions
  agents.contentWriter = await createAssistant('Content Writer', 
    `You are a professional website content creator for ${businessName}, a law firm specializing in ${practiceAreas}.
     
     IMPORTANT INSTRUCTIONS:
     1. Write ONLY the final client-ready content that will appear on the website.
     2. DO NOT include any meta-commentary, notes about your process, or phrases like "As a content writer".
     3. DO NOT include any system messages, instructions, or explanations in your output.
     4. Write in a ${tone} tone that appeals to ${targetAudience}.
     5. Highlight these unique selling points: ${uniquePoints}.
     6. Format content using markdown with proper headings (# for main title, ## for sections, etc.)
     7. Include clear calls to action and contact information where appropriate.
     
     For image placeholders, use this format: ![Description of image](generate: detailed description for AI image generation)
     
     Your goal is to create SEO-optimized content that demonstrates legal expertise and drives client conversions.
     Each page should be complete, polished, and ready to publish as-is.`
  );
  
  await logActivity('System', 'Setup Complete', `Content generation system ready for ${businessName}`);
  console.log('Content generator setup complete');
  return agents;
}

// Thread Management with streamlined content generation
async function manageThread(agents, pagesToGenerate = ['homepage', 'services', 'about', 'contact', 'blog']) {
  console.log('Starting direct content generation process...');
  
  // Generate each page with specific, detailed instructions
  for (const pageName of pagesToGenerate) {
    // Create a new thread for each page to ensure fresh context
    let thread = await openai.beta.threads.create();
    console.log(`Thread created for ${pageName} with ID: ${thread.id}`);
    
    await logActivity('System', 'Page Generation', `Starting content for ${pageName}`);
    console.log(`Generating content for: ${pageName}`);
    
    // Create a targeted prompt for each page type
    let pageSpecificPrompt;
    
    switch(pageName) {
      case 'homepage':
        pageSpecificPrompt = `Create the homepage content for the law firm website. 
          Include a compelling headline, brief overview of services, unique selling points, 
          and a strong call to action. The page should immediately convey trust and expertise.`;
        break;
      
      case 'services':
        pageSpecificPrompt = `Create the services overview page that details the firm's 
          practice areas. Each service should have its own section with a clear explanation 
          of how the firm helps clients in this area, what sets them apart, and relevant 
          case experience or outcomes.`;
        break;
      
      case 'about':
        pageSpecificPrompt = `Create the about page content that tells the firm's story, 
          introduces key attorneys, explains the firm's values and approach, and builds credibility.
          Include sections for firm history, attorney profiles, and the firm's community involvement.`;
        break;
      
      case 'contact':
        pageSpecificPrompt = `Create the contact page content with a brief introduction encouraging 
          potential clients to reach out. Include placeholders for contact form, office locations, 
          phone numbers, and email. Add a brief FAQ section about the initial consultation process.`;
        break;
      
      case 'blog':
        pageSpecificPrompt = `Create a blog post on a relevant legal topic that would interest 
          potential clients. The post should demonstrate expertise, provide valuable information, 
          and include a call to action to contact the firm for legal help.`;
        break;
      
      default:
        pageSpecificPrompt = `Create content for the ${pageName} page of the law firm website.`;
    }
    
    // Send the detailed prompt to the content writer
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `${pageSpecificPrompt}
        
        IMPORTANT REMINDERS:
        1. Write ONLY the final client-ready content in markdown format
        2. Start with a clear main heading (#)
        3. Do NOT include any explanations, notes, or commentary about the content
        4. Do NOT write phrases like "Here's the content for..." or "As requested..."
        5. Simply write the actual page content that would appear on the website
        
        For images, use: ![Description](generate: detailed professional legal image description)`,
    });

    console.log('Generating content with focused instructions...');
    const run = await openai.beta.threads.runs.create(thread.id, { 
      assistant_id: agents.contentWriter.id 
    });
    
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    console.log(`Run status: ${runStatus.status}`);
    
    // Track the starting time
    const startTime = Date.now();
    
    while (runStatus.status !== 'completed') {
      if (runStatus.status === 'failed') {
        console.error(`Run failed: ${runStatus.last_error?.message || 'Unknown error'}`);
        await logActivity('Content Writer', 'Failed', `Run failed: ${runStatus.last_error?.message || 'Unknown error'}`);
        break;
      }
      console.log(`Waiting for content generation to complete. Current status: ${runStatus.status}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }
    
    // Calculate duration in seconds
    const duration = Math.round((Date.now() - startTime) / 1000);

    // Retrieve the generated content
    const response = await openai.beta.threads.messages.list(thread.id);
    if (response.data && response.data.length > 0 && response.data[0].content && response.data[0].content.length > 0) {
      const content = response.data[0].content[0].text?.value;
      
      if (content) {
        // Process the content - ensuring it doesn't contain system prompts or explanations
        let cleanContent = content;
        
        // Remove any disclaimers or explanations that might appear at the beginning
        cleanContent = cleanContent.replace(/^(Here is|Here's|As requested|I've created|This is|Below is|Following is).*?\n/i, '');
        
        // Remove any note sections at the end
        cleanContent = cleanContent.replace(/\n\*\*Note:?\*\*.*$/is, '');
        cleanContent = cleanContent.replace(/\n\*Note:?\*.*$/is, '');
        
        // Save the clean content to file
        await fsPromises.mkdir('content', { recursive: true });
        const formattedPageName = formatPageName(pageName);
        
        // Check if we're dealing with a blog post that needs to go in subdirectory
        if (formattedPageName.includes('/')) {
          // Create subdirectories as needed
          const dir = path.dirname(formattedPageName);
          await fsPromises.mkdir(path.join('content', dir), { recursive: true });
        }
        
        // Save the content with proper file name and extension
        const fileName = path.basename(formattedPageName);
        const dirPath = path.dirname(formattedPageName);
        
        // If dirPath is '.', it's in the root content folder
        const finalPath = dirPath === '.' 
          ? path.join('content', `${fileName}.md`)
          : path.join('content', dirPath, `${fileName}.md`);
          
        await fsPromises.writeFile(finalPath, cleanContent);
        
        console.log(`Content saved to ${finalPath} (${cleanContent.length} chars, generated in ${duration}s)`);
        
        // Update content status
        await updateContentStatus(
          formattedPageName, 
          formatPageTitle(pageName), 
          'pending', 
          'Content Writer'
        );
        
        await logActivity(
          'Content Writer', 
          'Page Created', 
          `Created ${formatPageTitle(pageName)} (${cleanContent.length} chars in ${duration}s)`
        );
      } else {
        console.log('No content text found in response');
      }
    } else {
      console.log('No response data available');
    }
  }
}

// Helper function to get agent name from ID
function getAgentNameById(id, agents) {
  for (const [key, agent] of Object.entries(agents)) {
    if (agent.id === id) {
      return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    }
  }
  return 'Unknown Agent';
}

// Helper function to format page name for file saving
function formatPageName(pageName) {
  // Normalize the pageName to lowercase
  const normalizedPage = pageName.toLowerCase();
  
  // Handle blog-related pages with structure that supports flat URLs via rewrites
  if (normalizedPage === 'blog') {
    return 'blog'; // Main blog index
  } else if (normalizedPage.startsWith('blog-')) {
    // For blog posts, maintain blog/ folder structure but use flat URLs in the frontend
    // This follows the pattern:
    // - File structure: /blog/my-post/page.tsx
    // - URL structure:  /my-post  (flat URL via Next.js rewrites)
    const slug = normalizedPage.replace('blog-', '').replace(/\s+/g, '-');
    return `blog/${slug}`; // Keep in blog folder for organization, but URLs will be flat
  }
  
  // Handle services-related pages - all services pages become just "services"
  if (normalizedPage === 'services' || normalizedPage === 'services-overview' || normalizedPage.startsWith('services-')) {
    return 'services';
  }
  
  // For other pages, convert to kebab case
  return normalizedPage.replace(/\s+/g, '-');
}

// Helper function to format page title
function formatPageTitle(pageName) {
  // Normalize the pageName to lowercase
  const normalizedPage = pageName.toLowerCase();
  
  // Handle blog-related pages
  if (normalizedPage === 'blog') {
    return 'Blog'; // Main blog index title
  } else if (normalizedPage.startsWith('blog-') || normalizedPage.includes('blog')) {
    // Create individual blog post titles
    const titleBase = normalizedPage.replace('blog-', '');
    // Capitalize each word for blog post title
    return titleBase
      .split(/[- ]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Handle services-related pages
  if (normalizedPage === 'services' || normalizedPage === 'services-overview' || normalizedPage.startsWith('services-')) {
    return 'Services';
  }
  
  // Capitalize each word for other pages
  return pageName
    .split(/[- ]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Image Processing
async function processImages() {
  console.log('Processing images from markdown content...');
  const contentDir = 'content';
  
  // Recursive function to process files in a directory and its subdirectories
  async function processFilesInDir(dir) {
    const entries = await fsPromises.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively process subdirectories
        await processFilesInDir(fullPath);
      } else if (entry.name.endsWith('.md')) {
        // Process markdown files
        console.log(`Processing file: ${fullPath}`);
        let content = await fsPromises.readFile(fullPath, 'utf8');
        const placeholderRegex = /!\[.*?\]\(generate: (.*?)\)/g;
        let match;
        let imageCount = 0;
        
        // Get content category from path for better image naming
        const contentCategory = path.relative(contentDir, dir).replace(/\\/g, '/');
        const baseName = entry.name.replace('.md', '');
        const imageNamePrefix = contentCategory 
          ? `${contentCategory}-${baseName}` 
          : baseName;
        
        while ((match = placeholderRegex.exec(content)) !== null) {
          const description = match[1];
          console.log(`Generating image for: ${description}`);
          
          try {
            const image = await openai.images.generate({ 
              prompt: description, 
              model: 'dall-e-3',
              size: '1024x1024',
              quality: 'standard'
            });
            
            if (image && image.data && image.data[0] && image.data[0].url) {
              const imageName = `${imageNamePrefix}-image-${imageCount}-${Date.now()}.webp`;
              const imagePath = path.join('public', 'images', imageName);
              const webImagePath = `/images/${imageName}`;
              
              console.log(`Downloading image to: ${imagePath}`);
              
              // Create directories if they don't exist
              await fsPromises.mkdir(path.dirname(imagePath), { recursive: true })
                .catch(err => {
                  if (err.code !== 'EEXIST') throw err;
                });
          
          // Download and save the image
          const imageResponse = await fetch(image.data[0].url);
          const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
          await fsPromises.writeFile(imagePath, imageBuffer);
          
          // Update the markdown content
          content = content.replace(match[0], `![${description}](${webImagePath})`);
          imageCount++;
          
          console.log(`Image saved and markdown updated`);
        } else {
          console.error('Image generation response did not contain expected data');
        }
      } catch (error) {
        console.error(`Error generating image: ${error.message}`);
      }
    }
    
    // Save the updated markdown content
    await fsPromises.writeFile(fullPath, content);
    console.log(`Updated markdown saved with ${imageCount} image(s)`);
      }
    }
  }
  
  // Start processing from the content root directory
  await processFilesInDir(contentDir);
}

// Build Next.js Pages
async function buildPages() {
  console.log('Building Next.js pages from markdown content...');
  const contentDir = 'content';
  const pagesDir = path.join('src', 'pages');
  const appDir = path.join('src', 'app');
  
  // Create directories if they don't exist
  await fsPromises.mkdir(pagesDir, { recursive: true })
    .catch(err => {
      if (err.code !== 'EEXIST') throw err;
    });
    
  await fsPromises.mkdir(appDir, { recursive: true })
    .catch(err => {
      if (err.code !== 'EEXIST') throw err;
    });
  
  // Helper function to process content files recursively
  async function processContentFiles(contentPath, relativePath = '') {
    const entries = await fsPromises.readdir(contentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const entryPath = path.join(contentPath, entry.name);
      const relPath = relativePath ? path.join(relativePath, entry.name) : entry.name;
      
      if (entry.isDirectory()) {
        // Recursively process directories
        await processContentFiles(entryPath, relPath);
      } else if (entry.name.endsWith('.md')) {
        console.log(`Processing content file: ${relPath}`);
        const content = await fsPromises.readFile(entryPath, 'utf8');
        
        // Extract frontmatter if present
        const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
        const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
        const pageContent = frontmatterMatch ? content.replace(/---\n[\s\S]*?\n---/, '') : content;
        
        // Determine appropriate file paths and component names
        const basename = entry.name.replace('.md', '');
        
        // Special handling for blog index file
        if (basename === '_index' && relPath.startsWith('blog')) {
          console.log('Processing blog index file');
          await generateBlogIndexPages(contentPath, relativePath);
          continue;
        }
        
        // Create component name from basename
        const componentName = basename
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join('');
        
        // Determine if we're building for app router or pages router
        // Blog content goes to App Router, other content goes to Pages Router for now
        let targetDir;
        if (relativePath.startsWith('blog')) {
          // For App Router, create structure in blog folder but with URL rewrite support
          if (basename === '_index' || relativePath === 'blog') {
            // For the main blog index, use /blog/page.tsx
            targetDir = path.join(appDir, 'blog');
          } else {
            // For blog posts, place them in /blog/:slug folder but they'll be accessed via /:slug URL
            targetDir = path.join(appDir, 'blog', basename);
          }
          
          await fsPromises.mkdir(targetDir, { recursive: true })
            .catch(err => {
              if (err.code !== 'EEXIST') throw err;
            });
        } else {
          // Use Pages Router for non-blog content
          targetDir = pagesDir;
        }
        
        // Updated page script with hydration-safe component structure
        const pageScript = `import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function ${componentName}() {
  return (
    <div className="container mx-auto p-4">
      <ReactMarkdown
        components={{
          // Use a custom p component for images to avoid invalid nesting
          p: ({ node, children }) => {
            // Check if the paragraph contains only an image
            const hasOnlyImage = 
              node.children.length === 1 && 
              node.children[0].type === 'element' && 
              node.children[0].tagName === 'img';

            // If it's just an image, don't wrap it in a <p> tag
            if (hasOnlyImage) {
              return <>{children}</>;
            }
            // Otherwise, render as normal paragraph
            return <p>{children}</p>;
          },
          // Custom image component using Next.js Image
          img: ({ src, alt }) => (
            <figure className="my-4">
              <Image 
                src={src} 
                alt={alt || ''} 
                width={600} 
                height={400} 
                className="rounded-lg shadow-lg" 
              />
              {alt && <figcaption className="text-center text-sm text-gray-500 mt-2">{alt}</figcaption>}
            </figure>
          )
        }}
      >
        {\`${pageContent.replace(/`/g, '\\`')}\`}
      </ReactMarkdown>
    </div>
  );
}`;

        // Determine where to save the file and in what format
        let outputFilePath;
        let outputFormat = 'js';
        
        if (relativePath.startsWith('blog')) {
          // For App Router, use page.tsx in the slug directory
          outputFilePath = path.join(targetDir, 'page.tsx');
          outputFormat = 'tsx'; 
        } else {
          // For Pages Router
          outputFilePath = path.join(targetDir, `${basename}.js`);
        }
        
        // Add metadata for TypeScript/TSX files
        if (outputFormat === 'tsx') {
          const metadataScript = `import { Metadata } from 'next';
import { generateMetadata } from '${relativePath.includes('/') ? '../'.repeat(relativePath.split('/').length) : ''}../utils/metadata';
${pageScript}

// SEO: Generate metadata
export const metadata: Metadata = generateMetadata({
  title: "${componentName.replace(/([A-Z])/g, ' $1').trim()}",
  description: "Professional legal advice and representation for ${componentName.replace(/([A-Z])/g, ' $1').trim().toLowerCase()} cases.",
  path: "/${relativePath.replace('/_index', '')}",
  keywords: ["legal advice", "law firm", "${componentName.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}", "attorney"],
  openGraph: {}
});`;
          await fsPromises.writeFile(outputFilePath, metadataScript);
        } else {
          await fsPromises.writeFile(outputFilePath, pageScript);
        }
        
        console.log(`Page created: ${outputFilePath}`);
        
        // Update content status to include build status
        const statusId = relativePath ? 
          (relativePath + '/' + basename).replace('/_index', '') :
          basename;
        await updateContentStatus(statusId, formatPageTitle(statusId), 'built', 'Content Writer');
      }
    }
  }
  
  // Function to generate blog index pages from blog posts
  async function generateBlogIndexPages(blogDir, relativePath) {
    console.log('Generating blog index pages...');
    
    // Create App Router blog directory
    const blogAppDir = path.join(appDir, 'blog');
    await fsPromises.mkdir(blogAppDir, { recursive: true })
      .catch(err => {
        if (err.code !== 'EEXIST') throw err;
      });
    
    // Create blog index page.tsx
    const blogIndexScript = `import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { generateMetadata } from '../../utils/metadata';
import { generateWebPageSchema, generateBreadcrumbSchema } from '../../utils/schemaMarkup';
import BreadcrumbNav from '../components/BreadcrumbNav';

// SEO: Generate metadata according to SEO guidelines
export const metadata: Metadata = generateMetadata({
  title: "Criminal Defense Law Blog",
  description: "Expert insights on criminal defense law, DUI charges, drug offenses, and domestic violence cases from our experienced attorneys.",
  path: "/blog",
  keywords: ["criminal defense blog", "legal blog", "law firm blog", "legal advice", "attorney blog"],
  openGraph: {},
  image: "/images/blog-image-0-1746709482001.webp"
});

export default function BlogPage() {
  // Blog posts data - in a real implementation this would come from CMS or API
  const posts = [
    {
      title: "Understanding DUI Laws in California",
      slug: "understanding-dui-laws-california",
      excerpt: "Learn about the latest DUI laws in California and how they might impact your case if you're facing charges.",
      publishDate: "2025-03-15T08:00:00.000Z",
      author: "John Smith",
      featuredImage: "/images/blog-image-0-1746709482001.webp",
      categories: ["DUI Defense", "California Law"]
    },
    {
      title: "What to Expect During Your Criminal Case",
      slug: "what-to-expect-during-criminal-case",
      excerpt: "A step-by-step guide to the criminal justice process and what defendants should expect.",
      publishDate: "2025-04-02T08:00:00.000Z",
      author: "Samantha Greene",
      featuredImage: "/images/blog-image-1-1746709498700.webp",
      categories: ["Criminal Defense", "Legal Process"]
    },
    {
      title: "Domestic Violence Defense Strategies",
      slug: "domestic-violence-defense-strategies",
      excerpt: "Explore effective defense strategies for those facing domestic violence charges.",
      publishDate: "2025-04-28T08:00:00.000Z",
      author: "Robert Johnson",
      featuredImage: "/images/blog-image-2-1746709515145.webp",
      categories: ["Domestic Violence", "Defense Strategies"]
    }
  ];
  
  // Define breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' }
  ];
  
  // SEO: Generate schema.org markup
  const blogPageSchema = generateWebPageSchema(
    "Criminal Defense Law Blog", 
    "Expert insights on criminal defense law topics from our experienced attorneys.",
    "https://yourwebsite.com/blog",
    "https://yourwebsite.com/images/blog-image-0-1746709482001.webp"
  );
  
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      {/* Schema markup for SEO */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPageSchema) }}
      />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <main className="container mx-auto px-4 py-8">
        <BreadcrumbNav items={breadcrumbItems} />
        
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Criminal Defense Law Blog</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            Expert insights and legal information on criminal defense matters from our experienced attorneys.
          </p>
        </section>
        
        {/* Blog post listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-3">
                  {post.categories.map(category => (
                    <span key={category} className="mr-2 inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                      {category}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-bold mb-2">
                  <Link href={\`/blog/\${post.slug}\`} className="hover:text-blue-700">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {post.excerpt}
                </p>
                <div className="text-sm text-gray-500">
                  <span>{post.author}</span>
                  <span className="mx-2">•</span>
                  <time dateTime={post.publishDate}>
                    {new Date(post.publishDate).toLocaleDateString()}
                  </time>
                </div>
                <div className="mt-4">
                  <Link href={\`/blog/\${post.slug}\`} className="text-blue-700 font-medium hover:underline">
                    Read more →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}`;
    
    const blogIndexPath = path.join(blogAppDir, 'page.tsx');
    await fsPromises.writeFile(blogIndexPath, blogIndexScript);
    console.log(`Blog index page created at: ${blogIndexPath}`);
    
    // Update content status for blog index
    await updateContentStatus('blog', 'Blog', 'built', 'Content Writer');
  }
  
  // Start processing content files
  await processContentFiles(contentDir);
}

// Regenerate specific content based on feedback
async function regenerateContent(pageId, feedback) {
  console.log(`Regenerating content for ${pageId} based on feedback`);
  
  // Get the existing content and client info
  let existingContent;
  let clientInfo;
  
  try {
    const contentDataPath = path.join('src', 'app', 'api', 'content', 'data.json');
    const contentData = JSON.parse(await fsPromises.readFile(contentDataPath, 'utf8'));
    const pageData = contentData.find(page => page.id === pageId);
    existingContent = pageData?.content || '';
    
    // Try to get client info
    try {
      const clientDataPath = path.join('src', 'app', 'api', 'client-info', 'data.json');
      clientInfo = JSON.parse(await fsPromises.readFile(clientDataPath, 'utf8'));
    } catch (error) {
      console.log('No client info found');
    }
  } catch (error) {
    console.error(`Error reading existing content: ${error.message}`);
  }
  
  // Setup the individual content writer agent
  const contentWriter = await createAssistant('Content Rewriter', 
    `You are tasked with creating improved website content for a law firm's website based on feedback.
    
     IMPORTANT: You must write ONLY the final client-ready content that will appear on the website. 
     DO NOT write about how you would write the content or include any notes/commentary about your process.
     DO NOT use phrases like "As the content writer" or "Here's how I would write".
     
     Write direct, professional content that's ready to be published on the website immediately.
     
     Focus on:
     - Addressing all client feedback
     - Creating SEO-optimized content with relevant keywords
     - Maintaining a professional and persuasive tone
     - Including appropriate calls to action
     - Using markdown formatting for headings, lists, and emphasis
     
     Keep image placeholders in the format: ![Description of what the image should show](generate: detailed description for AI image generation)
     
     Submit your content as a complete, ready-to-publish webpage that will persuasively communicate the firm's services to potential clients.`
  );
  
  // Create a thread for the regeneration
  const thread = await openai.beta.threads.create();
  
  // Construct the prompt with all context
  const prompt = `I need you to rewrite the following content for "${pageId}":

ORIGINAL CONTENT:
${existingContent}

FEEDBACK TO ADDRESS:
${feedback}

${clientInfo ? `
CLIENT INFORMATION:
Business: ${clientInfo.businessName}
Industry: ${clientInfo.industry}
Unique Selling Points: ${clientInfo.uniqueSellingPoints}
Preferred Tone: ${clientInfo.tone}
` : ''}

Please provide a complete rewrite that addresses all the feedback while maintaining SEO value and improving the quality. Keep image placeholders in the format ![alt](generate: description).`;

  // Create the message and run the assistant
  await openai.beta.threads.messages.create(thread.id, {
    role: 'user',
    content: prompt,
  });
  
  const run = await openai.beta.threads.runs.create(thread.id, { 
    assistant_id: contentWriter.id 
  });
  
  let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  console.log(`Regeneration run status: ${runStatus.status}`);
  
  while (runStatus.status !== 'completed') {
    if (runStatus.status === 'failed') {
      console.error(`Run failed: ${runStatus.last_error?.message || 'Unknown error'}`);
      await logActivity('Content Rewriter', 'Failed', `Run failed: ${runStatus.last_error?.message || 'Unknown error'}`);
      throw new Error('Content regeneration failed');
    }
    
    console.log(`Waiting for regeneration run to complete. Current status: ${runStatus.status}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  }
  
  // Get the response
  const response = await openai.beta.threads.messages.list(thread.id);
  if (response.data && response.data.length > 0 && response.data[0].content && response.data[0].content.length > 0) {
    const newContent = response.data[0].content[0].text?.value;
    
    if (newContent) {
      // Save the new content
      await fsPromises.writeFile(path.join('content', `${pageId}.md`), newContent);
      
      // Update content status
      await updateContentStatus(pageId, 'regenerated');
      
      // Log the activity
      await logActivity('Content Rewriter', 'Content Regenerated', `Page "${pageId}" regenerated with ${newContent.length} characters`);
      
      return newContent;
    }
  }
  
  throw new Error('Failed to get regenerated content');
}

// Main function to orchestrate the agents
async function orchestrateAgents(options = {}) {
  console.log('Starting agent orchestration...');
  const { 
    clientInfo, 
    regeneratePageId,
    feedback,
    onActivity,
    onContentUpdate 
  } = options;

  try {
    // Use custom activity logger if provided or fall back to the default logActivity function
    const logActivityFn = onActivity || logActivity;
    
    // Set up agents with client information
    const agents = await setupAgents(clientInfo);
    
    if (regeneratePageId) {
      // Handle regeneration of specific content
      await regenerateContent(regeneratePageId, feedback);
    } else {
      // Normal flow for generating full content
      await manageThread(agents);
      await processImages();
      await buildPages();
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Agent orchestration error: ${error.message}`);
    // Use the standard logActivity function to ensure it works properly
    await logActivity('System', 'Error', error.message);
    return { success: false, error: error.message };
  }
}

// Export the functions that are needed by other modules
module.exports = {
  orchestrateAgents,
  setupAgents,
  manageThread,
  processImages,
  buildPages,
  regenerateContent,
  logActivity,
  updateContentStatus,
  formatPageName,
  formatPageTitle
};