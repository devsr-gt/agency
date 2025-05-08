import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Path to content status JSON file
const contentStatusPath = path.join(process.cwd(), 'data', 'content-status.json');

// Helper function to read status data
async function readStatusData() {
  try {
    const fileData = await fs.readFile(contentStatusPath, 'utf-8');
    const data = JSON.parse(fileData);
    
    // Ensure all items have a status property
    return data.map(item => ({
      ...item,
      status: item.status || item.approvalStatus || 'pending'
    }));
  } catch (_error) {
    // If file doesn't exist or is invalid JSON, return empty array
    return [];
  }
}

// Helper function to write status data
async function writeStatusData(data) {
  const dirPath = path.dirname(contentStatusPath);
  
  // Create directory if it doesn't exist
  try {
    await fs.access(dirPath);
  } catch (_error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
  
  await fs.writeFile(contentStatusPath, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const data = await readStatusData();
    // Return the data directly, without wrapping in contentStatus
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting content status:', error);
    return NextResponse.json(
      { error: 'Failed to get content status' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const requestData = await request.json();
    // Support both pageId and id parameter formats for compatibility
    const id = requestData.id || requestData.pageId;
    const { status, feedback } = requestData;

    if (!id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }
    
    const existingData = await readStatusData();
    let updated = false;
    
    const updatedData = existingData.map(item => {
      if (item.id === id) {
        updated = true;
        
        // Create updated item with proper status handling
        const updatedItem = {
          ...item,
          ...(status && { status: status }),
          ...(feedback && { feedback }),
          lastUpdated: new Date().toISOString()
        };
        
        // If status is changing to approved or anything other than regenerating,
        // remove regeneration-specific fields
        if (status && status !== 'regenerating') {
          delete updatedItem.regenerationFeedback;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    if (!updated) {
      // If content wasn't found, add a new entry with the provided status
      updatedData.push({
        id,
        status: status || 'pending',
        ...(feedback && { feedback }),
        lastUpdated: new Date().toISOString()
      });
    }
    
    await writeStatusData(updatedData);
    
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    console.error('Error updating content status:', error);
    return NextResponse.json(
      { error: 'Failed to update content status' },
      { status: 500 }
    );
  }
}