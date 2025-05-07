import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { orchestrateAgents } from '../../../../orchestrate.js';

// In-memory storage for activities and status
let agentActivities = [];
let contentStatus = [];
let clientInformation = null;

export async function GET() {
  try {
    // Return current state of agent activities and content status
    return NextResponse.json({
      agentActivities,
      contentStatus,
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
      if (!fs.existsSync(clientDataDir)) {
        fs.mkdirSync(clientDataDir, { recursive: true });
      }
      fs.writeFileSync(
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
        
        // Start regeneration in background
        orchestrateAgents({ 
          regeneratePageId: pageId,
          feedback,
          onActivity: logActivity,
          onContentUpdate: updateContentStatus
        });
        
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
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(dataDir, 'agent-activities.json'),
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
  
  if (existingIndex >= 0) {
    contentStatus[existingIndex] = {
      ...contentStatus[existingIndex],
      ...contentUpdate
    };
  } else {
    contentStatus.push(contentUpdate);
  }
  
  // Save content status to file for persistence
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(dataDir, 'content-status.json'),
      JSON.stringify(contentStatus, null, 2)
    );
  } catch (err) {
    console.error('Failed to save content status:', err);
  }
}