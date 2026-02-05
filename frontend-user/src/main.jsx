import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from './components/ThemeProvider.jsx';
import './index.css';
import './styles/animations.css';

/**
 * Application Entry Point
 * Wraps the app with ThemeProvider for dark/light mode support
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
