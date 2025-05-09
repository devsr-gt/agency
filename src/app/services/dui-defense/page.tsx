/* eslint-disable @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { generateMetadata } from '../../../utils/metadata';
import BreadcrumbNav from '../../components/BreadcrumbNav';
import FAQ from '../../components/FAQ';

// SEO: Generate metadata according to SEO guidelines (Tip #23)
export const metadata: Metadata = generateMetadata({
  title: "DUI Defense Attorney in San Diego",
  description: "Expert DUI defense attorneys with proven track record of success. Free consultation for DUI charges in San Diego and surrounding areas.",
  path: "/services/dui-defense",
  keywords: ["DUI defense", "DUI lawyer", "San Diego", "drunk driving", "DUI attorney", "DUI charges", "breathalyzer test", "field sobriety test"],
  openGraph: {}, // Added missing openGraph property
  image: "/images/services-image-2-1746709638172.webp"
});

export default function DUIDefensePage() {
  // Define breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'DUI Defense', path: '/services/dui-defense' }
  ];
  
  // FAQ data for DUI Defense
  const duiFAQs = [
    {
      question: "What are the penalties for a first-time DUI in California?",
      answer: "First-time DUI offenders in California typically face fines ranging from $1,500 to $2,000, possible jail time of up to 6 months, a license suspension of 4 to 10 months, mandatory DUI education programs, and potential installation of an ignition interlock device. However, with proper legal representation, these penalties may be reduced."
    },
    {
      question: "Should I take a breathalyzer test if pulled over?",
      answer: "Under California's implied consent law, refusing a chemical test after being lawfully arrested for DUI can result in automatic license suspension. However, preliminary alcohol screening tests conducted before arrest can generally be refused unless you're under 21 or on probation for a previous DUI. It's important to understand your rights and the potential consequences of refusal."
    },
    {
      question: "Can a DUI charge be reduced or dismissed?",
      answer: "Yes, in some cases. DUI charges may be reduced to lesser offenses like \"wet reckless\" or dismissed entirely depending on factors such as testing procedures, officer conduct during the arrest, and evidence collection. Our attorneys thoroughly examine all aspects of your case to identify potential weaknesses in the prosecution's evidence."
    },
    {
      question: "How long will a DUI stay on my driving record?",
      answer: "In California, a DUI conviction remains on your driving record for 10 years. This affects your insurance rates and counts as a prior offense if you receive another DUI during that time period. However, you may be eligible to have the criminal record expunged after completing probation."
    },
    {
      question: "Do I need an attorney for a DUI charge?",
      answer: "While you have the right to represent yourself, DUI laws are complex and the consequences are serious. A skilled DUI defense attorney understands the legal system, can challenge evidence, negotiate with prosecutors, represent you at DMV hearings to protect your driving privileges, and work to minimize the impact on your life and career."
    }
  ];

  // Service schema 
  const duiServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://sevenslegal.com/services/dui-defense#service",
    "name": "DUI Defense",
    "url": "https://sevenslegal.com/services/dui-defense",
    "provider": {
      "@id": "https://sevenslegal.com/#organization"
    },
    "description": "Expert DUI defense representation for clients in San Diego and surrounding areas. Our attorneys have extensive experience defending clients against all types of DUI charges.",
    "areaServed": {
      "@type": "City",
      "name": "San Diego"
    },
    "serviceType": "Legal Service"
  };
  
  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://sevenslegal.com${item.path}`
    }))
  };
  
  return (
    <>
      {/* JSON-LD Schema for service page */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(duiServiceSchema) }}
      />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb navigation */}
        <BreadcrumbNav items={breadcrumbItems} />
        
        {/* Hero section */}
        <div className="relative w-full max-w-5xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-xl shadow-lg p-8 md:p-12">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">San Diego DUI Defense Attorney</h1>
              <p className="text-lg mb-6">Facing DUI charges? Our experienced attorneys will fight to protect your rights, driving privileges, and freedom.</p>
              <Link href="/contact" className="bg-white text-blue-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium inline-block">
                Free Consultation
              </Link>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto mb-12">
          <div className="lg:w-2/3">
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Experienced DUI Defense in San Diego</h2>
              <p className="mb-4">
                At Sevens Legal, we understand that facing DUI charges can be overwhelming and potentially life-changing. Our dedicated attorneys provide comprehensive legal representation for clients charged with driving under the influence of alcohol or drugs.
              </p>
              <p className="mb-4">
                With decades of combined experience handling DUI cases throughout San Diego County, our attorneys have the knowledge and skill to challenge evidence, question testing procedures, and fight for the best possible outcome in your case.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Our DUI Defense Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">First-Time DUI Defense</h3>
                  <p>Specialized defense strategies for first-time DUI offenders to minimize penalties and protect your future.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">Multiple DUI Charges</h3>
                  <p>Strategic representation for clients facing second, third, or subsequent DUI charges with enhanced penalties.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">DMV Hearings</h3>
                  <p>Representation at DMV administrative hearings to protect your driving privileges and license status.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">Felony DUI Cases</h3>
                  <p>Aggressive defense for serious DUI charges involving injuries, accidents, or other aggravating factors.</p>
                </div>
              </div>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Why Choose Sevens Legal for DUI Defense</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Expert knowledge of California DUI laws and local court procedures</li>
                <li>Relationships with prosecutors and judges throughout San Diego County</li>
                <li>Thorough examination of all evidence, including breathalyzer and field sobriety test results</li>
                <li>Strategic negotiation tactics that have resulted in reduced charges and dismissed cases</li>
                <li>Compassionate approach that recognizes the stress and anxiety that come with facing DUI charges</li>
              </ul>
            </section>
            
            {/* FAQ Section with schema markup */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions About DUI Defense</h2>
              <FAQ faqs={duiFAQs} />
            </section>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* CTA Box */}
            <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-bold mb-3">Free DUI Case Evaluation</h3>
              <p className="mb-4">Every case is unique. Contact us today to discuss your specific situation with an experienced attorney.</p>
              <Link 
                href="/contact" 
                className="block w-full bg-blue-700 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium text-center"
              >
                Schedule Consultation
              </Link>
            </div>
            
            {/* Testimonial */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
              <div className="text-yellow-500 flex mb-3">
                ★★★★★
              </div>
              <blockquote className="mb-4 text-gray-700 dark:text-gray-300 italic">
                "The attorneys at Sevens Legal were incredibly helpful during one of the most stressful times of my life. They fought hard to get my DUI charge reduced and saved my driver's license. I couldn't recommend them highly enough."
              </blockquote>
              <cite className="text-sm text-gray-600 dark:text-gray-400 not-italic">
                - Michael R., San Diego
              </cite>
            </div>
            
            {/* Related Services */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4">Related Services</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/services/criminal-defense" className="text-blue-700 dark:text-blue-400 hover:underline">
                    Criminal Defense
                  </Link>
                </li>
                <li>
                  <Link href="/services/drug-charges" className="text-blue-700 dark:text-blue-400 hover:underline">
                    Drug Charges Defense
                  </Link>
                </li>
                <li>
                  <Link href="/services/license-reinstatement" className="text-blue-700 dark:text-blue-400 hover:underline">
                    License Reinstatement
                  </Link>
                </li>
                <li>
                  <Link href="/services/record-expungement" className="text-blue-700 dark:text-blue-400 hover:underline">
                    Record Expungement
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-xl shadow-lg p-8 max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Don't Face DUI Charges Alone</h2>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            The consequences of a DUI conviction can impact your life for years to come. Protect your rights and future with experienced legal representation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/contact" className="bg-white text-blue-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium">
              Contact Us Today
            </Link>
            <Link href="/about" className="bg-blue-700 hover:bg-blue-600 px-6 py-3 rounded-lg font-medium">
              Meet Our Attorneys
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
