import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import {
  X, User, LogOut, Home, LayoutDashboard,
  FileText, Clock, Settings, HelpCircle, Sun, Moon
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, isLoggedIn, logout } = useAuth();
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

  return (
    <><div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

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

        {/* Theme Toggle */}
        <div className="theme-toggle-section">
          <span className="theme-label">Appearance</span>
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span className={`toggle-option ${theme === 'light' ? 'active' : ''}`}>
              <Sun size={16} /> Light
            </span>
            <span className={`toggle-option ${theme === 'dark' ? 'active' : ''}`}>
              <Moon size={16} /> Dark
            </span>
          </button>
        </div>

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

              <button className="nav-item" onClick={() => handleNavigation('/settings')}>
                <Settings size={20} />
                <span>Settings</span>
              </button>

              <button className="nav-item" onClick={() => handleNavigation('/help')}>
                <HelpCircle size={20} />
                <span>Help & Support</span>
              </button>

              <div className="nav-divider" />

              <button className="nav-item logout" onClick={handleLogout}>
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

        <div className="sidebar-footer">
          <p>LoanWise v1.0</p>
          <p className="copyright">© 2024 All rights reserved</p>
        </div>
      </aside>

      <style>{`
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(11, 30, 60, 0.6);
          opacity: 0;
          visibility: hidden;
          transition: all 0.25s ease;
          z-index: 400;
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
          box-shadow: -10px 0 40px rgba(16, 42, 77, 0.15);
          transform: translateX(100%);
          transition: transform 0.3s ease;
          z-index: 500;
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
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
        }

        .sidebar-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .close-btn {
          width: 40px;
          height: 40px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          transition: all 0.15s ease;
        }

        .close-btn:hover {
          border-color: #EF4444;
          color: #EF4444;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #E9F8EF;
          margin: 16px;
          border-radius: 12px;
        }

        [data-theme="dark"] .user-profile {
          background: rgba(45, 190, 96, 0.1);
        }

        .avatar {
          width: 48px;
          height: 48px;
          background: #2DBE60;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.125rem;
          font-weight: 700;
        }

        .user-info h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .user-info p {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .theme-toggle-section {
          padding: 16px;
          margin: 0 16px 8px;
          background: var(--bg-secondary);
          border-radius: 12px;
        }

        .theme-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .theme-toggle-btn {
          width: 100%;
          display: flex;
          padding: 4px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          cursor: pointer;
        }

        .toggle-option {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .toggle-option.active {
          background: #2DBE60;
          color: white;
          box-shadow: 0 2px 8px rgba(45, 190, 96, 0.3);
        }

        .sidebar-nav {
          flex: 1;
          padding: 8px 16px;
          overflow-y: auto;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.9375rem;
          font-weight: 500;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .nav-item:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: #E9F8EF;
          color: #2DBE60;
        }

        [data-theme="dark"] .nav-item.active {
          background: rgba(45, 190, 96, 0.15);
        }

        .nav-item.logout {
          color: #EF4444;
        }

        .nav-item.logout:hover {
          background: #FEE2E2;
        }

        [data-theme="dark"] .nav-item.logout:hover {
          background: rgba(239, 68, 68, 0.15);
        }

        .nav-divider {
          height: 1px;
          background: var(--border-color);
          margin: 12px 0;
        }

        .sidebar-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--border-color);
          text-align: center;
        }

        .sidebar-footer p {
          font-size: 0.75rem;
          color: var(--text-muted);
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
