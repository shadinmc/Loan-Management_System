import { useState } from "react";
import { MOCK_LOANS } from "../../constants/mockLoans";
import LoanCard from "../../components/LoanCard";
import StatusBadge from "../../components/StatusBadge";
import LoanReview from "../loans/LoanReview";
import { Search } from "lucide-react";
import "./LoanApplications.css";

const LoanApplications = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filteredLoans = MOCK_LOANS.filter((loan) => {
    if (selectedType && loan.type !== selectedType) return false;
    if (statusFilter !== "ALL" && loan.status !== statusFilter) return false;

    if (
      search &&
      !loan.applicant.toLowerCase().includes(search.toLowerCase()) &&
      !loan.id.toLowerCase().includes(search.toLowerCase())
    )
      return false;

    return true;
  });

  return (
    <>
      {/* PAGE TITLE */}
      <div className="page-title">
        <h2>Loan Applications</h2>
        <p>Review and manage loan applications by type</p>
      </div>

      {/* LOAN TYPE CARDS */}
      <div className="loan-card-grid">
        {["Personal Loan", "Vehicle Loan", "Business Loan", "Education Loan"].map(
          (type) => (
            <LoanCard
              key={type}
              title={type}
              active={selectedType === type}
              onClick={() =>
                setSelectedType(selectedType === type ? null : type)
              }
            />
          )
        )}
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
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="PENDING_BRANCH_REVIEW">Pending My Review</option>
          <option value="BRANCH_APPROVED">Branch Approved</option>
          <option value="BRANCH_REJECTED">Branch Rejected</option>
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
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredLoans.map((loan) => (
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
            ))}
          </tbody>
        </table>
      </div>

      {selectedLoan && (
        <LoanReview loan={selectedLoan} onClose={() => setSelectedLoan(null)} />
      )}
    </>
  );
};

export default LoanApplications;
