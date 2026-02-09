import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("adminAuth"));

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

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="brand-logo">LMS</div>
        <h1>Loan Management System</h1>
      </div>

      <div className="user-info">
        <div>
{/*           <strong>{user?.username}</strong> */}
          <span>{roleLabel}</span>
        </div>

        <button className="logout" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
