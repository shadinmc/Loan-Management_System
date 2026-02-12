import { useState, useEffect } from "react";
import LoanCard from "../../components/LoanCard";
import StatusBadge from "../../components/StatusBadge";
import LoanReview from "../loans/LoanReview";
import { Search } from "lucide-react";
import {
  getBranchLoans,
  getLoanReview
} from "../../api/loanReviewApi";
import "./LoanApplications.css";

/*  UI → BACKEND mapping */
const LOAN_TYPE_MAP = {
  "Personal Loan": "PERSONAL",
  "Vehicle Loan": "VEHICLE",
  "Business Loan": "BUSINESS",
  "Education Loan": "EDUCATION"
};

const LoanApplications = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await getBranchLoans();
      setLoans(response.data || []);
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = async (loanId) => {
    try {
      setReviewLoading(true);
      const response = await getLoanReview(loanId);
      setSelectedLoan(response.data);
    } catch (error) {
      console.error("Error loading review data:", error);
    } finally {
      setReviewLoading(false);
    }
  };

  /*  FIXED FILTER LOGIC */
  const filteredLoans = loans.filter((loan) => {
    // Loan type filter
    if (selectedType) {
      const backendType = LOAN_TYPE_MAP[selectedType];
      if (loan.loanType !== backendType) return false;
    }

    // Status filter
    if (statusFilter !== "ALL" && loan.status !== statusFilter) {
      return false;
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      const matchesName = loan.applicantName?.toLowerCase().includes(q);
      const matchesId = loan.loanId?.toLowerCase().includes(q);
      if (!matchesName && !matchesId) return false;
    }

    return true;
  });

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <>
      {/* PAGE TITLE */}
      <div className="page-title">
        <h2>Loan Applications</h2>
        <p>Review and manage loan applications by type</p>
      </div>

      {/* LOAN TYPE CARDS */}
      <div className="loan-card-grid">
        {Object.keys(LOAN_TYPE_MAP).map((type) => (
          <LoanCard
            key={type}
            title={type}
            active={selectedType === type}
            onClick={() =>
              setSelectedType(selectedType === type ? null : type)
            }
          />
        ))}
      </div>

      {/* SEARCH + FILTER */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by application #, name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="UNDER_BRANCH_REVIEW">Pending My Review</option>
          <option value="BRANCH_APPROVED">Branch Approved</option>
          <option value="BRANCH_REJECTED">Branch Rejected</option>
          <option value="ACTIVE">Active</option>
        </select>
      </div>

      {/* Review Loading Indicator */}
      {reviewLoading && (
        <p style={{ padding: "10px", color: "#4f46e5" }}>
          Loading review...
        </p>
      )}

      {/* TABLE */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Application #</th>
              <th>Loan Type</th>
              <th>Applicant</th>
              <th>EMI Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredLoans.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No loans found
                </td>
              </tr>
            )}

            {filteredLoans.map((loan) => (
              <tr key={loan.loanId}>
                <td>{loan.loanId}</td>
                <td>{loan.loanType}</td>
                <td>
                  <strong>{loan.applicantName}</strong>
                  <div className="email">{loan.email}</div>
                </td>
                <td className="amount">
                  ₹{loan.emiAmount ? loan.emiAmount.toLocaleString() : "--"}
                </td>
                <td>
                  <StatusBadge status={loan.status} />
                </td>
                <td>
                  <button
                    className="review-btn"
                    disabled={reviewLoading}
                    onClick={() => handleReviewClick(loan.loanId)}
                  >
                    👁 Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedLoan && (
        <LoanReview
          loan={selectedLoan}
          onClose={() => setSelectedLoan(null)}
          onDecisionComplete={fetchLoans}
        />
      )}
    </>
  );
};

export default LoanApplications;
