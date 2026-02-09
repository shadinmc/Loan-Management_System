import { useState } from "react";
import {
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import "./Repayments.css";

/* =====================
   DUMMY DATA
   ===================== */
const REPAYMENTS = [
  {
    id: "LN-2026-004",
    name: "Ananya Iyer",
    amount: 1000000,
    tenure: 84,
    rate: "8.5%",
    progress: 33,
    paid: 1,
    pending: 2,
    status: "ACTIVE"
  },
  {
    id: "LN-2026-005",
    name: "Rahul Verma",
    amount: 750000,
    tenure: 60,
    rate: "9.2%",
    progress: 80,
    paid: 8,
    pending: 1,
    status: "PENDING"
  }
];

const normalize = (v) => (v ?? "").toLowerCase();

const Repayments = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  /* =====================
     FILTER LOGIC
     ===================== */
  const filteredData = REPAYMENTS.filter((r) => {
    if (filter !== "ALL" && r.status !== filter) return false;

    if (search) {
      const q = normalize(search);
      return (
        normalize(r.id).includes(q) ||
        normalize(r.name).includes(q)
      );
    }

    return true;
  });

  /* =====================
     KPI COUNTS
     ===================== */
  const count = (status) =>
    REPAYMENTS.filter((r) => r.status === status).length;

  return (
    <>
      {/* PAGE TITLE */}
      <div className="page-title">
        <h2>Repayment Monitoring</h2>
        <p>Track EMI schedules and monitor payment progress</p>
      </div>

      {/* KPI CARDS */}
      <div className="stats-grid">
        <div
          className={`stat-card info ${filter === "ACTIVE" ? "active" : ""}`}
          onClick={() => setFilter("ACTIVE")}
        >
          <Calendar />
          <span>Active Loans</span>
          <strong>{count("ACTIVE")}</strong>
        </div>

        <div
          className={`stat-card warning ${filter === "PENDING" ? "active" : ""}`}
          onClick={() => setFilter("PENDING")}
        >
          <AlertTriangle />
          <span>Pending Payments</span>
          <strong>{count("PENDING")}</strong>
        </div>

        <div
          className={`stat-card danger ${filter === "OVERDUE" ? "active" : ""}`}
          onClick={() => setFilter("OVERDUE")}
        >
          <AlertTriangle />
          <span>Overdue</span>
          <strong>{count("OVERDUE")}</strong>
        </div>

        <div
          className={`stat-card success ${filter === "ALL" ? "active" : ""}`}
          onClick={() => setFilter("ALL")}
        >
          <CheckCircle />
          <span>All</span>
          <strong>{REPAYMENTS.length}</strong>
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
      {filteredData.length === 0 ? (
        <div className="empty">No repayments found</div>
      ) : (
        filteredData.map((r) => (
          <div className="repayment-card" key={r.id}>
            <div className="repayment-header">
              <strong>{r.id}</strong>
              <span className="link">View EMI Schedule</span>
            </div>

            <p>{r.name}</p>

            <small>
              Loan: ₹{r.amount.toLocaleString()} • Tenure: {r.tenure} months • Rate: {r.rate}
            </small>

            <div className="progress">
              <div className="bar">
                <span style={{ width: `${r.progress}%` }} />
              </div>
              <span>{r.progress}%</span>
            </div>

            <div className="meta">
              <span className="paid">{r.paid} paid</span>
              <span className="pending">{r.pending} pending</span>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default Repayments;
