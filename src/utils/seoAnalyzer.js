/**
 * Enhanced SEO Analyzer Utility
 * Performs comprehensive SEO analysis on content and calculates optimization scores
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Keywords related to law firms - extended for better analysis
const INDUSTRY_KEYWORDS = [
  'attorney', 'lawyer', 'law firm', 'legal', 'legal service', 'representation',
  'criminal defense', 'dui', 'domestic violence', 'legal advice', 'consultation',
  'legal representation', 'defense attorney', 'case', 'court', 'trial',
  'charges', 'client', 'justice', 'rights', 'law', 'legal counsel',
  'litigation', 'settlement', 'verdict', 'plaintiff', 'defendant',
  'compensation', 'personal injury', 'injury', 'accident', 'estate planning',
  'will', 'trust', 'probate', 'family law', 'divorce', 'custody',
  'real estate', 'property', 'contract', 'business law', 'corporate'
];

// Common SEO-relevant meta tags
const IMPORTANT_META_TAGS = [
  'title', 'description', 'keywords', 
  'og:title', 'og:description', 'twitter:title', 'twitter:description'
];

/**
 * Analyzes content for SEO optimization
 * @param {string} content - The markdown content to analyze
 * @param {object} clientInfo - Client information for context
 * @param {string} pageId - Page identifier for context-specific analysis
 * @returns {object} - Analysis results
 */
