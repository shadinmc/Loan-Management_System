import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  X, User, LogOut, Home, LayoutDashboard,
  FileText, Clock, Settings, HelpCircle
} from 'lucide-react';

/**
 * Sidebar Component
 * Slide-out navigation panel with user profile and actions
 */
export default function Sidebar({ isOpen, onClose }) {
  const { user, isLoggedIn, logout } = useAuth();
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

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* User Profile Section */}
        {isLoggedIn && (
          <div className="user-profile">
            <div className="avatar" aria-hidden="true">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <h4>{user?.username || 'User'}</h4>
              <p>{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="sidebar-nav" aria-label="Sidebar navigation">
          <button
            className={`nav-item ${isActive('/') ? 'active' : ''}`}
            onClick={() => handleNavigation('/')}
          >
            <Home size={20} />
            <span>Home</span>
          </button>

          {isLoggedIn ? (
            <>
              <button
                className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
                onClick={() => handleNavigation('/dashboard')}
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </button>

              <button
                className={`nav-item ${location.pathname.includes('/loan/apply') ? 'active' : ''}`}
                onClick={() => handleNavigation('/loan/apply')}
              >
                <FileText size={20} />
                <span>Apply for Loan</span>
              </button>

              <button
                className={`nav-item ${isActive('/loan/status') ? 'active' : ''}`}
                onClick={() => handleNavigation('/loan/status')}
              >
                <Clock size={20} />
                <span>Loan Status</span>
              </button>

              <div className="nav-divider" />

              <button
                className="nav-item"
                onClick={() => handleNavigation('/settings')}
              >
                <Settings size={20} />
                <span>Settings</span>
              </button>

              <button
                className="nav-item"
                onClick={() => handleNavigation('/help')}
              >
                <HelpCircle size={20} />
                <span>Help & Support</span>
              </button>

              <div className="nav-divider" />

              <button
                className="nav-item logout"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                className={`nav-item ${isActive('/login') ? 'active' : ''}`}
                onClick={() => handleNavigation('/login')}
              >
                <User size={20} />
                <span>Login</span>
              </button>

              <button
                className={`nav-item ${isActive('/signup') ? 'active' : ''}`}
                onClick={() => handleNavigation('/signup')}
              >
                <FileText size={20} />
                <span>Sign Up</span>
              </button>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <p>LoanWise v1.0</p>
          <p className="copyright">© 2024 All rights reserved</p>
        </div>
      </aside>

      <style>{`
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: var(--overlay-bg, rgba(0, 0, 0, 0.5));
          opacity: 0;
          visibility: hidden;
          transition: all var(--transition-base, 0.2s ease);
          z-index: var(--z-modal-backdrop, 400);
        }

        .sidebar-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .sidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 320px;
          max-width: 90vw;
          height: 100vh;
          background: var(--card-bg);
          box-shadow: var(--shadow-2xl);
          transform: translateX(100%);
          transition: transform var(--transition-slow, 0.3s ease);
          z-index: var(--z-modal, 500);
          display: flex;
          flex-direction: column;
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-5, 1.25rem) var(--space-6, 1.5rem);
          border-bottom: 1px solid var(--border-color);
        }

        .sidebar-header h3 {
          font-size: var(--text-xl, 1.25rem);
          font-weight: var(--font-semibold, 600);
          color: var(--text-primary);
        }

        .close-btn {
          width: 40px;
          height: 40px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          border-radius: var(--radius-lg, 0.75rem);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          transition: all var(--transition-fast, 0.15s ease);
        }

        .close-btn:hover {
          border-color: var(--accent-danger);
          color: var(--accent-danger);
        }

        .close-btn:focus-visible {
          outline: 2px solid var(--accent-primary);
          outline-offset: 2px;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: var(--space-4, 1rem);
          padding: var(--space-5, 1.25rem);
          background: var(--bg-secondary);
          margin: var(--space-4, 1rem);
          border-radius: var(--radius-xl, 1rem);
        }

        .avatar {
          width: 52px;
          height: 52px;
          background: var(--gradient-primary);
          border-radius: var(--radius-full, 9999px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: var(--text-xl, 1.25rem);
          font-weight: var(--font-bold, 700);
        }

        .user-info h4 {
          font-size: var(--text-base, 1rem);
          font-weight: var(--font-semibold, 600);
          color: var(--text-primary);
          margin-bottom: var(--space-1, 0.25rem);
        }

        .user-info p {
          font-size: var(--text-sm, 0.875rem);
          color: var(--text-muted);
        }

        .sidebar-nav {
          flex: 1;
          padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
          overflow-y: auto;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--space-3, 0.75rem);
          padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: var(--text-sm, 0.875rem);
          font-weight: var(--font-medium, 500);
          border-radius: var(--radius-lg, 0.75rem);
          cursor: pointer;
          transition: all var(--transition-fast, 0.15s ease);
          text-align: left;
        }

        .nav-item:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: rgba(59, 130, 246, 0.1);
          color: var(--accent-primary);
        }

        .nav-item:focus-visible {
          outline: 2px solid var(--accent-primary);
          outline-offset: 2px;
        }

        .nav-item.logout {
          color: var(--accent-danger);
        }

        .nav-item.logout:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        .nav-divider {
          height: 1px;
          background: var(--border-color);
          margin: var(--space-3, 0.75rem) 0;
        }

        .sidebar-footer {
          padding: var(--space-4, 1rem) var(--space-6, 1.5rem);
          border-top: 1px solid var(--border-color);
          text-align: center;
        }

        .sidebar-footer p {
          font-size: var(--text-xs, 0.75rem);
          color: var(--text-muted);
        }

        .sidebar-footer .copyright {
          margin-top: var(--space-1, 0.25rem);
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
