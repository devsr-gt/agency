import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Path to content status JSON file
const contentStatusPath = path.join(process.cwd(), 'data', 'content-status.json');

// Helper function to read status data
async function readStatusData() {
  try {
    const fileData = await fs.readFile(contentStatusPath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
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
  } catch (error) {
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
    const { id, status, feedback } = requestData;

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
        return {
          ...item,
          ...(status && { approvalStatus: status }),
          ...(feedback && { feedback }),
          lastUpdated: new Date().toISOString()
        };
      }
      return item;
    });
    
    if (!updated) {
      // If content wasn't found, add a new entry with the provided status
      updatedData.push({
        id,
        approvalStatus: status || 'pending',
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