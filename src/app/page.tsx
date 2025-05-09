import Link from 'next/link';
import { Metadata } from 'next';
import { generateMetadata } from '../utils/metadata';
import { generateWebPageSchema, generateServicesSchema, generateBreadcrumbSchema } from '../utils/schemaMarkup';
import HomePageFAQ from './components/HomePageFAQ';
import BreadcrumbNav from './components/BreadcrumbNav';

// SEO: Generate metadata according to SEO guidelines (Tip #23)
export const metadata: Metadata = generateMetadata({
  title: "Expert Criminal Defense Attorney in San Diego",
  description: "Sevens Legal provides expert criminal defense services with over 40 years of combined experience. Free consultations for DUI, domestic violence, and drug charges.",
  path: "/",
  keywords: ["criminal defense", "attorney", "lawyer", "san diego", "DUI defense", "domestic violence", "drug charges", "legal representation"],
  openGraph: {}, // Added missing openGraph property
  image: "/images/homepage-image-0-1746709579282.webp"
});

export default function Home() {
  // SEO: Generate schema.org markup for the home page (Tip #54, #90)
  const homePageSchema = generateWebPageSchema(
    "Expert Criminal Defense Attorney in San Diego | Sevens Legal",
    "Sevens Legal provides expert criminal defense services with over 40 years of combined experience.",
    "https://sevenslegal.com/",
    "https://sevenslegal.com/images/homepage-image-0-1746709579282.webp"
  );

  const servicesSchema = generateServicesSchema();

  // Define breadcrumb items for the home page
  const breadcrumbItems = [
    { name: 'Home', path: '/' }
  ];

  return (
    <>
      {/* JSON-LD Schema for website */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbItems)) }}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb navigation for SEO and user experience */}
        <BreadcrumbNav items={breadcrumbItems} />
        
        {/* Hero section */}
        <div className="relative w-full max-w-5xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-xl shadow-lg p-8 md:p-12">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Dedicated Criminal Defense When You Need It Most</h2>
              <p className="text-lg mb-6">With over 40 years of combined experience, Sevens Legal provides expert legal representation for those facing criminal charges.</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/contact" className="bg-white text-blue-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium text-center">
                  Free Consultation
                </Link>
                <Link href="/services" className="bg-blue-700 hover:bg-blue-600 px-6 py-3 rounded-lg font-medium text-center">
                  Our Services
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16 w-full max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Practice Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Criminal Defense</h3>
              <p className="text-gray-600 dark:text-gray-300">Comprehensive defense strategies for all criminal charges.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Drug Charges</h3>
              <p className="text-gray-600 dark:text-gray-300">Expert representation for all drug-related offenses.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Domestic Violence</h3>
              <p className="text-gray-600 dark:text-gray-300">Sensitive and strategic defense for domestic cases.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">DUI Defense</h3>
              <p className="text-gray-600 dark:text-gray-300">Protecting your future against DUI charges.</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-5xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Why Choose Sevens Legal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Experience</h3>
              <p className="text-gray-600 dark:text-gray-300">Over 40 years of combined legal experience in criminal defense.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Personalized Attention</h3>
              <p className="text-gray-600 dark:text-gray-300">Dedicated representation tailored to your unique situation.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Proven Results</h3>
              <p className="text-gray-600 dark:text-gray-300">Track record of successful case outcomes and dismissals.</p>
            </div>
          </div>
        </div>
        
        {/* FAQ Section with schema markup (Tip #93) */}
        <div className="w-full max-w-5xl mx-auto mb-16">
          <HomePageFAQ />
        </div>
      </div>
    </>
  );
}
