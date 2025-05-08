'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Sevens Legal</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Expert criminal defense with over 40 years of combined experience.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Practice Areas</h3>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Criminal Defense</Link></li>
              <li><Link href="/services" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Drug Charges</Link></li>
              <li><Link href="/services" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Domestic Violence</Link></li>
              <li><Link href="/services" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">DUI Defense</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">1-800-333-7LAW</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">info@sevenslegal.com</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Request a Free Consultation
                </Link>
              </p>
            </address>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} Sevens Legal. All rights reserved.
          </p>
          <div className="space-x-4">
            <Link href="/admin" className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}