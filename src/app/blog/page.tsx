import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { generateMetadata } from '../../utils/metadata';
import { generateWebPageSchema, generateBreadcrumbSchema } from '../../utils/schemaMarkup';
import BreadcrumbNav from '../components/BreadcrumbNav';

// SEO: Generate metadata according to SEO guidelines (Tip #23)
export const metadata: Metadata = generateMetadata({
  title: "Criminal Defense Law Blog",
  description: "Expert insights on criminal defense law, DUI charges, drug offenses, and domestic violence cases from the experienced attorneys at Sevens Legal.",
  path: "/blogs",
  keywords: ["criminal defense blog", "legal blog", "law firm blog", "DUI information", "drug charge defense", "domestic violence legal advice"],
  openGraph: {},
  image: "/images/blog-image-0-1746709482001.webp"
});

export default function BlogsPage() {
  // Example blog posts data - in a real implementation this would come from CMS or API
  const posts = [
    {
      title: "Understanding DUI Laws in California",
      slug: "understanding-dui-laws-california",
      excerpt: "Learn about the latest DUI laws in California and how they might impact your case if you're facing charges.",
      publishDate: "2025-03-15T08:00:00.000Z",
      author: "John Smith",
      featuredImage: "/images/blog-image-0-1746709482001.webp",
      categories: ["DUI Defense", "California Law"]
    },
    {
      title: "What to Expect During Your Criminal Case",
      slug: "what-to-expect-during-criminal-case",
      excerpt: "A step-by-step guide to the criminal justice process in San Diego County and what defendants should expect.",
      publishDate: "2025-04-02T08:00:00.000Z",
      author: "Samantha Greene",
      featuredImage: "/images/blog-image-1-1746709498700.webp",
      categories: ["Criminal Defense", "Legal Process"]
    },
    {
      title: "Domestic Violence Defense Strategies That Work",
      slug: "domestic-violence-defense-strategies",
      excerpt: "Explore effective defense strategies for those facing domestic violence charges in California.",
      publishDate: "2025-04-28T08:00:00.000Z",
      author: "Robert Johnson",
      featuredImage: "/images/blog-image-2-1746709515145.webp",
      categories: ["Domestic Violence", "Defense Strategies"]
    }
  ];
  
  // Define breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blogs' }
  ];
  
  // SEO: Generate schema.org markup
  const blogPageSchema = generateWebPageSchema(
    "Criminal Defense Law Blog | Sevens Legal",
    "Expert insights on criminal defense law, DUI charges, drug offenses, and domestic violence cases from the experienced attorneys at Sevens Legal.",
    "https://sevenslegal.com/blogs",
    "https://sevenslegal.com/images/blog-image-0-1746709482001.webp"
  );
  
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      {/* JSON-LD Schema for blog listing page */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPageSchema) }}
      />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb navigation */}
        <BreadcrumbNav items={breadcrumbItems} />
        
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Criminal Defense Law Blog</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            Expert insights and legal information on criminal defense matters from the experienced attorneys at Sevens Legal.
          </p>
        </section>
        
        {/* Blog post listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="blog-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
              {/* Featured image */}
              <div className="relative h-48">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              
              {/* Post content */}
              <div className="p-6 flex-grow">
                {/* Categories */}
                <div className="mb-3">
                  {post.categories.slice(0, 2).map(category => (
                    <span 
                      key={category} 
                      className="mr-2 inline-block px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                
                {/* Title with proper heading hierarchy */}
                <h2 className="text-xl font-bold mb-2">
                  <Link href={`/blogs/${post.slug}`} className="hover:text-blue-700 dark:hover:text-blue-400">
                    {post.title}
                  </Link>
                </h2>
                
                {/* Excerpt */}
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {post.excerpt}
                </p>
                
                {/* Author and date */}
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-auto">
                  <span>{post.author}</span>
                  <span className="mx-2">•</span>
                  <time dateTime={post.publishDate}>
                    {new Date(post.publishDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              </div>
              
              {/* Read more link */}
              <div className="px-6 pb-6">
                <Link 
                  href={`/blogs/${post.slug}`}
                  className="text-blue-700 dark:text-blue-400 font-medium hover:underline"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
