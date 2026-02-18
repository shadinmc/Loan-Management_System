import { LogOut, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Topbar.css";

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("adminAuth") || "null");
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("token");
    navigate("/login/admin");
  };

  const roleLabel = user?.roles?.includes("BRANCH_MANAGER")
    ? "Branch Manager"
    : user?.roles?.includes("REGIONAL_MANAGER")
    ? "Regional Manager"
    : "User";

  const pageTitle = (() => {
    const path = location.pathname;
    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/loan-applications")) return "Loan Applications";
    if (path.includes("/disbursements")) return "Disbursements";
    if (path.includes("/repayments")) return "Repayments";
    if (path.includes("/kyc")) return "KYC Verification";
    if (path.includes("/closure") || path.includes("/loan-closure")) return "Loan Closure";
    return "Control Center";
  })();

  const username = user?.username || "Admin";

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <div className="admin-topbar-logo" aria-hidden="true">
          <ShieldCheck size={16} />
        </div>
        <div className="admin-topbar-brand">
          <h1>Loan Management System</h1>
          <p>{pageTitle}</p>
        </div>
      </div>

      <div className="admin-topbar-right">
        <span className="admin-role-badge">{roleLabel}</span>

        <button
          type="button"
          className="admin-user-chip"
          onClick={() =>
            navigate(
              user?.roles?.includes("REGIONAL_MANAGER")
                ? "/regional/dashboard"
                : "/admin/dashboard"
            )
          }
          aria-label="Go to dashboard"
        >
          <span className="admin-user-avatar">{username.charAt(0).toUpperCase()}</span>
          <span className="admin-user-name">{username}</span>
        </button>

        <button type="button" className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
