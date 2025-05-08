'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();
  
  const isActive = (path) => {
    return pathname === path ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'hover:text-blue-600 dark:hover:text-blue-400';
  };

  return (
    <nav className="w-full">
      <ul className="flex flex-wrap justify-center md:justify-end space-x-2 md:space-x-6">
        <li>
          <Link href="/" className={`p-2 ${isActive('/')}`}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/services" className={`p-2 ${isActive('/services')}`}>
            Services
          </Link>
        </li>
        <li>
          <Link href="/about" className={`p-2 ${isActive('/about')}`}>
            About
          </Link>
        </li>
        <li>
          <Link href="/contact" className={`p-2 ${isActive('/contact')}`}>
            Contact
          </Link>
        </li>
        <li>
          <Link href="/blog" className={`p-2 ${isActive('/blog')}`}>
            Blog
          </Link>
        </li>
      </ul>
    </nav>
  );
}