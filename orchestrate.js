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
    agentActivities = JSON.parse(data);
  }
  
  if (fs.existsSync(contentStatusPath)) {
    const data = fs.readFileSync(contentStatusPath, 'utf8');
    contentStatus = JSON.parse(data);
  }
  
  console.log(`Loaded ${agentActivities.length} existing activities and ${contentStatus.length} content items`);
} catch (error) {
  console.error('Error loading existing data:', error.message);
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
      
      case 'blogs':
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
        await fsPromises.writeFile(path.join('content', `${formattedPageName}.md`), cleanContent);
        
        console.log(`Content saved to content/${formattedPageName}.md (${cleanContent.length} chars, generated in ${duration}s)`);
        
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
  
  // Handle blog-related pages - all blog pages become just "blog"
  if (normalizedPage === 'blog' || normalizedPage.startsWith('blog-') || normalizedPage.startsWith('blogs')) {
    return 'blog';
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
  if (normalizedPage === 'blog' || normalizedPage.startsWith('blog-') || normalizedPage.startsWith('blogs')) {
    return 'Blog';
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
  const files = await fsPromises.readdir(contentDir);
  for (const file of files) {
    console.log(`Processing file: ${file}`);
    let content = await fsPromises.readFile(path.join(contentDir, file), 'utf8');
    const placeholderRegex = /!\[.*?\]\(generate: (.*?)\)/g;
    let match;
    let imageCount = 0;
    
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
          const imageName = `${file.split('.')[0]}-image-${imageCount}-${Date.now()}.webp`;
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
    await fsPromises.writeFile(path.join(contentDir, file), content);
    console.log(`Updated markdown saved with ${imageCount} image(s)`);
  }
}

// Build Next.js Pages
async function buildPages() {
  console.log('Building Next.js pages from markdown content...');
  const contentDir = 'content';
  const pagesDir = path.join('src', 'pages');
  
  // Create pages directory if it doesn't exist
  await fsPromises.mkdir(pagesDir, { recursive: true })
    .catch(err => {
      if (err.code !== 'EEXIST') throw err;
    });
  
  const files = await fsPromises.readdir(contentDir);
  for (const file of files) {
    console.log(`Processing file for page creation: ${file}`);
    const content = await fsPromises.readFile(path.join(contentDir, file), 'utf8');
    
    // Extract frontmatter if present
    const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
    const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
    const pageContent = frontmatterMatch ? content.replace(/---\n[\s\S]*?\n---/, '') : content;
    
    const pageName = file.replace('.md', '');
    const pageScript = `import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}() {
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
        {\`${pageContent.replace(/`/g, '\\`')}\`}
      </ReactMarkdown>
    </div>
  );
}`;

    await fsPromises.writeFile(path.join(pagesDir, `${pageName}.js`), pageScript);
    console.log(`Page created: ${pagesDir}/${pageName}.js`);
    
    // Copy content status to include build status
    await updateContentStatus(pageName, 'built');
  }
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

  // Use custom activity logger if provided
  const logActivityFn = onActivity || logActivity;
  
  try {
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
    await logActivityFn('System', 'Error', error.message);
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
  updateContentStatus
};