import {
  FiHome,
  FiFileText,
  FiDollarSign,
  FiRepeat,
  FiCheckCircle,
  FiLogOut
} from "react-icons/fi";
import {
  MdOutlinePendingActions,
  MdOutlineCancel,
  MdOutlineTrendingUp
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";
import { login } from "../../utils/auth";

import "./AdminDashboard.css";
import { NavLink } from "react-router-dom";


const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login/admin");
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">LMS</div>
          <span className="brand-text">Loan System</span>
        </div>

        <nav>
                  <NavLink to="/admin/dashboard" className="nav-link">
                    <FiHome /> Dashboard
                  </NavLink>
                  <NavLink to="#" className="nav-link">
                    <FiFileText /> Loan Applications
                  </NavLink>
                  <NavLink to="#" className="nav-link">
                    <FiDollarSign /> Disbursements
                  </NavLink>
                  <NavLink to="#" className="nav-link">
                    <FiRepeat /> Repayments
                  </NavLink>
                  <NavLink to="#" className="nav-link">
                    <FiCheckCircle /> Loan Closure
                  </NavLink>
                </nav>
      </aside>

      {/* RIGHT SIDE */}
      <section className="content-area">
        {/* TOP BAR */}
        <header className="topbar">
          <h1>Loan Management System</h1>
          <div className="user-info">
            <div>
              <strong>Rajesh Kumar</strong>
              <span>Branch Manager</span>
            </div>
            <button className="logout" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </div>
        </header>

        {/* MAIN */}
        <main className="main-content">
          <section className="page-title">
            <h2>Branch Manager Dashboard</h2>
            <p>Review and approve loan applications.</p>
          </section>

          {/* KPI */}
          <section className="stats-grid">
            <div className="stat-card warning">
              <MdOutlinePendingActions />
              <div>
                <p>Pending Review</p>
                <h3>3</h3>
              </div>
            </div>

            <div className="stat-card success">
              <FiCheckCircle />
              <div>
                <p>Branch Approved</p>
                <h3>0</h3>
              </div>
            </div>

            <div className="stat-card danger">
              <MdOutlineCancel />
              <div>
                <p>Branch Rejected</p>
                <h3>1</h3>
              </div>
            </div>

            <div className="stat-card info">
              <MdOutlineTrendingUp />
              <div>
                <p>Active Loans</p>
                <h3>1</h3>
              </div>
            </div>
          </section>

          {/* LOAN TYPES */}
          <section className="card">
            <h3>Loan Types Overview</h3>
            <div className="loan-types">
              <div><span>Personal Loan</span><strong>3</strong></div>
              <div><span>Vehicle Loan</span><strong>2</strong></div>
              <div><span>Business Loan</span><strong>2</strong></div>
              <div><span>Education Loan</span><strong>2</strong></div>
            </div>
          </section>

          {/* TABLE */}
          <section className="card">
            <div className="card-header">
              <h3>Recent Applications</h3>
              <span className="link">View all →</span>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Application #</th>
                  <th>Applicant</th>
                  <th>Loan Type</th>
                  <th className="amount">Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>LN-2026-006</td>
                  <td>Meera Nair</td>
                  <td>Vehicle Loan</td>
                  <td className="amount">₹6,00,000</td>
                  <td><span className="badge warning">Pending Branch Review</span></td>
                </tr>
                <tr>
                  <td>LN-2026-008</td>
                  <td>Kavita Shah</td>
                  <td>Business Loan</td>
                  <td className="amount">₹15,00,000</td>
                  <td><span className="badge warning">Pending Branch Review</span></td>
                </tr>
                <tr>
                  <td>LN-2026-005</td>
                  <td>Rahul Verma</td>
                  <td>Personal Loan</td>
                  <td className="amount">₹3,00,000</td>
                  <td><span className="badge danger">Branch Rejected</span></td>
                </tr>
              </tbody>
            </table>
          </section>
        </main>
      </section>
    </div>
  );
};

export default AdminDashboard;
