import { useState } from "react";
import {
  Eye,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  X
} from "lucide-react";
import "./Repayments.css";

/* =======================
   DUMMY DATA
======================= */
const LOANS = [
  {
    id: "LN-2026-007",
    name: "Kavya Menon",
    principal: 850000,
    tenure: 72,
    rate: 9,
    emi: 14683,
    paidEmis: 4,
    totalEmis: 72,
    nextEmiDate: "30 Jan 2026",
    overdueDays: 13,
    lateFee: 1300,
    status: "OVERDUE",
    schedule: [
      {
        no: 1,
        due: "15 Jan 2024",
        emi: 15322,
        principal: 8947,
        interest: 6375,
        balance: 841053,
        status: "PAID",
        paidOn: "18 Jan 2024",
        lateFee: "-"
      },
      {
        no: 2,
        due: "15 Feb 2024",
        emi: 15322,
        principal: 9014,
        interest: 6308,
        balance: 832039,
        status: "PAID",
        paidOn: "16 Feb 2024",
        lateFee: "-"
      },
      {
        no: 5,
        due: "15 May 2024",
        emi: 15322,
        principal: 9218,
        interest: 6104,
        balance: 804589,
        status: "OVERDUE",
        paidOn: "-",
        lateFee: "₹5,000"
      }
    ]
  },
{
  id: "LN-2026-012",
  name: "Sneha Patel",
  principal: 650000,
  tenure: 60,
  rate: 8.9,
  emi: 13520,
  paidEmis: 10,
  totalEmis: 60,
  nextEmiDate: "05 Mar 2026",
  overdueDays: 0,
  lateFee: 0,
  status: "PENDING",
  schedule: [
    {
      no: 1,
      due: "05 Jan 2025",
      emi: 13520,
      principal: 4860,
      interest: 8660,
      balance: 645140,
      status: "PAID",
      paidOn: "05 Jan 2025",
      lateFee: "-"
    },
    {
      no: 2,
      due: "05 Feb 2025",
      emi: 13520,
      principal: 4905,
      interest: 8615,
      balance: 640235,
      status: "PAID",
      paidOn: "05 Feb 2025",
      lateFee: "-"
    },
    {
      no: 11,
      due: "05 Mar 2026",
      emi: 13520,
      principal: 5240,
      interest: 8280,
      balance: 594120,
      status: "DUE",
      paidOn: "-",
      lateFee: "-"
    }
  ]
},
{
  id: "LN-2025-099",
  name: "Arun Kumar",
  principal: 400000,
  tenure: 36,
  rate: 7.5,
  emi: 12450,
  paidEmis: 36,
  totalEmis: 36,
  nextEmiDate: "-",
  overdueDays: 0,
  lateFee: 0,
  status: "COMPLETED",
  schedule: [
    {
      no: 1,
      due: "10 Jan 2022",
      emi: 12450,
      principal: 4500,
      interest: 7950,
      balance: 395500,
      status: "PAID",
      paidOn: "10 Jan 2022",
      lateFee: "-"
    },
    {
      no: 18,
      due: "10 Jun 2023",
      emi: 12450,
      principal: 6120,
      interest: 6330,
      balance: 189380,
      status: "PAID",
      paidOn: "10 Jun 2023",
      lateFee: "-"
    },
    {
      no: 36,
      due: "10 Dec 2024",
      emi: 12450,
      principal: 12210,
      interest: 240,
      balance: 0,
      status: "PAID",
      paidOn: "10 Dec 2024",
      lateFee: "-"
    }
  ]
}

];

const RepaymentMonitoring = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedLoan, setSelectedLoan] = useState(null);

  /* =======================
     SEARCH + FILTER LOGIC
  ======================= */
  const filteredLoans = LOANS.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL" || l.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2>Repayment Monitoring</h2>
          <p>Track EMI schedules, payment progress, and manage overdue accounts</p>
        </div>
        <button className="export-btn">Export Report</button>
      </div>

      {/* KPI CARDS (unchanged) */}
      <div className="kpi-grid">
        <div className="kpi success">
          <CheckCircle /> Active Loans <strong>3</strong>
        </div>
        <div className="kpi warning">
          <Clock /> Pending Payment <strong>1</strong>
        </div>
        <div className="kpi danger">
          <AlertTriangle /> Overdue <strong>3</strong>
        </div>
        <div className="kpi info">
          <DollarSign /> Total Outstanding <strong>₹81,98,690</strong>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="table-filter">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search by Loan ID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="status-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="OVERDUE">Overdue</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Borrower</th>
              <th>Loan Details</th>
              <th>EMI Progress</th>
              <th>Next EMI</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredLoans.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty">
                  No results found
                </td>
              </tr>
            ) : (
              filteredLoans.map((l) => (
                <tr
                  key={l.id}
                  className={l.status === "OVERDUE" ? "row-overdue" : ""}
                >
                  <td>
                    <strong>{l.name}</strong>
                    <div className="muted">{l.id}</div>
                  </td>

                  <td>
                    ₹{l.principal.toLocaleString()} <br />
                    {l.tenure} months @ {l.rate}%
                    <div className="muted">EMI: ₹{l.emi}</div>
                  </td>

                  <td>
                    <div className="progress-bar">
                      <span
                        style={{
                          width: `${(l.paidEmis / l.totalEmis) * 100}%`
                        }}
                      />
                    </div>
                    {l.paidEmis}/{l.totalEmis} EMIs
                  </td>

                  <td>
                    {l.nextEmiDate}
                    {l.overdueDays && (
                      <div className="danger-text">
                        {l.overdueDays} days overdue
                      </div>
                    )}
                  </td>

                  <td>
                    <span className={`badge ${l.status.toLowerCase()}`}>
                      {l.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => setSelectedLoan(l)}
                    >
                      <Eye />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedLoan && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>EMI Schedule – {selectedLoan.id}</h3>
              <X onClick={() => setSelectedLoan(null)} />
            </div>

            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Due Date</th>
                  <th>EMI</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Late Fee</th>
                </tr>
              </thead>
              <tbody>
                {selectedLoan.schedule.map((e) => (
                  <tr
                    key={e.no}
                    className={e.status === "OVERDUE" ? "row-overdue" : ""}
                  >
                    <td>{e.no}</td>
                    <td>{e.due}</td>
                    <td>₹{e.emi}</td>
                    <td>₹{e.principal}</td>
                    <td>₹{e.interest}</td>
                    <td>₹{e.balance}</td>
                    <td>{e.status}</td>
                    <td>{e.lateFee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default RepaymentMonitoring;
