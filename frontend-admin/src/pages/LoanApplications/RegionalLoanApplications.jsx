import { useState } from "react";
import { Search } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import RegionalLoanReview from "../loans/RegionalLoanReview";
import "./RegionalLoanApplications.css";

/* ===========================
   DUMMY DATA
   =========================== */
const REGIONAL_LOANS = [
  {
    id: "LN-2026-002",
    applicant: "Sneha Reddy",
    email: "sneha.r@email.com",
    type: "Vehicle Loan",
    amount: 750000,
    status: "PENDING_REGIONAL_REVIEW"
  },
  {
    id: "LN-2026-003",
    applicant: "Arjun Rao",
    email: "arjun.rao@email.com",
    type: "Personal Loan",
    amount: 500000,
    status: "APPROVED"
  },
  {
    id: "LN-2026-004",
    applicant: "Meena Patel",
    email: "meena.p@email.com",
    type: "Business Loan",
    amount: 1200000,
    status: "REJECTED"
  }
];

const LOAN_TYPES = [
  "Personal Loan",
  "Vehicle Loan",
  "Business Loan",
  "Education Loan"
];

const RegionalLoanApplications = () => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  /* ===========================
     FILTER LOGIC
     =========================== */
  const filteredLoans = REGIONAL_LOANS.filter((loan) => {
    // Card filter
    if (selectedType && loan.type !== selectedType) return false;

    // Status filter
    if (statusFilter !== "ALL" && loan.status !== statusFilter) return false;

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      const applicant = loan.applicant?.toLowerCase() || "";
      const id = loan.id?.toLowerCase() || "";

      if (!applicant.includes(q) && !id.includes(q)) return false;
    }

    return true;
  });

  return (
    <>
      {/* PAGE TITLE */}
      <div className="page-title">
        <h2>Loan Applications</h2>
        <p>Final approval by Regional Manager</p>
      </div>

      {/* LOAN TYPE CARDS */}
      <div className="loan-card-grid">
        {LOAN_TYPES.map((type) => (
          <div
            key={type}
            className={`loan-type-card ${
              selectedType === type ? "active" : ""
            }`}
            onClick={() =>
              setSelectedType(selectedType === type ? null : type)
            }
          >
            {type}
          </div>
        ))}
      </div>

      {/* SEARCH + STATUS FILTER */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by application # or applicant"
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
          <option value="PENDING_REGIONAL_REVIEW">Pending My Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Application #</th>
              <th>Loan Type</th>
              <th>Applicant</th>
              <th className="amount">Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredLoans.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  No applications found
                </td>
              </tr>
            ) : (
              filteredLoans.map((loan) => (
                <tr key={loan.id}>
                  <td>{loan.id}</td>
                  <td>{loan.type}</td>
                  <td>
                    <strong>{loan.applicant}</strong>
                    <div className="email">{loan.email}</div>
                  </td>
                  <td className="amount">
                    ₹{loan.amount.toLocaleString()}
                  </td>
                  <td>
                    <StatusBadge status={loan.status} />
                  </td>
                  <td>
                    <button
                      className="review-btn"
                      onClick={() => setSelectedLoan(loan)}
                    >
                      👁 Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* REVIEW MODAL */}
      {selectedLoan && (
        <RegionalLoanReview
          loan={selectedLoan}
          onClose={() => setSelectedLoan(null)}
        />
      )}
    </>
  );
};

export default RegionalLoanApplications;