function analyzeSeoOptimization(content, clientInfo = {}, pageId = '') {
  // If no content, return zero score
  if (!content) {
    return {
      score: 0,
      factors: {
        contentLength: 0,
        keywordUsage: 0,
        headerOptimization: 0,
        readability: 0,
        internalLinks: 0,
        imageOptimization: 0,
        metaTags: 0
      },
      recommendations: ['No content to analyze']
    };
  }

  const plainText = content.replace(/[#*[\]()]/g, ' ').toLowerCase();
  const words = plainText.split(/\s+/).filter(word => word.length > 0);
  const totalWords = words.length;
  const recommendations = [];

  // Get practice areas and business name from clientInfo if available
  const practiceAreas = clientInfo.practiceAreas ? 
    clientInfo.practiceAreas.toLowerCase().split(',').map(area => area.trim()) : [];
  
  const businessName = clientInfo.businessName || '';
  const location = clientInfo.location || '';
  
  // Generate page-specific keywords based on the pageId
  const pageSpecificKeywords = [];
  if (pageId) {
    switch (pageId.toLowerCase()) {
      case 'about':
        pageSpecificKeywords.push('about us', 'our firm', 'our attorneys', 'our team', 'our history', 'experience', 'qualifications');
        break;
      case 'services':
        pageSpecificKeywords.push('services', 'practice areas', 'legal services', 'what we do');
        break;
      case 'contact':
        pageSpecificKeywords.push('contact', 'contact us', 'reach out', 'free consultation', 'phone', 'email', 'office location');
        break;
      case 'blog':
        pageSpecificKeywords.push('blog', 'legal blog', 'articles', 'news', 'legal insights', 'resources', 'updates');
        break;
      case 'homepage':
        pageSpecificKeywords.push('home', 'welcome', 'best', 'trusted', 'experienced');
        break;
    }
  }
  
  // Combine industry keywords with practice areas for a more tailored analysis
  const relevantKeywords = [
    ...INDUSTRY_KEYWORDS, 
    ...practiceAreas, 
    ...pageSpecificKeywords,
    businessName.toLowerCase(),
    location.toLowerCase()
  ].filter(Boolean); // Remove empty values
  
  // 1. Content Length Analysis
  let contentLengthScore = 0;
  if (totalWords >= 1500) contentLengthScore = 100;
  else if (totalWords >= 1000) contentLengthScore = 90;
  else if (totalWords >= 700) contentLengthScore = 80;
  else if (totalWords >= 500) contentLengthScore = 70;
  else if (totalWords >= 300) contentLengthScore = 50;
  else contentLengthScore = 30;
  
  if (totalWords < 500) {
    recommendations.push(`Content length (${totalWords} words) is below the recommended minimum of 500 words for good SEO performance.`);
  }

  // 2. Keyword Usage Analysis
  let keywordCount = 0;
  let keywordDensity = 0;
  const keywordCounts = {};
  
  relevantKeywords.forEach(keyword => {
    if (keyword.length < 2) return; // Skip very short keywords
    
    const regex = new RegExp('\\b' + keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
    const matches = plainText.match(regex) || [];
    keywordCount += matches.length;
    
    if (matches.length > 0) {
      keywordCounts[keyword] = matches.length;
    }
  });
  
  keywordDensity = totalWords > 0 ? (keywordCount / totalWords) * 100 : 0;
  
  // Calculate keyword score - ideal density is around 1-3%
  let keywordScore = 0;
  if (keywordDensity >= 1 && keywordDensity <= 3) keywordScore = 100;
  else if (keywordDensity > 3 && keywordDensity <= 5) keywordScore = 80;
  else if (keywordDensity > 0 && keywordDensity < 1) keywordScore = 70;
  else if (keywordDensity > 5 && keywordDensity <= 7) keywordScore = 50;
  else if (keywordDensity > 7) keywordScore = 30;
  else keywordScore = 20;
  
  if (keywordDensity < 1) {
    recommendations.push('Keyword density is too low. Include more industry-specific terms and location information.');
  } else if (keywordDensity > 5) {
    recommendations.push('Keyword density appears too high, which might look like keyword stuffing.');
  }
  
  // Check if title contains keywords (H1 tag)
  const h1Match = content.match(/^#\s+(.+)$/m);
  let titleHasKeyword = false;
  let title = '';
  
  if (h1Match && h1Match[1]) {
    title = h1Match[1].toLowerCase();
    relevantKeywords.some(keyword => {
      if (keyword.length > 2 && title.includes(keyword.toLowerCase())) {
        titleHasKeyword = true;
        return true;
      }
      return false;
    });
  }
  
  if (!titleHasKeyword && h1Match) {
    recommendations.push('Main title (H1) should include a relevant keyword.');
    keywordScore -= 10;
  }

  // 3. Header Optimization
  const h1headers = content.match(/^#\s+.+$/gm) || [];
  const h2headers = content.match(/^##\s+.+$/gm) || [];
  const h3headers = content.match(/^###\s+.+$/gm) || [];
  const otherHeaders = content.match(/^#####+\s+.+$/gm) || [];
  
  const headerCount = h1headers.length + h2headers.length + h3headers.length + otherHeaders.length;
  
  let headerScore = 0;
  if (headerCount >= 5) headerScore = 100;
  else if (headerCount >= 3) headerScore = 80;
  else if (headerCount >= 1) headerScore = 60;
  else headerScore = 0;
  
  // Check header structure
  if (h1headers.length === 0) {
    recommendations.push('Page is missing an H1 header (main title). Add a clear H1 title at the beginning.');
    headerScore -= 20;
  } else if (h1headers.length > 1) {
    recommendations.push('Multiple H1 tags detected. Each page should have exactly one H1 tag.');
    headerScore -= 15;
  }
  
  if (h2headers.length === 0 && totalWords > 300) {
    recommendations.push('Consider adding H2 subheadings to structure your content better.');
    headerScore -= 10;
  }
  
  if (headerCount < 3 && totalWords > 500) {
    recommendations.push('Use more header tags (H1, H2, H3) to structure your content.');
  }
  
  // Check if keywords appear in headers
  let keywordsInHeaders = 0;
  const allHeaders = [...h1headers, ...h2headers, ...h3headers];
  allHeaders.forEach(header => {
    const headerText = header.toLowerCase();
    relevantKeywords.forEach(keyword => {
      if (keyword.length > 2 && headerText.includes(keyword.toLowerCase())) {
        keywordsInHeaders++;
      }
    });
  });
  
  if (headerCount > 0 && keywordsInHeaders === 0) {
    recommendations.push('Include keywords in your header tags for better SEO.');
    headerScore -= 20; // Penalty for no keywords in headers
  }

  // 4. Readability Analysis (enhanced)
  const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = sentences.length > 0 ? totalWords / sentences.length : 0;
  
  // Estimate readability using average sentence length
  let readabilityScore = 0;
  if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 18) readabilityScore = 100;
  else if (avgWordsPerSentence > 18 && avgWordsPerSentence <= 22) readabilityScore = 85;
  else if (avgWordsPerSentence > 22 && avgWordsPerSentence <= 25) readabilityScore = 70;
  else if (avgWordsPerSentence > 0 && avgWordsPerSentence < 10) readabilityScore = 60;
  else if (avgWordsPerSentence > 25 && avgWordsPerSentence <= 30) readabilityScore = 50;
  else if (avgWordsPerSentence > 30) readabilityScore = 30;
  else readabilityScore = 0;
  
  // Check paragraph length (approximation based on newlines)
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const avgWordsPerParagraph = paragraphs.length > 0 ? 
    totalWords / paragraphs.length : 0;
  
  if (avgWordsPerSentence > 25) {
    recommendations.push('Sentences are too long. Consider breaking them down for better readability.');
  }
  
  if (avgWordsPerParagraph > 100) {
    recommendations.push('Paragraphs appear too long. Break up large paragraphs for better readability.');
    readabilityScore -= 10;
  }

  // 5. Internal links analysis
  const linkMatches = content.match(/\[.*?\]\(.*?\)/g) || [];
  
  // Analyze link distribution and count
  let internalLinkScore = 0;
  if (linkMatches.length >= 3) internalLinkScore = 100;
  else if (linkMatches.length === 2) internalLinkScore = 85;
  else if (linkMatches.length === 1) internalLinkScore = 70;
  else internalLinkScore = 0;
  
  if (linkMatches.length === 0) {
    recommendations.push('No internal links found. Add links to other pages on your website.');
  } else if (totalWords > 500 && linkMatches.length < 3) {
    recommendations.push('Add more internal links to improve site navigation and SEO.');
  }
  
  // 6. Image optimization check (basic)
  const imageMatches = content.match(/!\[.*?\]\(.*?\)/g) || [];
  
  let imageScore = 0;
  if (imageMatches.length > 0) {
    // Check if images have alt text
    const imagesWithAlt = imageMatches.filter(img => {
      const altMatch = img.match(/!\[(.*?)\]/);
      return altMatch && altMatch[1] && altMatch[1].trim().length > 0;
    });
    
    if (imagesWithAlt.length === imageMatches.length) {
      imageScore = 100;
    } else {
      const altTextPercentage = (imagesWithAlt.length / imageMatches.length) * 100;
      imageScore = Math.round(altTextPercentage);
      
      if (altTextPercentage < 100) {
        recommendations.push('Some images are missing proper alt text. Add descriptive alt text to all images.');
      }
    }
  } else if (totalWords > 500) {
    imageScore = 0;
    recommendations.push('No images found. Consider adding relevant images with descriptive alt text.');
  } else {
    // Short content might not need images
    imageScore = 50;
  }
  
  // 7. Meta tags check (basic)
  // For markdown files, we have to make some assumptions or read frontmatter
  let metaScore = 50; // Default assuming basic meta info is present
  
  // Front matter check (if using gray-matter)
  try {
    const frontMatter = matter(content).data || {};
    
    const foundMetaTags = Object.keys(frontMatter).filter(key => 
      IMPORTANT_META_TAGS.includes(key) || key.startsWith('og:') || key.startsWith('twitter:')
    );
    
    if (foundMetaTags.length >= 4) {
      metaScore = 100;
    } else if (foundMetaTags.length >= 2) {
      metaScore = 80;
    } else if (foundMetaTags.length === 1) {
      metaScore = 60;
    } else {
      metaScore = 40;
      recommendations.push('Add meta tags in the front matter for better SEO.');
    }
    
    // Check meta description length
    if (frontMatter.description) {
      const descriptionLength = frontMatter.description.length;
      if (descriptionLength < 70) {
        recommendations.push('Meta description is too short. Aim for 120-160 characters.');
        metaScore -= 10;
      } else if (descriptionLength > 160) {
        recommendations.push('Meta description is too long. Keep it under 160 characters.');
        metaScore -= 10;
      }
    }
  } catch (e) {
    // If frontmatter parsing fails, we'll stick with the default score
    console.error('Error parsing frontmatter:', e);
  }

  // Calculate overall SEO score (weighted average)
  const weightedScore =
    (contentLengthScore * 0.25) + // Content length is important
    (keywordScore * 0.30) + // Keywords are very important
    (headerScore * 0.15) + // Headers are important
    (readabilityScore * 0.10) + // Readability matters
    (internalLinkScore * 0.10) + // Internal links
    (imageScore * 0.05) + // Images with alt text
    (metaScore * 0.05); // Meta tags
  
  const finalScore = Math.round(weightedScore);

  // Get top keywords (for reporting)
  const topKeywords = Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([keyword, count]) => ({ keyword, count }));

  return {
    score: finalScore,
    factors: {
      contentLength: contentLengthScore,
      keywordUsage: keywordScore,
      headerOptimization: headerScore,
      readability: readabilityScore,
      internalLinks: internalLinkScore,
      imageOptimization: imageScore,
      metaTags: metaScore
    },
    details: {
      wordCount: totalWords,
      keywordCount,
      keywordDensity: keywordDensity.toFixed(2) + '%',
      headings: {
        total: headerCount,
        h1: h1headers.length,
        h2: h2headers.length,
        h3: h3headers.length,
      },
      avgWordsPerSentence: avgWordsPerSentence.toFixed(1),
      avgWordsPerParagraph: avgWordsPerParagraph.toFixed(1),
      internalLinks: linkMatches.length,
      images: imageMatches.length,
      topKeywords
    },
    recommendations
  };
}

/**
 * Analyzes all content files and calculates overall SEO score
 * @param {string} contentDir - Directory containing content files
 * @param {object} clientInfo - Client information object
 * @returns {object} - SEO analysis results
 */
function analyzeAllContent(contentDir, clientInfo = {}) {
  try {
    if (!fs.existsSync(contentDir)) {
      return { 
        score: 0, 
        pageScores: {},
        recommendations: ['Content directory not found']
      };
    }
    
    const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));
    const pageScores = {};
    let totalScore = 0;
    const allRecommendations = [];
    
    files.forEach(file => {
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      const { content } = matter(fileContent);
      const pageId = file.replace('.md', '');
      const analysis = analyzeSeoOptimization(content, clientInfo, pageId);
      
      pageScores[pageId] = analysis;
      totalScore += analysis.score;
      
      // Add page-specific recommendations
      if (analysis.recommendations.length > 0) {
        allRecommendations.push({
          page: pageId,
          recommendations: analysis.recommendations,
          score: analysis.score
        });
      }
    });
    
    const overallScore = files.length > 0 ? Math.round(totalScore / files.length) : 0;
    
    // Sort recommendations by priority (lowest scoring pages first)
    allRecommendations.sort((a, b) => a.score - b.score);
    
    // Add site-wide recommendations based on patterns observed across pages
    const siteWideSuggestions = [];
    
    // Check for consistent content length issues
    const shortContentPages = Object.entries(pageScores)
      .filter(([_, analysis]) => analysis.details.wordCount < 500)
      .map(([pageId]) => pageId);
      
    if (shortContentPages.length > 1) {
      siteWideSuggestions.push({
        issue: 'Multiple pages have insufficient content length',
        pages: shortContentPages,
        recommendation: 'Focus on expanding content on these pages to at least 500 words each.'
      });
    }
    
    // Check for consistent internal linking issues
    const lowLinkPages = Object.entries(pageScores)
      .filter(([_, analysis]) => analysis.details.internalLinks === 0)
      .map(([pageId]) => pageId);
      
    if (lowLinkPages.length > 1) {
      siteWideSuggestions.push({
        issue: 'Several pages lack internal links',
        pages: lowLinkPages,
        recommendation: 'Implement a comprehensive internal linking strategy across your site.'
      });
    }
    
    // Check for missing H1 headers
    const missingH1Pages = Object.entries(pageScores)
      .filter(([_, analysis]) => analysis.details.headings.h1 === 0)
      .map(([pageId]) => pageId);
      
    if (missingH1Pages.length > 0) {
      siteWideSuggestions.push({
        issue: 'Some pages are missing H1 headers',
        pages: missingH1Pages,
        recommendation: 'Add a clear H1 title to each page that contains your primary keyword.'
      });
    }
    
    // Check for overall site image usage
    const lowImagePages = Object.entries(pageScores)
      .filter(([_, analysis]) => analysis.details.images === 0 && analysis.details.wordCount > 300)
      .map(([pageId]) => pageId);
      
    if (lowImagePages.length > Math.floor(files.length / 2)) {
      siteWideSuggestions.push({
        issue: 'Many pages lack images',
        pages: lowImagePages,
        recommendation: 'Add relevant images with descriptive alt text to improve engagement and SEO.'
      });
    }
    
    return {
      score: overallScore,
      pageScores,
      recommendations: allRecommendations,
      siteWideSuggestions: siteWideSuggestions.length > 0 ? siteWideSuggestions : undefined
    };
  } catch (error) {
    console.error('Error analyzing content:', error);
    return { 
      score: 0, 
      error: error.message,
      recommendations: ['Error analyzing content: ' + error.message]
    };
  }
}

module.exports = {
  analyzeSeoOptimization,
  analyzeAllContent
};
