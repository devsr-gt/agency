/**
 * Test script for content status management
 * This script tests various content status changes to ensure the API works correctly
 */

const fs = require('fs');
const path = require('path');

// Path to content status file
const contentStatusPath = path.join(process.cwd(), 'data', 'content-status.json');

// Backup the current content status file
function backupContentStatus() {
  console.log('Creating backup of content status file...');
  const backupPath = path.join(process.cwd(), 'data', 'content-status.backup.json');
  fs.copyFileSync(contentStatusPath, backupPath);
  console.log(`Backup created at: ${backupPath}`);
}

// Restore from backup
function restoreContentStatus() {
  console.log('Restoring content status from backup...');
  const backupPath = path.join(process.cwd(), 'data', 'content-status.backup.json');
  fs.copyFileSync(backupPath, contentStatusPath);
  console.log('Content status restored');
}

// Function to make API request
async function makeApiRequest(endpoint, method, body = null) {
  const baseUrl = 'http://localhost:3000/api';
  const url = `${baseUrl}/${endpoint}`;
  
  const headers = { 'Content-Type': 'application/json' };
  
  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  };
  
  console.log(`Making ${method} request to ${url}`);
  if (body) console.log('Request body:', body);
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log(`Response status: ${response.status}`);
    console.log('Response data:', data);
    
    return { status: response.status, data };
  } catch (error) {
    console.error('Error making API request:', error);
    throw error;
  }
}

// Test case: Get current content status
async function testGetContentStatus() {
  console.log('\n===== Testing GET Content Status =====');
  return makeApiRequest('content/status', 'GET');
}

// Test case: Update content status to regenerating with feedback
async function testSetContentRegenerating(pageId) {
  console.log(`\n===== Testing Set "${pageId}" to Regenerating =====`);
  return makeApiRequest('content/status', 'POST', {
    id: pageId,
    status: 'regenerating',
    regenerationFeedback: 'Please make this page more engaging and informative.'
  });
}

// Test case: Update content status to approved
async function testSetContentApproved(pageId) {
  console.log(`\n===== Testing Set "${pageId}" to Approved =====`);
  return makeApiRequest('content/status', 'POST', {
    id: pageId,
    status: 'approved'
  });
}

// Test case: Update content with changes
async function testUpdateContent(pageId) {
  console.log(`\n===== Testing Update Content for "${pageId}" =====`);
  
  // Get the current content
  const contentDir = path.join(process.cwd(), 'content');
  const contentPath = path.join(contentDir, `${pageId}.md`);
  
  if (!fs.existsSync(contentPath)) {
    console.log(`Content file for ${pageId} not found. Skipping update test.`);
    return;
  }
  
  const content = fs.readFileSync(contentPath, 'utf-8');
  const updatedContent = content + '\n\n## Updated Section\nThis content was updated by the test script.';
  
  return makeApiRequest('content', 'POST', {
    id: pageId,
    content: updatedContent
  });
}

// Test case with pageId instead of id
async function testWithPageId(pageId) {
  console.log(`\n===== Testing with pageId param for "${pageId}" =====`);
  return makeApiRequest('content/status', 'POST', {
    pageId: pageId,
    status: 'pending'
  });
}

// Run all tests in sequence
async function runAllTests() {
  try {
    // Create backup of content status
    backupContentStatus();
    
    console.log('\n=========================================');
    console.log('CONTENT STATUS MANAGEMENT TEST SUITE');
    console.log('=========================================\n');
    
    // Get initial status
    await testGetContentStatus();
    
    // Test setting status to regenerating
    await testSetContentRegenerating('about');
    
    // Verify status updated correctly
    const middleStatus = await testGetContentStatus();
    
    // Check if regenerationFeedback field was added
    const aboutStatus = middleStatus.data.find(item => item.id === 'about');
    if (aboutStatus && aboutStatus.status === 'regenerating' && aboutStatus.regenerationFeedback) {
      console.log('\n✅ Regenerating status set correctly with feedback');
    } else {
      console.log('\n❌ Regenerating status test failed');
    }
    
    // Test updating content
    await testUpdateContent('about');
    
    // Test setting status to approved
    await testSetContentApproved('about');
    
    // Verify status update removed regenerationFeedback
    const finalStatus = await testGetContentStatus();
    const finalAboutStatus = finalStatus.data.find(item => item.id === 'about');
    
    if (finalAboutStatus && finalAboutStatus.status === 'approved' && !finalAboutStatus.regenerationFeedback) {
      console.log('\n✅ Approved status set correctly and regenerationFeedback was removed');
    } else {
      console.log('\n❌ Approved status test failed');
    }
    
    // Test with pageId instead of id
    await testWithPageId('services');
    
    // Verify pageId param works correctly
    const withPageIdStatus = await testGetContentStatus();
    const servicesStatus = withPageIdStatus.data.find(item => item.id === 'services');
    
    if (servicesStatus && servicesStatus.status === 'pending') {
      console.log('\n✅ pageId parameter works correctly');
    } else {
      console.log('\n❌ pageId parameter test failed');
    }
    
    console.log('\n=========================================');
    console.log('ALL TESTS COMPLETED!');
    console.log('=========================================\n');
    
  } catch (error) {
    console.error('Test suite failed:', error);
  } finally {
    // Restore content status from backup
    restoreContentStatus();
  }
}

// Start the tests
console.log('Starting content status management test suite...');
console.log('NOTE: Make sure your Next.js development server is running at http://localhost:3000');
console.log('Press Ctrl+C to abort at any time');

setTimeout(() => {
  runAllTests();
}, 1000);
