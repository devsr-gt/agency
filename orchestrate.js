const { OpenAI } = require('openai');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Agent Setup
async function createAssistant(name, instructions) {
  const assistant = await openai.beta.assistants.create({
    name,
    instructions,
    model: 'gpt-4o',
  });
  console.log(`Created assistant: ${name} with ID: ${assistant.id}`);
  return assistant;
}

async function setupAgents() {
  console.log('Setting up AI agents...');
  const agents = {};

  agents.teamLead = await createAssistant('Team Lead', 
    'You are the team lead for a project to build a website for a law firm specializing in criminal defense and personal injury. Set the strategy, coordinate agents, and approve outputs. Start by posting: "Build a website to attract clients via organic search."'
  );

  agents.seoManager = await createAssistant('SEO Manager', 
    'You are an SEO expert. Use the SEO Audit & Optimization Service (simulate with your knowledge) to research keywords for criminal defense and personal injury law. Provide a list of target keywords and metadata. Share with the Content Manager.'
  );

  agents.contentManager = await createAssistant('Content Manager', 
    'You are a content planner. Use SEO keywords to plan page structure (e.g., homepage, services). Ensure quality and guide the Content Writer and Image Designer.'
  );

  agents.contentWriter = await createAssistant('Content Writer', 
    'You are a writer for legal content. Write markdown files for each page using SEO keywords. Include image placeholders like ![alt](generate: description). Submit to Fact-Checker and Content Manager.'
  );

  agents.imageDesigner = await createAssistant('Image Designer', 
    'You generate images using DALL-E 3. Process markdown placeholders (e.g., ![alt](generate: description)), create images, save to public/images, and update markdown with paths (e.g., /images/file.webp).'
  );

  agents.factChecker = await createAssistant('Fact-Checker', 
    'You verify content accuracy. Check Content Writer\'s drafts, suggest corrections, and return feedback.'
  );

  console.log('All agents setup complete');
  return agents;
}

// Thread Management
async function manageThread(agents) {
  console.log('Creating thread for agent communication...');
  const thread = await openai.beta.threads.create();
  console.log(`Thread created with ID: ${thread.id}`);

  const messages = [
    { assistant_id: agents.teamLead.id, content: "Build a website to attract clients via organic search.", role: 'user' },
    { assistant_id: agents.seoManager.id, role: 'assistant' },
    { assistant_id: agents.contentManager.id, role: 'assistant' },
    { assistant_id: agents.contentWriter.id, role: 'assistant' },
    { assistant_id: agents.imageDesigner.id, role: 'assistant' },
    { assistant_id: agents.factChecker.id, role: 'assistant' },
  ];

  console.log('Starting agent communication sequence...');
  for (const msg of messages) {
    console.log(`Processing message for agent: ${msg.assistant_id}`);
    
    await openai.beta.threads.messages.create(thread.id, {
      role: msg.role || 'user',
      content: msg.content || 'Respond based on your role.',
    });

    console.log('Running assistant...');
    const run = await openai.beta.threads.runs.create(thread.id, { 
      assistant_id: msg.assistant_id 
    });
    
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    console.log(`Run status: ${runStatus.status}`);
    
    while (runStatus.status !== 'completed') {
      if (runStatus.status === 'failed') {
        console.error(`Run failed: ${runStatus.last_error?.message || 'Unknown error'}`);
        break;
      }
      console.log(`Waiting for run to complete. Current status: ${runStatus.status}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    const response = await openai.beta.threads.messages.list(thread.id);
    if (response.data && response.data.length > 0 && response.data[0].content && response.data[0].content.length > 0) {
      const latestMessage = response.data[0].content[0].text?.value;
      console.log(`Response from agent: ${latestMessage?.substring(0, 100)}...`);

      // If this is the content writer, save the output to a markdown file
      if (msg.assistant_id === agents.contentWriter.id && latestMessage) {
        await fs.mkdir('content', { recursive: true });
        const pageName = 'homepage';
        await fs.writeFile(path.join('content', `${pageName}.md`), latestMessage);
        console.log(`Content saved to content/${pageName}.md`);
      }
    } else {
      console.log('No response content available');
    }
  }
}

// Image Processing
async function processImages() {
  console.log('Processing images from markdown content...');
  const contentDir = 'content';
  const files = await fs.readdir(contentDir);
  for (const file of files) {
    console.log(`Processing file: ${file}`);
    let content = await fs.readFile(path.join(contentDir, file), 'utf8');
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
          await fs.mkdir(path.dirname(imagePath), { recursive: true });
          
          // Download and save the image
          const imageResponse = await fetch(image.data[0].url);
          const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
          await fs.writeFile(imagePath, imageBuffer);
          
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
    await fs.writeFile(path.join(contentDir, file), content);
    console.log(`Updated markdown saved with ${imageCount} image(s)`);
  }
}

// Build Next.js Pages
async function buildPages() {
  console.log('Building Next.js pages from markdown content...');
  const contentDir = 'content';
  const pagesDir = path.join('src', 'pages');
  
  // Create pages directory if it doesn't exist
  await fs.mkdir(pagesDir, { recursive: true });
  
  const files = await fs.readdir(contentDir);
  for (const file of files) {
    console.log(`Processing file for page creation: ${file}`);
    const content = await fs.readFile(path.join(contentDir, file), 'utf8');
    
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
          img: ({ node, src, alt }) => (
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

    await fs.writeFile(path.join(pagesDir, `${pageName}.js`), pageScript);
    console.log(`Page created: ${pagesDir}/${pageName}.js`);
  }
}

// Main Orchestration
async function orchestrate() {
  try {
    console.log('Starting orchestration process...');
    
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('Error: OPENAI_API_KEY not found in environment variables');
      process.exit(1);
    }
    
    const agents = await setupAgents();
    await manageThread(agents);
    await processImages();
    await buildPages();
    
    console.log('Building and exporting Next.js project...');
    exec('npm run build', (err) => {
      if (err) {
        console.error(`Error during build: ${err.message}`);
      } else {
        console.log('Build and export complete.');
      }
    });
    
    console.log('Orchestration complete!');
  } catch (error) {
    console.error(`Orchestration failed: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  orchestrate().catch(console.error);
}

module.exports = { orchestrate, setupAgents, manageThread, processImages, buildPages };