import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "./components/ThemeProvider";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Enhanced metadata following SEO best practices
export const metadata: Metadata = {
  title: {
    default: "Expert Criminal Defense | Sevens Legal",
    template: "%s | Sevens Legal"
  },
  description: "Expert legal representation for criminal defense cases with over 40 years of combined experience. Specializing in DUI, domestic violence, and drug offense defense.",
  keywords: "criminal defense, lawyer, attorney, legal representation, DUI defense, domestic violence, drug charges, San Diego",
  authors: [{ name: "Sevens Legal" }],
  creator: "Sevens Legal",
  publisher: "Sevens Legal",
  formatDetection: {
    email: false,
    telephone: true,
    address: true,
  },
  metadataBase: new URL("https://sevenslegal.com"),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Expert Criminal Defense | Sevens Legal",
    description: "Expert legal representation for criminal defense cases with over 40 years of combined experience",
    url: 'https://sevenslegal.com',
    siteName: 'Sevens Legal',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Expert Criminal Defense | Sevens Legal",
    description: "Expert legal representation for criminal defense cases with over 40 years of combined experience",
    creator: '@SevenLegal',
  },
  verification: {
    google: "verification-code", // Replace with actual verification code when available
  },
  icons: {
    icon: '/wumpus/favicon.svg',
    apple: '/wumpus/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // SEO: Add structured schema data for the law firm organization (Tip #54, #90)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": "https://sevenslegal.com/#organization",
    "name": "Sevens Legal",
    "url": "https://sevenslegal.com",
    "logo": "https://sevenslegal.com/wumpus/logo.svg",
    "description": "Expert legal representation for criminal defense cases with over 40 years of combined experience",
    "telephone": "+1-555-123-4567",  // Replace with actual phone number
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Legal Street",  // Replace with actual address
      "addressLocality": "San Diego",
      "addressRegion": "CA",
      "postalCode": "92101",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://www.facebook.com/SevenLegal", // Replace with actual social profiles
      "https://twitter.com/SevenLegal",
      "https://www.linkedin.com/company/seven-legal"
    ],
    "openingHours": "Mo,Tu,We,Th,Fr 09:00-17:00",
    "priceRange": "$$$",
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 32.7157,
        "longitude": -117.1611
      },
      "geoRadius": "50mi"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/wumpus/favicon.svg" />
        <link rel="canonical" href="https://sevenslegal.com" />
        {/* Self-referential canonical for better SEO - Tip #36 */}
        {/* Avoid trailing slash redirections (SEO Tip #31) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ThemeProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
