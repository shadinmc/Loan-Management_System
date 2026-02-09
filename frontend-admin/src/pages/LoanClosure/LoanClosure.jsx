import { useState } from "react";
import { Search, Lock, CheckCircle } from "lucide-react";
import "./LoanClosure.css";

/* =====================
   DUMMY DATA
   ===================== */
const LOANS = [
  {
    id: "LN-2026-004",
    name: "Ananya Iyer",
    amount: 1000000,
    paid: 970149,
    outstanding: 0,
    emis: "84 / 84",
    status: "CLOSED"
  },
  {
    id: "LN-2026-006",
    name: "Karthik R",
    amount: 800000,
    paid: 720000,
    outstanding: 80000,
    emis: "18 / 24",
    status: "ELIGIBLE"
  }
];

const normalize = (v) => (v ?? "").toLowerCase();

const LoanClosure = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  /* =====================
     FILTER LOGIC
     ===================== */
  const filteredLoans = LOANS.filter((l) => {
    if (filter !== "ALL" && l.status !== filter) return false;

    if (search) {
      const q = normalize(search);
      return (
        normalize(l.id).includes(q) ||
        normalize(l.name).includes(q)
      );
    }

    return true;
  });

  /* =====================
     KPI COUNTS
     ===================== */
  const count = (status) =>
    LOANS.filter((l) => l.status === status).length;

  return (
    <>
      {/* PAGE TITLE */}
      <div className="page-title">
        <h2>Loan Closure</h2>
        <p>Verify full repayment and close completed loans</p>
      </div>

      {/* KPI CARDS */}
      <div className="stats-grid">
        <div
          className={`stat-card info ${filter === "ELIGIBLE" ? "active" : ""}`}
          onClick={() => setFilter("ELIGIBLE")}
        >
          <Lock />
          <span>Eligible for Closure</span>
          <strong>{count("ELIGIBLE")}</strong>
        </div>

        <div
          className={`stat-card success ${filter === "CLOSED" ? "active" : ""}`}
          onClick={() => setFilter("CLOSED")}
        >
          <CheckCircle />
          <span>Fully Repaid</span>
          <strong>{count("CLOSED")}</strong>
        </div>

        <div
          className={`stat-card neutral ${filter === "ALL" ? "active" : ""}`}
          onClick={() => setFilter("ALL")}
        >
          <CheckCircle />
          <span>All Loans</span>
          <strong>{LOANS.length}</strong>
        </div>
      </div>

      {/* SEARCH */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search by application # or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* CARDS */}
      {filteredLoans.length === 0 ? (
        <div className="empty">No loans available for closure</div>
      ) : (
        filteredLoans.map((l) => (
          <div className="closure-card" key={l.id}>
            <div className="closure-header">
              <strong>{l.id}</strong>
              <span
                className={`badge ${
                  l.status === "CLOSED" ? "success" : "warning"
                }`}
              >
                {l.status === "CLOSED"
                  ? "Closed"
                  : "Repayment In Progress"}
              </span>
            </div>

            <p>{l.name}</p>

            <div className="closure-grid">
              <div>
                <label>Loan Amount</label>
                <strong>₹{l.amount.toLocaleString()}</strong>
              </div>

              <div>
                <label>Total Paid</label>
                <strong className="success">
                  ₹{l.paid.toLocaleString()}
                </strong>
              </div>

              <div>
                <label>Outstanding</label>
                <strong
                  className={l.outstanding === 0 ? "success" : "danger"}
                >
                  ₹{l.outstanding.toLocaleString()}
                </strong>
              </div>

              <div>
                <label>EMIs</label>
                <strong>{l.emis}</strong>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default LoanClosure;
