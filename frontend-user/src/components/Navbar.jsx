// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, MoreVertical, Wallet, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

export default function Navbar({ onMenuClick }) {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const scrollToLoans = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToLoans: true } });
    } else {
      const loansSection = document.getElementById('loans-section');
      if (loansSection) {
        loansSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const scrollToCalculator = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToCalculator: true } });
    } else {
      const calculator = document.getElementById('emi-calculator');
      if (calculator) {
        calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <motion.nav
      className="navbar"
      role="navigation"
      aria-label="Main navigation"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand" aria-label="LoanWise - Go to homepage">
          <motion.div
            className="logo-icon"
            aria-hidden="true"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Wallet size={20} />
          </motion.div>
          <span className="logo-text">LoanWise</span>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="navbar-links" role="menubar">
          <motion.a
            href="#loans-section"
            onClick={scrollToLoans}
            className={`nav-link ${isActive('/') && !location.hash ? 'active' : ''}`}
            role="menuitem"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Loans
          </motion.a>

          <motion.a
            href="#emi-calculator"
            onClick={scrollToCalculator}
            className="nav-link calculator-link"
            role="menuitem"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calculator size={16} />
            EMI Calculator
          </motion.a>

          {isLoggedIn && (
            <>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/dashboard"
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                  role="menuitem"
                >
                  Dashboard
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/loan/status"
                  className={`nav-link ${isActive('/loan/status') ? 'active' : ''}`}
                  role="menuitem"
                >
                  Loan Status
                </Link>
              </motion.div></>
          )}
        </div>

        {/* Right Section */}
        <div className="navbar-actions">
          {/* Calculator Quick Access Button */}


          {/* Auth Buttons or User Info */}
          {!isLoggedIn ? (
            <div className="auth-buttons">
              <motion.button
                className="btn-ghost"
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Login
              </motion.button>
              <motion.button
                className="btn-primary"
                onClick={() => navigate('/signup')}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            </div>
          ) : (
            <motion.div
              className="user-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >

              <span className="welcome-text">
                Hi, <strong>{user?.username || 'User'}</strong>
              </span>
            </motion.div>
          )}

          {/* Three-dot Menu Button */}
          <motion.button
            className="menu-button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            aria-expanded="false"
            aria-haspopup="true"
            whileHover={{ scale: 1.05, borderColor: '#2DBE60' }}
            whileTap={{ scale: 0.95 }}
          >
            <MoreVertical size={20} />
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button
            className="mobile-menu-button"
            onClick={onMenuClick}
            aria-label="Open mobile menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={24} />
          </motion.button>
        </div>
      </div><style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 72px;
          background: var(--navbar-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
          z-index: 300;
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          height: 100%;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--text-primary);
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(45, 190, 96, 0.25);
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .navbar-links {
          display: flex;
          gap: 4px;
        }

        .nav-link {
          padding: 10px 18px;
          border-radius: 10px;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.9375rem;
          transition: color 0.2s ease, background 0.2s ease;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;}

        .nav-link:hover {
          color: var(--text-primary);
          background: var(--bg-secondary);
        }

        .nav-link.active {
          color: #2DBE60;
          background: rgba(45, 190, 96, 0.1);
        }

        .nav-link.calculator-link {
          color: #8B5CF6;
        }

        .nav-link.calculator-link:hover {
          background: rgba(139, 92, 246, 0.1);
          color: #8B5CF6;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .calculator-btn {
          width: 40px;
          height: 40px;
          border: 1px solid var(--border-color);
          background: var(--card-bg);
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8B5CF6;
          transition: background 0.2s ease;
        }

        .calculator-btn:hover {
          background: rgba(139, 92, 246, 0.1);
        }

        .calculator-btn:focus-visible {
          outline: 2px solid #8B5CF6;
          outline-offset: 2px;
        }

        .auth-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-ghost {
          padding: 10px 18px;
          border: none;
          background: transparent;
          color: var(--text-primary);
          border-radius: 10px;
          font-weight: 500;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-ghost:hover {
          background: var(--bg-secondary);
        }

        .btn-primary {
          padding: 10px 20px;
          border: none;
          background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
          color: white;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9375rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(45, 190, 96, 0.25);
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .welcome-text {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .welcome-text strong {
          color: var(--text-primary);
          font-weight: 600;
        }

        .menu-button {
          width: 40px;
          height: 40px;
          border: 1px solid var(--border-color);
          background: var(--card-bg);
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: color 0.2s ease;
        }

        .menu-button:focus-visible {
          outline: 2px solid #2DBE60;
          outline-offset: 2px;
        }

        .mobile-menu-button {
          display: none;
          width: 40px;
          height: 40px;
          border: none;
          background: var(--bg-secondary);
          border-radius: 10px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
        }

        @media (max-width: 1024px) {
          .navbar-links {
            display: none;
          }}

        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 16px;
          }

          .auth-buttons,
          .welcome-text,
          .menu-button,
          .calculator-btn {
            display: none;
          }

          .mobile-menu-button {
            display: flex;
          }

          .logo-text {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </motion.nav>
  );
}
