import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useKYC } from '../context/KYCContext';
import { useTheme } from '../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, LogOut, Home, LayoutDashboard,
  FileText, Clock, Settings, HelpCircle, Sun, Moon,
  Shield, CheckCircle, AlertCircle, Wallet
} from 'lucide-react';
import LottieAnimation from './LottieAnimation';

export default function Sidebar({ isOpen, onClose }) {
  const { user, isLoggedIn, logout } = useAuth();
  const { kycStatus, isKYCComplete, isKYCPending, isKYCRejected } = useKYC();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const isActive = (path) => location.pathname === path;

  const sidebarVariants = {
    closed: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
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
  const KYCStatusIcon = kycStatusInfo.icon;


  const navItems = isLoggedIn
    ? [
        { icon: Home, label: 'Home', path: '/', index: 0 },
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', index: 1 },
        { icon: Wallet, label: 'Wallet', path: '/wallet', index: 2 },
        { icon: Shield, label: 'KYC Verification', path: '/kyc', index: 3, isKYC: true },
        { icon: FileText, label: 'Apply for Loan', path: '/loan/apply', index: 4 },
        { icon: Clock, label: 'Loan Status', path: '/loan/status', index: 5 },
        { type: 'divider', index: 6 },
        { icon: Settings, label: 'Settings', path: '/settings', index: 7 },
        { icon: HelpCircle, label: 'Help & Support', path: '/help', index: 8 },
        { type: 'divider', index: 9 },
        { icon: LogOut, label: 'Logout', action: handleLogout, isLogout: true, index: 10 }
      ]
    : [
        { icon: Home, label: 'Home', path: '/', index: 0 },
        { icon: User, label: 'Login', path: '/login', index: 1 },
        { icon: FileText, label: 'Sign Up', path: '/signup', index: 2 }
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

        {isLoggedIn && (
          <motion.div
            className="user-profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <motion.div
              className="avatar"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </motion.div>
            <div className="user-info">
              <h4>{user?.username || 'User'}</h4>
              <p>{user?.email || 'user@example.com'}</p>
            </div>
            <div className="user-lottie">
              <LottieAnimation
                src="https://lottie.host/embed/verified-badge.json"
                style={{ width: 24, height: 24 }}
              />
            </div>
          </motion.div>
        )}

        {/* Theme Toggle with Lottie */}
        <motion.div
          className="theme-toggle-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <span className="theme-label">Appearance</span>
          <motion.button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span
              className={`toggle-option ${theme === 'light' ? 'active' : ''}`}
              whileHover={{ scale: theme !== 'light' ? 1.02 : 1 }}
            >
              {theme === 'light' ? (
                <LottieAnimation
                  src="https://lottie.host/embed/sun-animation.json"
                  style={{ width: 18, height: 18 }}
                />
              ) : (
                <Sun size={16} />
              )}
              Light
            </motion.span>
            <motion.span
              className={`toggle-option ${theme === 'dark' ? 'active' : ''}`}
              whileHover={{ scale: theme !== 'dark' ? 1.02 : 1 }}
            >
              {theme === 'dark' ? (
                <LottieAnimation
                  src="https://lottie.host/embed/moon-animation.json"
                  style={{ width: 18, height: 18 }}
                />
              ) : (
                <Moon size={16} />
              )}
              Dark
            </motion.span>
          </motion.button>
        </motion.div>

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
                  className={`nav-item ${item.path && isActive(item.path) ? 'active' : ''} ${item.isLogout ? 'logout' : ''}`}
                  onClick={() => item.action ? item.action() : handleNavigation(item.path)}
                  custom={item.index}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  whileHover={{ x: 4, backgroundColor: item.isLogout ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-secondary)' }}
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

        <motion.div
          className="sidebar-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="footer-lottie">
            <LottieAnimation
              src="https://lottie.host/embed/secure-badge.json"
              style={{ width: 32, height: 32 }}
            />
          </div>
          <p>LoanWise v1.0</p>
          <p className="copyright">© 2024 All rights reserved</p>
        </motion.div>
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
          right: 0;
          width: 340px;
          max-width: 90vw;
          height: 100vh;
          background: var(--card-bg);
          box-shadow: -10px 0 50px rgba(16, 42, 77, 0.2);
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

        .user-profile {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, rgba(45, 190, 96, 0.1) 0%, rgba(45, 190, 96, 0.05) 100%);
          margin: 20px;
          border-radius: 16px;
          border: 1px solid rgba(45, 190, 96, 0.15);
          position: relative;
        }

        .avatar {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.25rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(45, 190, 96, 0.3);
        }

        .user-info h4 {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .user-info p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .user-lottie {
          position: absolute;
          top: 12px;
          right: 12px;
        }

        .theme-toggle-section {
          padding: 20px;
          margin: 0 20px 12px;
          background: var(--bg-secondary);
          border-radius: 16px;
          border: 1px solid var(--border-color);
        }

        .theme-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 14px;
        }

        .theme-toggle-btn {
          width: 100%;
          display: flex;
          padding: 5px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          cursor: pointer;
        }

        .toggle-option {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          border-radius: 10px;
          transition: all 0.25s ease;
        }

        .toggle-option.active {
          background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(45, 190, 96, 0.35);
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

        .nav-item.logout {
          color: #EF4444;
        }

        .nav-divider {
          height: 1px;
          background: var(--border-color);
          margin: 16px 0;
        }

        .sidebar-footer {
          padding: 20px 24px;
          border-top: 1px solid var(--border-color);
          text-align: center;
        }

        .footer-lottie {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }

        .sidebar-footer p {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .sidebar-footer .copyright {
          margin-top: 4px;
          font-size: 0.7rem;
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