/**
 * Manual test script for content status updates
 * This script tests the updating of content status using fetch requests
 */

// Run this script with Node.js after starting your Next.js server with npm run dev

const apiUrl = 'http://localhost:3000/api/content/status';

// Function to make API request
async function makeRequest(method, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : null
  };

  try {
    console.log(`Making ${method} request to ${apiUrl}`);
    if (body) console.log('Request payload:', body);
    
    const response = await fetch(apiUrl, options);
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('\nResponse:');
    console.log(JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

// Function to test getting all content status
async function testGetContentStatus() {
  console.log('\n=== Testing GET content status ===\n');
  return await makeRequest('GET');
}

// Function to test updating content status
async function testUpdateContentStatus(pageId, status, feedback = null) {
  console.log(`\n=== Testing UPDATE content status for "${pageId}" to "${status}" ===\n`);
  
  const requestBody = {
    id: pageId,
    status
  };
  
  if (feedback) {
    requestBody.regenerationFeedback = feedback;
  }
  
  return await makeRequest('POST', requestBody);
}

// Function to test using pageId instead of id
async function testWithPageIdParam(pageId, status) {
  console.log(`\n=== Testing with pageId param for "${pageId}" to "${status}" ===\n`);
  
  const requestBody = {
    pageId,
    status
  };
  
  return await makeRequest('POST', requestBody);
}

// Test the whole flow
async function runTests() {
  // Step 1: Get current status
  const initialStatus = await testGetContentStatus();
  
  if (!initialStatus) {
    console.error('Failed to get initial content status. Is the server running?');
    process.exit(1);
  }
  
  // Step 2: Set a page to regenerating with feedback
  await testUpdateContentStatus('services', 'regenerating', 'Please make this page more detailed and include pricing information.');

  // Step 3: Set a page to approved (should remove regeneration feedback)  
  await testUpdateContentStatus('services', 'approved');
  
  // Step 4: Test with pageId parameter
  await testWithPageIdParam('contact', 'regenerating', 'Update the contact form and add more office locations.');
  
  // Step 5: Get final status to check changes
  await testGetContentStatus();
}

// Run the tests
console.log('Starting content status manual test...');
console.log('Make sure your Next.js server is running on localhost:3000!\n');

runTests().then(() => {
  console.log('\nTest complete!');
});
