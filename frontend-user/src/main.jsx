import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { KYCProvider } from './context/KYCContext.jsx';
import { ThemeProvider } from './components/ThemeProvider.jsx';
import App from './App.jsx';
import './index.css';
import './styles/animations.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <KYCProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </KYCProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);