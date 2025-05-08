Based on the provided documents, I have streamlined the instructions to eliminate conflicts and ensure a cohesive workflow for Agata Reilly’s automated system for content creation, web building, and social media management targeting law firms in criminal defense. Below is the unified plan, integrating all agents, services, and processes into a clear, step-by-step guide.

---

## Unified System Overview

This system automates content creation, web building, and social media management for law firms specializing in criminal defense. It leverages AI agents powered by the OpenAI Assistants API, each with specialized roles, to produce high-quality, SEO-optimized content and a Next.js website. The system ensures consistency with Agata Reilly’s brand voice—**authoritative yet approachable**—and adheres to her visual identity (e.g., Montserrat, Merriweather, Oswald fonts; deep blues and crisp whites) and core values: authenticity, innovation, consistency, and results.

---

## System Setup

### Next.js Project

- Create a Next.js project with Tailwind CSS:
    
    `npx create-next-app@latest my-law-firm-site --use-npm --tailwind`
    
- Install dependencies:
    
    `npm install react-markdown next-mdx-remote openai`
    
- Set up directories: content/ for markdown, public/images/ for images, public/videos/ for videos.
- Store API keys in a .env file.

### AI Agents

- Use the **OpenAI Assistants API** to define each agent with specific instructions.
- Enable agent communication through a shared thread.

### Tools

- **Image Generation**: Use **DALL-E 3** for high-quality images.
- **Video Generation**: Use **Synthesia** for professional videos (optional).
- **SEO Research**: Simulate keyword research using the SEO Manager Agent’s knowledge or integrate a mock API.

---

## Instructions for ChatGPT 4o-high

Below is a Node.js script that orchestrates the entire workflow, integrating all agents and processes without conflicts.

### Prompt 1: Create AI Agents
```javascript
const { OpenAI } = require('openai');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Agent Setup
async function createAssistant(name, instructions) {
  const assistant = await openai.beta.assistants.create({
    name,
    instructions,
    model: 'gpt-4o-high',
  });
  return assistant;
}

async function setupAgents() {
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
    'You verify content accuracy. Check Content Writer’s drafts, suggest corrections, and return feedback.'
  );

  return agents;
}

// Thread Management
async function manageThread(agents) {
  const thread = await openai.beta.threads.create();

  const messages = [
    { assistant_id: agents.teamLead.id, content: "Build a website to attract clients via organic search." },
    { assistant_id: agents.seoManager.id, role: 'assistant' },
    { assistant_id: agents.contentManager.id, role: 'assistant' },
    { assistant_id: agents.contentWriter.id, role: 'assistant' },
    { assistant_id: agents.imageDesigner.id, role: 'assistant' },
    { assistant_id: agents.factChecker.id, role: 'assistant' },
  ];

  for (const msg of messages) {
    await openai.beta.threads.messages.create(thread.id, {
      role: msg.role || 'user',
      content: msg.content || 'Respond based on your role.',
      assistant_id: msg.assistant_id,
    });

    const run = await openai.beta.threads.runs.create(thread.id, { assistant_id: msg.assistant_id });
    while ((await openai.beta.threads.runs.retrieve(thread.id, run.id)).status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const response = await openai.beta.threads.messages.list(thread.id);
    const latestMessage = response.data[0].content[0].text.value;

    if (msg.assistant_id === agents.contentWriter.id) {
      await fs.mkdir('content', { recursive: true });
      await fs.writeFile(path.join('content', 'page.md'), latestMessage);
    }
  }
}

// Image Processing
async function processImages() {
  const contentDir = 'content';
  const files = await fs.readdir(contentDir);
  for (const file of files) {
    let content = await fs.readFile(path.join(contentDir, file), 'utf8');
    const placeholderRegex = /!\[.*?\]\(generate: (.*?)\)/g;
    let match;
    while ((match = placeholderRegex.exec(content)) !== null) {
      const description = match[1];
      const image = await openai.images.generate({ prompt: description, model: 'dall-e-3' });
      const imagePath = path.join('public', 'images', `${file.split('.')[0]}-${Date.now()}.webp`);
      await fs.mkdir(path.dirname(imagePath), { recursive: true });
      await fs.writeFile(imagePath, Buffer.from(await (await fetch(image.data[0].url)).arrayBuffer()));
      content = content.replace(match[0], `![${description}](${imagePath})`);
    }
    await fs.writeFile(path.join(contentDir, file), content);
  }
}

// Build Next.js Pages
async function buildPages() {
  const contentDir = 'content';
  const pagesDir = 'pages';
  const files = await fs.readdir(contentDir);
  for (const file of files) {
    const content = await fs.readFile(path.join(contentDir, file), 'utf8');
    const frontmatter = content.match(/---\n([\s\S]*?)\n---/)?.[1] || '';
    const pageContent = content.replace(/---\n[\s\S]*?\n---/, '');
    const pageName = file.replace('.md', '');
    const pageScript = `
      import ReactMarkdown from 'react-markdown';
      import Image from 'next/image';

      export default function Page() {
        return (
          <div className="container mx-auto p-4">
            <ReactMarkdown
              components={{
                img: ({ src, alt }) => <Image src={src} alt={alt} width={500} height={300} className="my-4" />
              }}
            >
              {${JSON.stringify(pageContent)}}
            </ReactMarkdown>
          </div>
        );
      }
    `;
    await fs.mkdir(pagesDir, { recursive: true });
    await fs.writeFile(path.join(pagesDir, `${pageName}.js`), pageScript);
  }
}

// Main Orchestration
async function orchestrate() {
  const agents = await setupAgents();
  await manageThread(agents);
  await processImages();
  await buildPages();
  exec('next build && next export', (err) => {
    if (err) console.error(err);
    else console.log('Build and export complete.');
  });
}

orchestrate().catch(console.error);

## Additional Instructions

- **Review Dashboard**: Integrate outputs into the Review Dashboard for human oversight. Use **Slack** for notifications (e.g., /approve, /regenerate).
- **Governance & Security**:
    - Implement **RBAC** to restrict approvals and deployments.
    - Maintain **audit logs** for all actions.
    - Allow **manual override** for critical adjustments.
- **Technology Integration**:
    - Use a headless CMS (e.g., **Strapi**) for content management.
    - Use **Percy** for visual regression testing in staging.
    - Schedule social media posts via **Buffer** or **Hootsuite** APIs.
    - Set up analytics with **Google Analytics** and visualize in **Looker** or **Grafana**.

```

## Conclusion

This streamlined system ensures that all AI agents and services work in harmony, eliminating conflicts and redundancies. It delivers an efficient, high-quality digital presence for law firms, aligned with Agata Reilly’s brand and objectives, with measurable results and scalability.