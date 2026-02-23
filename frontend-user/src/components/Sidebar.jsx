import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useKYC } from '../context/KYCContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Home, LayoutDashboard,
  FileText, Clock, Shield, CheckCircle, AlertCircle, Wallet, Banknote
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { isLoggedIn } = useAuth();
  const { kycStatus, isKYCComplete } = useKYC();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const isActive = (path) => location.pathname === path;

  const sidebarVariants = {
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, type: 'spring', stiffness: 300, damping: 25 }
    })
  };

  const getKYCStatus = () => {
    switch (kycStatus) {
      case 'approved':
        return {
          icon: CheckCircle,
          text: 'KYC Verified',
          subtext: 'All features unlocked',
          color: '#10B981',
          bgColor: 'rgba(16, 185, 129, 0.1)'
        };
      case 'pending':
        return {
          icon: Clock,
          text: 'KYC Pending',
          subtext: 'Under review',
          color: '#F59E0B',
          bgColor: 'rgba(245, 158, 11, 0.1)'
        };
      case 'rejected':
        return {
          icon: AlertCircle,
          text: 'KYC Rejected',
          subtext: 'Action required',
          color: '#EF4444',
          bgColor: 'rgba(239, 68, 68, 0.1)'
        };
      default:
        return {
          icon: Shield,
          text: 'Complete KYC',
          subtext: 'Unlock all features',
          color: '#6366F1',
          bgColor: 'rgba(99, 102, 241, 0.1)'
        };
    }
  };

  const kycStatusInfo = getKYCStatus();
  const navItems = isLoggedIn
    ? [
        { icon: Home, label: 'Home', path: '/', index: 0 },
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', index: 1 },
        { icon: Wallet, label: 'Wallet', path: '/wallet', index: 2 },
        { icon: Banknote, label: 'EMI Repayment', path: '/repayments', index: 3 },
        { icon: Shield, label: 'KYC Verification', path: '/kyc', index: 4, isKYC: true },
        { icon: FileText, label: 'Apply for Loan', path: '/loan/apply', index: 5 },
        { icon: Clock, label: 'Loan Status', path: '/loan/status', index: 6 }
      ]
    : [
        { icon: Home, label: 'Home', path: '/', index: 0 },
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', index: 1 },
        { icon: User, label: 'Login', path: '/login', index: 2 },
        { icon: FileText, label: 'Sign Up', path: '/signup', index: 3 }
      ];


  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className="sidebar"
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="sidebar-header">
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Menu
          </motion.h3>
          <motion.button
            className="close-btn"
            onClick={onClose}
            aria-label="Close menu"
            whileHover={{ scale: 1.05, borderColor: '#EF4444' }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={24} />
          </motion.button>
        </div>

        <nav className="sidebar-nav" aria-label="Sidebar navigation">
          <AnimatePresence>
            {isOpen && navItems.map((item) => {
              if (item.type === 'divider') {
                return (
                  <motion.div
                    key={`divider-${item.index}`}
                    className="nav-divider"
                    custom={item.index}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                  />
                );
              }

              const Icon = item.icon;
              const showKYCBadge = item.isKYC && !isKYCComplete;

              return (
                <motion.button
                  key={item.label}
                  className={`nav-item ${item.path && isActive(item.path) ? 'active' : ''}`}
                  onClick={() => item.action ? item.action() : handleNavigation(item.path)}
                  custom={item.index}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  whileHover={{ x: 4, backgroundColor: 'var(--bg-secondary)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {showKYCBadge && (
                    <span
                      className="kyc-mini-badge"
                      style={{ background: kycStatusInfo.color }}
                    >
                      {kycStatus === 'pending' ? 'Pending' : kycStatus === 'rejected' ? 'Action' : 'New'}
                    </span>
                  )}
                  {item.path && isActive(item.path) && (
                    <motion.div
                      className="active-indicator"
                      layoutId="activeNav"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </nav>
      </motion.aside>

      <style>{`
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(11, 30, 60, 0.7);
          backdrop-filter: blur(4px);
          z-index: 400;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 340px;
          max-width: 90vw;
          height: 100vh;
          background: var(--card-bg);
          box-shadow: 10px 0 50px rgba(16, 42, 77, 0.2);
          z-index: 500;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          border-bottom: 1px solid var(--border-color);
        }

        .sidebar-header h3 {
          font-size: 1.35rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .close-btn {
          width: 44px;
          height: 44px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          color: #EF4444;
        }

        .sidebar-nav {
          flex: 1;
          padding: 8px 20px;
          overflow-y: auto;
        }

        .nav-item {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.975rem;
          font-weight: 500;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          transition: color 0.2s ease;
          margin-bottom: 4px;
        }

        .nav-item:hover {
          color: var(--text-primary);
        }

        .nav-item.active {
          background: rgba(45, 190, 96, 0.1);
          color: #2DBE60;
        }

        .kyc-mini-badge {
          margin-left: auto;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.6875rem;
          font-weight: 600;
          color: white;
        }

        .active-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 24px;
          background: #2DBE60;
          border-radius: 0 4px 4px 0;
        }

        .nav-divider {
          height: 1px;
          background: var(--border-color);
          margin: 16px 0;
        }

        @media (max-width: 480px) {
          .sidebar {
            width: 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}
