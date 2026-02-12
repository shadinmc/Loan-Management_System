import { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Filter, Search, Download, Calendar, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WalletTransactionPage() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('last30');

  const transactions = [
    { id: 1, type: 'credit', amount: 10000, description: 'Added to wallet', category: 'Top-up', date: '2024-01-15T10:30:00', reference: 'TXN001234' },
    { id: 2, type: 'debit', amount: 5000, description: 'EMI Payment - Personal Loan', category: 'EMI', date: '2024-01-14T14:20:00', reference: 'TXN001235' },
    { id: 3, type: 'credit', amount: 15000, description: 'Loan Disbursement', category: 'Disbursement', date: '2024-01-10T09:15:00', reference: 'TXN001236' },
    { id: 4, type: 'debit', amount: 2500, description: 'EMI Payment - Vehicle Loan', category: 'EMI', date: '2024-01-05T16:45:00', reference: 'TXN001237' },
    { id: 5, type: 'credit', amount: 7500, description: 'Refund - Processing Fee', category: 'Refund', date: '2024-01-02T11:00:00', reference: 'TXN001238' },
    { id: 6, type: 'debit', amount: 1000, description: 'Late Fee', category: 'Fee', date: '2024-01-01T08:30:00', reference: 'TXN001239' },
  ];

  const filteredTransactions = transactions.filter(txn => {
    if (filter !== 'all' && txn.type !== filter) return false;
    if (searchQuery && !txn.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalCredit = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="transaction-page">
      <div className="transaction-container">
        <div className="page-header">
          <div>
            <h1>Transaction History</h1>
            <p>View and manage all your wallet transactions</p>
          </div>
          <button className="export-btn">
            <Download size={18} />
            Export
          </button>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card credit">
            <ArrowDownLeft size={24} />
            <div>
              <span className="summary-label">Total Credits</span>
              <span className="summary-value">₹{totalCredit.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="summary-card debit">
            <ArrowUpRight size={24} />
            <div>
              <span className="summary-label">Total Debits</span>
              <span className="summary-value">₹{totalDebit.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="summary-card net">
            <div className="net-icon">₹</div>
            <div>
              <span className="summary-label">Net Balance</span>
              <span className="summary-value">₹{(totalCredit - totalDebit).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'credit' ? 'active' : ''}`}
              onClick={() => setFilter('credit')}
            >
              Credits
            </button>
            <button
              className={`filter-btn ${filter === 'debit' ? 'active' : ''}`}
              onClick={() => setFilter('debit')}
            >
              Debits
            </button>
          </div>

          <div className="date-filter">
            <Calendar size={16} />
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <ChevronDown size={16} />
          </div>
        </div>

        {/* Transaction List */}
        <div className="transaction-list">
          <div className="list-header">
            <span>Transaction</span>
            <span>Category</span>
            <span>Reference</span>
            <span>Date & Time</span>
            <span>Amount</span>
          </div>

          {filteredTransactions.map((txn, idx) => (
            <motion.div
              key={txn.id}
              className="transaction-row"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <div className="txn-info">
                <div className={`txn-icon ${txn.type}`}>
                  {txn.type === 'credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <span className="txn-description">{txn.description}</span>
              </div>
              <span className="txn-category">{txn.category}</span>
              <span className="txn-reference">{txn.reference}</span>
              <span className="txn-date">
                {new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                <br />
                <small>{new Date(txn.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</small>
              </span>
              <span className={`txn-amount ${txn.type}`}>
                {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
              </span>
            </motion.div>
          ))}

          {filteredTransactions.length === 0 && (
            <div className="no-results">
              <p>No transactions found</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .transaction-page {
          min-height: 100vh;
          padding: 100px 24px 60px;
          background: var(--bg-primary);
        }

        .transaction-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .page-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .page-header p {
          color: var(--text-secondary);
          font-size: 0.9375rem;
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .export-btn:hover {
          border-color: #2DBE60;
          color: #2DBE60;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .summary-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
        }

        .summary-card.credit {
          border-left: 4px solid #2DBE60;
        }

        .summary-card.credit svg {
          color: #2DBE60;
        }

        .summary-card.debit {
          border-left: 4px solid #EF4444;
        }

        .summary-card.debit svg {
          color: #EF4444;
        }

        .summary-card.net {
          border-left: 4px solid #3B82F6;
        }

        .net-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #3B82F6;
        }

        .summary-label {
          display: block;
          font-size: 0.8125rem;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .summary-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .filters-section {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 200px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 10px;
        }

        .search-box svg {
          color: var(--text-muted);
        }

        .search-box input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 0.9375rem;
          color: var(--text-primary);
        }

        .search-box input::placeholder {
          color: var(--text-muted);
        }

        .filter-group {
          display: flex;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          overflow: hidden;
        }

        .filter-btn {
          padding: 12px 20px;
          background: none;
          border: none;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          background: var(--bg-secondary);
        }

        .filter-btn.active {
          background: #2DBE60;
          color: white;
        }

        .date-filter {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 10px;
        }

        .date-filter svg {
          color: var(--text-muted);
        }

        .date-filter select {
          background: none;
          border: none;
          outline: none;
          font-size: 0.875rem;
          color: var(--text-primary);
          cursor: pointer;
          appearance: none;
        }

        .transaction-list {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
        }

        .list-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          gap: 16px;
          padding: 16px 24px;
          background: var(--bg-secondary);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .transaction-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          gap: 16px;
          padding: 16px 24px;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          transition: background 0.2s ease;
        }

        .transaction-row:last-child {
          border-bottom: none;
        }

        .transaction-row:hover {
          background: var(--bg-secondary);
        }

        .txn-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .txn-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;}

        .txn-icon.credit {
          background: rgba(45, 190, 96, 0.1);
          color: #2DBE60;
        }

        .txn-icon.debit {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
        }

        .txn-description {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .txn-category {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .txn-reference {
          font-size: 0.8125rem;
          color: var(--text-muted);
          font-family: monospace;
        }

        .txn-date {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .txn-date small {
          color: var(--text-muted);
        }

        .txn-amount {
          font-size: 0.9375rem;
          font-weight: 600;
          text-align: right;
        }

        .txn-amount.credit {
          color: #2DBE60;
        }

        .txn-amount.debit {
          color: #EF4444;
        }

        .no-results {
          padding: 48px;
          text-align: center;
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          .list-header {
            display: none;
          }

          .transaction-row {
            grid-template-columns: 1fr auto;
          }

          .txn-category,
          .txn-reference,
          .txn-date {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .summary-cards {
            grid-template-columns: 1fr;
          }

          .page-header {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}
