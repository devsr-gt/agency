import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const contentStatusPath = path.join(process.cwd(), 'data', 'content-status.json');
// Prefix unused variable with underscore to comply with ESLint rules
const _contentPath = path.join(process.cwd(), 'content');

// Helper function to read and parse content status data
async function getContentStatus() {
  try {
    const data = await fs.readFile(contentStatusPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading content status file:', error);
    return [];
  }
}

// Helper function to write updated content status data
async function saveContentStatus(contentStatus) {
  try {
    await fs.writeFile(contentStatusPath, JSON.stringify(contentStatus, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing content status file:', error);
    return false;
  }
}

// GET all content items with their approval status
export async function GET() {
  const contentStatus = await getContentStatus();
  return NextResponse.json(contentStatus);
}

// POST to update content status (submit for review, approve, reject)
export async function POST(request) {
  try {
    const { id, action, reviewer, comment } = await request.json();
    if (!id || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: id and action' },
        { status: 400 }
      );
    }

    const contentStatus = await getContentStatus();
    const contentItem = contentStatus.find(item => item.id === id);
    
    if (!contentItem) {
      return NextResponse.json(
        { error: `Content item with id ${id} not found` },
        { status: 404 }
      );
    }

    const timestamp = new Date().toISOString();

    // Handle different approval workflow actions
    switch (action) {
      case 'submit_for_review':
        contentItem.status = 'pending_review';
        contentItem.reviewHistory.push({
          reviewer: reviewer || 'SEO Manager',
          status: 'pending',
          timestamp
        });
        break;

      case 'approve':
        if (!reviewer) {
          return NextResponse.json(
            { error: 'Reviewer name is required for approval' },
            { status: 400 }
          );
        }
        contentItem.status = 'approved';
        contentItem.reviewHistory.push({
          reviewer,
          status: 'approved',
          timestamp,
          comment: comment || ''
        });
        break;

      case 'reject':
        if (!reviewer || !comment) {
          return NextResponse.json(
            { error: 'Reviewer name and comment are required for rejection' },
            { status: 400 }
          );
        }
        contentItem.status = 'rejected';
        contentItem.reviewHistory.push({
          reviewer,
          status: 'rejected',
          timestamp,
          comment
        });
        contentItem.comments.push({
          author: reviewer,
          text: comment,
          timestamp
        });
        break;

      case 'update':
        // Increment version when content is updated
        contentItem.version += 1;
        contentItem.lastUpdated = timestamp;
        contentItem.status = 'draft';
        break;

      default:
        return NextResponse.json(
          { error: `Invalid action: ${action}` },
          { status: 400 }
        );
    }

    await saveContentStatus(contentStatus);
    return NextResponse.json({ success: true, contentItem });

  } catch (error) {
    console.error('Error processing approval action:', error);
    return NextResponse.json(
      { error: 'Server error processing approval action' },
      { status: 500 }
    );
  }
}