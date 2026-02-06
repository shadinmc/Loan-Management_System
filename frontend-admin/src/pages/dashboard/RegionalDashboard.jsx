import {
  Users,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./RegionalDashboard.css";

const RegionalDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* PAGE TITLE */}
      <section className="page-title">
        <h2>Regional Manager Dashboard</h2>
        <p>
          Welcome back, Priya Sharma! Monitor and approve branch-reviewed applications.
        </p>
      </section>

      {/* KPI GRID */}
      <section className="stats-grid">
        <div className="stat-card warning">
          <Users />
          <div>
            <p>Pending Your Review</p>
            <h3>1</h3>
            <span onClick={() => navigate("/regional/loan-applications")}>
              View details →
            </span>
          </div>
        </div>

        <div className="stat-card success">
          <CheckCircle />
          <div>
            <p>Final Approved</p>
            <h3>1</h3>
          </div>
        </div>

        <div className="stat-card danger">
          <XCircle />
          <div>
            <p>Final Rejected</p>
            <h3>1</h3>
          </div>
        </div>

        <div className="stat-card info">
          <DollarSign />
          <div>
            <p>Total Disbursed</p>
            <h3>₹0.14Cr</h3>
          </div>
        </div>
      </section>

      {/* SECOND ROW */}
      <section className="stats-grid">
        <div className="stat-card neutral">
          <Users />
          <div>
            <p>Branch Approvals</p>
            <h3>0</h3>
          </div>
        </div>

        <div className="stat-card neutral">
          <TrendingUp />
          <div>
            <p>Active Loans</p>
            <h3>1</h3>
          </div>
        </div>

        <div className="stat-card neutral">
          <CheckCircle />
          <div>
            <p>Closed Loans</p>
            <h3>1</h3>
          </div>
        </div>

        <div className="stat-card neutral">
          <FileText />
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
          <span
            className="link"
            onClick={() => navigate("/regional/loan-applications")}
          >
            View all →
          </span>
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
    </>
  );
};

export default RegionalDashboard;
