'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'system',
  setTheme: () => null,
  resolvedTheme: 'light',
});

export function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'theme-preference' }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(storageKey) || defaultTheme;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultTheme;
      }
    }
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState('light');
  
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark');
    
    // Determine the actual theme to apply
    let resolvedTheme;
    if (theme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolvedTheme = theme;
    }
    
    // Add the appropriate class and set data attribute
    root.classList.add(resolvedTheme);
    root.setAttribute('data-theme', resolvedTheme);
    
    // Update state
    setResolvedTheme(resolvedTheme);
    
    // Store the preference
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [theme, storageKey]);
  
  // Listen for system preference changes
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const newResolvedTheme = mediaQuery.matches ? 'dark' : 'light';
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(newResolvedTheme);
      setResolvedTheme(newResolvedTheme);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = {
    theme,
    setTheme,
    resolvedTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};