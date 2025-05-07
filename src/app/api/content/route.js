import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');
    
    if (!pageId) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }
    
    const contentPath = path.join(process.cwd(), 'content', `${pageId}.md`);
    
    // Check if file exists
    try {
      await fs.access(contentPath);
    } catch (fileError) {
      return NextResponse.json(
        { error: `Content not found: ${fileError.message}` },
        { status: 404 }
      );
    }
    
    // Read content file
    const content = await fs.readFile(contentPath, 'utf-8');
    
    return NextResponse.json({ content, pageId });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: `Failed to fetch content: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { pageId, content } = await request.json();
    
    if (!pageId || !content) {
      return NextResponse.json(
        { error: 'Page ID and content are required' },
        { status: 400 }
      );
    }
    
    const contentPath = path.join(process.cwd(), 'content', `${pageId}.md`);
    
    // Check if file exists
    try {
      await fs.access(contentPath);
    } catch (fileError) {
      return NextResponse.json(
        { error: `Content file not found: ${fileError.message}` },
        { status: 404 }
      );
    }
    
    // Write updated content to file
    await fs.writeFile(contentPath, content, 'utf-8');
    
    // Update the last modified timestamp
    const timestamp = new Date().toISOString();
    
    return NextResponse.json({
      success: true,
      pageId,
      lastUpdated: timestamp,
      message: 'Content updated successfully'
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: `Failed to update content: ${error.message}` },
      { status: 500 }
    );
  }
}