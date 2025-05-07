'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ThemeToggle } from '../../components/ThemeToggle';

// Custom components for ReactMarkdown to enhance styling
const MarkdownComponents = {
  h1: ({ children }) => (
    <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-300 mb-6 border-b pb-2 border-blue-200 dark:border-blue-800">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-3xl font-semibold text-blue-800 dark:text-blue-400 mt-8 mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-2xl font-medium text-blue-700 dark:text-blue-500 mt-6 mb-3">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-lg">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 mb-6 space-y-2">
      {children}
    </ul>
  ),
  li: ({ children }) => (
    <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
      {children}
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-blue-800 dark:text-blue-400">
      {children}
    </strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/30 italic">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a 
      href={href} 
      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
      target="_blank" 
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
};

export default function ContentPreview() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        let sampleContent;
        let pageTitle = '';
        
        switch(params.id) {
          case 'homepage':
            pageTitle = 'Homepage';
            sampleContent = `# Harris & Associates Law Firm
            
## Committed to Justice, Dedicated to Results

At Harris & Associates, we understand that facing legal challenges can be overwhelming. Whether you're dealing with criminal charges or recovering from a personal injury, our experienced team of attorneys is here to provide expert guidance and aggressive representation.

## Our Practice Areas

### Criminal Defense

Our criminal defense attorneys have decades of combined experience defending clients against charges ranging from misdemeanors to serious felonies.

### Personal Injury

When you've been injured due to someone else's negligence, you deserve compensation. Our personal injury team fights for the maximum recovery in cases involving accidents and injuries.

## Why Choose Harris & Associates?

- **Proven Track Record**: Our attorneys have secured millions in settlements and favorable verdicts.
- **Personalized Attention**: We limit our caseload to ensure your case receives the attention it deserves.
- **24/7 Availability**: Legal emergencies don't follow business hours. Neither do we.
- **No Fee Unless We Win**: For personal injury cases, you pay nothing unless we secure compensation for you.

## Contact Us Today

Don't face the legal system alone. Schedule your free consultation today and let our experienced legal team fight for your rights.`;
            break;
          case 'criminal-defense':
            pageTitle = 'Criminal Defense Services';
            sampleContent = `# Criminal Defense Services

## Expert Criminal Defense Representation

When you're facing criminal charges, the stakes couldn't be higher. At Harris & Associates, our criminal defense attorneys bring decades of experience to your case, protecting your rights and fighting for the best possible outcome.

## Our Criminal Defense Practice Areas

### DUI/DWI Defense

Our DUI defense attorneys understand the technical aspects of breath and blood testing, field sobriety tests, and police procedures. We'll scrutinize every detail to build your strongest defense.

### Drug Offenses

From simple possession to trafficking charges, our attorneys have successfully defended clients against all types of drug-related offenses at both state and federal levels.

### White Collar Crimes

Our white collar crime defense team has the expertise to handle complex cases involving fraud, embezzlement, securities violations, and other financial crimes.

### Violent Crime Defense

When facing serious charges like assault, battery, or homicide, you need an attorney with the experience and resources to mount an aggressive defense.

### Federal Criminal Defense

Federal cases involve different procedures, guidelines, and stakes. Our attorneys have extensive experience in federal court and will guide you through this complex process.

## The Harris & Associates Advantage

- **Proven Results**: Our case record speaks for itself with numerous dismissals, reduced charges, and acquittals.
- **Personalized Strategy**: We develop defense strategies tailored to your specific case, not one-size-fits-all solutions.
- **Accessible Representation**: Your attorney is always available to address your concerns and keep you informed.
- **Respected Advocates**: Our reputation in the legal community often leads to better negotiations with prosecutors.

## Contact Our Criminal Defense Team

Don't risk your future with inadequate representation. Contact Harris & Associates today for a confidential consultation.`;
            break;
          case 'personal-injury':
            pageTitle = 'Personal Injury Services';
            sampleContent = `# Personal Injury Services

## Dedicated Personal Injury Representation

After an accident, you deserve an attorney who will fight for your full and fair compensation. The personal injury team at Harris & Associates has recovered millions for our clients through skilled negotiation and aggressive litigation.

## Personal Injury Practice Areas

### Car Accidents

Our car accident attorneys understand the tactics insurance companies use to minimize payouts. We'll handle all communication with insurers while you focus on recovery.

### Truck Accidents

Commercial truck accidents often involve multiple liable parties and complex regulations. Our team has the expertise to navigate these challenging cases.

### Slip and Fall Injuries

Property owners have a duty to maintain safe premises. When they fail, we hold them accountable for the injuries their negligence causes.

### Medical Malpractice

Our medical malpractice team works with top medical experts to build compelling cases when healthcare providers fail to meet the standard of care.

### Workplace Injuries

Beyond workers' compensation, you may be entitled to additional damages when third parties are responsible for workplace accidents.

## Why Choose Harris & Associates for Your Personal Injury Case

- **Proven Results**: Our firm has secured numerous seven and eight-figure settlements and verdicts.
- **No Fee Unless We Win**: We take cases on a contingency basis, so you pay nothing unless we recover compensation for you.
- **Full-Service Representation**: From medical treatment coordination to dealing with bill collectors, we handle all aspects of your case.
- **Trial-Ready Attorneys**: While most cases settle, knowing our attorneys are prepared for trial gives us leverage in negotiations.

## Contact Our Personal Injury Team

Don't settle for less than you deserve. Contact Harris & Associates today for a free case evaluation.`;
            break;
          case 'about-us':
            pageTitle = 'About Our Law Firm';
            sampleContent = `# About Our Law Firm

## Our History

Founded in 2005 by Jonathan Harris, Harris & Associates has grown from a solo practice to one of the region's most respected litigation firms. Our growth has been built on a foundation of client success and word-of-mouth referrals.

## Our Team

Our attorneys bring diverse backgrounds but share a commitment to excellence in legal representation:

- **Jonathan Harris** - Founding Partner, Criminal Defense
  Harvard Law School graduate with 25+ years of trial experience.

- **Sarah Chen** - Managing Partner, Personal Injury
  Former insurance defense attorney who now uses her insider knowledge to benefit injury victims.

- **Michael Rodriguez** - Partner, Criminal Defense
  Former prosecutor with unparalleled knowledge of the local criminal justice system.

- **Aisha Washington** - Partner, Personal Injury
  Nationally recognized trial attorney with multiple seven-figure verdicts.

## Our Approach

At Harris & Associates, we believe in:

- **Direct Attorney Access** - You'll work directly with your attorney, not be passed to paralegals.
- **Transparent Communication** - We explain legal concepts in plain language and keep you informed at every stage.
- **Strategic Advocacy** - We develop customized strategies based on your specific goals and case factors.
- **Community Involvement** - Our firm remains deeply connected to the communities we serve through pro bono work and local partnerships.

## Recognition & Awards

- Best Law Firms, U.S. News & World Report (2018-2025)
- Super Lawyers, Multiple Attorneys (2010-2025)
- Top 100 Trial Lawyers, National Trial Lawyers Association
- Martindale-Hubbell AV Preeminent Rating

## Contact Us

We welcome the opportunity to discuss how our firm can help with your legal matter. Contact us today to schedule a consultation.`;
            break;
          default:
            pageTitle = 'Content Not Found';
            sampleContent = `# Content Not Found
            
The requested content "${params.id}" could not be found. Please return to the dashboard.`;
        }

        setTitle(pageTitle);
        setContent(sampleContent);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching content:', error);
        setError('Failed to load content. Please try again.');
        setLoading(false);
      }
    };

    fetchContent();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900">
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
        <div className="mt-4">
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Link 
              href="/admin"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2 transition-colors duration-200"
            >
              Back to Dashboard
            </Link>
            <button 
              onClick={() => alert(`Publishing ${params.id}...`)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          {/* Document header with decorative element */}
          <div className="bg-blue-50 dark:bg-blue-900/30 px-6 py-4 border-b border-blue-100 dark:border-blue-800">
            <div className="text-sm text-blue-600 dark:text-blue-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <span>Preview Mode • {params.id}</span>
            </div>
          </div>

          {/* Document content with enhanced styling */}
          <div className="p-6 md:p-10">
            <ReactMarkdown
              components={MarkdownComponents}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="mt-8 flex justify-between">
          <div className="space-x-4">
            <button 
              onClick={() => alert(`Requesting edits for ${params.id}...`)}
              className="px-5 py-2.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200 shadow flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              Request Edits
            </button>
            <button 
              onClick={() => alert(`Regenerating ${params.id}...`)}
              className="px-5 py-2.5 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors duration-200 shadow flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Regenerate
            </button>
          </div>
          <button 
            onClick={() => alert(`Moving ${params.id} to trash...`)}
            className="px-5 py-2.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 shadow flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}