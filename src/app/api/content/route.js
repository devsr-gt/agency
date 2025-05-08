import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(request) {
  try {
    const contentDir = path.join(process.cwd(), 'content');
    
    // Check if directory exists
    if (!fs.existsSync(contentDir)) {
      return NextResponse.json({ 
        error: 'Content directory not found' 
      }, { status: 404 });
    }
    
    // Check if a specific page is requested
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');
    
    if (pageId) {
      // Single page request
      const filePath = path.join(contentDir, `${pageId}.md`);
      
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ 
          error: `Content for page ${pageId} not found` 
        }, { status: 404 });
      }
      
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      const stats = fs.statSync(filePath);
      
      return NextResponse.json({
        id: pageId,
        title: data.title || pageId,
        content: content,
        frontmatter: data,
        lastUpdated: stats.mtime.toISOString(),
        status: data.status || 'completed'
      });
    }
    
    // List all pages
    const files = fs.readdirSync(contentDir);
    
    const contentFiles = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        
        // Get file stats for last modified date
        const stats = fs.statSync(filePath);
        
        return {
          id: file.replace('.md', ''),
          title: data.title || file.replace('.md', ''),
          content: content,
          frontmatter: data,
          lastUpdated: stats.mtime.toISOString(),
          status: data.status || 'completed'
        };
      });
    
    return NextResponse.json({ contentFiles });
  } catch (error) {
    console.error('Error reading content files:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch content files' 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const requestData = await request.json();
    // Support both id and pageId parameter names for consistency
    const id = requestData.id || requestData.pageId;
    const content = requestData.content;
    const frontmatter = requestData.frontmatter;
    
    if (!id || !content) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    const contentDir = path.join(process.cwd(), 'content');
    const filePath = path.join(contentDir, `${id}.md`);
    
    // Create frontmatter content
    const yamlFrontmatter = matter.stringify(content, frontmatter || {});
    
    // Write to file
    fs.writeFileSync(filePath, yamlFrontmatter);
    
    // Get the updated timestamp
    const stats = fs.statSync(filePath);
    const lastUpdated = stats.mtime.toISOString();
    
    return NextResponse.json({ 
      success: true,
      message: `Content for ${id} updated successfully`,
      lastUpdated
    });
    
  } catch (error) {
    console.error('Error updating content file:', error);
    return NextResponse.json({ 
      error: 'Failed to update content file' 
    }, { status: 500 });
  }
}