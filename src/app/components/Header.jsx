'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Navigation } from './Navigation';

export function Header() {
  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold">Sevens Legal</h1>
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-400">Expert Criminal Defense Attorneys</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Navigation />
          <div className="ml-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}