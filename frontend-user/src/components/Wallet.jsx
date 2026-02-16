// src/components/Wallet.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet as WalletIcon, Plus, Minus, ArrowUpRight, ArrowDownLeft,
  CreditCard, Building2, RefreshCw, TrendingUp, Clock, CheckCircle,
  ChevronRight, Filter, Search, Download, IndianRupee
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import LottieAnimation from './LottieAnimation';

export default function Wallet() {
  const {
    balance,
    transactions,
    addMoney,
    withdrawMoney,
    isLoading,
    page,
    setPage,
    totalPages,
    totalElements
  } = useWallet();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter(txn => {
    const matchesFilter = filterType === 'all' || txn.type === filterType;
    const matchesSearch = txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          txn.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    totalCredit: transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0),
    totalDebit: transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0),
    thisMonth: transactions.filter(t => {
      const txnDate = new Date(t.date);
      const now = new Date();
      return txnDate.getMonth() === now.getMonth() && txnDate.getFullYear() === now.getFullYear();
    }).length
  };

  if (isLoading) {
    return (
      <div className="wallet-loading">
        <LottieAnimation
          src="https://lottie.host/embed/wallet-loading.json"
          style={{ width: 100, height: 100 }}
        />
        <p>Loading wallet...</p>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      {/* Balance Card */}
      <motion.div
        className="balance-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="balance-header">
          <div className="balance-icon">
            <WalletIcon size={24} />
          </div>
          <span className="balance-label">Available Balance</span>
        </div>
        <div className="balance-amount">
          <IndianRupee size={32} />
          <span>{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="balance-actions">
          <motion.button
            className="action-btn add"
            onClick={() => setShowAddModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={20} />
            Add Money
          </motion.button>
          <motion.button
            className="action-btn withdraw"
            onClick={() => setShowWithdrawModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Minus size={20} />
            Withdraw
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon credit">
            <ArrowDownLeft size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Credits</span>
            <span className="stat-value">₹{stats.totalCredit.toLocaleString('en-IN')}</span>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="stat-icon debit">
            <ArrowUpRight size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Debits</span>
            <span className="stat-value">₹{stats.totalDebit.toLocaleString('en-IN')}</span>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon transactions">
            <RefreshCw size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">This Month</span>
            <span className="stat-value">{stats.thisMonth} Transactions</span>
          </div>
        </motion.div>
      </div>

      {/* Transactions Section */}
      <div className="transactions-section">
        <div className="section-header">
          <h3>Transaction History</h3>
          <div className="header-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-tabs">
              {['all', 'credit', 'debit'].map(type => (
                <button
                  key={type}
                  className={`filter-tab ${filterType === type ? 'active' : ''}`}
                  onClick={() => setFilterType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="transactions-list">
          <AnimatePresence>
            {filteredTransactions.length === 0 ? (
              <motion.div
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Clock size={48} />
                <p>No transactions found</p>
              </motion.div>
            ) : (
              filteredTransactions.map((txn, index) => (
                <motion.div
                  key={txn.id}
                  className={`transaction-item ${txn.type}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="txn-icon">
                    {txn.type === 'credit' ? (
                      <ArrowDownLeft size={20} />
                    ) : (
                      <ArrowUpRight size={20} />
                    )}
                  </div>
                  <div className="txn-details">
                    <span className="txn-description">{txn.description}</span>
                    <span className="txn-meta">
                      {txn.id} • {new Date(txn.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="txn-amount">
                    <span className={txn.type}>
                      {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                    </span><span className="txn-status">
                      <CheckCircle size={14} />
                      {txn.status}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="pagination">
          <div className="page-info">
            Page {page + 1} of {Math.max(totalPages, 1)} • {totalElements} transactions
          </div>
          <div className="page-actions">
            <button
              className="page-btn"
              onClick={() => setPage(Math.max(page - 1, 0))}
              disabled={page <= 0}
            >
              Prev
            </button>
            <button
              className="page-btn"
              onClick={() => setPage(page + 1)}
              disabled={totalPages === 0 || page >= totalPages - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Money Modal */}
      <AnimatePresence>
        {showAddModal && (
          <MoneyModal
            type="add"
            onClose={() => setShowAddModal(false)}
            onSubmit={(amount, method) => {
              addMoney(amount, method);
              setShowAddModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <MoneyModal
            type="withdraw"
            balance={balance}
            onClose={() => setShowWithdrawModal(false)}
            onSubmit={(amount, method) => {
              withdrawMoney(amount, method);
              setShowWithdrawModal(false);
            }}
          />
        )}
      </AnimatePresence>

      <style>{`
        .wallet-container {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .balance-card {
          background: linear-gradient(135deg, #0B1E3C 0%, #102A4D 100%);
          border-radius: 20px;
          padding: 32px;
          color: white;
        }

        .balance-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .balance-icon {
          width: 48px;
          height: 48px;
          background: rgba(45, 190, 96, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2DBE60;
        }

        .balance-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .balance-amount {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 28px;
        }

        .balance-actions {
          display: flex;
          gap: 16px;
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 24px;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn.add {
          background: #2DBE60;
          color: white;
        }

        .action-btn.add:hover {
          background: #22a652;
        }

        .action-btn.withdraw {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .action-btn.withdraw:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.credit {
          background: rgba(16, 185, 129, 0.1);
          color: #10B981;
        }

        .stat-icon.debit {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
        }

        .stat-icon.transactions {
          background: rgba(59, 130, 246, 0.1);
          color: #3B82F6;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .stat-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .transactions-section {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 24px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .section-header h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
        }

        .search-box input {
          border: none;
          background: transparent;
          color: var(--text-primary);
          font-size: 0.875rem;
          outline: none;
          width: 180px;
        }

        .search-box svg {
          color: var(--text-muted);
        }

        .filter-tabs {
          display: flex;
          gap: 4px;
          padding: 4px;
          background: var(--bg-secondary);
          border-radius: 10px;
        }

        .filter-tab {
          padding: 8px 16px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-tab.active {
          background: #2DBE60;
          color: white;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .page-actions {
          display: flex;
          gap: 8px;
        }

        .page-btn {
          padding: 8px 14px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .transaction-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: var(--bg-secondary);
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .transaction-item:hover {
          background: var(--bg-tertiary);
        }

        .txn-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;}

        .transaction-item.credit .txn-icon {
          background: rgba(16, 185, 129, 0.1);
          color: #10B981;
        }

        .transaction-item.debit .txn-icon {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
        }

        .txn-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .txn-description {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .txn-meta {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .txn-amount {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .txn-amount span.credit {
          font-size: 1rem;
          font-weight: 600;
          color: #10B981;
        }

        .txn-amount span.debit {
          font-size: 1rem;
          font-weight: 600;
          color: #EF4444;
        }

        .txn-status {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: #10B981;
          text-transform: capitalize;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 48px;
          color: var(--text-muted);
        }

        .wallet-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 16px;
          color: var(--text-secondary);
        }

        /* Light mode optimization */
        [data-theme="light"] .balance-card {
          background: #ffffff;
          border: 1px solid var(--border-color);
          box-shadow: 0 10px 24px rgba(11, 30, 60, 0.08);
          color: var(--text-primary);
        }

        [data-theme="light"] .balance-label {
          color: var(--text-secondary);
        }

        [data-theme="light"] .action-btn.withdraw {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border-color: var(--border-color);
        }

        [data-theme="light"] .action-btn.withdraw:hover {
          background: var(--bg-tertiary);
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .header-actions {
            flex-direction: column;
            width: 100%;
          }

          .search-box {
            width: 100%;
          }

          .search-box input {
            width: 100%;
          }

          .balance-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

// Money Modal Component
function MoneyModal({ type, balance = 0, onClose, onSubmit }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  const methods = [
    { id: 'bank', name: 'Bank Transfer', icon: Building2 },
    { id: 'upi', name: 'UPI', icon: RefreshCw },
    { id: 'card', name: 'Debit Card', icon: CreditCard }
  ];

  const handleSubmit = async () => {
    const numAmount = parseFloat(amount);

    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (type === 'withdraw' && numAmount > balance) {
      setError('Insufficient balance');
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      await onSubmit(numAmount, methods.find(m => m.id === method)?.name);
    } catch (error) {
      console.error('Wallet action failed:', error);
    }
  };

  return (
    <>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="modal-container"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <div className="modal-header">
          <h3>{type === 'add' ? 'Add Money' : 'Withdraw Money'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {type === 'withdraw' && (
            <div className="available-balance">
              Available: ₹{balance.toLocaleString('en-IN')}
            </div>
          )}

          <div className="amount-input-wrapper">
            <span className="currency">₹</span>
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              className="amount-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="quick-amounts">
            {quickAmounts.map(amt => (
              <button
                key={amt}
                className={`quick-btn ${amount === amt.toString() ? 'active' : ''}`}
                onClick={() => setAmount(amt.toString())}
              >
                ₹{amt.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="payment-methods">
            <label className="methods-label">Select Method</label>
            <div className="methods-grid">
              {methods.map(m => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    className={`method-btn ${method === m.id ? 'active' : ''}`}
                    onClick={() => setMethod(m.id)}
                  >
                    <Icon size={20} />
                    <span>{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <motion.button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={isProcessing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isProcessing ? (
              <>
                <span className="spinner" />
                Processing...
              </>
            ) : (
              <>
                {type === 'add' ? <Plus size={18} /> : <Minus size={18} />}
                {type === 'add' ? 'Add Money' : 'Withdraw'}
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
        }

        .modal-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 480px;
          background: var(--card-bg);
          border-radius: 20px;
          z-index: 1001;
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
        }

        .modal-header h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .close-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: var(--bg-secondary);
          border-radius: 8px;
          font-size: 1.5rem;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-body {
          padding: 24px;
        }

        .available-balance {
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 20px;
        }

        .amount-input-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .currency {
          font-size: 2rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .amount-input {
          font-size: 3rem;
          font-weight: 700;
          color: var(--text-primary);
          background: transparent;
          border: none;
          text-align: center;
          width: 200px;
          outline: none;
        }

        .amount-input::placeholder {
          color: var(--text-muted);
        }

        .error-message {
          text-align: center;
          font-size: 0.875rem;
          color: #EF4444;
          margin-bottom: 16px;
        }

        .quick-amounts {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .quick-btn {
          padding: 8px 16px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          border-radius: 8px;
          font-size: 0.875rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quick-btn.active,
        .quick-btn:hover {
          background: #2DBE60;
          border-color: #2DBE60;
          color: white;
        }

        .payment-methods {
          margin-top: 24px;
        }

        .methods-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-muted);
          margin-bottom: 12px;
        }

        .methods-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .method-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .method-btn span {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .method-btn.active {
          border-color: #2DBE60;
          background: rgba(45, 190, 96, 0.1);
        }

        .method-btn.active svg,
        .method-btn.active span {
          color: #2DBE60;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid var(--border-color);
        }

        .btn-cancel {
          flex: 1;
          padding: 14px;
          border: 1px solid var(--border-color);
          background: transparent;
          color: var(--text-secondary);
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-submit {
          flex: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          border: none;
          background: #2DBE60;
          color: white;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;}

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
