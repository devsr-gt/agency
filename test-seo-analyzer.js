/**
 * Test script for SEO Analyzer
 * 
 * This script tests the SEO analyzer implementation with various types of content
 * to verify scoring accuracy and identify potential issues.
 */

const path = require('path');
const fs = require('fs');
const { analyzeSeoOptimization, analyzeAllContent } = require('./src/utils/seoAnalyzer');

// Sample client info
const clientInfo = {
  businessName: "Smith & Associates Law Firm",
  practiceAreas: "Family law, Personal injury, Criminal defense"
};

// Test cases with different content characteristics
const testCases = [
  {
    name: 'Optimal Content',
    content: `# Professional Legal Services from Smith & Associates Law Firm

## Expert Family Law Representation

Our experienced attorneys at Smith & Associates specialize in family law matters. Whether you're going through a divorce, custody dispute, or adoption process, our legal team provides compassionate and effective representation.

### Divorce Proceedings

Divorce can be emotionally challenging. Our family law attorneys guide clients through this difficult time with empathy and expertise. We handle:

- Property division
- Child custody arrangements
- Spousal support calculations
- Mediation and collaborative divorce options

### Child Custody and Support

The well-being of your children is paramount. Our legal team works diligently to protect your parental rights while ensuring the best interests of the children are served. We assist with:

- Physical and legal custody determinations
- Parenting time schedules
- Child support calculations
- Modification of existing orders

## Personal Injury Expertise

If you've been injured due to someone else's negligence, you deserve fair compensation. Our personal injury attorneys fight for clients who have suffered from:

- Car accidents
- Slip and fall incidents
- Medical malpractice
- Workplace injuries

[Contact us](/contact) today for a free consultation regarding your personal injury case.

## Criminal Defense Services

Facing criminal charges can be frightening. Our criminal defense attorneys provide robust representation for clients accused of:

- DUI/DWI offenses
- Domestic violence
- Theft and property crimes
- Drug-related charges

### Our Approach to Criminal Defense

At Smith & Associates, we believe everyone deserves a strong defense. We meticulously investigate each case, challenge evidence when appropriate, and develop strategic defense plans tailored to your specific situation.

[Learn more about our criminal defense practice](/services).

## Client Testimonials

"The attorneys at Smith & Associates provided exceptional representation during my divorce. They were compassionate yet effective in achieving a fair settlement." - J. Miller

"After my car accident, I was overwhelmed with medical bills. The personal injury team at Smith & Associates helped me secure compensation that covered all my expenses." - T. Johnson

## Contact Smith & Associates Law Firm

Ready to discuss your legal needs? [Schedule a consultation](/contact) with one of our experienced attorneys. We serve clients throughout the region with offices in downtown and the western suburbs.

[View our service areas](/about) | [Meet our attorneys](/about) | [Client resources](/resources)`
  },
  {
    name: 'Content Too Short',
    content: `# Legal Services

We offer legal services for various needs.

Contact us today.`
  },
  {
    name: 'Keyword Stuffing',
    content: `# Legal Services by Lawyers

Our lawyer team provides legal services with a lawyer's expertise. As lawyers, we offer legal advice from lawyers who understand legal matters. Our legal team of lawyers can help with your legal needs. Legal representation from our lawyers ensures legal protection. Legal services by lawyers for legal issues. Lawyers providing legal assistance for legal concerns. Legal lawyer legal legal lawyer legal.`
  },
  {
    name: 'No Headers',
    content: `Smith & Associates Law Firm provides expert legal representation in family law, personal injury, and criminal defense. Our experienced attorneys work diligently to protect your interests and achieve favorable outcomes. With decades of combined experience, our legal team understands the complexities of the legal system and offers strategic guidance throughout your case. Contact us today to schedule a consultation and discuss your legal needs.`
  },
  {
    name: 'No Keywords',
    content: `# Professional Services

## Our Approach

We work with clients to achieve their goals. Our team has many years of experience in this field.

## Service Options

We offer various service packages to meet different needs and budgets. Each option includes comprehensive support.

## Client Stories

Many individuals have benefited from our assistance. Their stories reflect our commitment to quality.`
  },
  {
    name: 'No Internal Links',
    content: `# Smith & Associates Law Firm

## Expert Legal Services

We provide comprehensive legal representation in multiple practice areas. Our attorneys have decades of combined experience.

### Family Law

Our family law practice handles divorce, custody, and support matters with sensitivity and expertise.

### Personal Injury

If you've been injured, our team will fight for the compensation you deserve.

### Criminal Defense

Facing charges? We provide strategic and aggressive defense for our clients.`
  }
];

