# Law Firm Website Testing Suite

This directory contains automated tests for the Law Firm Website project to verify the functionality of various components.

## Test Overview

The following test suites are available:

1. **SEO Analyzer Tests** - Tests the SEO scoring system with various content scenarios
2. **Content Status Tests** - Tests the content status management API functionality
3. **Comprehensive Test Runner** - Runs all tests in sequence

## Running Tests

### Prerequisites

- Node.js and npm installed
- Project dependencies installed (`npm install`)
- For content API tests, the Next.js development server must be running

### Test Commands

```bash
# Start the development server (required for API tests)
npm run dev

# In a new terminal window, run one of the following:

# Run all tests
npm test

# Run only SEO analyzer tests
npm run test-seo

# Run only content status tests
npm run test-content-status
```

## Test Details

### SEO Analyzer Tests

The SEO analyzer tests (`test-seo-analyzer.js`) verify:

- Content length analysis
- Keyword usage and density calculation
- Header structure analysis
- Readability analysis
- Internal link detection
- Image optimization detection
- Meta tag analysis
- Overall SEO score calculation

The test includes multiple test cases with different content characteristics:
- Optimal content
- Content that's too short
- Content with keyword stuffing
- Content with no headers
- Content with missing keywords
- Content with no internal links

Additionally, the test will analyze any existing content files in the `content/` directory to verify real-world content performance.

### Content Status Tests

The content status tests (`test-content-status.js`) verify:

- Getting the current content status
- Setting a page status to "regenerating" with feedback
- Setting a page status to "approved" (which should remove regeneration feedback)
- Updating content for a page
- Testing compatibility with both `id` and `pageId` parameters

These tests ensure that the content status API works correctly and that status transitions function as expected.

## Troubleshooting

- If content status tests fail with connection errors, make sure the Next.js development server is running.
- The test runner creates backups of any modified files to prevent data loss during testing.
- To restore backups manually, look for files with the `.backup.json` extension in the data directory.
