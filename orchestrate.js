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
  console.log('Setting up AI agents...');
  const agents = {};
  
  // Format client practice areas for use in prompts
  const practiceAreas = clientData.practiceAreas || 'criminal defense and personal injury';
  const businessName = clientData.businessName || 'Law Firm';
  const tone = clientData.tone || 'professional';
  const uniquePoints = clientData.uniqueSellingPoints || '';
  const targetAudience = clientData.targetAudience || '';

  agents.teamLead = await createAssistant('Team Lead', 
    `You are the team lead for a project to build a website for ${businessName}, specializing in ${practiceAreas}. 
     The website should use a ${tone} tone and highlight these unique selling points: ${uniquePoints}.
     Set the strategy, coordinate agents, and approve outputs. 
     Start by posting: "Build a website to attract clients via organic search for ${businessName}."`
  );

  agents.seoManager = await createAssistant('SEO Manager', 
    `You are an SEO expert. Research keywords for ${practiceAreas} law practice targeting ${targetAudience}.
     Provide a list of target keywords and metadata. Share with the Content Manager.`
  );

  agents.contentManager = await createAssistant('Content Manager', 
    `You are a content planner for ${businessName}. Use SEO keywords to plan page structure (homepage, services pages for ${practiceAreas}, about, contact).
     Ensure content uses a ${tone} tone and highlights these unique selling points: ${uniquePoints}.
     Guide the Content Writer and Image Designer.`
  );

  agents.contentWriter = await createAssistant('Content Writer', 
    `You are a professional content writer creating the actual website content for ${businessName}, specializing in ${practiceAreas} law.

     IMPORTANT: You must write ONLY the final client-ready content that will appear on the website. 
     DO NOT write about how you would write the content or include any notes/commentary about your process.
     DO NOT use phrases like "As the content writer" or "Here's how I would write".
     
     Write direct, professional ${tone} content that's ready to be published on the website immediately.
     
     Focus on:
     - Creating SEO-optimized content with targeted keywords for ${practiceAreas}
     - Highlighting the firm's unique selling points: ${uniquePoints}
     - Writing for the target audience: ${targetAudience}
     - Including appropriate calls to action
     - Using markdown formatting for headings, lists, and emphasis
     
     Include image placeholders using the format: ![Description of what the image should show](generate: detailed description for AI image generation)
     
     Submit your content as a complete, ready-to-publish webpage that will persuasively communicate the firm's services to potential clients.`
  );

  agents.imageDesigner = await createAssistant('Image Designer', 
    `You generate images for ${businessName}'s website. Process markdown placeholders (e.g., ![alt](generate: description)),
     create images that represent ${practiceAreas} law services, save to public/images, and update markdown with paths.`
  );

  agents.factChecker = await createAssistant('Fact-Checker', 
    `You verify content accuracy for ${businessName}'s website. Check Content Writer's drafts for accuracy about ${practiceAreas} law,
     suggest corrections, and return feedback.`
  );

  await logActivity('System', 'Setup Complete', `All agents have been set up for ${businessName}`);
  console.log('All agents setup complete');
  return agents;
}

// Thread Management with enhanced logging
async function manageThread(agents, pagesToGenerate = ['homepage', 'services', 'about', 'contact', 'blog-1']) {
  console.log('Creating thread for agent communication...');
  const thread = await openai.beta.threads.create();
  console.log(`Thread created with ID: ${thread.id}`);
  
  await logActivity('System', 'Thread Created', `Thread created with ID: ${thread.id}`);

  // Create initial messages for each page type
  for (const pageName of pagesToGenerate) {
    console.log(`Starting content generation for: ${pageName}`);
    await logActivity('System', 'Page Generation Started', `Content generation for ${pageName} begun`);
    
    // Create a message flow for each page
    const messages = [
      { assistant_id: agents.teamLead.id, content: `Plan the ${pageName} page content strategy.`, role: 'user' },
      { assistant_id: agents.seoManager.id, role: 'assistant' },
      { assistant_id: agents.contentManager.id, role: 'assistant' },
      { assistant_id: agents.contentWriter.id, role: 'assistant' },
      { assistant_id: agents.imageDesigner.id, role: 'assistant' },
      { assistant_id: agents.factChecker.id, role: 'assistant' },
    ];

    console.log(`Starting agent communication sequence for ${pageName}...`);
    for (const msg of messages) {
      console.log(`Processing message for agent: ${msg.assistant_id}`);
      
      await openai.beta.threads.messages.create(thread.id, {
        role: msg.role || 'user',
        content: msg.content || `Process the ${pageName} content based on your role.`,
      });

      console.log('Running assistant...');
      const run = await openai.beta.threads.runs.create(thread.id, { 
        assistant_id: msg.assistant_id 
      });
      
      let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      console.log(`Run status: ${runStatus.status}`);
      
      // Track the starting time
      const startTime = Date.now();
      
      while (runStatus.status !== 'completed') {
        if (runStatus.status === 'failed') {
          console.error(`Run failed: ${runStatus.last_error?.message || 'Unknown error'}`);
          await logActivity(getAgentNameById(msg.assistant_id, agents), 'Failed', runStatus.last_error?.message || 'Unknown error');
          break;
        }
        console.log(`Waiting for run to complete. Current status: ${runStatus.status}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      }
      
      // Calculate duration in seconds
      const duration = Math.round((Date.now() - startTime) / 1000);

      const response = await openai.beta.threads.messages.list(thread.id);
      if (response.data && response.data.length > 0 && response.data[0].content && response.data[0].content.length > 0) {
        const latestMessage = response.data[0].content[0].text?.value;
        const agentName = getAgentNameById(msg.assistant_id, agents);
        console.log(`Response from agent ${agentName}: ${latestMessage?.substring(0, 100)}...`);
        
        // Log the activity
        await logActivity(
          agentName, 
          'Content Generated', 
          `Generated content for ${pageName} (${latestMessage?.length || 0} chars in ${duration}s)`
        );

        // If this is the content writer, save the output to a markdown file
        if (msg.assistant_id === agents.contentWriter.id && latestMessage) {
          await fsPromises.mkdir('content', { recursive: true });
          const formattedPageName = formatPageName(pageName);
          
          // Save agent response to a file
          await fsPromises.writeFile(path.join('content', `${formattedPageName}.md`), latestMessage);
          console.log(`Content saved to content/${formattedPageName}.md`);
          
          // Update content status
          await updateContentStatus(
            formattedPageName, 
            formatPageTitle(pageName), 
            'pending', 
            'Content Writer Agent'
          );
          
          await logActivity(
            'System', 
            'Content Saved', 
            `Content for ${pageName} saved to file ${formattedPageName}.md`
          );
        }
      } else {
        console.log('No response content available');
        await logActivity(getAgentNameById(msg.assistant_id, agents), 'No Content', `No content generated for ${pageName}`);
      }
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
  // Convert to kebab case and handle special cases
  if (pageName.startsWith('blog-')) {
    return pageName;
  }
  
  if (pageName === 'services') {
    return 'services-overview';
  }
  
  return pageName.toLowerCase().replace(/\s+/g, '-');
}

// Helper function to format page title
function formatPageTitle(pageName) {
  // Handle special cases
  if (pageName.startsWith('blog-')) {
    const blogNum = pageName.split('-')[1];
    return `Blog Post ${blogNum}`;
  }
  
  if (pageName === 'services') {
    return 'Services Overview';
  }
  
  // Capitalize each word
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