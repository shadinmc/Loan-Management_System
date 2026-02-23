import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Wallet, Banknote, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

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

  const openCalculator = () => {
    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    navigate('/', {
      state: { scrollToCalculator: true, calculatorReturnTo: returnTo }
    });
  };

  return (
    <motion.nav
      className="navbar"
      role="navigation"
      aria-label="Main navigation"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="navbar-container">
        <div className="navbar-left">
          <motion.button
            className="menu-button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            whileHover={{ scale: 1.05, borderColor: '#2DBE60' }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={20} />
          </motion.button>

          <motion.button
            className="mobile-menu-button"
            onClick={onMenuClick}
            aria-label="Open mobile menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={24} />
          </motion.button>

          {/* Logo with Lottie hover effect */}
          <Link
            to="/"
            className="navbar-brand"
            aria-label="LoanWise - Go to homepage"
          >
            <motion.div
              className="logo-icon"
              aria-hidden="true"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                viewBox="0 0 64 64"
                width="24"
                height="24"
                role="img"
                aria-label="LoanWise logo mark"
              >
                <rect x="10" y="12" width="44" height="40" rx="10" fill="none" stroke="white" strokeWidth="3" />
                <path d="M18 26h22a4 4 0 1 1 0 8H18z" fill="white" />
                <circle cx="43" cy="30" r="2.5" fill="#16a34a" />
                <path d="M20 42h24" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <path d="M20 18l9-6" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </motion.div>
            <motion.span
              className="logo-text"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              LoanWise
            </motion.span>
          </Link>
        </div>

        {/* Navigation Links */}
        <motion.div
          className="navbar-links"
          role="menubar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.a
            href="#loans-section"
            onClick={scrollToLoans}
            className="nav-link"
            role="menuitem"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="nav-link-text">Loans</span>
            <motion.span
              className="nav-link-underline"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
            />
          </motion.a>

          {isLoggedIn && (
            <>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  to="/dashboard"
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                  role="menuitem"
                >
                  Dashboard
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  to="/loan/status"
                  className={`nav-link ${isActive('/loan/status') ? 'active' : ''}`}
                  role="menuitem"
                >
                  Loan Status
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <Link
                  to="/repayments"
                  className={`nav-link ${isActive('/repayments') ? 'active' : ''}`}
                  role="menuitem"
                >
                  <Banknote size={16} />
                  EMI Repayment
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="navbar-actions"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
        <motion.button
          type="button"
          className="calculator-btn"
          onClick={openCalculator}
          aria-label="Open EMI calculator"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Calculator size={18} />
        </motion.button>

        {isLoggedIn && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Link
              to="/wallet"
              className={`nav-link wallet-link ${isActive('/wallet') ? 'active' : ''}`}
              role="menuitem"
            >
              <Wallet size={16} />
              <span className="nav-link-text">Wallet</span>
            </Link>
          </motion.div>
        )}


          {/* Auth Section */}
          {!isLoggedIn ? (
            <motion.div
              className="auth-buttons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                className="btn-ghost"
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.02, backgroundColor: 'var(--bg-secondary)' }}
                whileTap={{ scale: 0.98 }}
              >
                Login
              </motion.button>
              <motion.button
                className="btn-primary"
                onClick={() => navigate('/signup')}
                whileHover={{ scale: 1.02, y: -2, boxShadow: '0 8px 20px rgba(45, 190, 96, 0.35)' }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              type="button"
              className="user-section user-trigger"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
              onClick={() => navigate('/profile')}
              aria-label="Open user profile details"
            >
              <motion.div
                className="user-avatar"
                aria-hidden="true"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </motion.div>
              <span className="welcome-text">
                Hi, <strong>{user?.username || 'User'}</strong>
              </span>
            </motion.button>
          )}

        </motion.div>
      </div><style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: var(--navbar-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
          z-index: 300;
        }

        .navbar-container {
          width: 100%;
          max-width: none;
          margin: 0;
          height: 100%;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--text-primary);
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 16px rgba(45, 190, 96, 0.3);
          overflow: hidden;
        }

        .logo-text {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .navbar-links {
          display: flex;
          gap: 6px;
        }

        .nav-link {
          position: relative;
          padding: 10px 18px;
          border-radius: 10px;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.2s ease, background 0.2s ease;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          overflow: hidden;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: var(--bg-secondary);
        }

        .nav-link.active {
          color: #2DBE60;
          background: rgba(45, 190, 96, 0.1);
        }

        .nav-link-underline {
          position: absolute;
          bottom: 6px;
          left: 18px;
          right: 18px;
          height: 2px;
          background: #2DBE60;
          transform-origin: left;
          border-radius: 1px;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .calculator-btn {
          width: 42px;
          height: 42px;
          border: 1px solid var(--border-color);
          background: var(--card-bg);
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8B5CF6;
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .calculator-btn:hover {
          background: rgba(139, 92, 246, 0.1);
          border-color: #8B5CF6;
        }

        .auth-buttons {
          display: flex;
          gap: 10px;
        }

        .btn-ghost {
          padding: 10px 20px;
          border: none;
          background: transparent;
          color: var(--text-primary);
          border-radius: 10px;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-primary {
          padding: 10px 22px;
          border: none;
          background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
          color: white;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(45, 190, 96, 0.25);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-trigger {
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
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
          font-size: 0.9rem;
          box-shadow: 0 2px 8px rgba(45, 190, 96, 0.25);
        }

        .welcome-text {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .welcome-text strong {
          color: var(--text-primary);
          font-weight: 600;
        }

        .menu-button {
          width: 38px;
          height: 38px;
          border: 1px solid var(--border-color);
          background: var(--card-bg);
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: color 0.2s ease, border-color 0.2s ease;
        }

        .mobile-menu-button {
          display: none;
          width: 38px;
          height: 38px;
          border: none;
          background: var(--bg-secondary);
          border-radius: 12px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
        }

        @media (max-width: 1024px) {
          .navbar-links {
            display: none;}
        }

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
            font-size: 1.15rem;
          }

          .logo-icon {
            width: 40px;
            height: 40px;
          }
        }

        .navbar-links {
          margin-left: auto;
          gap: 8px;
        }

        .navbar-actions {
          margin-left: 12px;
        }

        .nav-link {
          font-size: 0.9rem;
          padding: 8px 14px;
          letter-spacing: 0.01em;
        }

        .logo-text {
          font-size: 1.25rem;
        }

        @media (max-width: 1024px) {
          .navbar-links {
            display: none;
          }
        }
      `}</style>
    </motion.nav>
  );
}

