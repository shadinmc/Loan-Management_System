import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, MoreVertical, Wallet } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

/**
 * Navigation Bar Component
 * Responsive navbar with theme toggle, user menu, and accessibility support
 */
export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current path matches
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand" aria-label="LoanWise - Go to homepage">
          <div className="logo-icon" aria-hidden="true">
            <Wallet size={22} />
          </div>
          <span className="logo-text">LoanWise</span>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="navbar-links" role="menubar">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            role="menuitem"
          >
            Loans
          </Link>

          {isLoggedIn && (
            <>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                role="menuitem"
              >
                Dashboard
              </Link>
              <Link
                to="/loan/status"
                className={`nav-link ${isActive('/loan/status') ? 'active' : ''}`}
                role="menuitem"
              >
                Loan Status
              </Link>
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <div className="toggle-icon">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </div>
          </button>

          {/* Auth Buttons or User Info */}
          {!isLoggedIn ? (
            <div className="auth-buttons">
              <button
                className="btn-secondary"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button
                className="btn-primary"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="user-section">
              <div className="user-avatar" aria-hidden="true">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="welcome-text">
                Welcome, <strong>{user?.username || 'User'}</strong>
              </span>
            </div>
          )}

          {/* Three-dot Menu Button */}
          <button
            className="menu-button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <MoreVertical size={20} />
          </button>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={onMenuClick}
            aria-label="Open mobile menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: var(--navbar-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          z-index: var(--z-sticky, 200);
          transition: all var(--transition-base, 0.2s ease);
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          height: 100%;
          padding: 0 var(--space-6, 1.5rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: var(--space-3, 0.75rem);
          text-decoration: none;
          color: var(--text-primary);
        }

        .logo-icon {
          width: 42px;
          height: 42px;
          background: var(--gradient-primary);
          border-radius: var(--radius-lg, 0.75rem);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .logo-text {
          font-size: var(--text-xl, 1.25rem);
          font-weight: var(--font-bold, 700);
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .navbar-links {
          display: flex;
          gap: var(--space-2, 0.5rem);
        }

        .nav-link {
          padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
          border-radius: var(--radius-lg, 0.75rem);
          color: var(--text-secondary);
          font-weight: var(--font-medium, 500);
          font-size: var(--text-sm, 0.875rem);
          transition: all var(--transition-fast, 0.15s ease);
          text-decoration: none;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: var(--bg-tertiary);
        }

        .nav-link.active {
          color: var(--accent-primary);
          background: rgba(59, 130, 246, 0.1);
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: var(--space-3, 0.75rem);
        }

        .theme-toggle {
          width: 42px;
          height: 42px;
          border: 1px solid var(--border-color);
          background: var(--card-bg);
          border-radius: var(--radius-lg, 0.75rem);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          transition: all var(--transition-fast, 0.15s ease);
        }

        .theme-toggle:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .theme-toggle:focus-visible {
          outline: 2px solid var(--accent-primary);
          outline-offset: 2px;
        }

        .toggle-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-buttons {
          display: flex;
          gap: var(--space-2, 0.5rem);
        }

        .btn-secondary {
          padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
          border: 1px solid var(--border-color);
          background: transparent;
          color: var(--text-primary);
          border-radius: var(--radius-lg, 0.75rem);
          font-weight: var(--font-medium, 500);
          font-size: var(--text-sm, 0.875rem);
          cursor: pointer;
          transition: all var(--transition-fast, 0.15s ease);
        }

        .btn-secondary:hover {
          background: var(--bg-tertiary);
          border-color: var(--text-muted);
        }

        .btn-primary {
          padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
          border: none;
          background: var(--gradient-primary);
          color: white;
          border-radius: var(--radius-lg, 0.75rem);
          font-weight: var(--font-medium, 500);
          font-size: var(--text-sm, 0.875rem);
          cursor: pointer;
          transition: all var(--transition-fast, 0.15s ease);
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: var(--space-3, 0.75rem);
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: var(--gradient-primary);
          color: white;
          border-radius: var(--radius-full, 9999px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--font-semibold, 600);
          font-size: var(--text-sm, 0.875rem);
        }

        .welcome-text {
          color: var(--text-secondary);
          font-size: var(--text-sm, 0.875rem);
        }

        .welcome-text strong {
          color: var(--accent-primary);
          font-weight: var(--font-semibold, 600);
        }

        .menu-button {
          width: 42px;
          height: 42px;
          border: 1px solid var(--border-color);
          background: var(--card-bg);
          border-radius: var(--radius-lg, 0.75rem);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          transition: all var(--transition-fast, 0.15s ease);
        }

        .menu-button:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .menu-button:focus-visible {
          outline: 2px solid var(--accent-primary);
          outline-offset: 2px;
        }

        .mobile-menu-button {
          display: none;
          width: 42px;
          height: 42px;
          border: none;
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg, 0.75rem);
          cursor: pointer;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          transition: all var(--transition-fast, 0.15s ease);
        }

        .mobile-menu-button:hover {
          background: var(--bg-secondary);
        }

        @media (max-width: 1024px) {
          .navbar-links {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 var(--space-4, 1rem);
          }

          .auth-buttons,
          .welcome-text,
          .menu-button {
            display: none;
          }

          .mobile-menu-button {
            display: flex;
          }

          .logo-text {
            font-size: var(--text-lg, 1.125rem);
          }
        }
      `}</style>
    </nav>
  );
}
