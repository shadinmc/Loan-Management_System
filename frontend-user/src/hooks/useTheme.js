import { useContext } from 'react';
import { ThemeContext } from '../components/ThemeProvider';

/**
 * Custom hook for accessing theme context
 * Provides current theme and toggle function
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
