import { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import PageLoader from './components/PageLoader';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const LoanTypes = lazy(() => import('./pages/loans/LoanTypes'));
const LoanApply = lazy(() => import('./pages/loans/LoanApply'));
const LoanConfirmation = lazy(() => import('./pages/loans/LoanConfirmation'));
const LoanDecision = lazy(() => import('./pages/loans/LoanDecision'));

/**
 * Main Application Component
 * Handles routing, global layout structure, and accessibility features
 */
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Skip to main content - Accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        {/* Navigation */}
        <Navbar onMenuClick={toggleSidebar} />
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        {/* Main Content */}
        <main id="main-content" className="main-content" role="main">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LoanTypes />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/loan/apply" element={<LoanApply />} />
                <Route path="/loan/apply/:loanType" element={<LoanApply />} />
                <Route path="/loan/confirm" element={<LoanConfirmation />} />
                <Route path="/loan/decision" element={<LoanDecision />} />
                <Route path="/loan/status" element={<LoanDecision />} />
              </Route>
            </Routes>
          </Suspense>
        </main>

        {/* Footer can be added here */}

        <style>{`
          .app-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            background: var(--bg-primary);
          }

          .main-content {
            flex: 1;
            padding-top: 70px;
            min-height: calc(100vh - 70px);
          }

          /* Smooth page transitions */
          .main-content > * {
            animation: pageEnter 0.3s ease-out;
          }

          @keyframes pageEnter {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </BrowserRouter>
  );
}