// Run tests
console.log('===== SEO ANALYZER TEST RESULTS =====\n');

testCases.forEach(test => {
  console.log(`\n----- Test Case: ${test.name} -----`);
  const result = analyzeSeoOptimization(test.content, clientInfo);
  
  console.log(`Overall Score: ${result.score}%`);
  console.log('Factor Scores:');
  Object.entries(result.factors).forEach(([factor, score]) => {
    console.log(`- ${factor}: ${score}%`);
  });
  
  console.log('Details:');
  Object.entries(result.details).forEach(([key, value]) => {
    // Format structured objects
    if (key === 'headings' && typeof value === 'object') {
      console.log(`- headings: total=${value.total}, h1=${value.h1}, h2=${value.h2}, h3=${value.h3}`);
    } else if (key === 'topKeywords' && Array.isArray(value)) {
      console.log(`- topKeywords: ${value.map(k => `"${k.keyword}" (${k.count})`).join(', ')}`);
    } else {
      console.log(`- ${key}: ${value}`);
    }
  });
  
  console.log('Recommendations:');
  result.recommendations.forEach(rec => {
    console.log(`- ${rec}`);
  });
});

// Test real content files if available
console.log('\n\n===== TESTING REAL CONTENT =====\n');
const contentDir = path.join(process.cwd(), 'content');

if (fs.existsSync(contentDir)) {
  try {
    // Read client info
    const clientInfoPath = path.join(process.cwd(), 'data', 'client-info.json');
    let realClientInfo = clientInfo;
    
    if (fs.existsSync(clientInfoPath)) {
      try {
        const data = fs.readFileSync(clientInfoPath, 'utf8');
        realClientInfo = JSON.parse(data);
      } catch (err) {
        console.error('Error reading client info:', err);
      }
    }
    
    console.log('Analyzing all content files...\n');
    const allContentAnalysis = analyzeAllContent(contentDir, realClientInfo);
    
    console.log(`Overall SEO Score: ${allContentAnalysis.score}%\n`);
    
    // Display site-wide suggestions if available
    if (allContentAnalysis.siteWideSuggestions && allContentAnalysis.siteWideSuggestions.length > 0) {
      console.log('SITE-WIDE SUGGESTIONS:');
      allContentAnalysis.siteWideSuggestions.forEach(suggestion => {
        console.log(`\n◈ ${suggestion.issue}`);
        console.log(`  Affected pages: ${suggestion.pages.join(', ')}`);
        console.log(`  Recommendation: ${suggestion.recommendation}`);
      });
      console.log('\n');
    }
    
    console.log('PAGE SCORES:');
    
    Object.entries(allContentAnalysis.pageScores).forEach(([pageId, analysis]) => {
      console.log(`\n${pageId}: ${analysis.score}%`);
      console.log(`- Word Count: ${analysis.details.wordCount}`);
      console.log(`- Keyword Density: ${analysis.details.keywordDensity}`);
      
      // Format headings object
      const headings = analysis.details.headings;
      if (typeof headings === 'object') {
        console.log(`- Headings: total=${headings.total}, h1=${headings.h1}, h2=${headings.h2}, h3=${headings.h3}`);
      } else {
        console.log(`- Headings: ${headings}`);
      }
      
      // Display top keywords if available
      if (analysis.details.topKeywords && analysis.details.topKeywords.length > 0) {
        console.log('- Top Keywords: ' + analysis.details.topKeywords
          .map(k => `"${k.keyword}" (${k.count})`)
          .join(', '));
      }
      
      if (analysis.recommendations.length > 0) {
        console.log('Recommendations:');
        analysis.recommendations.forEach(rec => {
          console.log(`  - ${rec}`);
        });
      }
    });
    
  } catch (err) {
    console.error('Error testing content files:', err);
  }
} else {
  console.log('Content directory not found. Skipping real content tests.');
}
