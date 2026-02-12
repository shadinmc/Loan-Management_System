import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext.jsx';
import { KYCProvider } from './context/KYCContext.jsx';
import { WalletProvider } from './context/WalletContext.jsx';
import { ThemeProvider } from './components/ThemeProvider.jsx';
import App from './App.jsx';
import './index.css';
import './styles/animations.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <KYCProvider>
            <WalletProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </WalletProvider>
          </KYCProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
