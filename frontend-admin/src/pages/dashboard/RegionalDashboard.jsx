import {
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiTrendingUp,
  FiFileText,
  FiLogOut
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./RegionalDashboard.css";

const RegionalDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/login/admin");
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">LMS</div>
          <span className="brand-text">Loan Management</span>
        </div>

        <nav>
          <a className="active"><FiTrendingUp /> Dashboard</a>
          <a><FiFileText /> Loan Applications</a>
          <a><FiDollarSign /> Disbursements</a>
          <a><FiUsers /> Audit Logs</a>
        </nav>
      </aside>

      {/* CONTENT */}
      <section className="content-area">
        {/* TOP BAR */}
        <header className="topbar">
          <h1>Loan Management System</h1>
          <div className="user-info">
            <div>
              <strong>Priya Sharma</strong>
              <span>Regional Manager</span>
            </div>
            <button className="logout" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </div>
        </header>

        {/* MAIN */}
        <main className="main-content">
          <section className="page-title">
            <h2>Regional Manager Dashboard</h2>
            <p>
              Welcome back, Priya Sharma! Monitor and approve
              branch-reviewed applications.
            </p>
          </section>

          {/* KPI GRID */}
          <section className="stats-grid">
            <div className="stat-card warning">
              <FiUsers />
              <div>
                <p>Pending Your Review</p>
                <h3>1</h3>
              </div>
            </div>

            <div className="stat-card success">
              <FiCheckCircle />
              <div>
                <p>Final Approved</p>
                <h3>1</h3>
              </div>
            </div>

            <div className="stat-card danger">
              <FiXCircle />
              <div>
                <p>Final Rejected</p>
                <h3>1</h3>
              </div>
            </div>

            <div className="stat-card info">
              <FiDollarSign />
              <div>
                <p>Total Disbursed</p>
                <h3>₹0.14 Cr</h3>
              </div>
            </div>
          </section>

          {/* SECOND ROW KPIs */}
          <section className="stats-grid">
            <div className="stat-card neutral">
              <FiUsers />
              <div>
                <p>Branch Approvals</p>
                <h3>0</h3>
              </div>
            </div>

            <div className="stat-card neutral">
              <FiTrendingUp />
              <div>
                <p>Active Loans</p>
                <h3>1</h3>
              </div>
            </div>

            <div className="stat-card neutral">
              <FiCheckCircle />
              <div>
                <p>Closed Loans</p>
                <h3>1</h3>
              </div>
            </div>

            <div className="stat-card neutral">
              <FiFileText />
              <div>
                <p>Total Applications</p>
                <h3>9</h3>
              </div>
            </div>
          </section>

          {/* PORTFOLIO */}
          <section className="card">
            <h3>Loan Portfolio Distribution</h3>
            <div className="loan-types">
              <div>
                <span>Personal Loan</span>
                <strong>3 loans</strong>
                <small>₹12.50L</small>
              </div>
              <div>
                <span>Vehicle Loan</span>
                <strong>2 loans</strong>
                <small>₹13.50L</small>
              </div>
              <div>
                <span>Business Loan</span>
                <strong>2 loans</strong>
                <small>₹35.00L</small>
              </div>
              <div>
                <span>Education Loan</span>
                <strong>2 loans</strong>
                <small>₹18.00L</small>
              </div>
            </div>
          </section>

          {/* TABLE */}
          <section className="card">
            <div className="card-header">
              <h3>Awaiting Your Approval</h3>
              <span className="link">View all →</span>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Application #</th>
                  <th>Applicant</th>
                  <th>Loan Type</th>
                  <th className="amount">Amount</th>
                  <th>Branch Decision</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>LN-2026-002</td>
                  <td>Sneha Reddy</td>
                  <td>Vehicle Loan</td>
                  <td className="amount">₹7,50,000</td>
                  <td>Approved by Rajesh Kumar</td>
                </tr>
              </tbody>
            </table>
          </section>
        </main>
      </section>
    </div>
  );
};

export default RegionalDashboard;
