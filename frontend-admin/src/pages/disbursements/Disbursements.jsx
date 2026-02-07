import { useState } from "react";
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCcw
} from "lucide-react";
import "./Disbursements.css";

const DISBURSEMENTS = [
  {
    id: "LN-2026-003",
    applicant: "Vikram Singh",
    amount: 2000000,
    bank: "SBI",
    account: "****1234",
    ifsc: "SBIN001234",
    date: "2/5/2026, 3:30 PM",
    status: "PENDING",
    txnId: "-"
  },
  {
    id: "LN-2026-004",
    applicant: "Ananya Iyer",
    amount: 1000000,
    bank: "HDFC",
    account: "****5678",
    ifsc: "HDFC0005678",
    date: "1/28/2026, 9:30 PM",
    status: "COMPLETED",
    txnId: "TXN20260128161500"
  }
];

const normalize = (v) => (v ?? "").toLowerCase();

const Disbursements = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  /* =====================
     FILTERED DATA
     ===================== */
  const filteredData = DISBURSEMENTS.filter((d) => {
    if (statusFilter !== "ALL" && d.status !== statusFilter) return false;

    if (search) {
      const q = normalize(search);
      return (
        normalize(d.id).includes(q) ||
        normalize(d.applicant).includes(q) ||
        normalize(d.txnId).includes(q)
      );
    }

    return true;
  });

  /* =====================
     KPI COUNTS
     ===================== */
  const count = (status) =>
    DISBURSEMENTS.filter((d) => d.status === status).length;

  return (
    <>
      {/* PAGE TITLE */}
      <div className="page-title">
        <h2>Disbursement Management</h2>
        <p>Manage loan disbursements and monitor transaction status</p>
      </div>

      {/* KPI CARDS */}
      <div className="stats-grid">
        <div
          className={`stat-card warning ${statusFilter === "PENDING" ? "active" : ""}`}
          onClick={() => setStatusFilter("PENDING")}
        >
          <Clock />
          <span>Pending</span>
          <strong>{count("PENDING")}</strong>
        </div>

        <div
          className={`stat-card info ${statusFilter === "IN_PROGRESS" ? "active" : ""}`}
          onClick={() => setStatusFilter("IN_PROGRESS")}
        >
          <RefreshCcw />
          <span>In Progress</span>
          <strong>{count("IN_PROGRESS")}</strong>
        </div>

        <div
          className={`stat-card success ${statusFilter === "COMPLETED" ? "active" : ""}`}
          onClick={() => setStatusFilter("COMPLETED")}
        >
          <CheckCircle />
          <span>Completed</span>
          <strong>{count("COMPLETED")}</strong>
        </div>

        <div
          className={`stat-card danger ${statusFilter === "FAILED" ? "active" : ""}`}
          onClick={() => setStatusFilter("FAILED")}
        >
          <XCircle />
          <span>Failed</span>
          <strong>{count("FAILED")}</strong>
        </div>
      </div>

      {/* SEARCH */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search by application #, name or transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Loan Details</th>
              <th>Amount</th>
              <th>Bank Details</th>
              <th>Scheduled Date</th>
              <th>Status</th>
              <th>Transaction ID</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty">
                  No disbursements found
                </td>
              </tr>
            ) : (
              filteredData.map((d) => (
                <tr key={d.id}>
                  <td>
                    <strong>{d.id}</strong>
                    <div className="sub">{d.applicant}</div>
                  </td>

                  <td>₹{d.amount.toLocaleString()}</td>

                  <td>
                    {d.account}
                    <div className="sub">{d.ifsc}</div>
                  </td>

                  <td>{d.date}</td>

                  <td>
                    <span className={`badge ${d.status.toLowerCase()}`}>
                      {d.status}
                    </span>
                  </td>

                  <td>{d.txnId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Disbursements;
