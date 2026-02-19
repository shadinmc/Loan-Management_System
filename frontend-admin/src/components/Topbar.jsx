import { LogOut, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { memo, useMemo, useCallback } from "react";
import "./Topbar.css";

/**
 * Enhanced Admin Topbar Component
 * Features:
 * - Memoized for optimal performance
 * - Improved error handling and data validation
 * - Enhanced accessibility
 * - Clean separation of concerns
 * - Type-safe user role detection
 */

const ROLES = {
  REGIONAL_MANAGER: "REGIONAL_MANAGER",
  BRANCH_MANAGER: "BRANCH_MANAGER",
  USER: "USER"
};

const ROLE_LABELS = {
  [ROLES.REGIONAL_MANAGER]: "Regional Manager",
  [ROLES.BRANCH_MANAGER]: "Branch Manager",
  [ROLES.USER]: "User"
};

const PAGE_ROUTES = {
  "/dashboard": "Dashboard",
  "/loan-applications": "Loan Applications",
  "/disbursements": "Disbursements",
  "/repayments": "Repayments",
  "/kyc": "KYC Verification",
  "/closure": "Loan Closure",
  "/loan-closure": "Loan Closure"
};

/**
 * Safely parse user data from localStorage
 */
const getUserData = () => {
  try {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) return null;

    const user = JSON.parse(adminAuth);

    // Validate user object structure
    if (!user || typeof user !== "object") return null;

    return {
      username: user.username || "Admin",
      roles: Array.isArray(user.roles) ? user.roles : [],
      ...user
    };
  } catch (error) {
    console.error("Failed to parse admin auth data:", error);
    return null;
  }
};

/**
 * Get user's primary role
 */
const getUserRole = (roles = []) => {
  if (roles.includes(ROLES.REGIONAL_MANAGER)) return ROLES.REGIONAL_MANAGER;
  if (roles.includes(ROLES.BRANCH_MANAGER)) return ROLES.BRANCH_MANAGER;
  return ROLES.USER;
};

/**
 * Determine page title from current route
 */
const getPageTitle = (pathname) => {
  // Find matching route
  for (const [route, title] of Object.entries(PAGE_ROUTES)) {
    if (pathname.includes(route)) return title;
  }
  return "Control Center";
};

const Topbar = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();

  // Memoize user data - only re-compute on location change
  const user = useMemo(() => getUserData(), [location.pathname]);

  // Memoize computed values
  const userRole = useMemo(() => getUserRole(user?.roles), [user?.roles]);
  const roleLabel = useMemo(() => ROLE_LABELS[userRole], [userRole]);
  const pageTitle = useMemo(() => getPageTitle(location.pathname), [location.pathname]);
  const username = useMemo(() => user?.username || "Admin", [user?.username]);
  const userInitial = useMemo(() => username.charAt(0).toUpperCase(), [username]);

  // Determine dashboard route based on role
  const dashboardRoute = useMemo(() => {
    return userRole === ROLES.REGIONAL_MANAGER
      ? "/regional/dashboard"
      : "/admin/dashboard";
  }, [userRole]);

  // Optimized event handlers
  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("token");
      navigate("/login/admin", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      // Force navigation even if localStorage fails
      navigate("/login/admin", { replace: true });
    }
  }, [navigate]);

  const handleDashboardClick = useCallback(() => {
    navigate(dashboardRoute);
  }, [navigate, dashboardRoute]);

  // Keyboard navigation for user chip
  const handleUserChipKeyDown = useCallback((e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleDashboardClick();
    }
  }, [handleDashboardClick]);

  // Keyboard navigation for logout
  const handleLogoutKeyDown = useCallback((e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleLogout();
    }
  }, [handleLogout]);

  return (
    <header className="admin-topbar" role="banner">
      <div className="admin-topbar-left">
        <div className="admin-topbar-logo" aria-hidden="true">
          <ShieldCheck size={16} strokeWidth={2} />
        </div>
        <div className="admin-topbar-brand">
          <h1>Loan Management System</h1>
          <p>{pageTitle}</p>
        </div>
      </div>

      <nav className="admin-topbar-right" aria-label="User navigation">
        <span className="admin-role-badge" aria-label={`Current role: ${roleLabel}`}>
          {roleLabel}
        </span>

        <button
          type="button"
          className="admin-user-chip"
          onClick={handleDashboardClick}
          onKeyDown={handleUserChipKeyDown}
          aria-label={`${username}, go to dashboard`}
        >
          <span className="admin-user-avatar" aria-hidden="true">
            {userInitial}
          </span>
          <span className="admin-user-name">{username}</span>
        </button>

        <button
          type="button"
          className="admin-logout-btn"
          onClick={handleLogout}
          onKeyDown={handleLogoutKeyDown}
          aria-label="Logout from admin panel"
        >
          <LogOut size={15} strokeWidth={2} aria-hidden="true" />
          <span>Logout</span>
        </button>
      </nav>
    </header>
  );
});

Topbar.displayName = "Topbar";

export default Topbar;