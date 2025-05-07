require('dotenv').config();

// Check environment
console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`);

// If NODE_ENV is undefined or invalid, set it to a standard value
if (!process.env.NODE_ENV || !['development', 'production', 'test'].includes(process.env.NODE_ENV)) {
  console.log('NODE_ENV is either undefined or has a non-standard value.');
  console.log('Setting NODE_ENV to "development" for this session.');
  process.env.NODE_ENV = 'development';
  console.log(`Updated NODE_ENV: ${process.env.NODE_ENV}`);
}
