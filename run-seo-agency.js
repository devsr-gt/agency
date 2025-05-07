#!/usr/bin/env node

const { orchestrateAgents } = require('./orchestrate');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n========================================');
console.log('SEO AGENCY AUTOMATION SYSTEM');
console.log('========================================\n');
console.log('This script will run the automated content creation and website building process.');
console.log('Before proceeding, please ensure you have:');
console.log('1. Added your OpenAI API key to the .env file');
console.log('2. Set up the necessary directory structure (content/, public/images/, public/videos/)');
console.log('\nNote: This process may incur charges on your OpenAI account for using the API.\n');

rl.question('Do you want to proceed with the orchestration process? (yes/no): ', (answer) => {
  if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
    console.log('\nStarting the orchestration process...\n');
    orchestrateAgents()
      .then(() => {
        console.log('\nOrchestration process completed successfully!');
        rl.close();
      })
      .catch((error) => {
        console.error(`\nError during orchestration: ${error.message}`);
        console.error(error.stack);
        rl.close();
      });
  } else {
    console.log('\nOrchestration process aborted.');
    rl.close();
  }
});