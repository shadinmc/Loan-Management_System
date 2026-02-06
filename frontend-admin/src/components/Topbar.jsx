import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("adminAuth"));

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/login/admin");
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="brand-logo">LMS</div>
        <h1>Loan Management System</h1>
      </div>

      <div className="user-info">
        <div>
          <strong>{user?.name}</strong>
          <span>
            {user?.role === "BRANCH_MANAGER"
              ? "Branch Manager"
              : "Regional Manager"}
          </span>
        </div>

        <button className="logout" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
