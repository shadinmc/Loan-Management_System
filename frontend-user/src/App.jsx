import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import LoanTypes from './pages/loans/LoanTypes';
import LoanApply from './pages/loans/LoanApply';
import LoanConfirmation from './pages/loans/LoanConfirmation';
import LoanDecision from './pages/loans/LoanDecision';
import KYCPage from './pages/KYCPage';
import WalletPage from './pages/WalletPage';
import WalletTransactionPage from './components/WalletTransaction';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { useState } from 'react';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-container">
      <Navbar onMenuClick={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<LoanTypes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/kyc" element={<KYCPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/wallet/transactions" element={<WalletTransactionPage />} />
            <Route path="/loan/apply" element={<LoanApply />} />
            <Route path="/loan/apply/:loanType" element={<LoanApply />} />
            <Route path="/loan/confirm" element={<LoanConfirmation />} />
            <Route path="/loan/confirmation" element={<LoanConfirmation />} />
            <Route path="/loan/decision" element={<LoanDecision />} />
            <Route path="/loan/status" element={<LoanDecision />} />
          </Route>
        </Routes>
      </main>

      <style>{`
        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-content {
          flex: 1;
          padding-top: 70px;
          min-height: calc(100vh - 70px);
        }
      `}</style>
    </div>
  );
}
