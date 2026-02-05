import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, MoreVertical, Wallet } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

/**
 * Navigation Bar Component
 * Premium fintech design with solid colors
 */
export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand" aria-label="LoanWise - Go to homepage">
          <div className="logo-icon" aria-hidden="true">
            <Wallet size={20} />
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
                className="btn-ghost"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button
                className="btn-primary"
                onClick={() => navigate('/signup')}
              >
                Get Started
              </button>
            </div>
          ) : (
            <div className="user-section">
              <div className="user-avatar" aria-hidden="true">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="welcome-text">
                Hi, <strong>{user?.username || 'User'}</strong>
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
          height: 72px;
          background: var(--navbar-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-color);
          z-index: 300;
          transition: background 0.25s ease;
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
          background: #2DBE60;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
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
          border-radius: 8px;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.9375rem;
          transition: all 0.15s ease;
          text-decoration: none;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: var(--bg-secondary);
        }

        .nav-link.active {
          color: #2DBE60;
          background: #E9F8EF;
        }

        [data-theme="dark"] .nav-link.active {
          background: rgba(45, 190, 96, 0.15);
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .theme-toggle {
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
          transition: all 0.15s ease;
        }

        .theme-toggle:hover {
          border-color: #2DBE60;
          color: #2DBE60;
          background: #E9F8EF;
        }

        [data-theme="dark"] .theme-toggle:hover {
          background: rgba(45, 190, 96, 0.15);
        }

        .theme-toggle:focus-visible {
          outline: 2px solid #2DBE60;
          outline-offset: 2px;
        }

        .toggle-icon {
          display: flex;
          align-items: center;
          justify-content: center;
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
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-ghost:hover {
          background: var(--bg-secondary);
        }

        .btn-primary {
          padding: 10px 20px;
          border: none;
          background: #2DBE60;
          color: white;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-primary:hover {
          background: #25A854;
          transform: translateY(-1px);
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: #2DBE60;
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
          transition: all 0.15s ease;
        }

        .menu-button:hover {
          border-color: #2DBE60;
          color: #2DBE60;
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
          transition: all 0.15s ease;
        }

        .mobile-menu-button:hover {
          background: var(--bg-tertiary);
        }

        @media (max-width: 1024px) {
          .navbar-links {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 16px;
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
            font-size: 1.125rem;
          }
        }
      `}</style>
    </nav>
  );
}
