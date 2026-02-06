import { useState } from "react";
import {
  CreditCard,
  Car,
  Briefcase,
  GraduationCap,
  Search,
  Filter,
  Eye
} from "lucide-react";
import { MOCK_LOANS } from "../../constants/mockLoans";
import StatusBadge from "../../components/StatusBadge";
import "./RegionalLoanApplications.css";

const types = [
  { name: "Personal Loan", icon: CreditCard, color: "blue" },
  { name: "Vehicle Loan", icon: Car, color: "green" },
  { name: "Business Loan", icon: Briefcase, color: "purple" },
  { name: "Education Loan", icon: GraduationCap, color: "orange" }
];

const RegionalLoanApplications = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredLoans = MOCK_LOANS.filter(loan => {
    const allowed = [
      "PENDING_REGIONAL_REVIEW",
      "APPROVED",
      "ACTIVE",
      "CLOSED"
    ];

    if (!allowed.includes(loan.status)) return false;

    if (selectedType && loan.type !== selectedType) return false;

    if (statusFilter !== "ALL" && loan.status !== statusFilter) return false;

    if (
      search &&
      !loan.applicant.toLowerCase().includes(search.toLowerCase())
    ) return false;

    return true;
  });

  return (
    <div className="loan-app-page">
      <h2>Loan Applications</h2>
      <p>Review and manage loan applications by type</p>

      {/* CARDS */}
      <div className="loan-type-grid">
        {types.map(t => {
          const Icon = t.icon;
          return (
            <div
              key={t.name}
              className={`loan-type-card ${t.color} ${
                selectedType === t.name ? "active" : ""
              }`}
              onClick={() =>
                setSelectedType(selectedType === t.name ? null : t.name)
              }
            >
              <Icon />
              <h3>{t.name}</h3>
              <span>
                {
                  MOCK_LOANS.filter(
                    l =>
                      l.type === t.name &&
                      [
                        "PENDING_REGIONAL_REVIEW",
                        "APPROVED",
                        "ACTIVE",
                        "CLOSED"
                      ].includes(l.status)
                  ).length
                }
              </span>
              <small>applications</small>
            </div>
          );
        })}
      </div>

      {/* SEARCH + FILTER */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Search by application #, name, or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="status-filter">
          <Filter size={16} />
          <select onChange={e => setStatusFilter(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="PENDING_REGIONAL_REVIEW">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="ACTIVE">Active</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
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
              <th>Eligibility</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredLoans.map(loan => (
              <tr key={loan.id}>
                <td>{loan.id}</td>
                <td>{loan.type}</td>
                <td>
                  <strong>{loan.applicant}</strong>
                  <div className="email">{loan.email}</div>
                </td>
                <td>₹{loan.amount.toLocaleString()}</td>
                <td>
                  <span className={`eligibility ${loan.eligibility}`}>
                    {loan.eligibility}
                  </span>
                </td>
                <td>
                  <StatusBadge status={loan.status} />
                </td>
                <td>
                  <button className="review-btn">
                    <Eye size={16} /> Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegionalLoanApplications;
