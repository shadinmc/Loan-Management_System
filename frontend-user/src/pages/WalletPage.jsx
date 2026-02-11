import { useState, useEffect } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, History, CreditCard, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import Input from '../components/Input';

export default function WalletPage() {
  const [balance, setBalance] = useState(25000);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'credit', amount: 10000, description: 'Added to wallet', date: '2024-01-15', status: 'completed' },
    { id: 2, type: 'debit', amount: 5000, description: 'EMI Payment - Personal Loan', date: '2024-01-14', status: 'completed' },
    { id: 3, type: 'credit', amount: 15000, description: 'Loan Disbursement', date: '2024-01-10', status: 'completed' },
    { id: 4, type: 'debit', amount: 2500, description: 'EMI Payment - Vehicle Loan', date: '2024-01-05', status: 'completed' },
    { id: 5, type: 'credit', amount: 7500, description: 'Refund', date: '2024-01-02', status: 'completed' },
  ]);

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleAddMoney = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newTransaction = {
      id: Date.now(),
      type: 'credit',
      amount: Number(amount),
      description: 'Added to wallet',
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setBalance(prev => prev + Number(amount));
    setAmount('');
    setShowAddMoney(false);
    setIsLoading(false);
  };

  return (
    <div className="wallet-page">
      <div className="wallet-container">
        {/* Balance Card */}
        <motion.div
          className="balance-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="balance-header">
            <div className="wallet-icon">
              <Wallet size={28} />
            </div>
            <span className="balance-label">Available Balance</span>
          </div>
          <div className="balance-amount">
            <span className="currency">₹</span>
            <span className="amount">{balance.toLocaleString('en-IN')}</span>
          </div>
          <div className="balance-actions">
            <Button onClick={() => setShowAddMoney(true)}>
              <Plus size={18} />
              Add Money
            </Button>
            <Button variant="secondary">
              <ArrowUpRight size={18} />
              Transfer
            </Button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="quick-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="action-card">
            <div className="action-icon credit">
              <ArrowDownLeft size={24} />
            </div>
            <div className="action-info">
              <span className="action-label">Total Credits</span>
              <span className="action-value">₹32,500</span>
            </div>
          </div>
          <div className="action-card">
            <div className="action-icon debit">
              <ArrowUpRight size={24} />
            </div>
            <div className="action-info">
              <span className="action-label">Total Debits</span>
              <span className="action-value">₹7,500</span>
            </div>
          </div>
          <div className="action-card">
            <div className="action-icon pending">
              <RefreshCw size={24} />
            </div>
            <div className="action-info">
              <span className="action-label">Pending</span>
              <span className="action-value">₹0</span>
            </div>
          </div>
        </motion.div>

        {/* Transactions */}
        <motion.div
          className="transactions-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="section-header">
            <h2>
              <History size={20} />
              Recent Transactions
            </h2><button className="view-all">View All</button>
          </div>

          <div className="transactions-list">
            {transactions.map((txn, idx) => (
              <motion.div
                key={txn.id}
                className="transaction-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className={`txn-icon ${txn.type}`}>
                  {txn.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div className="txn-details">
                  <span className="txn-description">{txn.description}</span>
                  <span className="txn-date">{new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className={`txn-amount ${txn.type}`}>
                  {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Add Money Modal */}
      <AnimatePresence>
        {showAddMoney && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddMoney(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3>Add Money to Wallet</h3>
              <Input
                label="Enter Amount"
                name="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="₹ 0"
              />
              <div className="quick-amounts">
                {quickAmounts.map(amt => (
                  <button
                    key={amt}
                    className="quick-amount-btn"
                    onClick={() => setAmount(amt.toString())}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              <div className="modal-actions">
                <Button variant="secondary" onClick={() => setShowAddMoney(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMoney} loading={isLoading}>
                  Add ₹{amount || '0'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .wallet-page {
          min-height: 100vh;
          padding: 100px 24px 60px;
          background: var(--bg-primary);
        }

        .wallet-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .balance-card {
          background: linear-gradient(135deg, #0B1E3C 0%, #102A4D 100%);
          border-radius: 24px;
          padding: 32px;
          color: white;
          margin-bottom: 24px;
          box-shadow: 0 20px 60px rgba(11, 30, 60, 0.4);
        }

        .balance-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .wallet-icon {
          width: 52px;
          height: 52px;
          background: rgba(45, 190, 96, 0.2);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2DBE60;
        }

        .balance-label {
          font-size: 0.9375rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .balance-amount {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 28px;
        }

        .currency {
          font-size: 1.5rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
        }

        .amount {
          font-size: 3rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .balance-actions {
          display: flex;
          gap: 12px;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .action-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s ease;
        }

        .action-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(16, 42, 77, 0.1);
        }

        .action-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-icon.credit {
          background: rgba(45, 190, 96, 0.1);
          color: #2DBE60;
        }

        .action-icon.debit {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
        }

        .action-icon.pending {
          background: rgba(251, 191, 36, 0.1);
          color: #F59E0B;
        }

        .action-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .action-label {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .action-value {
          font-size: 1.25rem;
          font-weight: 700;
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
          margin-bottom: 20px;
        }

        .section-header h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .view-all {
          background: none;
          border: none;
          color: #2DBE60;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
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
          width: 40px;
          height: 40px;
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

        .txn-details {
          flex: 1;display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .txn-description {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .txn-date {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .txn-amount {
          font-size: 1rem;
          font-weight: 600;
        }

        .txn-amount.credit {
          color: #2DBE60;
        }

        .txn-amount.debit {
          color: #EF4444;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(11, 30, 60, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 24px;
        }

        .modal-content {
          background: var(--card-bg);
          border-radius: 20px;
          padding: 32px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
        }

        .modal-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 24px;
        }

        .quick-amounts {
          display: flex;
          gap: 10px;
          margin: 16px 0 24px;
        }

        .quick-amount-btn {
          flex: 1;
          padding: 10px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quick-amount-btn:hover {
          border-color: #2DBE60;
          background: rgba(45, 190, 96, 0.1);
          color: #2DBE60;
        }

        .modal-actions {
          display: flex;
          gap: 12px;}

        .modal-actions button {
          flex: 1;}

        @media (max-width: 768px) {
          .quick-actions {
            grid-template-columns: 1fr;
          }

          .balance-amount .amount {
            font-size: 2.25rem;
          }

          .balance-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
