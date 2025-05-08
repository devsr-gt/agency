import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { orchestrateAgents } from '../../../../orchestrate.js';

// Import the SEO analyzer
const { analyzeAllContent } = require('../../../utils/seoAnalyzer');

// Initialize with data from files if available
let agentActivities = [];
let contentStatus = [];
let progressStatus = {
  contentCompletion: 0,
  seoOptimization: 0,
  keywordsGenerated: 0,
  pagesCreated: 0,
  pagesApproved: 0,
  seoDetails: {}
};
let clientInformation = null;

// Initialize data from files
try {
  // Try public/api path first (Next.js static data)
  const activitiesPath = path.join(process.cwd(), 'public', 'api', 'agent-activities', 'data.json');
  const contentPath = path.join(process.cwd(), 'public', 'api', 'content', 'data.json');
  
  // Fallback to data directory
  const dataActivitiesPath = path.join(process.cwd(), 'data', 'agent-activities.json');
  const dataContentPath = path.join(process.cwd(), 'data', 'content-status.json');
  
  if (existsSync(activitiesPath)) {
    agentActivities = JSON.parse(readFileSync(activitiesPath, 'utf8'));
    console.log(`Loaded ${agentActivities.length} activities from public/api`);
  } else if (existsSync(dataActivitiesPath)) {
    agentActivities = JSON.parse(readFileSync(dataActivitiesPath, 'utf8'));
    console.log(`Loaded ${agentActivities.length} activities from data directory`);
  }
  
  if (existsSync(contentPath)) {
    contentStatus = JSON.parse(readFileSync(contentPath, 'utf8'));
    console.log(`Loaded ${contentStatus.length} content items from public/api`);
  } else if (existsSync(dataContentPath)) {
    contentStatus = JSON.parse(readFileSync(dataContentPath, 'utf8'));
    console.log(`Loaded ${contentStatus.length} content items from data directory`);
  }
  
  // If we don't have content status data but have content files,
  // generate content status from content directory
  if (contentStatus.length === 0) {
    const contentDir = path.join(process.cwd(), 'content');
    if (existsSync(contentDir)) {
      const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));
      contentStatus = files.map(file => {
        const pageName = file.replace('.md', '');
        return {
          id: pageName,
          title: pageName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          status: 'pending',
          lastUpdated: new Date().toISOString(),
          author: 'Content Writer Agent'
        };
      });
      console.log(`Generated ${contentStatus.length} content items from content directory`);
    }
  }
  
  // Load client info
  const clientInfoPath = path.join(process.cwd(), 'data', 'client-info.json');
  if (existsSync(clientInfoPath)) {
    clientInformation = JSON.parse(readFileSync(clientInfoPath, 'utf8'));
  }
  
  // Calculate progress status
  if (contentStatus.length > 0) {
    // Analyze content for SEO optimization
    const contentDir = path.join(process.cwd(), 'content');
    let seoScore = 60; // Default fallback
    let seoDetails = {};
    
    try {
      // Only run analysis if content directory exists
      if (existsSync(contentDir)) {
        const seoAnalysis = analyzeAllContent(contentDir, clientInformation);
        seoScore = seoAnalysis.score;
        seoDetails = {
          pageScores: seoAnalysis.pageScores,
          recommendations: seoAnalysis.recommendations
        };
      }
    } catch (err) {
      console.error('Error analyzing SEO:', err);
    }
    
    progressStatus = {
      contentCompletion: Math.round((contentStatus.length / 5) * 100), // Assuming 5 pages is complete
      seoOptimization: seoScore,
      seoDetails: seoDetails,
      keywordsGenerated: contentStatus.length * 3, // Rough estimate
      pagesCreated: contentStatus.length,
      pagesApproved: contentStatus.filter(c => c.status === 'approved').length
    };
  }
  
} catch (error) {
  console.error('Error initializing API data:', error);
}

