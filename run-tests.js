/**
 * Comprehensive test runner for the law firm website project
 */

console.log('\n=========================================');
console.log('LAW FIRM SITE TEST SUITE');
console.log('=========================================\n');

console.log('This test suite will run the following tests:');
console.log('1. SEO Analyzer Test - Evaluates the SEO scoring functionality');
console.log('2. Content Status Test - Tests the content status changing API');
console.log('\nNOTE: For the Content Status Test, make sure your Next.js server is running!');

// Ask if user wants to run all tests or specific ones
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('\nRun all tests or select specific ones? (all/seo/content): ', async (answer) => {
  readline.close();
  
  if (answer.toLowerCase() === 'all' || answer === '') {
    console.log('\nRunning all tests...\n');
    await runSeoTest();
    await runContentStatusTest();
  } else if (answer.toLowerCase().includes('seo')) {
    await runSeoTest();
  } else if (answer.toLowerCase().includes('content')) {
    await runContentStatusTest();
  } else {
    console.log('Invalid option. Exiting.');
    process.exit(0);
  }
  
  console.log('\n=========================================');
  console.log('ALL TESTS COMPLETED!');
  console.log('=========================================\n');
});

async function runSeoTest() {
  console.log('\n-----------------------------------------');
  console.log('RUNNING SEO ANALYZER TESTS');
  console.log('-----------------------------------------\n');
  
  try {
    // Run the SEO analyzer test script using a separate process
    const { execSync } = require('child_process');
    try {
      execSync('node test-seo-analyzer.js', { stdio: 'inherit' });
      console.log('\n✅ SEO analyzer tests completed successfully');
    } catch (err) {
      console.error('❌ SEO analyzer tests failed with error');
      process.exit(1);
    }
  } catch (error) {
    console.error('SEO Analyzer test failed:', error);
  }
}

async function runContentStatusTest() {
  console.log('\n-----------------------------------------');
  console.log('RUNNING CONTENT STATUS TESTS');
  console.log('-----------------------------------------\n');
  
  console.log('NOTE: Content status tests require the Next.js development server');
  console.log('Attempting to connect to server at http://localhost:3000...');
  
  try {
    // Check if server is running
    const response = await fetch('http://localhost:3000/api/content/status').catch(() => null);
    
    if (!response) {
      console.error('❌ Server not running! You need to start the Next.js server in a separate terminal.');
      console.log('\nPlease run the following command in a new terminal window:');
      console.log('  cd ' + process.cwd());
      console.log('  npm run dev');
      console.log('\nThen run this test script again, selecting "content" only.');
      return;
    }
    
    console.log('✅ Server is running, proceeding with tests...\n');
    
    // Run the content status test script using a separate process to avoid import conflicts
    const { execSync } = require('child_process');
    try {
      execSync('node test-content-status.js', { stdio: 'inherit' });
      console.log('\n✅ Content status tests completed successfully');
    } catch (err) {
      console.error('❌ Content status tests failed with error');
      process.exit(1);
    }
  } catch (error) {
    console.error('Content Status test failed:', error);
  }
}
