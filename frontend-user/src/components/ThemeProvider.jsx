import { createContext, useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';

/**
 * Theme Context & Provider
 * Manages application-wide dark/light theme state
 */
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const fallbackTransitionTimerRef = useRef(null);

  const [theme, setTheme] = useState(() => {
    // Check localStorage or system preference
    const saved = localStorage.getItem('theme');
    if (saved) return saved;

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    return () => {
      if (fallbackTransitionTimerRef.current) {
        clearTimeout(fallbackTransitionTimerRef.current);
      }
    };
  }, []);

  const toggleTheme = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsViewTransition = typeof document.startViewTransition === 'function';

    if (!prefersReducedMotion && supportsViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
        });
      });
      return;
    }

    if (!prefersReducedMotion) {
      document.documentElement.classList.add('theme-switching');
      if (fallbackTransitionTimerRef.current) {
        clearTimeout(fallbackTransitionTimerRef.current);
      }
      fallbackTransitionTimerRef.current = setTimeout(() => {
        document.documentElement.classList.remove('theme-switching');
      }, 420);
    }

    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
