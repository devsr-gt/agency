/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';
import { generateMetadata } from '../../../utils/metadata';
import BlogPostLayout from '../../components/BlogPostLayout';

// Example blog post data - in a real implementation this would come from CMS or API
const post = {
  title: "Understanding DUI Laws in California",
  slug: "understanding-dui-laws-california",
  description: "Learn about the latest DUI laws in California and how they might impact your case if you're facing charges.",
  publishDate: "2025-03-15T08:00:00.000Z",
  modifiedDate: "2025-05-01T08:00:00.000Z",
  author: "John Smith",
  featuredImage: "/images/blog-image-0-1746709482001.webp",
  categories: ["DUI Defense", "California Law"]
};

// SEO: Generate metadata according to SEO guidelines (Tip #23)
export const metadata: Metadata = generateMetadata({
  title: post.title,
  description: post.description,
  path: `/${post.slug}`, // Flat URL structure via Next.js rewrites
  keywords: ["DUI laws", "California DUI", "drunk driving", "DUI penalties", "DUI defense attorney", "blood alcohol content", "legal limit", "DUI arrest"],
  image: post.featuredImage,
  openGraph: {
    type: 'article',
    publishedTime: post.publishDate,
    modifiedTime: post.modifiedDate,
    authors: [post.author],
    tags: post.categories
  }
});

export default function BlogPostPage() {
  return (
    <BlogPostLayout post={post}>
      <h2>What Constitutes a DUI in California?</h2>
      
      <p>
        In California, it is illegal to drive with a blood alcohol concentration (BAC) of 0.08% or higher if you are 21 years or older. 
        For commercial drivers, the limit is even lower at 0.04%, and for drivers under 21, there is a zero-tolerance policy with a limit of 0.01%.
      </p>
      
      <p>
        California law recognizes two separate offenses:
      </p>
      
      <ul>
        <li>Driving under the influence of alcohol and/or drugs (DUI)</li>
        <li>Driving with a BAC of 0.08% or higher</li>
      </ul>
      
      <p>
        This means that even if your BAC is below 0.08%, you can still be charged with a DUI if your driving ability is impaired due to alcohol or drugs.
      </p>
      
      <h2>Recent Changes to California DUI Laws</h2>
      
      <p>
        California's DUI laws have evolved significantly in recent years. Some important changes include:
      </p>
      
      <h3>Ignition Interlock Devices (IIDs)</h3>
      
      <p>
        As of January 1, 2022, first-time DUI offenders in California may be required to install an ignition interlock device (IID) in their vehicle. 
        This device prevents the car from starting if it detects alcohol on the driver's breath. The installation period ranges from 6 months for a first offense to 
        3 years for multiple offenses.
      </p>
      
      <h3>Zero Tolerance for Marijuana</h3>
      
      <p>
        With the legalization of recreational marijuana in California, law enforcement has increased focus on detecting marijuana-impaired driving. 
        It's important to note that even though marijuana is legal, driving under its influence remains illegal.
      </p>
      
      <h2>Penalties for DUI in California</h2>
      
      <p>
        The consequences of a DUI conviction in California can be severe and far-reaching, affecting various aspects of your life.
      </p>
      
      <h3>First Offense</h3>
      
      <ul>
        <li>Up to 6 months in county jail</li>
        <li>Fines and penalties ranging from $1,500 to $2,000</li>
        <li>License suspension for 4 to 10 months</li>
        <li>Required completion of a DUI program</li>
        <li>Possible installation of an IID</li>
      </ul>
      
      <h3>Multiple Offenses</h3>
      
      <p>
        For second, third, and subsequent offenses within a 10-year period, the penalties escalate significantly, with longer jail sentences, 
        higher fines, and extended license suspensions.
      </p>
      
      <h2>How a DUI Defense Attorney Can Help</h2>
      
      <p>
        A skilled DUI defense attorney can provide crucial assistance if you're facing DUI charges:
      </p>
      
      <ul>
        <li>Challenge the legality of the traffic stop or arrest</li>
        <li>Question the accuracy of field sobriety tests and breathalyzer results</li>
        <li>Negotiate for reduced charges or penalties</li>
        <li>Represent you in administrative hearings with the DMV</li>
        <li>Fight for alternative sentencing options like diversion programs</li>
      </ul>
      
      <p>
        At Sevens Legal, our experienced DUI defense attorneys understand the complexities of California DUI law and will work tirelessly to protect your rights and achieve the best possible outcome for your case.
      </p>
      
      <h2>Frequently Asked Questions About DUI in California</h2>
      
      <h3>Can I refuse a breathalyzer test?</h3>
      
      <p>
        Under California's implied consent law, refusing a chemical test after being lawfully arrested for DUI can result in automatic license suspension and may be used against you in court. However, preliminary alcohol screening (PAS) tests conducted in the field before arrest can generally be refused without penalty unless you are under 21 or on probation for a previous DUI.
      </p>
      
      <h3>How long will a DUI stay on my record?</h3>
      
      <p>
        A DUI conviction remains on your driving record for 10 years in California. It will also appear on criminal background checks unless you successfully petition to have it expunged.
      </p>
      
      <h3>Can I get my DUI reduced to a "wet reckless"?</h3>
      
      <p>
        In some cases, it's possible to negotiate a reduction from a DUI to a "wet reckless" (reckless driving involving alcohol). This typically carries less severe penalties but still counts as a prior DUI offense if you are arrested again within 10 years.
      </p>
      
      <p>
        If you're facing DUI charges in California, don't face them alone. Contact Sevens Legal today for a confidential consultation with one of our experienced DUI defense attorneys.
      </p>
    </BlogPostLayout>
  );
}