export async function GET() {
  try {
    // Check if we need to scan for new content
    await scanForNewContent();
    
    // Run SEO analysis to get fresh scores (if content exists)
    const contentDir = path.join(process.cwd(), 'content');
    if (existsSync(contentDir)) {
      try {
        const seoAnalysis = analyzeAllContent(contentDir, clientInformation);
        progressStatus.seoOptimization = seoAnalysis.score;
        progressStatus.seoDetails = {
          pageScores: seoAnalysis.pageScores,
          recommendations: seoAnalysis.recommendations
        };
      } catch (err) {
        console.error('Error refreshing SEO analysis:', err);
      }
    }
    
    // Return current state of agent activities and content status
    return NextResponse.json({
      agentActivities,
      contentStatus,
      progress: progressStatus,
      clientInfo: clientInformation
    });
  } catch (error) {
    console.error('Error in GET /api/orchestrate:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, pageId, feedback, clientInfo } = body;
    
    // Store client information if provided
    if (clientInfo) {
      clientInformation = clientInfo;
      // Save client info to a file for persistence
      const clientDataDir = path.join(process.cwd(), 'data');
      await fs.mkdir(clientDataDir, { recursive: true }).catch(err => {
        if (err.code !== 'EEXIST') throw err;
      });
      
      await fs.writeFile(
        path.join(clientDataDir, 'client-info.json'),
        JSON.stringify(clientInfo, null, 2)
      );
    }
    
    switch (action) {
      case 'generate':
        // Start new content generation process
        const generationResult = await orchestrateAgents({ 
          clientInfo: clientInfo || clientInformation,
          onActivity: logActivity,
          onContentUpdate: updateContentStatus
        });
        
        return NextResponse.json({
          message: 'Content generation started',
          clientInfo: clientInfo?.businessName || 'Unknown Business',
          result: generationResult
        });
        
      case 'regenerate':
        // Handle content regeneration request
        if (!pageId) {
          return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
        }
        
        // Update content status to show regeneration in progress
        updateContentStatus({
          id: pageId,
          status: 'regenerating',
          lastUpdated: new Date().toISOString(),
          regenerationFeedback: feedback || 'Please improve this content.'
        });
        
        // Schedule regeneration to run asynchronously and avoid blocking the response
        setTimeout(() => {
          orchestrateAgents({ 
            regeneratePageId: pageId,
            feedback,
            onActivity: logActivity,
            onContentUpdate: updateContentStatus
          }).catch(err => console.error('Error in regeneration:', err));
        }, 0);
        
        return NextResponse.json({
          message: 'Content regeneration started',
          pageId
        });
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in POST /api/orchestrate:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper function to scan content directory and update contentStatus
async function scanForNewContent() {
  try {
    const contentDir = path.join(process.cwd(), 'content');
    const contentDirExists = await fs.stat(contentDir).catch(() => false);
    
    if (!contentDirExists) {
      return;
    }
    
    const files = await fs.readdir(contentDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    // Check for new files that aren't in contentStatus
    for (const file of mdFiles) {
      const pageName = file.replace('.md', '');
      const existing = contentStatus.find(item => item.id === pageName);
      
      if (!existing) {
        // New file found, add to content status
        const stats = await fs.stat(path.join(contentDir, file));
        const title = pageName
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
          
        contentStatus.push({
          id: pageName,
          title,
          status: 'pending',
          lastUpdated: stats.mtime.toISOString(),
          author: 'Content Writer Agent'
        });
        
        // Update progress status
        progressStatus.pagesCreated = contentStatus.length;
        progressStatus.contentCompletion = Math.round((contentStatus.length / 5) * 100);
        
        console.log(`Added new page to content status: ${pageName}`);
      }
    }
    
    // Save updated content status
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true }).catch(err => {
      if (err.code !== 'EEXIST') throw err;
    });
    
    await fs.writeFile(
      path.join(dataDir, 'content-status.json'),
      JSON.stringify(contentStatus, null, 2)
    );
    
    // Also save to public/api for static access
    const publicApiDir = path.join(process.cwd(), 'public', 'api', 'content');
    await fs.mkdir(publicApiDir, { recursive: true }).catch(err => {
      if (err.code !== 'EEXIST') throw err;
    });
    
    await fs.writeFile(
      path.join(publicApiDir, 'data.json'),
      JSON.stringify(contentStatus, null, 2)
    );
    
  } catch (error) {
    console.error('Error scanning for new content:', error);
  }
}

// Helper function to log agent activities
function logActivity(activity) {
  const newActivity = {
    ...activity,
    timestamp: new Date().toISOString()
  };
  
  // Add to the beginning of the array to show newest first
  agentActivities = [newActivity, ...agentActivities];
  
  // Keep only recent activities (limit to 100)
  if (agentActivities.length > 100) {
    agentActivities = agentActivities.slice(0, 100);
  }
  
  // Save activities to file for persistence
  try {
    const dataDir = path.join(process.cwd(), 'data');
    fs.mkdir(dataDir, { recursive: true }).catch(err => {
      if (err.code !== 'EEXIST') throw err;
    });
    
    fs.writeFile(
      path.join(dataDir, 'agent-activities.json'),
      JSON.stringify(agentActivities, null, 2)
    );
    
    // Also save to public/api for static access
    const publicApiDir = path.join(process.cwd(), 'public', 'api', 'agent-activities');
    fs.mkdir(publicApiDir, { recursive: true }).catch(err => {
      if (err.code !== 'EEXIST') throw err;
    });
    
    fs.writeFile(
      path.join(publicApiDir, 'data.json'),
      JSON.stringify(agentActivities, null, 2)
    );
  } catch (err) {
    console.error('Failed to save agent activities:', err);
  }
}

// Helper function to update content status
function updateContentStatus(contentUpdate) {
  // Find existing content or add new
  const existingIndex = contentStatus.findIndex(c => c.id === contentUpdate.id);
  
  // Ensure contentUpdate has a status field and not approvalStatus
  if (contentUpdate.approvalStatus && !contentUpdate.status) {
    contentUpdate.status = contentUpdate.approvalStatus;
    delete contentUpdate.approvalStatus;
  }
  
  // If we're changing from regenerating to approved status, remove any regeneration feedback
  if (existingIndex >= 0 && 
      contentStatus[existingIndex].status === 'regenerating' && 
      contentUpdate.status === 'approved') {
    // Remove regeneration-specific fields
    delete contentUpdate.regenerationFeedback;
  }
  
  if (existingIndex >= 0) {
    contentStatus[existingIndex] = {
      ...contentStatus[existingIndex],
      ...contentUpdate
    };
  } else {
    contentStatus.push(contentUpdate);
  }
  
  // Update progress numbers
  progressStatus.pagesCreated = contentStatus.length;
  progressStatus.pagesApproved = contentStatus.filter(c => c.status === 'approved').length;
  progressStatus.contentCompletion = Math.round((contentStatus.length / 5) * 100);
  
  // Save content status to file for persistence
  try {
    const dataDir = path.join(process.cwd(), 'data');
    fs.mkdir(dataDir, { recursive: true }).catch(err => {
      if (err.code !== 'EEXIST') throw err;
    });
    
    fs.writeFile(
      path.join(dataDir, 'content-status.json'),
      JSON.stringify(contentStatus, null, 2)
    );
    
    // Also save to public/api for static access
    const publicApiDir = path.join(process.cwd(), 'public', 'api', 'content');
    fs.mkdir(publicApiDir, { recursive: true }).catch(err => {
      if (err.code !== 'EEXIST') throw err;
    });
    
    fs.writeFile(
      path.join(publicApiDir, 'data.json'),
      JSON.stringify(contentStatus, null, 2)
    );
  } catch (err) {
    console.error('Failed to save content status:', err);
  }
}