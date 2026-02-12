import {
  MdOutlinePendingActions,
  MdOutlineCancel,
  MdOutlineTrendingUp
} from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBranchLoans } from "../../api/loanReviewApi";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await getBranchLoans();
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Show only top 5 loans needing branch review
  const recentLoans = loans
    .filter(l => l.status === "UNDER_BRANCH_REVIEW")
    .slice(0, 5);

  // KPI Calculations
  const pending = loans.filter(l => l.status === "UNDER_BRANCH_REVIEW").length;
  const rejected = loans.filter(l => l.status === "BRANCH_REJECTED").length;
  const active = loans.filter(l => l.status === "ACTIVE").length;
  const approved = loans.filter(l => l.status === "BRANCH_APPROVED").length;

  const loanTypes = {
    personal: loans.filter(l => l.loanType === "PERSONAL").length,
    vehicle: loans.filter(l => l.loanType === "VEHICLE").length,
    business: loans.filter(l => l.loanType === "BUSINESS").length,
    education: loans.filter(l => l.loanType === "EDUCATION").length
  };

  const getBadgeClass = (status) => {
    if (status === "UNDER_BRANCH_REVIEW") return "badge warning";
    if (status === "BRANCH_REJECTED") return "badge danger";
    if (status === "ACTIVE") return "badge success";
    if (status === "BRANCH_APPROVED") return "badge success";
    return "badge";
  };

  const getStatusText = (status) => {
    if (status === "UNDER_BRANCH_REVIEW") return "Pending Branch Review";
    if (status === "BRANCH_REJECTED") return "Branch Rejected";
    if (status === "ACTIVE") return "Active Loan";
    if (status === "BRANCH_APPROVED") return "Branch Approved";
    return status;
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <>
      {/* PAGE TITLE */}
      <section className="page-title">
        <h2>Branch Manager Dashboard</h2>
        <p>Review and approve loan applications.</p>
      </section>

      {/* KPI CARDS */}
      <section className="stats-grid">
        <div className="stat-card warning">
          <MdOutlinePendingActions />
          <div>
            <p>Pending Review</p>
            <h3>{pending}</h3>
          </div>
        </div>

        <div className="stat-card success">
          <FiCheckCircle />
          <div>
            <p>Branch Approved</p>
            <h3>{approved}</h3>
          </div>
        </div>

        <div className="stat-card danger">
          <MdOutlineCancel />
          <div>
            <p>Branch Rejected</p>
            <h3>{rejected}</h3>
          </div>
        </div>

        <div className="stat-card info">
          <MdOutlineTrendingUp />
          <div>
            <p>Active Loans</p>
            <h3>{active}</h3>
          </div>
        </div>
      </section>

      {/* LOAN TYPES OVERVIEW */}
      <section className="card">
        <h3>Loan Types Overview</h3>

        <div className="loan-types">
          <div>
            <span>Personal Loan</span>
            <strong>{loanTypes.personal}</strong>
          </div>

          <div>
            <span>Vehicle Loan</span>
            <strong>{loanTypes.vehicle}</strong>
          </div>

          <div>
            <span>Business Loan</span>
            <strong>{loanTypes.business}</strong>
          </div>

          <div>
            <span>Education Loan</span>
            <strong>{loanTypes.education}</strong>
          </div>
        </div>
      </section>

      {/* RECENT APPLICATIONS */}
      <section className="card">
        <div className="card-header">
          <h3>Recent Applications</h3>
          <span
            className="link"
            onClick={() => navigate("/admin/loan-applications")}
            style={{ cursor: "pointer" }}
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
              <th className="amount">EMI Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {recentLoans.length > 0 ? (
              recentLoans.map((loan) => (
                <tr key={loan.loanId}>
                  <td>{loan.loanId}</td>
                  <td>{loan.applicantName}</td>
                  <td>{loan.loanType}</td>
                  <td className="amount">
                    ₹{loan.emiAmount?.toLocaleString()}
                  </td>
                  <td>
                    <span className={getBadgeClass(loan.status)}>
                      {getStatusText(loan.status)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  No loans pending review
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AdminDashboard;
